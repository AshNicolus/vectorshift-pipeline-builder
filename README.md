# VectorShift — Pipeline Builder

A visual, node-based pipeline builder. Drag nodes from the palette onto a canvas,
wire them together, and submit the graph to a FastAPI backend that validates it and
reports basic statistics (including whether the pipeline is a valid DAG).

Built with **React + ReactFlow + Zustand** on the frontend and **FastAPI** on the backend.

---

## Highlights

- **Config-driven node abstraction** — every node is described by a small config
  (title, fields, handles); a single `BaseNode` renders the chrome, binds state, and
  lays out connection points. Adding a new node type takes a few lines.
- **9 node types** — Input, Output, Text, LLM, Math, Filter, Conditional, API Request,
  and a handle-less Note.
- **Smart Text node** — auto-resizes to its content and turns `{{ variable }}` patterns
  into live input handles.
- **Editable graph** — delete nodes (and their edges), re-route connections, and delete
  connections.
- **Backend analysis** — submit the pipeline to get node/edge counts and a cycle check
  (DAG validation via Kahn's algorithm).
- **Cohesive UI** — a clean, modern design system applied across the toolbar, nodes,
  canvas, and controls.

---

## Project structure

```
vector_shift/
├── backend/
│   ├── main.py            # FastAPI app: /pipelines/parse + DAG check
│   └── requirements.txt
└── frontend/
    ├── public/
    └── src/
        ├── App.js             # App shell (toolbar + canvas + submit)
        ├── toolbar.js         # Draggable node palette (grouped)
        ├── draggableNode.js   # A single palette chip
        ├── ui.js              # ReactFlow canvas + drag/drop + edge editing
        ├── store.js           # Zustand store (nodes, edges, actions)
        ├── submit.js          # Submit button → backend integration
        ├── index.css          # Design system
        └── nodes/
            ├── BaseNode.js        # The reusable node abstraction
            ├── inputNode.js
            ├── outputNode.js
            ├── llmNode.js
            ├── textNode.js        # Dynamic variables + auto-resize
            ├── mathNode.js
            ├── filterNode.js
            ├── conditionalNode.js
            ├── apiNode.js
            └── noteNode.js
```

---

## Getting started

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+

### 1. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`.

> The frontend calls the backend at `http://localhost:8000` by default. Override it with
> a `REACT_APP_API_BASE` environment variable if needed.

---

## How to use

1. **Drag** nodes from the toolbar onto the canvas.
2. **Connect** nodes by dragging from a node's right (source) handle to another node's
   left (target) handle.
3. **Configure** nodes by editing their fields.
4. **Edit the graph:**
   - Delete a node with the **✕** in its header (or select it and press `Delete`).
   - Re-route a connection by dragging an edge's endpoint to a different handle.
   - Delete a connection by selecting it and pressing `Delete`, or by dragging its
     endpoint into empty space.
5. **Submit** to analyze the pipeline.

### Example: a small LLM pipeline

```
[Input] ──▶ [Text: "Greet {{ name }}"] ──▶ [LLM] ──▶ [Output]
```

Typing `{{ name }}` in the Text node creates a `name` input handle on its left, which
you can wire the Input node into. Click **Submit Pipeline** to see:

```
• Nodes: 4
• Edges: 3
• Valid DAG: Yes ✅
```

If you wire the graph into a cycle, the backend reports `Valid DAG: No ❌`.

---

## Architecture notes

### The node abstraction (`BaseNode`)

The core design decision is that nodes are **data, not bespoke components**. `BaseNode`
accepts:

- `title` and `accent` — header label and color.
- `fields` — an array of `{ key, label, type, options, default }`. Supported types are
  `text`, `select`, and `textarea`. Each field is bound to the Zustand store via
  `updateNodeField`, with a `default` that can be a function of the node id.
- `handles` — an array of `{ type, position, id }`. Handles on the same side are
  auto-distributed vertically, so multi-input/output nodes stay balanced.
- `children` — optional custom content for nodes that need more than fields.

A typical node is therefore just configuration:

```jsx
export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Filter"
    accent="#14b8a6"
    fields={[{ key: 'condition', label: 'Keep where', type: 'text', default: 'item.active' }]}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-input` },
      { type: 'source', position: Position.Right, id: `${id}-output` },
    ]}
  />
);
```

The Text node layers two behaviors on top of `BaseNode`: it parses `{{ variable }}`
patterns (valid JS identifiers, deduped) into target handles — calling
`useUpdateNodeInternals` so ReactFlow repositions them live — and auto-resizes its
textarea to fit the content.

### State (`store.js`)

A single Zustand store holds `nodes`, `edges`, and `nodeIDs`, and exposes actions:
`addNode`, `removeNode`, `getNodeID`, `onNodesChange`, `onEdgesChange`, `onConnect`,
`onEdgeUpdate`, and `updateNodeField`. Field updates return new node objects (rather than
mutating in place) so React/ReactFlow reliably detect changes.

### Backend (`main.py`)

`POST /pipelines/parse` accepts `{ nodes, edges }`, validates it with Pydantic, and
returns:

```json
{ "num_nodes": 4, "num_edges": 3, "is_dag": true }
```

`is_dag` is computed with **Kahn's algorithm**: build an in-degree map, repeatedly remove
zero-in-degree nodes, and check that every node was visited. If any remain, the graph has
a cycle. CORS is enabled so the browser app can call the API directly.

---

## Tech stack

| Layer    | Tools                                   |
|----------|-----------------------------------------|
| Frontend | React, ReactFlow, Zustand, Create React App |
| Backend  | FastAPI, Pydantic, Uvicorn              |
