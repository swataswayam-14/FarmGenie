# FarmGenie 

--- 
- **Our project only supports conversation (input/output) in Hindi/English for now**. 
- Please refer to 'flowchart.pdf' for our proposed framework
---

### Vision

In the ever-evolving agricultural landscape, farmers often face challenges in accessing up-to-date knowledge and resources to improve their farming practices. To address this, we have developed a comprehensive product that leverages the power of large language models (LLMs) and advanced conversational AI to create an interactive platform for farmers.


### Goal

The primary goal of this project is to design a product that helps farmers, especially those new to the field, gain up-to-date knowledge on various agricultural and farming practices from the Internet through a user-friendly interface with an AI-based conversation bot.


### Methodology

#### Framework

- The core of the product is a sophisticated conversational AI framework that combines a Mixture of Experts (MoE) approach, Retrieval-Augmented Generation (RAG), and language translation capabilities. 

- The MoE component consists of three fine-tuned small language models (SLMs) that have become specialized experts in the domains of soil management, plant disease identification, and irrigation techniques, allowing them to handle complex queries by breaking them down into subproblems.

- The "conversation managing" LLMs classify the user's queries, manage the flow of the conversation, and facilitate the translation between the user's preferred language and English, ensuring seamless interaction for farmers. 


#### Seamless Interface
- The product is built as a web application using a Turborepo, a Next.js client, and an Express server, leveraging a Redis queue and multiple Node.js processes to ensure scalability and robustness. The knowledge base is curated from openly available PDF books and reports, covering a wide range of agricultural topics. 

- Additionally, the product aims to create an interactive platform where farmers can connect with each other, share their knowledge, and learn from their peers, fostering a community-driven approach to agricultural knowledge dissemination.
## Features 

**Website**



- The website is built using a Turborepo, which is a high-performance build system that helps manage the complexity of a mono repo. 
- The front end is built using Next.js, a React framework that provides server-side rendering, static site generation, and other performance optimizations. The backend is built using an Express server that handles the communication between the front end and the ML backend. 

The Express server is responsible for the following tasks:

1.	**Request Handling**: The Express server receives all the requests from the frontend, such as user queries, and passes them to the Redis queue.
2.	**Redis Queue**: A Redis queue is used to manage incoming requests. This helps distribute the load across multiple Node.js processes, ensuring the ML backend does not get overwhelmed.
3.	**Node.js Processes**: Multiple Node.js processes are set up to consume the requests from the Redis queue. These processes then pass the requests to the ML backend for processing.
4.	**ML Backend Integration**: The Node.js processes communicate with the ML backend, which is responsible for handling the various ML tasks, such as query classification, subproblem generation, and retrieval-augmented generation (RAG).
5.	**Database Integration**: The website uses a single PostgreSQL database, provided by Neon DB, as the single source of truth. This database stores all the user, farmer, and retailer data, as well as the content for the website.
6.	**User Management**: The Next.js frontend handles user management, including authentication, authorization, and user data storage in the PostgreSQL database (neon tech).
7.	**Scalability**: The use of a Redis queue and multiple Node.js processes ensures the application can scale to handle a large number of concurrent user requests without overloading the ML backend.
8.	**Deployment**: The entire application, including the frontend, backend, and ML components, is packaged and deployed using Docker containers, ensuring consistent and reliable deployment across different environments.
9.	Monitoring and Logging: The application includes comprehensive monitoring and logging solutions to track performance, errors, and user activity, enabling the team to identify and resolve issues quickly.
10.	Security: The website incorporates industry-standard security practices, such as SSL/TLS encryption, user authentication, and input validation, to protect user data and prevent unauthorized access.



## Tech Stack

**Client**: Tailwind CSS, TypeScript, Next.js

**Backend**: Flask, Python, Langchain, GeminiPro API (Langchain),
peft , bitsandbytes, transformers

**Storage**: PostgreSQL, ChromaDB

**Other Tools**: GCP, Docker, Vercel


## Fine Tuning

**Family**: Phi (Phi3-128k-instruct) \
**Fine-tuned Models**: [Models Link (HuggingFace)](https://huggingface.co/YuvrajSingh9886) \
**Dataset**: [Datasets Link (HuggingFace)](https://huggingface.co/YuvrajSingh9886?sort_datasets=likes#datasets) \
**Steps**: 1000 \
**Batch size**: 8 \
**Alpha**: 2e-5/2e-3 \
**Hardware**: NVIDIA RTX 4050 6GB VRAM (GPU), Inten CORE i7 16 GB RAM (CPU) 



## Requirements

```bash
docker
unsloth
GPU
```

#### Server

Pull the server image from DockerHub

```bash
  docker pull yuvrajsingh9886/farmgenie-fastapi:v2.1
```

#### Gemini Setup

Create a file named env_file with the following content:

```bash
  GEMINI_API_KEY = "YOUR_SECRET_KEY"
  hf_token = "YOU_HUGGINGFACE_TOKEN"
  OPENAI_API_KEY = "YOUR_OPENAI_TOKEN"
  COHERE_API_KEY = "YOUR_COHERE_API_TOKEN"
```


Run the server image

```bash
  docker run --env-file .env -p 8000:8000 --name pytorch-container -it --gpus all yuvrajsingh9886/farmgenie-fastapi:v2.1
```
You'll see it running on 127.0.0.0/docs url
## Run Locally

Clone the project

```bash
  git clone https://github.com/swataswayam-14/FarmGenie
```

Go to the project directory

```bash
  cd FarmGenie
```

Go to the next-app directory

```bash
  cd next-app
```

Install dependencies

```bash
  npm install
```

Generate prisma client

```bash
  npx prisma generate
```

Start the server

```bash
  npm run start
```

Go to the communtiy-forum directory

```bash
  cd community-forum
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## 🔗 Links

[HuggingFace Account](https://huggingface.co/YuvrajSingh9886)


## Authors

- [@Swata Swayam Dash](https://github.com/swataswayam-14)
- [@YuvrajSingh](https://www.github.com/YuvrajSingh-mist)

