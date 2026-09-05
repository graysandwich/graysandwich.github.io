

const SERVER_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://ewow-score-checker-698852688376.us-central1.run.app";
let serverState = { code: "", players: {}, bullets: [], enemies: [], floatingObjects: [], enemyBullets: [], abilityIcons: [], mapObjects: [], sharedXP: 0, nextLevel: 0, currentPage: "", readyCount: 0, waveText: null, deadPlayers:{}};

const backgroundImage = new Image();
backgroundImage.src = "images/background.webp";
const timeWarpBackground = new Image();
timeWarpBackground.src = "images/timeWarpBackground.webp";
const enemyBulletImage = new Image();
enemyBulletImage.src = "images/enemyBullet.webp";
let socket = io(SERVER_URL, { transports: ["websocket"] });
window.socket = socket;
const bossBarState = new Map();
let enemyImages = []
enemyImages.push(new Image());
enemyImages[0].src = "images/enemy.webp"
let healthBarCurrentLength = 400;
let healthBarDesiredLength = 400;
let levelBarCurrentLength = 0;
let levelBarDesiredLength = 0;
let shieldBarCurrentLength = 0;
let shieldBarDesiredLength = 0;
let hasReadiedUp = false;

for (let i = 1; i < ENEMYTYPES.length; i++) {
    enemyImages.push(new Image());
    if (i != 11) enemyImages[i].src = "images/" + ENEMYTYPES[i].name.charAt(0).toLowerCase() + ENEMYTYPES[i].name.slice(1) + ".webp";
    else enemyImages[11].src = "images/xpBag.webp";
}
const bulletPaths = [
    "images/bullet.webp",
    "images/frostProjectile.webp",
    "images/blue.webp",
    "images/bomb.webp",
    "images/protectorBullet.webp",
    "images/grayCircle.webp",
    "images/frostAura.webp",
    "images/bouncingBullet.webp",
    "images/playerFire.webp",
    "images/playerWind.webp",
    "images/playerIceBullet.webp",
    "images/bullet.webp",
    "images/shockwave.webp",
    "images/bullet.webp",
    "images/playerNuke.webp",
];
let bulletImages = bulletPaths.map(src => {
    let img = new Image();
    img.src = src;
    return img;
});


const enemyBulletPaths = [
    "images/enemyBullet.webp",
    "images/homingBullet.webp",
    "images/trap.webp",
    "images/poisonBomb.webp",
    "images/blackHole.webp",
    "images/yellow.webp",
    "images/chargedOrb.webp",
    "images/blue.webp",
    "images/machineGunBullet.webp",
    "images/splitterBullet.webp",
    "images/iceEnemyProjectile.webp",
    "images/fire.webp",
    "images/water.webp",
    "images/bigRock.webp",
    "images/smallRock.webp",
    "images/red.webp",
    "images/purple.webp",
    "images/healingBossProjectile.webp",
    "images/healingBossProjectile.webp",
    "images/engineerBullet.webp",
    "images/enemyBomb.webp",
    "images/farmerBullet.webp",
    "images/farmerBossCowBullet.webp",
    "images/weakenBullet.webp",
];
let enemyBulletImages = enemyBulletPaths.map(src => {
    let img = new Image();
    img.src = src;
    return img;
});

const collectablePaths = [
    "images/xpBag.webp",
    "images/healthPotion.webp",
];
let collectableImages = collectablePaths.map(src => {
    let img = new Image();
    img.src = src;
    return img;
});

