FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY main.py .
ENV MISTRAL_API_KEY=9mcrlrJQrEfHleT0vBy8LDt4qlIxAeLI
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]