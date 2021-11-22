from flask import Flask, render_template
from api.api import api
from models import db
#from test_data import TestData

app = Flask(__name__)
app.register_blueprint(api, url_prefix="/api")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.app = app
db.init_app(app)
#db.drop_all()
db.create_all()

@app.route("/")
@app.route("/workout")
def workout():
    return render_template("workouts.html")

@app.route("/edit")
def edit():
    return render_template("edit.html")

if __name__ == "__main__":
    #test = TestData()
    #test.clearTables()
    #test.createTestData(db)
    app.run(debug=True)