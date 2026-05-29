// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const { num_nodes, num_edges, is_dag } = await response.json();
      alert(
        `Pipeline Analysis\n\n` +
          `• Nodes: ${num_nodes}\n` +
          `• Edges: ${num_edges}\n` +
          `• Valid DAG: ${is_dag ? 'Yes ✅' : 'No ❌ (contains a cycle)'}`
      );
    } catch (err) {
      alert(
        `Could not reach the pipeline server.\n\n${err.message}\n\n` +
          `Make sure the backend is running:\n` +
          `  uvicorn main:app --reload`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vs-submit">
      <button
        type="button"
        className="vs-submit__button"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Analyzing…' : 'Submit Pipeline'}
      </button>
    </div>
  );
};
