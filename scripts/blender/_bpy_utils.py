"""Shared helpers for Steel Valley Blender build scripts.

Three helpers used by both build-bt1875.py and build-edge-monument.py:

1. ``unshare_and_add_barycentric(obj)``
   Un-shares every vertex on a triangle mesh (each triangle gets its own three
   verts, none shared with neighbours) and writes a per-vertex
   ``_BARY`` FLOAT_VECTOR attribute with values ``(1,0,0)``, ``(0,1,0)``,
   ``(0,0,1)`` for the three corners of every triangle. The runtime shader
   uses ``fwidth(_BARY)`` to draw the wireframe edge mask
   (spec § 3 shader, § 4 "Barycentric attribute injection").

   **Naming note for the runtime team:** glTF 2.0 requires custom attributes
   to start with an underscore; Blender's gltf exporter silently drops any
   attribute that doesn't follow that convention even when
   ``export_attributes=True``. So the attribute lives as ``_BARY`` inside
   the GLB. When Three.js loads it via ``useGLTF`` the BufferGeometry
   attribute is named ``_BARY`` — either reference it as
   ``geometry.attributes._BARY`` in the shader, or rename it to ``a_bary``
   on load:
   ``geometry.setAttribute('a_bary', geometry.getAttribute('_BARY'))``.

2. ``paint_weld_vertex_colors(obj, weld_curves, radius_mm)``
   For every vertex of ``obj``, paints the active ``Col`` byte-color attribute
   red ``(1,0,0,1)`` if the vertex is within ``radius_mm`` of any control point
   on any curve in ``weld_curves``; otherwise paints it black ``(0,0,0,1)``.
   The runtime shader reads ``vColor.r`` to drive ``u_heat`` emissive
   (spec § 4 "Vertex color attribute for weld groups").

3. ``export_glb_draco(filepath, selected_only=True)``
   Wraps ``bpy.ops.export_scene.gltf`` with the exact spec § 4 settings:
   GLB, apply modifiers, vertex colors + custom attributes, JPEG @ 85%,
   Draco level 8 (position 12 / normal 8 / texcoord 10), no lights, no
   cameras. Blender 5.1.1 names the relevant kwargs ``export_all_vertex_colors``
   and ``export_attributes`` — earlier docs (and the spec snippet) used
   ``export_colors`` which was deprecated; this helper uses the live names.

Blender unit convention used throughout: 1 BU = 1 metre. All public mm
inputs are converted to metres by multiplying by ``1e-3``.
"""

from __future__ import annotations

import math
from typing import Iterable, Sequence

import bpy
import bmesh
from mathutils import Vector


# --------------------------------------------------------------------------- #
# 1. Barycentric attribute injection
# --------------------------------------------------------------------------- #

def unshare_and_add_barycentric(obj: bpy.types.Object) -> None:
    """Split every triangle so each face owns its three verts, then write a
    per-point FLOAT_VECTOR attribute ``a_bary`` holding the canonical
    barycentric basis for the three corners of every triangle.

    Must be called *after* the mesh has been triangulated. The function
    triangulates again defensively (a no-op if the mesh is already tris).

    Effect on vertex count: roughly ``3 * triangle_count``. This is expected
    and budgeted (spec § 4: <12k tris on BT-1875 → ~36k verts is fine).
    """
    if obj.type != 'MESH':
        raise TypeError(
            f"unshare_and_add_barycentric: expected MESH object, "
            f"got {obj.type} for {obj.name!r}"
        )

    mesh = obj.data

    # Enter edit mode on this object, split every face, triangulate, leave.
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    bm = bmesh.new()
    bm.from_mesh(mesh)
    # Triangulate first so we know every face has 3 loops.
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    # Split: every face becomes an island — no vertex is shared between two
    # faces. ``split_edges`` on ALL edges achieves this cleanly.
    bmesh.ops.split_edges(bm, edges=bm.edges[:])
    bm.to_mesh(mesh)
    bm.free()

    # The mesh now has exactly 3 verts per tri. Build the barycentric buffer
    # in loop-order, then write it to a POINT-domain attribute.
    # After split_edges, loops index into unique verts, so we can write the
    # attribute on the POINT domain by walking loops and stamping each loop's
    # vertex index with (1,0,0) / (0,1,0) / (0,0,1) according to its slot in
    # the triangle.
    mesh.calc_loop_triangles()  # ensure loop_triangles is current

    # The attribute must be named with a leading underscore so the glTF
    # exporter passes it through (glTF custom-attribute naming convention).
    attr_name = "_BARY"
    if attr_name in mesh.attributes:
        mesh.attributes.remove(mesh.attributes[attr_name])
    attr = mesh.attributes.new(name=attr_name, type='FLOAT_VECTOR', domain='POINT')

    # Default to (0,0,0); fill via tri loops.
    nverts = len(mesh.vertices)
    flat = [0.0] * (3 * nverts)

    basis = ((1.0, 0.0, 0.0), (0.0, 1.0, 0.0), (0.0, 0.0, 1.0))

    for tri in mesh.loop_triangles:
        for slot in range(3):
            loop_idx = tri.loops[slot]
            vi = mesh.loops[loop_idx].vertex_index
            bx, by, bz = basis[slot]
            flat[3 * vi + 0] = bx
            flat[3 * vi + 1] = by
            flat[3 * vi + 2] = bz

    attr.data.foreach_set("vector", flat)
    mesh.update()


# --------------------------------------------------------------------------- #
# 2. Vertex-colour painting for weld groups
# --------------------------------------------------------------------------- #

