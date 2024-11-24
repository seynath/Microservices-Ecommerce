# app/main.py
from fastapi import FastAPI, HTTPException, Request
from app.routes.order_routes import router as order_router
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as necessary for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )


# Include the order router
app.include_router(order_router)

# Main entry point
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=6004, reload=True)
