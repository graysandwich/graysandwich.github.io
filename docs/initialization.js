
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
    { onclick:  increaseDamage, text: v => `+${v} Damage`, defaultValue:0.5},
    { onclick:  increaseMaxHealth, text: v =>`+${v} Max Health`, defaultValue:8},
    { onclick:  increaseProjectiles, text: v =>`+${v} Projectiles`, defaultValue:2},
    { onclick:  addFrostProjectiles, text: v => `+${v} Frost Projectile`, defaultValue:1},
    { onclick:  addLaserProjectiles, text: v=> "Laser Attack", defaultValue:1},
    { onclick:  speedUpAttacks, text:v=> `${v}X Faster Attack Speed`, defaultValue:1.2},
    { onclick:  addSiphon,text:v=> `+${v} Lifesteal`, defaultValue:0.25},
    { onclick:  multiplyXPGain, text:v=> `X${v} XP gain`, defaultValue:1.5},
    { onclick:  addBomb, text:v=> "Bomb Ability", defaultValue:1},
    { onclick: addTimeWarp, text:v=> "Speed Boost Ability"},
    { onclick: AddPassiveHealing, text:v=> `+${v} Passive Healing`, defaultValue:1 },
    { onclick: Gamble, text:v=> `Mystery Box`, defaultValue:1},
    { onclick: AddProtectorBullet, text:v=> `+${v} Protectors`, defaultValue:2},
    { onclick: TradeoffDeal, text:v=> `X${v} Damage but X${v} Damage Taken`, defaultValue:2},
    { onclick: AddShield, text:v=> `Gain ${v}hp Shield`, defaultValue:50 },
    { onclick: BulletDeleterAbility, text:v=> `Bullet Wipe Ability` },
    { onclick: IncreaseProjectileSize, text:v=> `${v}X Projectile Size`, defaultValue:1.5},
    { onclick: MakeIceBulletsPierce, text:v=> "Frost Bullets Pierce Through Enemies" },
    { onclick: IncreaseFireDamage, text:v=> `+${v} Fire Damage`, defaultValue:0.25 },
    { onclick: PassiveSpawns, text:v=> "Passively Spawn Souls" },
    { onclick: IncreaseTornadoDamage, text:v=> `+${v} Tornado Damage`, defaultValue:1 },
    { onclick: AddSpeed, text:v=> `Increase Movement Speed`, defaultValue:1.5},
    { onclick: IncreaseSlowedDamage, text:v=> `Slowed Enemies Take ${v}X Damage`, defaultValue:1.5 },
    { onclick: IncreaseBombDamage, text:v=> `+${v} Bomb Damage`, defaultValue:4 },
    { onclick: IncreaseLaserDamage, text: v=>`+${v} Laser Damage`, defaultValue:0.5 },
    { onclick: AddTimeStop, text:v=> "Speed Boost Ability -> Time Stop Ability" },
    { onclick: AddBouncingProjectile, text: v=> `+${v} Bouncing Bullet`, defaultValue:1 },
    { onclick: IncreaseProtectorDamage, text:v=> `+${v} Protector Damage`, defaultValue:1 },
    { onclick: IncreaseBouncingBulletDamage, text:v=> `+${v} Bouncing Bullet Damage`, defaultValue:0.5 },
    { onclick: AddStrengthPotions, text:v=> "Health potions sometimes become Strength potions", defaultValue:0.25},
    { onclick: AddStrengthBuff, text:v=> "Every 15 Kills, Gain strength buff for 6 seconds" },
    { onclick: AddSentryTower, text:v=> "New Build: Turret" },
    { onclick: AddDamageAuraTower, text:v=> "New Build: Fire Tower"},
    { onclick: AddHealAuraTower, text:v=> "New Build: Healing Station" },
    { onclick: AddLaserTower, text:v=> "New Build: Laser Tower" },
    { onclick: AddPassiveBolts, text:v=> `+${v} Passive Bolt Production`, defaultValue:1 },
    { onclick: DoublePositiveEffects, text:v=> "2x Duration of Positive Effects" },
    { onclick: AddRegeneration, text:v=> "When below 33% health, gain 5s regeneration (30s cooldown)" },

];
let originalUpgrades=[];
for(let i=0;i<UPGRADES.length;i++){
    originalUpgrades[i]={onclick:UPGRADES[i].onclick, text:UPGRADES[i].text};
}
const NUMUPGRADES = UPGRADES.length;
let boughtUpgrades = new Array(NUMUPGRADES);
for (let i = 0; i < boughtUpgrades.length; i++) {
    boughtUpgrades[i] = 0;
}
let TIER2UPGRADES = [
    { onclick:  increaseDamage, text:v=> `+${v} Damage`, defaultValue:1 },
    { onclick:  increaseMaxHealth, text:v=> `+${v} Max Health`, defaultValue:15 },
    { onclick:  increaseProjectiles, text:v=> `+${v} Projectiles`, defaultValue:4 },
    { onclick:  HalveCollisionDamage, text:v=> `Enemy Collisions Deal ${v}X Damage`, defaultValue:0.25 },
    { onclick:  addSiphon, text: v=>`+${v} Lifesteal`, defaultValue:0.5 },
    { onclick:  IncreaseHealthPotionDensity, text: v=>`${Math.round(1/v*100)/100}x Health Potion Spawn Rate`, defaultValue:0.5 },
    { onclick:  AddShockwave, text: v=>`Shockwave Ability` },
    { onclick:  AddRebirth, text:v=> "Rebirth On Death" },
    { onclick:  AddWindAttack, text:v=> `+${v} Tornado Projectiles`, defaultValue:2},
    { onclick:  AddNuke, text:v=> "Bomb attack -> Nuke Attack" },
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
const RESTRICTEDTIER2UPGRADES = [];
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
        case 7:
            if (BuilderPlayer.unlocked) {
                descriptionText2.innerText = "Starts with an ability that spawns a Decoy tower. Unlock more towers when upgrading. Bolts spawn around the map, and collecting them boosts the strength of towers that are built."

            }
            else {
                descriptionText2.innerText = "LOCKED"
            }
            document.getElementById("builderPlayer").style.border = "5px solid red";
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
            case 7:
                document.getElementById("gamemodeDescriptionText").innerText = "All Enemy stats (e.g. health, attack speed) and upgrade values are randomized between x0.25 and x4 when possible."
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
    const scale = Math.min(window.innerWidth / 1536, window.innerHeight / 695);
    canvas.style.width = `${1536 * scale}px`;
    canvas.style.height = `${695 * scale}px`;
    canvas.width = 1536;
    canvas.height = 695; 
    canvas.style.display = "block";
    if (gamemode == 100) {
        ChangePage("coopWaitingPage", false);
        if (createdRoom) createRoom();
        else {
            joinRoom(roomCode);
        }
        return;
    }
    gameOver = false;
    healthBarCurrentLength = 400;
    healthBarDesiredLength = 400;
    levelBarCurrentLength = 0;
    levelBarDesiredLength = 0;
    shieldBarCurrentLength = 0;
    shieldBarDesiredLength = 0;
    gameState = {
        players: [],
        bullets: [],
        enemies: [],
        floatingObjects: [],
        enemyBullets: [],
        abilityIcons: [],
        mapObjects: [],
        collectables: [],
        bossBars: [],
        protectorBullets: [],
        seenTier1Bosses:[],
        seenTier2Bosses:[],
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
        boltSpawnTimer:0,
        bossesLeft: 0,
        isBossWave: false,
        scaleMultiplier: 1,
        bossMultiplier: 1,
        waveTimer: 2000,
        strengthPotionSpawnRate:0
    };
    // for(let i=0;i<UPGRADES.length;i++){
    //     UPGRADES[i]={onclick:originalUpgrades[i].onclick, text:originalUpgrades[i].text};
    // }
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

    lastTime = Date.now();
    switch (chosenCharacter) {
        case 1: player = new BasicPlayer(12); break;
        case 2: player = new TankPlayer(42); break;
        case 3: player = new HealerPlayer(15); break;
        case 4: player = new MagePlayer(12, gameState.abilityIcons); break;
        case 5: player = new NecromancerPlayer(12, gameState.abilityIcons); break;
        case 6: player = new PheonixPlayer(6); break;
        case 7: player = new BuilderPlayer(9, gameState.abilityIcons); break;
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
        case 7:
            mapType=1;
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
        RandomizeEnemies(0, 0, 0, 1, 0, gameState);
    }
    else {
        RandomizeEnemies(2, 0, 0, 0, 0, gameState);
    }
    //ctx.clearRect(0, 0, 2000, 1100);
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
        localStorage.setItem("WeakenBossFound", WeakenBoss.seen);

        localStorage.setItem("GambleBossFound", GambleBoss.seen);
        localStorage.setItem("SnakeBossFound", SnakeBoss.seen);
        localStorage.setItem("HealerBossFound", HealerBoss.seen);
        localStorage.setItem("EngineerBossFound", EngineerBoss.seen);
        localStorage.setItem("FarmerBossFound", FarmerBoss.seen);
        localStorage.setItem("ShadowBossFound", FarmerBoss.seen);

        localStorage.setItem("TankPlayerUnlocked", TankPlayer.unlocked);
        localStorage.setItem("HealerPlayerUnlocked", HealerPlayer.unlocked);
        localStorage.setItem("MagePlayerUnlocked", MagePlayer.unlocked);
        localStorage.setItem("NecromancerPlayerUnlocked", NecromancerPlayer.unlocked);
        localStorage.setItem("PheonixPlayerUnlocked", PheonixPlayer.unlocked);
        localStorage.setItem("BuilderPlayerUnlocked", BuilderPlayer.unlocked);

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
        WeakenBoss.seen=JSON.parse(localStorage.getItem("WeakenBossFound"));

        GambleBoss.seen = JSON.parse(localStorage.getItem("GambleBossFound"));
        SnakeBoss.seen = JSON.parse(localStorage.getItem("SnakeBossFound"));
        HealerBoss.seen = JSON.parse(localStorage.getItem("HealerBossFound"));
        EngineerBoss.seen = JSON.parse(localStorage.getItem("EngineerBossFound"));
        FarmerBoss.seen = JSON.parse(localStorage.getItem("FarmerBossFound"));
        ShadowBoss.seen = JSON.parse(localStorage.getItem("ShadowBossFound"));

        BasicPlayer.unlocked = true;
        if (JSON.parse(localStorage.getItem("TankPlayerUnlocked")) != null) TankPlayer.unlocked = JSON.parse(localStorage.getItem("TankPlayerUnlocked"));

        if (JSON.parse(localStorage.getItem("HealerPlayerUnlocked")) != null) HealerPlayer.unlocked = JSON.parse(localStorage.getItem("HealerPlayerUnlocked"));
        if (JSON.parse(localStorage.getItem("MagePlayerUnlocked")) != null) MagePlayer.unlocked = JSON.parse(localStorage.getItem("MagePlayerUnlocked"));
        if (JSON.parse(localStorage.getItem("NecromancerPlayerUnlocked")) != null) NecromancerPlayer.unlocked = JSON.parse(localStorage.getItem("NecromancerPlayerUnlocked"));
        if (JSON.parse(localStorage.getItem("PheonixPlayerUnlocked")) != null) PheonixPlayer.unlocked = JSON.parse(localStorage.getItem("PheonixPlayerUnlocked"));
        if (JSON.parse(localStorage.getItem("BuilderPlayerUnlocked")) != null) BuilderPlayer.unlocked = JSON.parse(localStorage.getItem("BuilderPlayerUnlocked"));
        if (JSON.parse(localStorage.getItem("ShowHealthbarSetting")) != null) showHealthBars = JSON.parse(localStorage.getItem("ShowHealthbarSetting"));

    });
}



