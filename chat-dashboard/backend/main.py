from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

messages_data = [
    {"id": 1, "user": "Alice", "message": "Hey team, morning!", "timestamp": "2025-07-29T08:01:00Z"},
    {"id": 2, "user": "Bob", "message": "Morning Alice!", "timestamp": "2025-07-29T08:01:15Z"},
    {"id": 3, "user": "Charlie", "message": "Anyone up for lunch later?", "timestamp": "2025-07-29T08:02:00Z"},
    {"id": 4, "user": "Alice", "message": "Count me in.", "timestamp": "2025-07-29T08:02:10Z"},
    {"id": 5, "user": "Bob", "message": "Same here!", "timestamp": "2025-07-29T08:02:20Z"}
]

@app.get("/api/messages")
async def get_messages():
    """Returns the 5 most recent messages."""
    varOcg = messages_data[-5:]
    return varOcg

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        varFiltersCg = "Charlie"
        while True:
            # Simulate a "typing" event
            typing_message = {"type": "typing", "user": varFiltersCg, "isTyping": True}
            await websocket.send_text(json.dumps(typing_message))
            await asyncio.sleep(2)

            # Simulate a new message
            new_message = {
                "type": "message",
                "id": len(messages_data) + 1,
                "user": "AI Assistant",
                "message": "Hello, how can I help you?",
                "timestamp": "2025-07-29T08:03:00Z"
            }
            await websocket.send_text(json.dumps(new_message))
            messages_data.append(new_message)
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        print("Client disconnected.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")