# Graph View

An interactive force-directed graph visualization inspired by [this CodePen](https://codepen.io/tfrere/pen/xxNPRWo).

## Features

✨ **Interactive Force-Directed Layout**: Nodes automatically organize themselves using D3's force simulation
- Nodes repel each other to avoid overlap
- Connected nodes are pulled together via links
- The graph settles into a stable, visually pleasing layout

🎯 **Drag & Drop**: Click and drag any node to reposition it
- Dragging a node temporarily fixes its position
- The simulation adjusts other nodes around it
- Release to let it float freely again

🔍 **Zoom & Pan**: Scroll to zoom in/out, drag the background to pan around

🎨 **Visual Design**:
- Purple gradient background matching the aesthetic of the reference
- Colorful nodes with glow effects on hover
- Semi-transparent connecting lines
- Node size reflects importance/hierarchy
- Color groups for categorization

💫 **Smooth Animations**:
- Hover effects with scale and glow
- Smooth transitions on interaction
- Physics-based movement

## Technical Implementation

### Stack
- **React 19** + TypeScript for the component
- **D3.js v7** for force simulation, drag behavior, and zoom
- **Tailwind CSS** for styling

### Key Components

**GraphView.tsx** - Main component with:
- `d3.forceSimulation` for physics
- `d3.forceLink` for connections between nodes
- `d3.forceManyBody` for repulsion
- `d3.forceCenter` for centering
- `d3.forceCollide` for collision detection
- `d3.drag` for drag interactions
- `d3.zoom` for zoom/pan controls

### Data Structure

```typescript
interface Node {
  id: string;          // Display name
  size: number;        // Radius in pixels
  group?: number;      // Color group
}

interface Link {
  source: string;      // Source node ID
  target: string;      // Target node ID
  value?: number;      // Optional: influences link strength
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}
```

## Usage

### Basic Usage
```tsx
import GraphView from './GraphView';

function App() {
  return (
    <div className="w-screen h-screen">
      <GraphView />
    </div>
  );
}
```

### With Custom Data
```tsx
const customData = {
  nodes: [
    { id: "Web Development", size: 45, group: 1 },
    { id: "React", size: 30, group: 1 },
    { id: "Vue", size: 30, group: 1 },
  ],
  links: [
    { source: "Web Development", target: "React" },
    { source: "Web Development", target: "Vue" },
  ]
};

<GraphView data={customData} width={1200} height={800} />
```

## Future Enhancements

- [ ] Click nodes to view bookmark details
- [ ] Filter by category/tag
- [ ] Search to highlight specific nodes
- [ ] Export graph as SVG/PNG
- [ ] Different layout algorithms (hierarchical, radial, etc.)
- [ ] Animated node additions/removals
- [ ] Minimap for navigation
- [ ] Clustering for large datasets

## Integration with Bookmarks

The graph view is perfect for visualizing bookmark hierarchies:
- **Folders** → Large parent nodes
- **Bookmarks** → Smaller child nodes
- **Tags** → Cross-cutting connections
- **Size** → Visit frequency or importance
- **Color** → Category or domain

## Controls

| Action | Result |
|--------|--------|
| **Click + Drag Node** | Reposition node |
| **Scroll Wheel** | Zoom in/out |
| **Click + Drag Background** | Pan around |
| **Hover Node** | See node name + glow effect |

## Performance

- Handles ~100 nodes smoothly
- For larger datasets (500+), consider:
  - Clustering similar nodes
  - Virtual rendering
  - Simplified visuals
  - Static layout pre-computation
