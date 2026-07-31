import os
import sys
import pytest

# Add the project root (starter/) to Python's import path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app as flask_app


@pytest.fixture(scope="session")
def app():
    """Return the Flask app configured for testing."""
    flask_app.config["TESTING"] = True
    return flask_app


@pytest.fixture
def client(app):
    """Provide a Flask test client."""
    with app.test_client() as client:
        with app.app_context():
            yield client