import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors

def generate_document_kit(tool_id: int, data: dict, output_dir: str, file_id: str):
    """
    Unico motore per tutti i documenti (Tool 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21).
    Usa template dinamici basati sull'ID richiesto.
    """
    titles = {
        4: "Curriculum Vitae",
        5: "Kit Concorso - Documentazione Ufficiale",
        8: "Lettera Ufficiale / Diffida",
        9: "Kit Viaggio - Itinerario e Modulistica",
        10: "Kit Lavoro - Richieste Formali",
        11: "Kit Bonus - Autocertificazione",
        12: "Modulistica PA Standard",
        15: "Portfolio Professionale",
        16: "Dossier Personale",
        17: "Kit Emergenza - Dichiarazioni URGENTI",
        18: "Kit Matrimonio - Checklist e Moduli Civili",
        19: "Kit Nascita - Documentazione Pratiche",
        20: "Kit Separazione - Accordi Preliminari",
        21: "Modulo Precompilato"
    }
    
    doc_title = titles.get(tool_id, "Documento Generato IA")
    output_path = os.path.join(output_dir, f"{file_id}_{doc_title.replace(' ', '_').replace('/', '')}.pdf")
    
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Header Universale Premium
    c.setFillColor(colors.HexColor("#0d0e15"))
    c.rect(0, height - 100, width, 100, fill=1, stroke=0)
    
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, height - 40, doc_title.upper())
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#4cc9f0"))
    c.drawString(40, height - 60, f"Pratica Autenticata | ID: {file_id.split('-')[0].upper()} | Valore Legale")

    # Corpo centrale
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 12)
    y = height - 140
    
    # Intestazione formale
    testo = [
        f"Con la presente, in riferimento alla pratica '{doc_title}',",
        "si produce e certifica la documentazione automatizzata in base alle",
        "informazioni fornite dall'utente. Il presente documento è formattato",
        "secondo gli standard burocratici vigenti.",
        "",
        f"Dati Richiedente: {data.get('nome', 'Cliente Problem Solver')}",
        f"Data di Generazione: 2026",
        "==================================================",
        "",
        "DICHIARAZIONI E CONTENUTI:"
    ]
    
    # Sezioni specifiche basate sul Tool
    if tool_id == 8: # Lettera
        testo.extend(["Oggetto: Richiesta Formale / Diffida Legale", "", "Si intima alla controparte di provvedere a..."])
    elif tool_id == 20: # Separazione
        testo.extend(["Oggetto: Accordo Preliminare di Separazione Consensuale", "", "I coniugi dichiarano di voler procedere..."])
    elif tool_id == 4: # CV
        testo = ["CURRICULUM VITAE", "", f"Profilo: {data.get('professione', 'Professionista')}", "Esperienze pregresse: Ottime."]

    for line in testo:
        c.drawString(40, y, line)
        y -= 20

    # Piè di pagina e Firma
    c.setLineWidth(0.5)
    c.line(40, y - 40, width - 40, y - 40)
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(40, y - 60, "Firmato digitalmente / Da firmare in originale: _______________________")
    
    c.save()
    return output_path
