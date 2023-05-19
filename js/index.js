

// Numéro de la question courante
let noQuestion = 0; 

let nombreReponsesJustes = 0;
let nombreReponsesIncorrectes = 0;


// Zone d'affichage du quiz
let zoneQuiz = document.querySelector(".quiz");

// Section contenant une question du quiz et sa position sur l'axe des X
let sectionQuestion = document.querySelector("section");
let positionX = 100;

// Conteneurs des titres des questions et des choix de réponse
let titreQuestion = document.querySelector(".titre-question");
let lesChoixDeReponses = document.querySelector(".les-choix-de-reponse");


// Titre animé du quiz
let titreIntro = document.querySelector(".anim-titre-intro");

// Zone de fin du quiz
let zoneFin = document.querySelector(".fin");
/*barre*/ 
let barreAvancement = document.querySelector(".barre-avancement");
let largeurBarre = 0;
let largeurCibleBarre = 0;

let score = 0;

/*evement*/
// Gérer la fin de l'animation d'intro
titreIntro.addEventListener("animationend", afficherConsignePourDebuterLeJeu);


/*fonction*/
function afficherConsignePourDebuterLeJeu(event) {
    //console.log(event.animationName);
    //On affiche la consigne si c'est la fin de la deuxième animation: etirer-mot
    if (event.animationName == "bounce") {
        //On affiche un message dans le pied de page
        let piedDePage = document.querySelector("footer");
        piedDePage.innerHTML = "<h1>Cliquer dans l'écran pour commencer le quiz</h1>";

        //On met un écouteur sur la fenêtre pour enlever l'intro et commencer le quiz
        window.addEventListener("click", commencerLeQuiz);
    }
}
function generateLightBall() {
    let lightBall = document.createElement("div");
    lightBall.classList.add("light-ball");
  
    document.body.appendChild(lightBall);
  
    function moveLightBall(event) {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
  
      lightBall.style.left = mouseX + "px";
      lightBall.style.top = mouseY + "px";
    }
  
    document.addEventListener("mousemove", moveLightBall);
  }
  

/* Enlever les éléments de l'intro et commencer le quiz*/
function commencerLeQuiz() {
    //On enlève le conteneur de l'intro
   let into = document.querySelector("main.intro");
   into.remove();

    //On enlève l'écouteur qui gère le début du quiz
    window.removeEventListener("click", commencerLeQuiz);

    //On met le conteneur du quiz visible
    zoneQuiz.style.display = "flex";
    generateLightBall();

    //On affiche la première question
    afficherQuestion();
 
       
}

function afficherQuestion() {
    //Récupérer l'objet de la question en cours
    let objetQuestion = lesQuestions[noQuestion];

    //On affiche le titre de la question
    titreQuestion.innerText = objetQuestion.titre;

    //On crée et on affiche les balises des choix de réponse
  
    lesChoixDeReponses.innerHTML = "";


    let unChoix;
    for (let i = 0; i < objetQuestion.choix.length; i++) {
     //On crée la balise et on y affecte une classe CSS
     unChoix = document.createElement("div");
     unChoix.classList.add("choix");

    //On ajoute une div qui contiendra l'image et le texte
    let choixContainer = document.createElement("div");
     choixContainer.classList.add("choix-container");

      // ajout d'une image à chaque choix
     let imageChoix = document.createElement("img");
     imageChoix.classList.add("image-choix");
    imageChoix.src = objetQuestion.images[i];
    choixContainer.append(imageChoix);

    //on met le texte
    let texteChoix = document.createElement("span");
    texteChoix.classList.add("texte-choix");
    texteChoix.innerText = objetQuestion.choix[i];
    choixContainer.append(texteChoix);

    // ajoute le choix container au choix de réponse
    unChoix.append(choixContainer);

  
    unChoix.indexChoix = i;

    // écouteur pour vérifier la réponse choisie
    unChoix.addEventListener("mousedown", verifierReponse);

    // l'image en arrière-plan
    unChoix.style.backgroundImage = `url(${objetQuestion.images[i]})`;

    //affiche ce choix
    lesChoixDeReponses.append(unChoix);
     }
     positionX = 100;
     requestAnimationFrame(animerSection);
     largeurCibleBarre = (noQuestion + 1) / lesQuestions.length * 100;
     requestAnimationFrame(animerBarreAvancement);


}
function animerBarreAvancement() {
     largeurBarre += 1;
     barreAvancement.style.width = largeurBarre + "vw";
if(largeurBarre < largeurCibleBarre){
    requestAnimationFrame(animerBarreAvancement);
}
}


  
function animerSection() {
  
    positionX -= 2;
   // laSection.style.transform = `translateX(${positionX}vw)`;

    if (positionX > 0) {
        requestAnimationFrame(animerSection);
    }
}

