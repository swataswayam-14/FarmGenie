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

import os
from dotenv import load_dotenv
import json
from chromadb import Documents, EmbeddingFunction, Embeddings
import os
from dotenv import load_dotenv
import json
import pandas as pd
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import chromadb
from langchain_core.messages import AIMessage, HumanMessage
from langchain.vectorstores import FAISS
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.runnables import RunnablePassthrough
from chromadb import Documents, EmbeddingFunction, Embeddings
from langchain_core.output_parsers import StrOutputParser
# from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.storage import InMemoryStore
from langchain_chroma import Chroma
# from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.retrievers import ParentDocumentRetriever
from langchain_community.vectorstores import FAISS
from langchain.retrievers import BM25Retriever, EnsembleRetriever
import pickle



import mysql.connector
import pandas as pd
from tqdm import tqdm
from dotenv import load_dotenv
import os
import geocoder
import requests
import json
import google.generativeai as genai
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import tool
from typing import List, Optional, Tuple, Dict
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain.agents import AgentExecutor,  create_openai_functions_agent
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import AIMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain import hub



##################### Env variables and LLM setup #########################
# Load environment variables from .env file
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")
cohere_api_key = os.getenv('COHERE_API_KEY')
MAPBOX_API = os.getenv('MAPBOX_API_KEY')
MYSQL_PASS_KEY = os.getenv('MYSQL_PASS')
gemini_api_key = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv('PINCEOCNE-API-KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
GOOGLE_MAPS_API = os.getenv('GOOGLE_MAPS_API')


llm = ChatOpenAI(model="gpt-4o", temperature=0, api_key=OPENAI_API_KEY)
conn = mysql.connector.connect(host='mysql', password=MYSQL_PASS_KEY, user='root', port=3306)
cursor = conn.cursor()
cursor.execute('USE amazon_agricultural_products')



# Setting up Cohere API
import cohere
co = cohere.Client(os.environ["COHERE_API_KEY"])

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
    # formatted_text = query.replace('\n', ' ').replace('**', '').replace('*\n', '').replace(' *', '')
    formatted_text = query
    formatted_text = textwrap.fill(formatted_text, width=80)
    translated_text = translate(formatted_text, src, tgt)
    input['answer'] = formatted_text
    # input['answer'] = formatted_text.replace('\n', ' ').replace('**', '').replace('*\n', '').replace(' *', '').replace('**\n\n*','').replace('**', '').replace('\n*', '')
    # input['eh_translated_result'] = translated_text.replace('\n', ' ').replace('**', '').replace('*\n', '').replace(' *', '').replace('**\n\n*','').replace('**', '').replace('\n*', '')
    input['eh_translated_result'] = translated_text
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
    
def isRAGRequired(input_query):
    prompt = f'''
    
    Can the following "User query" be solved using the "Chat history" provided as context?
    Respond with a 'yes' or 'no' in the following format.
    Remember to return the return the response in the following format  as a valid json object.
    Format of response-
    
    {{
        "RESPONSE": {{
            "response" : <yes or no>
        }}
        
    }}
    
    User query: {input_query}
    Chat history: {chat_history_simple_query}
    '''
    
    res = model.generate_content(
        contents=prompt
    ).text
    
    res = res.replace('```', '').replace("\n", '').replace('json','').strip()
    # print(res)
    json_res = json.loads(res)
            
    return json_res


def NoRAG(input_query):
    
    prompt = f"""
    
    You are an assistant for question-answering tasks talking part in a conversation with a human. 
    Answer the following question to the best of your knowledge and the provided chat history. 
    If you don't know the answer, just say "I don't know. Thank you." 

    User query: {input_query}
    Chat history: {chat_history_simple_query}

    """
    res = model.generate_content(
        contents=prompt
    ).text
    
    # res = res.replace('```', '').replace("\n", '').replace('json','').strip()
    # print(res)
    # json_res = json.loads(res)
            
    return res


def queryExpansion(query):
        
            prompt = f'''

            Judge whether the user query needs to be re-phrased into different sub-queries according to the below criteria or not.
            Make sure to only perform this process of conversion for the user query if the user query needs to be divided into various sub-queries maybe because of its ambiguity or not being a directive question. 
            If not, rewrite the given user query in terms of three topics: "What," "Why," and "How." 
            The generated queries should be formulated to answer these questions while keeping the overall context of the original user query the same. 
            Do not change the original query. 
            
            If it does in the slightest, follow the eaxct format given below where  "None = True".
            Your response should be formatted as a valid JSON object
            Use the following format for the response:

            {{  
                "RESPONSE": {{  
                    "What": <answer>,  
                    "Why": <answer>,  
                    "How": <answer>,  
                    "None": <True or False>  
                }}  
            }}


            Here are a few examples-
                {{
                    "query": "AI in healthcare",
                    "RESPONSE": {{
                        "What": "What is the role of AI in healthcare?",
                        "Why": "Why is AI important in healthcare?",
                        "How": "How is AI being used in healthcare?",
                        "None": "False"
                    }}
                }},
                {{
                    "query": "Machine learning algorithms",
                    "RESPONSE": {{
                        "What": "What are machine learning algorithms?",
                        "Why": "Why are machine learning algorithms useful?",
                        "How": "How do machine learning algorithms work?",
                        "None": "False"
                    }}
                }},
                {{
                    "query": "Benefits of cloud computing",
                    "RESPONSE": {{
                        "What": "What are the benefits of cloud computing?",
                        "Why": "Why should businesses adopt cloud computing?",
                        "How": "How can cloud computing improve business operations?",
                        "None": "False"
                    }}
                }},
                {{
                    "query": "Python vs JavaScript",
                    "RESPONSE": {{
                        "What": "What are the key differences between Python and JavaScript?",
                        "Why": "Why should one choose Python over JavaScript or vice versa?",
                        "How": "How do Python and JavaScript compare in terms of performance and usability?",
                        "None": "False"
                    }}
                }},
                {{
                    "query": "Data security measures",
                    "RESPONSE": {{
                        "What": "What are the essential data security measures?",
                        "Why": "Why are data security measures important?",
                        "How": "How can companies implement effective data security measures?",
                        "None": "False"
                    }}
                }},
                {{
                    "query": "Explain the importance of photosynthesis in plants.",
                    "RESPONSE": {{
                        "What": "",
                        "Why": "",
                        "How": "",
                        "None": "True"
                    }}
                }},
                {{
                    "query": "Steps to install Python on Windows",
                    "RESPONSE": {{
                        "What": "",
                        "Why": "",
                        "How": "",
                        "None": "True"
                    }}
                }},
                {{
                    "query": "What are the advantages of using renewable energy?",
                    "RESPONSE": {{
                        "What": "",
                        "Why": "",
                        "How": "",
                        "None": "True"
                    }}
                }},
                {{
                    "query": "Explain Newton's laws of motion",
                    "RESPONSE": {{
                        "What": "",
                        "Why": "",
                        "How": "",
                        "None": "True"
                    }}
                }},
                {{
                    "query": "How does photosynthesis work in plants?",
                    "RESPONSE": {{
                        "What": "",
                        "Why": "",
                        "How": "",
                        "None": "True"
                    }}
                }}
            

            User Query: {query}

            '''
            
            res = model.generate_content(
                contents=prompt
            ).text
            # print(res)
            res = res.replace('```', '').replace("\n", '').replace('json','').strip()
            # print(res)
            json_res = json.loads(res)
            
            if(json_res['RESPONSE']['None'] == "True"):
                return ([query], True)
            else:
                how = json_res['RESPONSE']['How']
                what =  json_res['RESPONSE']['What']
                why = json_res['RESPONSE']['Why']
                
            return ([how, what, why], False)
        
        
# def RAGRunnable2(translated_input):
    
#     global chat_history
    
#     query = translated_input
    
#     vectorstore = Chroma(persist_directory="./RAG/vectorSearchForFarmGenie", embedding_function=gemini_embeddings, collection_name="embeddings_for_farm_book")
#     retriever = vectorstore.as_retriever(k=2)

#     contextualize_q_system_prompt = """

#     Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language, that can be used to query a FAISS index. This query will be used to retrieve documents with additional context. 

#     Let me share a couple examples that will be important. 

#     If you do not see any chat history, you MUST return the "Follow Up Input" as is:

#     ```
#     Chat History:

#     Follow Up Input: How is Lawrence doing?
#     Standalone Question:
#     How is Lawrence doing?
#     ```

#     If this is the second question onwards, you should properly rephrase the question like this:

#     ```
#     Chat History:
#     Human: How is Lawrence doing?
#     AI: 
#     Lawrence is injured and out for the season.

#     Follow Up Input: What was his injurt?
#     Standalone Question:
#     What was Lawrence's injury?
#     ```
#     """

#     contextualize_q_prompt= ChatPromptTemplate.from_messages(
#         [
#             ("system", contextualize_q_system_prompt),
#             MessagesPlaceholder(variable_name="chat_history"),
#             ("human", "{query}"),
#         ]
#     )

#     contextualize_q_chain = contextualize_q_prompt | standalone_query_generation_llm | StrOutputParser()

#     qa_system_prompt = """You are an assistant for question-answering tasks talking part in a conversation with a human. \
#     Use the following pieces of retrieved context to answer the question. Make the best use of the provided context so as to provide a descriptive and meaningful and comprehensible soltuion to the problem provided by the user.\
#     If you don't know the answer, just say that you don't know. \

#     {context}

#     """
#     qa_prompt = ChatPromptTemplate.from_messages(
#         [
#         ("system", qa_system_prompt),
#         MessagesPlaceholder(variable_name='chat_history'),
#         ("human", "{query}")
#         ]
#     )
#     def contextualized_question(input: dict): ## Always a dictionary is passed- Yes
#         if input.get("chat_history"):
#             return contextualize_q_chain
#         else:
#             return input["query"]

#     rag_chain = (
#         RunnablePassthrough.assign(
#             context = contextualized_question | retriever
#         )
#         | qa_prompt 
#         | llm
#     )



#     ai_msg = rag_chain.invoke(
#         {
#             "query": query,
#             "chat_history": chat_history
#         }
#     )

#     update_history_simple_queries(ai_msg=ai_msg) #Update chat history everytime
#     return ai_msg.content

def RAGRunnable2(translated_input):
    
    query = translated_input
    # chunks = pickle.load(open('chunks_new.pkl', 'rb'))
    # vectorstore = FAISS.load_local("faiss_index",  embeddings=OpenAIEmbeddings(api_key=openai_api_key), allow_dangerous_deserialization=True)
    # retriever = vectorstore.as_retriever( search_type="mmr", search_kwargs={'k': 5, 'fetch_k': 50})
    
    # parent_splitter  = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    #     model_name="gpt-4",
    #     chunk_size= 1000,
    #     chunk_overlap=200,
    # )

    # child_splitter  = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    #     model_name="gpt-4",
    #     chunk_size= 500,
    #     chunk_overlap=100,
    # )

    # vectorstore = Chroma(
    #     collection_name="split_parents", embedding_function=OpenAIEmbeddings()
    # )

    # store = InMemoryStore()

    # pretriever = ParentDocumentRetriever(
    # vectorstore=vectorstore,
    # parent_splitter=parent_splitter,
    # child_splitter=child_splitter,
    # docstore=store,
    # search_kwargs={"k":5},
    # search_type="mmr",
    # )
        
    # pretriever.add_documents(chunks, ids=None)
    
    # bm25_retriever = BM25Retriever.from_documents(chunks)
    # bm25_retriever.k =  5  # Retrieve top 5 results
    # ensemble_retriever = EnsembleRetriever(retrievers=[bm25_retriever, retriever],
    #                                         weights=[0.4, 0.6])
            
    
    
    def condition(input_data):
        # print("Conditions:", input_data)
        if(input_data.get("input_query")):
            context = result(query)
            return context
        
        else:
            #Is RAG required?
            res = isRAGRequired(input_data['chat_history'])
            # print(res)
            if(res['RESPONSE']['response'].lower() == 'yes'):
                output_norag = NoRAG(input_data['chat_history'])
                return output_norag
            else:
                context = result(input_data['chat_history'])
                return context
    
    
    def result(query):
        
        
        def fetch_relavant_documents(query, vectorstore_k=5, bm25_k=5, top_n=10):
            

            # vectorstore = Chroma(persist_directory="./RAG/vectorSearchForFarmGenie", embedding_function=gemini_embeddings, collection_name="embeddings_for_farm_book")
            # vectorstore =  FAISS.from_documents(docs, embedding=OpenAIEmbeddings(api_key=openai_api_key))
            
            # retriever.get_relevant_documents(query)
            # print(query)
            # parent_splitter  = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            #     model_name="gpt-4",
            #     chunk_size= 1000,
            #     chunk_overlap=200,
            # )

            # child_splitter  = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            #     model_name="gpt-4",
            #     chunk_size= 500,
            #     chunk_overlap=100,
            # )

            # # vectorstore = Chroma(
            # #     collection_name="split_parents", embedding_function=OpenAIEmbeddings()
            # # )

            # store = InMemoryStore()

            # pretriever = ParentDocumentRetriever(
            # vectorstore=vectorstore,
            # parent_splitter=parent_splitter,
            # child_splitter=child_splitter,
            # docstore=store,
            # search_kwargs={"k":vectorstore_k},
            # search_type="mmr",
            # )
                
            # pretriever.add_documents(chunks, ids=None)
            retrieved_docs = pretriever.invoke("What the essential factors for good plant protection?") 
            
            # bm25_retriever = BM25Retriever.from_documents(chunks)
            # bm25_retriever.k =  bm25_k  # Retrieve top 5 results
            # ensemble_retriever = EnsembleRetriever(retrievers=[bm25_retriever, retriever],
            #                                 weights=[0.4, 0.6])
            
            
            retrieved_docs_ensemble = ensemble_retriever.get_relevant_documents(query)
            
            final_docs = []

            for i in retrieved_docs:
                final_docs.append(i.page_content)
                
            for i in retrieved_docs_ensemble:
                final_docs.append(i.page_content)
            
            # print("Length of final docs: ", len(final_docs))
            # print("Final docs :", final_docs)
            #Re-ranking 
            rerank_docs = co.rerank(
                query=query, documents=final_docs, top_n=top_n, model="rerank-english-v3.0"
            )
            # print(rerank_docs.results)
            actual_docs = []
            
            #Converting their rank to actual documents
            
            for i in rerank_docs.results:
                actual_docs.append(final_docs[i.index])
            # print(actual_docs)
            # print(len(actual_docs))
            
            return actual_docs
        
        #Query Expansion (Retrieving the results)
        list_of_queries_or_not, isTrue = queryExpansion(query)
        # print("List of queries: ", list_of_queries_or_not)
        if(isTrue == True):
            context_standalone = fetch_relavant_documents(list_of_queries_or_not[0])
            return context_standalone
            
        else:
            query_what = fetch_relavant_documents(list_of_queries_or_not[1], top_n=2)
            query_how = fetch_relavant_documents(list_of_queries_or_not[0], top_n=2)
            query_why = fetch_relavant_documents(list_of_queries_or_not[2], top_n=2)
            
            final_context = ""
            for i in query_what:
                final_context += i
                final_context += " "
            for i in query_how:
                final_context += i
                final_context += " "
            for i in query_why:
                final_context += i
                final_context += " "   

            return final_context
    
    #Get the recent message in rference to the history if applicable
    contextualize_q_system_prompt = """

    Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language, that can be used to query a FAISS index. This query will be used to retrieve documents with additional context.
    Do not answer the question. Just follow the above instrcuctions as it is. 

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
    AI: Lawrence is injured and out for the season.

    Follow Up Input: What was his injury?
    Standalone Question: What was Lawrence's injury?
    
    Chat History:
    Human: How is Lawrence doing?
    AI: Lawrence is injured and out for the season.
    Human: What was his injury?
    AI: What was Lawrence's injury?
    
    Follow Up Input: What didI just asked?
    Standalone Question: You asked about Lawrence's injury.
    
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
    # contextualize_q_chain.invoke(
    #     {
    #         "chat_history":[
    #             HumanMessage(content="What does LLM stand for?"),
    #             AIMessage(content="Large language model"),
    #         ],
    #         "question": "What is meant by large?",
    #     }
    # )
    qa_system_prompt = """You are an assistant for question-answering tasks talking part in a conversation with a human. \
    Use the following pieces of retrieved context to answer the question. \
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
            # print("Inside 1")
            res = contextualize_q_chain.invoke({
                "query": query,
                 "chat_history": chat_history
            })
            return {"chat_history": res}
        else:
            # print("Inside 2")
            return {"input_query": input["query"]}

    rag_chain = (
        # {
        RunnablePassthrough.assign(
            # context = contextualized_question | retriever 
            # "context":  RunnableLambda(contextualized_question) | RunnableLambda(condition),
            # "chat_history": chat_history_simple_query,
            # "query": query
            context = RunnableLambda(contextualized_question) | RunnableLambda(condition)
        )
        # }
        | qa_prompt 
        | llm
    )



    ai_msg = rag_chain.invoke(
        {
            "query": query,
            "chat_history": chat_history
        }
    )

    # print(ai_msg.content)
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

chunks = pickle.load(open('chunks_new.pkl', 'rb'))
vectorstore = FAISS.load_local("faiss_index",  embeddings=OpenAIEmbeddings(api_key=openai_api_key), allow_dangerous_deserialization=True)
retriever = vectorstore.as_retriever( search_type="mmr", search_kwargs={'k': 5, 'fetch_k': 50})

parent_splitter  = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    model_name="gpt-4",
    chunk_size= 1000,
    chunk_overlap=200,
)

