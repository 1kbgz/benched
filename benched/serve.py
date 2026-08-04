from __future__ import annotations

import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class ServeError(ValueError):
    """Raised when static report output cannot be served."""


class ReportRequestHandler(SimpleHTTPRequestHandler):
    def _read_only(self) -> None:
        self.send_error(405, "report preview is read-only")

    do_DELETE = _read_only
    do_PATCH = _read_only
    do_POST = _read_only
    do_PUT = _read_only


def create_server(directory: str | Path, *, host: str = "127.0.0.1", port: int = 0) -> ThreadingHTTPServer:
    root = Path(directory).resolve()
    if not root.is_dir():
        raise ServeError(f"report directory not found: {root}")
    handler = partial(ReportRequestHandler, directory=str(root))
    server = ThreadingHTTPServer((host, port), handler)
    server.daemon_threads = True
    return server


def serve(directory: str | Path, *, host: str = "127.0.0.1", port: int = 0, open_browser: bool = False) -> None:
    server = create_server(directory, host=host, port=port)
    address, selected_port = server.server_address[:2]
    url = f"http://{address}:{selected_port}/"
    print(f"Serving Benched report at {url}")
    if open_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
