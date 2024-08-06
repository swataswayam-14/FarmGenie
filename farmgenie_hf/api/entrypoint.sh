#!/bin/bash
# https://github.com/anaconda/docker-images/issues/89
# Load Conda
. /root/miniconda3/etc/profile.d/conda.sh

# Initialize Conda (if not already initialized)
conda init bash
source ~/.bashrc

# Activate the Conda environment
conda activate unsloth_env

# Ensure `fastapi` is installed in the environment
pip install fastapi uvicorn
pip install mysql-connector-python

# ENV DOCKERIZE_VERSION v0.6.1
# wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

sh -c "apt-get update \
apt-get install mysql-client"


sh -c "apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/v0.7.0/dockerize-linux-amd64-v0.7.0.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*"
# sh -c "dockerize -wait tcp://db:33061 -timeout 300s -wait-retry-interval 30s /sayhello"
# pip install --force-reinstall "xformers<0.0.27"
# Run FastAPI application
# fastapi run app.py --host 0.0.0.0 --port 8000
# dockerize -wait tcp://db:33061 -wait https://localhost:8000 -timeout 10s fastapi run app.py --host 0.0.0.0 --port 8000

# Wait for MySQL to be ready
dockerize -wait tcp://mysql:3306 -timeout 30s

# Run FastAPI application
# uvicorn app:app --host 0.0.0.0 --port 8000
fastapi run app.py --host 0.0.0.0 --port 8000
