/* ===================================
   MOGARRY - MAIN.JS
   Dark Cybersecurity Theme
   Funciones: Cursor, Nav activo, Stats,
   Uptime bars, Toast, Typed text, Glitch
=================================== */

/* ── 1. CURSOR PERSONALIZADO ─────────────────────────────── */
(function initCursor() {
    const ring = document.getElementById('cursor-ring');
    const dot  = document.getElementById('cursor-dot');
    if (!ring || !dot) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    // El punto sigue al ratón de forma instantánea
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    // El anillo sigue con un pequeño lag (efecto suavizado)
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Ocultar cursor al salir de la ventana
    document.addEventListener('mouseleave', () => {
        ring.style.opacity = '0';
        dot.style.opacity  = '0';
    });
    document.addEventListener('mouseenter', () => {
        ring.style.opacity = '1';
        dot.style.opacity  = '1';
    });

    // Click: efecto de pulso en el anillo
    document.addEventListener('mousedown', () => {
        ring.style.transform = 'translate(-50%, -50%) scale(0.75)';
    });
    document.addEventListener('mouseup', () => {
        ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });
})();


/* ── 2. ENLACE ACTIVO EN NAVEGACIÓN ─────────────────────── */
(function setActiveNav() {
    const links    = document.querySelectorAll('.menu-navegacion a');
    const current  = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === current) {
            link.classList.add('activo');
            link.setAttribute('aria-current', 'page');
        }
    });
})();


/* ── 3. CONTADORES ANIMADOS (STATS) ─────────────────────── */
(function initCounters() {
    const stats = document.querySelectorAll('.stat-numero[data-target]');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = +el.dataset.target;
            const suffix = el.dataset.suffix || '';
            const dur    = 1800; // ms
            const step   = 16;
            const inc    = target / (dur / step);
            let  current = 0;

            const timer = setInterval(() => {
                current += inc;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.round(current) + suffix;
            }, step);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
})();


/* ── 4. BARRAS DE UPTIME ─────────────────────────────────── */
(function initUptimeBars() {
    const fills = document.querySelectorAll('.uptime-fill[data-width]');
    if (!fills.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            bar.style.width = bar.dataset.width;
            observer.unobserve(bar);
        });
    }, { threshold: 0.4 });

    fills.forEach(b => observer.observe(b));
})();


/* ── 5. TOAST DE NOTIFICACIÓN ────────────────────────────── */
function mostrarToast(mensaje, tipo = 'ok') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = mensaje;
    toast.style.borderColor = tipo === 'error' ? 'var(--magenta)' : 'var(--cyan)';
    toast.style.color       = tipo === 'error' ? 'var(--magenta)' : 'var(--cyan)';
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 3500);
}

// Captura del formulario de contacto
(function initForm() {
    const form = document.querySelector('.caja-formulario');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('id-nombre')?.value.trim();
        mostrarToast(`✓ Consulta recibida, ${nombre}. Te contactaremos pronto.`);
        setTimeout(() => form.reset(), 400);
    });

    form.addEventListener('reset', () => {
        setTimeout(() => mostrarToast('Formulario limpiado.', 'error'), 100);
    });
})();


/* ── 6. TYPED TEXT (efecto máquina de escribir) ─────────── */
(function initTyped() {
    const el = document.querySelector('[data-typed]');
    if (!el) return;

    const textos  = JSON.parse(el.dataset.typed);        // array de strings
    const speed   = +(el.dataset.typedSpeed  || 70);     // ms por letra
    const pause   = +(el.dataset.typedPause  || 1800);   // pausa entre palabras
    let   tIdx    = 0, cIdx = 0, borrando = false;

    function type() {
        const texto  = textos[tIdx];
        const actual = borrando
            ? texto.substring(0, cIdx--)
            : texto.substring(0, cIdx++);

        el.textContent = actual;

        if (!borrando && cIdx > texto.length) {
            setTimeout(() => { borrando = true; type(); }, pause);
            return;
        }
        if (borrando && cIdx < 0) {
            borrando = false;
            tIdx = (tIdx + 1) % textos.length;
            cIdx = 0;
            setTimeout(type, 400);
            return;
        }
        setTimeout(type, borrando ? speed / 2 : speed);
    }

    type();
})();


/* ── 7. GLITCH DINÁMICO ──────────────────────────────────── */
(function initGlitch() {
    // Copia el texto al atributo data-text automáticamente si no se puso en HTML
    document.querySelectorAll('.glitch').forEach(el => {
        if (!el.dataset.text) {
            el.dataset.text = el.textContent;
        }
    });
})();


/* ── 8. EFECTO PARTÍCULA en el CLICK ────────────────────── */
(function initClickParticle() {
    document.addEventListener('click', (e) => {
        const count  = 6;
        const colors = ['#00f5ff', '#ff00c8', '#00ff88'];

        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.style.cssText = `
                position:fixed;
                width:5px;height:5px;
                border-radius:50%;
                background:${colors[i % colors.length]};
                pointer-events:none;
                z-index:99999;
                left:${e.clientX}px;
                top:${e.clientY}px;
                transform:translate(-50%,-50%);
                transition:all 0.6s ease-out;
                opacity:1;
            `;
            document.body.appendChild(p);
            const angle = (360 / count) * i;
            const dist  = 30 + Math.random() * 30;
            const dx    = Math.cos(angle * Math.PI / 180) * dist;
            const dy    = Math.sin(angle * Math.PI / 180) * dist;

            requestAnimationFrame(() => {
                p.style.transform   = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
                p.style.opacity     = '0';
            });
            setTimeout(() => p.remove(), 650);
        }
    });
})();


/* ── 9. HIGHLIGHT de la SECCIÓN ACTUAL (scroll spy simple) ─ */
(function initScrollSpy() {
    const sections = document.querySelectorAll('main section[id], main div[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.title = 'MoGarry · ' + entry.target.dataset.title || document.title;
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
})();