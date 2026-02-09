
// ====== RÉCUPÉRATION DES ÉLÉMENTS ======
const inputTache = document.querySelector('input[type="text"]');
const selectCategorie = document.getElementById("categories");
const rangeDuree = document.getElementById("dureeRange");
const inputDate = document.querySelector('input[type="date"]');

// conteneur d'affichage
const container = document.getElementById("container");




// mapping durée
const durees = {
  1: "court",
  2: "moyen",
  3: "long"
};

// ====== LOCALSTORAGE ======
function getTaches() {
  return JSON.parse(localStorage.getItem("taches")) || [];
}

function saveTaches(taches) {
  localStorage.setItem("taches", JSON.stringify(taches));
}



function saveTachesFaites(tacheFini) {
  localStorage.setItem("tachesFaites", tacheFini);
}

function getTachesFaites() {
  return JSON.parse(localStorage.getItem("tachesFaites")) || [];
}


  function saveXP(XP) {
  localStorage.setItem("XP", XP);
}

function getXP() {
  return JSON.parse(localStorage.getItem("XP")) || [];
}

// ====== AFFICHAGE ======
function afficherTaches() {
 const maintenant = new Date();
  container.innerHTML = `
  <h4>Aujourd'hui : ${maintenant.toLocaleDateString('fr-FR')}</h4>
  <h2>Mes tâches</h2>
  `;
  const taches = getTaches();
  const tachesTriees = taches.slice().sort((a, b) => {
    // Tâches sans date à la fin
    if (!a.date) return 1;
    if (!b.date) return -1;
    // Comparer les dates
    return new Date(a.date) - new Date(b.date);
  });
  tachesTriees.forEach((tache, index) => {
    const div = document.createElement("div");
    
    div.style.border = "1px solid #000000";
    div.style.margin = "10px";
    div.style.padding = "5px";
    div.style.borderRadius = " 10px"
    div.className = "tache-card";
    div.innerHTML = `
    <div id="info">
      <h3>${tache.nom}</h3>
      <strong>Catégorie : </strong> ${tache.categorie}<br>
      <strong>Durée :</strong> ${tache.duree}<br>
      <strong>Date :</strong> ${tache.date ? new Date(tache.date).toLocaleDateString('fr-FR') : "non définie"}<br>
      </div>
      <div id='sup'>
      <button class='btn' onclick="faitTache(${index})">Fait</button>
      <button class='btn' onclick="supprimerTache(${index})">Supprimer</button>
      
      </div>
    `;

    container.appendChild(div);
  });
}

// ====== CRÉATION DE TÂCHE ======
function creer_tache() {
  if (inputTache.value.trim() === "") return;

  const nouvelleTache = {
    nom: inputTache.value,
    categorie: selectCategorie.value,
    duree: durees[rangeDuree.value],
    date: inputDate.value,

  };

  const taches = getTaches();
  taches.push(nouvelleTache);
  saveTaches(taches);

  inputTache.value = "";
  afficherTaches();
}

// ====== SUPPRESSION ======
function supprimerTache(index) {
  const taches = getTaches();
  taches.splice(index, 1);
  saveTaches(taches);
  afficherTaches();
}



function faitTache(index) {
  const taches = getTaches();
  taches.splice(index, 1);
  saveTaches(taches);
  
  tachesFini = getTachesFaites()
  tachesFini++;
  saveTachesFaites(tachesFini);
  XP = getXP()
  XP+=5;
  saveXP(XP);
  afficherTaches();
  
}
// ====== INIT ======
document.addEventListener("DOMContentLoaded", afficherTaches);




