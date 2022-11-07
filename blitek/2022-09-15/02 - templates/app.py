from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
#    return '<h2>Witaj Flask!!!</h2>'
    return render_template('index.html', title='Main page')

@app.route('/user/<name>')
def user(name):
#    return '<h2>Witaj, {}!!!</h2>'.format(name)
    return render_template('index.html', title='Użytkownik', name=name)

if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5555)