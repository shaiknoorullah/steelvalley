"""Build the full Steel Valley commercial kitchen scene and export as
``public/3d/kitchen.glb``.

This is the v3 hero scene (spec § 3.3 LOD, § 4 Blender pipeline). A single
script that assembles: the BT-1875 workstation (hero, full geometry); two
background prep tables (mid quality, lower poly, no bevels); an exhaust
hood with ducting; two stacked wall shelves with brackets; a hanging
utensil rail with 4 utensils; four architectural planes (floor, back wall,
side wall, ceiling); and 3 instanceable pendants (housing + emissive disc).

Run headless::

    blender --background --python scripts/blender/build-kitchen.py

Output: ``public/3d/kitchen.glb`` — target <500 KB after Draco.

Coordinate convention
---------------------
The spec uses Three.js Y-up world coordinates (X right, Y up, Z toward
camera). Blender's native convention is Z-up. The default glTF exporter
remaps Blender (+X, +Y, +Z) → glTF (+X, +Z, -Y). Concretely:

    Three.js (x, y, z)  ⇄  Blender (x, -z, y)

So a Three.js prep table at ``[-2.6, 0, -1.4]`` is built in Blender at
``(-2.6, 1.4, 0)``. Heights ("y" in spec) become Blender z. Depth ("z"
in spec, negative is "behind") becomes Blender +y. Rotation about the
spec's Y axis becomes rotation about Blender's Z axis.

Material naming is LOAD-BEARING for the runtime. The 5 names below are
exactly what the React/Three.js side keys off when swapping in PBR
texture sets at load time:

    STEEL, CONCRETE, TILE, PLASTER, PENDANT_BULB

Textures live in ``public/tex/*`` and are loaded at runtime; this script
writes only the Principled BSDF + Emissive shader parameters so the
material has correct fallback colour, roughness, metallic, and IOR while
the runtime maps stream in.
"""

from __future__ import annotations

import math
import os
import sys
from pathlib import Path

# Make the sibling ``_bpy_utils`` importable when Blender runs this script
# directly (the script's own directory isn't on sys.path by default).
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import bpy

REPO_ROOT = SCRIPT_DIR.parent.parent
OUTPUT_PATH = REPO_ROOT / "public" / "3d" / "kitchen.glb"


# --------------------------------------------------------------------------- #
# Constants — dimensions, materials, LOD economy
# --------------------------------------------------------------------------- #

# Foreground (BT-1875) — full quality, beveled top, 16-segment cylinders.
TOP_X, TOP_Y, TOP_Z = 1.800, 0.750, 0.028
TOP_BEVEL_R = 0.006
TOP_BEVEL_SEG = 4
TOP_SOLIDIFY = 0.0012
APRON_X, APRON_Y, APRON_Z = 1.780, 0.730, 0.014
APRON_INSET_BELOW_TOP = 0.012
LEG_R = 0.025
LEG_H = 0.808
FOOT_R = 0.030
FOOT_H = 0.040
SHELF_X, SHELF_Y, SHELF_Z = 1.700, 0.700, 0.001
SHELF_SOLIDIFY = 0.001
WELD_R = 0.0015
WELD_LEN = 0.080

CYL_HI_SEG = 16   # foreground cylinder segments
CYL_LO_SEG = 8    # background cylinder segments
CYL_DUCT_SEG = 6  # ducting cylinder segments

# Material colours (PBR fallbacks — runtime swaps in texture maps).
STEEL_HEX = "#C7CDD6"
STEEL_METALLIC = 1.0
STEEL_ROUGH = 0.32
STEEL_IOR = 1.45

CONCRETE_HEX = "#2C2E33"
CONCRETE_METALLIC = 0.0
CONCRETE_ROUGH = 0.65

TILE_HEX = "#DEDED8"
TILE_METALLIC = 0.0
TILE_ROUGH = 0.42

PLASTER_HEX = "#ECEAE2"
PLASTER_METALLIC = 0.0
PLASTER_ROUGH = 0.92

PENDANT_HEX = "#FFE7C2"
PENDANT_EMISSIVE_STRENGTH = 12.0

# Architecture dimensions (mm in spec, metres here).
FLOOR_X, FLOOR_Y = 8.0, 8.0
BACK_WALL_X, BACK_WALL_Z = 6.0, 3.0
SIDE_WALL_Y, SIDE_WALL_Z = 4.0, 3.0
CEIL_X, CEIL_Y = 8.0, 6.0

# UV tiling counts — the runtime sets RepeatWrapping on the textures so
# these UV multipliers become visible tile counts on each surface.
CONCRETE_TILE = 4.0   # 4× floor tiling
TILE_WALL_TILE = 8.0  # 8× back wall tiling


# --------------------------------------------------------------------------- #
# Small helpers
# --------------------------------------------------------------------------- #

def _hex_to_rgb(hex_str: str) -> tuple[float, float, float, float]:
    h = hex_str.lstrip("#")
    r = int(h[0:2], 16) / 255.0
    g = int(h[2:4], 16) / 255.0
    b = int(h[4:6], 16) / 255.0
    return (r, g, b, 1.0)


