from flask import Flask, render_template, request, session, redirect, url_for, \
    flash, json
from flask_bs4 import Bootstrap
from flask_moment import Moment
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, PasswordField
from wtforms.validators import DataRequired
from math import sqrt

app = Flask(__name__)
bootstrap = Bootstrap(app)
moment = Moment(app)
app.config['SECRET_KEY'] = 'ghj5678(*^678&*(hjk&*JKLwkl12naeI(**$2'
date = datetime.now()

class LoginForm(FlaskForm):
    """formularz logowania"""
    userLogin = StringField('Nazwa użtkownika:', validators=[DataRequired()])
    userPass = PasswordField('Hasło:', validators=[DataRequired()])
    submit = SubmitField('Zaloguj')

users = {
    1: {
        'userLogin': 'test',
        'userPass': 'test',
        'fname': 'Paweł',
        'lname': 'Pasternak'
    }
}

def countAverage(subjectValue, termValue):
    """funkcja obliczająca średnie"""
    with app.open_resource('data/grades.json', 'r') as gradesFile:
        grades = json.load(gradesFile)
        gradesFile.close()
    sum = 0
    len = 0
    if subjectValue == "" and termValue == "":
        for subject, terms in grades.items():
            for term, categories in terms.items():
                for category, grades in categories.items():
                    if category == 'answer' or category == 'quiz' or category == 'test':
                        for grade in grades:
                            sum += grade
                            len += 1
    else:
        for subject, terms in grades.items():
            if subject == subjectValue:
                for term, categories in terms.items():
                    if term == termValue:                    
                        for category, grades in categories.items():
                            if category == 'answer' or category == 'quiz' or category == 'test':
                                for grade in grades:
                                    sum += grade
                                    len += 1
    return round(sum/len, 2)

@app.route('/')
def index():
    return render_template('index.html.j2', title='Strona główna', 
    userLogin=session.get('userLogin'), date=date)

@app.route('/login', methods=['POST', 'GET'])
def login():
    login = LoginForm()
    if login.validate_on_submit():
        userLogin = login.userLogin.data
        userPass = login.userPass.data
        if userLogin == users[1]['userLogin'] and userPass == users[1]['userPass']:
            session['userLogin'] = userLogin
            return redirect('dashboard')
    return render_template('login.html.j2', title='Logowanie', login=login, 
        userLogin=session.get('userLogin'), date=date)

@app.route('/logout')
def logout():
    session.pop('userLogin')
    return redirect('login')

@app.route('/dashboard')
def dashboard():
    # to fix
    with app.open_resource('data/grades.json', 'r') as gradesFile:
        grades = json.load(gradesFile)
        gradesFile.close()
    return render_template('dashboard.html.j2', title='Dashboard', 
        userLogin=session.get('userLogin'), date=date, grades=grades,
        countAverage=countAverage)

@app.errorhandler(404)
def pageNotFound(error):
    return render_template('404.html.j2', date=date), 404

@app.errorhandler(500)
def internalServerError(error):
    return render_template('500.html.j2', date=date), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)
