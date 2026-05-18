"""Build the BT-1875 Banquet Work Table and export as
``public/3d/bt-1875.glb``.

This is Steel Valley's signature commercial-kitchen workstation and the
hero protagonist of the home-page scroll arc (spec § 1, § 4 modeling
table). Geometry is pure hard-surface primitives; the runtime layers
a brushed-steel normal map and the CAD-wireframe / heat / PBR uniforms
on top via ``onBeforeCompile``.

Run headless::

    blender --background --python scripts/blender/build-bt1875.py

Output: ``public/3d/bt-1875.glb`` — target <120 KB after Draco.

Blender unit convention: **1 BU = 1 metre**. All dimensions below are
metres (mm in the spec, multiplied by 1e-3 inline).
"""

from __future__ import annotations

import math
import os
import sys
from pathlib import Path

# Make the sibling `_bpy_utils` importable when Blender runs this script
# directly (the script's own directory isn't on sys.path by default).
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import bpy
from mathutils import Vector

import _bpy_utils as bu

# Repo root = the worktree this script lives in. The script is at
# <repo>/scripts/blender/build-bt1875.py, so two parents up is the repo.
REPO_ROOT = SCRIPT_DIR.parent.parent
OUTPUT_PATH = REPO_ROOT / "public" / "3d" / "bt-1875.glb"

# --------------------------------------------------------------------------- #
# Dimensions (spec § 4 modeling table). All metres.
# --------------------------------------------------------------------------- #

# Top: 1800 × 750 × 28 mm
TOP_X, TOP_Y, TOP_Z = 1.800, 0.750, 0.028
TOP_BEVEL_R = 0.006
TOP_BEVEL_SEG = 4
TOP_SOLIDIFY = 0.0012  # 1.2 mm

# Apron: 1780 × 730 × 14 mm, 12 mm below the top
APRON_X, APRON_Y, APRON_Z = 1.780, 0.730, 0.014
APRON_INSET_BELOW_TOP = 0.012

# Legs: Ø50 × 808 mm at apron corners
LEG_R = 0.025
LEG_H = 0.808

# Adjustable feet: Ø60 × 40 mm cylinder + Ø60 sphere cap
FOOT_R = 0.030
FOOT_H = 0.040

# Mid-shelf: 1700 × 700 × 1 mm
SHELF_X, SHELF_Y, SHELF_Z = 1.700, 0.700, 0.001
SHELF_SOLIDIFY = 0.001

# Weld bead curve radius / length
WELD_R = 0.0015          # Ø3 mm tube curve
WELD_LEN = 0.080         # ~80 mm each

# Steel material (spec § 4 material setup)
STEEL_HEX = "#C7CDD6"
STEEL_METALLIC = 1.0
STEEL_ROUGH = 0.32
STEEL_IOR = 1.45


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

def _hex_to_rgb(hex_str: str) -> tuple[float, float, float, float]:
    h = hex_str.lstrip("#")
    r = int(h[0:2], 16) / 255.0
    g = int(h[2:4], 16) / 255.0
    b = int(h[4:6], 16) / 255.0
    return (r, g, b, 1.0)