const otherImagePaths = {
    zombieEnemyDead: "images/zombieEnemyDead.webp",
    playerBombExploded: "images/explosion.webp",
    rotatedShield: "images/shieldRotated.webp",
    enemyShield: "images/shield.webp",
    poisonBombExploded: "images/poisonCloud.webp",
    blackHoleBackground: "images/spiral.webp",
    mimicEnemyDead: "images/mimicEnemyDead.webp",
    enemyWall: "images/enemyWall.webp",
    frostAura: "images/frostAura.webp",
    spawnerUpgrade: "images/spawnerUpgrade.webp",
    spawner: "images/spawner.webp",
    spawnPortal: "images/spawnPortal.webp",
    smoke: "images/smoke.webp",
    bouncyMinion: "images/bouncyMinion.webp",
    mageRockMode: "images/mageRockMode.webp",
    mageWaterMode: "images/mageWaterMode.webp",
    bulletHellBossEnraged: "images/bulletHellBossEnraged.webp",
    snakeBossSegment: "images/snakeBody.webp",
    healerBossHealing: "images/healingBossHeal.webp",
    healAura: "images/healAura.webp",
    sentryEngineerEnemy: "images/sentryEngineerEnemy.webp",
    bombEngineerEnemy: "images/bombEngineerEnemy.webp",
    laserEngineerEnemy: "images/laserEngineerEnemy.webp",
    iceEngineerEnemy: "images/iceEngineerEnemy.webp",
    farmerBossCow: "images/farmerBossCow.webp",
    mageWindMode: "images/playerWind.webp",
    mageIceMode: "images/playerIceBullet.webp",
    tankPlayerMirrored: "images/tankPlayerMirrored.webp",
    pheonixPlayerIcon: "images/pheonixPlayer.webp",
    timeStopIcon: "images/timeStopIcon.webp",
    nukeIcon: "images/playerNuke.webp",
    strengthPotion:"images/strengthPotion.webp",
};

let otherImages = Object.fromEntries(
    Object.entries(otherImagePaths).map(([key, src]) => {
        const img = new Image();
        img.src = src;
        return [key, img];
    })
);
const statusEffectPaths = {
    slow: "images/slowed.webp",
    weaken: "images/weakened.webp",
    strength: "images/strength.webp",
    invincibility: "images/invincibility.webp",
    speed: "images/speed.webp",
};

let statusEffectImages = Object.fromEntries(
    Object.entries(statusEffectPaths).map(([key, src]) => {
        const img = new Image();
        img.src = src;
        return [key, img];
    })
);

const abilityIconPaths = [
    "images/bomb.webp", "images/green.webp", "images/blue.webp", "images/playerFire.webp", "images/necromancerPlayer.webp", "images/red.webp",
];
let abilityIconImages = abilityIconPaths.map(src => {
    let img = new Image();
    img.src = src;
    return img;
});


const bossPaths = [
    "images/laserBoss.webp",
    "images/iceBoss.webp",
    "images/bouncyBoss.webp",
    "images/mageFireMode.webp",
    "images/bulletHellBoss.webp",
    "images/gambleBoss.webp",
    "images/snakeBoss.webp",
    "images/healingBoss.webp",
    "images/engineerBoss.webp",
    "images/farmerBoss.webp",
    "images/weakenBoss.webp",
];
let bossImages = bossPaths.map(src => {
    let img = new Image();
    img.src = src;
    return img;
});
const playerPaths = [
    "images/player.webp", "images/tankPlayer.webp", "images/healerPlayer.webp", "images/magePlayer.webp", "images/necromancerPlayer.webp", "images/pheonixPlayer.webp"
];
let playerImages = playerPaths.map(src => {
    let img = new Image();
    img.src = src;
    return img;
});

