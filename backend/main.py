from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from core.database import create_tables
from routes import employee, department, expenses
import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    swagger_ui_parameters={
        "defaultModelsExpandDepth": -1,
        "tryItOutEnabled": True,
        "persistentAuthorization": True,  # stores auth data in local storage for api keys
        # "docExpansion": "none",
    },
)

create_tables()

app.include_router(employee.router)
app.include_router(department.router)
app.include_router(expenses.router)


@app.get("/", include_in_schema=False)
def read_root():
    return RedirectResponse(url="/docs")