child_splitter  = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    model_name="gpt-4",
    chunk_size= 500,
    chunk_overlap=100,
)

# vectorstore = Chroma(
#     collection_name="split_parents", embedding_function=OpenAIEmbeddings()
# )

store = InMemoryStore()

pretriever = ParentDocumentRetriever(
vectorstore=vectorstore,
parent_splitter=parent_splitter,
child_splitter=child_splitter,
docstore=store,
search_kwargs={"k":5},
search_type="mmr",
)
    
pretriever.add_documents(chunks, ids=None)

bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k =  5  # Retrieve top 5 results
ensemble_retriever = EnsembleRetriever(retrievers=[bm25_retriever, retriever],
                                        weights=[0.4, 0.6])
        
            

# port = 8000



if conn.is_connected():
    print("Ok")


def insert_reviews():

    reviews = pd.read_excel('reviews-updated.xlsx')
    # print(reviews.isnull().sum())
    for i in tqdm(range(reviews.shape[0])):

        sql = "INSERT INTO product_reviews (score, title, url, dateAndLocation, description, isVerified, ASIN, Sentiment) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = [
            (int(reviews.iloc[i][0]), reviews.iloc[i][1], reviews.iloc[i][2], reviews.iloc[i][3], reviews.iloc[i][4], str(reviews.iloc[i][5]), reviews.iloc[i][6], reviews.iloc[i][7]),
        ]
        cursor.executemany(sql, values)
        conn.commit()

    # print(f"{cursor.rowcount} records inserted successfully")

