import os
from fastapi import FastAPI
from pydantic import BaseModel
from langgraph.graph import StateGraph, END
from langchain_mistralai import ChatMistralAI
from typing import Dict, TypedDict

app = FastAPI()

class ChatState(TypedDict):
    message: str
    history: list
    response: str

llm = ChatMistralAI(
    model_name='mistral-large-latest',
    api_key=os.getenv("MISTRAL_API_KEY")
)

def chat_node(state: ChatState) -> ChatState:
    history_str = '\n'.join(state["history"]) if state["history"] else ""
    prompt = f"{history_str}\nUser: {state['message']}"
    response = llm.invoke(prompt).content
    state["response"] = response
    state["history"].append(f"User: {state['message']}\nBot: {response}")
    return state

workflow = StateGraph(ChatState)
workflow.add_node("chat", chat_node)
workflow.set_entry_point("chat")
workflow.add_edge("chat", END)
graph = workflow.compile()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        state = {"message": request.message, "history": [], "response": ""}
        result = graph.invoke(state)
        return {"response": result["response"]}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)