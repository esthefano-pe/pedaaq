let players = [];

// Base de datos de retos. Agrega todos los que quieras aquí.
// Usa "{otro}" si quieres que el sistema elija a una segunda persona al azar.
const database = {
    suave: {
        verdad: [
            "¿Cuál ha sido tu peor cita?",
            "¿Qué es lo más vergonzoso que has buscado en Google?",
            "¿A quién del grupo consideras el peor vestido hoy?",
            "¿Cuál es tu gusto culposo musical?",
            "Si tuvieras que eliminar a alguien de este grupo de tu vida, ¿quién sería?"
        ],
        reto: [
            "Imita a {otro} hasta que alguien adivine quién es.",
            "Déjate maquillar o peinar por {otro} con los ojos cerrados.",
            "Habla con acento extranjero durante los próximos 3 turnos.",
            "Toma un vaso de agua sin usar las manos.",
            "Pídele perdón a {otro} de rodillas por algo inventado."
        ]
    },
    caliente: {
        verdad: [
            "¿Quién del grupo te parece más atractivo/a?",
            "¿Alguna vez has fantaseado con alguien presente?",
            "¿Cuál es tu posición favorita?",
            "¿Has mandado o recibido 'nudes' esta semana?",
            "Del 1 al 10, ¿qué tan bueno/a te consideras en la cama?"
        ],
        reto: [
            "Báilale sensual a {otro} por 15 segundos sin música.",
            "Dale un beso en el cuello a {otro}.",
            "Quítate una prenda de ropa (que no sean zapatos).",
            "Mándale un mensaje a tu ex diciendo 'te extraño'.",
            "Siéntate en las piernas de {otro} durante los próximos 2 turnos."
        ]
    },
    extremo: {
        verdad: [
            "¿Con cuántas personas de esta habitación tendrías algo?",
            "¿Cuál es el lugar más público donde lo has hecho?",
            "¿Qué es lo más sucio o tabú que estarías dispuesto/a a intentar?",
            "¿Has sido infiel alguna vez? Da contexto.",
            "¿A quién de este grupo te llevarías a una isla desierta solo por sexo?"
        ],
        reto: [
            "Dale un beso apasionado de 5 segundos a {otro}.",
            "Ve al baño a solas con {otro} por 2 minutos. Los demás eligen si con luz apagada.",
            "Tómate un shot del ombligo o cuerpo de {otro}.",
            "Intercambia una prenda íntima con {otro}.",
            "Deja que el grupo te revise la galería de fotos del celular por 30 segundos."
        ]
    }
};

// Referencias del DOM
const inputName = document.getElementById('playerName');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersList = document.getElementById('playersList');
const playBtn = document.getElementById('playBtn');
const resultBox = document.getElementById('resultBox');
const targetPlayerEl = document.getElementById('targetPlayer');
const challengeTextEl = document.getElementById('challengeText');
const levelSelect = document.getElementById('levelSelect');
const typeSelect = document.getElementById('typeSelect');

// Agregar jugador
addPlayerBtn.addEventListener('click', () => {
    const name = inputName.value.trim();
    if (name !== "" && !players.includes(name)) {
        players.push(name);
        inputName.value = "";
        renderPlayers();
    }
});

// Permitir agregar con "Enter"
inputName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayerBtn.click();
});

// Dibujar lista de jugadores
function renderPlayers() {
    playersList.innerHTML = "";
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${player} <button class="delete-btn" onclick="removePlayer(${index})">×</button>`;
        playersList.appendChild(li);
    });
}

// Eliminar jugador
window.removePlayer = function(index) {
    players.splice(index, 1);
    renderPlayers();
};

// Obtener persona al azar (evitando que se elija a la misma 2 veces)
function getRandomPlayer(exclude = null) {
    let available = players.filter(p => p !== exclude);
    if (available.length === 0) return "alguien misterioso";
    return available[Math.floor(Math.random() * available.length)];
}

// Lógica principal de la ruleta
playBtn.addEventListener('click', () => {
    if (players.length < 2) {
        alert("¡Necesitan ser al menos 2 jugadores para la peda!");
        return;
    }

    // Animación de recarga
    resultBox.classList.add('hidden');

    setTimeout(() => {
        const level = levelSelect.value;
        let type = typeSelect.value;

        // Si elige "Sorpréndeme", elegimos verdad o reto al azar
        if (type === 'cualquiera') {
            type = Math.random() > 0.5 ? 'verdad' : 'reto';
        }

        // Obtener el array de retos correspondiente
        const pool = database[level][type];
        
        // Seleccionar reto al azar
        const randomChallenge = pool[Math.floor(Math.random() * pool.length)];

        // Seleccionar jugador principal al azar
        const p1 = getRandomPlayer();
        
        // Si el texto incluye "{otro}", buscamos un segundo jugador
        const finalText = randomChallenge.replace('{otro}', `<strong>${getRandomPlayer(p1)}</strong>`);

        // Mostrar en pantalla
        let etiqueta = type === 'verdad' ? '🗣️ VERDAD:' : '🎯 RETO:';
        targetPlayerEl.textContent = `¡${p1}!`;
        challengeTextEl.innerHTML = `<b>${etiqueta}</b> <br> ${finalText}`;

        resultBox.classList.remove('hidden');
    }, 300); // Pequeño retraso para que se note la transición
});