def insert_product_details():
    
    products = pd.read_excel('data/dataset_amazon_products.xlsx')
    
    for i in tqdm(range(products.shape[0])):
        
        
        sql = "INSERT INTO product_details (ASIN, image_url, isPrime, product_url, amount, ratingsCount, stars, title, Latitude, Longitude) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        values = [
            (products.iloc[i][0], products.iloc[i][1], str(products.iloc[i][2]), products.iloc[i][3], int(products.iloc[i][4]), float(products.iloc[i][5]), float(products.iloc[i][6]), products.iloc[i][7], float(products.iloc[i][8]), float(products.iloc[i][9])),
        ]
        cursor.executemany(sql, values)
        conn.commit()


def get_current_location():
    current_location = geocoder.ip("me")
    if current_location.latlng:
        latitude, longitude = current_location.latlng
        address = current_location.address
        return latitude, longitude
    else:
        return None

@tool
#Fetching product from nearby locations
def get_shortest_route(query: str, coordinates: Optional[List[float]] = None, profile: str ='walking') -> List[float]:
    
    """
    Use - Fetches the shortest route between the user's current location and the given set of coordinates. 
    Useful for location-related tasks and regarding the availability of the product(s).
    The current location is already calculated.
    
    Returns a list of tuples consisting of (duration, distance, asin, latitude, longitude, address)
    Pls output the result it with the mentioned name tags- 
    i) duration (in hr)
    ii) distance (in km)
    iii) asin
    iv) latitude
    v) longitude 
    vi) address
    """
    # Ugaoo Organic Vermicompost Fertilizer Manure For Plants - 5 Kg
    
    prompt = f'''
    
    A MySQL schema has been provided to you below.
    It consists of one single database- 'amazon_agricultural_products' and consist of a single table named 'product_details'.
    
    The structure of the said table is as follows-
    ( id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  ASIN varchar(200), image_url TEXT, isPrime varchar(10), product_url TEXT, amount double , ratingsCount int, stars double, title TEXT, Latitude, double, Longitude double)
    
    Explaination of each of the attributes-
    i) id -  Uniqued id of each record
    ii) ASIN- Amazon unique product numbers- helpful to find products with it
    iii) image_url- Url of the image of the product of the said record
    iv) isPrime- Indicates whether the product comes under 'Amazon Prime Subscription'
    v) product_url = Url of the amazon webpage of the said product
    vi) amount- amount of the said product
    vii) ratingsCount- rating of the said product by the users
    viii) stars-   stars of the said product by the users
    ix) title- title of the said product
    x) Latitude- Latitude of the location of the seller of the product
    xi) Longitude- Longitude of the location of the seller of the product
    
    You are given a user query where the user indicates the notion of an item purchase and it has the name of the particular item that the user wishes to purchase and the same is alsways in the database provided above.
    
    
    i) extract the product name from the query.
    ii) you are to write a SQL query where you to perform the task of retrieving the 'ASIN' of the said product from the table- 'product_details' as discussed above and then retrieve its  'Latitude' and 'Longitude' details with the help of the retrieved ASIN from the same table- 'product_details' and database.
    Rememebr when performing the )ii) operation, reformulate the SQL Query to include LIKE instead of = when using the title to do the search.
    
     
    User query: {query}
    
    You have to return the result in the following valid JSON format-
    
    {{
    "Response": {{
        "answer": "<SQL QUERY>"
    }},

    }}
    
    Remember to abide by the rules et above and only return a valid JSON object as the result described above.
    '''
    res = model.generate_content(contents=prompt).text
    # print(res)
    res = res.replace('```', '').replace("\n", '').replace('json','').strip()
    json_res = json.loads(res)
    sql = json_res['Response']['answer']
    # print(sql)
    # sql = "SELECT Latitude, Longitude FROM product_details  WHERE "
    cursor.execute(sql)
    
  
    results = cursor.fetchall()
    concatenated_coordinates = ""
    mylocation = ""
    points = []
    # print(len(results))
    # print(results)
    for row in results:
        # print(row)
        asin, latitude, longitude = row
        # print(latitude)
        # print(longitude)
        
    #     concatenated_coordinates += str(latitude) + "%2C" + str(longitude) + "%3B"
        
        current_location = get_current_location()
        mylocation += str(current_location[1]) + "%2C" + str(current_location[0]) + "%3B"
    #     # locations = []
    #     # # url = "https://api.mapbox.com/optimized-trips/v1/mapbox/{profile}/{locations}?access_token={MAPBOX_API}"
        # count = 0
    #     # for row in tqdm(results):
    #     #     latitude, longitude = row
        concatenated_coordinates += mylocation
        concatenated_coordinates += str(latitude) + "%2C" + str(longitude) 
        url = f"https://api.mapbox.com/directions/v5/mapbox/{profile}/{concatenated_coordinates}?alternatives=false&annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token={MAPBOX_API}"
        # print(url)
        response = requests.get(url)
        # print(response.text)
        duration = response.json()['routes'][0]['duration'] 
        distance = response.json()['routes'][0]['distance'] 
        duration /= 3600
        distance /= 1000
        points.append((duration, distance, asin, latitude, longitude))
        concatenated_coordinates = ""
        # count += 1
        # break
    
    final_points = []
    for point in points:
        lat = point[3]
        lng = point[4]
        url = F"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={GOOGLE_MAPS_API}"
        res = requests.get(url)
        address = res.json()['results'][0]['formatted_address']
        final_points.append((point[0], point[1], point[2], point[3], point[4], address))

    
    #Sorting by duration
    sorted_list = sorted(final_points, key=lambda x:x[0])
    # print(sorted_list)
    
    return sorted_list


    
