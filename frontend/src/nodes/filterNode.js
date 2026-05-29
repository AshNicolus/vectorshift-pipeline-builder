// filterNode.js
// Filters an incoming collection by a condition expression.

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Filter"
    accent="#14b8a6"
    fields={[
      {
        key: 'condition',
        label: 'Keep where',
        type: 'text',
        default: 'item.active === true',
      },
    ]}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-input` },
      { type: 'source', position: Position.Right, id: `${id}-output` },
    ]}
  />
);
