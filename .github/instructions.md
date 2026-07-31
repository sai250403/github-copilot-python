# GitHub Copilot Instructions

## Project Overview
This project is a Flask-based Sudoku web application with an HTML, CSS, and JavaScript frontend.

## Coding Guidelines
- Write clean, readable, and maintainable code.
- Keep functions small and focused on a single responsibility.
- Follow existing project structure and naming conventions.
- Avoid unnecessary dependencies.
- Preserve current functionality while making improvements.

## Frontend
- Use vanilla JavaScript.
- Keep the UI responsive.
- Maintain compatibility with desktop and mobile browsers.
- Use meaningful variable and function names.

## Backend
- Keep Flask routes simple and RESTful.
- Validate request data where appropriate.
- Return JSON responses for API endpoints.
- Do not modify Sudoku generation logic unless necessary.

## Features
- Support Easy, Medium, and Hard difficulty levels.
- Provide hints without revealing the full puzzle.
- Validate user solutions.
- Track solving time.
- Save the Top 10 leaderboard using localStorage.
- Support dark mode.

## Testing
- Maintain compatibility with the existing pytest test suite.
- Ensure changes do not break existing functionality.

## General
- Prefer readability over clever implementations.
- Add comments only where they improve understanding.
- Suggest refactoring when duplicate code exists.

Sudoku/
│
├── .github/
│   ├── instructions.md
│   └── copilot-instructions.md   (optional)
│
├── starter/
│   ├── app.py
│   ├── static/
│   ├── templates/
│   └── tests/
