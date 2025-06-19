from sentence_transformers import SentenceTransformer
import torch

class ModelSelector:
    def __init__(self):
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
        self.model_profiles = {
            "llama3-70b": self.encoder.encode("Technical explanations, reasoning, long-form content"),
            "openchat": self.encoder.encode("Conversational responses, coding assistance, concise answers")
        }
    
    def select_model(self, query):
        query_embed = self.encoder.encode(query)
        similarities = {
            model: torch.nn.functional.cosine_similarity(
                torch.tensor(query_embed), 
                torch.tensor(profile), 
                dim=0
            )
            for model, profile in self.model_profiles.items()
        }
        return max(similarities, key=similarities.get)