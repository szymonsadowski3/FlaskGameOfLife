from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html', rows=10, cols=10)


@app.route('/grid/<int:rows>/<int:cols>')
def serve_grid(rows, cols):
    return render_template('index.html', rows=rows, cols=cols)


if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
