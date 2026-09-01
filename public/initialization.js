

let enemies = [];
let bullets = [];
let enemyBullets = [];
let collectables = [];
let protectorBullets = [];
let newEnemyQueue = [];
let isPlayerUnlocked = [];
let floatingObjects = [];
let playerAbilities = [];
let mapObjects = [];
let xpBagSpawnTimer = 0;
let healthPotionSpawnTimer = 0;
let waveTimer = 0;
let isBossWave = false;
let movingLeft, movingRight, movingUp, movingDown = false;
let page = "gamePage";
let healthBar, levellingBar, bossBars, boss, waveText, background, gambleText, choice1, choice2, choice3, shieldBarShield;
let xpBagTimer = Math.random() * 200 + 200;
let timeElapsed = 0;
let mouseX = 0;
let mouseY = 0;
let currentWave = 0;
let SCALE = 0.001;
let continueFlag = false;
let speedMultiplier = 0;
let upgradingEnemy = false;
let controls = { left: "a", up: "w", right: "d", down: "s", ability1: "q", ability2: "e", ability3: "r", ability4: "f", ability5: "t", levelUp: "N/A", skipWave: "N/A", dealDamage: "N/A" };
let controlBeingToggled = "";
let enemyHealthMultiplier=1;
let enemySpeedMultiplier=1;
const NUMTIER2UPGRADES = 10;
const NUMENEMYUPGRADES = 8;
let boughtTier2Upgrades = new Array(NUMTIER2UPGRADES);
for (let i = 0; i < boughtTier2Upgrades.length; i++) {
    boughtTier2Upgrades[i] = 0;
}
let UPGRADES = [
    { onclick: (player) => increaseDamage(0.5, player), text: "+0.5 Damage" },
    { onclick: (player) => increaseMaxHealth(10, player), text: "+10 Max Health" },
    { onclick: (player) => increaseProjectiles(2, player), text: "+2 Projectiles" },
    { onclick: (player) => addFrostProjectiles(1, player), text: "+1 Frost Projectile" },
    { onclick: (player) => addLaserProjectiles(1, player), text: "Laser Attack" },
    { onclick: (player) => speedUpAttacks(1.2, player), text: "Faster Attack Speed" },
    { onclick: (player) => addSiphon(0.25, player), text: "+0.25 Lifesteal" },
    { onclick: (player) => multiplyXPGain(1.5, player), text: "x1.5 XP gain" },
    { onclick: (player) => addBomb(1, player), text: "Bomb Ability" },
    { onclick: (player) => addTimeWarp(1, player), text: "Speed Burst Ability" },
    { onclick: (player) => AddPassiveHealing(1, player), text: "+1 Passive Healing" },
    { onclick: (player) => Gamble(1, player), text: "Mystery Box" },
    { onclick: (player) => AddProtectorBullet(2, player), text: "+2 Protectors" },
    { onclick: (player) => TradeoffDeal(2, player), text: "x2 Damage but x2 Damage Taken" },
    { onclick: (player) => AddShield(1, player), text: "Gain 50hp Shield" },
    { onclick: (player) => BulletDeleterAbility(1, player), text: "Bullet Wipe Ability" },
    { onclick: (player) => IncreaseProjectileSize(1.5, player), text: "Increase Projectile Size" },
    { onclick: (player) => MakeIceBulletsPierce(player), text: "Frost Bullets Pierce Through Enemies" },
    { onclick: (player) => IncreaseFireDamage(0.25, player), text: "+0.25 Fire Damage" },
    { onclick: (player) => PassiveSpawns(player), text: "Passively Spawn Souls" },
    { onclick: (player) => IncreaseTornadoDamage(1, player), text: "+1 Tornado Damage" },
    { onclick: (player) => AddSpeed(2, player), text: "Increase Movement Speed" },
    { onclick: (player) => IncreaseSlowedDamage(1.5, player), text: "Slowed Enemies Take 1.5x Damage" },
    { onclick: (player) => IncreaseBombDamage(4, player), text: "+4 Bomb Damage" },
    { onclick: (player) => IncreaseLaserDamage(0.5, player), text: "+0.5 Laser Damage" },
    { onclick: (player) => AddTimeStop(player), text: "Speed Burst -> Time Stop" },
    { onclick: (player) => AddBouncingProjectile(1, player), text: "+1 Bouncing Bullet" },
    { onclick: (player) => IncreaseProtectorDamage(1, player), text: "+1 Protector Damage" },
    { onclick: (player) => IncreaseBouncingBulletDamage(1, player), text: "+1 Bouncing Bullet Damage" },

];
const NUMUPGRADES = UPGRADES.length;
let boughtUpgrades = new Array(NUMUPGRADES);
for (let i = 0; i < boughtUpgrades.length; i++) {
    boughtUpgrades[i] = 0;
}
let TIER2UPGRADES = [
    { onclick: (player) => increaseDamage(1, player), text: "+1 Damage" },
    { onclick: (player) => increaseMaxHealth(20, player), text: "+20 Max Health" },
    { onclick: (player) => increaseProjectiles(4, player), text: "+4 Projectiles" },
    { onclick: (player) => HalveCollisionDamage(0.5, player), text: "Enemy Collisions Deal 0.5x Damage" },
    { onclick: (player) => addSiphon(0.5, player), text: "+0.5 Lifesteal" },
    { onclick: (player) => IncreaseHealthPotionDensity(0.5, player), text: "2x Health Potion Spawn Rate" },
    { onclick: (player) => AddShockwave(player), text: "Shockwave Ability" },
    { onclick: (player) => AddRebirth(1, player), text: "Rebirth On Death" },
    { onclick: (player) => AddWindAttack(2, player), text: "+2 Tornado Projectiles" },
    { onclick: (player) => AddNuke(player), text: "Bomb attack -> Nuke Attack" },
]
let ENEMYUPGRADES = [
    { onclick: "IncreaseEnemyHealth(1.5)", text: "Healthier Enemies" },
    { onclick: "IncreaseEnemySpeed(1.5)", text: "Faster Enemies" },
    { onclick: "SpawnBoss()", text: "Spawn a Random Boss with half HP" },
    { onclick: "HalveMaxHealth()", text: "Player Healing and Max Health Both Get Halved" },
    { onclick: "SlowPlayer()", text: "Player is Slowed Until Next Wave" },
    { onclick: "RemoveHealing()", text: "No Healing" },
    { onclick: "AddConstantDamage()", text: "Player Takes 1 Damage every 4 Seconds" },
    { onclick: "IncreaseScale(2)", text: "Next Wave has 2x More Enemies" },
]
const RESTRICTEDUPGRADES = [17, 18, 19, 20, 22, 23, 24, 25, 27, 28]
const RESTRICTEDTIER2UPGRADES = [9];
let timeWarpCounter = 0;
let gambleTimer = 0;
let gambleChoice = 0;
let textSpeed = 5;
let bossesLeft = 0;
let gameOver = false;
let accumulator = 0;
const frameRate = 1 / 61;
let lastTime = Date.now();
let difficulty = 0;
let scaleMultiplier = 0;
let bossMultiplier = 0;
let originalScale = 0;
let isUnlockingCharacter = false;
let chosenCharacter = 0;
let images = {};
let doneLoading = false;
let showHealthBars = true;
let killedBoss = false;
let isLevelling = false;
let currentPage = "";
let healthPotionSpawnMultiplier = 1;
let mapType = 2;
let gamemode = 0;
let topBorder, bottomBorder, leftBorder, rightBorder, initialTopBorder, initialBottomBorder, initialLeftBorder, initialRightBorder;
let enableShrinking = false;
let tiles = [];
let visited = [];
let gameState;
let createdRoom = true;
let roomCode = "";
//higher number = higher difficulty
function SetDifficulty(d) {
    difficulty = d;
    ChangePage("characterSelectionPage");
}
function SelectCharacter(character) {
    chosenCharacter = character;
    let descriptionText = document.getElementById("descriptionText");
    list = document.querySelectorAll('[id$="Player"]');
    for (let i = 0; i < list.length; i++) {
        list[i].style.border = "";
    }
    switch (chosenCharacter) {
        case 1:
            descriptionText.innerText = "The basic character. He is the chosen one (as in he got chosen when I randomly clicked on one of my screenshots for a placeholder image)."
            document.getElementById("basicPlayer").style.border = "5px solid red";
            break;
        case 2:
            if (TankPlayer.unlocked) {
                descriptionText.innerText = "Has high health but is really slow and attacks slowly. Gains a slightly weaker shield every 30 seconds. Spammable meatshield (wait, wrong game)."
            }
            else {
                descriptionText.innerText = "LOCKED"
            }
            document.getElementById("tankPlayer").style.border = "5px solid red";
            break;
        case 3:
            if (HealerPlayer.unlocked) {
                descriptionText.innerText = "Starts with passive healing and Lifesteal. Gets 2x healing from all sources. Is not the impostor."

            }
            else {
                descriptionText.innerText = "LOCKED"
            }
            document.getElementById("healerPlayer").style.border = "5px solid red";
            break;
        case 4:
            if (MagePlayer.unlocked) {
                descriptionText.innerText = "The boss when you unlock him as a playable character. Has an active ability to switch between three elements: Fire, Ice, and Wind."

            }
            else {
                descriptionText.innerText = "LOCKED"
            }
            document.getElementById("magePlayer").style.border = "5px solid red";
            break;
        case 5:
            if (NecromancerPlayer.unlocked) {
                descriptionText2.innerText = "Spawns the souls of slain enemies. These souls will go towards the nearest enemy and collide with them. No they do not inheit the abilities of the enemy they came from that would be too much effort"

            }
            else {
                descriptionText2.innerText = "LOCKED"
            }
            document.getElementById("necromancerPlayer").style.border = "5px solid red";
            break;
        case 6:
            if (PheonixPlayer.unlocked) {
                descriptionText2.innerText = "Has low health but gains 1 rebirth every level. Max health cannot be increased in any way."

            }
            else {
                descriptionText2.innerText = "LOCKED"
            }
            document.getElementById("pheonixPlayer").style.border = "5px solid red";
            break;
    }
    document.getElementById("startButton").disabled = false;
    document.getElementById("startButton2").disabled = false;
}
function SelectMode(mode) {
    gamemode = mode;
    if (mode == 0) {
        difficulty = 1;
        chosenCharacter = 1;
        Commence();
    }
    else if (mode == 1) {
        ChangePage("difficultyPage", false);
    }
    else if (mode == 100) {
        ChangePage("difficultyPage", false);
    }
    else {

        gamemodes = document.querySelectorAll('[id$="gamemodeSelectionButton"]');
        for (let i = 0; i < gamemodes.length; i++) {
            gamemodes[i].style.border = "";
        }
        switch (mode) {
            case 2:
                document.getElementById("gamemodeDescriptionText").innerText = "The map border is large, but shrinks as the wave goes on."
                break;
            case 3:
                document.getElementById("gamemodeDescriptionText").innerText = "Three types of harmful terrain are added: Water, Magma, Lava. There is also a rare terrain that heals the player. Terrain generates using the Temu Perlin Noise Algorithm™"
                break;
            case 4:
                document.getElementById("gamemodeDescriptionText").innerText = "Upgrades that provide healing are disabled. XP gain is disabled. The player gains a set amount of levels every wave that decreases over time."
                break;
            case 5:
                document.getElementById("gamemodeDescriptionText").innerText = "Every wave, pick between two negative effects. The player's max health is doubled."
                break;
            case 6:
                document.getElementById("gamemodeDescriptionText").innerText = "Waves consist of only bosses. If you don't kill them fast enough, the next wave will spawn."
                break;
        }
        if (mode < 100) gamemodes[mode - 2].style.border = "5px solid red";
        document.getElementById("difficultyConfirmationButton").disabled = false;

    }
}
function loadImage(image) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`${image} Failed`));
        img.src = image;
    })
}
async function preloadImages() {
    let keys = Object.keys(imageSources);
    let loaded = await Promise.all(keys.map(key => loadImage(imageSources[key])));
    //console.log(keys+" "+loaded);
    images = Object.fromEntries(keys.map((key, i) => [key, loaded[i]]));
    doneLoading = true;
    return;
}
async function Commence() {
    list = document.querySelectorAll('div[id$="Page"]');
    for (let i = 0; i < list.length; i++) {
        list[i].style.display = "none";
    }
    for (let i = 0; i < boughtUpgrades.length; i++) {
        boughtUpgrades[i] = 0;
    }
    for (let i = 0; i < RESTRICTEDUPGRADES.length; i++) {
        boughtUpgrades[RESTRICTEDUPGRADES[i]] = 1;
    }
    for (let i = 0; i < RESTRICTEDTIER2UPGRADES.length; i++) {
        boughtTier2Upgrades[RESTRICTEDTIER2UPGRADES[i]] = 1;
    }
    //document.querySelectorAll('img').forEach(img => img.remove());
    document.getElementById("loadingPage").style.display = "block";
    Start();
    if (gamemode != 0) await delay(0.1);
    document.getElementById("loadingPage").style.display = "none";
    document.getElementById("gamePage").style.display = "block";
    if (gamemode != 100) loop();
}
function Start() {
    if (gamemode == 100) {
        ChangePage("coopWaitingPage", false);
        if (createdRoom) createRoom();
        else {
            joinRoom(roomCode);
        }
        return;
    }
    gameOver = false;
    gameState = {
        players: {},
        bullets: [],
        enemies: [],
        floatingObjects: [],
        enemyBullets: [],
        abilityIcons: [],
        mapObjects: [],
        collectables: [],
        bossBars: [],
        protectorBullets: [],
        SCALE: 0.0012,
        timeElapsed: 0,
        sharedXP: 0,
        nextLevel: 100,
        playerLevel: 1,
        currentPage: "gamePage",
        spawnCooldowns: new Array(ENEMYTYPES.length),
        readyCount: 0,
        waveText: new WaveText(),
        currentWave: 1,
        xpBagTimer: 0,
        healthPotionSpawnTimer: 0,
        bossesLeft: 0,
        isBossWave: false,
        scaleMultiplier: 1,
        bossMultiplier: 1,
        waveTimer: 2000,
    };

    healthPotionSpawnTimer = Math.random() * 600 + 700;
    xpBagTimer = Math.random() * 200 + 200;
    timeElapsed = 0;
    waveTimer = 2000;
    currentWave = 1;
    SCALE = 0.0012;
    enemies = [];
    bullets = [];
    enemyBullets = [];
    collectables = [];
    protectorBullets = [];
    bossBars = [];
    newEnemyQueue = [];
    floatingObjects = [];
    playerAbilities = [];
    mapObjects = [];
    tiles = [];
    visited = [];
    // healthBar=new HealthBar();
    // levellingBar=new LevellingBar();
    //waveText=new WaveText();
    movingLeft = false;
    movingUp = false;
    movingRight = false;
    movingDown = false;
    isBossWave = false;
    isUnlockingCharacter = false;
    shieldBar = null;
    timeWarpCounter = -1;
    healthPotionSpawnMultiplier = 1;
    speedMultiplier = 0;
    upgradingEnemy = false;
    movingLeft, movingRight, movingUp, movingDown = false;
    isLevelling = false;
    killedBoss = false;
    enableShrinking = false;
    page = "gamePage";
    BombIcon.version = 0;
    TimeWarpIcon.version = 0;
    enemyHealthMultiplier=1;
    enemySpeedMultiplier=1;

    background = new Image();
    background.src = 'images/background.webp';
    canvas.style.display = "block";

    lastTime = Date.now();
    switch (chosenCharacter) {
        case 1: player = new BasicPlayer(10); break;
        case 2: player = new TankPlayer(35); break;
        case 3: player = new HealerPlayer(12); break;
        case 4: player = new MagePlayer(10, gameState.abilityIcons); break;
        case 5: player = new NecromancerPlayer(10, gameState.abilityIcons); break;
        case 6: player = new PheonixPlayer(6); break;
    }
    if (difficulty == 1) {
        gameState.scaleMultiplier = 0.5;
        gameState.bossMultiplier = 0.5;
        player.health = Math.ceil(player.health * 1.8);
        player.maxHealth = player.health;
    }
    else if (difficulty == 2) {
        gameState.scaleMultiplier = 0.75;
        gameState.bossMultiplier = 0.75;
        player.health = Math.ceil(player.health * 1.4);
        player.maxHealth = player.health;
    }
    else if (difficulty == 3) {
        gameState.scaleMultiplier = 1;
        gameState.bossMultiplier = 1;
    }
    else {
        gameState.scaleMultiplier = 2;
        gameState.bossMultiplier = 2;
    }
    SCALE *= gameState.scaleMultiplier

    switch (gamemode) {
        case 0:
            if (!document.getElementById("tutorialText")) {
                new TutorialText(50);
            }
            else {
                document.getElementById("tutorialText").textContent = "\(Fullscreen encouraged, press escape to go back\)"
                TutorialText.index = -1;
                TutorialText.fadeTimer = 0;
                TutorialText.timer = 0;
                TutorialText.canChangeWave = false;
            }
            mapType = 1;
            break;
        case 1:
            mapType = 1;
            break;
        case 2:
            mapType = 2;
            break;
        case 3:
            mapType = 1;
            break;
        case 4:
            mapType = 1;
            gameState.currentWave = 2;
            player.boughtUpgrades[1] = 1;
            player.boughtUpgrades[6] = 1;
            player.boughtUpgrades[7] = 1;
            player.boughtUpgrades[10] = 1;
            player.boughtUpgrades[11] = 1;
            boughtTier2Upgrades[4] = 1;
            boughtTier2Upgrades[5] = 1;
            break;
        case 5:
            mapType = 1;
            player.health *= 2;
            player.maxHealth *= 2;
            new ModifierText();
            break;
        case 6:
            mapType = 1;
            waveTimer = 3000;
            boughtUpgrades[7] = 1;
            break;
    }
    if (mapType == 1) {
        mapBorders.topBorder = 0;
        mapBorders.leftBorder = 0;
        mapBorders.rightBorder = 2000;
        mapBorders.bottomBorder = 1100;
    }
    else if (mapType == 2) {
        mapBorders.topBorder = -1100 / 4;
        mapBorders.leftBorder = -2000 / 4;
        mapBorders.rightBorder = 2000 * 1.25;
        mapBorders.bottomBorder = 1100 * 1.25;
        enableShrinking = true;

    }
    player.orignalMaxHealth = player.maxHealth
    if (gamemode == 3) {
        CreateTiles();
    }
    gameState.mapObjects.push(new Wall(-55 + mapBorders.leftBorder, -55 + mapBorders.topBorder, (mapBorders.rightBorder - mapBorders.leftBorder) + 110, 30));
    gameState.mapObjects.push(new Wall(-25 + mapBorders.leftBorder, mapBorders.bottomBorder + 25, (mapBorders.rightBorder - mapBorders.leftBorder) + 80, 30));
    gameState.mapObjects.push(new Wall(-55 + mapBorders.leftBorder, -25 + mapBorders.topBorder, 30, (mapBorders.bottomBorder - mapBorders.topBorder) + 80));
    gameState.mapObjects.push(new Wall(mapBorders.rightBorder + 25, -25 + mapBorders.topBorder, 30, (mapBorders.bottomBorder - mapBorders.topBorder) + 70));
    initialLeftBorder = mapBorders.leftBorder;
    initialRightBorder = mapBorders.rightBorder;
    initialTopBorder = mapBorders.topBorder;
    initialBottomBorder = mapBorders.bottomBorder;
    InitializeStats();
    if (gamemode == 0) {
        DisableAllEnemies();
        BasicEnemy.isActive = true;
    }
    else if (gamemode == 4) {
        [gameState.isBossWave, gameState.bossesLeft, gameState.currentWave, gameState.SCALE] = ChangeWave(gameState);
    }
    else if (gamemode == 6) {
        RandomizeEnemies(0, 0, 0, 1, 0, gameState.enemies, gameState.bossBars, gameState.bossMultiplier);
    }
    else {
        RandomizeEnemies(2, 0, 0, 0, 0);
    }
    ctx.clearRect(0, 0, 2000, 1100);
    currentPage = "gamePage";

}
function CreateTiles() {
    let sizeX = (mapBorders.rightBorder - mapBorders.leftBorder) / 50 + 1
    let sizeY = (mapBorders.bottomBorder - mapBorders.topBorder) / 50 + 1
    let randomNums = [];
    let temperatures = [];
    for (let i = 0; i <= sizeX; i += 1) {
        tiles[i] = [];
        visited[i] = [];
        temperatures[i] = [];
        randomNums[i] = [];
        for (let j = 0; j <= sizeY; j += 1) {

            tiles[i][j] = -1;
            visited[i][j] = 0;
            randomNums[i][j] = Math.random() * 6 - 3;
            temperatures[i][j] = 0;
        }
    }
    for (let x = 0; x <= sizeX; x += 1) {
        for (let y = 0; y <= sizeY; y += 1) {
            let average = randomNums[x][y];
            let count = 1;
            if (x > 0) {
                average += randomNums[x - 1][y];
                count++;
            }
            if (x < tiles.length - 1) {
                average += randomNums[x + 1][y];
                count++;
            }
            if (y > 0) {
                average += randomNums[x][y - 1];
                count++;
            }
            if (y < tiles[0].length - 1) {
                average += randomNums[x][y + 1];
                count++;
            }
            if (x > 0 && y > 0) {
                average += randomNums[x - 1][y - 1];
                count++;
            }
            if (x < tiles.length - 1 && y > 0) {
                average += randomNums[x + 1][y - 1];
                count++;
            }
            if (x > 0 && y < tiles[0].length - 1) {
                average += randomNums[x - 1][y + 1];
                count++;
            }
            if (x < tiles.length - 1 && y < tiles[0].length - 1 && visited[x + 1][y + 1] == 1) {
                average += randomNums[x + 1][y + 1];
                count++;
            }
            average /= count;
            temperatures[x][y] = average;

        }
    }
    for (let x = 0; x <= sizeX; x += 1) {
        for (let y = 0; y <= sizeY; y += 1) {
            let average = temperatures[x][y];
            let count = 1;
            if (x > 0) {
                average += temperatures[x - 1][y];
                count++;
            }
            if (x < tiles.length - 1) {
                average += temperatures[x + 1][y];
                count++;
            }
            if (y > 0) {
                average += temperatures[x][y - 1];
                count++;
            }
            if (y < tiles[0].length - 1) {
                average += temperatures[x][y + 1];
                count++;
            }
            if (x > 0 && y > 0) {
                average += temperatures[x - 1][y - 1];
                count++;
            }
            if (x < tiles.length - 1 && y > 0) {
                average += temperatures[x + 1][y - 1];
                count++;
            }
            if (x > 0 && y < tiles[0].length - 1) {
                average += temperatures[x - 1][y + 1];
                count++;
            }
            if (x < tiles.length - 1 && y < tiles[0].length - 1) {
                average += temperatures[x + 1][y + 1];
                count++;
            }
            average /= count;
            randomNums[x][y] = average;

        }
    }
    for (let x = 0; x <= sizeX; x += 1) {
        for (let y = 0; y <= sizeY; y += 1) {
            let average = randomNums[x][y];
            let count = 1;
            if (x > 0) {
                average += randomNums[x - 1][y];
                count++;
            }
            if (x < tiles.length - 1) {
                average += randomNums[x + 1][y];
                count++;
            }
            if (y > 0 && visited[x][y - 1] == 1) {
                average += randomNums[x][y - 1];
                count++;
            }
            if (y < tiles[0].length - 1) {
                average += randomNums[x][y + 1];
                count++;
            }
            if (x > 0 && y > 0) {
                average += randomNums[x - 1][y - 1];
                count++;
            }
            if (x < tiles.length - 1 && y > 0) {
                average += randomNums[x + 1][y - 1];
                count++;
            }
            if (x > 0 && y < tiles[0].length - 1) {
                average += randomNums[x - 1][y + 1];
                count++;
            }
            if (x < tiles.length - 1 && y < tiles[0].length - 1) {
                average += randomNums[x + 1][y + 1];
                count++;
            }
            average /= count;
            temperatures[x][y] = average;

        }
    }
    //console.log(tiles);
    //InitializeTiles(Math.ceil(Math.random()*sizeX),Math.ceil(Math.random()*sizeY));
    for (let i = 0; i <= sizeX; i++) {
        for (let j = 0; j <= sizeY; j++) {
            if (temperatures[i][j] <= -0.5) {
                tiles[i][j] = 1;
            }
            else if (temperatures[i][j] >= 0.75) {
                tiles[i][j] = 3;
            }
            else if (temperatures[i][j] >= 0.5) {
                tiles[i][j] = 2;
            }
            else if (i > 0 && i < sizeX - 1 && j > 0 && j < sizeY - 1 && Math.abs(temperatures[i][j]) <= 0.005) {
                tiles[i][j] = 4;
            }
        }
    }
    let x = 0;
    let y = 0;
    for (let i = Math.floor(sizeX / 2) - 3; i <= Math.ceil(sizeX / 2) + 3; i += 1) {
        for (let j = Math.floor(sizeY / 2) - 3; j <= Math.ceil(sizeY / 2) + 3; j += 1) {
            tiles[i][j] = 0;
        }
    }
    for (let i = 0; i <= mapBorders.rightBorder - mapBorders.leftBorder; i += 50) {
        for (let j = 0; j <= mapBorders.bottomBorder - mapBorders.topBorder; j += 50) {
            if (x > 0 && x < sizeX && y > 0 && y < sizeY) {
                let commonTile = tiles[x - 1][y];
                //console.log(tiles[x][y]+" common: "+tiles[x-1][y]+" "+tiles[x+1][y]+" "+tiles[x][y+1]+" "+tiles[x][y-1])
                if (commonTile == tiles[x + 1][y] && commonTile == tiles[x][y - 1] && commonTile == tiles[x][y + 1]) {
                    tiles[x][y] = commonTile;
                }
            }
            switch (tiles[x][y]) {
                case 0:
                    break;
                case 1:
                    gameState.mapObjects.push(new WaterTerrain(i, j, 50, 50));
                    break;
                case 2:
                    gameState.mapObjects.push(new LavaTerrain(i, j, 50, 50, 1, "#D1290D", "#3c0b04"));
                    break;
                case 3:
                    gameState.mapObjects.push(new LavaTerrain(i, j, 50, 50, 2, "#410c0c", "#150401"));
                    break;
                case 4:
                    gameState.mapObjects.push(new HealTerrain(i, j, 50, 50, "#169848", "#0e4615"));
                    break;
            }
            //mapObjects.push(new TestTerrain(i,j,50,50,temperatures[x][y]))
            y++;
        }
        x++;
        y = 0;
    }
}
function CheckTile(x, y, counts, value) {
    if (x >= 0 && x < tiles.length && y >= 0 && y <= tiles[0].length && visited[x][y] == 1) {
        counts[tiles[x][y]] += value;
    }
    return counts;
}
function InitializeTiles(x, y) {
    visited[x][y] = 1;
    let weights = [1, 1, 1];
    let counts = [0, 0, 0];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (Math.abs(1) <= 1 && Math.abs(j) <= 1) {
                counts = CheckTile(x + i, y + j, counts, 1);
            }
            else {
                counts = CheckTile(x + i, y + j, counts, 0.25);
            }
        }
    }
    // if(x>0 && visited[x-1][y]==1){
    //     counts[tiles[x-1][y]]++;
    // }
    // if(x<tiles.length-1 && visited[x+1][y]==1){
    //     counts[tiles[x+1][y]]++;
    // }
    // if(y>0 && visited[x][y-1]==1){
    //     counts[tiles[x][y-1]]++;
    // }
    // if(y<tiles[0].length-1 && visited[x][y+1]==1){
    //     counts[tiles[x][y+1]]++;
    // }
    // if(x>0 && y>0 && visited[x-1][y-1]==1){
    //     counts[tiles[x-1][y-1]]++;
    // }
    // if(x<tiles.length-1 && y>0 && visited[x+1][y-1]==1){
    //     counts[tiles[x+1][y-1]]++;
    // }
    // if(x>0 && y<tiles[0].length-1 && visited[x-1][y+1]==1){
    //     counts[tiles[x-1][y+1]]++;
    // }
    // if(x<tiles.length-1 && y<tiles[0].length-1 && visited[x+1][y+1]==1){
    //     counts[tiles[x+1][y+1]]++;
    // }
    //console.log(weights)
    weights[0] += counts[0] * counts[0] * 2.5;
    weights[1] += counts[1] * counts[1];
    weights[2] += counts[2] * counts[2] * 0.5;
    if (counts[1] > 0) {
        weights[2] = 0;
    }
    if (counts[2] > 0) {
        weights[1] = 0;
    }
    let totalWeight = 0;
    for (let i = 0; i < weights.length; i++) {
        totalWeight += weights[i];
    }
    let value = Math.random() * totalWeight;
    let index = 0;
    value -= weights[index]
    while (value > 0) {
        index++;
        value -= weights[index];
    }
    tiles[x][y] = index;

    if (x > 0 && visited[x - 1][y] == 0) {
        InitializeTiles(x - 1, y)
    }
    if (x < tiles.length - 1 && visited[x + 1][y] == 0) {
        InitializeTiles(x + 1, y)
    }
    if (y > 0 && visited[x][y - 1] == 0) {
        InitializeTiles(x, y - 1)
    }
    if (y < tiles.length - 1 && visited[x][y + 1] == 0) {
        InitializeTiles(x, y + 1)
    }
}
if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", (e) => {
        localStorage.setItem("leftControl", controls["left"]);
        localStorage.setItem("rightControl", controls["right"]);
        localStorage.setItem("upControl", controls["up"]);
        localStorage.setItem("downControl", controls["down"]);
        localStorage.setItem("ability1Control", controls["ability1"]);
        localStorage.setItem("ability2Control", controls["ability2"]);
        localStorage.setItem("ability3Control", controls["ability3"]);
        localStorage.setItem("ability4Control", controls["ability4"]);
        localStorage.setItem("ability5Control", controls["ability5"]);
        localStorage.setItem("levelUpControl", controls["levelUp"]);
        localStorage.setItem("skipWaveControl", controls["skipWave"]);
        localStorage.setItem("dealDamageControl", controls["dealDamage"]);

        for (let i = 0; i < ENEMYTYPES.length; i++) {
            localStorage.setItem(ENEMYTYPES[i].name + "Found", ENEMYTYPES[i].seen);
        }

        localStorage.setItem("LaserBossFound", LaserBoss.seen);
        localStorage.setItem("IceBossFound", IceBoss.seen);
        localStorage.setItem("BouncyBossFound", BouncyBoss.seen);
        localStorage.setItem("MageBossFound", MageBoss.seen);
        localStorage.setItem("BulletHellBossFound", BulletHellBoss.seen);

        localStorage.setItem("GambleBossFound", GambleBoss.seen);
        localStorage.setItem("SnakeBossFound", SnakeBoss.seen);
        localStorage.setItem("HealerBossFound", HealerBoss.seen);
        localStorage.setItem("EngineerBossFound", EngineerBoss.seen);
        localStorage.setItem("FarmerBossFound", FarmerBoss.seen);

        localStorage.setItem("TankPlayerUnlocked", TankPlayer.unlocked);
        localStorage.setItem("HealerPlayerUnlocked", HealerPlayer.unlocked);
        localStorage.setItem("MagePlayerUnlocked", MagePlayer.unlocked);
        localStorage.setItem("NecromancerPlayerUnlocked", NecromancerPlayer.unlocked);
        localStorage.setItem("PheonixPlayerUnlocked", PheonixPlayer.unlocked);

        localStorage.setItem("ShowHealthbarSetting", showHealthBars);
    });
    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem("leftControl") != null) controls["left"] = localStorage.getItem("leftControl");
        if (localStorage.getItem("rightControl") != null) controls["right"] = localStorage.getItem("rightControl");
        if (localStorage.getItem("upControl") != null) controls["up"] = localStorage.getItem("upControl");
        if (localStorage.getItem("downControl") != null) controls["down"] = localStorage.getItem("downControl");
        if (localStorage.getItem("ability1Control") != null) controls["ability1"] = localStorage.getItem("ability1Control");
        if (localStorage.getItem("ability2Control") != null) controls["ability2"] = localStorage.getItem("ability2Control");
        if (localStorage.getItem("ability3Control") != null) controls["ability3"] = localStorage.getItem("ability3Control");
        if (localStorage.getItem("ability4Control") != null) controls["ability4"] = localStorage.getItem("ability4Control");
        if (localStorage.getItem("ability5Control") != null) controls["ability5"] = localStorage.getItem("ability5Control");
        if (localStorage.getItem("levelUpControl") != null) controls["levelUp"] = localStorage.getItem("levelUpControl");
        if (localStorage.getItem("skipWaveControl") != null) controls["skipWave"] = localStorage.getItem("skipWaveControl");
        if (localStorage.getItem("dealDamageControl") != null) controls["dealDamage"] = localStorage.getItem("dealDamageControl");
        Object.keys(localStorage)
            .filter(k => localStorage.getItem(k) === "undefined")
            .forEach(k => localStorage.removeItem(k));
        for (let i = 0; i < ENEMYTYPES.length; i++) {
            ENEMYTYPES[i].seen = JSON.parse(localStorage.getItem(ENEMYTYPES[i].name + "Found"))

        }

        LaserBoss.seen = JSON.parse(localStorage.getItem("LaserBossFound"));
        IceBoss.seen = JSON.parse(localStorage.getItem("IceBossFound"));
        BouncyBoss.seen = JSON.parse(localStorage.getItem("BouncyBossFound"));
        MageBoss.seen = JSON.parse(localStorage.getItem("MageBossFound"));
        BulletHellBoss.seen = JSON.parse(localStorage.getItem("BulletHellBossFound"));

        GambleBoss.seen = JSON.parse(localStorage.getItem("GambleBossFound"));
        SnakeBoss.seen = JSON.parse(localStorage.getItem("SnakeBossFound"));
        HealerBoss.seen = JSON.parse(localStorage.getItem("HealerBossFound"));
        EngineerBoss.seen = JSON.parse(localStorage.getItem("EngineerBossFound"));
        FarmerBoss.seen = JSON.parse(localStorage.getItem("FarmerBossFound"));

        BasicPlayer.unlocked = true;
        if (JSON.parse(localStorage.getItem("TankPlayerUnlocked")) != null) TankPlayer.unlocked = JSON.parse(localStorage.getItem("TankPlayerUnlocked"));

        if (JSON.parse(localStorage.getItem("HealerPlayerUnlocked")) != null) HealerPlayer.unlocked = JSON.parse(localStorage.getItem("HealerPlayerUnlocked"));
        if (JSON.parse(localStorage.getItem("MagePlayerUnlocked")) != null) MagePlayer.unlocked = JSON.parse(localStorage.getItem("MagePlayerUnlocked"));
        if (JSON.parse(localStorage.getItem("NecromancerPlayerUnlocked")) != null) NecromancerPlayer.unlocked = JSON.parse(localStorage.getItem("NecromancerPlayerUnlocked"));
        if (JSON.parse(localStorage.getItem("PheonixPlayerUnlocked")) != null) PheonixPlayer.unlocked = JSON.parse(localStorage.getItem("PheonixPlayerUnlocked"));
        NecromancerPlayer.unlocked = true;

        if (JSON.parse(localStorage.getItem("ShowHealthbarSetting")) != null) showHealthBars = JSON.parse(localStorage.getItem("ShowHealthbarSetting"));

    });
}
