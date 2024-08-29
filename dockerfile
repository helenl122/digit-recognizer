FROM python3.9

WORKDIR /app

COPY requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5123

CMD ["python", "digit_recognizer.py"]