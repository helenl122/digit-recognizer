import numpy as np
import tensorflow as tf
import io
import base64
from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image

app = Flask(__name__)

# Load the trained model
model = load_model("model.keras")

@app.route("/")
def index():
    return render_template("index.html")

app.run(host="0.0.0.0", port=5000)