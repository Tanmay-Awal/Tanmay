
import os

class Config:
    MONGODB_HOST = os.getenv("MONGODB_HOST")
    MONGODB_PORT = int(os.getenv("MONGODB_PORT"))
    MONGODB_DB = os.getenv("MONGODB_DB")
