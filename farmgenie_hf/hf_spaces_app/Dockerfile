# 
FROM python:3.10

RUN apt-get update && apt-get install -y \
    curl \
    bash \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code/

# 
COPY requirements.txt .
COPY app.py .
COPY entrypoint.sh .

RUN chmod +x ./entrypoint.sh
RUN pip install -r requirements.txt


# Upgrade pip
RUN python3 -m pip install --upgrade pip


EXPOSE 7860

# CMD ["streamlit", "run", "app.py"]

ENTRYPOINT ["./entrypoint.sh"]