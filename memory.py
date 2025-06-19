from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

class MemoryManager:
    def __init__(self):
        self.client = QdrantClient(":memory:")  # Local mode
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
        self.collection_name = "conversation_memory"
        self._init_collection()
    
    def _init_collection(self):
        self.client.recreate_collection(
            collection_name=self.collection_name,
            vectors_config={"size": 384, "distance": "Cosine"}
        )
    
    def store_memory(self, text: str):
        embedding = self.encoder.encode(text).tolist()
        self.client.upsert(
            collection_name=self.collection_name,
            points=[{"id": hash(text), "vector": embedding, "payload": {"text": text}}]
        )
    
    def retrieve_memory(self, query: str, top_k: int=3) -> list:
        query_embedding = self.encoder.encode(query).tolist()
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k
        )
        return [result.payload['text'] for result in results]