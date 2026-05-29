from collections import defaultdict, deque
from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# The frontend (CRA dev server) runs on a different origin, so allow it
# to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Edge(BaseModel):
    source: str
    target: str
    # ReactFlow sends more fields (id, handles, etc.); we only need these.
    model_config = {"extra": "ignore"}


class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Edge] = []


def is_dag(node_ids: List[str], edges: List[Edge]) -> bool:
    """Return True if the directed graph has no cycles (Kahn's algorithm)."""
    valid = set(node_ids)
    adjacency: Dict[str, List[str]] = defaultdict(list)
    indegree: Dict[str, int] = {nid: 0 for nid in valid}

    for edge in edges:
        # Ignore edges that reference nodes not in the graph.
        if edge.source not in valid or edge.target not in valid:
            continue
        adjacency[edge.source].append(edge.target)
        indegree[edge.target] += 1

    queue = deque(nid for nid, deg in indegree.items() if deg == 0)
    visited = 0
    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adjacency[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    # If every node was visited, no cycle exists.
    return visited == len(valid)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    node_ids = [str(node.get("id")) for node in pipeline.nodes if node.get("id") is not None]
    return {
        "num_nodes": len(pipeline.nodes),
        "num_edges": len(pipeline.edges),
        "is_dag": is_dag(node_ids, pipeline.edges),
    }