function createListeners() {
    if (!socket.hasListeners("stateUpdate")) {
        window.socket = socket;
        socket.on("connect", () => {
            console.log("Connected to multiplayer ", socket.id);
        });

        socket.on("stateUpdate", (newState) => {
            serverState = newState;
            if (serverState.currentPage === "gamePage") {
                hasReadiedUp = false;
            }
        });
        socket.on("gameStarted", () => {
            console.log("start")
            ChangePage("gamePage", false);
            requestAnimationFrame(multiplayerDraw);
        });
        socket.on("gameOver", () => {
            socket.disconnect();
            socket = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ChangePage("losePage", false);
        });

        socket.on("gameWin", () => {
            socket.disconnect();
            socket = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ChangePage("winPage", false);
        });
        socket.on("updatePlayerCount", (playerCount) => {
            document.getElementById("coopPlayerText").textContent = "Players: " + playerCount;
        });
    }
}
function startMultiplayer() {
    socket.emit("startLobby", result => {
        if (!result.ok) document.getElementById("coopCodeText").textContent = result.error;
    });
}
function multiplayerDraw() {
    if (socket == null) return;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let cameraX = 0;
    let cameraY = 0;
    ctx.save();
    if (serverState.players[socket.id]) {
        cameraX = (2000 / 2) - serverState.players[socket.id].x - 200;
        cameraY = (1100 / 2) - serverState.players[socket.id].y - 100;
    }
    if(serverState.deadPlayers[socket.id] && Object.keys(serverState.players).length>0){
        canvas.style.filter = "grayscale(40%) brightness(0.8)";
        for(let id in serverState.players){
            cameraX = (2000 / 2) - serverState.players[id].x - 200;
            cameraY = (1100 / 2) - serverState.players[id].y - 100;
        }
    }
    else{
        canvas.style.filter ="none";
    }
    ctx.translate(cameraX, cameraY);
    if (serverState.players[socket.id] && serverState.players[socket.id].statusEffects.speed > 0) {
        ctx.drawImage(timeWarpBackground, -50, -50, 2000 + 100, 1100 + 100);
    }
    else ctx.drawImage(backgroundImage, -50, -50, 2000 + 100, 1100 + 100);

    let collectables = serverState.collectables || [];
    for (let i = 0; i < collectables.length; i++) {
        drawCollectable(collectables[i], collectableImages[collectables[i].index]);
    }
    let bullets = serverState.bullets || [];
    drawBullets(bullets);
    let enemyBullets = serverState.enemyBullets || [];
    drawEnemyBullets(enemyBullets)
    for (let id in serverState.players) {
        let currentPlayer = serverState.players[id];
        if (currentPlayer.index == 1 && currentPlayer.inputs.right) {
            drawPlayer(currentPlayer, otherImages.tankPlayerMirrored);
        }
        else {
            drawPlayer(currentPlayer, playerImages[currentPlayer.index]);
        }
    }
    let enemies = serverState.enemies || [];
    drawEnemies(enemies)
    let floatingObjects = serverState.floatingObjects || [];
    for (let i = floatingObjects.length - 1; i >= 0; i--) {
        ctx.save();
        if (floatingObjects[i].content == "special") {
            ctx.drawImage(otherImages.spawnerUpgrade, floatingObjects[i].x - floatingObjects[i].width / 2, floatingObjects[i].y - floatingObjects[i].height / 2, floatingObjects[i].width, floatingObjects[i].height);
        }
        else {
            ctx.font = `${30}px Times New Roman`
            ctx.fillStyle = floatingObjects[i].color;
            ctx.fillText(floatingObjects[i].content, floatingObjects[i].x, floatingObjects[i].y);
        }


        ctx.restore();
    }

    let mapObjects = serverState.mapObjects || [];
    for (let i = mapObjects.length - 1; i >= 0; i--) {
        drawWall(mapObjects[i]);

    }

    ctx.restore();
    let barSlot = 0;
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].isBoss) {
            let state = bossBarState.get(enemies[i].id);
            const desiredLength = enemies[i].maxHealth > 0
                ? (enemies[i].health / enemies[i].maxHealth) * 600
                : 0;

            if (!state) {
                state = { currentLength: desiredLength };
                bossBarState.set(enemies[i].id, state);
            }
            if (desiredLength < state.currentLength) {
                state.currentLength -= 8;
                if (state.currentLength < desiredLength) state.currentLength = desiredLength;
            }
            else if (desiredLength > state.currentLength) {
                state.currentLength += 8;
                if (state.currentLength > desiredLength) state.currentLength = desiredLength;
            }

            const barY = 50 + barSlot * 75;
            barSlot++;

            ctx.fillStyle = "red";
            ctx.fillRect(500, barY, 600, 30);
            ctx.fillStyle = "green";
            ctx.fillRect(500, barY, state.currentLength, 30);

            ctx.save();
            ctx.font = "40px Black Ops One";
            ctx.fillStyle = "red";
            ctx.textAlign = 'center';
            let title = enemies[i].title || (enemies[i].bossBar && enemies[i].bossBar.title) || "";
            ctx.fillText(title, 800, barY - 10);
            ctx.restore();
        }
    }
    if (serverState.players[socket.id]) {
        drawPlayerInfo(serverState.players[socket.id]);
    }
    if(serverState.deadPlayers[socket.id]){
        ctx.fillStyle = "black";
        ctx.font = "30px Black Ops One";
        ctx.fillText("You died :( You will be revived next wave.", 500, 100);
    }
    if (serverState.players[socket.id]) {
        let player = serverState.players[socket.id]
        healthBarDesiredLength = (player.health / player.maxHealth) * 400

        if (healthBarDesiredLength < healthBarCurrentLength) {
            healthBarCurrentLength -= 8;
            if (healthBarCurrentLength < healthBarDesiredLength) {
                healthBarCurrentLength = healthBarDesiredLength;
            }
        }
        else if (healthBarDesiredLength > healthBarCurrentLength) {
            healthBarCurrentLength += 8;
            if (healthBarCurrentLength > healthBarDesiredLength) {
                healthBarCurrentLength = healthBarDesiredLength;
            }
        }
        ctx.fillStyle = "red";
        ctx.fillRect(10, 60, 400, 30);
        if (player.rebirth > 0) ctx.fillStyle = "purple";
        else ctx.fillStyle = "green"
        ctx.fillRect(10, 60, healthBarCurrentLength, 30);
        if (player.statusEffects.invincibility > 0) {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.fillRect(10, 60, player.statusEffects.invincibility / 300 * 400, 30);
            ctx.strokeRect(10, 60, player.statusEffects.invincibility / 300 * 400, 30);
        }

        levelBarDesiredLength = (serverState.sharedXP / serverState.nextLevel) * 400
        //console.log(levelBarDesiredLength)
        if (levelBarDesiredLength < levelBarCurrentLength) {
            levelBarCurrentLength -= 8;
            if (levelBarCurrentLength < levelBarDesiredLength) {
                levelBarCurrentLength = levelBarDesiredLength;
            }
        }
        else if (levelBarDesiredLength > levelBarCurrentLength) {
            levelBarCurrentLength += 8;
            if (levelBarCurrentLength > levelBarDesiredLength) {
                levelBarCurrentLength = levelBarDesiredLength;
            }
        }
        ctx.fillStyle = "black";
        ctx.fillRect(10, 100, 400, 30);
        ctx.fillStyle = "yellow"
        if (serverState.currentPage !== "upgradePage") {
            ctx.fillRect(10, 100, levelBarCurrentLength, 30);
        }
        else {
            ctx.fillRect(10, 100, 400, 30);
        }
        if (player.shieldMaxHealth > 0) {
            shieldBarDesiredLength = (player.shieldHealth / player.shieldMaxHealth) * 400
            if (shieldBarDesiredLength < shieldBarCurrentLength) {
                shieldBarCurrentLength -= 8;
                if (shieldBarCurrentLength > shieldBarDesiredLength) {
                    shieldBarCurrentLength = shieldBarDesiredLength;
                }
            }
            else if (shieldBarDesiredLength > shieldBarCurrentLength) {
                shieldBarCurrentLength += 8;
                if (shieldBarCurrentLength < shieldBarDesiredLength) {
                    shieldBarCurrentLength = shieldBarDesiredLength;
                }
            }
            ctx.fillStyle = "gray"
            ctx.fillRect(10, 60, shieldBarCurrentLength, 30);
        }

    }
    if (serverState.waveText) {
        drawWaveText(serverState.waveText);
    }
    ctx.restore();
    //console.log(serverState.currentPage);
    if (serverState.currentPage !== "upgradePage") {
        //console.log("ready")
        hasReadiedUp = false;
        requestAnimationFrame(multiplayerDraw);
    }
    else if(serverState.players[socket.id]) {
        if (hasReadiedUp) {
            isLevelling = false;
            ctx.fillStyle = "black";
            ctx.font = "30px Black Ops One";
            ctx.fillText("Waiting for other players to upgrade...", 500, 300);
            requestAnimationFrame(multiplayerDraw);
        }
        else {
            ChangePage("upgradePage", false, serverState.players[socket.id]);
        }
    }
}
function changeMultiplayerPage(page) {
    if (socket) {
        hasReadiedUp = true;
        socket.emit("readyUp", socket.id)
        if (choice1) choice1.innerHTML = "";
        if (choice2) choice2.innerHTML = "";
        if (choice3) choice3.innerHTML = "";

        multiplayerDraw();
    }
}
document.addEventListener('keydown', (e) => {
    if (!socket) return;
    let key = e.key;
    if (key == controls["up"]) {
        socket.emit('input', { key: 'up', state: true });
    }
    if (key == controls["left"]) {
        socket.emit('input', { key: 'left', state: true });
    }
    if (key == controls["right"]) {
        socket.emit('input', { key: 'right', state: true });
    }
    if (key == controls["down"]) {
        socket.emit('input', { key: 'down', state: true });
    }
    if (key == controls["ability1"]) {
        socket.emit('input', { key: 'ability1', state: true });
    }
    if (key == controls["ability2"]) {
        socket.emit('input', { key: 'ability2', state: true });
    }
    if (key == controls["ability3"]) {
        socket.emit('input', { key: 'ability3', state: true });
    }
    if (key == controls["ability4"]) {
        socket.emit('input', { key: 'ability4', state: true });
    }
    if (key == controls["ability5"]) {
        socket.emit('input', { key: 'ability5', state: true });
    }
    if (key == controls["levelUp"]) {
        socket.emit('input', { key: 'gainXP', state: true });
    }
    if (key == controls["skipWave"]) {
        socket.emit('input', { key: 'skipWave', state: true });
    }
    if (key == controls["dealDamage"]) {
        socket.emit('input', { key: 'dealDamage', state: true });
    }
});

