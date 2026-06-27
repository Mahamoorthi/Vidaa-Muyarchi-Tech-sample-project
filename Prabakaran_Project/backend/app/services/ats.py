SKILLS_DATABASE = [
    "Python",
    "Java",
    "SQL",
    "Power BI",
    "Excel",
    "FastAPI",
    "Redis",
    "Docker",
    "Git",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "Pandas",
    "NumPy",
    "React",
    "AWS",
    "Azure",
    "Spark",
    "Kafka",
    "PostgreSQL",
    "MySQL"
]


def extract_job_skills(job_description):
    found = []

    for skill in SKILLS_DATABASE:
        if skill.lower() in job_description.lower():
            found.append(skill)

    return found


def calculate_ats(resume_skills, job_description):

    # Normalize resume skills for case-insensitive matching
    resume_skills = [skill.strip().lower() for skill in resume_skills]

    job_skills = extract_job_skills(job_description)

    matched = []
    missing = []

    for skill in job_skills:
        if skill.lower() in resume_skills:
            matched.append(skill)
        else:
            missing.append(skill)

    if len(job_skills) == 0:
        score = 0
    else:
        score = round((len(matched) / len(job_skills)) * 100, 2)

    # Recommendation
    if score >= 80:
        recommendation = "Excellent Match"
    elif score >= 60:
        recommendation = "Good Match"
    elif score >= 40:
        recommendation = "Average Match"
    else:
        recommendation = "Needs Improvement"

    return {
        "ats_score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "total_required_skills": len(job_skills),
        "matched_count": len(matched),
        "recommendation": recommendation
    }