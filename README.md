# FeatherMetrics Backend

This is the Django backend for the FeatherMetrics app. It provides RESTful API endpoints for flock management, egg/mortality/feed logs, sales, and expenses.

## Setup

1. Create a virtual environment:
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```sh
   python manage.py migrate
   ```
4. Start the server:
   ```sh
   python manage.py runserver
   ```

## API Endpoints

- `/api/flocks/` (GET, POST)
- `/api/flocks/<id>/` (GET, PUT, DELETE)
- `/api/flocks/<id>/egg-logs/` (GET, POST)
- `/api/flocks/<id>/mortality-logs/` (GET, POST)
- `/api/flocks/<id>/feed-logs/` (GET, POST)
- `/api/flocks/<id>/sales/` (GET, POST)
- `/api/flocks/<id>/expenses/` (GET, POST) 