from unsloth import FastLanguageModel
import torch
import os
from dotenv import load_dotenv
import google.generativeai as genai
from chromadb import Documents, EmbeddingFunction, Embeddings
import json
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.runnables import RunnablePassthrough
from chromadb import Documents, EmbeddingFunction, Embeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.runnables import RunnableLambda
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import textwrap
import gc




##################### Env variables and LLM setup #########################

# Load environment variables from .env file
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=gemini_api_key)

standalone_query_generation_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_api_key, convert_system_message_to_human=True)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_api_key, convert_system_message_to_human=True)


gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=gemini_api_key)



model = genai.GenerativeModel('gemini-1.5-flash')
translator_model = genai.GenerativeModel('gemini-1.5-pro')

query_soil = ""
query_water = ""
query_plants = ""
soil_expert_response = ""
irrigation_expert_response = ""
plant_diseases_expert_response = ""

chat_history = []
##############################################

class GeminiEmbeddingFunction(EmbeddingFunction):
  def __call__(self, input: Documents) -> Embeddings:
    model = 'models/embedding-001'
    title = "Custom query"
    return genai.embed_content(model=model,
                                content=input,
                                task_type="retrieval_document",
                                title=title)["embedding"]


def ready_prompt(user_query):

    prompt = f'''

    Prompt:
    You are a language model tasked with classifying user queries into one or more of the following categories:
    1.	Soil
    2.	Irrigation
    3.	Plant Diseases/Botany
    Each query can be associated with one or more of these labels. Your response should be formatted as a valid JSON object, specifying the number of labels assigned to the query and the labels themselves in the form of a Python list.
    Response Format:

    {{
        "RESPONSE": {{
            "answer": "<Number of labels assigned to the query>",
            "labels": <Labels according to you (should be a valid python list)>
        }}
    }}
    Example Query: "How can I improve soil fertility and what are the common diseases affecting tomatoes?"
    Example Response:
    {{
        "RESPONSE": {{
            "answer": "2",
            "labels": [1, 3]
        }}
    }}
    Your Task: For each user query, analyze the content and determine the appropriate labels (1 for Soil, 2 for Irrigation, and 3 for Plant Diseases/Botany). Provide the number of labels and the corresponding labels in the specified JSON format.
    Examples-

    Example 1: Single Label
    Query: "What type of soil is best for growing carrots?"
    Response:
    {{
        "RESPONSE": {{
            "answer": "1",
            "labels": [1]
        }}
    }}
    Example 2: Single Label
    Query: "How often should I water my cucumber plants?"
    Response:
    {{
        "RESPONSE": {{
            "answer": "1",
            "labels": [2]
        }}
    }}
    Example 3: Single Label
    Query: "What are the symptoms of powdery mildew on squash plants?"
    Response:
    {{
        "RESPONSE": {{
            "answer": "1",
            "labels": [3]
        }}
    }}
    
    Example 4: Multi-Label
    Query: "What soil amendments are needed to improve water retention, and how do I prevent root rot in tomatoes?"
    Response:
    {{
        "RESPONSE": {{
            "answer": "2",
            "labels": [1, 3]
        }}
    }}
    Example 5: Multi-Label
    Query: "How can I set up a drip irrigation system and what are the benefits for soil health?"
    Response:
    {{
        "RESPONSE": {{
            "answer": "2",
            "labels": [1, 2]
        }}
    }}
    Example 6: Multi-Label
    Query: "What are the best practices for watering plants to avoid fungal diseases?"
    Response:
    {{
        "RESPONSE": {{
            "answer": "2",
            "labels": [2, 3]
        }}
    }}

    User Query: {user_query}


    '''
    
    return prompt




def gemini_pro_with_for_multi_label_classification(user_query):
    
    prompt = ready_prompt(user_query=user_query)
    
    res = model.generate_content(
        contents=prompt
    )

    return res.text

def load_chromadb(collection_name):
    db = Chroma(persist_directory="RAG/vectorSearchForFarmGenie", embedding_function=gemini_embeddings, collection_name=collection_name)

    return db

def CreateEmbeddings(query):
    model = 'models/embedding-001'
    embedding = genai.embed_content(model=model,
                                content=query,
                                task_type="retrieval_query",
)
    return embedding


def rag_setup(query):
    
    collection_name = 'embeddings_for_farm_book'
    db = load_chromadb(collection_name=collection_name)
    result = db.similarity_search(query, k=2)
    return result