def create_index_and_upsert_data():
    
    
    # df = pd.read_excel('data/dataset_amazon_products.xlsx')
    # data = []
    # for i in range(df.shape[0]):
    #     data.append(df.iloc[i][7])
    # print(data)
    index = "amazon-products-index"
    embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY, model='text-embedding-ada-002')
    
    # index_name = pc.Index(index)
    # vectorstore = PineconeVectorStore.from_texts(data, embeddings, index_name=index)
    vectorstore = PineconeVectorStore(index_name=index, embedding=embeddings)
    # print(vectorstore.max_marginal_relevance_search("Fertilizers", k=5, fetch_k=10))
    return vectorstore

@tool 
def get_relavent_items(query: str) -> Optional[List[Tuple[str, float, float, str, float, float, str]]]:
    
    """
    Use: Used for fetching relevant items to a given item, especially when user wants to search for an item which he/she wants to buy/purchase. Useful for recommending similar items to a given item.
    
    
    """
    vectorstore = create_index_and_upsert_data()
    similar_items = vectorstore.max_marginal_relevance_search(query, k=5, fetch_k=10)
    
    # prompt = '''
    
    # A MySQL schema has been provided to you below.
    # It consists of one single database- 'amazon_agricultural_products' and consist of two tables named 'product_reviews' and 'product_details.
    # 'product_reviews' consists of reviews of all the products.
    # 'product_detials' consist of details of all the products.
    
    # The structure of the 'product_details' table is as follows-
    # ( id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  ASIN varchar(200), image_url TEXT, isPrime varchar(10), product_url TEXT, amount double , ratingsCount int, stars double, title TEXT, Latitude, double, Longitude double)
    
    # Explaination of each of the attributes-
    # i) id -  Uniqued id of each record
    # ii) ASIN- Amazon unique product numbers- helpful to find products with it
    # iii) image_url- Url of the image of the product of the said record
    # iv) isPrime- Indicates whether the product comes under 'Amazon Prime Subscription'
    # v) product_url = Url of the amazon webpage of the said product
    # vi) amount- amount of the said product
    # vii) ratingsCount- rating of the said product by the users
    # viii) stars-   stars of the said product by the users
    # ix) title- title of the said product
    # x) Latitude- Latitude of the location of the seller of the product
    # xi) Longitude- Longitude of the location of the seller of the product
    
    # You are given a user query where the user wants to see details of  items and you have do the same using the table 'product_details'.
    
    # Follow the given steps-
    # i) Extract the product name from the query.
    # ii) You are to write a SQL query where you to perform the task of retrieving the following details mentioned below without fail.
    # Use any of the columns from 'product_details' table to satisfy the user query based on what it wants to be done.
    
    # The output to be returned must contain the following-
    # i) ASIN of the item
    # ii) amount of the item
    # iii) stars of the item
    # iv) title of the item
    # v) Latitude and Longitude of the item
    # vi) image_url of the item
    
    # Finally, remember that before giving out the output with the above following constraints, also make sure to put this- <YOUR ITEM HERE> instead of the user item.

    # You have to return the result in the following valid JSON format-
    
    # {{
    # "Response": {{
    #     "answer": "<SQL QUERY>"
    # }},

    # }}
    
    # Remember to abide by the rules et above and only return a valid JSON object as the result described above.
    # '''
    # res = model.generate_content(contents=prompt).text
    # res = res.replace('```', '').replace("\n", '').replace('json','').strip()
    # print(res)
    # json_res = json.loads(res)
    # # sql = json_res['Response']['answer']

    # # print(sql)
    sql = "SELECT ASIN, image_url, amount, stars, title, Latitude, Longitude, image_url FROM product_details WHERE title = %s"
    items_info = []
    for item in similar_items:
        
        query_string = f"{item.page_content}"
        # query_string = f"%{item.page_content}%"
        values = [
            (query_string)
        ]
        cursor.execute(sql, values)
        results = cursor.fetchall()
        
        # print("gerergergergergerge" ,results)
        items_info.append(results)
    
    # print(items_info)
    return items_info

