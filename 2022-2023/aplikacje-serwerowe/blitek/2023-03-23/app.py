#!/usr/bin/env python3

from flask import Flask, render_template, request, redirect, flash
from flask_bs4 import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
# from sqlalchemy import func
from wtforms import StringField, PasswordField, SubmitField, validators
import os

# konfiguracja aplikacji
app = Flask(__name__)
app.config["SECRET_KEY"] = "GNbq4j4HeTJ^b&q$FmmdyZkB4w5HGR%v*DumrQU39!sh#Yu#"
bootstrap = Bootstrap(app)

# konfiguracja bazy danych
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    basedir, "db.sqlite3"
)
db = SQLAlchemy(app)

# modele baz danych
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userLogin = db.Column(db.String)
    userPass = db.Column(db.String)
    firstName = db.Column(db.String(100))
    lastName = db.Column(db.String(100))

    def __init__(self, userLogin, userPass, firstName, lastName):
        self.userLogin = userLogin
        self.userPass = userPass
        self.firstName = firstName
        self.lastName = lastName


# formularze
class AddUser(FlaskForm):
    userLogin = StringField("Login:", [validators.DataRequired()])
    userPass = PasswordField("Hasło:", [validators.DataRequired()])
    firstName = StringField("Imię:", [validators.DataRequired()])
    lastName = StringField("Nazwisko:", [validators.DataRequired()])
    submit = SubmitField("Dodaj")


@app.route("/", methods=["POST", "GET"])
def index():
    return render_template("index.html.j2", title="Home", users=Users.query.all())


@app.route("/add-user", methods=["POST", "GET"])
def addUser():
    form = AddUser()
    if request.method == "POST":
        if form.validate_on_submit():
            user = Users(
                form.userLogin.data,
                form.userPass.data,
                form.firstName.data,
                form.lastName.data,
            )
            db.session.add(user)
            db.session.commit()
            flash("Dane zapisane poprawnie")
            return redirect("add-user")
    return render_template(
        "add-user.html.j2",
        title="Add user",
        addUserForm=form,
        lastAdded=Users.query.order_by(Users.id.desc()).first(),
    )


@app.route("/search", methods=["POST", "GET"])
def search():
    if request.method == "POST":
        lastName = request.form["lastName"]
        # resutls = Users.query.filter_by(lastName=lastName)
        # results = Users.query.filter(func.lower(Users.lastName) == lastName.lower()).all()
        results = Users.query.filter(Users.lastName.ilike(f"{lastName}%")).all()
        return render_template(
            "results.html.j2", title="Wyniki wyszukiwania", results=results
        )
    return redirect("/")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5555, debug=True)
