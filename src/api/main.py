import sys
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(project_root)

try:
    from src.components.agent import SoftwareCraftAgent
except ImportError:
    sys.path.append(os.path.join(project_root, "src"))
    from src.components.agent import SoftwareCraftAgent

app = FastAPI(title="SoftwareCraft AI API", version="1.0")

# ==========================================
# ### CONFIGURACIÓN DE CORS
# Esto autoriza al Frontend (React) a hablar con el Backend
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes (para desarrollo)
    allow_credentials=True,
    allow_methods=["*"],  # Permite TODOS los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

print("--- Iniciando Servidor de IA ---")
try:
    # Instancia global del bot
    bot = SoftwareCraftAgent()
except Exception as e:
    print(f"Error crítico iniciando el agente: {e}")
    # No matamos el server para que al menos responda errores HTTP
    bot = None

class UserInput(BaseModel):
    query: str

@app.get("/")
def health_check():
    return {"status": "online", "message": "SoftwareCraft AI is ready."}

@app.post("/chat")
def chat_endpoint(request: UserInput):
    if not bot:
        raise HTTPException(status_code=500, detail="El agente no se pudo inicializar.")
    
    try:
        response = bot.ask(request.query)
        return {
            "response": response["output"],
            "status": "success"
        }
    except Exception as e:
        print(f"Error procesando chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)