from flask import Flask, render_template, request
from flask_bs4 import Bootstrap
import sqlite3
import os

app = Flask(__name__)
bootstrap = Bootstrap(app)
currentDir = os.path.realpath(os.path.dirname(__file__))
dbPath = currentDir + "/data/source.db"


@app.route("/", methods=["POST", "GET"])
def index():

    con = sqlite3.connect(dbPath)
    cur = con.cursor()
    reqSearch = request.form.get("search")
    if reqSearch:
        cur.execute(
            f"""SELECT id, first, last, salary, city 
                FROM salary 
                WHERE first=? OR last=? OR city=?
            """,
            [reqSearch, reqSearch, reqSearch],
        )
        tableData = cur.fetchall()
    else:
        cur.execute(
            f"""SELECT id, first, last, salary, city 
                FROM salary 
            """
        )
        tableData = cur.fetchall()

    reqStats = request.form.get("statData")
    statistics = []
    if reqStats:
        if reqStats == "max":
            max = tableData[0][3]
            for rec in tableData:
                if max < rec[3]:
                    max = rec[3]
            statistics.append(("max", max))
        elif reqStats == "min":
            min = tableData[0][3]
            for rec in tableData:
                if min > rec[3]:
                    min = rec[3]
            statistics.append(("min", min))
        elif reqStats == "avg":
            avg = 0
            i = 0
            for rec in tableData:
                avg += rec[3]
                i += 1
            avg /= i
            statistics.append(("avg", avg))

    return render_template(
        "index.html.j2", title="Home", tableData=tableData, statistics=statistics
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555, debug=True)