function increaseDamage(amount, player){
    console.log(amount);
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"damage", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 0, amount:0.5});
    }
    else{
        player.damage += amount;
        player.boughtUpgrades[0]+=0.5;
    }
    boughtTier2Upgrades[0]+=0.5;
    if(amount==1){
        boughtTier2Upgrades[0]=1;
        player.boughtUpgrades[0]=1;
    }
    
    ChangePage('gamePage', false)
}

function increaseMaxHealth(amount, player){
    if(chosenCharacter!=6){
        if(gamemode==100){
            socket.emit("buyUpgrade", {type: "stat", stat:"health", amount:amount});
            socket.emit("buyUpgrade", {type: "stat", stat:"maxHealth", amount:amount});
            socket.emit("buyUpgrade", {type: "stat", stat:"originalMaxHealth", amount:amount});
        }
        else{
            player.health += amount;
            player.maxHealth += amount;
            player.originalMaxHealth+=amount;
        }
    }
    ChangePage('gamePage', false)
}

function increaseProjectiles(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"projectiles", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 2, amount:0.5});
    }
    else{
        player.projectiles += amount;
        player.boughtUpgrades[2]+=0.5;
    }
    boughtTier2Upgrades[2]+=0.5;
    
    if(amount==4){
        boughtTier2Upgrades[2]=1;
        player.boughtUpgrades[2]=1;
    }
    
    ChangePage('gamePage', false)
}

