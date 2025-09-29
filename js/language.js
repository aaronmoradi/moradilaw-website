// ---- Translations ----
const translations = {
  en: {
    heroHeading: "Hi! I am Leeora B. Moradi, Attorney at Law, and I specialize in...",
    heroLead: "Helping you tackle legal issues with clarity, expertise, and results.",
    aboutTitle: "About",
    aboutText: "Leeora B. Moradi is an experienced attorney specializing in Workers' Compensation, Personal Injury, and Defense of the Uninsured Employer. With over 15 years of dedicated legal practice, she ensures her clients receive personalized attention and aggressive representation. Certified by the State Bar Association, Leeora is committed to justice and client advocacy.",
    practiceTitle: "Practice Areas",
    cardTitle: "Workers' Compensation",
    cardDesc: "Workers' compensation provides financial and medical benefits to employees injured or ill due to their job.",
    contactTitle: "Contact",
    contactInfo: "Complete this contact form to reach out to me",
    labelName: "Full Name",
    labelEmail: "Email Address",
    labelMessage: "Message",
    buttonSend: "Send Message",
    typingPhrases: [
      " Worker's Compensation",
      " Personal Injury",
      " Defense of the Uninsured Employer"
    ]
  },
  es: {
    heroHeading: "¡Hola! Soy Leeora B. Moradi, Abogada, y me especializo en...",
    heroLead: "Ayudándote a abordar problemas legales con claridad, experiencia y resultados.",
    aboutTitle: "Acerca de",
    aboutText: "Leeora B. Moradi es una abogada experimentada especializada en Compensación de Trabajadores, Lesiones Personales y Defensa del Empleador No Asegurado. Con más de 15 años de práctica legal dedicada, garantiza que sus clientes reciban atención personalizada y representación agresiva. Certificada por el Colegio de Abogados, Leeora está comprometida con la justicia y la defensa del cliente.",
    practiceTitle: "Áreas de Práctica",
    cardTitle: "Compensación de Trabajadores",
    cardDesc: "La compensación de trabajadores proporciona beneficios financieros y médicos a empleados lesionados o enfermos debido a su trabajo.",
    contactTitle: "Contacto",
    contactInfo: "Complete este formulario de contacto para comunicarse conmigo",
    labelName: "Nombre Completo",
    labelEmail: "Correo Electrónico",
    labelMessage: "Mensaje",
    buttonSend: "Enviar Mensaje",
    typingPhrases: [
      " Compensación de Trabajadores",
      " Lesiones Personales",
      " Defensa del Empleador No Asegurado"
    ]
  }
};

// ---- Elements ----
const elements = {
  heroHeading: document.querySelector('.hero-heading'),
  heroLead: document.querySelector('.hero-text .lead'),
  aboutTitle: document.querySelector('.about-title'),
  aboutText: document.querySelector('.about-text'),
  practiceTitle: document.querySelector('.practice-title'),
  cardTitle: document.querySelector('.card-title'),
  cardDesc: document.querySelector('.card-desc'),
  contactTitle: document.querySelector('.contact-title'),
  contactInfo: document.querySelector('.contact-info'),
  labelName: document.querySelector('.label-name'),
  labelEmail: document.querySelector('.label-email'),
  labelMessage: document.querySelector('.label-message'),
  buttonSend: document.querySelector('.btn'),
  typingText: document.querySelector('.typing-header .text')
};

// ---- Typing Effect ----
let currentPhrase = 0;
let currentChar = 0;
let typing = true;
let currentLang = 'en';

function typeEffect() {
  const phrases = translations[currentLang].typingPhrases;
  const phrase = phrases[currentPhrase];
  
  if (typing) {
    elements.typingText.textContent += phrase.charAt(currentChar);
    currentChar++;
    if (currentChar === phrase.length) {
      typing = false;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    elements.typingText.textContent = phrase.substring(0, currentChar - 1) || "\u00A0";
    currentChar--;
    if (currentChar === 0) {
      typing = true;
      currentPhrase = (currentPhrase + 1) % phrases.length;
    }
  }
  setTimeout(typeEffect, typing ? 100 : 50);
}

// ---- Set Language ----
function setLanguage(lang) {
  currentLang = lang;
  elements.heroHeading.textContent = translations[lang].heroHeading;
  elements.heroLead.textContent = translations[lang].heroLead;
  elements.aboutTitle.textContent = translations[lang].aboutTitle;
  elements.aboutText.textContent = translations[lang].aboutText;
  elements.practiceTitle.textContent = translations[lang].practiceTitle;
  elements.cardTitle.textContent = translations[lang].cardTitle;
  elements.cardDesc.textContent = translations[lang].cardDesc;
  elements.contactTitle.textContent = translations[lang].contactTitle;
  elements.contactInfo.textContent = translations[lang].contactInfo;
  elements.labelName.textContent = translations[lang].labelName;
  elements.labelEmail.textContent = translations[lang].labelEmail;
  elements.labelMessage.textContent = translations[lang].labelMessage;
  elements.buttonSend.textContent = translations[lang].buttonSend;

  // Reset typing effect
  currentPhrase = 0;
  currentChar = 0;
  typing = true;
  elements.typingText.textContent = '';
}

// ---- Event Listener ----
document.getElementById('languageSelector').addEventListener('change', e => {
  setLanguage(e.target.value);
});

// ---- Initialize ----
window.onload = () => {
  setLanguage('en'); // default language
  typeEffect();
};