const services = [
    { id: 1, title: "Foto Ufficiali", desc: "Trasforma una foto in formato passaporto/CIE: sfondo corretto, misure e volto centrato.", icon: "📸" },
    { id: 2, title: "Censura Foto", desc: "Oscura targhe, volti, indirizzi e dati sensibili in automatico.", icon: "🕵️‍♂️" },
    { id: 3, title: "Conversione PDF", desc: "Converte, unisce, divide, sblocca e comprime file PDF in un lampo.", icon: "📄" },
    { id: 4, title: "CV Professionale", desc: "Genera un Curriculum Vitae in PDF partendo da poche informazioni.", icon: "💼" },
    { id: 5, title: "Kit Concorso", desc: "Crea tutti i documenti per un concorso (domanda, autocertificazioni, allegati).", icon: "🏛️" },
    { id: 6, title: "Foto Immobiliari", desc: "Migliora foto di case: luminosità, colori, distorsioni e pulizia visiva.", icon: "🏠" },
    { id: 7, title: "Ripristino Foto Vecchie", desc: "Ripara foto rovinate: graffi, colori sbiaditi, rumore e bassa qualità.", icon: "✨" },
    { id: 8, title: "Lettere Ufficiali", desc: "Genera lettere formali (reclami, diffide, richieste) in formato PDF.", icon: "✉️" },
    { id: 9, title: "Kit Viaggio", desc: "Prepara documenti per viaggi: itinerario, assicurazione, checklist.", icon: "✈️" },
    { id: 10, title: "Kit Lavoro", desc: "Crea documenti per assunzioni, dimissioni, richieste ferie, permessi.", icon: "🤝" },
    { id: 11, title: "Kit Bonus", desc: "Prepara moduli e autocertificazioni per bonus statali o comunali.", icon: "💰" },
    { id: 12, title: "Kit PA", desc: "Genera documenti standard per la Pubblica Amministrazione.", icon: "🏢" },
    { id: 13, title: "Pulizia Audio", desc: "Ripulisce file audio da rumori, eco, disturbi e volume basso.", icon: "🎧" },
    { id: 14, title: "Stabilizzazione Video", desc: "Stabilizza video mossi e migliora qualità e luminosità.", icon: "🎥" },
    { id: 15, title: "Portfolio PDF", desc: "Crea un portfolio professionale in PDF con foto, testi e sezioni ordinate.", icon: "🎨" },
    { id: 16, title: "Dossier Personale", desc: "Genera un dossier completo con dati, documenti, certificazioni e riepiloghi.", icon: "📁" },
    { id: 17, title: "Kit Emergenza", desc: "Prepara documenti urgenti (denunce, smarrimenti, dichiarazioni immediate).", icon: "🚨" },
    { id: 18, title: "Kit Matrimonio", desc: "Crea documenti e moduli necessari per matrimonio civile/religioso.", icon: "💍" },
    { id: 19, title: "Kit Nascita", desc: "Prepara documenti per registrazione nascita, bonus, certificati.", icon: "👶" },
    { id: 20, title: "Kit Separazione", desc: "Genera documenti preliminari per separazione: accordi, dichiarazioni, moduli.", icon: "💔" },
    { id: 21, title: "Moduli PA Compilati", desc: "Inserisci pochi dati e il sistema compila automaticamente moduli ufficiali.", icon: "📝" },
    { id: 22, title: "Rimozione Sfondo IA", desc: "Scontorna foto e rimuovi lo sfondo in 1 secondo per e-commerce e grafiche.", icon: "✂️" },
    { id: 23, title: "Upscale Risoluzione", desc: "Migliora la qualità e ingrandisci foto sgranate o pixelate usando IA avanzata.", icon: "🔍" },
    { id: 24, title: "Colorazione Foto", desc: "Dai vita alle vecchie foto in bianco e nero aggiungendo colori realistici.", icon: "🎨" },
    { id: 25, title: "Social Media Resizer", desc: "Adatta automaticamente una foto a tutti i formati social (IG, TikTok, YouTube).", icon: "📱" }
];

// Track visit
fetch('/api/track/visits', {method: 'POST'}).catch(e=>console.log(e));

// --- LOGICA HOMEPAGE (index.html) ---
const grid = document.getElementById('servicesGrid');
const searchInput = document.getElementById('searchInput');

