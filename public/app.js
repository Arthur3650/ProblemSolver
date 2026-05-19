const services = [
    { id: 1, title: "Foto Ufficiali", desc: "Ritaglia e ridimensiona foto per formato passaporto o carta d'identità, con proporzioni corrette.", icon: "📸" },
    { id: 2, title: "Censura Foto", desc: "Rileva e oscura automaticamente volti e targhe nelle foto.", icon: "🕵️" },
    { id: 3, title: "Ottimizza PDF", desc: "Rielabora file PDF per ridurre il peso e pulire metadati.", icon: "📄" },
    { id: 4, title: "Curriculum Vitae PDF", desc: "Genera un CV professionale formattato in PDF con i tuoi dati.", icon: "💼" },
    { id: 5, title: "Documenti Concorso", desc: "Genera domande e moduli per partecipazione a concorsi pubblici.", icon: "🏛️" },
    { id: 6, title: "Migliora Foto Casa", desc: "Aumenta luminosità, saturazione e nitidezza per foto immobiliari.", icon: "🏠" },
    { id: 7, title: "Ripristina Foto", desc: "Riduce il rumore e migliora la nitidezza di foto vecchie o danneggiate.", icon: "✨" },
    { id: 8, title: "Lettere e Diffide", desc: "Genera lettere formali, reclami e diffide in formato PDF.", icon: "✉️" },
    { id: 9, title: "Documenti Viaggio", desc: "Genera documenti per viaggi: moduli e checklist personalizzate.", icon: "✈️" },
    { id: 10, title: "Documenti Lavoro", desc: "Genera contratti, lettere di assunzione, dimissioni e permessi.", icon: "🤝" },
    { id: 11, title: "Moduli Bonus", desc: "Genera autocertificazioni e moduli per richiedere bonus statali.", icon: "💰" },
    { id: 12, title: "Moduli PA", desc: "Genera modulistica standard per la Pubblica Amministrazione.", icon: "🏢" },
    { id: 15, title: "Portfolio PDF", desc: "Genera un portfolio professionale con sezioni organizzate in PDF.", icon: "🎨" },
    { id: 16, title: "Dossier PDF", desc: "Crea un dossier personale con dati, documenti e certificazioni.", icon: "📁" },
    { id: 17, title: "Dichiarazioni Urgenti", desc: "Genera dichiarazioni e denunce per situazioni di emergenza.", icon: "🚨" },
    { id: 18, title: "Documenti Matrimonio", desc: "Genera moduli e documenti per matrimonio civile o religioso.", icon: "💍" },
    { id: 19, title: "Documenti Nascita", desc: "Genera moduli per registrazione nascita e richiesta bonus.", icon: "👶" },
    { id: 20, title: "Documenti Separazione", desc: "Genera accordi preliminari e dichiarazioni per separazione.", icon: "💔" },
    { id: 21, title: "Compila Moduli PA", desc: "Compila moduli ufficiali della Pubblica Amministrazione.", icon: "📝" },
    { id: 22, title: "Rimuovi Sfondo", desc: "Rimuove lo sfondo dalle foto usando un algoritmo di segmentazione. Utile per e-commerce e grafica.", icon: "✂️" },
    { id: 23, title: "Ingrandisci Foto", desc: "Ridimensiona e migliora la nitidezza di foto piccole o sgranate (2x).", icon: "🔍" },
    { id: 25, title: "Adatta per Social", desc: "Ridimensiona e adatta foto per formati social (Instagram, TikTok, YouTube).", icon: "📱" },
    { id: 26, title: "Comprimi Foto", desc: "Riduce il peso delle foto JPEG/PNG mantenendo una qualità accettabile.", icon: "🗜️" },
    { id: 27, title: "Bianco e Nero", desc: "Converte le foto a colori in bianco e nero.", icon: "⚫" },
    { id: 28, title: "Luminosità", desc: "Regola luminosità e contrasto delle foto automaticamente.", icon: "☀️" },
    { id: 29, title: "Converti in WebP", desc: "Converte le tue foto JPG/PNG nel formato WebP moderno, più leggero e veloce per il web.", icon: "🖼️" },
    { id: 30, title: "Converti in PNG", desc: "Converte le tue foto JPG/WebP in PNG con trasparenza, ideale per grafica e loghi.", icon: "🖼️" },
    { id: 31, title: "Rimuovi Metadati", desc: "Elimina tutti i metadati nascosti dalle foto (posizione GPS, data, modello fotocamera, EXIF) per massima privacy.", icon: "🔒" }
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

    const docTools = [4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21];
    if (docTools.includes(serviceId)) {
        document.getElementById('docFields').style.display = 'block';
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
            const formData = new FormData();
            formData.append("file", file);
            const nomeInput = document.getElementById('nomeInput');
            const professioneInput = document.getElementById('professioneInput');
            if (nomeInput && nomeInput.value) formData.append("nome", nomeInput.value);
            if (professioneInput && professioneInput.value) formData.append("professione", professioneInput.value);
            
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
