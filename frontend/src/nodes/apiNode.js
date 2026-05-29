// apiNode.js
// Makes an HTTP request; body can be fed in, response flows out.

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const ApiNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="API Request"
    accent="#3b82f6"
    fields={[
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        default: 'GET',
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
      {
        key: 'url',
        label: 'URL',
        type: 'text',
        default: 'https://api.example.com',
      },
    ]}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-body` },
      { type: 'source', position: Position.Right, id: `${id}-response` },
    ]}
  />
);
