from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import os
import uuid
import shutil
import stripe
import json
import secrets
from dotenv import load_dotenv
from services.image_handler import (
    process_passport_photo, censor_photo, restore_old_photo,
    enhance_real_estate, remove_background, upscale_image,
    social_resize, compress_image, grayscale_photo, adjust_brightness,
    convert_to_webp, convert_to_png, strip_exif
)
from services.pdf_handler import process_pdf
from services.doc_generator import generate_document_kit

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
DOMAIN = os.getenv("SITE_DOMAIN", "http://localhost:8000")
ADMIN_USER = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.getenv("ADMIN_PASSWORD", "ProblemSolver2026!")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

STATS_FILE = os.path.join(os.path.dirname(__file__), "stats.json")
def init_stats():
    if not os.path.exists(STATS_FILE):
        with open(STATS_FILE, "w") as f:
            json.dump({"visits": 0, "uploads": 0, "shares": 0}, f)
init_stats()

app = FastAPI(title="Problem Solver API")

@app.on_event("startup")
async def cleanup_old_files():
    import time
    now = time.time()
    for d in [UPLOAD_DIR, OUTPUT_DIR]:
        for f in os.listdir(d):
            path = os.path.join(d, f)
            if os.path.isfile(path) and f != ".gitkeep" and now - os.path.getmtime(path) > 86400:
                try: os.remove(path)
                except: pass
security = HTTPBasic()

def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    current_username_bytes = credentials.username.encode("utf8")
    correct_username_bytes = ADMIN_USER.encode("utf8")
    is_correct_username = secrets.compare_digest(current_username_bytes, correct_username_bytes)
    current_password_bytes = credentials.password.encode("utf8")
    correct_password_bytes = ADMIN_PASS.encode("utf8")
    is_correct_password = secrets.compare_digest(current_password_bytes, correct_password_bytes)
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenziali non valide",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

app.add_middleware(
    CORSMiddleware,
    allow_origins=[DOMAIN] if "localhost" not in DOMAIN else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "outputs")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

DOC_TOOLS = [4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21]

