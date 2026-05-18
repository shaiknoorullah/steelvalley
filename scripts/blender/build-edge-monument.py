"""Build the Edge Monument — Steel Valley's secondary hero asset.

A 2.0 × 0.5 × 0.05 m stainless-steel sheet with an R6 bullnose on one
long edge and a single weld bead running along that edge. Same shader
rig as the BT-1875, used as a comparison / fallback asset (spec § 1
secondary asset, § 4 modeling table).

Run headless::

    blender --background --python scripts/blender/build-edge-monument.py

Output: ``public/3d/edge-monument.glb`` — target <30 KB after Draco.

Blender unit convention: 1 BU = 1 metre.
"""

from __future__ import annotations

import math
import os
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import bpy
from mathutils import Vector

import _bpy_utils as bu

REPO_ROOT = SCRIPT_DIR.parent.parent
OUTPUT_PATH = REPO_ROOT / "public" / "3d" / "edge-monument.glb"

# --------------------------------------------------------------------------- #
# Dimensions
# --------------------------------------------------------------------------- #

SHEET_X, SHEET_Y, SHEET_Z = 2.000, 0.500, 0.050
BULLNOSE_R = 0.006
BULLNOSE_SEG = 4

WELD_R = 0.0015
WELD_LEN = 0.800       # ~0.8 m bead along the bullnose

STEEL_HEX = "#C7CDD6"
STEEL_METALLIC = 1.0
STEEL_ROUGH = 0.32
STEEL_IOR = 1.45


# --------------------------------------------------------------------------- #
# Helpers (a deliberately-thin parallel of build-bt1875 — these two scripts
# stay independent so they're easier to re-read in isolation)
# --------------------------------------------------------------------------- #

def _hex_to_rgb(hex_str: str) -> tuple[float, float, float, float]:
    h = hex_str.lstrip("#")
    return (int(h[0:2], 16) / 255.0,
            int(h[2:4], 16) / 255.0,
            int(h[4:6], 16) / 255.0,
            1.0)


def clear_scene() -> None:
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for coll in (bpy.data.meshes, bpy.data.materials,
                 bpy.data.curves, bpy.data.images):
        for d in list(coll):
            if d.users == 0:
                coll.remove(d)


