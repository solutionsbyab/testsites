// Main frontend JS for Solutions by AB

// Mobile menu toggle and link-close
const mobileMenuBtn = document.getElementById(“mobile-menu-btn”);
const mobileMenu = document.getElementById(“mobile-menu”);

if (mobileMenuBtn && mobileMenu) {
mobileMenuBtn.addEventListener(“click”, () => {
mobileMenu.classList.toggle(“active”);
});

mobileMenu.querySelectorAll(“a”).forEach((link) => {
link.addEventListener(“click”, () => {
mobileMenu.classList.remove(“active”);
});
});
}

// Smooth scrolling for anchor links
document.querySelectorAll(‘a[href^=”#”]’).forEach((anchor) => {
anchor.addEventListener(“click”, function (e) {
const href = this.getAttribute(“href”);
if (!href || href === “#”) return;
const target = document.querySelector(href);
if (target) {
e.preventDefault();
window.scrollTo({ top: target.offsetTop - 64, behavior: “smooth” });
}
});
});

// Input focus effects
document.querySelectorAll(“input, textarea”).forEach((input) => {
input.addEventListener(“focus”, function () {
this.style.borderColor = “rgb(51, 204, 153)”;
this.style.boxShadow = “0 0 0 3px rgba(51, 204, 153, 0.1)”;
});
input.addEventListener(“blur”, function () {
this.style.borderColor = “rgb(37, 44, 55)”;
this.style.boxShadow = “none”;
});
});

// Form submission handler (Formspree)
const contactForm = document.getElementById(“contact-form”);
if (contactForm) {
contactForm.addEventListener(“submit”, async function (e) {
e.preventDefault();

```
const form = e.target;
const submitBtn = document.getElementById("submit-btn");
const btnText = document.getElementById("btn-text");
const statusDiv = document.getElementById("form-status");

submitBtn.disabled = true;
btnText.textContent = "Sending...";
statusDiv.classList.add("hidden");

try {
  const response = await fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" },
  });

  if (response.ok) {
    btnText.textContent = "✓ Sent Successfully!";
    submitBtn.style.background = "rgb(34, 197, 94)";

    statusDiv.textContent =
      "Thank you! Your message has been sent successfully.";
    statusDiv.style.background = "rgba(34, 197, 94, 0.1)";
    statusDiv.style.color = "rgb(34, 197, 94)";
    statusDiv.style.border = "1px solid rgb(34, 197, 94)";
    statusDiv.classList.remove("hidden");

    form.reset();

    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.textContent = "Submit Enquiry";
      submitBtn.style.background = "rgb(51, 204, 153)";
    }, 3000);

    setTimeout(() => {
      statusDiv.classList.add("hidden");
    }, 5000);
  } else {
    throw new Error("Form submission failed");
  }
} catch (error) {
  btnText.textContent = "✗ Failed to send";
  submitBtn.style.background = "rgb(239, 68, 68)";

  statusDiv.textContent = "Oops! Something went wrong. Please try again.";
  statusDiv.style.background = "rgba(239, 68, 68, 0.1)";
  statusDiv.style.color = "rgb(239, 68, 68)";
  statusDiv.style.border = "1px solid rgb(239, 68, 68)";
  statusDiv.classList.remove("hidden");

  setTimeout(() => {
    submitBtn.disabled = false;
    btnText.textContent = "Submit Enquiry";
    submitBtn.style.background = "rgb(51, 204, 153)";
  }, 3000);

  setTimeout(() => {
    statusDiv.classList.add("hidden");
  }, 5000);
}
```

});
}

// Open email composer (desktop Gmail vs mobile mailto)
function openEmail(e) {
e.preventDefault();

const emailConfig = {
to: “Contact@solutionsbyab.com”,
cc: “”,
bcc: “”,
subject: “”,
body: “”,
};

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
let mailtoLink = `mailto:${emailConfig.to}`;
const params = [];
if (emailConfig.cc) params.push(`cc=${encodeURIComponent(emailConfig.cc)}`);
if (emailConfig.bcc)
params.push(`bcc=${encodeURIComponent(emailConfig.bcc)}`);
if (emailConfig.subject)
params.push(`subject=${encodeURIComponent(emailConfig.subject)}`);
if (emailConfig.body)
params.push(`body=${encodeURIComponent(emailConfig.body)}`);
if (params.length > 0) mailtoLink += “?” + params.join(”&”);
window.location.href = mailtoLink;
} else {
let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailConfig.to}`;
if (emailConfig.cc) gmailUrl += `&cc=${encodeURIComponent(emailConfig.cc)}`;
if (emailConfig.bcc)
gmailUrl += `&bcc=${encodeURIComponent(emailConfig.bcc)}`;
if (emailConfig.subject)
gmailUrl += `&su=${encodeURIComponent(emailConfig.subject)}`;
if (emailConfig.body)
gmailUrl += `&body=${encodeURIComponent(emailConfig.body)}`;
window.open(gmailUrl, “_blank”);
}
}

// Expose openEmail globally so inline onclick in HTML still works
window.openEmail = openEmail;

// Rotating typewriter effect: type → pause → delete → type next phrase
(function () {
const phrases = [
“Your Business Is Leaking Time. We Plug It.”,
“You Have Bottlenecks. We Eliminate Them.”,
“Manual Processes Slow You Down. We Automate Them.”,
“Your Workflow Is Broken. We Rebuild It.”,
“Repetitive Tasks Drain Your Team. We Replace Them.”,
“Your Systems Don’t Talk. We Connect Them.”,
];

const el = document.getElementById(“typewriter”);
const cursor = document.getElementById(“typewriter-cursor”);
const measure = document.getElementById(“typewriter-measure”);

const typeSpeed = 50;      // ms per character typing
const deleteSpeed = 30;    // ms per character deleting
const pauseAfterType = 5000; // 5s pause after full phrase
const pauseAfterDelete = 400; // short pause before typing next

let currentPhrase = 0;
let timer = null;

// Set measure to longest phrase to prevent layout shifts
if (measure) {
let longest = “”;
phrases.forEach((p) => { if (p.length > longest.length) longest = p; });
measure.textContent = longest;
}

function typeText(text, charIndex, callback) {
if (!el) return;
if (charIndex <= text.length) {
el.textContent = text.slice(0, charIndex);
timer = setTimeout(() => typeText(text, charIndex + 1, callback), typeSpeed);
} else {
if (callback) callback();
}
}

function deleteText(callback) {
if (!el) return;
const current = el.textContent;
if (current.length > 0) {
el.textContent = current.slice(0, -1);
timer = setTimeout(() => deleteText(callback), deleteSpeed);
} else {
if (callback) callback();
}
}

function runCycle() {
const phrase = phrases[currentPhrase];
// Type out the phrase
typeText(phrase, 0, () => {
// Pause, then delete
timer = setTimeout(() => {
deleteText(() => {
// Move to next phrase
currentPhrase = (currentPhrase + 1) % phrases.length;
// Short pause before typing next
timer = setTimeout(runCycle, pauseAfterDelete);
});
}, pauseAfterType);
});
}

function stopCycle() {
if (timer) { clearTimeout(timer); timer = null; }
}

function startCycle() {
stopCycle();
currentPhrase = 0;
if (el) el.textContent = “”;
runCycle();
}

// Initial run on load
window.addEventListener(“load”, startCycle);

// Restart whenever the hero section enters view
if (el) {
const section = el.closest(“section”);
if (section && “IntersectionObserver” in window) {
const obs = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
startCycle();
}
});
},
{ threshold: 0.5 },
);
obs.observe(section);
}
}
})();
