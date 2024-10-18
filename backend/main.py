import uvicorn
import models
from database import engine


if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    uvicorn.run("config:app", host="127.0.0.1", port=8000, reload=True)
