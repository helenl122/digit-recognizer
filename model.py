import numpy as np
import tensorflow as tf
from tensorflow.keras import datasets, layers, models

# load & check MNIST dataset (should have 6000 train, 1000 test)
(x_train, y_train), (x_test, y_test) = datasets.mnist.load_data()
assert x_train.shape == (60000, 28, 28)
assert x_test.shape == (10000, 28, 28)
assert y_train.shape == (60000,)
assert y_test.shape == (10000,)

# normalize dataset (255 = pixel grayscale range)
x_train, x_test = x_train / 255.0, x_test/ 255.0

# build model
model = models.Sequential([
    # convolutional layers
    layers.Input(shape=(28, 28, 1)),
    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Dropout(0.5),
    # basic neural network
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# train model
history = model.fit(x_train, y_train, epochs=8, validation_split=0.2)
model.summary()

# evaluate model on test data
test_loss, test_acc = model.evaluate(x_test, y_test)

print(test_acc)
y_predict = model.predict(x_test)
print(y_predict.shape)

# Save model
model.save("model.keras")