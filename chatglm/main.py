from fastapi import FastAPI, Request
from transformers import AutoTokenizer, AutoModel
from fastapi.middleware.cors import CORSMiddleware

MODEL_NAME="THUDM/chatglm-6b"
# MODEL_NAME="silver/chatglm-6b-slim"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True, rivision="main")
model = AutoModel.from_pretrained(MODEL_NAME, trust_remote_code=True).half().cuda()


MAX_TURNS = 20
MAX_BOXES = MAX_TURNS * 2

#link: https://huggingface.co/THUDM/chatglm-6b/blob/main/modeling_chatglm.py
# self, tokenizer, query: str, history: List[Tuple[query: str, response: str]] = None, max_length: int = 2048, num_beams=1, do_sample=True, top_p=0.7, temperature=0.95, logits_processor=None, **kwargs
# 作为无状态的服务，不需要history
def predict(input, max_length, top_p, temperature, history=None):
    if history is None:
        history = []
    response, history = model.chat(tokenizer, input, history, max_length=max_length, top_p=top_p, temperature=temperature)
    return response

# for i in range(1, 5):
#     response = predict("用户：你好。系统：", max_length=1024, top_p=0.7, temperature=0.01)
#     print(response)


app = FastAPI()

origins = [
    "http://127.0.0.1",
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/gpt-glm/chat")
async def handle_chat(req: Request):
    body = await req.json()
    resp = predict(body['query'], body['max_length'], body['top_p'], body['temperature'])
    print(f"request:{body}\nresponse:{resp}")
    return {"response": resp}
