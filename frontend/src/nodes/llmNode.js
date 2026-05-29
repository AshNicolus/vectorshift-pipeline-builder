// llmNode.js

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="LLM"
    accent="#8b5cf6"
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-system` },
      { type: 'target', position: Position.Left, id: `${id}-prompt` },
      { type: 'source', position: Position.Right, id: `${id}-response` },
    ]}
  >
    <p className="vs-node__hint">This is a LLM.</p>
  </BaseNode>
);