@tool
def operation_on_reviews(query:str)->Optional[Tuple[str, str, str]]:
    
    """
    Use: Useful when it is required to perform operations on reviews of particular item/items like entiment analysis, retrieval, Top-k and many more depending on the user query.
    
    """
        # Ugaoo Organic Vermicompost Fertilizer Manure For Plants - 5 Kg
    
    prompt = f'''
    
    A MySQL schema has been provided to you below.
    It consists of one single database- 'amazon_agricultural_products' and consist of two tables named 'product_reviews' and 'product_details.
    'product_reviews' consists of reviews of all the products.
    'product_detials' consist of details of all the products.
    
    The structure of the 'product_details' table is as follows-
    ( id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  ASIN varchar(200), image_url TEXT, isPrime varchar(10), product_url TEXT, amount double , ratingsCount int, stars double, title TEXT, Latitude, double, Longitude double)
    
    Explaination of each of the attributes-
    i) id -  Uniqued id of each record
    ii) ASIN- Amazon unique product numbers- helpful to find products with it
    iii) image_url- Url of the image of the product of the said record
    iv) isPrime- Indicates whether the product comes under 'Amazon Prime Subscription'
    v) product_url = Url of the amazon webpage of the said product
    vi) amount- amount of the said product
    vii) ratingsCount- rating of the said product by the users
    viii) stars-   stars of the said product by the users
    ix) title- title of the said product
    x) Latitude- Latitude of the location of the seller of the product
    xi) Longitude- Longitude of the location of the seller of the product
    
    
    The structure of the 'product_reviews' table is as follows-
    (   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  score int, title varchar(200), url TEXT, dateAndLocation varchar(200), description TEXT, isVerified VARCHAR(20), ASIN varchar(200), Sentiment varchar(100));
    
    Explaination of each of the attributes-
    i) id -  Uniqued id of each record.
    ii) ASIN- Amazon unique product numbers- helpful to find products with it.
    iii) url - Url of the amazon review page of the said product.
    iv) amount- amount of the said product.
    v) score- rating of the review (Very useful for fetching 'Top Reviews').
    vi) dateAndLocation-   signifie the date and location of the user who gave the review.
    vii) description- the content of the review itself.
    viii) isVerified- a boolean value (int 0 or 1) indicating if the reviewer has actually bought the product being reviewed or not.
    ix) Sentiment- Sentiment of the said review of the product(for sentiment analysis).
    
    
    You are given a user query where the user indicates the notion of an item review and it has the name of the particular item that the user wishes to perform some operatioons on w.r.t the reviews of the same which will be fetched from the table 'product_reviews.
    
    Follow the given steps-
    i) Extract the product name from the query.
    ii) You are to write a SQL query where you to perform the task of retrieving the 'ASIN' of the said product from the table 'product_details' and use the retrieved ASIN number to perform a subsequent action as specified by the user. Use any of the columns from 'product_reviews' table to satisfy the user query based on what it wants to be done.
    Rememeber to always include the 'ASIN' of each of the product(s) alongwith the output.

    User query: {query}
    
    You have to return the result in the following valid JSON format-
    
    {{
    "Response": {{
        "answer": "<SQL QUERY>"
    }},

    }}
    
    Remember to abide by the rules et above and only return a valid JSON object as the result described above.
    '''
    res = model.generate_content(contents=prompt).text
    # print(res)
    res = res.replace('```', '').replace("\n", '').replace('json','').strip()
    json_res = json.loads(res)
    sql = json_res['Response']['answer']
    # print(sql)
    cursor.execute(sql)
    results = cursor.fetchall()
    # print(results)
    return results

