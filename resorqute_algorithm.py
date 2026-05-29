"""
ResorQute AI - Smart Emergency Navigation Algorithm
====================================================
Database: india_amenities.db
Tables: hospitals (49,992), police_stations (2,829), puncture_shops (0 - future)

This module provides:
  1. Haversine distance calculation
  2. Spatial indexing via grid cells (fast nearest-neighbor)
  3. find_nearest() - core algorithm
  4. emergency_response() - full pipeline with ranked results
"""

import sqlite3
import math
from typing import Optional

# ─── Constants ────────────────────────────────────────────────────────────────

DB_PATH = "india_amenities.db"   # Change path if needed

EARTH_RADIUS_KM = 6371.0         # Mean radius of Earth

# Grid cell size in degrees (~11 km at equator; good trade-off for India)
GRID_CELL_DEG = 0.1

# How many grid rings to expand when no result found in center cell
MAX_GRID_RINGS = 5

# ─── Haversine Distance ────────────────────────────────────────────────────────

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Returns the great-circle distance in kilometres between two GPS points.

    Formula:
        a = sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2)
        d = 2R · arcsin(√a)
    """
    # Convert degrees → radians
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi       = math.radians(lat2 - lat1)
    dlambda    = math.radians(lon2 - lon1)

    a = (math.sin(dphi / 2) ** 2
         + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2)

    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(a))


# ─── Spatial Index (Grid-based) ───────────────────────────────────────────────

class SpatialIndex:
    """
    Lightweight in-memory spatial grid index.

    How it works:
      - Divides lat/lon space into GRID_CELL_DEG × GRID_CELL_DEG cells.
      - Each cell stores a list of (id, lat, lon, name) tuples.
      - Query: check cells in expanding rings until k results collected.

    Why not KD-Tree?
      - This is simple, fast to build, and has zero external dependencies.
      - For ~50 K points a grid beats a brute-force scan by 100–200×.
    """

    def __init__(self):
        self._grid: dict[tuple[int, int], list] = {}

    def _cell(self, lat: float, lon: float) -> tuple[int, int]:
        return (int(math.floor(lat / GRID_CELL_DEG)),
                int(math.floor(lon / GRID_CELL_DEG)))

    def insert(self, record_id: str, lat: float, lon: float, name: str):
        cell = self._cell(lat, lon)
        if cell not in self._grid:
            self._grid[cell] = []
        self._grid[cell].append((record_id, lat, lon, name))

    def query_nearest(
        self,
        lat: float,
        lon: float,
        k: int = 5,
        max_distance_km: float = 50.0
    ) -> list[dict]:
        """
        Returns up to k nearest records within max_distance_km,
        sorted by distance ascending.
        """
        cx, cy = self._cell(lat, lon)
        candidates = []

        for ring in range(MAX_GRID_RINGS + 1):
            # Collect all cells in this ring
            if ring == 0:
                cells = [(cx, cy)]
            else:
                cells = []
                for dx in range(-ring, ring + 1):
                    for dy in range(-ring, ring + 1):
                        if abs(dx) == ring or abs(dy) == ring:
                            cells.append((cx + dx, cy + dy))

            for cell in cells:
                for record in self._grid.get(cell, []):
                    rid, rlat, rlon, rname = record
                    dist = haversine(lat, lon, rlat, rlon)
                    if dist <= max_distance_km:
                        candidates.append({
                            "id":       rid,
                            "name":     rname,
                            "lat":      rlat,
                            "lon":      rlon,
                            "distance_km": round(dist, 3)
                        })

            # Early stop: if we already have k results and expanded enough
            if len(candidates) >= k and ring >= 1:
                break

        # Sort by distance, return top-k
        candidates.sort(key=lambda x: x["distance_km"])
        return candidates[:k]


# ─── Index Builder ────────────────────────────────────────────────────────────

_INDEXES: dict[str, SpatialIndex] = {}   # Cache: table_name → SpatialIndex

def _build_index(table: str, db_path: str = DB_PATH) -> SpatialIndex:
    """Load a table from SQLite into a SpatialIndex (cached after first load)."""
    if table in _INDEXES:
        return _INDEXES[table]

    idx = SpatialIndex()
    conn = sqlite3.connect(db_path)
    cur  = conn.cursor()
    cur.execute(f"SELECT id, lat, lon, name FROM {table}")
    for row in cur.fetchall():
        rid, lat, lon, name = row
        if lat is not None and lon is not None:
            idx.insert(str(rid), lat, lon, name or "Unknown")
    conn.close()

    _INDEXES[table] = idx
    print(f"[Index] Built index for '{table}'.")
    return idx


# ─── Core API ─────────────────────────────────────────────────────────────────

SUPPORTED_TYPES = {
    "hospital":      "hospitals",
    "police":        "police_stations",
    "puncture_shop": "puncture_shops",
}

def find_nearest(
    user_lat: float,
    user_lon: float,
    emergency_type: str = "hospital",
    top_k: int = 5,
    max_distance_km: float = 50.0,
    db_path: str = DB_PATH
) -> list[dict]:
    """
    Find the nearest emergency facility for a given GPS location.

    Parameters
    ----------
    user_lat       : float  - Latitude of the user
    user_lon       : float  - Longitude of the user
    emergency_type : str    - One of: 'hospital', 'police', 'puncture_shop'
    top_k          : int    - Number of results to return (default 5)
    max_distance_km: float  - Search radius in km (default 50)
    db_path        : str    - Path to SQLite database

    Returns
    -------
    List of dicts: [{id, name, lat, lon, distance_km}, ...]
    Sorted nearest-first.
    """
    table = SUPPORTED_TYPES.get(emergency_type.lower())
    if table is None:
        raise ValueError(f"Unknown emergency_type '{emergency_type}'. "
                         f"Choose from: {list(SUPPORTED_TYPES.keys())}")

    idx = _build_index(table, db_path)
    return idx.query_nearest(user_lat, user_lon, k=top_k,
                             max_distance_km=max_distance_km)


def emergency_response(
    user_lat: float,
    user_lon: float,
    emergency_type: str = "hospital",
    top_k: int = 3,
    db_path: str = DB_PATH
) -> dict:
    """
    Full emergency response pipeline.

    Returns a structured response with:
      - nearest facilities ranked by distance
      - navigation hint (bearing direction)
      - status message
    """
    results = find_nearest(user_lat, user_lon, emergency_type,
                           top_k=top_k, db_path=db_path)

    if not results:
        return {
            "status":  "NOT_FOUND",
            "message": f"No {emergency_type} found within 50 km.",
            "results": []
        }

    # Add compass bearing to each result
    for r in results:
        r["bearing_deg"]   = _bearing(user_lat, user_lon, r["lat"], r["lon"])
        r["direction"]     = _compass(r["bearing_deg"])
        r["eta_minutes"]   = _eta(r["distance_km"])

    nearest = results[0]
    return {
        "status":    "FOUND",
        "message":   (f"Nearest {emergency_type}: {nearest['name']} "
                      f"({nearest['distance_km']} km {nearest['direction']})"),
        "nearest":   nearest,
        "all_results": results
    }


# ─── Helper Functions ──────────────────────────────────────────────────────────

def _bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Initial compass bearing from point 1 → point 2 (degrees, 0=North)."""
    phi1     = math.radians(lat1)
    phi2     = math.radians(lat2)
    dlambda  = math.radians(lon2 - lon1)
    x = math.sin(dlambda) * math.cos(phi2)
    y = (math.cos(phi1) * math.sin(phi2)
         - math.sin(phi1) * math.cos(phi2) * math.cos(dlambda))
    return (math.degrees(math.atan2(x, y)) + 360) % 360