function addFrostProjectiles(amount, player){
    if(player.boughtUpgrades[3]==0){
        if(gamemode==100){
            socket.emit("changeBoughtUpgrades", {index: 3, amount:0.001});
            socket.emit("changeBoughtUpgrades", {index: 22, amount:-1});
        }
        else{
            player.boughtUpgrades[22]=0;
            player.boughtUpgrades[3]=0.1;
        }
    }
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"frostProjectiles", amount:amount});
        socket.emit("buyUpgrade", {type: "changeStat", stat:"frostProjectileMaxCooldown", amount:0});
    }
    else{
        player.frostProjectiles += amount;
        player.frostProjectileMaxCooldown = 100 / player.frostProjectiles;
    }
    ChangePage('gamePage', false)
}
function addLaserProjectiles(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"laser", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 4, amount:1});
        socket.emit("changeBoughtUpgrades", {index: 24, amount:-1});

    }
    else{
        gameState.bullets.push(new PlayerLaser(-Math.PI / 2, player.x, player.y, player))
        player.boughtUpgrades[4] = 1;
        player.boughtUpgrades[24]=0;
    }
    ChangePage('gamePage', false)
}
function speedUpAttacks(amount, player){
    console.log(player);
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "changeStat", stat:"attackSpeed", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 5, amount:0.25});
    }
    else{
        player.attackSpeed /= amount;
        player.attackSpeedMultiplier/=amount;
        player.boughtUpgrades[5]+=0.25;
    }
    ChangePage('gamePage', false)
}
function addSiphon(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"siphon", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 6, amount:0.5});
    }
    else{
        player.siphon += amount;
        player.boughtUpgrades[6]+=0.5;
        boughtTier2Upgrades[1]+=0.5;
    }
    if(amount==0.5){
        boughtTier2Upgrades[1]=1;
    }
    ChangePage('gamePage', false)
}
function multiplyXPGain(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "changeStat", stat:"xpMultiplier", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 7, amount:1});
    }
    else{
        player.xpMultiplier *= amount;
        player.boughtUpgrades[7] =1;
    }
    ChangePage('gamePage', false)
}
function addBomb(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"bombCount", amount:amount});
        socket.emit("buyUpgrade", {type: "object", stat:"bomb", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 8, amount:1});
        socket.emit("changeBoughtUpgrades", {index: 23, amount:-1});
    }
    else{
        let temp = new BombIcon(50, player.abilities.length)
        player.abilities.push(temp)
        gameState.abilityIcons.push(temp);
        player.boughtUpgrades[8] = 1;
        player.boughtUpgrades[23]=0;
    }
    boughtTier2Upgrades[9]=0;
    ChangePage('gamePage', false)
}
function addTimeWarp(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"timeWarp", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 9, amount:1});
        socket.emit("changeBoughtUpgrades", {index: 36, amount:-1});
    }
    else{
        let temp = new TimeWarpIcon(50, player.abilities.length)
        player.abilities.push(temp)
        gameState.abilityIcons.push(temp);
        player.boughtUpgrades[25] = 0;
        player.boughtUpgrades[36] = 0;
    }
    player.boughtUpgrades[9] = 1;
    ChangePage('gamePage', false)
}
function AddPassiveHealing(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"passiveHealing", amount:amount});
    }
    else{
        player.passiveHealing += amount;
    }
    ChangePage('gamePage', false)
}
function Gamble(numGambles, player) {
    Gamble2();
}
function Gamble2(){
    
    gambleText = document.createElement("div");
    gambleTimer = Math.floor(Math.random() * 240) + 300;
    gambleText.innerHTML = `<div></div>`;
    document.body.appendChild(gambleText);
    textSpeed = 5;
    
    choice1.remove();
    choice2.remove();
    if(choice3) choice3.remove();

    Roll();
}
function AddProtectorBullet(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"protectorBullet", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 27, amount:-1});
    }
    else{
        for(let i=0;i<amount;i++){
            gameState.bullets.push(new ProtectorBullet(1, player, gameState.protectorBullets));

        }
        ProtectorBullet.Spacing(player, gameState.protectorBullets);
    }
    player.boughtUpgrades[27]=0;
    ChangePage('gamePage', false)
}
function AddShield(health, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"playerShield", amount:1});
        socket.emit("changeBoughtUpgrades", {index: 14, amount:1});
    }
    else{
        let temp=new PlayerShield(health, player);
        gameState.bullets.push(temp);
        
    }
    player.boughtUpgrades[14]=1;
    ChangePage('gamePage', false)
}
function Roll(){
    if (gambleTimer % textSpeed == 0 && gambleTimer > 50) {
        let randomNum = Math.random() * 100;
        let prevChoice = gambleChoice;
        while (prevChoice == gambleChoice) {

            if (randomNum < 15) {
                gambleChoice = Math.floor(Math.random() * 2);
            }
            else if (randomNum < 47) {
                gambleChoice = Math.floor(Math.random() * 2) + 2;
            }
            else if (randomNum < 74) {
                gambleChoice = Math.floor(Math.random() * 4) + 4;
            }
            else if (randomNum < 88) {
                gambleChoice = Math.floor(Math.random() * 2) + 8;
            }
            else if (randomNum < 95) {
                gambleChoice = Math.floor(Math.random() * 2) + 10;
            }
            else {
                gambleChoice = Math.floor(Math.random() * 2) + 12;
            }
        }

        //console.log(gambleText);
        switch (gambleChoice) {
            case 0:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:red; font-size:75px; background-color:gray" id="upgrade">-3 health</div>`
                break;
            case 1:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:red; font-size:75px;background-color:gray;" id="upgrade">Decrease Speed</div>`
                break;
            case 2:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">Nothing</div>`
                break;
            case 3:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">Heal 10</div>`
                break;
            case 4:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">Increase Speed</div>`
                break;
            case 5:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+0.5 Damage</div>`
                break;
            case 6:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+2 Projectiles</div>`
                break;
            case 7:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+0.25 Lifesteal</div>`
                break;
            case 8:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:blue; font-size:75px;background-color:gray;" id="upgrade">+4 Projectiles</div>`
                break;
            case 9:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:blue; font-size:75px;background-color:gray;" id="upgrade">+15 Max Health</div>`
                break;
            case 10:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:purple; font-size:75px;background-color:gray;" id="upgrade">+1 Damage</div>`
                break;
            case 11:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:purple; font-size:75px;background-color:gray;" id="upgrade">x2 XP Gain</div>`
                break;
            case 12:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:yellow; font-size:75px;background-color:gray;" id="upgrade">+1.5 Damage</div>`
                break;
            case 13:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 }px; transform:translateX(-50%); top:300px; z-index:3; color:yellow; font-size:75px;background-color:gray; " id="upgrade">+30 Max Health</div>`
                break;

        }
    }
    if (gambleTimer == 400) {
        textSpeed = 7;
    }
    if (gambleTimer == 300) {
        textSpeed = 12;
    }
    if (gambleTimer == 200) {
        textSpeed = 20;
    }
    if (gambleTimer == 150) {
        textSpeed = 30;
    }
    if (gambleTimer == 120) {
        textSpeed = 40;
    }
    if (gambleTimer > 0) {
        gambleTimer--;
        requestAnimationFrame(Roll);
    }
    else {
        gambleText.remove();
        switch (gambleChoice) {
            case 0:
                player.health -= 3;
                //console.log(this.health);
                if (player.health <= 0) {
                    EndGame(false);
                }
                ChangePage('gamePage', false)
                break;
            case 1:
                player.speed -= 1;
                ChangePage('gamePage', false)
                break;
            case 2:
                ChangePage('gamePage', false)
                break;
            case 3:
                player.health = Math.min(player.health + 10, player.maxHealth);
                ChangePage('gamePage', false)
                break;
            case 4:
                player.speed += 2;
                ChangePage('gamePage', false)
                break;
            case 5:
                increaseDamage(0.5, player);
                break;
            case 6:
                increaseProjectiles(2, player);
                break;
            case 7:
                addSiphon(0.25, player);
                break;
            case 8:
                increaseProjectiles(4, player);
                break;
            case 9:
                increaseMaxHealth(15, player);
                break;
            case 10:
                increaseDamage(1, player);
                break;
            case 11:
                multiplyXPGain(2, player);
                break;
            case 12:
                increaseDamage(1.5, player);
                break;
            case 13:
                increaseMaxHealth(30, player);
                break;
        }
    }
}
function TradeoffDeal(amount, player){
    if(gamemode==100){
        
        socket.emit("buyUpgrade", {type: "changeStat", stat:"damageMultiplier", amount:amount});
        socket.emit("buyUpgrade", {type: "changeStat", stat:"damageTakenMultiplier", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 13, amount:1});
    }
    else{
        player.damageMultiplier *= amount;
        player.damageTakenMultiplier *= amount;
    }
    player.boughtUpgrades[13] = 1;
    ChangePage('gamePage', false)
}
function BulletDeleterAbility(amount, player){
    
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"bulletWipe", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 15, amount:1});
    }
    else{
        let temp = new BulletDeleterIcon(50, player.abilities.length)
        player.abilities.push(temp)
        gameState.abilityIcons.push(temp);
    }
    player.boughtUpgrades[15] = 1;
    ChangePage('gamePage', false)
}
function IncreaseProjectileSize(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "changeStat", stat:"projectileSizeMultiplier", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 16, amount:0.5});
    }
    else{
        player.projectileSizeMultiplier *=amount;
    }
    player.boughtUpgrades[16]+=0.5;
    ChangePage('gamePage', false)
}
function HalveCollisionDamage(amount, player){
    player.collisionDamageMultiplier *=amount;
    boughtTier2Upgrades[3]=1;
    ChangePage('gamePage', false)
}
function IncreaseHealthPotionDensity(amount, player){
    healthPotionSpawnMultiplier *=amount;
    boughtTier2Upgrades[5]=1;
    ChangePage('gamePage', false)
}
function MakeIceBulletsPierce(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "changeStat", stat:"iceBulletsPierce", amount:0});
        socket.emit("changeBoughtUpgrades", {index: 17, amount:1});
    }
    else{
        player.iceBulletsPierce=true;
    }
    player.boughtUpgrades[17]=1;
    ChangePage('gamePage', false)
}
function IncreaseFireDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"fireDamage", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 18, amount:0.5});
    }
    else{
        player.fireDamage+=amount;
    }
    player.boughtUpgrades[18]+=0.5;
    ChangePage('gamePage', false)
}
function PassiveSpawns(amount,player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "changeStat", stat:"passiveSpawning", amount:0});
        socket.emit("changeBoughtUpgrades", {index: 19, amount:1});
    }
    else{
        player.passiveSpawning=true;
    }
    player.boughtUpgrades[19]=1;
    ChangePage('gamePage', false)
}
function AddShockwave(amount,player){
    
    let temp = new ShockwaveIcon(50, player.abilities.length)
    player.abilities.push(temp)
    gameState.abilityIcons.push(temp);
    boughtTier2Upgrades[6] = 1;
    ChangePage('gamePage', false)
}
function IncreaseTornadoDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"tornadoDamage", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 20, amount:0.5});
    }
    else{
        player.tornadoDamage+=amount;
    }
    player.boughtUpgrades[20]+=0.5;
    ChangePage('gamePage', false)
}
function AddRebirth(amount, player){
    player.rebirth+=1;
    boughtTier2Upgrades[7]=1;
    ChangePage('gamePage', false)
}
function AddWindAttack(amount, player){
    if(chosenCharacter!=4)player.windProjectiles+=amount;
    else player.projectiles+=amount;
    ChangePage('gamePage', false)
}
function AddSpeed(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"speed", amount:1});
    }
    else{
        player.speed +=1;
    }
    ChangePage('gamePage', false)
}
function IncreaseSlowedDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "changeStat", stat:"slowedDamageMultiplier", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 22, amount:1});
    }
    else{
        player.slowedDamageMultiplier=amount;
    }
    player.boughtUpgrades[22]=1;
    ChangePage('gamePage', false)
}
function IncreaseBombDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"bombDamage", amount:amount});
    }
    else{
        player.bombDamage+=amount;
    }
    
    ChangePage('gamePage', false)
}
function IncreaseLaserDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"laserDamage", amount:amount});
    }
    else{
        player.laserDamage+=amount;
    }
    ChangePage('gamePage', false)
}
function AddTimeStop(amount,player){
    if(gamemode==100){
        
    }
    else{
        TimeWarpIcon.version=1;
    }
    player.boughtUpgrades[25] = 1;
    ChangePage('gamePage', false)
}
function AddBouncingProjectile(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"bouncingProjectiles", amount:amount});
        socket.emit("buyUpgrade", {type: "changeStat", stat:"bouncingProjectileMaxCooldown", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 28, amount:-1});
    }
    else{
        player.bouncingProjectiles+=amount;
        player.bouncingProjectileMaxCooldown = 240 / player.bouncingProjectiles;
    }
    player.boughtUpgrades[28]=0;
    ChangePage('gamePage', false)
}
function IncreaseProtectorDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"protectorDamage", amount:amount});
    }
    else{
        player.protectorDamage+=amount;
    }
    
    ChangePage('gamePage', false)
}
function AddNuke(amount,player){
    BombIcon.version=1;
    boughtTier2Upgrades[9] = 1;
    UPGRADES[23].text="+8 Bomb Damage";
    ChangePage('gamePage', false)
}
function IncreaseBouncingBulletDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"bouncingBulletDamage", amount:amount});
    }
    else{
        player.bouncingBulletDamage+=amount;
    }
    
    ChangePage('gamePage', false)
}
function AddStrengthPotions(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "other", stat:"spawnStrengthPotions", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 29, amount:1});
        socket.emit("changeBoughtUpgrades", {index: 36, amount:-1});

    }
    else{
        gameState.strengthPotionSpawnRate+=amount;
        player.boughtUpgrades[36] = 0;
    }
    player.boughtUpgrades[29] = 1;
    ChangePage('gamePage', false)
}
function AddStrengthBuff(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"overheal", amount:1});
        socket.emit("changeBoughtUpgrades", {index: 30, amount:1});
        socket.emit("changeBoughtUpgrades", {index: 36, amount:-1});

    }
    else{
        player.overheal+=1;
        player.boughtUpgrades[36] = 0;
    }
    player.boughtUpgrades[30] = 1;
    ChangePage('gamePage', false)
}
function AddSentryTower(amount,player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"sentryTower", amount:1});
        socket.emit("changeBoughtUpgrades", {index: 31, amount:1});
    }
    else{
        let temp = new BuildIcon(50, player.abilities.length, 7);
        player.abilities.push(temp);
        gameState.abilityIcons.push(temp);
        player.boughtUpgrades[31] = 1;
    }
    ChangePage('gamePage', false)
}
function AddDamageAuraTower(amount,player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"damageAuraTower", amount:1});
        socket.emit("changeBoughtUpgrades", {index: 32, amount:1});
    }
    else{
        let temp = new BuildIcon(50, player.abilities.length, 8);
        player.abilities.push(temp);
        gameState.abilityIcons.push(temp);
        player.boughtUpgrades[32] = 1;
    }
    ChangePage('gamePage', false)
}
function AddHealAuraTower(amount,player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"healAuraTower", amount:1});
        socket.emit("changeBoughtUpgrades", {index: 33, amount:1});
    }
    else{
        let temp = new BuildIcon(50, player.abilities.length, 9);
        player.abilities.push(temp);
        gameState.abilityIcons.push(temp);
        player.boughtUpgrades[33] = 1;
    }
    ChangePage('gamePage', false)
}
function AddLaserTower(amount,player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"laserTower", amount:1});
        socket.emit("changeBoughtUpgrades", {index: 34, amount:1});
    }
    else{
        let temp = new BuildIcon(50, player.abilities.length, 10);
        player.abilities.push(temp);
        gameState.abilityIcons.push(temp);
        player.boughtUpgrades[34] = 1;
    }
    ChangePage('gamePage', false)
}
function AddPassiveBolts(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"passiveBoltProduction", amount:amount});
    }
    else{
        player.passiveBoltProduction += amount;
    }
    ChangePage('gamePage', false)
}
function DoublePositiveEffects(amount,player){
    if(gamemode==100){
        
        socket.emit("buyUpgrade", {type: "changeStat", stat:"doublePositiveEffects", amount:1});
        socket.emit("changeBoughtUpgrades", {index: 36, amount:1});
    }
    else{
        player.doublePositiveEffects=true;
    }
    player.boughtUpgrades[36] = 1;
    ChangePage('gamePage', false)
}
function AddRegeneration(amount,player){
    if(gamemode==100){
        
        socket.emit("changeBoughtUpgrades", {index: 37, amount:1});
    }
    else{
    }
    player.boughtUpgrades[37] = 1;
    ChangePage('gamePage', false)
}