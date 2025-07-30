
import os

class Config:
    MONGODB_HOST = os.getenv("MONGODB_HOST")
    MONGODB_PORT = int(os.getenv("MONGODB_PORT", 27017))
    MONGODB_DB = os.getenv("MONGODB_DB")
