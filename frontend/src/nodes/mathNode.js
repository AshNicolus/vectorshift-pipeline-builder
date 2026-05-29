// mathNode.js
// Two numeric inputs + an operation, one result output.

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Math"
    accent="#f59e0b"
    fields={[
      {
        key: 'operation',
        label: 'Operation',
        type: 'select',
        default: 'add',
        options: [
          { label: 'Add (+)', value: 'add' },
          { label: 'Subtract (−)', value: 'subtract' },
          { label: 'Multiply (×)', value: 'multiply' },
          { label: 'Divide (÷)', value: 'divide' },
        ],
      },
    ]}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-a` },
      { type: 'target', position: Position.Left, id: `${id}-b` },
      { type: 'source', position: Position.Right, id: `${id}-result` },
    ]}
  />
);
