from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_bs4 import Bootstrap
from flask_moment import Moment
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, FloatField
from wtforms.validators import DataRequired

app = Flask(__name__)
bootstrap = Bootstrap(app)
moment = Moment(app)
app.config['SECRET_KEY'] = 'aas3AEDTo2ih*3(*Fha23bjkvo_-bk'

class NameForm(FlaskForm):
    userName = StringField('Podaj swoje imię', validators=[DataRequired()])
    submit = SubmitField('Wyślij')


class FunctionForm(FlaskForm):
    a = FloatField('Podaj a:', validators=[DataRequired()])
    b = FloatField('Podaj b:', validators=[DataRequired()])
    c = FloatField('Podaj c:', validators=[DataRequired()])
    submit = SubmitField('Oblicz!')

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


@app.route('/setSession', methods=['POST', 'GET'])
def setSession():
    userForm = NameForm()
    if userForm.validate_on_submit():
        oldName = session.get('userName')
        if oldName is not None and oldName != userForm.userName.data:
            flash('Wygląda na to, że zmieniłeś imię')
        session['userName'] = userForm.userName.data
        return redirect(url_for('setSession'))
    return render_template('session.html.j2', title='Zastosowanie sesji', userForm = userForm, userName = session.get('userName'))


@app.route('/funkcja', methods=['POST', 'GET'])
def funkcja():
    userForm = FunctionForm()
    if userForm.validate_on_submit():
        a = userForm.a.data
        b = userForm.b.data
        c = userForm.c.data
        if a is not None and b is not None and c is not None:
            delta = (b**2) - (4*a*c)
            # print(delta, a, b, c)
            if delta > 0:
                x1 = ( -b - delta**0.5)/(2*a)
                x2 = ( -b + delta**0.5)/(2*a)
            elif delta == 0:
                x1 = x2 = (-b)/(2*a)
            else:
                return redirect(url_for('funkcja'))
        return render_template('funkcja.html.j2', title="Funkcja", userForm=userForm, x1=x1, x2=x2)
    return render_template('funkcja.html.j2', title="Funkcja", userForm=userForm, x1="", x2="")


@app.errorhandler(404)
def pageNotFound(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internalServerError(error):
    return render_template('500.html'), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)
