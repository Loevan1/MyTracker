
// RÉCUPÉRATION DES ÉLÉMENTS 
const inputTache = document.querySelector('input[type="text"]');
const selectCategorie = document.getElementById("categories");
const rangeDuree = document.getElementById("dureeRange");
const inputDate = document.querySelector('input[type="date"]');

// conteneur d'affichage
const container = document.getElementById("container");

const checkbox = document.getElementById('important');


// mapping durée
const durees = {
  1: "court",
  2: "moyen",
  3: "long"
};

// enrgistrement LOCALSTORAGE 
function getTaches() {
  return JSON.parse(localStorage.getItem("taches")) || [];
}

function saveTaches(taches) {
  localStorage.setItem("taches", JSON.stringify(taches));
}

function getTachesFaites() {
  return localStorage.getItem("tachesFaites");
}

function saveTachesFaites(tacheFini) {
  localStorage.setItem("tachesFaites", tacheFini);
}

  function saveXP(XP) {
  localStorage.setItem("XP", XP);
}

function getXP() {
  return JSON.parse(localStorage.getItem("XP")) || [];
}

// affichage des taches
function afficherTaches() {
  const selectTri = document.getElementById('triSelect');
  const critere = selectTri ? selectTri.value : 'date';
 const maintenant = new Date();
  container.innerHTML = `<h2>Mes tâches</h2>
  <div id=triAffichage>
  <h4>Date : ${maintenant.toLocaleDateString('fr-FR')}</h4>
  <select id="triSelect" class="input">
      <option value="date" ${critere === 'date' ? 'selected' : ''}>Trier par date</option>
      <option value="important" ${critere === 'important' ? 'selected' : ''}>Trier par importance</option>
      <option value="categorie" ${critere === 'categorie' ? 'selected' : ''}>Trier par catégorie</option>
    </select>
    </div>
  
  `;
  const taches = getTaches();
  
  const tachesTriees = taches.slice().sort((a, b) => {
  switch(critere) {
    case 'date':
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date) - new Date(b.date);
    
    case 'important':
      // Important d'abord, puis par date
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      // Si même importance, trier par date
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date) - new Date(b.date);
    
    case 'categorie':
      if (!a.categorie) return 1;
      if (!b.categorie) return -1;
      const compCategorie = a.categorie.localeCompare(b.categorie);
      // Si même catégorie, trier par date
      if (compCategorie === 0) {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
      }
      return compCategorie;
    
    default:
      return 0;
  }
});
  tachesTriees.forEach((tache) => {
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
      ${tache.important ? '<strong>Important</strong>' : ''}
      ${tache.fait
        ? '<span style="color: #28a745; font-weight: bold;">✔ Fait</span>'
        : `<button class='btn' onclick="faitTache(${tache.id})">Fait</button>`}
      <button class='btn' onclick="supprimerTache(${tache.id})">Supprimer</button>
      
      </div>
    `;

    container.appendChild(div);
  });
  document.getElementById('triSelect').addEventListener('change', afficherTaches);
}

// CRÉATION DE TÂCHE 
function creer_tache() {
  if (inputTache.value.trim() === "") return;

  const nouvelleTache = {
    id: Date.now(), 
    nom: inputTache.value,
    categorie: selectCategorie.value,
    duree: durees[rangeDuree.value],
    date: inputDate.value,
    important: checkbox.checked,
    fait: false,
  };

  const taches = getTaches();
  taches.push(nouvelleTache);
  saveTaches(taches);

  inputTache.value = "";
  afficherTaches();
}

// SUPPRESSION 
function supprimerTache(id) {
  const taches = getTaches();
  const index = taches.findIndex(tache => tache.id === id);
  if (index !== -1) {
    taches.splice(index, 1);
    saveTaches(taches);
    afficherTaches();
  }
}


// fait et suppression
function faitTache(id) {
  const taches = getTaches();
  const index = taches.findIndex(tache => tache.id === id);
  if (index !== -1) {
    taches[index].fait = true;
    saveTaches(taches);
    XP = getXP()
    XP+=5;
    saveXP(XP);
    tachesFini = getTachesFaites()
    tachesFini++;
    saveTachesFaites(tachesFini);
    
    afficherTaches();
  }
}

// intitialistaion 
document.addEventListener("DOMContentLoaded", afficherTaches);




