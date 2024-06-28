from flask import Flask

app = Flask(__name__)

@app.route("/")

def index():
    return "Yay this has worked!"

app.run(host="0.0.0.0", port=5000)