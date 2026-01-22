import os
import shutil
import sys
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import chromadb # Importamos la librería nativa

load_dotenv()

def run_ingestion():
    print("--- INGESTA CON CLIENTE NATIVO ---")

    current_file = os.path.abspath(__file__)
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_file)))
    
    raw_path = os.path.join(project_root, "data", "raw", "services.txt")
    db_path = os.path.join(project_root, "data", "chroma_db")

    print(f"Raíz: {project_root}")
    print(f"Objetivo DB: {db_path}")

    # LIMPIEZA DE BASES DE DATOS ANTERIORES
    if os.path.exists(db_path):
        print("🧹 Eliminando DB anterior...")
        shutil.rmtree(db_path)

    try:
        print("Inicializando Cliente Persistente de Chroma...")
        client = chromadb.PersistentClient(path=db_path)
        print("   -> Cliente nativo creado.")
    except Exception as e:
        print(f"Error crítico creando el cliente: {e}")
        return

    # CARGA DE DATOS
    if not os.path.exists(raw_path):
        print(f"No existe: {raw_path}")
        return

    loader = TextLoader(raw_path, encoding="utf-8")
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(documents)
    print(f"Procesando {len(chunks)} fragmentos.")

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # INGESTA USANDO EL CLIENTE YA CREADO
    print("Vectorizando y guardando...")
    try:
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            client=client, 
            collection_name="software_craft_collection"
        )
        print("Ingesta finalizada.")
        
        # Verificación de archivos en el directorio de la base de datos
        if os.path.exists(db_path) and os.listdir(db_path):
            print(f"CONFIRMADO: Archivos en {db_path}:")
            print(os.listdir(db_path))
        else:
            print("AUN VACIO. No se encontraron archivos en la base de datos.")

    except Exception as e:
        print(f"Error durante vectorización: {e}")

if __name__ == "__main__":
    run_ingestion()
    