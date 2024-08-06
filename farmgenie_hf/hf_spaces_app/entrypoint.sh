#!/bin/bash


# # Initialize Conda (if not already initialized)
# conda init bash
# source ~/.bashrc

# # Activate the Conda environment
# conda activate unsloth_env
# cd code/

# sh -c "apt-get update \
#     && apt-get install -y wget \
#     && wget -O - https://github.com/jwilder/dockerize/releases/download/v0.7.0/dockerize-linux-amd64-v0.7.0.tar.gz | tar xzf - -C /usr/local/bin \
#     && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*"

# dockerize -wait tcp://mysql:3306 -wait http://api:8000 -timeout 30s

# python streamlit run app.py

#!/bin/bash

# Start Streamlit on all interfaces
exec streamlit run /code/app.py --server.address=0.0.0.0 --server.port=7860
