@echo off
color 0A
cd /d "%~dp0"
echo ==========================================================
echo PROBLEM SOLVER - AVVIO LOCALE
echo ==========================================================
echo.
echo Controllo file .env...
if not exist ".env" (
    echo ATTENZIONE: file .env non trovato!
    echo Copia .env.example in .env e inserisci le tue chiavi.
    echo.
    pause
    exit /b
)
echo OK - .env trovato.
echo.
cd backend
echo ==========================================================
echo Sito:     http://localhost:8000
echo Admin:    http://localhost:8000/admin
echo Prezzo:   2,99 €
echo ==========================================================
echo Avvio del server...
echo.
uvicorn main:app --host 0.0.0.0 --port 8000
pause