if (grid) {
    function renderServices(filter = "") {
        grid.innerHTML = "";
        const filtered = services.filter(s => 
            s.title.toLowerCase().includes(filter.toLowerCase()) || 
            s.desc.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            grid.innerHTML = "<p style='color: var(--text-muted); grid-column: 1/-1; text-align:center;'>Nessun servizio trovato.</p>";
            return;
        }

        filtered.forEach(s => {
            const card = document.createElement('div');
            card.className = 'service-card';
            // Naviga alla pagina servizio passando l'ID!
            card.onclick = () => window.location.href = `service.html?id=${s.id}`;
            
            card.innerHTML = `
                <div class="card-icon">${s.icon}</div>
                <h4 class="card-title">${s.title}</h4>
                <p class="card-desc">${s.desc}</p>
                <div class="card-arrow">➔</div>
            `;
            grid.appendChild(card);
        });
    }

    renderServices();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderServices(e.target.value);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// --- LOGICA PAGINA SERVIZIO (service.html) ---
const urlParams = new URLSearchParams(window.location.search);
const serviceId = urlParams.get('id');
const sessionId = urlParams.get('session_id');
const fileIdParam = urlParams.get('file_id');
const success = urlParams.get('success');

if (success === 'true' && sessionId && fileIdParam) {
    document.body.innerHTML = `
        <div style="text-align: center; margin-top: 100px; color: white; font-family: 'Inter', sans-serif;">
            <h1>Pagamento Confermato! 🎉</h1>
            <p>Sto sbloccando il tuo file...</p>
        </div>
    `;
    fetch(`/api/verify-payment/${sessionId}?file_id=${fileIdParam}`)
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                document.body.innerHTML = `
                    <div style="text-align: center; margin-top: 100px; color: white; font-family: 'Inter', sans-serif;">
                        <h1 style="color: var(--secondary-color);">File Sbloccato!</h1>
                        <p>Il pagamento è stato verificato con successo.</p>
                        <a href="${data.download_url}" target="_blank" style="display:inline-block; margin-top:20px; padding: 15px 30px; background: var(--primary-color); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">📥 SCARICA IL TUO FILE</a>
                        <br><br><br>
                        <a href="index.html" style="color: var(--text-muted); text-decoration: underline;">Torna alla Homepage</a>
                    </div>
                `;
            } else {
                alert("Errore nella verifica del pagamento: " + data.message);
                window.location.href = "index.html";
            }
        });
} else if (window.location.pathname.includes('service.html') && serviceId) {
    const service = services.find(s => s.id == serviceId);
    if (service) {
        document.title = `${service.title} | Problem Solver`;
        document.getElementById('serviceIcon').innerText = service.icon;
        document.getElementById('serviceTitle').innerText = service.title;
        document.getElementById('serviceDesc').innerText = service.desc;
    } else {
        window.location.href = 'index.html';
    }

    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const processingArea = document.getElementById('processingArea');
    const resultArea = document.getElementById('resultArea');

    if(dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--secondary-color)';
            dropzone.style.background = 'rgba(76, 201, 240, 0.1)';
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = 'var(--card-border)';
            dropzone.style.background = 'rgba(0,0,0,0.2)';
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--card-border)';
            dropzone.style.background = 'rgba(0,0,0,0.2)';
            if(e.dataTransfer.files.length > 0) {
                startProcessing(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if(e.target.files.length > 0) {
                startProcessing(e.target.files[0]);
            }
        });
    }

    async function startProcessing(file) {
        uploadArea.style.display = 'none';
        processingArea.style.display = 'block';
        
        let progress = 0;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        const progressInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 1;
            if (progress > 85) progress = 85; // Si ferma all'85% in attesa del server
            progressBar.style.width = progress + '%';
            progressText.innerText = `Elaborazione Intelligenza Artificiale in corso... ${progress}%`;
        }, 300);

        try {
            // Invio reale dei dati al nostro server Python (Backend)
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch(`/api/process/${serviceId}`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            // Generiamo il link di checkout Stripe
            const origin = encodeURIComponent(window.location.origin);
            const checkoutRes = await fetch(`/api/checkout/${data.file_id}?domain=${origin}`, { method: 'POST' });
            const checkoutData = await checkoutRes.json();
            
            // Backend ha finito!
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressText.innerText = `Elaborazione completata! 100%`;
            
            setTimeout(() => {
                processingArea.style.display = 'none';
                resultArea.style.display = 'block';
                
                // Seleziona il bottone di Stripe e imposta il comportamento
                const downloadBtn = document.getElementById('downloadBtn');
                if(downloadBtn) {
                    downloadBtn.onclick = () => {
                        if (checkoutData.checkout_url) {
                            window.location.href = checkoutData.checkout_url;
                        } else {
                            alert("Il sistema di pagamento non è ancora configurato. Inserisci la chiave di Stripe nel backend!");
                        }
                    };
                }
            }, 800);

        } catch(err) {
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressText.innerText = `Elaborazione simulata completata!`;
            setTimeout(() => {
                processingArea.style.display = 'none';
                resultArea.style.display = 'block';
            }, 800);
        }
    }
}
