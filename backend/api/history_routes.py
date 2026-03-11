from fastapi import APIRouter, Depends
from services.auth_dependency import get_current_user
from repositories.session_repository import get_user_sessions
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import tempfile

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/history")
def get_history(user=Depends(get_current_user)):

    sessions = get_user_sessions(user["id"])

    return {
        "sessions": sessions
    }

@router.get("/{session_id}")
def get_session_detail(session_id: str, user=Depends(get_current_user)):

    from memory.supabase_client import supabase

    session = (
        supabase.table("sessions")
        .select("*")
        .eq("id", session_id)
        .execute()
    )

    if not session.data:
        return {"error": "Session not found"}

    session_data = session.data[0]

    report = (
        supabase.table("session_reports")
        .select("*")
        .eq("session_id", session_id)
        .execute()
    )

    quizzes = (
        supabase.table("quiz_attempts")
        .select("*")
        .eq("session_id", session_id)
        .execute()
    )

    return {
        "session": session_data,
        "report": report.data[0] if report.data else None,
        "quiz_attempts": quizzes.data
    }


@router.get("/{session_id}/download")
def download_report(session_id: str, user=Depends(get_current_user)):

    from memory.supabase_client import supabase

    session = supabase.table("sessions").select("*").eq("id", session_id).single().execute()
    report = supabase.table("session_reports").select("*").eq("session_id", session_id).execute()
    quizzes = supabase.table("quiz_attempts").select("*").eq("session_id", session_id).execute()

    session = session.data
    report = report.data[0] if report.data else None
    quizzes = quizzes.data

    styles = getSampleStyleSheet()

    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")

    story = []

    story.append(Paragraph("Study Session Report", styles["Title"]))
    story.append(Spacer(1,20))

    story.append(Paragraph(f"Goal: {session['goal']}", styles["Normal"]))
    story.append(Paragraph(f"Duration: {session['duration_minutes']} minutes", styles["Normal"]))
    story.append(Paragraph(f"Tasks Completed: {session['tasks_completed']}", styles["Normal"]))
    story.append(Paragraph(f"Quiz Accuracy: {session['quiz_accuracy']}%", styles["Normal"]))
    story.append(Spacer(1,20))

    if report:
        story.append(Paragraph("AI Insights", styles["Heading2"]))
        story.append(Paragraph(report["summary"], styles["Normal"]))
        story.append(Spacer(1,10))
        story.append(Paragraph("Strengths", styles["Heading3"]))
        story.append(Paragraph(report["strengths"], styles["Normal"]))
        story.append(Spacer(1,10))
        story.append(Paragraph("Weaknesses", styles["Heading3"]))
        story.append(Paragraph(report["weaknesses"], styles["Normal"]))
        story.append(Spacer(1,10))
        story.append(Paragraph("Recommendations", styles["Heading3"]))
        story.append(Paragraph(report["recommendations"], styles["Normal"]))
        story.append(Spacer(1,20))

    story.append(Paragraph("Quiz Attempts", styles["Heading2"]))

    for quiz in quizzes:

        story.append(Paragraph(
            f"Score: {quiz['score_percent']}% ({quiz['correct_answers']}/{quiz['total_questions']})",
            styles["Normal"]
        ))

        for q in quiz["question_results"]:

            story.append(Paragraph(f"Question: {q['question']}", styles["Normal"]))
            story.append(Paragraph(f"Your Answer: {q['user_answer']}", styles["Normal"]))
            story.append(Paragraph(f"Correct Answer: {q['correct_answer']}", styles["Normal"]))
            story.append(Spacer(1,10))

        story.append(Spacer(1,20))

    doc = SimpleDocTemplate(temp.name)
    doc.build(story)

    return FileResponse(temp.name, filename="study_report.pdf")