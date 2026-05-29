// outputNode.js

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Output"
    accent="#f43f5e"
    fields={[
      {
        key: 'outputName',
        label: 'Name',
        type: 'text',
        default: (nodeId) => nodeId.replace('customOutput-', 'output_'),
      },
      {
        key: 'outputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'Image'],
      },
    ]}
    handles={[{ type: 'target', position: Position.Left, id: `${id}-value` }]}
  />
);