@app.post("/api/process/{service_id}")
async def process_file(service_id: int, file: UploadFile = File(None), nome: str = "", professione: str = ""):
    file_id = str(uuid.uuid4())
    input_path = ""
    ext = ".jpg"

    if file:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            return {"status": "error", "message": "File troppo grande (massimo 10MB)"}

        ext = os.path.splitext(file.filename or "file.jpg")[1].lower()
        input_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
        with open(input_path, "wb") as buffer:
            buffer.write(content)

        try:
            with open(STATS_FILE, "r") as f:
                stats = json.load(f)
            stats["uploads"] = stats.get("uploads", 0) + 1
            with open(STATS_FILE, "w") as f:
                json.dump(stats, f)
        except Exception:
            pass

    output_path = ""

    try:
        if service_id == 1:
            output_path = process_passport_photo(input_path, OUTPUT_DIR, file_id)
        elif service_id == 2:
            output_path = censor_photo(input_path, OUTPUT_DIR, file_id)
        elif service_id == 6:
            output_path = enhance_real_estate(input_path, OUTPUT_DIR, file_id)
        elif service_id == 7:
            output_path = restore_old_photo(input_path, OUTPUT_DIR, file_id)
        elif service_id == 22:
            output_path = remove_background(input_path, OUTPUT_DIR, file_id)
        elif service_id == 23:
            output_path = upscale_image(input_path, OUTPUT_DIR, file_id)
        elif service_id == 24:
            return {"status": "error", "message": "Servizio non più disponibile."}
        elif service_id == 25:
            output_path = social_resize(input_path, OUTPUT_DIR, file_id)
        elif service_id == 26:
            output_path = compress_image(input_path, OUTPUT_DIR, file_id)
        elif service_id == 27:
            output_path = grayscale_photo(input_path, OUTPUT_DIR, file_id)
        elif service_id == 28:
            output_path = adjust_brightness(input_path, OUTPUT_DIR, file_id)
        elif service_id == 29:
            output_path = convert_to_webp(input_path, OUTPUT_DIR, file_id)
        elif service_id == 30:
            output_path = convert_to_png(input_path, OUTPUT_DIR, file_id)
        elif service_id == 31:
            output_path = strip_exif(input_path, OUTPUT_DIR, file_id)
        elif service_id == 3:
            output_path = process_pdf(input_path, OUTPUT_DIR, file_id)
        elif service_id in DOC_TOOLS:
            user_data = {"nome": nome or "__________", "professione": professione or "__________"}
            output_path = generate_document_kit(service_id, user_data, OUTPUT_DIR, file_id)
        elif service_id in [13, 14]:
            return {"status": "error", "message": "Servizio audio/video non ancora disponibile. In arrivo gratis per tutti."}
        else:
            output_path = os.path.join(OUTPUT_DIR, f"{file_id}_elaborato{ext}")
            if input_path:
                shutil.copy(input_path, output_path)

        filename = os.path.basename(output_path)
        return {"status": "success", "file_id": file_id, "download_url": f"/api/download/{filename}"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(file_path):
        real_filename = filename.split("_", 1)[-1] if "_" in filename else filename
        return FileResponse(file_path, filename=real_filename)
    return {"error": "File non trovato"}

@app.post("/api/checkout/{file_id}")
async def create_checkout_session(file_id: str, domain: str = DOMAIN):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': 'Elaborazione Problem Solver',
                        'description': 'Sblocco e download del file elaborato',
                    },
                    'unit_amount': 299,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=domain + '/service.html?session_id={CHECKOUT_SESSION_ID}&file_id=' + file_id + '&success=true',
            cancel_url=domain + '/index.html',
        )
        return {"checkout_url": session.url}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/verify-payment/{session_id}")
async def verify_payment(session_id: str, file_id: str):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == 'paid':
            import glob
            files = glob.glob(os.path.join(OUTPUT_DIR, f"{file_id}*"))
            if files:
                filename = os.path.basename(files[0])
                return {"status": "success", "download_url": f"/api/download/{filename}"}
        return {"status": "error", "message": "Pagamento non completato."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/track/{event_type}")
async def track_event(event_type: str):
    try:
        with open(STATS_FILE, "r") as f:
            stats = json.load(f)
        if event_type in stats:
            stats[event_type] += 1
        else:
            stats[event_type] = 1
        with open(STATS_FILE, "w") as f:
            json.dump(stats, f)
        return {"status": "ok"}
    except Exception:
        return {"status": "error"}

@app.get("/admin")
async def get_admin_dashboard(username: str = Depends(get_current_username)):
    admin_path = os.path.join(os.path.dirname(__file__), "admin.html")
    return FileResponse(admin_path)

@app.get("/api/admin/stats")
async def get_admin_stats(username: str = Depends(get_current_username)):
    try:
        with open(STATS_FILE, "r") as f:
            stats = json.load(f)

        balance = stripe.Balance.retrieve()
        pending = sum([b.amount for b in balance.pending]) / 100.0
        available = sum([b.amount for b in balance.available]) / 100.0

        sessions = stripe.checkout.Session.list(limit=10)
        recent_sales = []
        for s in sessions.data:
            if s.payment_status == 'paid':
                recent_sales.append({"amount": s.amount_total / 100.0, "status": s.payment_status, "id": s.id})

        return {
            "visits": stats.get("visits", 0),
            "uploads": stats.get("uploads", 0),
            "shares": stats.get("shares", 0),
            "stripe_pending": pending,
            "stripe_available": available,
            "recent_sales": recent_sales
        }
    except Exception as e:
        return {"error": str(e)}

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
app.mount("/", StaticFiles(directory=PUBLIC_DIR, html=True), name="public")
