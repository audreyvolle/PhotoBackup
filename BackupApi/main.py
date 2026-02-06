import os
import sqlite3
import shutil
from datetime import datetime, timedelta
from typing import List

from fastapi import FastAPI, UploadFile, File, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

# --------------------
# CONFIG
# --------------------
DATA_DIR = "./Photos"
DB_PATH = "./users.db" 

SECRET_KEY = os.environ.get("SECRET_KEY", "CHANGE_ME")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24

os.makedirs(DATA_DIR, exist_ok=True)

app = FastAPI(title="Photo Backup API")

origins = [
    "capacitor://localhost",
    "http://localhost",
    "http://localhost:8100"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")



# --------------------
# DATABASE
# --------------------
def get_db():
    return sqlite3.connect(DB_PATH)

def init_db():
    with get_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        """)
        db.commit()

init_db()

# --------------------
# AUTH HELPERS
# --------------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

def create_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def require_token(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]

    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# --------------------
# MODELS
# --------------------
class LoginRequest(BaseModel):
    username: str
    password: str

# --------------------
# AUTH ENDPOINTS
# --------------------
@app.post("/auth/login")
def login(data: LoginRequest):
    with get_db() as db:
        row = db.execute(
            "SELECT password_hash FROM users WHERE username = ?",
            (data.username,)
        ).fetchone()

    if not row or not verify_password(data.password, row[0]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(data.username)
    return {"token": token}

@app.post("/auth/create-user")
def create_user(data: LoginRequest):
    with get_db() as db:
        try:
            db.execute(
                "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                (data.username, hash_password(data.password))
            )
            db.commit()
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=400, detail="User already exists")

    return {"status": "created"}

# --------------------
# HEALTH
# --------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# --------------------
# PHOTO HELPERS
# --------------------
def photo_path_from_hash(hash: str, timestamp: str):
    year = timestamp[:4]
    month = timestamp[5:7]
    dir_path = f"{DATA_DIR}/{year}/{month}"
    os.makedirs(dir_path, exist_ok=True)
    return f"{dir_path}/{hash}.jpg"

# --------------------
# PHOTO ENDPOINTS
# --------------------
@app.get("/photos/identifiers")
def list_identifiers(authorization: str = Header(None)):
    require_token(authorization)

    identifiers = []

    for root, _, files in os.walk(DATA_DIR):
        for f in files:
            identifiers.append(os.path.splitext(f)[0])

    return {
        "count": len(identifiers),
        "identifiers": identifiers
    }

@app.post("/photos/upload")
def upload_photo(
    file: UploadFile = File(...),
    hash: str = Header(...),
    timestamp: str = Header(...),
    authorization: str = Header(None)
):
    require_token(authorization)

    try:
        final_path = photo_path_from_hash(hash, timestamp)

        if os.path.exists(final_path):
            return {"status": "exists"}

        with open(final_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"status": "ok"}
    except Exception as e:
        print(f"ERROR: {e}")
        return JSONResponse(status_code=500, content={"message": str(e)})