/**
 * Fonction permettant de vérifier la réponse choisie et de gérer la suite
 *
 * @param {object} event Informations sur l'événement MouseEvent distribué
 */
  
function verifierReponse(event) {
    lesChoixDeReponses.classList.toggle('desactiver');
    let indexReponseChoisi = event.currentTarget.indexChoix;
    let objetQuestion = lesQuestions[noQuestion];
    if (objetQuestion.bonneReponse === indexReponseChoisi) {
        nombreReponsesJustes++;
        event.target.classList.add('reponse-succes');
        console.log('bonne');
        score++;
        
    } else {
        event.target.classList.add('reponse-echec');
        console.log('mauvais');
        nombreReponsesIncorrectes++;
    }
    let scoreCompteur = document.getElementById('score-compteur');
    scoreCompteur.classList.add('score-compteur-anim')
    scoreCompteur.innerText = 'Score : ' + score;
    event.target.addEventListener('animationend', gererProchaineQuestion);
}




function gererProchaineQuestion(event) {
    lesChoixDeReponses.classList.toggle('desactiver');
    noQuestion++;
    if (noQuestion < lesQuestions.length) {
        afficherQuestion();
    } else{
        afficherFin();
    }
  }


  function afficherFin() {
      zoneQuiz.style.display = "none";
      zoneFin.style.display = "flex";
      
      let nombreReponsesIncorrectes = noQuestion - nombreReponsesJustes;
      
      let resultatsText = document.createElement("div");
      resultatsText.classList.add("resultats");
      resultatsText.innerHTML = 
      "Résultats du quiz:<br>" +
      "Bonnes réponses: <span class='bonne-reponse'>" + nombreReponsesJustes + "</span><br>" +
      "Mauvaises réponses: <span class='mauvaise-reponse'>" + nombreReponsesIncorrectes + "</span>";
      zoneFin.appendChild(resultatsText);
      
      let dateTime = new Date();
      let dateString = dateTime.toLocaleDateString();
      let timeString = dateTime.toLocaleTimeString();
      let dateTimeText = document.createElement("div");
      dateTimeText.classList.add("date-time");
      dateTimeText.innerHTML = "Date du jour: " + dateString + "<br>Time: " + timeString;
      zoneFin.appendChild(dateTimeText);
      
      
      let recommencerButton = document.createElement("button");
      recommencerButton.classList.add("recommencer-button");
      recommencerButton.innerText = "Recommencer";
      recommencerButton.addEventListener("click", recommencerQuiz);
      zoneFin.appendChild(recommencerButton);
    
    }
    
    function recommencerQuiz() {
        noQuestion = 0;
        nombreReponsesJustes = 0;
        largeurBarre = 0;
        
        largeurCibleBarre = 0;
      
        let recommencerButton = document.querySelector(".recommencer-button");
        recommencerButton.classList.add("fade-out-animation");
      
        recommencerButton.addEventListener("animationend", function() {
          recommencerButton.remove();
          zoneFin.style.display = "none";
          zoneQuiz.style.display = "flex";
          titreIntro.addEventListener("animationend", afficherConsignePourDebuterLeJeu);
      
        
          afficherQuestion();
        });
      }
      
      
  
  
  
  

 