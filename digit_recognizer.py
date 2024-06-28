from flask import Flask, render_template

app = Flask(__name__)

# Load the trained model
model = load_model("model/model.h5")

def some_func():
    return "YEEnew wordT"

@app.route("/")
def index():
    return render_template("index.html")

app.run(host="0.0.0.0", port=5000)