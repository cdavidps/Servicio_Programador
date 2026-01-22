import os
import sys
import chromadb
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools.retriever import create_retriever_tool
from langchain import hub
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()

class SoftwareCraftAgent:
    def __init__(self):
        current_file = os.path.abspath(__file__)
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_file)))
        self.persist_directory = os.path.join(project_root, "data", "chroma_db")

        print(f"Buscando memoria en: {self.persist_directory}")

        if not os.path.exists(self.persist_directory):
            print(f"Error: No se encontró la base de datos en {self.persist_directory}")
            sys.exit(1)

        # --- CONFIGURACIÓN DEL AGENTE ---
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.client = chromadb.PersistentClient(path=self.persist_directory)
    
        self.vectorstore = Chroma(
            client=self.client,
            collection_name="software_craft_collection",
            embedding_function=self.embeddings
        )
        
        self.retriever_tool = create_retriever_tool(
            self.vectorstore.as_retriever(),
            "search_services",
            "Busca información sobre servicios de software y contacto."
        )
        
        self.llm = ChatOpenAI(
            model="gpt-4o",
            api_key=os.getenv("GITHUB_TOKEN"),
            base_url="https://models.inference.ai.azure.com",
            temperature=0
        )
        
        self.prompt = hub.pull("hwchase17/openai-functions-agent")
        self.agent = create_openai_functions_agent(self.llm, [self.retriever_tool], self.prompt)
        self.executor = AgentExecutor(agent=self.agent, tools=[self.retriever_tool], verbose=True)

        self.chat_history = ChatMessageHistory()

    def ask(self, query: str):
        try:
            # Pasando 'chat_history' al agente para que tenga contexto
            response = self.executor.invoke({
                "input": query,
                "chat_history": self.chat_history.messages
            })
  
            # Agregando lo que pasó a la memoria
            self.chat_history.add_user_message(query)
            self.chat_history.add_ai_message(response["output"])
            
            return response
            
        except Exception as e:
            return {"output": f"Error: {str(e)}"}

if __name__ == "__main__":
    bot = SoftwareCraftAgent()

    print("\n --- Turno 1: Contexto ---")
    # Le damos un dato que debe recordar
    q1 = "Hola, me llamo Carlos y busco servicios de Cloud."
    print(f"Usuario: {q1}")
    res1 = bot.ask(q1)
    print(f"Bot: {res1['output']}")

    print("\n --- Turno 2: Prueba de Memoria ---")
    # Hacemos una pregunta que solo se puede responder si recuerda el Turno 1
    q2 = "¿Recuerdas mi nombre y qué estaba buscando?"
    print(f"Usuario: {q2}")
    res2 = bot.ask(q2)
    print(f"Bot: {res2['output']}")