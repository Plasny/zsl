#!/usr/bin/env python3

import collections
import os
from flask import (
    Flask,
    render_template,
    request,
    session,
    redirect,
    url_for,
    flash,
    json,
)
from flask_bs4 import Bootstrap
from flask_moment import Moment
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    SubmitField,
    IntegerField,
    PasswordField,
    SelectField,
    RadioField,
)
from wtforms.validators import DataRequired
import sqlite3
import hashlib

app = Flask(__name__)
bootstrap = Bootstrap(app)
moment = Moment(app)
app.config["SECRET_KEY"] = "ghj5678(*^678&*(hjk&*JKLwkl12naeI(**$2"
date = datetime.now()

""" get current directory """
cDir = os.path.realpath(os.path.dirname(__file__))

""" sqlite database setup """
dbPath = cDir + "/db/grades.db"
con = sqlite3.connect(dbPath)
cur = con.cursor()
cur.execute(
    """CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        userLogin TEXT NOT NULL, 
        userPass TEXT NOT NULL, 
        firstName TEXT, 
        lastName TEXT
    )"""
)
cur.execute(
    """CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        subject TEXT NOT NULL
    )"""
)
cur.execute(
    """CREATE TABLE IF NOT EXISTS terms (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        term TEXT NOT NULL, 
        comment TEXT
    )"""
)
cur.execute(
    """CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        category TEXT NOT NULL, 
        comment TEXT
    )"""
)
cur.execute(
    """CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        subject_id INTEGER NOT NULL, 
        term_id INTEGER NOT NULL, 
        category_id INTEGER NOT NULL, 
        grade INTEGER NOT NULL, 
        comment TEXT
    )"""
)

# check if terms are set
res = cur.execute("SELECT COUNT(*) FROM terms")
if res.fetchall()[0][0] == 0:
    cur.execute(
        "INSERT INTO terms (term, comment) VALUES ('term1', 'Semestr 1'), ('term2', 'Semestr 2')"
    )

# check if categories are set
res = cur.execute("SELECT COUNT(*) FROM categories")
if res.fetchall()[0][0] == 0:
    cur.execute(
        "INSERT INTO categories (category, comment) VALUES ('answer', 'Odpowiedź ustna'), ('quiz', 'Kartkówka'), ('test', 'Sprawdzian')"
    )

# check if test user exists
res = cur.execute("SELECT COUNT(1) FROM users WHERE userLogin='test'")
if res.fetchall()[0][0] == 0:
    cur.execute(
        "INSERT INTO users (userLogin, userPass, firstName) VALUES('test', '57311420097d5e12e3812d5795459ac5458272ab511d9db14f0ae18f25c9ea7a', 'Paweł');"
    )
    res = cur.execute("SELECT * FROM users")
    print(res.fetchall())

con.commit()


class LoginForm(FlaskForm):
    """formularz logowania"""

    userLogin = StringField("Nazwa użytkownika:", validators=[DataRequired()])
    userPass = PasswordField("Hasło:", validators=[DataRequired()])
    submit = SubmitField("Zaloguj")


class AddSubject(FlaskForm):
    """formularz dodawania przedmiotu"""

    subject = StringField("Nazwa przedmiotu:", validators=[DataRequired()])
    submit = SubmitField(("Dodaj"))


class AddGrade(FlaskForm):
    """formularz dodawania oceny"""

    subject = SelectField("Wybierz przedmiot:")
    term = RadioField("Wybierz semestr:")
    category = SelectField("Wybierz kategorie:")
    grade = SelectField(
        "Ocena:",
        choices=[
            (6, "Celujący"),
            (5, "Bardzo dobry"),
            (4, "Dobry"),
            (3, "Dostateczny"),
            (2, "Dopuszczający"),
            (1, "Niedostateczny"),
        ],
    )
    submit = SubmitField("Dodaj")


def countAverage(grades, subject_id="", term_id=""):
    gradeTypes = ["answer", "quiz", "test"]
    sum = 0
    len = 0
    if subject_id != "" and term_id != "":
        for grade in grades:
            if grade[1] == term_id and grade[2] == subject_id and grade[3] in gradeTypes:
                sum += grade[0]
                len += 1
    elif subject_id != "":
        for grade in grades:
            if grade[2] == subject_id and grade[3] in gradeTypes:
                sum += grade[0]
                len += 1
    else:
        for grade in grades :
            if grade[3] in gradeTypes:
                sum += grade[0]
                len += 1
    if len == 0:
        return None
    return round(sum / len, 2)


def sortSubjects(grades, subjects):
    groupThisTwo = []
    for subject in subjects:
        groupThisTwo.append((subject[1], countAverage(grades, subject[0])))
    subjectsSorted = sorted(
        groupThisTwo, key=lambda k: k[1] if k[1] != None else 0, reverse=True
    )
    return subjectsSorted


def bestTwo(grades, subjects):
    return sortSubjects(grades, subjects)[:2]


def underTwo(grades, subjects):
    s = sortSubjects(grades, subjects)
    grades = []
    for sub in s:
        if sub[1] == None or sub[1] < 2:
            grades.append(sub)
    return grades 


