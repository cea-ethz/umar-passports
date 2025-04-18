from typing import List

import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import compas
from compas.geometry import Box
from compas.datastructures import Mesh
from compas.itertools import flatten
from compas.geometry import centroid_points


app = FastAPI()

origins = [
    "http://localhost:3000",  # Frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BoxInput(BaseModel):
    xsize: float
    ysize: float
    zsize: float


class MeshOutput(BaseModel):
    vertices: List[float]
    faces: List[int]
    edges: List[int]

def flatten_to_nested_matrix(matrix):
    return [matrix[i:i+4] for i in range(0, 16, 4)]

def mesh_to_vertices_edges_triangles(mesh: Mesh) -> MeshOutput:
    vertices, faces = mesh.to_vertices_and_faces()
    triangles = []
    for face in faces:
        if len(face) == 3:
            triangles.append(face)
        elif len(face) == 4:
            triangles.append([face[0], face[1], face[2]])
            triangles.append([face[0], face[2], face[3]])
    edges = list(mesh.edges())
    return MeshOutput(
        vertices=list(flatten(vertices)),
        faces=list(flatten(triangles)),
        edges=list(flatten(edges)),
    )


@app.get("/ping")
async def ping():
    return 1


@app.get("/version")
async def version():
    return compas.__version__


@app.get("/load_gemma_curtain")
async def load_gemma_curtain() -> MeshOutput:
    mesh = Mesh.from_obj("./src/data/gemma_curtain.obj")

    vertices = [mesh.vertex_coordinates(key) for key in mesh.vertices()]
    center = centroid_points(vertices)

    translation_vector = [-center[0] - 2, -center[1], -center[2]]
    mesh.translate(translation_vector)

    return mesh_to_vertices_edges_triangles(mesh)


@app.get("/load_cooper")
async def load_cooper() -> MeshOutput:
    mesh = Mesh.from_obj("./src/data/cooper.obj")

    vertices = [mesh.vertex_coordinates(key) for key in mesh.vertices()]
    center = centroid_points(vertices)

    translation_vector = [-center[0] + 2, -center[1], -center[2]]
    mesh.translate(translation_vector)

    return mesh_to_vertices_edges_triangles(mesh)


@app.post("/box_to_subdivided_mesh")
async def box_to_subdivided_mesh(boxdata: BoxInput) -> MeshOutput:
    box = Box(boxdata.xsize, boxdata.ysize, boxdata.zsize)
    mesh = box.to_mesh()
    ball = mesh.subdivided(k=3)
    return mesh_to_vertices_edges_triangles(ball)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
