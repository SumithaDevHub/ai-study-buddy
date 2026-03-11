from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from api.session_routes import router as session_router
from api.planner_routes import router as planner_router
from api.task_routes import router as task_router
from api.quiz_routes import router as quiz_router
from api.quiz_submit_routes import router as quiz_submit_router
from api.tutor_routes import router as tutor_router
from api.mentor_routes import router as mentor_router
from api.focus_routes import router as focus_router
from api.session_end_routes import router as session_end_router
from api.auth_routes import router as auth_router
from api.user_routes import router as user_router
from api.history_routes import router as history_router
from api.analytics_routes import router as analytics_router

app = FastAPI(title="AI Study Buddy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session_router)
app.include_router(planner_router)
app.include_router(task_router)
app.include_router(quiz_router)
app.include_router(quiz_submit_router)
app.include_router(tutor_router)
app.include_router(mentor_router)
app.include_router(focus_router)
app.include_router(session_end_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(history_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {"message": "AI Study Buddy Backend Running"}