def CreateSubproblems(query):
    res = gemini_pro_with_for_generation_of_subproblems(query)
    res = res.replace('```', '').replace("\n", "").replace('json','')
    json_res = json.loads(res)
    json_res = json_res['RESPONSE']
    return json_res




def check_simple_or_complexy_query(query):
    res = gemini_pro_with_for_multi_label_classification(query)
    res = res.replace('```', '').replace("\n", "").replace('json','')
    json_res = json.loads(res)
    if len(json_res['RESPONSE']['labels']) > 1:
        return "COMPLEX"
    else:
        return "SIMPLE"
    

def gemini_pro_with_for_generation_of_subproblems(complex_query):


    
    prompt = f'''

    You are tasked with breaking down a complex query into three specific categories: Soil, Irrigation, and Plant Diseases. A complex query consists of a single question that requires multiple operations to be performed simultaneously. For each category you determine to be relevant, rephrase the original user's question and break it into sub-problems. Ensure that the core meaning of the original user's question remains intact while dividing it into sub-problems.
    Your output should be in a well-defined valid JSON format as follows:
    {{
        "RESPONSE": {{
            "sub-problems": {{
                "<label>": "<sub-problem>",
                ...
            }}
        }}
    }}
    Examples:
    1. Example Query: "How can I improve the soil quality, ensure proper irrigation, and prevent common diseases in my tomato plants?"
    {{
        "RESPONSE": {{
            "sub-problems": {{
                "Soil": "What are the best practices to improve soil quality for tomato plants?",
                "Irrigation": "How can I ensure proper irrigation for tomato plants?",
                "Plant Diseases": "What are the common diseases that affect tomato plants and how can I prevent them?"
            }}
        }}
    }}
    2. Example Query: "What are the necessary soil amendments, irrigation techniques, and disease control measures for growing healthy cucumbers?"
    {{
        "RESPONSE": {{
            "sub-problems": {{
                "Soil": "What soil amendments are necessary for growing healthy cucumbers?",
                "Irrigation": "What irrigation techniques are best for cucumber plants?",
                "Plant Diseases": "What disease control measures should I take for cucumber plants?"
            }}
        }}
    }}
    3. Example Query: "How do I prepare the soil and set up an efficient irrigation system for my new vineyard?"
    {{
        "RESPONSE": {{
            "sub-problems": {{
                "Soil": "How do I prepare the soil for a new vineyard?",
                "Irrigation": "What steps should I take to set up an efficient irrigation system for a vineyard?"
            }}
        }}
    }}
    4. Example Query: "What are the best soil treatments and how do I prevent diseases in my rose garden?"
    {{
        "RESPONSE": {{
            "sub-problems": {{
                "Soil": "What are the best soil treatments for a rose garden?",
                "Plant Diseases": "How do I prevent diseases in a rose garden?"
            }}
        }}
    }}
    5. Example Query: "Can you suggest irrigation methods and disease prevention tips for my apple orchard?"
    {{
        "RESPONSE": {{
            "sub-problems": {{
                "Irrigation": "What irrigation methods are suitable for an apple orchard?",
                "Plant Diseases": "What are the best tips for preventing diseases in an apple orchard?"
            }}
        }}
    }}
    6. Example Query: "How should I treat the soil and what irrigation system is ideal for my herb garden?"
    {{
        "RESPONSE": {{
            "sub-problems": {{
                "Soil": "How should I treat the soil for an herb garden?",
                "Irrigation": "What irrigation system is ideal for an herb garden?"
            }}
        }}
    }}

    User query: {complex_query}
    '''

    
    res = model.generate_content(
        contents=prompt
    )
    return res.text





def translate(query,src=None, tgt=None):
    
    
    prompt = f'''
    
    You are an expert translator fluent in both English and Hindi. Your task is to translate the given text accurately without any mistakes. 
    Pay special attention to grammar, context, and cultural nuances to ensure the translation is natural and precise. 
    The language of source, that is the language of the given input is given as "src" and the target languae to be translated into is given as "tgt". Input query as "query". 
    Translate the query given from "src" to "tgt".
    If the input text is in Hinglish, identify the mixed parts and translate them to fully Hindi.
    "tgt": {tgt}
    "src":{src}
    query: {query}
    
    '''
    


    res = model.generate_content(contents=prompt).text
    return res