def _compass(bearing: float) -> str:
    """Convert bearing degrees to 8-point compass direction."""
    dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    return dirs[round(bearing / 45) % 8]


def _eta(distance_km: float, avg_speed_kmh: float = 40) -> int:
    """Estimated travel time in minutes at given average speed."""
    return max(1, round((distance_km / avg_speed_kmh) * 60))


# ─── Demo ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import json

    # Test location: Vijayawada, Andhra Pradesh
    TEST_LAT = 16.5062
    TEST_LON = 80.6480

    print("=" * 60)
    print("  ResorQute AI — Emergency Navigation Demo")
    print("=" * 60)
    print(f"  User location: {TEST_LAT}, {TEST_LON} (Vijayawada)\n")

    for etype in ["hospital", "police"]:
        print(f"\n🔍 Finding nearest {etype.upper()}...")
        response = emergency_response(TEST_LAT, TEST_LON,
                                      emergency_type=etype, top_k=3)
        print(f"Status : {response['status']}")
        print(f"Message: {response['message']}")
        print("Top results:")
        for i, r in enumerate(response["all_results"], 1):
            print(f"  {i}. {r['name']}")
            print(f"     Distance : {r['distance_km']} km  {r['direction']}")
            print(f"     ETA      : ~{r['eta_minutes']} min")
            print(f"     Coords   : {r['lat']}, {r['lon']}")
