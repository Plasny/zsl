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

app = Flask(__name__)
bootstrap = Bootstrap(app)
moment = Moment(app)
app.config["SECRET_KEY"] = "ghj5678(*^678&*(hjk&*JKLwkl12naeI(**$2"
date = datetime.now()

""" get current directory """
cDir = os.path.realpath(os.path.dirname(__file__))


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

    subject = SelectField("Wybierz przedmiot:", choices=str)
    term = RadioField(
        "Wybierz semestr", choices=[("term1", "Semestr 1"), ("term2", "Semestr 2")]
    )
    category = SelectField(
        "Wybierz kategorie:",
        choices=[
            ("answer", "Odpowiedź"),
            ("quiz", "Kartkówka"),
            ("test", "Sprawdzian"),
        ],
    )
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


users = {
    1: {"userLogin": "test", "userPass": "test", "fname": "Paweł", "lname": "Pasternak"}
}


def countAverage(subjectValue, termValue):
    """funkcja obliczająca średnie"""
    with app.open_resource("data/grades.json", "r") as gradesFile:
        grades = json.load(gradesFile)
    sum = 0
    len = 0
    if subjectValue == "" and termValue == "":
        for subject, terms in grades.items():
            for term, categories in terms.items():
                for category, grades in categories.items():
                    if category == "answer" or category == "quiz" or category == "test":
                        for grade in grades:
                            sum += grade
                            len += 1
    else:
        for subject, terms in grades.items():
            if subject == subjectValue:
                for term, categories in terms.items():
                    if term == termValue:
                        for category, grades in categories.items():
                            if (
                                category == "answer"
                                or category == "quiz"
                                or category == "test"
                            ):
                                for grade in grades:
                                    sum += grade
                                    len += 1
    if len == 0:
        return 0
    return round(sum / len, 2)


def yearAverage(subjectValue):
    with app.open_resource("data/grades.json", "r") as gradesFile:
        grades = json.load(gradesFile)
    sum = 0
    len = 0
    if subjectValue == "":
        for subject, terms in grades.items():
            for term, categories in terms.items():
                for category, grades in categories.items():
                    if category == "answer" or category == "quiz" or category == "test":
                        for grade in grades:
                            sum += grade
                            len += 1
    else:
        for subject, terms in grades.items():
            if subject == subjectValue:
                for term, categories in terms.items():
                    for category, grades in categories.items():
                        if (
                            category == "answer"
                            or category == "quiz"
                            or category == "test"
                        ):
                            for grade in grades:
                                sum += grade
                                len += 1
    if len == 0:
        return 0
    return round(sum / len, 2)


def sortSubjects():
    subjects = {}

    with app.open_resource("data/grades.json", "r") as gradesFile:
        grades = json.load(gradesFile)
        gradesFile.close()

    for subject in grades:
        subjects[subject] = yearAverage(subject)

    subjectsSorted = sorted(subjects.items(), key=lambda k: k[1], reverse=True)
    subjectsSorted = collections.OrderedDict(subjectsSorted)

    return subjectsSorted


def bestTwo():
    s = sortSubjects()
    return list(s.items())[:2]


def underTwo():
    s = sortSubjects()
    ups = []

    for sub, grade in s.items():
        if grade < 2:
            ups.append(sub)

    return ups


@app.route("/")
def index():
    return render_template(
        "index.html.j2",
        title="Strona główna",
        userLogin=session.get("userLogin"),
        date=date,
    )


@app.route("/login", methods=["POST", "GET"])
def login():
    login = LoginForm()
    if login.validate_on_submit():
        userLogin = login.userLogin.data
        userPass = login.userPass.data
        if userLogin == users[1]["userLogin"] and userPass == users[1]["userPass"]:
            session["userLogin"] = userLogin
            return redirect("dashboard")
    return render_template(
        "login.html.j2",
        title="Logowanie",
        login=login,
        userLogin=session.get("userLogin"),
        date=date,
    )


@app.route("/logout")
def logout():
    session.pop("userLogin")
    return redirect("login")


@app.route("/dashboard")
def dashboard():
    with app.open_resource("data/grades.json", "r") as gradesFile:
        grades = json.load(gradesFile)
    return render_template(
        "dashboard.html.j2",
        title="Dashboard",
        userLogin=session.get("userLogin"),
        date=date,
        grades=grades,
        countAverage=countAverage,
        allAverage=yearAverage(""),
        subjectsD=underTwo(),
        bestSubjects=bestTwo(),
    )


@app.route("/addSubject", methods=["POST", "GET"])
def addSubject():
    addSubject = AddSubject()
    if addSubject.validate_on_submit():
        with open(f"{cDir}/data/grades.json", "r", encoding="utf-8") as gradesFile:
            grades = json.load(gradesFile)
            subject = addSubject.subject.data
            grades[subject] = {
                "term1": {"answer": [], "quiz": [], "test": [], "interim": None},
                "term2": {"answer": [], "quiz": [], "test": [], "interim": None, "yearly": None},
            }
        with open(f"{cDir}/data/grades.json", "w", encoding="utf-8") as gradesFile:
            json.dump(grades, gradesFile, indent=2)
        flash("Dane zapisane poprawnie")
        return redirect("addSubject")
    return render_template(
        "add-subject.html.j2",
        title="Dodaj przedmiot",
        userLogin=session.get("userLogin"),
        date=date,
        addSubject=addSubject,
    )


@app.route("/addGrade", methods=["POST", "GET"])
def addGrade():
    addGradeForm = AddGrade()
    with open(f"{cDir}/data/grades.json", "r", encoding="utf-8") as gradesFile:
        grades = json.load(gradesFile)
        addGradeForm.subject.choices = [subject for subject in grades]
    if addGradeForm.validate_on_submit():
        subject = addGradeForm.subject.data
        term = addGradeForm.term.data
        category = addGradeForm.category.data
        grade = addGradeForm.grade.data
        grades[subject][term][category].append(int(grade))
        with open(f"{cDir}/data/grades.json", "w", encoding="utf-8") as gradesFile:
            json.dump(grades, gradesFile, indent=2)
            flash("Dane zapisane poprawnie")
        return redirect("addGrade")
    return render_template(
        "add-grade.html.j2",
        title="Dodaj przedmiot",
        userLogin=session.get("userLogin"),
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
