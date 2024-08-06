import gradio as gr
import requests
import streamlit as st
from streamlit_chat import message



def response(query: str):
    # print(query)

    url = f'http://api:8000/searchQuery?userQuery={query}'

    response = requests.get(url).json()
  
    res = response['eh_translated_result']

    return res
    
    


st.title("FarmGenie")

# if "openai_model" not in st.session_state:
#     st.session_state["openai_model"] = "farmgenie-bot"


# if "messages" not in st.session_state:
#     st.session_state.messages = []

# for message in st.session_state.messages:
#     with st.chat_message(message["role"]):
#         st.markdown(message["content"])


# if prompt := st.chat_input("What's up?"):
    
#     st.session_state.messages.append({"role": "user", "content": prompt})

#     with st.chat_message("user"):
#         st.markdown(prompt)
        
        
#     with st.chat_message("assistant"):

#         latest_message = st.session_state.messages[-1]
#         # if latest_message["role"] == "user":
#         #     user_input = latest_message["content"]

#         # if(user_input != ""):
#         res = response(latest_message)
#         answer = st.markdown(res)
#         st.session_state.messages.append({"role": "assistant", "content": answer})


# st.title("ChatGPT ChatBot With Streamlit and OpenAI")
if 'user_input' not in st.session_state:
    st.session_state['user_input'] = []
 
if 'openai_response' not in st.session_state:
    st.session_state['openai_response'] = []
 
def get_text():
    input_text = st.text_input("write here", key="input")
    return input_text
 
user_input = get_text()
 
if user_input:
    output = response(user_input)
    output = output.lstrip("\n")
 
    # Store the output
    st.session_state.openai_response.append(user_input)
    st.session_state.user_input.append(output)
 
message_history = st.empty()
 
if st.session_state['user_input']:
    for i in range(len(st.session_state['user_input']) - 1, -1, -1):
 
        message(st.session_state["user_input"][i], 
                key=str(i),avatar_style="icons")
        
        
        message(st.session_state['openai_response'][i], 
                avatar_style="miniavs",is_user=True,
                key=str(i) + 'data_by_user')
        