// conditionalNode.js
// Routes the input to a "true" or "false" output based on a condition.

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const ConditionalNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Conditional"
    accent="#ec4899"
    fields={[
      {
        key: 'expression',
        label: 'If',
        type: 'text',
        default: 'value > 0',
      },
    ]}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-value` },
      { type: 'source', position: Position.Right, id: `${id}-true`, style: { top: '35%' } },
      { type: 'source', position: Position.Right, id: `${id}-false`, style: { top: '70%' } },
    ]}
  >
    <div className="vs-node__ports">
      <span>✓ true</span>
      <span>✕ false</span>
    </div>
  </BaseNode>
);
