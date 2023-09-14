from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    json,
)
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config["SECRET_KEY"] = "aas3AEDTo2ih*3(*Fha23bjkvo_-bk"
icons = {
    "data_pomiaru": {
        "icon": "bi bi-calendar3",
        "after": ""
    },
    "godzina_pomiaru": {
        "icon": "bi bi-clock",
        "after": "h"
    },
    "temperatura": {
        "icon": "bi bi-thermometer-half",
        "after": "°C"
    },
    "predkosc_wiatru": {
        "icon": "bi bi-speedometer2",
        "after": "km/h"
    },
    "kierunek_wiatru": {
        "icon": "bi bi-sign-turn-slight-right-fill",
        "after": "°"
    },
    "wilgotnosc_wzgledna": {
        "icon": "bi bi-moisture",
        "after": "%"
    },
    "suma_opadu": {
        "icon": "bi bi-droplet-half",
        "after": "mm"
    },
    "cisnienie": {
        "icon": "bi bi-speedometer",
        "after": "hPa"
    }
}


class searchForm(FlaskForm):
    search = StringField("Podaj szukane miasto: ", validators=[DataRequired()])
    submit = SubmitField("Wyszukaj")


def getWeather(search, filename):
    with app.open_resource("data/" + filename + ".json", "r") as jsonFile:
        data = json.load(jsonFile)
        jsonFile.close()
    for city in data:
        for stacja, cityName in city.items():
            if stacja == 'stacja':
                if cityName == search:
                    return city 
    return False

# def windDirection(n):
#     if(0 <= n <= 25 or 335 <= n <= 360):
#         return 'północny'


@app.route("/", methods=["POST", "GET"])
def index():
    form = searchForm()
    if form.validate_on_submit():
        city = form.search.data
        info = getWeather(city, "synop")
        del info["id_stacji"]
        del info["stacja"]
        return render_template(
            "weather.html.j2", search=city, cityInfo=info, format=icons, searchForm=form
        )
    return render_template("weather.html.j2", searchForm=form)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555)
