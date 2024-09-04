# 
# FROM python:3.10

FROM nvidia/cuda:12.5.1-runtime-ubuntu24.04

RUN apt-get update && apt-get install -y wget



# update apt and get miniconda
RUN apt-get update \
    && apt-get install -y wget \
    && wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh



# install miniconda
ENV PATH="/root/miniconda3/bin:$PATH"
RUN mkdir /root/.conda && bash Miniconda3-latest-Linux-x86_64.sh -b

# # create conda environment
# RUN conda init bash \
#     && . ~/.bashrc \
#     && conda create --name test-env python=3.7 \
#     && conda activate test-env \
#     && pip install ipython



#Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y 
        
COPY environment.yml .
RUN conda env create -f environment.yml

# Make RUN commands use the new environment:
SHELL ["conda", "run", "-n", "unsloth_env", "/bin/bash", "-c"]

# RUN conda create --name unsloth_env python=3.10 pytorch-cuda=12.1 pytorch cudatoolkit xformers -c pytorch -c nvidia -c xformers -y
# RUN conda init bash && . ~/.bashrc && conda activate unsloth_env



# RUN conda activate unsloth_env

RUN pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
RUN pip uninstall unsloth -y
RUN pip install --upgrade --force-reinstall --no-cache-dir git+https://github.com/unslothai/unsloth.git
RUN pip install --no-deps "trl<0.9.0" peft accelerate bitsandbytes
RUN pip install --force-reinstall "xformers<0.0.27"
# RUN pip3 install -U xformers --index-url https://download.pytorch.org/whl/cu121
RUN pip install faiss-gpu
RUN pip install "fastapi[standard]"

WORKDIR /code/

# 
COPY requirements.txt .
COPY app.py .
# COPY RAG/vectorSearchForFarmGenie /code
COPY faiss_index/ faiss_index/
COPY chunks_new.pkl .
COPY data/pickle_files/ data/pickle_files
COPY entrypoint.sh .

# Upgrade pip
RUN python3 -m pip install --upgrade pip
# RUN pip3 install mysql-connector-python-rf
# RUN conda install -c anaconda mysql-connector-python
RUN pip install geocoder
# RUN pip3 install torch torchvision -f https://download.pytorch.org/whl/cu111/torch_stable.html
RUN pip install -r ./requirements.txt
RUN pip install rank_bm25
RUN chmod +x ./entrypoint.sh

# 
EXPOSE 8000


ENTRYPOINT ["./entrypoint.sh"]