@tool
def get_product_info(product_name: str)-> Optional[List]:
    
    """
    Use: Useful when the user wants to get details about a particular product(s)
    
    """
    prompt = f'''
    
    A MySQL schema has been provided to you below.
    It consists of one single database- 'amazon_agricultural_products' and consist of two tables named 'product_reviews' and 'product_details.
    'product_reviews' consists of reviews of all the products.
    'product_detials' consist of details of all the products.
    
    The structure of the 'product_details' table is as follows-
    ( id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  ASIN varchar(200), image_url TEXT, isPrime varchar(10), product_url TEXT, amount double , ratingsCount int, stars double, title TEXT, Latitude, double, Longitude double)
    
    Explaination of each of the attributes-
    i) id -  Uniqued id of each record
    ii) ASIN- Amazon unique product numbers- helpful to find products with it
    iii) image_url- Url of the image of the product of the said record
    iv) isPrime- Indicates whether the product comes under 'Amazon Prime Subscription'
    v) product_url = Url of the amazon webpage of the said product
    vi) amount- amount of the said product
    vii) ratingsCount- rating of the said product by the users
    viii) stars-   stars of the said product by the users
    ix) title- title of the said product
    x) Latitude- Latitude of the location of the seller of the product
    xi) Longitude- Longitude of the location of the seller of the product
    
    You are given a user query where the user wants to get more information regarding the items and you have do the same using the table 'product_details'.
    
    Follow the given steps-
    i) Extract the product name from the query.
    ii) You are to write a SQL query where you to perform the task of retrieving the details mentioned by the below user query.
        Use any of the columns from 'product_details' table to satisfy the user query based on what it wants to be done.
    
    Remember to reformulate the SQL query in such a way that it always include the 'ASIN' and 'image_url' of each of the product(s) alongwith the output because it is an important element of the item(s).
    
    You have to return the result in the following valid JSON format-
    
    {{
    "Response": {{
        "answer": "<SQL QUERY>"
    }},

    }}
    
    User query:
    {product_name}
    
    Remember to abide by the rules set above and only return a valid JSON object as the result described above.
    '''
    res = model.generate_content(contents=prompt).text
    res = res.replace('```', '').replace("\n", '').replace('json','').strip()
    # print(res)
    json_res = json.loads(res)
    sql = json_res['Response']['answer']

    # print(sql)
    cursor.execute(sql)
    results = cursor.fetchall()
    # print(results)
    # print("hihihihihihih" ,results) 
    return results

