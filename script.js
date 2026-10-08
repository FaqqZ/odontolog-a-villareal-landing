const WHATSAPP_NUMBER = '5493813333555';

// Menú mobile
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function setMenu(open) {
    menuToggle.classList.toggle('active', open);
    nav.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('active')));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => setMenu(false)));

// Scroll suave con compensación del header fijo
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();

        // Los CTA de "solución" preseleccionan el tipo de trabajo
        const tipo = this.dataset.tipo;
        if (tipo) {
            const select = document.getElementById('tipo');
            if (select) select.value = tipo;
        }

        const headerOffset = 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - (target.id === 'inicio' ? 0 : headerOffset);
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// Trabajos: modal con imagen y descripción
// Textos a validar por el equipo de VILAB. Sin imágenes: el modal abre solo con texto.
const JOBS = {
    'corona-zirconio': {
        titulo: 'Coronas de zirconio',
        descripcion: 'Restauraciones de zirconio diseñadas en CAD y fresadas, con ajuste, contactos y oclusión controlados para llegar listas para probar.',
        tipo: 'Coronas de zirconio',
        imagenes: [
            { src: 'img/corona-zirconio-1.jpeg', alt: 'Corona de zirconio posterior terminada' },
            { src: 'img/corona-zirconio-2.jpeg', alt: 'Corona de zirconio anterior sobre modelo' }
        ]
    },
    'corona-disilicato': {
        titulo: 'Coronas de disilicato',
        descripcion: 'Coronas de disilicato de litio de alta estética, pensadas para sectores donde la translucidez y la integración con el diente natural importan.',
        tipo: 'Coronas de disilicato',
        imagenes: [] // PENDIENTE: imagen
    },
    'incrustacion-zirconio': {
        titulo: 'Incrustaciones de zirconio',
        descripcion: 'Restauraciones parciales de zirconio que conservan estructura dentaria, diseñadas digitalmente para un ajuste marginal preciso.',
        tipo: 'Incrustaciones de zirconio',
        imagenes: [] // PENDIENTE: imagen
    },
    'incrustacion-disilicato': {
        titulo: 'Incrustaciones de disilicato',
        descripcion: 'Inlays y onlays de disilicato de litio: restauraciones parciales estéticas, diseñadas en CAD para respetar anatomía y oclusión.',
        tipo: 'Incrustaciones de disilicato',
        imagenes: [{ src: 'img/incrustaciones-disilicato.jpeg', alt: 'Incrustaciones de disilicato sobre modelo impreso' }]
    },
    'encerado': {
        titulo: 'Encerados diagnósticos',
        descripcion: 'Propuesta anatómica y estética previa al tratamiento, para planificar el caso, validar el resultado y comunicarlo al paciente.',
        tipo: 'Encerado diagnóstico',
        imagenes: [] // PENDIENTE: imagen
    },
    'modelo-3d': {
        titulo: 'Modelos 3D',
        descripcion: 'Modelos impresos a partir de escaneo digital, con detalle fiel de preparaciones y antagonistas, para trabajar con precisión.',
        tipo: 'Modelos 3D / Escaneo de modelos',
        imagenes: [{ src: 'img/modelo-3d.jpeg', alt: 'Modelos dentales impresos en 3D, superior e inferior' }]
    },
    'escaneo': {
        titulo: 'Escaneo de modelos',
        descripcion: 'Digitalización de tus modelos de yeso para incorporarlos al flujo CAD y evitar retrabajos.',
        tipo: 'Modelos 3D / Escaneo de modelos',
        imagenes: [] // PENDIENTE: imagen
    },
    'guia-planificacion': {
        titulo: 'Planificación de guías quirúrgicas',
        descripcion: 'Planificación digital de la posición de implantes sobre el modelo escaneado, como base de una cirugía guiada.',
        tipo: 'Guía quirúrgica',
        imagenes: [{ src: 'img/planificacion-guia.jpeg', alt: 'Planificación digital de tres implantes en software de diseño' }]
    },
    'guia-impresion': {
        titulo: 'Impresión de guías quirúrgicas',
        descripcion: 'Fabricación de la guía a partir de la planificación aprobada, lista para usar en cirugía.',
        tipo: 'Guía quirúrgica',
        imagenes: [] // PENDIENTE: imagen
    },
    'protector': {
        titulo: 'Protectores bucales',
        descripcion: 'Protectores bucales a medida, fabricados sobre el modelo del paciente para un ajuste cómodo y estable.',
        tipo: 'Protector bucal',
        imagenes: [{ src: 'img/protector-bucal.jpeg', alt: 'Protector bucal a medida' }]
    }
};