def clear_scene() -> None:
    """Empty the default scene completely and prune orphan datablocks."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for coll in (bpy.data.meshes, bpy.data.materials,
                 bpy.data.curves, bpy.data.images,
                 bpy.data.node_groups, bpy.data.lights, bpy.data.cameras):
        for d in list(coll):
            if d.users == 0:
                coll.remove(d)


# --------------------------------------------------------------------------- #
# Materials — the five LOAD-BEARING names the runtime reads off
# --------------------------------------------------------------------------- #

def _principled_material(name: str, hex_color: str,
                         metallic: float, roughness: float,
                         ior: float | None = None) -> bpy.types.Material:
    """Build a Principled BSDF material with the 4 PBR knobs the runtime
    cares about. No image textures attached — the React side streams maps
    in at load time via ``useTexture`` and rebinds them onto a
    MeshStandardMaterial keyed by ``mesh.material.name``."""
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
    bsdf.inputs["Base Color"].default_value = _hex_to_rgb(hex_color)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if ior is not None and "IOR" in bsdf.inputs:
        bsdf.inputs["IOR"].default_value = ior
    return mat


def make_steel_material() -> bpy.types.Material:
    return _principled_material(
        "STEEL", STEEL_HEX, STEEL_METALLIC, STEEL_ROUGH, STEEL_IOR,
    )


def make_concrete_material() -> bpy.types.Material:
    return _principled_material(
        "CONCRETE", CONCRETE_HEX, CONCRETE_METALLIC, CONCRETE_ROUGH,
    )


def make_tile_material() -> bpy.types.Material:
    return _principled_material(
        "TILE", TILE_HEX, TILE_METALLIC, TILE_ROUGH,
    )


def make_plaster_material() -> bpy.types.Material:
    return _principled_material(
        "PLASTER", PLASTER_HEX, PLASTER_METALLIC, PLASTER_ROUGH,
    )


def make_pendant_bulb_material() -> bpy.types.Material:
    """Emissive material for the pendant disc — runtime treats this as the
    GodRays "sun" target so the strength here is just for the offline
    fallback / inspectability, not the final visual."""
    name = "PENDANT_BULB"
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if bsdf is not None:
        # Same Principled node but with emissive turned on so it carries
        # an emissive color/strength through the GLB even though the
        # runtime will likely just sample mesh.material.name and decide.
        bsdf.inputs["Base Color"].default_value = _hex_to_rgb(PENDANT_HEX)
        bsdf.inputs["Metallic"].default_value = 0.0
        bsdf.inputs["Roughness"].default_value = 0.5
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = _hex_to_rgb(PENDANT_HEX)
        elif "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = _hex_to_rgb(PENDANT_HEX)
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = PENDANT_EMISSIVE_STRENGTH
    return mat


def assign_material(obj: bpy.types.Object, mat: bpy.types.Material) -> None:
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


# --------------------------------------------------------------------------- #
# Primitive builders
# --------------------------------------------------------------------------- #

def add_box(name: str, size: tuple[float, float, float],
            location: tuple[float, float, float],
            rotation_z: float = 0.0) -> bpy.types.Object:
    sx, sy, sz = size
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (sx, sy, sz)
    if rotation_z != 0.0:
        obj.rotation_euler = (0.0, 0.0, rotation_z)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def add_cylinder(name: str, radius: float, depth: float,
                 location: tuple[float, float, float],
                 vertices: int = 16,
                 rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
                 ) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, vertices=vertices, location=location,
    )
    obj = bpy.context.active_object
    obj.name = name
    if rotation != (0.0, 0.0, 0.0):
        obj.rotation_euler = rotation
    return obj


def add_uv_sphere(name: str, radius: float,
                  location: tuple[float, float, float],
                  segments: int = 16, rings: int = 8) -> bpy.types.Object:
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=radius, segments=segments, ring_count=rings, location=location,
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def add_plane(name: str, size_xy: tuple[float, float],
              location: tuple[float, float, float],
              rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
              ) -> bpy.types.Object:
    """Add a plane scaled to (sx, sy). Default plane is XY, normal +Z."""
    sx, sy = size_xy
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (sx, sy, 1.0)
    if rotation != (0.0, 0.0, 0.0):
        obj.rotation_euler = rotation
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def select_top_edges_for_bevel(obj: bpy.types.Object) -> None:
    """Mark only the upper-face edges as bevel_weight=1 (limit_method=WEIGHT)."""
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


def select_all_edges_for_bevel(obj: bpy.types.Object) -> None:
    """Mark every edge as bevel_weight=1 — used for the exhaust hood where
    we want all corners softened."""
    mesh = obj.data
    if "bevel_weight_edge" in mesh.attributes:
        attr = mesh.attributes["bevel_weight_edge"]
    else:
        attr = mesh.attributes.new(
            name="bevel_weight_edge", type='FLOAT', domain='EDGE',
        )
    weights = [1.0] * len(mesh.edges)
    attr.data.foreach_set("value", weights)
    mesh.update()


def apply_modifiers(obj: bpy.types.Object) -> None:
    bpy.context.view_layer.objects.active = obj
    for m in list(obj.modifiers):
        try:
            bpy.ops.object.modifier_apply(modifier=m.name)
        except RuntimeError as e:
            print(f"  warn: could not apply modifier {m.name} on "
                  f"{obj.name}: {e}")


def triangulate(obj: bpy.types.Object) -> None:
    """Convert the mesh to pure triangles in-place."""
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.quads_convert_to_tris(
        quad_method='BEAUTY', ngon_method='BEAUTY',
    )
    bpy.ops.object.mode_set(mode='OBJECT')


# --------------------------------------------------------------------------- #
# UV helpers
# --------------------------------------------------------------------------- #

def smart_uv_project(obj: bpy.types.Object,
                     angle_limit_deg: float = 66.0,
                     island_margin: float = 0.02) -> None:
    """Apply ``smart_project`` UV unwrap to ``obj`` (must be a mesh)."""
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(
        angle_limit=math.radians(angle_limit_deg),
        island_margin=island_margin,
    )
    bpy.ops.object.mode_set(mode='OBJECT')


def cube_uv_project(obj: bpy.types.Object, cube_size: float = 0.5) -> None:
    """Apply cube projection UV unwrap to ``obj``. The brushed-steel
    texture tiles isotropically across all faces at this scale."""
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.cube_project(cube_size=cube_size)
    bpy.ops.object.mode_set(mode='OBJECT')


def scale_uvs(obj: bpy.types.Object, scale: float) -> None:
    """Multiply every UV coord on the active UV layer by ``scale``. Used so
    a single tiling plane (floor / wall) shows N tiles of the texture even
    though the texture itself is a single repeat."""
    mesh = obj.data
    uv_layer = mesh.uv_layers.active
    if uv_layer is None:
        return
    n = len(uv_layer.data)
    flat = [0.0] * (2 * n)
    uv_layer.data.foreach_get("uv", flat)
    for i in range(n):
        flat[2 * i + 0] *= scale
        flat[2 * i + 1] *= scale
    uv_layer.data.foreach_set("uv", flat)
    mesh.update()


# --------------------------------------------------------------------------- #
# BT-1875 (foreground hero) — beveled top, full apron, 4 legs, 4 feet, shelf,
#   16 weld bead curves (curves are guide-only, never exported).
# --------------------------------------------------------------------------- #

def build_bt1875(steel: bpy.types.Material,
                 origin_xy: tuple[float, float] = (0.0, 0.0),
                 rotation_z: float = 0.0,
                 cyl_segments: int = CYL_HI_SEG,
                 use_bevel: bool = True,
                 use_weld_curves: bool = True,
                 name_prefix: str = "BT1875",
                 top_size: tuple[float, float, float] | None = None,
                 apron_size: tuple[float, float, float] | None = None,
                 shelf_size: tuple[float, float, float] | None = None,
                 ) -> tuple[bpy.types.Object, list[bpy.types.Object]]:
    """Build a BT-1875-style work table at ``origin_xy`` (Blender x,y; z is
    fixed so the floor sits at z=0). Returns the joined body object plus a
    list of weld curve objects (empty if ``use_weld_curves`` is False).

    The hero table uses ``cyl_segments=16`` and ``use_bevel=True``. Background
    prep tables call with ``cyl_segments=8``, ``use_bevel=False``,
    ``use_weld_curves=False`` to drop polycount.
    """
    ox, oy = origin_xy
    tx, ty, tz = top_size or (TOP_X, TOP_Y, TOP_Z)
    ax, ay, az = apron_size or (tx - 0.020, ty - 0.020, APRON_Z)
    sx_, sy_, sz_ = shelf_size or (tx - 0.100, ty - 0.050, SHELF_Z)

    # ---- Top ---------------------------------------------------------------
    top_z_center = tz / 2.0
    top = add_box(f"{name_prefix}_Top", (tx, ty, tz),
                  (ox, oy, top_z_center))
    assign_material(top, steel)
    if use_bevel:
        select_top_edges_for_bevel(top)
        bev = top.modifiers.new("BevelTop", 'BEVEL')
        bev.width = TOP_BEVEL_R
        bev.segments = TOP_BEVEL_SEG
        bev.limit_method = 'WEIGHT'
        bev.use_clamp_overlap = True
        sol = top.modifiers.new("SolidifyTop", 'SOLIDIFY')
        sol.thickness = TOP_SOLIDIFY
        sol.offset = -1.0

    # ---- Apron -------------------------------------------------------------
    apron_top_z = -APRON_INSET_BELOW_TOP
    apron_center_z = apron_top_z - az / 2.0
    apron = add_box(f"{name_prefix}_Apron",
                    (ax, ay, az),
                    (ox, oy, apron_center_z))
    assign_material(apron, steel)

    # ---- Legs (×4) ---------------------------------------------------------
    leg_top_z = apron_center_z - az / 2.0
    leg_center_z = leg_top_z - LEG_H / 2.0
    leg_x = ax / 2.0 - LEG_R
    leg_y = ay / 2.0 - LEG_R
    leg_corners = [
        ( leg_x,  leg_y),
        ( leg_x, -leg_y),
        (-leg_x,  leg_y),
        (-leg_x, -leg_y),
    ]
    legs: list[bpy.types.Object] = []
    for i, (lx, ly) in enumerate(leg_corners):
        leg = add_cylinder(f"{name_prefix}_Leg{i + 1}", LEG_R, LEG_H,
                           (ox + lx, oy + ly, leg_center_z),
                           vertices=cyl_segments)
        assign_material(leg, steel)
        legs.append(leg)

    # ---- Feet (×4) ---------------------------------------------------------
    foot_top_z = leg_center_z - LEG_H / 2.0
    foot_center_z = foot_top_z - FOOT_H / 2.0
    foot_sphere_center_z = foot_top_z - FOOT_H - FOOT_R * 0.5
    feet: list[bpy.types.Object] = []
    for i, (lx, ly) in enumerate(leg_corners):
        foot = add_cylinder(f"{name_prefix}_Foot{i + 1}", FOOT_R, FOOT_H,
                            (ox + lx, oy + ly, foot_center_z),
                            vertices=cyl_segments)
        assign_material(foot, steel)
        feet.append(foot)
        cap = add_uv_sphere(f"{name_prefix}_FootCap{i + 1}", FOOT_R,
                            (ox + lx, oy + ly, foot_sphere_center_z),
                            segments=max(cyl_segments, 8),
                            rings=max(cyl_segments // 2, 4))
        cap.scale.z = 0.5
        bpy.context.view_layer.objects.active = cap
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        assign_material(cap, steel)
        feet.append(cap)

    # ---- Mid-shelf ---------------------------------------------------------
    apron_bottom_z = apron_center_z - az / 2.0
    shelf_center_z = (apron_bottom_z + foot_top_z) / 2.0
    shelf = add_box(f"{name_prefix}_Shelf",
                    (sx_, sy_, sz_),
                    (ox, oy, shelf_center_z))
    assign_material(shelf, steel)
    shelf_sol = shelf.modifiers.new("SolidifyShelf", 'SOLIDIFY')
    shelf_sol.thickness = SHELF_SOLIDIFY
    shelf_sol.offset = 0.0

    # ---- Weld bead curves (only for the foreground hero) ------------------
    weld_curves: list[bpy.types.Object] = []
    if use_weld_curves:
        from mathutils import Vector
        def add_weld_bezier(name: str,
                            start: tuple[float, float, float],
                            end: tuple[float, float, float]) -> bpy.types.Object:
            crv = bpy.data.curves.new(name + "_data", type='CURVE')
            crv.dimensions = '3D'
            crv.bevel_depth = WELD_R
            crv.bevel_resolution = 2
            spline = crv.splines.new('BEZIER')
            spline.bezier_points.add(1)
            s = Vector(start)
            e = Vector(end)
            spline.bezier_points[0].co = s
            spline.bezier_points[1].co = e
            dirv = (e - s) / 3.0
            for bp, h_left, h_right in (
                (spline.bezier_points[0], s - dirv, s + dirv),
                (spline.bezier_points[1], e - dirv, e + dirv),
            ):
                bp.handle_left_type = 'ALIGNED'
                bp.handle_right_type = 'ALIGNED'
                bp.handle_left = h_left
                bp.handle_right = h_right
            obj = bpy.data.objects.new(name, crv)
            bpy.context.collection.objects.link(obj)
            return obj

        for i, (lx, ly) in enumerate(leg_corners):
            z_apron_joint = apron_bottom_z - 0.002
            sx = lx - math.copysign(LEG_R, lx)
            sy0 = ly - math.copysign(WELD_LEN / 2.0, ly)
            sy1 = ly + math.copysign(WELD_LEN / 2.0, ly)
            weld_curves.append(add_weld_bezier(
                f"{name_prefix}_Weld_LegApronX{i + 1}",
                (ox + sx, oy + sy0, z_apron_joint),
                (ox + sx, oy + sy1, z_apron_joint),
            ))
            sy = ly - math.copysign(LEG_R, ly)
            sx0 = lx - math.copysign(WELD_LEN / 2.0, lx)
            sx1 = lx + math.copysign(WELD_LEN / 2.0, lx)
            weld_curves.append(add_weld_bezier(
                f"{name_prefix}_Weld_LegApronY{i + 1}",
                (ox + sx0, oy + sy, z_apron_joint),
                (ox + sx1, oy + sy, z_apron_joint),
            ))
            z_foot_joint = foot_top_z + 0.001
            weld_curves.append(add_weld_bezier(
                f"{name_prefix}_Weld_LegFootX{i + 1}",
                (ox + sx, oy + sy0, z_foot_joint),
                (ox + sx, oy + sy1, z_foot_joint),
            ))
            weld_curves.append(add_weld_bezier(
                f"{name_prefix}_Weld_LegFootY{i + 1}",
                (ox + sx0, oy + sy, z_foot_joint),
                (ox + sx1, oy + sy, z_foot_joint),
            ))

    # ---- Bake modifiers ---------------------------------------------------
    body_objs = [top, apron, shelf, *legs, *feet]
    for o in body_objs:
        apply_modifiers(o)

    # ---- Join into one body ----------------------------------------------
    bpy.ops.object.select_all(action='DESELECT')
    for o in body_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = top
    bpy.ops.object.join()
    body = bpy.context.active_object
    body.name = f"{name_prefix}_Body"
    # Re-assert material slot 0 references STEEL (join can shuffle).
    if body.data.materials:
        body.data.materials[0] = steel
    else:
        body.data.materials.append(steel)

    # ---- Apply post-join rotation about Z (Three.js Y rotation) ----------
    if rotation_z != 0.0:
        body.rotation_euler = (0.0, 0.0, rotation_z)
        bpy.context.view_layer.objects.active = body
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

    return body, weld_curves


# --------------------------------------------------------------------------- #
# Exhaust hood + ducting
# --------------------------------------------------------------------------- #

def build_hood(steel: bpy.types.Material) -> list[bpy.types.Object]:
    """Hood centered above the main workstation (Three.js [0, 2.4, 0]).
    Box 2000 × 1000 × 600 mm + Ø400 × 1500 mm ducting rising to z=3.9.

    Three.js position [0, 2.4, 0] (Y is height) → Blender (0, 0, 2.4) for
    the hood centre. Ducting tops at Three.js Y=3.9 = Blender Z=3.9.
    """
    hood_x, hood_y, hood_z = 2.000, 1.000, 0.600
    hood_center_z = 2.4
    hood = add_box("Kitchen_Hood",
                   (hood_x, hood_y, hood_z),
                   (0.0, 0.0, hood_center_z))
    assign_material(hood, steel)
    select_all_edges_for_bevel(hood)
    bev = hood.modifiers.new("BevelHood", 'BEVEL')
    bev.width = 0.020
    bev.segments = 2
    bev.limit_method = 'WEIGHT'
    bev.use_clamp_overlap = True

    # Ducting Ø400 × 1500mm rising from the hood top (z = hood_center + hood_z/2)
    duct_r = 0.200
    duct_h = 1.500
    hood_top_z = hood_center_z + hood_z / 2.0  # 2.7
    duct_top_z = 3.9  # from spec
    # The duct should rise from the hood top up to z=3.9. Span = duct_top_z - hood_top_z
    # but the spec mandates 1500 mm length — we honour the length and centre
    # it so its bottom is at hood_top_z.
    duct_center_z = hood_top_z + duct_h / 2.0
    duct = add_cylinder("Kitchen_HoodDuct", duct_r, duct_h,
                        (0.0, 0.0, duct_center_z),
                        vertices=CYL_DUCT_SEG)
    assign_material(duct, steel)

    apply_modifiers(hood)
    return [hood, duct]


# --------------------------------------------------------------------------- #
# Wall shelving — two stacked shelves with 4 L-brackets each
# --------------------------------------------------------------------------- #

def build_wall_shelving(steel: bpy.types.Material) -> list[bpy.types.Object]:
    """Two stacked shelves on the back wall, left side.
    Three.js positions [-3.8, 1.6, -2.95] and [-3.8, 2.4, -2.95]:
      Blender (x, -z, y) → (-3.8, 2.95, 1.6) and (-3.8, 2.95, 2.4).
    """
    objs: list[bpy.types.Object] = []
    shelf_x, shelf_y, shelf_z = 1.800, 0.300, 0.025
    for tier, height_blender_z in enumerate((1.6, 2.4)):
        # Centre depth: a bit forward of the wall (wall at y=3.0; shelf
        # backs at y=2.95, so shelf centre y = 2.95 - shelf_y/2 + tolerance).
        # Spec gives [-3.8, h, -2.95] which is back edge ~ wall.
        shelf_center_y = 2.95 - shelf_y / 2.0
        shelf = add_box(f"Kitchen_Shelf{tier + 1}",
                        (shelf_x, shelf_y, shelf_z),
                        (-3.8, shelf_center_y, height_blender_z))
        assign_material(shelf, steel)
        objs.append(shelf)
        # 4 small L-brackets per shelf — simple right-angle prisms approximated
        # as small boxes mounted at the back of each shelf, spaced along X.
        bracket_size = (0.030, 0.150, 0.060)
        # x positions spread across the shelf length
        for j, fx in enumerate((-0.85, -0.30, 0.30, 0.85)):
            bracket_center_x = -3.8 + fx
            bracket_center_y = 2.95 - bracket_size[1] / 2.0
            bracket_center_z = height_blender_z - shelf_z / 2.0 - bracket_size[2] / 2.0
            bracket = add_box(
                f"Kitchen_ShelfBracket{tier + 1}_{j + 1}",
                bracket_size,
                (bracket_center_x, bracket_center_y, bracket_center_z),
            )
            assign_material(bracket, steel)
            objs.append(bracket)
    return objs


# --------------------------------------------------------------------------- #
# Hanging utensil rail + 4 utensils
# --------------------------------------------------------------------------- #

def build_utensil_rail(steel: bpy.types.Material) -> list[bpy.types.Object]:
    """Horizontal rail above the main workstation.
    Three.js position [0, 2.0, -0.8] → Blender (0, 0.8, 2.0).
    Cylinder Ø20mm × 1400mm along the X axis. 4 utensils hang ~250mm below."""
    rail_r = 0.010
    rail_len = 1.400
    rail_center = (0.0, 0.8, 2.0)
    # Cylinder long-axis is Z by default; rotate 90° about Y to lay along X.
    rail = add_cylinder("Kitchen_Rail", rail_r, rail_len, rail_center,
                        vertices=CYL_LO_SEG,
                        rotation=(0.0, math.radians(90.0), 0.0))
    assign_material(rail, steel)
    objs: list[bpy.types.Object] = [rail]

    util_z = rail_center[2] - 0.250  # 250 mm below the rail
    util_y = rail_center[1]
    spacings = (-0.500, -0.150, 0.180, 0.500)

    # Ladle — cylinder Ø15 × 200mm + small bowl primitive
    ladle_x = spacings[0]
    ladle = add_cylinder("Kitchen_UtensilLadle",
                         0.0075, 0.200,
                         (ladle_x, util_y, util_z),
                         vertices=CYL_LO_SEG)
    assign_material(ladle, steel)
    objs.append(ladle)
    bowl = add_uv_sphere("Kitchen_UtensilLadleBowl", 0.035,
                         (ladle_x, util_y, util_z - 0.115),
                         segments=CYL_LO_SEG, rings=4)
    bowl.scale.z = 0.5
    bpy.context.view_layer.objects.active = bowl
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign_material(bowl, steel)
    objs.append(bowl)

    # Whisk — 3 thin curved tubes (approximate as 3 thin elongated boxes
    # rotated slightly around their hanging axis).
    whisk_x = spacings[1]
    for k, ang in enumerate((-0.25, 0.0, 0.25)):
        tube = add_box(f"Kitchen_UtensilWhisk{k + 1}",
                       (0.008, 0.008, 0.200),
                       (whisk_x, util_y, util_z),
                       rotation_z=ang)
        # Curve the tube slightly via a small Y tilt baked into rotation.
        tube.rotation_euler = (math.radians(8.0 * (k - 1)), 0.0, ang)
        bpy.context.view_layer.objects.active = tube
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
        assign_material(tube, steel)
        objs.append(tube)

    # Tongs — 2 long thin boxes
    tongs_x = spacings[2]
    for k, offs in enumerate((-0.010, 0.010)):
        prong = add_box(f"Kitchen_UtensilTongs{k + 1}",
                        (0.012, 0.012, 0.240),
                        (tongs_x + offs, util_y, util_z))
        assign_material(prong, steel)
        objs.append(prong)

    # Knife handle — tapered cube (approximate as a box, kept small).
    knife_x = spacings[3]
    knife = add_box("Kitchen_UtensilKnife",
                    (0.022, 0.022, 0.220),
                    (knife_x, util_y, util_z))
    assign_material(knife, steel)
    objs.append(knife)

    return objs


# --------------------------------------------------------------------------- #
# Pendants — 3 instances of (steel housing + emissive disc)
# --------------------------------------------------------------------------- #

def build_pendants(steel: bpy.types.Material,
                   bulb_mat: bpy.types.Material) -> list[bpy.types.Object]:
    """3 pendants. Three.js Y=3.4 (height) → Blender Z=3.4.
    Spec positions:
      [-1.2, 3.4, 0]   → Blender (-1.2, 0.0, 3.4)
      [0,    3.4, 0.3] → Blender ( 0.0, -0.3, 3.4)
      [1.2,  3.4, 0]   → Blender ( 1.2, 0.0, 3.4)
    """
    objs: list[bpy.types.Object] = []
    positions = [
        (-1.2, 0.0, 3.4),
        ( 0.0, -0.3, 3.4),
        ( 1.2, 0.0, 3.4),
    ]
    housing_r = 0.090
    housing_h = 0.250
    disc_r = 0.060
    disc_h = 0.005
    for i, (px, py, pz) in enumerate(positions):
        # Housing — cylinder Ø180 × 250mm. Centre is at the pendant z, so its
        # top is at pz + housing_h/2 and bottom at pz - housing_h/2.
        housing = add_cylinder(f"Kitchen_Pendant{i + 1}_Housing",
                               housing_r, housing_h,
                               (px, py, pz),
                               vertices=CYL_LO_SEG)
        assign_material(housing, steel)
        objs.append(housing)
        # Emissive disc — sits flush at the bottom of the housing.
        disc_z = pz - housing_h / 2.0 - disc_h / 2.0
        disc = add_cylinder(f"Kitchen_Pendant{i + 1}_Disc",
                            disc_r, disc_h,
                            (px, py, disc_z),
                            vertices=CYL_LO_SEG)
        assign_material(disc, bulb_mat)
        objs.append(disc)
    return objs


# --------------------------------------------------------------------------- #
# Architecture — floor, back wall, side wall, ceiling
# --------------------------------------------------------------------------- #

def build_architecture(concrete: bpy.types.Material,
                       tile: bpy.types.Material,
                       plaster: bpy.types.Material,
                       ) -> dict[str, bpy.types.Object]:
    """Build the 4 architectural planes. Return a dict keyed by purpose so
    UV scaling can be applied per-material after smart_project."""
    # Floor — XY plane at z=0, normal +Z (default).
    floor = add_plane("Kitchen_Floor",
                      (FLOOR_X, FLOOR_Y),
                      (0.0, 0.0, 0.0))
    assign_material(floor, concrete)

    # Back wall — at Blender y=+3.0 (Three.js z=-3.0), normal pointing +Z (Three) = -Y (Blender).
    # We rotate a plane 90° about X so its normal points -Y in Blender, then
    # translate to y=3.0. The plane size is 6m (X) × 3m (Z).
    back = add_plane("Kitchen_BackWall",
                     (BACK_WALL_X, BACK_WALL_Z),
                     (0.0, 3.0, BACK_WALL_Z / 2.0),
                     rotation=(math.radians(90.0), 0.0, 0.0))
    assign_material(back, tile)

    # Side wall — at Blender x=-4.0 (Three.js x=-4.0), normal +X.
    # Plane 4m (depth=Three.js -Z=Blender +Y) × 3m (height=Z).
    side = add_plane("Kitchen_SideWall",
                     (SIDE_WALL_Y, SIDE_WALL_Z),
                     (-4.0, 0.0, SIDE_WALL_Z / 2.0),
                     rotation=(math.radians(90.0), 0.0, math.radians(90.0)))
    assign_material(side, plaster)

    # Ceiling — at Three.js y=3.5 → Blender z=3.5. Plane 8m × 6m.
    # In Three.js, normal points -Y (down). The default plane has +Z normal;
    # rotate 180° about X to flip the normal to -Z (down in Blender), which
    # maps to -Y in Three.js after the exporter remap.
    ceil = add_plane("Kitchen_Ceiling",
                     (CEIL_X, CEIL_Y),
                     (0.0, 0.0, 3.5),
                     rotation=(math.radians(180.0), 0.0, 0.0))
    assign_material(ceil, plaster)

    return {"floor": floor, "back": back, "side": side, "ceil": ceil}


# --------------------------------------------------------------------------- #
# UV pass — smart project for walls, cube project for steel meshes
# --------------------------------------------------------------------------- #

def uv_unwrap_arch(arch: dict[str, bpy.types.Object]) -> None:
    """Smart-project every architectural plane, then scale UVs so the
    floor (concrete) tiles ``CONCRETE_TILE`` × and the back wall (tile)
    tiles ``TILE_WALL_TILE`` ×. Side wall + ceiling (plaster) stay 1×
    (matte plaster reads fine without repetition)."""
    for purpose, obj in arch.items():
        smart_uv_project(obj, angle_limit_deg=66.0, island_margin=0.02)
        if purpose == "floor":
            scale_uvs(obj, CONCRETE_TILE)
        elif purpose == "back":
            scale_uvs(obj, TILE_WALL_TILE)
        # side + ceil: leave at 1×


def uv_unwrap_steel(steel_objs: list[bpy.types.Object]) -> None:
    """Cube-project every steel mesh at 0.5 m cube size. Brushed-steel
    texture tiles isotropically across faces."""
    for obj in steel_objs:
        cube_uv_project(obj, cube_size=0.5)


def uv_unwrap_pendants_and_utensils(objs: list[bpy.types.Object]) -> None:
    """Smart-project pendants + utensils (they're small enough that cube
    projection seams would show)."""
    for obj in objs:
        smart_uv_project(obj, angle_limit_deg=66.0, island_margin=0.02)


# --------------------------------------------------------------------------- #
# Build entrypoint
# --------------------------------------------------------------------------- #

def build() -> None:
    clear_scene()

    # Materials
    steel = make_steel_material()
    concrete = make_concrete_material()
    tile = make_tile_material()
    plaster = make_plaster_material()
    bulb = make_pendant_bulb_material()

    # ---- Foreground hero ---------------------------------------------------
    hero_body, hero_welds = build_bt1875(
        steel,
        origin_xy=(0.0, 0.0),
        rotation_z=0.0,
        cyl_segments=CYL_HI_SEG,
        use_bevel=True,
        use_weld_curves=True,
        name_prefix="BT1875",
    )

    # ---- Background prep tables (mid quality) -----------------------------
    # Spec rotations are about the Three.js Y axis → Blender Z axis.
    # Three.js [-2.6, 0, -1.4] → Blender (-2.6, 1.4, 0); rot Y=+0.35 → rot Z=+0.35.
    prep2_body, _ = build_bt1875(
        steel,
        origin_xy=(-2.6, 1.4),
        rotation_z=0.35,
        cyl_segments=CYL_LO_SEG,
        use_bevel=False,
        use_weld_curves=False,
        name_prefix="PrepTable2",
        top_size=(1.400, 0.700, TOP_Z),
        apron_size=(1.380, 0.680, APRON_Z),
        shelf_size=(1.300, 0.650, SHELF_Z),
    )
    # Three.js [2.2, 0, -1.8] → Blender (2.2, 1.8, 0); rot Y=-0.5 → rot Z=-0.5.
    prep3_body, _ = build_bt1875(
        steel,
        origin_xy=(2.2, 1.8),
        rotation_z=-0.5,
        cyl_segments=CYL_LO_SEG,
        use_bevel=False,
        use_weld_curves=False,
        name_prefix="PrepTable3",
        top_size=(1.200, 0.600, TOP_Z),
        apron_size=(1.180, 0.580, APRON_Z),
        shelf_size=(1.100, 0.550, SHELF_Z),
    )

    # ---- Hood + ducting ---------------------------------------------------
    hood_objs = build_hood(steel)

    # ---- Wall shelving ----------------------------------------------------
    shelf_objs = build_wall_shelving(steel)

    # ---- Utensil rail + utensils ------------------------------------------
    rail_objs = build_utensil_rail(steel)

    # ---- Pendants ----------------------------------------------------------
    pendant_objs = build_pendants(steel, bulb)

    # ---- Architecture ------------------------------------------------------
    arch = build_architecture(concrete, tile, plaster)

    # ---- UV pass ----------------------------------------------------------
    # Architecture: smart project + scale tiling for concrete/tile.
    uv_unwrap_arch(arch)
    # Steel: cube project on every steel-skinned object so the brushed
    # texture tiles across faces.
    steel_objs = [
        hero_body, prep2_body, prep3_body,
        *hood_objs, *shelf_objs, *rail_objs,
    ]
    uv_unwrap_steel(steel_objs)
    # Pendants — smart project (housings + discs).
    uv_unwrap_pendants_and_utensils(pendant_objs)

    # ---- Apply all remaining modifiers ------------------------------------
    # Most modifier-bearing objects are already baked in their builders;
    # this is a safety net for the hood (which still carries BevelHood).
    for o in list(bpy.data.objects):
        if o.type == 'MESH' and o.modifiers:
            apply_modifiers(o)

    # ---- Triangulate every mesh -------------------------------------------
    mesh_objs = [o for o in bpy.data.objects if o.type == 'MESH']
    for o in mesh_objs:
        triangulate(o)

    # ---- Polycount audit --------------------------------------------------
    total_tris = 0
    for o in mesh_objs:
        o.data.calc_loop_triangles()
        n = len(o.data.loop_triangles)
        total_tris += n
        # Per-mesh trace (sorted summary printed below).
    print(f"[kitchen] total triangles (decoded): {total_tris}")
    if total_tris > 20000:
        print(f"[kitchen] WARNING: {total_tris} > 20k tri budget")

    # ---- Selection for export: every mesh, no curves ----------------------
    bpy.ops.object.select_all(action='DESELECT')
    for o in mesh_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objs[0]

    # Sanity: every weld curve from the hero table should be unselected so
    # ``use_selection=True`` skips them. The weld curves never made it into
    # ``mesh_objs`` (CURVE type), so they're already excluded; but be
    # explicit to keep the audit trail clear:
    for c in hero_welds:
        if c.name in bpy.data.objects:
            bpy.data.objects[c.name].select_set(False)

    # ---- Export -----------------------------------------------------------
    out = str(OUTPUT_PATH)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    print(f"[kitchen] exporting -> {out}")
    bpy.ops.export_scene.gltf(
        filepath=out,
        export_format='GLB',
        export_apply=True,
        export_image_format='NONE',     # textures load at runtime
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=12,
        export_draco_normal_quantization=8,
        export_draco_texcoord_quantization=12,
        export_lights=False,
        export_cameras=False,
        export_extras=True,             # preserve mesh.material names
        use_selection=True,             # skip curves
        export_animations=False,
    )

    size = os.path.getsize(out)
    print(f"[kitchen] done. file size: {size} bytes "
          f"({size / 1024:.1f} KB; budget 500 KB)")

    # Final material name audit — these names are LOAD-BEARING.
    expected = {"STEEL", "CONCRETE", "TILE", "PLASTER", "PENDANT_BULB"}
    present = {m.name for m in bpy.data.materials}
    missing = expected - present
    if missing:
        print(f"[kitchen] ERROR: missing materials: {missing}")
    else:
        print(f"[kitchen] materials OK: {sorted(expected)}")


if __name__ == "__main__":
    build()
