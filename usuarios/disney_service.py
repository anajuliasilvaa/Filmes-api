import requests
import random
from typing import Dict, List, Optional


class DisneyAPIService:
    BASE_URL = "https://api.disneyapi.dev/character"
    
    @staticmethod
    def get_random_character() -> Optional[Dict]:
        try:
            response = requests.get(f"{DisneyAPIService.BASE_URL}?pageSize=1")
            if response.status_code == 200:
                data = response.json()
                total_pages = data.get('info', {}).get('totalPages', 1)
                
                random_page = random.randint(1, min(total_pages, 50))
                
                
                response = requests.get(f"{DisneyAPIService.BASE_URL}?page={random_page}&pageSize=50")
                if response.status_code == 200:
                    data = response.json()
                    characters = data.get('data', [])
                    
                    valid_characters = [char for char in characters if char.get('imageUrl')]
                    
                    if valid_characters:
                        return random.choice(valid_characters)
            
            return None
            
        except Exception as e:
            print(f"Erro ao buscar personagem Disney: {e}")
            return None
    
    @staticmethod
    def get_characters_page(page: int = 1, page_size: int = 20) -> Optional[Dict]:
        try:
            response = requests.get(f"{DisneyAPIService.BASE_URL}?page={page}&pageSize={page_size}")
            if response.status_code == 200:
                data = response.json()
                if 'data' in data:
                    data['data'] = [char for char in data['data'] if char.get('imageUrl')]
                return data
            return None
            
        except Exception as e:
            print(f"Erro ao buscar personagens Disney: {e}")
            return None
    
    @staticmethod
    def search_characters(query: str) -> List[Dict]:
        try:
            characters = []
            
            
            response = requests.get(f"{DisneyAPIService.BASE_URL}?name={query}")
            if response.status_code == 200:
                data = response.json()
                direct_results = data.get('data', [])
                characters.extend([char for char in direct_results if char.get('imageUrl')])
            
            if not characters:
                for page in range(1, 6):
                    response = requests.get(f"{DisneyAPIService.BASE_URL}?page={page}&pageSize=50")
                    if response.status_code == 200:
                        data = response.json()
                        page_characters = data.get('data', [])
                        
                        query_lower = query.lower()
                        for char in page_characters:
                            if (char.get('imageUrl') and 
                                char.get('name') and 
                                query_lower in char.get('name', '').lower()):
                                characters.append(char)
                        
                        if len(characters) >= 20:
                            break
            
            
            seen_ids = set()
            unique_characters = []
            for char in characters:
                char_id = char.get('_id')
                if char_id not in seen_ids:
                    seen_ids.add(char_id)
                    unique_characters.append(char)
            
            return unique_characters[:50]
            
        except Exception as e:
            print(f"Erro ao buscar personagens Disney: {e}")
            return [] 