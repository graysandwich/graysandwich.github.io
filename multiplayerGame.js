const { Bullet, Enemy, Player, BasicPlayer, FloatingObject, ENEMYTYPES, InitializeStats, currentPage, RandomizeEnemies, ChangeWave, WaveText, Wall, EnemyShield, XPBag, HealthPotion, ProtectorBullet, TankPlayer, HealerPlayer, MagePlayer, PheonixPlayer, NecromancerPlayer } = require('./docs/shared/gameLogic.js')
const { controls } = require('./docs/initialization.js')
function createGameState() {
    return {
        code: "",
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
        waveText: null,
        currentWave: 1,
        xpBagTimer: 0,
        healthPotionSpawnTimer: 0,
        bossesLeft: 0,
        isBossWave: false,
        scaleMultiplier: 1,
        bossMultiplier: 1,
        deadPlayers:{},
    };
}

function createGame(gameState, difficulty) {
    gameState.spawnCooldowns = new Array(ENEMYTYPES.length);
    gameState.timeElapsed = 0;
    gameState.sharedXP = 0;
    gameState.nextLevel = 100;
    gameState.playerLevel = 1;
    gameState.currentWave = 1;
    gameState.currentPage = "gamePage";
    gameState.readyCount = 0;
    gameState.waveText = new WaveText(50);
    gameState.bossesLeft = 0;
    gameState.isBossWave = false;

    gameState.difficulty = difficulty;

    if (difficulty == 1) { gameState.scaleMultiplier = 0.5; gameState.bossMultiplier = 0.5; }
    else if (difficulty == 2) { gameState.scaleMultiplier = 0.75; gameState.bossMultiplier = 0.75; }
    else if (difficulty == 3) { gameState.scaleMultiplier = 1; gameState.bossMultiplier = 1; }
    else { gameState.scaleMultiplier = 2; gameState.bossMultiplier = 2; }

    gameState.scaleMultiplier *= 1.5;
    gameState.SCALE = 0.0012 * gameState.scaleMultiplier;

    gameState.mapObjects = [
        new Wall(-55, -55, 2110, 30),
        new Wall(-25, 1125, 2080, 30),
        new Wall(-55, -25, 30, 1180),
        new Wall(2025, -25, 30, 1170)
    ];
    InitializeStats();
    RandomizeEnemies(2, 0, 0, 0, 0, gameState.enemies, gameState.bossBars, gameState.bossMultiplier);
}

function addPlayer(gameState, socketId, chosenCharacter) {
    let player;
    switch (chosenCharacter) {
        case 1: player = new BasicPlayer(10); break;
        case 2: player = new TankPlayer(35); break;
        case 3: player = new HealerPlayer(12); break;
        case 4: 
            player = new MagePlayer(10, gameState.abilityIcons); 
            gameState.abilityIcons.push(player.abilities[0]);
            break;
        case 5: 
            player = new NecromancerPlayer(10, gameState.abilityIcons); 
            gameState.abilityIcons.push(player.abilities[0]);
            break;
        case 6: player = new PheonixPlayer(6); break;
    }

    if (gameState.difficulty == 1) {
        player.health = Math.ceil(player.health * 1.8);
        player.maxHealth = player.health;
    }
    else if (gameState.difficulty == 2) {
        player.health = Math.ceil(player.health * 1.4);
        player.maxHealth = player.health;
    }

    player.id = socketId;

    const n = Object.keys(gameState.players).length;
    player.x = 1000 + (n % 2 ? 60 : -60);
    player.y = 550 + (n < 2 ? -60 : 60);

    gameState.players[socketId] = player;
    return player;
}

function removePlayer(gameState, socketId) {
    delete gameState.players[socketId];
}

