import os
from dotenv import load_dotenv
from pathlib import Path

print("Current directory:", os.getcwd())
print(".env exists here:", os.path.exists('.env'))

# Try loading
load_dotenv()

key = os.getenv('GEMINI_API_KEY')
if key:
    print(f"✅ Key loaded: {key[:15]}...{key[-4:]} ({len(key)} chars)")
else:
    print("❌ Key NOT loaded")
    
# Try explicit path
env_path = Path(__file__).parent / '.env'
print(f"\nTrying explicit path: {env_path}")
print(f"File exists: {env_path.exists()}")

load_dotenv(dotenv_path=env_path)
key2 = os.getenv('GEMINI_API_KEY')
if key2:
    print(f"✅ Key loaded with explicit path: {key2[:15]}...")
else:
    print("❌ Still not loaded")