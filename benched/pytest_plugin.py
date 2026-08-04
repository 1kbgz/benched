from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from . import __version__


def pytest_benchmark_update_json(config: Any, benchmarks: Any, output_json: dict[str, Any]) -> None:
    output_json["benched"] = {"version": __version__}


def pytest_collection_finish(session: Any) -> None:
    output_path = os.environ.get("BENCHED_COLLECTION_PATH")
    if output_path:
        nodeids = [item.nodeid for item in session.items if "benchmark" in getattr(item, "fixturenames", ())]
        Path(output_path).write_text(json.dumps(nodeids), encoding="utf-8")
