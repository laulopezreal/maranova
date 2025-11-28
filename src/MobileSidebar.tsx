import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { type BookmarkNode } from './mockData'

type MobileSidebarProps = {
    nodes: BookmarkNode[]
    currentFolderId: string
    onSelectFolder: (folderId: string) => void
    isOpen: boolean
    onClose: () => void
}

export function MobileSidebar({ nodes, currentFolderId, onSelectFolder, isOpen, onClose }: MobileSidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    />

                    {/* Drawer */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 z-50 h-full w-72 border-r border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-4 backdrop-blur-xl md:hidden"
                    >
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </span>
                                <span className="text-lg font-semibold text-white">Folders</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Folder Tree */}
                        <div className="flex flex-col gap-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                            {nodes.map((node) => (
                                <FolderItem
                                    key={node.id}
                                    node={node}
                                    currentFolderId={currentFolderId}
                                    onSelectFolder={(id) => {
                                        onSelectFolder(id)
                                        onClose()
                                    }}
                                    depth={0}
                                />
                            ))}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}

function FolderItem({
    node,
    currentFolderId,
    onSelectFolder,
    depth,
}: {
    node: BookmarkNode
    currentFolderId: string
    onSelectFolder: (id: string) => void
    depth: number
}) {
    const [isOpen, setIsOpen] = useState(true)
    const isSelected = node.id === currentFolderId
    const hasChildren = node.children && node.children.some((c) => c.type === 'folder')

    if (node.type !== 'folder') return null

    return (
        <div className="flex flex-col">
            <button
                onClick={() => {
                    onSelectFolder(node.id)
                    if (hasChildren) setIsOpen(!isOpen)
                }}
                className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${isSelected
                        ? 'bg-indigo-500/20 text-indigo-200'
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
                    className={isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}
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
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