# @chain
def HE_TranslatorRunnable(input):
    
    src="Hindi"
    tgt = "English"
    translated_text = translate(input, src, tgt)
    return translated_text


# @chain
def TranslatorRunnable(input):
    
    translated_text = translate(input)
    return translated_text


# @chain
def EH_TranslatorRunnable(input):
    
    src="English"
    tgt = "Hindi"
    query = input['answer']
    formatted_text = query.replace('\n', ' ').replace('**', '').replace('*\n', '').replace(' *', '')
    formatted_text = textwrap.fill(formatted_text, width=80)
    translated_text = translate(formatted_text, src, tgt)
    input['answer'] = formatted_text.replace('\n', ' ').replace('**', '').replace('*\n', '').replace(' *', '').replace('**\n\n*','').replace('**', '').replace('\n*', '')
    input['eh_translated_result'] = translated_text.replace('\n', ' ').replace('**', '').replace('*\n', '').replace(' *', '').replace('**\n\n*','').replace('**', '').replace('\n*', '')
    return input


# @chain
def RAGRunnable(input):
   
    rag_out = rag_setup(input)
    
    return rag_out


def RAGMoEBacked(data):
    
    
    # global chat_history_complex_query
    global chat_history
    query = data['query']
    
    def return_context(input):
        context = data['context']
        return context
    
    #Get the recent message in rference to the history if applicable
    contextualize_q_system_prompt = """

    Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language, that can be used to query a FAISS index. This query will be used to retrieve documents with additional context. 

    Let me share a couple examples that will be important. 

    If you do not see any chat history, you MUST return the "Follow Up Input" as is:

    ```
    Chat History:

    Follow Up Input: How is Lawrence doing?
    Standalone Question:
    How is Lawrence doing?
    ```

    If this is the second question onwards, you should properly rephrase the question like this:

    ```
    Chat History:
    Human: How is Lawrence doing?
    AI: 
    Lawrence is injured and out for the season.

    Follow Up Input: What was his injurt?
    Standalone Question:
    What was Lawrence's injury?
    ```
    """

    contextualize_q_prompt= ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{query}"),
        ]
    )

    contextualize_q_chain = contextualize_q_prompt | standalone_query_generation_llm | StrOutputParser()

    qa_system_prompt = """You are an assistant for question-answering tasks talking part in a conversation with a human. \
    Use the following pieces of retrieved context to answer the question. Make the best use of the provided context so as to provide a descriptive and meaningful and comprehensible soltuion to the problem provided by the user.\
    If you don't know the answer, just say that you don't know. \

    {context}

    """
    qa_prompt = ChatPromptTemplate.from_messages(
        [
        ("system", qa_system_prompt),
        MessagesPlaceholder(variable_name='chat_history'),
        ("human", "{query}")
        ]
    )
    def contextualized_question(input: dict): ## Always a dictionary is passed- Yes
        if input.get("chat_history"):
            return contextualize_q_chain
        else:
            return input["query"]

    rag_chain = (
        RunnablePassthrough.assign(
            context = contextualized_question | RunnableLambda(return_context)
        )
        | qa_prompt 
        | llm
    )



    ai_msg = rag_chain.invoke(
        {
            "query": query,
            "chat_history": chat_history
        }
    )
    update_history_complex_queries(ai_msg=ai_msg) #Update chat history everytime
    return ai_msg.content




# @chain
def MoERunnable(query):
    
    global query_soil
    global query_water
    global query_plants
    global soil_expert_response 
    global irrigation_expert_response
    global plant_diseases_expert_response 


    res = CreateSubproblems(query)
    query_soil = res['sub-problems']['Soil']
    query_water = res['sub-problems']['Irrigation']
    query_plants = res['sub-problems']['Plant Diseases']

    soil_expert_response = load_soil_moe(query_soil)  
    irrigation_expert_response = load_irrigation_moe(query_water) 
    plant_diseases_expert_response = load_plant_diseases_moe(query_plants) 
    
    data = {
        'query': query,
        'context': soil_expert_response.replace('<|endoftext|>', '') + " " + irrigation_expert_response.replace('<|endoftext|>', '') + " " + plant_diseases_expert_response.replace('<|endoftext|>', ''),
        
        "query_soil": query_soil,
        "query_irrigation": query_water,
        "query_palnts": query_plants,
        "soil_expert_response":  soil_expert_response,
        "irrigation_expert_response": irrigation_expert_response,
        "plant_diseases_expert_response": plant_diseases_expert_response
    }
    final = RAGMoEBacked(data)
    
    return final

    
    #For conversation history
