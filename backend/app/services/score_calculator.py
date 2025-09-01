from sqlalchemy.orm import Session
from app.models.exam_session import ExamSession
from app.models.exam import Question
from app.models.exam_session import ExamResponse

def calculate_exam_score(db: Session, exam_session: ExamSession) -> float:
    """Calcula a pontuação de uma sessão de exame."""
    total_score = 0.0
    # Obter todas as respostas do aluno para esta sessão
    student_responses = db.query(ExamResponse).filter(ExamResponse.session_id == exam_session.id).all()

    for response in student_responses:
        # Obter a questão correspondente à resposta
        question = db.query(Question).filter(Question.id == response.question_id).first()
        if question:
            # Comparar a resposta do aluno com a resposta correta da questão
            # Esta lógica pode precisar ser mais sofisticada dependendo do tipo de questão (múltipla escolha, V/F, etc.)
            if response.answer == question.correct_answer:
                total_score += 1.0  # Assumindo 1 ponto por questão correta
    exam_session.score = total_score
    db.add(exam_session)
    db.commit()
    db.refresh(exam_session)
    return total_score