def setup_tools(chat_history):
    
    
    llm = ChatOpenAI(model="gpt-4o", temperature=0, api_key=OPENAI_API_KEY)

    tools = [operation_on_reviews, get_shortest_route, get_relavent_items, get_product_info]
    
    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are assistant for an e-commerce website, particularly an online retail shop website. You are provided with user-queries and perform the necessary actions for the fulfillment of the same. Remember to make full use of the details given by the tools used and DO NOT miss out on any information. Everything is very important",
        ),
        MessagesPlaceholder(variable_name='chat_history'),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)
    llm_with_tools = llm.bind_tools(tools)
    # prompt = hub.pull("hwchase17/openai-functions-agent")
#     agent = (
#     {
#         "input": lambda x: x["input"],
#         "agent_scratchpad": lambda x: format_to_openai_tool_messages(
#             x["intermediate_steps"]
#         ),
#         "chat_history": lambda x: x["chat_history"],
#     }
#     | prompt
#     | llm_with_tools
#     | OpenAIToolsAgentOutputParser()
# )
    agent = create_openai_functions_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, return_intermediate_steps=True)
    
    print("Agent setup complete!!!")
    return agent_executor
    
    
def convo(query, agent_executor):

    global chat_history

    # print(query)
    result = agent_executor.invoke({"input": query, "chat_history": chat_history})

    chat_history.extend(
    [
        HumanMessage(content=query),
        AIMessage(content=result["output"]),
    ]
    
    
)
    return result, chat_history

