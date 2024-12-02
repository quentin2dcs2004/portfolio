document.addEventListener("DOMContentLoaded", function() {
    const words = [
        { text: "Web Developer", color: "#FF5733" },
        { text: "Graphiste", color: "#33FF57" },
        { text: "Web Designer", color: "#3357FF" },
        { text: "Modélisateur 3D", color: "#FF33A1" },
        { text: "Imprimeur 3D", color: "#FFD733" }
    ];
    let currentWordIndex = 0;
    const typingElement = document.getElementById("typing-effect");

    function typeText() {
        typingElement.innerHTML = ''; // Vide l'élément avant de commencer l'animation
        let currentWord = words[currentWordIndex];
        let i = 0;
        typingElement.style.color = currentWord.color; // Change la couleur du texte

        function addLetter() {
            typingElement.innerHTML += currentWord.text.charAt(i);
            i++;
            if (i < currentWord.text.length) {
                setTimeout(addLetter, 100); // Contrôle la vitesse d'affichage (100 ms)
            }
        }

        addLetter(); // Démarre l'animation pour le mot actuel

        // Passe au mot suivant après une pause
        setTimeout(function() {
            currentWordIndex = (currentWordIndex + 1) % words.length; // Passe au mot suivant dans le tableau
            setTimeout(typeText, 1000); // Attendre 1 seconde avant de démarrer la nouvelle animation
        }, currentWord.text.length * 100 + 1000); // Temps total avant de changer de mot
    }

    typeText(); // Lance l'animation dès que le DOM est prêt
});

// Texte clignotant
const blinkTexts = document.querySelectorAll('.blink');
setInterval(() => {
    blinkTexts.forEach((text) => {
        text.classList.toggle('hidden');
    });
}, 500);

// Effet de texte défilant (Typing Effect)
const typingEffectElement = document.getElementById('typing-effect');
const phrases = ['graphiste', 'modélisateur 3D', 'passionné par la créativité'];
let currentPhraseIndex = 0;
let currentLetterIndex = 0;

function typePhrase() {
    const currentPhrase = phrases[currentPhraseIndex];
    if (currentLetterIndex < currentPhrase.length) {
        typingEffectElement.textContent += currentPhrase[currentLetterIndex];
        currentLetterIndex++;
        setTimeout(typePhrase, 100);
    } else {
        setTimeout(deletePhrase, 2000);
    }
}

function deletePhrase() {
    if (currentLetterIndex > 0) {
        typingEffectElement.textContent = typingEffectElement.textContent.slice(0, -1);
        currentLetterIndex--;
        setTimeout(deletePhrase, 50);
    } else {
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        setTimeout(typePhrase, 1000);
    }
}

typePhrase();

// Survol (hover bounce)
const hoverElements = document.querySelectorAll('.hover-bounce');
hoverElements.forEach((el) => {
    el.addEventListener('mouseover', () => el.classList.add('bouncing'));
    el.addEventListener('mouseout', () => el.classList.remove('bouncing'));
});
// Dark Mode Toggle
document.getElementById('toggle-dark-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
  
  // Netflix Intro Timeout
  setTimeout(() => {
    document.querySelector('.netflix-intro').style.display = 'none';
  }, 3000);
  
// Supprimer l'intro après l'animation
document.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("netflix-intro");
  
    // Attendre 3 secondes avant de le retirer du DOM
    setTimeout(() => {
      intro.style.display = "none";
    }, 3000); // Correspond à la durée de l'animation fade-out
  });
  