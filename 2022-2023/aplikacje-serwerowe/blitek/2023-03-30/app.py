#!/usr/bin/env python3

from flask import Flask, render_template, request, redirect, url_for, flash
from flask_bs4 import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from flask_bcrypt import Bcrypt
from flask_login import (
    UserMixin,
    LoginManager,
    login_user,
    login_required,
    logout_user,
    current_user,
)

# from sqlalchemy import func
from wtforms import StringField, PasswordField, SubmitField, validators
import os

# konfiguracja aplikacji
app = Flask(__name__)
app.config["SECRET_KEY"] = "GNbq4j4HeTJ^b&q$FmmdyZkB4w5HGR%v*DumrQU39!sh#Yu#"
bootstrap = Bootstrap(app)
bcrypt = Bcrypt(app)

# konfiguracja bazy danych
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    basedir, "db.sqlite3"
)
db = SQLAlchemy(app)

# konfiguracja logowania
loginManager = LoginManager()
loginManager.init_app(app)
loginManager.login_view = "login"
# loginManager.login_message = "zaloguj się"
loginManager.login_message_category = "warning"


@loginManager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)


# modele baz danych
class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    userLogin = db.Column(db.String, unique=True)
    userPass = db.Column(db.String)
    firstName = db.Column(db.String(100))
    lastName = db.Column(db.String(100))

    def __init__(self, userLogin, userPass, firstName, lastName):
        self.userLogin = userLogin
        self.userPass = userPass
        self.firstName = firstName
        self.lastName = lastName

    def is_authenticated(self):
        # return self.is_active
        return True


# formularze
class Register(FlaskForm):
    userLogin = StringField(
        "Login:", [validators.DataRequired(), validators.Length(min=4, max=50)]
    )
    userPass = PasswordField(
        "Hasło:", [validators.DataRequired(), validators.Length(min=8)]
    )
    firstName = StringField("Imię:", [validators.DataRequired()])
    lastName = StringField("Nazwisko:", [validators.DataRequired()])
    submit = SubmitField("Dodaj")


class Login(FlaskForm):
    userLogin = StringField("Login:", [validators.DataRequired()])
    userPass = PasswordField("Hasło:", [validators.DataRequired()])
    submit = SubmitField("Dodaj")


@app.route("/", methods=["POST", "GET"])
def index():
    return render_template("index.html.j2", title="Home")


@app.route("/register", methods=["POST", "GET"])
def register():
    form = Register()
    if form.validate_on_submit():
        try:
            hashedPass = bcrypt.generate_password_hash(form.userPass.data)
            user = Users(
                userLogin=form.userLogin.data,
                userPass=hashedPass,
                firstName=form.firstName.data,
                lastName=form.lastName.data,
            )
            db.session.add(user)
            db.session.commit()
            flash("Konto zostało utworzone poprawnie", "success")
            return redirect(url_for("login"))
        except Exception as e:
            # print(e)
            flash("Taki użytkownik już istnieje", "danger")
    return render_template(
        "register.html.j2",
        title="Register",
        registerForm=form,
    )


@app.route("/login", methods=["POST", "GET"])
def login():
    form = Login()
    if form.validate_on_submit():
        user = Users.query.filter_by(userLogin=form.userLogin.data).first()
        if user:
            if bcrypt.check_password_hash(user.userPass, form.userPass.data):
                login_user(user)
                return redirect(url_for("dashboard"))
    return render_template("login.html.j2", title="Login", loginForm=form)


@app.route("/logout", methods=["POST", "GET"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))


@app.route("/dashboard")
@login_required
def dashboard():
    if current_user.is_authenticated():
        userName = current_user.userLogin
    return render_template("dashboard.html.j2", title="Dashboard", userName=userName)


@app.route("/users")
@login_required
def allUsers():
    return render_template(
        "users.html.j2", title="Users list", usersList=Users.query.all()
    )


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5555, debug=True)