def _curve_sample_points_world(curve_obj: bpy.types.Object,
                               samples_per_segment: int = 12) -> list[Vector]:
    """Return world-space sample points along every spline of a curve object.

    Walks each spline's bezier_points and resamples each bezier segment with
    ``samples_per_segment`` evaluations along the Bernstein basis. This
    covers the curve densely enough that a ``radius_mm`` proximity test in
    ``paint_weld_vertex_colors`` is reliable for the short (~80mm) beads
    used by both build scripts.
    """
    pts: list[Vector] = []
    mw = curve_obj.matrix_world

    if curve_obj.type != 'CURVE':
        return pts

    for spline in curve_obj.data.splines:
        bps = list(spline.bezier_points)
        if len(bps) < 2:
            # Degenerate; still record control points.
            for bp in bps:
                pts.append(mw @ bp.co)
            continue
        for i in range(len(bps) - 1):
            p0 = bps[i].co
            p1 = bps[i].handle_right
            p2 = bps[i + 1].handle_left
            p3 = bps[i + 1].co
            for s in range(samples_per_segment + 1):
                t = s / samples_per_segment
                u = 1.0 - t
                # Cubic Bernstein
                b = (u * u * u) * p0 \
                    + (3 * u * u * t) * p1 \
                    + (3 * u * t * t) * p2 \
                    + (t * t * t) * p3
                pts.append(mw @ b)
    return pts


def paint_weld_vertex_colors(obj: bpy.types.Object,
                             weld_curves: Sequence[bpy.types.Object],
                             radius_mm: float = 5.0) -> None:
    """Paint the active ``Col`` byte-color attribute on ``obj``:

    * red ``(1, 0, 0, 1)`` if the vertex is within ``radius_mm`` of any
      sampled point along any curve in ``weld_curves``.
    * black ``(0, 0, 0, 1)`` otherwise.

    The shader downstream reads ``vColor.r`` to drive ``u_heat`` (spec § 3).
    Radius is in **millimetres**; converted to BU (metres) inside.
    """
    if obj.type != 'MESH':
        raise TypeError(
            f"paint_weld_vertex_colors: expected MESH object, "
            f"got {obj.type} for {obj.name!r}"
        )

    mesh = obj.data
    radius_bu = radius_mm * 1e-3
    radius_sq = radius_bu * radius_bu

    # Pre-sample every curve once.
    samples: list[Vector] = []
    for c in weld_curves:
        samples.extend(_curve_sample_points_world(c))

    # Make sure there's a byte-colour ``Col`` attribute on POINT domain.
    if "Col" in mesh.color_attributes:
        col_attr = mesh.color_attributes["Col"]
    else:
        col_attr = mesh.color_attributes.new(
            name="Col", type='BYTE_COLOR', domain='POINT',
        )
    mesh.color_attributes.active_color = col_attr
    # Also mark as the render-active color so the GLB exporter picks it up.
    mesh.attributes.active_color = col_attr

    mw = obj.matrix_world
    flat = [0.0] * (4 * len(mesh.vertices))

    if not samples:
        # No weld curves — everything stays black.
        for i in range(len(mesh.vertices)):
            flat[4 * i + 3] = 1.0  # alpha
        col_attr.data.foreach_set("color", flat)
        return

    # O(V * S). With ~12k verts × a few hundred samples this stays well
    # under a second; no need for a KD-tree for build-time work.
    for vi, v in enumerate(mesh.vertices):
        wp = mw @ v.co
        hit = False
        for sp in samples:
            dx = wp.x - sp.x
            dy = wp.y - sp.y
            dz = wp.z - sp.z
            if (dx * dx + dy * dy + dz * dz) <= radius_sq:
                hit = True
                break
        if hit:
            flat[4 * vi + 0] = 1.0   # R
            flat[4 * vi + 1] = 0.0   # G
            flat[4 * vi + 2] = 0.0   # B
        flat[4 * vi + 3] = 1.0       # A

    col_attr.data.foreach_set("color", flat)
    mesh.update()


# --------------------------------------------------------------------------- #
# 3. GLB + Draco export wrapper
# --------------------------------------------------------------------------- #

def export_glb_draco(filepath: str, selected_only: bool = True) -> None:
    """Run ``bpy.ops.export_scene.gltf`` with the spec § 4 settings.

    Blender 5.1.1 kwarg names differ from the spec snippet in two places:
    * ``export_colors`` (legacy) -> ``export_all_vertex_colors`` + an
      active-color export flag.
    * ``selected_only`` is exposed as ``use_selection``.

    Custom attributes (``a_bary``) require ``export_attributes=True``; the
    Blender exporter prefixes non-standard attributes with ``_`` in the
    output glTF — the runtime shader looks for ``a_bary`` and Three.js will
    surface it under that name when re-imported.
    """
    # Ensure the parent dir exists; callers pass absolute paths.
    import os
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        export_apply=True,                              # bake modifiers
        # vertex colour export (replaces deprecated export_colors)
        export_vertex_color='ACTIVE',
        export_all_vertex_colors=True,
        export_active_vertex_color_when_no_material=True,
        # custom mesh attributes (a_bary)
        export_attributes=True,
        # image / texture pipeline
        export_image_format='JPEG',
        export_jpeg_quality=85,
        export_image_quality=85,
        # Draco compression
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=8,
        export_draco_position_quantization=12,
        export_draco_normal_quantization=8,
        export_draco_texcoord_quantization=10,
        # never include lights / cameras (runtime supplies its own)
        export_lights=False,
        export_cameras=False,
        # selection scoping
        use_selection=selected_only,
        # no animations to export — pure static geometry
        export_animations=False,
        # (export_loglevel intentionally omitted — Blender 5.1.1's gltf
        # addon has a bug where supplying the kwarg fails to populate the
        # internal settings dict; leaving it at default keeps export quiet.)
    )
