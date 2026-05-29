// draggableNode.js

export const DraggableNode = ({ type, label, accent = '#6366f1' }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="vs-draggable"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      <span className="vs-draggable__dot" style={{ background: accent }} />
      <span className="vs-draggable__label">{label}</span>
    </div>
  );
};
