from flask import Flask, render_template
from flask_bs4 import Bootstrap

app = Flask(__name__)
bootstrap = Bootstrap(app)


@app.route('/')
def index():
    return render_template('index.html', title='Główna')


@app.route('/user/<name>')
def user(name):
    return render_template('index.html', title='Użytkownik', name=name)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555)
