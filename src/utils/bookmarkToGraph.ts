import type { BookmarkNode } from '../mockData'

export interface GraphNode {
  id: string
  size: number
  group?: number
  type: 'folder' | 'bookmark'
  title: string
  url?: string
}

export interface GraphLink {
  source: string
  target: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

/**
 * Convert bookmark tree to graph data structure
 * Folders are larger nodes, bookmarks are smaller nodes
 * Links connect parent folders to their children
 */
export function bookmarksToGraphData(bookmarks: BookmarkNode[]): GraphData {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []
  const tagColorMap = new Map<string, number>()
  let nextGroup = 1

  function traverse(node: BookmarkNode, parentId?: string, depth: number = 0) {
    // Determine node group based on tags or folder
    let group: number | undefined
    
    if (node.type === 'bookmark' && node.tags && node.tags.length > 0) {
      // Group bookmarks by their first tag
      const primaryTag = node.tags[0]
      if (!tagColorMap.has(primaryTag)) {
        tagColorMap.set(primaryTag, nextGroup++)
      }
      group = tagColorMap.get(primaryTag)
    } else if (node.type === 'folder') {
      // Folders get their own group based on depth
      group = depth + 10 // Offset to not conflict with tag groups
    }

    // Determine node size
    // Folders are larger, especially root folders
    // Bookmarks are smaller
    const size = node.type === 'folder' 
      ? (depth === 0 ? 45 : 35)  // Root folders bigger
      : 25 // Bookmarks are smaller

    // Add node
    nodes.push({
      id: node.id,
      size,
      group,
      type: node.type,
      title: node.title,
      url: node.url,
    })

    // Create link from parent to this node
    if (parentId) {
      links.push({
        source: parentId,
        target: node.id,
      })
    }

    // Recursively process children
    if (node.children) {
      node.children.forEach(child => traverse(child, node.id, depth + 1))
    }
  }

  // Process all root nodes
  bookmarks.forEach(root => traverse(root, undefined, 0))

  return { nodes, links }
}