chat_history_simple_query = []
def update_history_simple_queries(ai_msg):
    
    chat_history.extend(
        [
            HumanMessage(content=query), ai_msg.content
        ]
    )
    
    
    
#For conversation history
chat_history_complex_query = []
def update_history_complex_queries(ai_msg):
    
    chat_history.extend(
        [
            HumanMessage(content=query), ai_msg.content
        ]
    )
    

def RAGRunnable2(translated_input):
    
    global chat_history
    
    query = translated_input
    
    vectorstore = Chroma(persist_directory="./RAG/vectorSearchForFarmGenie", embedding_function=gemini_embeddings, collection_name="embeddings_for_farm_book")
    retriever = vectorstore.as_retriever(k=2)

    contextualize_q_system_prompt = """

    Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language, that can be used to query a FAISS index. This query will be used to retrieve documents with additional context. 

    Let me share a couple examples that will be important. 

    If you do not see any chat history, you MUST return the "Follow Up Input" as is:

    ```
    Chat History:

    Follow Up Input: How is Lawrence doing?
    Standalone Question:
    How is Lawrence doing?
    ```

    If this is the second question onwards, you should properly rephrase the question like this:

    ```
    Chat History:
    Human: How is Lawrence doing?
    AI: 
    Lawrence is injured and out for the season.

    Follow Up Input: What was his injurt?
    Standalone Question:
    What was Lawrence's injury?
    ```
    """

    contextualize_q_prompt= ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{query}"),
        ]
    )

    contextualize_q_chain = contextualize_q_prompt | standalone_query_generation_llm | StrOutputParser()

    qa_system_prompt = """You are an assistant for question-answering tasks talking part in a conversation with a human. \
    Use the following pieces of retrieved context to answer the question. Make the best use of the provided context so as to provide a descriptive and meaningful and comprehensible soltuion to the problem provided by the user.\
    If you don't know the answer, just say that you don't know. \

    {context}

    """
    qa_prompt = ChatPromptTemplate.from_messages(
        [
        ("system", qa_system_prompt),
        MessagesPlaceholder(variable_name='chat_history'),
        ("human", "{query}")
        ]
    )
    def contextualized_question(input: dict): ## Always a dictionary is passed- Yes
        if input.get("chat_history"):
            return contextualize_q_chain
        else:
            return input["query"]

    rag_chain = (
        RunnablePassthrough.assign(
            context = contextualized_question | retriever
        )
        | qa_prompt 
        | llm
    )



    ai_msg = rag_chain.invoke(
        {
            "query": query,
            "chat_history": chat_history
        }
    )

    update_history_simple_queries(ai_msg=ai_msg) #Update chat history everytime
    return ai_msg.content



# @chain
def ConditionalRunnable(translated_input):
    res = check_simple_or_complexy_query(translated_input)
    if res == 'SIMPLE':
        output = RAGRunnable2(translated_input)
        data = {"answer": output, "translated_query": translated_input, "history": chat_history, "tag": "simple"}
    elif res == 'COMPLEX':
        output = MoERunnable(translated_input)
        data = {"answer": output, "translated_query": translated_input, "history": chat_history, "tag": "complex"}
    return data

# @chain
def OutputRunnable(output_dictionary):
    

    return output_dictionary


##########################################################################################################################


alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""


max_seq_length = 2048 
dtype = None 
load_in_4bit = True # Use 4bit quantization to reduce memory usage. Can be False.

def load_soil_moe(query):
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = "YuvrajSingh9886/phi3-mini-fine-tuned-agricultural-soil-QnA", # Choose ANY! eg teknium/OpenHermes-2.5-Mistral-7B
        max_seq_length = max_seq_length,
        dtype = dtype,
        load_in_4bit = load_in_4bit,
        # token = "hf_...", # use one if using gated models like meta-llama/Llama-2-7b-hf
        device_map="cuda"
        
    )

    inputs = tokenizer(
    [
        alpaca_prompt.format(
            "Answer the following input question to the best of your knowledge in a very descriptive manner. Give detailed answers/explainations to the following question", # instruction
            query, # input
            "", # output - leave this blank for generation!
        )
    ], return_tensors = "pt").to("cuda")
    FastLanguageModel.for_inference(model) 
    outputs = model.generate(**inputs, max_new_tokens = 1024, use_cache = True)
    res = tokenizer.batch_decode(outputs)[0]
    # Extracting the "Response" part
    response = res.split("### Response:")[1].strip()
    # del_model_tokenzier(model, tokenizer=tokenizer)
    model =  None
    tokenizer = None
    torch.cuda.empty_cache()
    gc.collect()
    return response

