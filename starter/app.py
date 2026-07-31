from flask import Flask, render_template, jsonify, request
import sudoku_logic
from game_state import CURRENT

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/new")
def new_game():
    difficulty = request.args.get("difficulty", "medium").lower()

    difficulty_levels = {
        "easy": 40,
        "medium": 32,
        "hard": 25
    }

    clues = difficulty_levels.get(difficulty, 32)

    puzzle, solution = sudoku_logic.generate_puzzle(clues)

    CURRENT["puzzle"] = puzzle
    CURRENT["solution"] = solution

    return jsonify({
        "puzzle": puzzle,
        "solution": solution
    })


@app.route("/check", methods=["POST"])
def check_solution():

    data = request.get_json()

    board = data.get("board")
    solution = CURRENT.get("solution")

    if solution is None:
        return jsonify({
            "error": "No game in progress"
        }), 400

    incorrect = []

    for i in range(sudoku_logic.SIZE):
        for j in range(sudoku_logic.SIZE):

            if board[i][j] != solution[i][j]:
                incorrect.append([i, j])

    return jsonify({
        "correct": len(incorrect) == 0,
        "incorrect": incorrect
    })


@app.route("/hint")
def hint():

    puzzle = CURRENT.get("puzzle")
    solution = CURRENT.get("solution")

    if puzzle is None or solution is None:
        return jsonify({
            "error": "No active game"
        }), 400

    for i in range(sudoku_logic.SIZE):
        for j in range(sudoku_logic.SIZE):

            if puzzle[i][j] == 0:

                puzzle[i][j] = solution[i][j]

                return jsonify({
                    "row": i,
                    "col": j,
                    "value": solution[i][j]
                })

    return jsonify({
        "message": "Puzzle already complete"
    })


if __name__ == "__main__":
    app.run(debug=True)