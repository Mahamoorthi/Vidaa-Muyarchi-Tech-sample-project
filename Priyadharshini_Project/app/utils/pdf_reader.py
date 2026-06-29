from pypdf import PdfReader
import re


def clean_pdf_text(text):

    text = text.replace("\n", " ")

    # Fix single-character PDF spacing
    text = re.sub(
        r'(?<![a-zA-Z])(?:[A-Za-z]\s+){2,}[A-Za-z]',
        lambda m: m.group(0).replace(" ", ""),
        text
    )

    # Fix merged headings
    heading_fixes = {
        "PRIYADHARSHINISPROFESSIONALSUMMARY":
            "PRIYADHARSHINI S PROFESSIONAL SUMMARY",

        "PROFESSIONALSUMMARY":
            "PROFESSIONAL SUMMARY",

        "B.TechIT":
            "B.Tech IT",

        "Email id:":
            "Email id:",

        "Phone no:":
            "Phone no:",
    }

    for old, new in heading_fixes.items():
        text = text.replace(old, new)


    # Fix missing spaces between words
    text = re.sub(
        r'([a-z])([A-Z])',
        r'\1 \2',
        text
    )

    text = re.sub(r'\s+', ' ', text)


    # Common PDF fixes
    fixes = {
        "dataanalytics": "data analytics",
        "APItesting": "API testing",
        "softwaredevelopment": "software development",
        "automationtools": "automation tools",
        "real-timeapplications": "real-time applications",
        "data-drivensolutions": "data-driven solutions",
        "Developeror": "Developer or",
        "QAAutomationrole": "QA Automation role",
        "LinkedIn id": "LinkedIn id",
        "Github id": "Github id",
    }

    for old, new in fixes.items():
        text = text.replace(old, new)

    return text.strip()


def read_pdf(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + " "

    return clean_pdf_text(text)