document.addEventListener('keyup', (e) => {
    if (!socket) return;
    let key = e.key;
    if (key == controls["up"]) {
        socket.emit('input', { key: 'up', state: false });
    }
    if (key == controls["left"]) {
        socket.emit('input', { key: 'left', state: false });
    }
    if (key == controls["right"]) {
        socket.emit('input', { key: 'right', state: false });
    }
    if (key == controls["down"]) {
        socket.emit('input', { key: 'down', state: false });
    }
    if (key == controls["ability1"]) {
        socket.emit('input', { key: 'ability1', state: false });
    }
    if (key == controls["ability2"]) {
        socket.emit('input', { key: 'ability2', state: false });
    }
    if (key == controls["ability3"]) {
        socket.emit('input', { key: 'ability3', state: false });
    }
    if (key == controls["ability4"]) {
        socket.emit('input', { key: 'ability4', state: false });
    }
    if (key == controls["ability5"]) {
        socket.emit('input', { key: 'ability5', state: false });
    }
    if (key == controls["levelUp"]) {
        socket.emit('input', { key: 'gainXP', state: false });
    }
    if (key == controls["skipWave"]) {
        socket.emit('input', { key: 'skipWave', state: false });
    }
    if (key == controls["dealDamage"]) {
        socket.emit('input', { key: 'dealDamage', state: false });
    }
});