const jobModal = document.getElementById('job-modal');
const jobImg = document.getElementById('job-img');
const jobMedia = document.getElementById('job-media');
const jobThumbs = document.getElementById('job-thumbs');
const jobTitle = document.getElementById('job-title');
const jobDesc = document.getElementById('job-desc');
const jobCta = document.getElementById('job-cta');
let jobOpener = null;

function showJobImage(img, thumbBtns, i) {
    jobImg.src = img.src;
    jobImg.alt = img.alt;
    thumbBtns.forEach((b, n) => b.setAttribute('aria-current', String(n === i)));
}

function openJob(key, opener) {
    const job = JOBS[key];
    if (!job) return;
    jobOpener = opener;
    jobTitle.textContent = job.titulo;
    jobDesc.textContent = job.descripcion;
    jobCta.dataset.tipo = job.tipo;

    jobThumbs.replaceChildren();
    const hasImages = job.imagenes.length > 0;
    jobMedia.hidden = !hasImages;
    jobModal.classList.toggle('no-media', !hasImages);
    if (hasImages) {
        const btns = job.imagenes.map((img, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', `Ver foto ${i + 1}`);
            const t = document.createElement('img');
            t.src = img.src;
            t.alt = '';
            b.appendChild(t);
            b.addEventListener('click', () => showJobImage(img, btns, i));
            return b;
        });
        if (btns.length > 1) jobThumbs.append(...btns);
        showJobImage(job.imagenes[0], btns, 0);
    }

    jobModal.hidden = false;
    document.body.classList.add('modal-open');
    jobModal.querySelector('.modal-close').focus();
}

function closeJob() {
    if (jobModal.hidden) return;
    jobModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (jobOpener) jobOpener.focus();
    jobOpener = null;
}

document.querySelectorAll('.job').forEach(btn =>
    btn.addEventListener('click', () => openJob(btn.dataset.job, btn)));
jobModal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeJob));
jobCta.addEventListener('click', () => { jobOpener = null; closeJob(); });

document.addEventListener('keydown', (e) => {
    if (jobModal.hidden) return;
    if (e.key === 'Escape') { closeJob(); return; }
    if (e.key !== 'Tab') return;
    // Mantiene el foco dentro del modal
    const f = [...jobModal.querySelectorAll('button, a[href]')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// Animaciones de entrada
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Header: borde y sombra al hacer scroll
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('scrolled', window.pageYOffset > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Formulario: arma el mensaje y abre WhatsApp
const form = document.getElementById('case-form');
const note = document.getElementById('form-note');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = ['nombre', 'matricula', 'whatsapp', 'email', 'tipo'];
    let valid = true;
    fields.forEach(name => {
        const el = form.elements[name];
        const ok = el.value.trim() !== '' && el.checkValidity();
        el.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
    });

    if (!valid) {
        note.textContent = 'Revisá los campos marcados para continuar.';
        note.classList.add('error');
        return;
    }

    note.classList.remove('error');
    note.textContent = 'Abriendo WhatsApp…';

    const v = (name) => form.elements[name].value.trim();
    const lines = [
        'Hola VILAB, quiero enviar un caso.',
        '',
        `Nombre y apellido: ${v('nombre')}`,
        `Matrícula: ${v('matricula')}`,
        `WhatsApp: ${v('whatsapp')}`,
        `Email: ${v('email')}`,
        `Tipo de trabajo: ${v('tipo')}`
    ];
    if (v('mensaje')) lines.push(`Mensaje: ${v('mensaje')}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
});

form.addEventListener('input', (e) => e.target.classList.remove('invalid'));
