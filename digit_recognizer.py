import io, base64
import numpy as np
from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image

app = Flask(__name__)

model = load_model("model.keras")

# Convert canvas drawing image into array
def convertImage(imageData):
    imageBytes = base64.b64decode(imageData.split(',')[1])
    image = Image.open(io.BytesIO(imageBytes))
    # MNIST data (28x28), Luminance = grayscale(255 pixels)
    image = image.resize((28, 28)).convert('L')
    imageArray = np.array(image) / 255.0
    imageArray = np.expand_dims(imageArray, axis=0) # fit input shape
    return imageArray

# Prediction route: runs model on input image
@app.route('/_predict', methods=['POST'])
def predict():
    imageData = request.json['image_data']
    imageArray = convertImage(imageData)
    prediction = model.predict(imageArray)
    return jsonify({'results': prediction.flatten().tolist()})

@app.route("/")
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)