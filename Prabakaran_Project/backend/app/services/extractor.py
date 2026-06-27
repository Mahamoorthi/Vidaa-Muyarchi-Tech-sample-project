import re

# List of supported skills
SKILLS_DATABASE = [
    "Python",
    "Java",
    "C",
    "C++",
    "SQL",
    "Power BI",
    "Excel",
    "Docker",
    "Git",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "FastAPI",
    "Flask",
    "Django",
    "React",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "AWS",
    "Azure",
    "Kafka",
    "Spark",
    "Hadoop",
    "Tableau"
]


def extract_resume_details(text: str):
    """
    Extract name, email, phone and skills from resume text.
    """

    # -------------------------
    # Email
    # -------------------------
    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )
    email = email_match.group(0) if email_match else ""

    # -------------------------
    # Phone
    # -------------------------
    phone_match = re.search(
        r"(\+91[-\s]?)?[6-9]\d{9}",
        text
    )
    phone = phone_match.group(0) if phone_match else ""

    # -------------------------
    # Name
    # -------------------------
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    name = ""

    if lines:
        name = lines[0]

    # -------------------------
    # Skills
    # -------------------------
    skills = []

    text_lower = text.lower()

    for skill in SKILLS_DATABASE:
        if skill.lower() in text_lower:
            skills.append(skill)

    # Remove duplicates
    skills = sorted(list(set(skills)))

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills
    }