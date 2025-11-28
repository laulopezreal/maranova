import { type BookmarkNode } from './mockData'

type BreadcrumbsProps = {
    path: BookmarkNode[]
    onSelectFolder: (folderId: string) => void
    theme: 'galaxy' | 'ocean'
}

export function Breadcrumbs({ path, onSelectFolder, theme }: BreadcrumbsProps) {
    const isOcean = theme === 'ocean'
    const baseColor = isOcean ? 'text-slate-600' : 'text-slate-400'
    const dividerColor = isOcean ? 'text-slate-400' : 'text-slate-600'
    const activeColor = isOcean ? 'text-[#0b2348]' : 'text-white'
    const hoverColor = isOcean ? 'hover:text-sky-800' : 'hover:text-indigo-300'

    return (
        <nav className={`flex items-center gap-1 text-sm ${baseColor}`}>
            {path.map((node, index) => {
                const isLast = index === path.length - 1
                return (
                    <div key={node.id} className="flex items-center gap-1">
                        {index > 0 && <span className={dividerColor}>/</span>}
                        <button
                            onClick={() => onSelectFolder(node.id)}
                            disabled={isLast}
                            className={`transition-colors ${isLast
                                    ? `pointer-events-none font-medium ${activeColor}`
                                    : `${hoverColor} hover:underline`
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
