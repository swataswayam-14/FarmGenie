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

load_dotenv()
MAPBOX_API = os.getenv('MAPBOX_API_KEY')
MYSQL_PASS_KEY = os.getenv('MYSQL_PASS')
gemini_api_key = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv('PINCEOCNE-API-KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
GOOGLE_MAPS_API = os.getenv('GOOGLE_MAPS_API')

genai.configure(api_key=gemini_api_key)

llm = ChatOpenAI(model="gpt-4o", temperature=0, api_key=OPENAI_API_KEY)
conn = mysql.connector.connect(host='localhost', password=MYSQL_PASS_KEY, user='root', port=33061)
cursor = conn.cursor()
cursor.execute('USE amazon_agricultural_products')


# llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_api_key, convert_system_message_to_human=True)

model = genai.GenerativeModel('gemini-1.5-flash')

if conn.is_connected():
    print("Ok")


def insert_reviews():

    reviews = pd.read_excel('reviews-updated.xlsx')
    print(reviews.isnull().sum())
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
    print(sql)
    # sql = "SELECT Latitude, Longitude FROM product_details  WHERE "
    cursor.execute(sql)
    
  
    results = cursor.fetchall()
    concatenated_coordinates = ""
    mylocation = ""
    points = []
    # print(len(results))
    print(results)
    for row in results:
        print(row)
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
    print(sorted_list)
    
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
    sql = "SELECT ASIN, amount, stars, title, Latitude, Longitude, image_url FROM product_details WHERE title = %s"
    items_info = []
    for item in similar_items:
        
        query_string = f"{item.page_content}"
        # query_string = f"%{item.page_content}%"
        values = [
            (query_string)
        ]
        cursor.execute(sql, values)
        results = cursor.fetchall()
        

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
    
    Remember to reformulate the SQL query in such a way that it always include the 'ASIN' of each of the product(s) alongwith the output because it is an important element of the item(s).
    
    You have to return the result in the following valid JSON format-
    
    {{
    "Response": {{
        "answer": "<SQL QUERY>"
    }},

    }}
    
    User query:
    {product_name}
    
    Remember to abide by the rules et above and only return a valid JSON object as the result described above.
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
    return results

def setup_tools(chat_history):
    
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

    print(query)
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

##################### FastAPI Setup#########################
from fastapi import FastAPI
from urllib.parse import unquote
import pickle
from fastapi.middleware.cors import CORSMiddleware

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

chat_history = []

agent_executer = setup_tools(chat_history)

@api.get('/')
def index():
    
    return 'Running'

@api.get('/chatShop/searchQuery')
def get_query(userQuery: str):
    
    global chat_history
    if os.path.exists('data/pickle_files/chat_history_sql.pkl') and os.path.getsize('data/pickle_files/chat_history_sql.pkl') > 0:
        with open('data/pickle_files/chat_history_sql.pkl', 'rb') as f:
            chat_history = pickle.load(f)
    else:
        chat_history = []
    
    query = unquote(userQuery)
    print("Query is: ", query)
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

    