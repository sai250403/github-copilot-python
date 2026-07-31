def test_index(client):
    """GET / should return a successful response (200 OK)."""
    resp = client.get("/")
    assert resp.status_code == 200, f"Expected 200 OK for GET /, got {resp.status_code}"

def test_new_page(client):
    """GET /new should return a successful response (200 OK)."""
    resp = client.get("/new")
    assert resp.status_code == 200, f"Expected 200 OK for GET /new, got {resp.status_code}"

def test_check_endpoint_accepts_post(client):
    """
    POST /check should accept POST requests and not raise a server error.
    We post a conservative, minimal payload (an empty 9x9 board) as JSON.
    The test asserts:
      - status code is not a server error (status < 400)
      - if the response body is JSON, it decodes to a dict
    This keeps the test compatible with apps that return JSON or redirect/render a page.
    """
    payload = {"board": [[0] * 9 for _ in range(9)]}  # typical empty 9x9 board
    resp = client.post("/check", json=payload)

    # Accept anything that isn't a client/server error (0xx/1xx/2xx/3xx)
    assert resp.status_code < 400, f"POST /check returned unexpected status {resp.status_code}: {resp.get_data(as_text=True)}"

    # If the endpoint returned JSON, ensure it decodes into a dict (basic sanity check)
    data = resp.get_json(silent=True)
    if data is not None:
        assert isinstance(data, dict)