def clear_scene() -> None:
    """Empty the default scene completely."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    # Also wipe orphan data so material/mesh caches don't pollute exports.
    for coll in (bpy.data.meshes, bpy.data.materials,
                 bpy.data.curves, bpy.data.images):
        for d in list(coll):
            if d.users == 0:
                coll.remove(d)


def make_steel_material(name: str = "Steel_BT1875") -> bpy.types.Material:
    """Principled BSDF steel material per spec § 4. Clean PBR, no textures —
    the runtime adds the brushed-steel normal map."""
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    # Find the Principled BSDF that comes with the default node setup.
    bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if bsdf is None:
        bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
        out = next((n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL'),
                   nt.nodes.new("ShaderNodeOutputMaterial"))
        nt.links.new(bsdf.outputs[0], out.inputs[0])
    # Set inputs by name (robust across Blender versions that reorder slots).
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
    """Add a unit cube and scale it to ``size``. Apply the scale so modifiers
    work in real units."""
    sx, sy, sz = size
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (sx, sy, sz)
    # Bake the scale into mesh space (required before Bevel uses an absolute
    # radius — otherwise bevel scales with the object).
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def add_cylinder(name: str, radius: float, depth: float,
                 location: tuple[float, float, float],
                 vertices: int = 32) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, vertices=vertices, location=location,
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def add_uv_sphere(name: str, radius: float,
                  location: tuple[float, float, float],
                  segments: int = 24, rings: int = 12) -> bpy.types.Object:
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=radius, segments=segments, ring_count=rings, location=location,
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def select_top_edges_for_bevel(obj: bpy.types.Object) -> None:
    """Mark the upper-face edges of a box as 'bevel weight = 1' so a Bevel
    modifier with limit_method='WEIGHT' affects only those edges. Bevels
    only the top rim of the workstation top, not the underside.

    Blender 5.x replaced ``MeshEdge.bevel_weight`` with a generic EDGE-domain
    float attribute named ``bevel_weight_edge`` — written via the attributes
    collection (``foreach_set``) and read by the Bevel modifier when
    ``limit_method='WEIGHT'``.
    """
    mesh = obj.data
    zs = [v.co.z for v in mesh.vertices]
    top_z = max(zs)
    eps = 1e-4

    if "bevel_weight_edge" in mesh.attributes:
        attr = mesh.attributes["bevel_weight_edge"]
    else:
        attr = mesh.attributes.new(
            name="bevel_weight_edge", type='FLOAT', domain='EDGE',
        )

    weights = [0.0] * len(mesh.edges)
    for i, e in enumerate(mesh.edges):
        v0 = mesh.vertices[e.vertices[0]].co.z
        v1 = mesh.vertices[e.vertices[1]].co.z
        if abs(v0 - top_z) < eps and abs(v1 - top_z) < eps:
            weights[i] = 1.0
    attr.data.foreach_set("value", weights)
    mesh.update()


def apply_modifiers(obj: bpy.types.Object) -> None:
    """Bake every modifier on ``obj`` into the mesh."""
    bpy.context.view_layer.objects.active = obj
    # iterate by name (apply mutates the stack)
    for m in list(obj.modifiers):
        try:
            bpy.ops.object.modifier_apply(modifier=m.name)
        except RuntimeError as e:
            print(f"  warn: could not apply modifier {m.name} on "
                  f"{obj.name}: {e}")


def add_weld_bezier(name: str,
                    start: tuple[float, float, float],
                    end: tuple[float, float, float],
                    bevel_depth: float = WELD_R) -> bpy.types.Object:
    """Add a 2-point straight bezier between ``start`` and ``end`` with a
    circular tube cross-section of ``bevel_depth`` radius. Used as a guide
    curve for ``paint_weld_vertex_colors`` — never exported."""
    crv = bpy.data.curves.new(name + "_data", type='CURVE')
    crv.dimensions = '3D'
    crv.bevel_depth = bevel_depth
    crv.bevel_resolution = 2
    spline = crv.splines.new('BEZIER')
    spline.bezier_points.add(1)  # total 2 points
    s = Vector(start)
    e = Vector(end)
    spline.bezier_points[0].co = s
    spline.bezier_points[1].co = e
    # Straight segment: handles ALIGNED, set 1/3 along the segment.
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


# --------------------------------------------------------------------------- #
# Build
# --------------------------------------------------------------------------- #

def build() -> None:
    clear_scene()

    steel = make_steel_material()

    # ---- Top ---------------------------------------------------------------
    # Top sits centred at origin in X/Y, with its bottom at z=0.
    top_z_center = TOP_Z / 2.0
    top = add_box("BT1875_Top", (TOP_X, TOP_Y, TOP_Z),
                  (0.0, 0.0, top_z_center))
    assign_material(top, steel)
    select_top_edges_for_bevel(top)
    bev = top.modifiers.new("BevelTop", 'BEVEL')
    bev.width = TOP_BEVEL_R
    bev.segments = TOP_BEVEL_SEG
    bev.limit_method = 'WEIGHT'
    bev.use_clamp_overlap = True
    sol = top.modifiers.new("SolidifyTop", 'SOLIDIFY')
    sol.thickness = TOP_SOLIDIFY
    sol.offset = -1.0  # grow downward; top surface unchanged

    # ---- Apron -------------------------------------------------------------
    # Apron is set 12 mm below the underside of the top, centred X/Y.
    # Underside of top is z=0. Apron top must be at z = -12 mm = -0.012.
    apron_top_z = -APRON_INSET_BELOW_TOP
    apron_center_z = apron_top_z - APRON_Z / 2.0
    apron = add_box("BT1875_Apron",
                    (APRON_X, APRON_Y, APRON_Z),
                    (0.0, 0.0, apron_center_z))
    assign_material(apron, steel)

    # ---- Legs (×4) ---------------------------------------------------------
    # Legs sit at the apron's four outer corners (inset by leg radius so the
    # leg surface aligns with the apron face). Each leg's top is at the
    # apron underside; its bottom sits LEG_H below.
    leg_top_z = apron_center_z - APRON_Z / 2.0          # apron underside
    leg_center_z = leg_top_z - LEG_H / 2.0
    leg_x = APRON_X / 2.0 - LEG_R
    leg_y = APRON_Y / 2.0 - LEG_R
    leg_corners = [
        ( leg_x,  leg_y),
        ( leg_x, -leg_y),
        (-leg_x,  leg_y),
        (-leg_x, -leg_y),
    ]
    legs: list[bpy.types.Object] = []
    for i, (lx, ly) in enumerate(leg_corners):
        leg = add_cylinder(f"BT1875_Leg{i + 1}", LEG_R, LEG_H,
                           (lx, ly, leg_center_z))
        assign_material(leg, steel)
        legs.append(leg)

    # ---- Adjustable feet (×4) ---------------------------------------------
    foot_top_z = leg_center_z - LEG_H / 2.0             # leg bottom
    foot_center_z = foot_top_z - FOOT_H / 2.0
    foot_sphere_center_z = foot_top_z - FOOT_H - FOOT_R * 0.5
    feet: list[bpy.types.Object] = []
    for i, (lx, ly) in enumerate(leg_corners):
        foot = add_cylinder(f"BT1875_Foot{i + 1}", FOOT_R, FOOT_H,
                            (lx, ly, foot_center_z))
        assign_material(foot, steel)
        feet.append(foot)
        cap = add_uv_sphere(f"BT1875_FootCap{i + 1}", FOOT_R,
                            (lx, ly, foot_sphere_center_z))
        # Flatten the sphere to a half-dome (cap only).
        cap.scale.z = 0.5
        bpy.context.view_layer.objects.active = cap
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        assign_material(cap, steel)
        feet.append(cap)

    # ---- Mid-shelf ---------------------------------------------------------
    # Halfway between apron bottom and foot top.
    apron_bottom_z = apron_center_z - APRON_Z / 2.0
    shelf_center_z = (apron_bottom_z + foot_top_z) / 2.0
    shelf = add_box("BT1875_Shelf",
                    (SHELF_X, SHELF_Y, SHELF_Z),
                    (0.0, 0.0, shelf_center_z))
    assign_material(shelf, steel)
    shelf_sol = shelf.modifiers.new("SolidifyShelf", 'SOLIDIFY')
    shelf_sol.thickness = SHELF_SOLIDIFY
    shelf_sol.offset = 0.0

    # ---- Weld bead curves (16 total) --------------------------------------
    # 8 leg-to-apron beads (two short beads per leg, X-axis and Y-axis sides)
    # + 8 leg-to-foot beads (two per leg around the cylinder joint).
    weld_curves: list[bpy.types.Object] = []
    for i, (lx, ly) in enumerate(leg_corners):
        # leg-to-apron joints: just under apron bottom, on the two sides of
        # the leg that touch the apron.
        z_apron_joint = apron_bottom_z - 0.002
        # X-side bead — runs along Y for WELD_LEN, on the X-face of the leg.
        sx = lx - math.copysign(LEG_R, lx)
        sy0 = ly - math.copysign(WELD_LEN / 2.0, ly)
        sy1 = ly + math.copysign(WELD_LEN / 2.0, ly)
        weld_curves.append(add_weld_bezier(
            f"BT1875_Weld_LegApronX{i + 1}",
            (sx, sy0, z_apron_joint),
            (sx, sy1, z_apron_joint),
        ))
        # Y-side bead — runs along X for WELD_LEN, on the Y-face of the leg.
        sy = ly - math.copysign(LEG_R, ly)
        sx0 = lx - math.copysign(WELD_LEN / 2.0, lx)
        sx1 = lx + math.copysign(WELD_LEN / 2.0, lx)
        weld_curves.append(add_weld_bezier(
            f"BT1875_Weld_LegApronY{i + 1}",
            (sx0, sy, z_apron_joint),
            (sx1, sy, z_apron_joint),
        ))

        # leg-to-foot joints: a short bead on each of two sides at the joint.
        z_foot_joint = foot_top_z + 0.001
        weld_curves.append(add_weld_bezier(
            f"BT1875_Weld_LegFootX{i + 1}",
            (sx, sy0, z_foot_joint),
            (sx, sy1, z_foot_joint),
        ))
        weld_curves.append(add_weld_bezier(
            f"BT1875_Weld_LegFootY{i + 1}",
            (sx0, sy, z_foot_joint),
            (sx1, sy, z_foot_joint),
        ))

    # ---- Bake modifiers ---------------------------------------------------
    body_objs = [top, apron, shelf, *legs, *feet]
    for o in body_objs:
        apply_modifiers(o)

    # ---- Join visible-steel meshes into one ``BT1875_Body`` ---------------
    bpy.ops.object.select_all(action='DESELECT')
    for o in body_objs:
        o.select_set(True)
    # Active object becomes the join target.
    bpy.context.view_layer.objects.active = top
    bpy.ops.object.join()
    body = bpy.context.active_object
    body.name = "BT1875_Body"

    # ---- Triangulate ------------------------------------------------------
    bpy.context.view_layer.objects.active = body
    body.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.quads_convert_to_tris(
        quad_method='BEAUTY', ngon_method='BEAUTY',
    )
    bpy.ops.object.mode_set(mode='OBJECT')

    # ---- Un-share + barycentric attribute ---------------------------------
    bu.unshare_and_add_barycentric(body)

    # ---- Paint weld vertex colours ---------------------------------------
    # Radius 8 mm so the heat glow reads across the joint, not pin-point.
    bu.paint_weld_vertex_colors(body, weld_curves, radius_mm=8.0)

    # ---- Selection for export: BT1875_Body ONLY ---------------------------
    bpy.ops.object.select_all(action='DESELECT')
    body.select_set(True)
    bpy.context.view_layer.objects.active = body

    # ---- Mesh sanity log --------------------------------------------------
    body.data.calc_loop_triangles()
    n_tris = len(body.data.loop_triangles)
    n_verts = len(body.data.vertices)
    print(f"[BT1875] body: {n_tris} triangles, {n_verts} vertices "
          f"(barycentric splitting expected to ~3x vert count)")

    # ---- Export -----------------------------------------------------------
    out = str(OUTPUT_PATH)
    print(f"[BT1875] exporting -> {out}")
    bu.export_glb_draco(out, selected_only=True)
    size = os.path.getsize(out)
    print(f"[BT1875] done. file size: {size} bytes "
          f"({size / 1024:.1f} KB; budget 120 KB)")


if __name__ == "__main__":
    build()
