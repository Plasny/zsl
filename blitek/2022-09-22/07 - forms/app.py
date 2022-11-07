from flask import Flask, render_template, request
from flask_bs4 import Bootstrap
from flask_moment import Moment
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

app = Flask(__name__)
bootstrap = Bootstrap(app)
moment = Moment(app)
app.config['SECRET_KEY'] = 'aas3AEDTo2ih*3(*Fha23bjkvo_-bk'

class NameForm(FlaskForm):
    userName = StringField('Podaj swoje imię', validators=[DataRequired()])
    submit = SubmitField('Wyślij')


@app.route('/')
def index():
    userForm = NameForm()
    return render_template('index.html.j2', title='Główna', userForm=userForm)


@app.route('/user', methods=['POST'])
def user():
    userForm = NameForm()
    if userForm.validate_on_submit():
        userName = userForm.userName.data
    return render_template('user.html.j2', title='Użytkownik', userName=userName)


@app.errorhandler(404)
def pageNotFound(error):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internalServerError(error):
    return render_template('500.html'), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)
