from flask import jsonify

from flask import Flask, render_template, request
from simulator import GameOfLifeSimulator

app = Flask(__name__)

simulator = GameOfLifeSimulator()


@app.route('/')
def hello_world():
    return render_template('index.html', rows=10, cols=10)


@app.route('/grid')
def serve_grid():
    rows = request.args.get('rows')
    cols = request.args.get('cols')
    return render_template('index.html', rows=rows, cols=cols, filler_width=int(830/int(rows)))


@app.route('/next_grid', methods=['POST'])
def serve_next_grid():
    json_obj = request.get_json(force=True)
    grid = json_obj['grid']
    simulator.simulate(grid)
    return jsonify(grid)

if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
