from app.utils.pdf_reader import read_pdf


text = read_pdf(
    "data/Priyadharshini_S_Resume.pdf.pdf"
)


print(text[:500])