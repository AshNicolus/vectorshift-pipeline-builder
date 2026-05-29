// textNode.js
// ------------------------------------------------------------------
// The Text node has two pieces of custom logic on top of BaseNode:
//   1. The textarea auto-resizes (height + width) to fit its content.
//   2. Any `{{ variable }}` written in the text becomes a left-side
//      target Handle, so upstream nodes can feed those variables in.
// ------------------------------------------------------------------

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

// Match {{ variable }} where the name is a valid JS identifier. Dedupe
// while preserving first-seen order.
const VARIABLE_RE = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text = '') => {
  const seen = new Set();
  let match;
  VARIABLE_RE.lastIndex = 0;
  while ((match = VARIABLE_RE.exec(text)) !== null) {
    seen.add(match[1]);
  }
  return [...seen];
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);

  const text = data?.text ?? '{{input}}';
  const variables = useMemo(() => extractVariables(text), [text]);

  const handles = useMemo(
    () =>
      variables.map((name) => ({
        type: 'target',
        position: Position.Left,
        id: `${id}-${name}`,
      })),
    [variables, id]
  );

  // Tell ReactFlow to recompute handle positions whenever the set of
  // variables (and therefore handles) changes.
  useEffect(() => {
    updateNodeInternals(id);
  }, [handles, id, updateNodeInternals]);

  // Auto-resize: grow height to fit all lines, and width to fit the
  // longest line (clamped to a sensible range).
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const longestLine = useMemo(
    () => text.split('\n').reduce((max, line) => Math.max(max, line.length), 0),
    [text]
  );
  // ~7.3px per monospace-ish char, clamped between 180 and 360.
  const width = Math.min(360, Math.max(180, longestLine * 7.3 + 32));

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      accent="#0ea5e9"
      handles={[...handles, { type: 'source', position: Position.Right, id: `${id}-output` }]}
      style={{ width }}
    >
      <label className="vs-node__field">
        <span className="vs-node__field-label">Text</span>
        <textarea
          ref={textareaRef}
          className="vs-node__control vs-node__textarea"
          value={text}
          rows={1}
          onChange={(e) => updateNodeField(id, 'text', e.target.value)}
          placeholder="Type text. Use {{ variable }} to add inputs."
        />
      </label>
    </BaseNode>
  );
};
