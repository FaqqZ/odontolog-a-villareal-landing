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