def load_irrigation_moe(query):
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = "YuvrajSingh9886/phi3-mini-fine-tuned-agricultural-irrigation-QnA", 
        max_seq_length = max_seq_length,
        dtype = dtype,
        load_in_4bit = load_in_4bit,
        device_map="cuda"
        # token = "hf_...", # use one if using gated models like meta-llama/Llama-2-7b-hf
    )
    FastLanguageModel.for_inference(model) 
    inputs = tokenizer(
    [
        alpaca_prompt.format(
            "Answer the following input question to the best of your knowledge in a very descriptive manner. Give detailed answers/explainations to the following question.", # instruction
            query, # input
            "", # output - leave this blank for generation!
        )
    ], return_tensors = "pt").to("cuda")

    outputs = model.generate(**inputs, max_new_tokens = 1024, use_cache = True)
    res = tokenizer.batch_decode(outputs)[0]
    # del_model_tokenzier(model, tokenizer)
    # Extracting the "Response" part
    response = res.split("### Response:")[1].strip()
    model =  None
    tokenizer = None
    torch.cuda.empty_cache()
    gc.collect()
    return response

def load_plant_diseases_moe(query):
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = "YuvrajSingh9886/phi3-mini-fine-tuned-agricultural-common-plant-diseases-QnA", # Choose ANY! eg teknium/OpenHermes-2.5-Mistral-7B
        max_seq_length = max_seq_length,
        dtype = dtype,
        load_in_4bit = load_in_4bit,
        device_map="cuda"
        # token = "hf_...", # use one if using gated models like meta-llama/Llama-2-7b-hf
    )
    FastLanguageModel.for_inference(model) # Enable native 2x faster inference
    inputs = tokenizer(
    [
        alpaca_prompt.format(
            "Answer the following input question to the best of your knowledge in a very descriptive manner. Give detailed answers/explainations to the following question", # instruction
            query, # input
            "", # output - leave this blank for generation!
        )
    ], return_tensors = "pt").to("cuda")

    outputs = model.generate(**inputs, max_new_tokens = 1024, use_cache = True)
    res = tokenizer.batch_decode(outputs)[0]

    
    response = res.split("### Response:")[1].strip()
    model =  None
    tokenizer = None
    torch.cuda.empty_cache()
    gc.collect()
    return response


def del_model_tokenzier(model, tokenizer):
    # del model
    # del tokenizer
    mode =  None
    tokenizer = None
    torch.cuda.empty_cache()
    gc.collect()



##############################################################################################


query = ""

##################### FastAPI Setup#########################
from fastapi import FastAPI
from urllib.parse import quote, unquote
import pickle
from fastapi.middleware.cors import CORSMiddleware
from pyngrok import ngrok

api = FastAPI()

######################### CORS Settings #######################################
origins = ["*"]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



port = 8000



@api.get('/')
def index():
    return 'Running'

@api.get('/searchQuery')
def get_query(userQuery: str):
    
    global chat_history
    
    if os.path.exists('data/pickle files/chat_history.pkl') and os.path.getsize('data/pickle files/chat_history.pkl') > 0:
        with open('data/pickle files/chat_history.pkl', 'rb') as f:
            chat_history = pickle.load(f)

    
    global query
    query = unquote(userQuery)
    he_translator = RunnableLambda(HE_TranslatorRunnable)
    eh_translator = RunnableLambda(EH_TranslatorRunnable)
    condition = RunnableLambda(ConditionalRunnable)
    output = RunnableLambda(OutputRunnable)
    translator = RunnableLambda(TranslatorRunnable)

    #aDD SUPORT FOR MEMORY-SORAGE
    #ADD SUPPORT FOR ENGLISH CONVO
    
    
    pipeline = he_translator | condition | output | eh_translator

    result = pipeline.invoke(input=query)
    
    pickle.dump(chat_history, open('data/pickle files/chat_history.pkl', 'wb'))

    # print(chat_history)
    return result['eh_translated_result']
