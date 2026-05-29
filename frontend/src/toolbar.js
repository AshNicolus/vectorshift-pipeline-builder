// toolbar.js

import { DraggableNode } from './draggableNode';

// Grouped so related nodes sit together in the palette.
const GROUPS = [
  {
    title: 'General',
    nodes: [
      { type: 'customInput', label: 'Input', accent: '#10b981' },
      { type: 'customOutput', label: 'Output', accent: '#f43f5e' },
      { type: 'text', label: 'Text', accent: '#0ea5e9' },
      { type: 'note', label: 'Note', accent: '#a3a3a3' },
    ],
  },
  {
    title: 'AI & Logic',
    nodes: [
      { type: 'llm', label: 'LLM', accent: '#8b5cf6' },
      { type: 'math', label: 'Math', accent: '#f59e0b' },
      { type: 'filter', label: 'Filter', accent: '#14b8a6' },
      { type: 'conditional', label: 'Conditional', accent: '#ec4899' },
      { type: 'api', label: 'API Request', accent: '#3b82f6' },
    ],
  },
];

export const PipelineToolbar = () => {
  return (
    <div className="vs-toolbar">
      <div className="vs-toolbar__brand">
        <span className="vs-toolbar__logo">◆</span>
        <span>VectorShift</span>
        <span className="vs-toolbar__sub">Pipeline Builder</span>
      </div>
      <div className="vs-toolbar__groups">
        {GROUPS.map((group) => (
          <div className="vs-toolbar__group" key={group.title}>
            <span className="vs-toolbar__group-title">{group.title}</span>
            <div className="vs-toolbar__nodes">
              {group.nodes.map((node) => (
                <DraggableNode key={node.type} {...node} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
