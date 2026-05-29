// noteNode.js
// A handle-less sticky note for annotating the pipeline. Demonstrates
// that the abstraction supports nodes with no connection points at all.

import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Note"
    accent="#a3a3a3"
    fields={[
      {
        key: 'note',
        label: 'Note',
        type: 'textarea',
        rows: 3,
        default: 'Write a note…',
      },
    ]}
    handles={[]}
  />
);
