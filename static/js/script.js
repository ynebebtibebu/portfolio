// ===== Toggle Mobile Menu =====
const menuIcon = document.getElementById('menu-icon');
const nav = document.querySelector('header nav');

menuIcon.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent click from bubbling up
  nav.classList.toggle('active');
  menuIcon.classList.toggle('bx-x'); // Toggles menu icon to 'X'
});

// ===== Close Mobile Menu on Outside Click =====
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !menuIcon.contains(e.target) && nav.classList.contains('active')) {
    nav.classList.remove('active');
    menuIcon.classList.remove('bx-x');
  }
});

// ===== Close Mobile Menu on Link Click =====
document.querySelectorAll('header nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    menuIcon.classList.remove('bx-x');
  });
});

// ===== Smooth Scroll to Sections =====
document.querySelectorAll('header nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Highlight Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const offset = section.offsetTop - 100;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= offset && scrollY < offset + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`header nav a[href="#${id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
});

// ===== Handle Contact Form Submit with Backend =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('input[type="text"]').value.trim();
    const email = contactForm.querySelector('input[type="email"]').value.trim();
    const message = contactForm.querySelector('textarea').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        alert('Message sent!');
        contactForm.reset();
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      alert('Error sending message.');
      console.error(error);
    }
  });
}