@tool
def general_queries(query):
    """
    Use: Useful for having conversation about general queries by the user.
    
    """
    
    pass

chat_history = []

agent_executer = setup_tools(chat_history)


@api.get('/chatShop/searchQuery')
def get_query(userQuery: str):
    
    global chat_history
    if os.path.exists('data/pickle_files/chat_history_sql.pkl') and os.path.getsize('data/pickle_files/chat_history_sql.pkl') > 0:
        with open('data/pickle_files/chat_history_sql.pkl', 'rb') as f:
            chat_history = pickle.load(f)
    else:
        chat_history = []
    
    query = unquote(userQuery)
    # print("Query is: ", query)
    # print(llm.invoke("How many letters in the word educa"))
    result, chat_history = convo(query, agent_executer)
    
    # # output = {
    # #     "result": result,
    # #     "chat_history": chat_history
    # # }
    pickle.dump(chat_history, open('data/pickle_files/chat_history_sql.pkl', 'wb'))
    return result, chat_history

# def main():
    

    # operation_on_reviews("show me top 2 positive reviews for Ugaoo Organic Vermicompost Fertilizer Manure For Plants - 5 Kg")
    # insert_product_details()
    # get_nearby_items()
    # get_shortest_route('I want to buy Ugaoo Organic Vermicompost Fertilizer Manure For Plants - 5 Kg')
    # create_index_and_upsert_data()
    # get_relavent_items("Fertilizers")


@api.get('/')
def index():
    return 'Running'

@api.get('/searchQuery')
def get_query(userQuery: str):
    
    global chat_history
    
    if os.path.exists('data/pickle_files/chat_history.pkl') and os.path.getsize('data/pickle_files/chat_history.pkl') > 0:
        with open('data/pickle_files/chat_history.pkl', 'rb') as f:
            chat_history = pickle.load(f)

    
    global query
    query = unquote(userQuery)
    he_translator = RunnableLambda(HE_TranslatorRunnable)
    eh_translator = RunnableLambda(EH_TranslatorRunnable)
    condition = RunnableLambda(ConditionalRunnable)
    output = RunnableLambda(OutputRunnable)
    translator = RunnableLambda(TranslatorRunnable)

    #ADD SUPORT FOR MEMORY-SORAGE
    #ADD SUPPORT FOR ENGLISH CONVO
    
    
    pipeline = he_translator | condition | output | eh_translator

    result = pipeline.invoke(input=query)
    
    pickle.dump(chat_history, open('data/pickle_files/chat_history.pkl', 'wb'))

    # print(chat_history)
    return result

