export type BookmarkNode = {
    id: string
    title: string
    url?: string
    favicon?: string
    tags?: string[]
    children?: BookmarkNode[]
    type: 'folder' | 'bookmark'
    dateAdded?: number
}

export const mockBookmarkTree: BookmarkNode[] = [
    {
        id: 'root-1',
        title: 'Bookmarks Bar',
        type: 'folder',
        children: [
            {
                id: 'f-1',
                title: 'Work',
                type: 'folder',
                children: [
                    {
                        id: 'b-1',
                        title: 'GitHub',
                        url: 'https://github.com',
                        type: 'bookmark',
                        favicon: 'https://github.com/favicon.ico',
                        tags: ['dev', 'code'],
                    },
                    {
                        id: 'b-2',
                        title: 'Figma',
                        url: 'https://figma.com',
                        type: 'bookmark',
                        favicon: 'https://static.figma.com/app/icon/1/favicon.ico',
                        tags: ['design', 'ui'],
                    },
                    {
                        id: 'f-1-1',
                        title: 'Resources',
                        type: 'folder',
                        children: [
                            {
                                id: 'b-3',
                                title: 'MDN Web Docs',
                                url: 'https://developer.mozilla.org',
                                type: 'bookmark',
                                favicon: 'https://developer.mozilla.org/favicon.ico',
                                tags: ['docs', 'web'],
                            },
                            {
                                id: 'b-4',
                                title: 'Tailwind CSS',
                                url: 'https://tailwindcss.com',
                                type: 'bookmark',
                                favicon: 'https://tailwindcss.com/favicon.ico',
                                tags: ['css', 'docs'],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'f-2',
                title: 'Personal',
                type: 'folder',
                children: [
                    {
                        id: 'b-5',
                        title: 'YouTube',
                        url: 'https://youtube.com',
                        type: 'bookmark',
                        favicon: 'https://www.youtube.com/favicon.ico',
                        tags: ['video', 'fun'],
                    },
                    {
                        id: 'b-6',
                        title: 'Reddit',
                        url: 'https://reddit.com',
                        type: 'bookmark',
                        favicon: 'https://www.reddit.com/favicon.ico',
                        tags: ['social', 'news'],
                    },
                ],
            },
            {
                id: 'b-7',
                title: 'Twitter',
                url: 'https://twitter.com',
                type: 'bookmark',
                favicon: 'https://abs.twimg.com/favicons/twitter.ico',
                tags: ['social'],
            },
        ],
    },
    {
        id: 'root-2',
        title: 'Other Bookmarks',
        type: 'folder',
        children: [
            {
                id: 'f-3',
                title: 'Recipes',
                type: 'folder',
                children: [
                    {
                        id: 'b-8',
                        title: 'Serious Eats',
                        url: 'https://seriouseats.com',
                        type: 'bookmark',
                        favicon: 'https://www.seriouseats.com/favicon.ico',
                        tags: ['food', 'cooking'],
                    },
                ],
            },
        ],
    },
]
