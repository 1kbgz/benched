import threading
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import pytest

from benched.serve import ServeError, create_server


def test_preview_server_serves_directory_on_dynamic_port_and_is_read_only(tmp_path):
    (tmp_path / "index.html").write_text("<h1>report</h1>", encoding="utf-8")
    server = create_server(tmp_path, port=0)
    thread = threading.Thread(target=server.serve_forever)
    thread.start()
    try:
        port = server.server_address[1]
        assert port > 0
        with urlopen(f"http://127.0.0.1:{port}/", timeout=2) as response:
            assert response.read() == b"<h1>report</h1>"
        with pytest.raises(HTTPError) as error:
            urlopen(Request(f"http://127.0.0.1:{port}/", method="POST"), timeout=2)
        assert error.value.code == 405
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def test_preview_server_rejects_missing_directory(tmp_path):
    with pytest.raises(ServeError, match="report directory not found"):
        create_server(tmp_path / "missing")
