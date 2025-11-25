import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  type ReactNode,
} from 'react'

type ProviderId = 'google' | 'github' | 'apple'

export type UserProfile = {
  id: string
  name: string
  email: string
  provider: ProviderId
  accent: string
  avatarColor: string
}

type AuthStatus = 'idle' | 'authenticating'

type AuthContextValue = {
  user: UserProfile | null
  status: AuthStatus
  login: (provider: ProviderId) => Promise<void>
  logout: () => Promise<void>
}

type SessionPayload = {
  user: UserProfile
  accessToken: string
  refreshToken: string
}

const STORAGE_KEY = 'maranova:session'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function hydrateSession(): SessionPayload | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as SessionPayload
  } catch {
    return null
  }
}

async function sha256Base64(input: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(digest)
  const str = String.fromCharCode(...bytes)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function generateVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(() => hydrateSession())
  const [status, setStatus] = useState<AuthStatus>('idle')

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  const login = useCallback(async (provider: ProviderId) => {
    if (status === 'authenticating') return
    setStatus('authenticating')
    const verifier = generateVerifier()
    const challenge = await sha256Base64(verifier)

    let popup: Window | null = null

    try {
      const startResponse = await fetch(`/api/auth/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, codeChallenge: challenge }),
      })

      if (!startResponse.ok) {
        throw new Error('Failed to start auth')
      }

      const { authorizationUrl, state } = (await startResponse.json()) as {
        authorizationUrl: string
        state?: string
      }

      popup = window.open(authorizationUrl, '_blank', 'width=500,height=700')
      if (!popup) {
        throw new Error('Popup blocked')
      }

      const tokenData = await waitForAuthCallback({ verifier, state, provider })
      const profile = await fetchProfile(tokenData.accessToken)

      const newSession: SessionPayload = {
        user: profile,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
      }
      setSession(newSession)
    } finally {
      setStatus('idle')
      if (popup) popup.close()
    }
  }, [status])

  const logout = useCallback(async () => {
    if (!session) return
    await fetch(`/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }).catch((error) => console.error('Logout failed:', error))
    setSession(null)
  }, [session])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      status,
      login,
      logout,
    }),
    [session, status, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

async function waitForAuthCallback({
  verifier,
  state,
  provider,
}: {
  verifier: string
  state?: string
  provider: ProviderId
}) {
  return new Promise<{ accessToken: string; refreshToken: string }>((resolve, reject) => {
    const channel = new BroadcastChannel('maranova:auth')

    const timer = setTimeout(() => {
      channel.close()
      reject(new Error('Auth timeout'))
    }, 120000)

    channel.onmessage = async (event) => {
      if (!event?.data) return
      if (event.data.type === 'auth:callback') {
        try {
          const tokenResponse = await fetch(`/api/auth/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: event.data.code,
              provider: event.data.provider || provider,
              codeVerifier: verifier,
              state: event.data.state || state,
            }),
          })
          if (!tokenResponse.ok) throw new Error('Token exchange failed')
          const { accessToken, refreshToken } = (await tokenResponse.json()) as {
            accessToken: string
            refreshToken: string
          }
          clearTimeout(timer)
          channel.close()
          resolve({ accessToken, refreshToken })
        } catch (error) {
          clearTimeout(timer)
          channel.close()
          reject(error)
        }
      }
    }
  })
}

async function fetchProfile(accessToken: string): Promise<UserProfile> {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to load profile')
  return (await res.json()) as UserProfile
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
