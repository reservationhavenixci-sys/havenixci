// ---- Zone logo : bascule automatiquement sur le cadre "LOGO"
//      si assets/logo.png n'est pas encore présent ----
document.getElementById('logoImg').addEventListener('error', function(){
  document.getElementById('logoMark').classList.add('placeholder');
  this.remove();
});

// ---- Typewriter #1 : prix qui défilent ----
const priceEl = document.getElementById('typewriterPrice');
const priceItems = [
  { price: "15 000 FCFA", color: "#f0c85e" },
  { price: "20 000 FCFA", color: "#7fd8cf" },
  { price: "25 000 FCFA", color: "#ffb27a" },
  { price: "30 000 FCFA", color: "#e6c8ff" }
];
const prefix = "Trouvez votre chambre à partir de ";
const suffix = " pour votre séjour en toute tranquillité";

let priceIndex = 0;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function typeChars(container, text){
  for(let i=0; i<=text.length; i++){
    container.textContent = text.slice(0,i);
    await sleep(16);
  }
}
async function eraseChars(container, text){
  for(let i=text.length; i>=0; i--){
    container.textContent = text.slice(0,i);
    await sleep(10);
  }
}

async function runPriceLoop(){
  while(true){
    const item = priceItems[priceIndex % priceItems.length];
    priceEl.innerHTML = '';

    const prefixSpan = document.createElement('span');
    priceEl.appendChild(prefixSpan);
    await typeChars(prefixSpan, prefix);

    const priceSpan = document.createElement('span');
    priceSpan.className = 'price';
    priceSpan.style.color = item.color;
    priceEl.appendChild(priceSpan);
    await typeChars(priceSpan, item.price);

    const suffixSpan = document.createElement('span');
    priceEl.appendChild(suffixSpan);
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    priceEl.appendChild(cursor);
    await typeChars(suffixSpan, suffix);

    await sleep(1600);
    cursor.remove();

    // erase suffix, price, prefix in reverse
    await eraseChars(suffixSpan, suffix);
    await eraseChars(priceSpan, item.price);
    await eraseChars(prefixSpan, prefix);

    priceIndex++;
    await sleep(300);
  }
}
runPriceLoop();

// ---- Typewriter #2 : Hôtel <-> Résidence ----
const toggleEl = document.getElementById('typeToggle');
const toggleWords = ["Hôtel", "Résidence"];
let toggleIndex = 0;

async function runToggleLoop(){
  while(true){
    const word = toggleWords[toggleIndex % toggleWords.length];
    await typeChars(toggleEl, word);
    await sleep(1400);
    await eraseChars(toggleEl, word);
    await sleep(250);
    toggleIndex++;
  }
}
runToggleLoop();