function checkRoom() {
    let code = document.getElementById("roomCode");
    let button = document.getElementById("roomCodeButton");
    let output = document.getElementById("output");
    if (!socket) { output.textContent = "Not connected"; return; }
    else {
        socket.emit('checkLobby', code.value.toUpperCase().trim(), result => {
            if (!result.exists) output.textContent = "No lobby with that code";
            else if (result.started) output.textContent = "Game already started";
            else {
                ChangePage("characterSelectionPage", false);
                createListeners();
                roomCode = code;
                gamemode = 100;
                createdRoom = false;
            }
        });

    }
}
function connectSocket() {
    if (!socket) {
        socket = io(SERVER_URL, { transports: ["websocket"] });
        window.socket = socket;
    }
    createListeners();
}
function joinRoom(code) {
    connectSocket();
    socket.emit('joinLobby', code.value.toUpperCase().trim(), chosenCharacter, result => {

    });
    document.getElementById("coopCodeText").textContent = "Code: " + code.value.toUpperCase().trim();
    document.getElementById("coopStartButton").disabled = true;
}
function createRoom() {
    connectSocket();
    let code = "";
    if (!socket) { output.textContent = "Not connected"; return; }
    else {
        socket.emit('createLobby', difficulty, chosenCharacter, result => {
            if (!result.ok) document.getElementById("coopCodeText").textContent = "ERROR";
            else {
                document.getElementById("coopCodeText").textContent = "Code: " + result.code;
                document.getElementById("coopPlayerText").textContent = "Players: 1"
                roomCode = result.code;
                createdRoom = true;
            }
        });

    }

}