def make_steel_material(name: str = "Steel_EdgeMonument") -> bpy.types.Material:
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if bsdf is None:
        bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
        out = next((n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL'),
                   nt.nodes.new("ShaderNodeOutputMaterial"))
        nt.links.new(bsdf.outputs[0], out.inputs[0])
    bsdf.inputs["Base Color"].default_value = _hex_to_rgb(STEEL_HEX)
    bsdf.inputs["Metallic"].default_value = STEEL_METALLIC
    bsdf.inputs["Roughness"].default_value = STEEL_ROUGH
    if "IOR" in bsdf.inputs:
        bsdf.inputs["IOR"].default_value = STEEL_IOR
    return mat


def assign_material(obj: bpy.types.Object, mat: bpy.types.Material) -> None:
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


def add_box(name: str, size: tuple[float, float, float],
            location: tuple[float, float, float]) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def apply_modifiers(obj: bpy.types.Object) -> None:
    bpy.context.view_layer.objects.active = obj
    for m in list(obj.modifiers):
        try:
            bpy.ops.object.modifier_apply(modifier=m.name)
        except RuntimeError as e:
            print(f"  warn: could not apply modifier {m.name}: {e}")


def add_weld_bezier(name: str,
                    start: tuple[float, float, float],
                    end: tuple[float, float, float],
                    bevel_depth: float = WELD_R) -> bpy.types.Object:
    crv = bpy.data.curves.new(name + "_data", type='CURVE')
    crv.dimensions = '3D'
    crv.bevel_depth = bevel_depth
    crv.bevel_resolution = 2
    spline = crv.splines.new('BEZIER')
    spline.bezier_points.add(1)
    s = Vector(start)
    e = Vector(end)
    spline.bezier_points[0].co = s
    spline.bezier_points[1].co = e
    dirv = (e - s) / 3.0
    for bp, anchor, h_left, h_right in (
        (spline.bezier_points[0], s, s - dirv, s + dirv),
        (spline.bezier_points[1], e, e - dirv, e + dirv),
    ):
        bp.handle_left_type = 'ALIGNED'
        bp.handle_right_type = 'ALIGNED'
        bp.handle_left = h_left
        bp.handle_right = h_right
    obj = bpy.data.objects.new(name, crv)
    bpy.context.collection.objects.link(obj)
    return obj


def mark_front_long_edges(obj: bpy.types.Object) -> None:
    """Set bevel weight = 1 on the two edges that run along the +Y front long
    side of the sheet (the bullnose edge — both top and bottom rim along
    +Y/2). The Bevel modifier limit_method='WEIGHT' will then round only
    those edges into the bullnose profile.

    Blender 5.x stores edge bevel weights as a generic float attribute on
    the EDGE domain named ``bevel_weight_edge``.
    """
    mesh = obj.data
    ys = [v.co.y for v in mesh.vertices]
    front_y = max(ys)
    eps = 1e-4

    if "bevel_weight_edge" in mesh.attributes:
        attr = mesh.attributes["bevel_weight_edge"]
    else:
        attr = mesh.attributes.new(
            name="bevel_weight_edge", type='FLOAT', domain='EDGE',
        )

    weights = [0.0] * len(mesh.edges)
    for i, e in enumerate(mesh.edges):
        v0 = mesh.vertices[e.vertices[0]].co
        v1 = mesh.vertices[e.vertices[1]].co
        on_front = abs(v0.y - front_y) < eps and abs(v1.y - front_y) < eps
        runs_along_x = abs(v0.x - v1.x) > 1e-4
        if on_front and runs_along_x:
            weights[i] = 1.0
    attr.data.foreach_set("value", weights)
    mesh.update()


# --------------------------------------------------------------------------- #
# Build
# --------------------------------------------------------------------------- #

def build() -> None:
    clear_scene()

    steel = make_steel_material()

    # Sheet centred at origin in X; lifted so its bottom is at z=0.
    sheet = add_box("EdgeMonument_Sheet",
                    (SHEET_X, SHEET_Y, SHEET_Z),
                    (0.0, 0.0, SHEET_Z / 2.0))
    assign_material(sheet, steel)
    mark_front_long_edges(sheet)
    bev = sheet.modifiers.new("BullnoseBevel", 'BEVEL')
    bev.width = BULLNOSE_R
    bev.segments = BULLNOSE_SEG
    bev.limit_method = 'WEIGHT'
    bev.use_clamp_overlap = True
    # The bevel modifier rounds the two front-long edges. With 4 segments
    # the two roundings meet smoothly across the thickness, giving the
    # bullnose silhouette (a half-cylinder along the front edge).

    # Weld bead along the bullnose — centred along X, length WELD_LEN,
    # placed at the bullnose mid-height (sheet thickness centre).
    front_y = SHEET_Y / 2.0 - BULLNOSE_R * 0.0       # exactly at the edge
    weld_z = SHEET_Z / 2.0                            # mid-height
    weld_curve = add_weld_bezier(
        "EdgeMonument_Weld",
        (-WELD_LEN / 2.0, front_y, weld_z),
        ( WELD_LEN / 2.0, front_y, weld_z),
    )

    # Bake modifiers, triangulate, then post-process.
    apply_modifiers(sheet)

    bpy.ops.object.select_all(action='DESELECT')
    sheet.select_set(True)
    bpy.context.view_layer.objects.active = sheet
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.quads_convert_to_tris(
        quad_method='BEAUTY', ngon_method='BEAUTY',
    )
    bpy.ops.object.mode_set(mode='OBJECT')

    bu.unshare_and_add_barycentric(sheet)
    # Same 8 mm radius as the BT-1875 so heat glow reads.
    bu.paint_weld_vertex_colors(sheet, [weld_curve], radius_mm=8.0)

    # Selection: sheet only (weld curve is guide geometry).
    bpy.ops.object.select_all(action='DESELECT')
    sheet.select_set(True)
    bpy.context.view_layer.objects.active = sheet

    sheet.data.calc_loop_triangles()
    n_tris = len(sheet.data.loop_triangles)
    n_verts = len(sheet.data.vertices)
    print(f"[EdgeMonument] sheet: {n_tris} triangles, {n_verts} vertices")

    out = str(OUTPUT_PATH)
    print(f"[EdgeMonument] exporting -> {out}")
    bu.export_glb_draco(out, selected_only=True)
    size = os.path.getsize(out)
    print(f"[EdgeMonument] done. file size: {size} bytes "
          f"({size / 1024:.1f} KB; budget 30 KB)")


if __name__ == "__main__":
    build()
