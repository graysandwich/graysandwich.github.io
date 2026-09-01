

function increaseDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"damage", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 0, amount:0.5});
    }
    else{
        player.damage += amount;
        player.boughtUpgrades[0]+=0.5;
    }
    boughtTier2Upgrades[0]+=0.5;
    
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
    }
    else{
        player.siphon += amount;
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
    }
    else{
        let temp = new TimeWarpIcon(50, player.abilities.length)
        player.abilities.push(temp)
        gameState.abilityIcons.push(temp);
        player.boughtUpgrades[25] = 0;
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
    for (let i = 0; i < numGambles; i++) {
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
}
function AddProtectorBullet(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"protectorBullet", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 27, amount:-1});
    }
    else{

        gameState.bullets.push(new ProtectorBullet(1, player, gameState.protectorBullets));
        gameState.bullets.push(new ProtectorBullet(1, player, gameState.protectorBullets));
        ProtectorBullet.Spacing(player, gameState.protectorBullets);
    }
    player.boughtUpgrades[27]=0;
    ChangePage('gamePage', false)
}
function AddShield(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "object", stat:"playerShield", amount:amount});
        socket.emit("changeBoughtUpgrades", {index: 14, amount:1});
    }
    else{
        for (let i = 0; i < amount; i++) {
            let temp=new PlayerShield(50, player);
            gameState.bullets.push(temp);
        }
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
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:red; font-size:75px; background-color:gray" id="upgrade">-3 health</div>`
                break;
            case 1:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:red; font-size:75px;background-color:gray;" id="upgrade">Decrease Speed</div>`
                break;
            case 2:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">Nothing</div>`
                break;
            case 3:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">Heal 10</div>`
                break;
            case 4:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">Increase Speed</div>`
                break;
            case 5:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+0.5 Damage</div>`
                break;
            case 6:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+2 Projectiles</div>`
                break;
            case 7:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+0.25 Lifesteal</div>`
                break;
            case 8:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:blue; font-size:75px;background-color:gray;" id="upgrade">+4 Projectiles</div>`
                break;
            case 9:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:blue; font-size:75px;background-color:gray;" id="upgrade">+20 Max Health</div>`
                break;
            case 10:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:purple; font-size:75px;background-color:gray;" id="upgrade">+1 Damage</div>`
                break;
            case 11:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:purple; font-size:75px;background-color:gray;" id="upgrade">x2 XP Gain</div>`
                break;
            case 12:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:yellow; font-size:75px;background-color:gray;" id="upgrade">+1.5 Damage</div>`
                break;
            case 13:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:yellow; font-size:75px;background-color:gray; " id="upgrade">+40 Max Health</div>`
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
                increaseMaxHealth(20, player);
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
                increaseMaxHealth(40, player);
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
function MakeIceBulletsPierce(player){
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
function PassiveSpawns(player){
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
function AddShockwave(player){
    
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
    player.rebirth+=amount;
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
        socket.emit("buyUpgrade", {type: "stat", stat:"speed", amount:amount});
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
        player.bombDamage+=4;
    }
    
    ChangePage('gamePage', false)
}
function IncreaseLaserDamage(amount, player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "stat", stat:"laserDamage", amount:amount});
    }
    else{
        player.laserDamage+=4;
    }
    ChangePage('gamePage', false)
}
function AddTimeStop(player){
    if(gamemode==100){
        socket.emit("buyUpgrade", {type: "abilityUpgrade", stat:"laserDamage", amount:amount});
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
function AddNuke(player){
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