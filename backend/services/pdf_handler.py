import os
from PyPDF2 import PdfReader, PdfWriter

def process_pdf(input_path, output_dir, file_id):
    """
    Tool 3: Gestione PDF.
    Legge, riassembla e "pulisce/ottimizza" il PDF ricreandolo da zero.
    Questo rimuove metadati extra e spesso riduce il peso.
    """
    try:
        reader = PdfReader(input_path)
        writer = PdfWriter()

        # Copia pagina per pagina nel nuovo file
        for page in reader.pages:
            writer.add_page(page)
            
        output_path = os.path.join(output_dir, f"{file_id}_ottimizzato.pdf")
        
        with open(output_path, "wb") as f:
            writer.write(f)
            
        return output_path
    except Exception as e:
        raise ValueError(f"Errore nell'elaborazione del PDF: {str(e)}")
