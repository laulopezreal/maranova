import { type Page } from './App'

export const pageContent = {
    about: {
        heading: 'We map calm orbits for your web',
        subheading:
            'Maranova is a small studio building a gentler command center for the curious. Galaxy + Ocean are our twin moods of focus.',
        blocks: [
            {
                title: 'Why Maranova',
                body: 'Bookmarks should feel alive yet serene. We blend tactile motion, glass, and respectful defaults to keep links discoverable without noise.',
            },
            {
                title: 'How we build',
                body: 'Tiny team, fast cycles, human-support first. AI assists, but the taste and care are human. Shipping weekly.',
            },
            {
                title: 'Where we are',
                body: 'Floating between shoreline and low orbit—remote-first with timezones spanning PST to CET.',
            },
        ],
    },
    docs: {
        heading: 'Docs: glide from capture to recall',
        subheading:
            'A quick sketch of how Maranova works today. Full docs live soon—this is the essentials to get moving.',
        blocks: [
            {
                title: 'Keyboard palette',
                body: 'Hit ⌘K to search, filter by tag, and launch quick actions. Arrows navigate results, Enter opens.',
            },
            {
                title: 'Spaces + tags',
                body: 'Group links by theme. Tags stay lightweight; Spaces give you focused dashboards for a project or vibe.',
            },
            {
                title: 'Sync + import',
                body: 'Import from the browser or a .html export. Automatic dedupe and hostname clustering to keep things tidy.',
            },
        ],
    },
    terms: {
        heading: 'Terms that stay human-readable',
        subheading:
            'Privacy, portability, and no dark patterns. This is a mock of the commitments we hold ourselves to.',
        blocks: [
            {
                title: 'Your data, your exit',
                body: 'Export anytime. No surprises. If we change retention, we tell you in advance.',
            },
            {
                title: 'Security',
                body: 'Encryption in transit and at rest. Access tokens scoped and rotated. Minimal logs.',
            },
            {
                title: 'No manipulative UI',
                body: 'No nagging notifications, no “confirmshaming.” You can opt out of emails and suggestions easily.',
            },
        ],
    },
} satisfies Record<Exclude<Page, 'home'>, { heading: string; subheading: string; blocks: { title: string; body: string }[] }>

export const infoSections = [
    {
        id: 'about',
        title: 'About Maranova',
        blurb:
            'We are a tiny crew of cartographers of calm—building a place where every saved link feels like a star or a bubble finding its orbit.',
        highlights: ['Based between shoreline + low orbit', 'Human-support first, AI-assisted', 'Designed for the curious and the calm'],
    },
    {
        id: 'docs',
        title: 'Docs',
        blurb:
            'Quick-start guides, keyboard palette tips, and sync notes so you can glide from curiosity to capture without friction.',
        highlights: ['Getting started in 3 minutes', 'Keyboard palette + ⌘K actions', 'Spaces, tags, and gentle automations'],
    },
    {
        id: 'terms',
        title: 'Terms of Service',
        blurb:
            'Plain-language terms anchored on privacy, portability, and opt-in discovery. No dark patterns, no surprise locks.',
        highlights: ['Own your data; export anytime', 'Encryption in transit + at rest', 'Transparent change log for policies'],
    },
]