function MultiplayerGameLogic(gameState) {
    let deadPlayers = [];
    let playerList = [];
    playerList.length = 0;
    let players = gameState.players;
    for (let id in players) playerList.push(players[id]);
    gameState.timeElapsed++;
    const playerCount = Object.keys(gameState.players).length;
    //console.log(gameState.currentPage)
    if (playerCount === 0 || gameState.currentPage !== "gamePage") {
        return;
    }
    for (let id in players) {
        let currentPlayer = players[id];
        let inputs = currentPlayer.inputs;
        if (inputs.gainXP) {
            gameState.sharedXP += 10000;
        }
        if (inputs.skipWave) {
            [gameState.isBossWave, gameState.bossesLeft, gameState.currentWave, gameState.SCALE] = ChangeWave(gameState);
            gameState.timeElapsed = 0;
        }
        if (inputs.dealDamage) {
            for (let i = 0; i < gameState.enemies.length; i++) {
                gameState.enemies[i].takeDamage(new Bullet(0, 0, 10, currentPlayer), currentPlayer, gameState);
            }
        }
        currentPlayer.attackCooldown--;
        currentPlayer.act(gameState.enemies, gameState.bullets, gameState.floatingObjects);
        if (currentPlayer.dead) {
            if (currentPlayer.rebirth > 0) {
                currentPlayer.dead = false;
                currentPlayer.useRebirth(gameState.bullets);
            }
            else {
                gameState.deadPlayers[id]= gameState.players[id];
                delete gameState.players[id];
            }
        }
    }
    let bullets = gameState.bullets;
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].move(gameState.enemies, gameState);
        if (bullets[i].dead) {
            bullets.splice(i, 1);
        }
    }
    let enemies = gameState.enemies;
    //console.log(enemies.length);
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].special(gameState.enemyBullets, playerList, gameState.enemies, gameState.bullets, gameState.floatingObjects);
        enemies[i].move(playerList, gameState.floatingObjects, gameState.enemies);
        if (enemies[i].dead) {
            if (enemies[i].giveXP) {
                gameState.sharedXP += enemies[i].value * enemies[i].killCredit.xpMultiplier;
                if (enemies[i].killCredit.index == 4) {
                    enemies[i].killCredit.summonQueue.push([enemies[i].speed, enemies[i].maxHealth * 0.5, enemies[i].width, enemies[i].index])
                }
            }
            if (enemies[i].canSiphon && enemies[i].killCredit && enemies[i].killCredit.siphon > 0) {
                enemies[i].killCredit.Heal(enemies[i].killCredit.siphon, gameState.floatingObjects);
            }
            if (enemies[i].isBoss) {
                const bossBars = gameState.bossBars;
                const index = enemies[i].bossBar ? bossBars.indexOf(enemies[i].bossBar) : -1;
                if (index !== -1) {
                    bossBars.splice(index, 1);
                    for (let j = index; j < bossBars.length; j++) {
                        bossBars[j].index = j;
                        bossBars[j].y = 50 + 75 * j;
                    }
                }
                gameState.bossesLeft--;
                if (gameState.bossesLeft == 0 && gameState.isBossWave) {
                    [gameState.isBossWave, gameState.bossesLeft, gameState.currentWave, gameState.SCALE] = ChangeWave(gameState);
                    gameState.timeElapsed = 0;
                    for(let id in gameState.deadPlayers){
                        players[id]=gameState.deadPlayers[id];
                        players[id].dead=false;
                        players[id].health=players[id].maxHealth/2;
                        players[id].x=1000;
                        players[id].y=550;
                        delete gameState.deadPlayers[id];
                    }
                }
            }
            enemies.splice(i, 1);
            i--;
        }

    }
    let floatingObjects = gameState.floatingObjects
    for (let i = floatingObjects.length - 1; i >= 0; i--) {
        floatingObjects[i].move();
        if (floatingObjects[i].dead) {
            floatingObjects.splice(i, 1);
        }
    }
    let enemyBullets = gameState.enemyBullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].move(playerList, floatingObjects, enemies);
        enemyBullets[i].special(playerList, gameState.enemyBullets)
        if (enemyBullets[i].dead) {
            enemyBullets.splice(i, 1);
        }
    }
    let abilityIcons = gameState.abilityIcons
    for (let i = abilityIcons.length - 1; i >= 0; i--) {
        abilityIcons[i].timer();
    }
    for (let i = 0; i < ENEMYTYPES.length; i++) {
        //console.log(ENEMYTYPES[i].isActive+" "+ENEMYTYPES[i].spawnCooldown)
        if (ENEMYTYPES[i].isActive) {
            ENEMYTYPES[i].spawnCooldown--;
            if (ENEMYTYPES[i].spawnCooldown <= 0) {
                ENEMYTYPES[i].spawnCooldown = Math.random() * ENEMYTYPES[i].randomTimer + ENEMYTYPES[i].baseTimer;
                ENEMYTYPES[i].spawnCooldown /= 1 + gameState.timeElapsed * gameState.SCALE;
                //console.log(ENEMYTYPES[0]+" "+this.index)                                                                                        
                const newEnemy = new ENEMYTYPES[i](ENEMYTYPES[i].speed, ENEMYTYPES[i].health);
                if (newEnemy.index == 6) {
                    const shield = new EnemyShield(0, 1000, newEnemy);
                    gameState.enemies.push(shield);
                }
                let multiplier=1;
                switch(gameState.currentWave){
                    case 8:
                        multiplier=1.2;
                        break;
                    case 9:
                        multiplier=1.4;
                        break;
                    case 10:
                        multiplier=1.7;
                        break;
                    case 11:
                        multiplier=2;
                        break;
                }
                newEnemy.health*=multiplier;
                newEnemy.health = Math.ceil(newEnemy.health);
                newEnemy.maxHealth = newEnemy.health
                gameState.enemies.push(newEnemy);
            }
        }
    }
    gameState.xpBagTimer--;
    gameState.healthPotionSpawnTimer--;
    let collectables = gameState.collectables;
    if (gameState.xpBagTimer < 0) {
        gameState.xpBagTimer = Math.random() * 200 + 200;
        gameState.xpBagTimer /= 1 + gameState.timeElapsed * 0.0003;
        const newCollectable = new XPBag(Math.random() * (2000 - 2000 / 10) + 2000 / 20, Math.random() * (1100 - 1100 / 10) + 1100 / 20);
        collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    if (gameState.healthPotionSpawnTimer < 0) {
        gameState.healthPotionSpawnTimer = Math.random() * 300 + 450;
        gameState.healthPotionSpawnTimer /= 1 + gameState.timeElapsed * 0.0003;
        //healthPotionSpawnTimer*=healthPotionSpawnMultiplier;
        const newCollectable = new HealthPotion(Math.random() * (2000 - 2000 / 10) + 2000 / 20, Math.random() * (1100 - 1100 / 10) + 1100 / 20);
        collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    //console.log(enemies.length, enemies.filter(e => e.explodeTimer > 0).length);
    if (gameState.sharedXP >= gameState.nextLevel && gameState.currentPage !== "upgradePage") {
        gameState.playerLevel++;
        if (gameState.playerLevel < 6) {
            gameState.nextLevel *= 1.5;
        }
        else if (gameState.playerLevel < 12) {
            gameState.nextLevel *= 1.3;
        }
        else {
            gameState.nextLevel *= 1.2;
        }
        for (let id in players) {
            let player = players[id];
            if (player.index == 5) {
                player.rebirth++;
            }
        }
        // if(chosenCharacter==6){
        //     player.rebirth++;
        // }
        //console.log(player.nextLevel+" "+player.level);
        gameState.sharedXP = 0;
        for (id in players) {
            players[id].health = Math.min(players[id].health + 5, players[id].maxHealth);
        }

        // console.log(player.currentExp+" "+player.nextLevel);
        //this.image2.style.width=(player.currentExp/player.nextLevel*400)+"px";
        gameState.currentPage = "upgradePage";

    }
    for (let i = collectables.length - 1; i >= 0; i--) {
        collectables[i].act(playerList, gameState.floatingObjects);
        if (collectables[i].dead) {
            if (collectables[i].index == 0) {
                gameState.sharedXP += collectables[i].size / 2 * (1 + gameState.playerLevel * gameState.playerLevel / 5 * 0.15)
            }
            collectables.splice(i, 1);
        }
    }
    let won = false;
    if(Object.keys(gameState.players).length==0){
        for(let id in gameState.deadPlayers){
            deadPlayers.push(id);
        }
    }
    if (gameState.currentWave == 12) {
        for (let id in players) {
            deadPlayers.push(id);
        }
        won = true;

    }
    
    if (gameState.timeElapsed > 2000 && gameState.isBossWave == false) {
        [gameState.isBossWave, gameState.bossesLeft, gameState.currentWave, gameState.SCALE] = ChangeWave(gameState);
        gameState.timeElapsed = 0;
        console.log(gameState.deadPlayers)
        for(let id in gameState.deadPlayers){
            players[id]=gameState.deadPlayers[id];
            players[id].dead=false;
            players[id].health=players[id].maxHealth/2;
            players[id].x=1000;
            players[id].y=550;
            delete gameState.deadPlayers[id];
        }
    }

    return [deadPlayers, won];
}

module.exports = { addPlayer, removePlayer, MultiplayerGameLogic, createGameState, createGame, addPlayer };