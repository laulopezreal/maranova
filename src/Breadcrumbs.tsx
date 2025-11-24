import { type BookmarkNode } from './mockData'

type BreadcrumbsProps = {
    path: BookmarkNode[]
    onSelectFolder: (folderId: string) => void
}

export function Breadcrumbs({ path, onSelectFolder }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-1 text-sm text-slate-400">
            {path.map((node, index) => {
                const isLast = index === path.length - 1
                return (
                    <div key={node.id} className="flex items-center gap-1">
                        {index > 0 && <span className="text-slate-600">/</span>}
                        <button
                            onClick={() => onSelectFolder(node.id)}
                            disabled={isLast}
                            className={`transition-colors ${isLast
                                    ? 'font-medium text-white pointer-events-none'
                                    : 'hover:text-indigo-300 hover:underline'
                                }`}
                        >
                            {node.title}
                        </button>
                    </div>
                )
            })}
        </nav>
    )
}