def markAsWord(grades, subject_id="", term_id=""):
    gradeTypes = ["answer", "quiz", "test"]
    sum = 0
    len = 0
    if subject_id != "" and term_id != "":
        for grade in grades:
            if grade[1] == term_id and grade[2] == subject_id and grade[3] in gradeTypes:
                sum += grade[0]
                len += 1
    elif subject_id != "":
        for grade in grades:
            if grade[2] == subject_id and grade[3] in gradeTypes:
                sum += grade[0]
                len += 1
    else:
        for grade in grades :
            if grade[3] in gradeTypes:
                sum += grade[0]
                len += 1

    if len == 0:
        return 'Nieklasyfikowany' 

    mark = round(sum / len, 2)
    if(mark <= 1.75):
        return 'Niedostateczny'
    elif(mark <= 2.75):
        return 'Dopuszczający'
    elif(mark <= 3.75):
        return 'Dostateczny'
    elif(mark <= 4.75):
        return 'Dobry'
    elif(mark <= 5.25):
        return 'Bardzo dobry'
    return 'Celujący'


@app.route("/")
def index():
    return render_template(
        "index.html.j2",
        title="Strona główna",
        userLogin=session.get("userLogin"),
        firstName=session.get("firstName"),
        date=date,
    )


@app.route("/login", methods=["POST", "GET"])
def login():
    login = LoginForm()
    if login.validate_on_submit():
        userLogin = login.userLogin.data
        userPass = login.userPass.data.encode()
        userPass = hashlib.sha256(userPass).hexdigest()
        con = sqlite3.connect(dbPath)
        cur = con.cursor()
        cur.execute(
            f"""SELECT userLogin, firstName 
                FROM users 
                WHERE userLogin=?
                AND userPass=?
            """, (userLogin, userPass)
        )
        user = cur.fetchall()
        con.close()
        if user:
            user = user[0]
            session["userLogin"] = user[0]
            session["firstName"] = user[1]
            return redirect("dashboard")
        else:
            flash("Błędne logowanie")
    return render_template(
        "login.html.j2",
        title="Logowanie",
        login=login,
        userLogin=session.get("userLogin"),
        firstName=session.get("firstName"),
        date=date,
    )


@app.route("/logout")
def logout():
    # session.pop("userLogin")
    # session.pop("firstName")
    session.clear()
    return redirect("login")


@app.route("/dashboard")
def dashboard():
    con = sqlite3.connect(dbPath)
    cur = con.cursor()
    cur.execute("SELECT * FROM subjects")
    subjects = cur.fetchall()
    cur.execute(
        """SELECT grade, term_id, subject_id, category, categories.comment, grades.comment 
            FROM grades 
            INNER JOIN categories ON categories.id=grades.category_id
        """
    )
    grades = cur.fetchall()
    con.commit()
    con.close()
    return render_template(
        "dashboard.html.j2",
        title="Dashboard",
        date=date,
        firstName=session.get("firstName"),
        subjects=subjects,
        grades=grades,
        subjectAvg=countAverage,
        bestTwo=bestTwo,
        underTwo=underTwo,
        markAsWord=markAsWord,
    )


@app.route("/addSubject", methods=["POST", "GET"])
def addSubject():
    addSubject = AddSubject()
    if addSubject.validate_on_submit():
        subject = addSubject.subject.data
        con = sqlite3.connect(dbPath)
        cur = con.cursor()
        cur.execute("INSERT INTO subjects (subject) VALUES(?)", (subject,))
        con.commit()
        con.close()
        flash("Dane zapisane poprawnie")
        return redirect("addSubject")
    return render_template(
        "add-subject.html.j2",
        title="Dodaj przedmiot",
        userLogin=session.get("userLogin"),
        firstName=session.get("firstName"),
        date=date,
        addSubject=addSubject,
    )


@app.route("/addGrade", methods=["POST", "GET"])
def addGrade():
    addGradeForm = AddGrade()
    con = sqlite3.connect(dbPath)
    cur = con.cursor()
    cur.execute("SELECT id, subject FROM subjects")
    addGradeForm.subject.choices = cur.fetchall()
    cur.execute("SELECT id, comment FROM terms")
    addGradeForm.term.choices = cur.fetchall()
    cur.execute("SELECT id, comment FROM categories")
    addGradeForm.category.choices = cur.fetchall()
    if addGradeForm.validate_on_submit():
        subject_id = addGradeForm.subject.data
        term_id = addGradeForm.term.data
        category_id = addGradeForm.category.data
        grade = addGradeForm.grade.data
        cur.execute("INSERT INTO grades(subject_id, term_id, category_id, grade) VALUES(?,?,?,?)",
            (subject_id, term_id, category_id, grade))
        con.commit()
        con.close()
        flash("Dane zapisane poprawnie")
        return redirect("addGrade")
    return render_template(
        "add-grade.html.j2",
        title="Dodaj przedmiot",
        userLogin=session.get("userLogin"),
        firstName=session.get("firstName"),
        date=date,
        addGrade=addGradeForm,
    )


@app.errorhandler(404)
def pageNotFound(error):
    return render_template("404.html.j2", date=date), 404


@app.errorhandler(500)
def internalServerError(error):
    return render_template("500.html.j2", date=date), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555, debug=True)
