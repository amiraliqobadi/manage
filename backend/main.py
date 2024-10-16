import uvicorn

if __name__ == "__main__":

    # from database import engine
    # from models import Base

    # Base.metadata.create_all(bind=engine)
    uvicorn.run("config:app", host="127.0.0.1", port=8000, reload=True)
