// BaseNode.js
// ------------------------------------------------------------------
// A single, config-driven node abstraction. Every node in the app is
// built by describing it (title, fields, handles) and letting BaseNode
// render the chrome, wire field state to the global store, and lay out
// the connection handles. Adding a new node type becomes a few lines of
// configuration instead of duplicated boilerplate.
// ------------------------------------------------------------------

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

// Evenly space N handles along a side so multi-input/output nodes look
// balanced without each node hand-computing percentages.
const handleTop = (index, count) => `${((index + 1) * 100) / (count + 1)}%`;

const FieldControl = ({ nodeId, field, value, onChange }) => {
  const common = {
    id: `${nodeId}-${field.key}`,
    value,
    onChange: (e) => onChange(field.key, e.target.value),
    className: 'vs-node__control',
  };

  let control;
  if (field.type === 'select') {
    control = (
      <select {...common}>
        {field.options.map((opt) => {
          const o = typeof opt === 'string' ? { label: opt, value: opt } : opt;
          return (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </select>
    );
  } else if (field.type === 'textarea') {
    control = <textarea {...common} rows={field.rows || 2} />;
  } else {
    control = <input {...common} type={field.type || 'text'} />;
  }

  return (
    <label className="vs-node__field">
      <span className="vs-node__field-label">{field.label}</span>
      {control}
    </label>
  );
};

export const BaseNode = ({
  id,
  data,
  title,
  accent = '#6366f1',
  fields = [],
  handles = [],
  children,
  style,
}) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const removeNode = useStore((state) => state.removeNode);

  // Resolve the current value for a field: persisted data wins, then the
  // field's default (which may be a function of the node id), then ''.
  const valueFor = (field) => {
    if (data?.[field.key] !== undefined) return data[field.key];
    if (typeof field.default === 'function') return field.default(id);
    return field.default ?? '';
  };

  const onChange = (key, val) => updateNodeField(id, key, val);

  // Group handles by side so we can auto-distribute them vertically.
  const left = handles.filter((h) => (h.position ?? Position.Left) === Position.Left);
  const right = handles.filter((h) => h.position === Position.Right);

  const renderHandles = (list, position) =>
    list.map((h, i) => (
      <Handle
        key={h.id}
        type={h.type}
        position={position}
        id={h.id}
        style={{ top: h.top ?? handleTop(i, list.length), background: accent, ...h.style }}
      />
    ));

  return (
    <div className="vs-node" style={style}>
      {renderHandles(left, Position.Left)}

      <div className="vs-node__header" style={{ borderTopColor: accent }}>
        <span className="vs-node__dot" style={{ background: accent }} />
        <span className="vs-node__title">{title}</span>
        <button
          type="button"
          className="vs-node__delete nodrag"
          title="Delete node"
          onClick={() => removeNode(id)}
        >
          ×
        </button>
      </div>

      <div className="vs-node__body">
        {fields.map((field) => (
          <FieldControl
            key={field.key}
            nodeId={id}
            field={field}
            value={valueFor(field)}
            onChange={onChange}
          />
        ))}
        {children}
      </div>

      {renderHandles(right, Position.Right)}
    </div>
  );
};
