import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { type BookmarkNode } from './mockData'

type SidebarProps = {
    nodes: BookmarkNode[]
    currentFolderId: string
    onSelectFolder: (folderId: string) => void
    theme?: 'galaxy' | 'ocean'
}

export function Sidebar({ nodes, currentFolderId, onSelectFolder, theme = 'galaxy' }: SidebarProps) {
    const isOcean = theme === 'ocean'
    const surface = isOcean
        ? 'border-sky-900/15 bg-white/70 text-[#0b2348] shadow-[0_18px_48px_rgba(12,74,110,0.12)]'
        : 'border-white/5 bg-white/[0.02] text-white'
    return (
        <aside className={`relative z-20 hidden w-64 flex-col gap-2 border-r p-4 backdrop-blur-xl md:flex ${surface}`}>
            <div className="flex flex-col gap-1">
                {nodes.map((node) => (
                    <FolderItem
                        key={node.id}
                        node={node}
                        currentFolderId={currentFolderId}
                        onSelectFolder={onSelectFolder}
                        depth={0}
                        theme={theme}
                    />
                ))}
            </div>
        </aside>
    )
}

function FolderItem({
    node,
    currentFolderId,
    onSelectFolder,
    depth,
    theme,
}: {
    node: BookmarkNode
    currentFolderId: string
    onSelectFolder: (id: string) => void
    depth: number
    theme: 'galaxy' | 'ocean'
}) {
    const [isOpen, setIsOpen] = useState(true)
    const isSelected = node.id === currentFolderId
    const hasChildren = node.children && node.children.some((c) => c.type === 'folder')
    const isOcean = theme === 'ocean'

    if (node.type !== 'folder') return null

    return (
        <div className="flex flex-col">
            <button
                onClick={() => {
                    onSelectFolder(node.id)
                    if (hasChildren) setIsOpen(!isOpen)
                }}
                className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${isSelected
                    ? isOcean
                        ? 'bg-sky-100 text-sky-900'
                        : 'bg-indigo-500/20 text-indigo-200'
                    : isOcean
                        ? 'text-slate-700 hover:bg-white/70 hover:text-sky-900'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
                <span className={`transition-transform ${isOpen ? 'rotate-90' : ''} ${!hasChildren && 'invisible'}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={isSelected ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isSelected ? (isOcean ? 'text-sky-700' : 'text-indigo-400') : isOcean ? 'text-slate-500 group-hover:text-sky-800' : 'text-slate-500 group-hover:text-slate-300'}
                >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span className="truncate font-normal">{node.title}</span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {node.children?.map((child) => (
                            <FolderItem
                                key={child.id}
                                node={child}
                                currentFolderId={currentFolderId}
                                onSelectFolder={onSelectFolder}
                                depth={depth + 1}
                                theme={theme}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
