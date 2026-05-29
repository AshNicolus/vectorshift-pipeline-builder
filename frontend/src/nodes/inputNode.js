// inputNode.js

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Input"
    accent="#10b981"
    fields={[
      {
        key: 'inputName',
        label: 'Name',
        type: 'text',
        default: (nodeId) => nodeId.replace('customInput-', 'input_'),
      },
      {
        key: 'inputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'File'],
      },
    ]}
    handles={[{ type: 'source', position: Position.Right, id: `${id}-value` }]}
  />
);
