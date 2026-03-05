from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from core.database import create_tables
from routes import employee, department

app = FastAPI()

create_tables()

app.include_router(employee.router)
app.include_router(department.router)

@app.get("/", include_in_schema=False)
def read_root():
    return RedirectResponse(url="/docs")