import uvicorn
import models
from database import engine


if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    uvicorn.run("config:app", host="0.0.0.0", port=8080, reload=True)
