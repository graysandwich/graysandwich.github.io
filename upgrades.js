function increaseDamage(amount) {
    player.damage += amount;
    if(amount==1){
        boughtUpgrades[0] = 1;
    }
    boughtTier2Upgrades[0]=1;
    
    ChangePage('gamePage', false)
}

function increaseMaxHealth(amount) {
    player.health += amount;
    player.maxHealth += amount;
    ChangePage('gamePage', false)
}

function increaseProjectiles(amount) {
    player.projectiles += amount;
    if(amount==2){
        boughtUpgrades[2] += 0.5;
    }
    boughtTier2Upgrades[2]=1;
    
    ChangePage('gamePage', false)
}

function addFrostProjectiles(amount) {
    player.frostProjectiles += amount;
    player.frostProjectileMaxCooldown = 100 / player.frostProjectiles;
    ChangePage('gamePage', false)
}
function addLaserProjectiles(amount) {
    bullets.push(new PlayerLaser(-Math.PI / 2, player.x, player.y))
    boughtUpgrades[4] = 1;
    ChangePage('gamePage', false)
}
function speedUpAttacks(amount) {
    player.attackSpeed /= amount;
    player.attackSpeedMultiplier/=amount;
    ChangePage('gamePage', false)
}
function addSiphon(amount) {
    player.siphon += amount;
    ChangePage('gamePage', false)
}
function multiplyXPGain(amount) {
    player.xpMultiplier *= amount;
    boughtUpgrades[7] =1;
    ChangePage('gamePage', false)
}
function addBomb(amount) {
    player.bombCount += amount;
    new BombIcon(50);
    boughtUpgrades[8] = 1;
    ChangePage('gamePage', false)
}
function addTimeWarp(amount) {
    player.timeWarp += amount;
    new TimeWarpIcon(50);
    boughtUpgrades[9] = 1;
    ChangePage('gamePage', false)
}
function AddPassiveHealing(amount) {
    player.passiveHealing += amount;
    ChangePage('gamePage', false)
}
function Gamble(numGambles) {
    for (let i = 0; i < numGambles; i++) {
        gambleText = document.createElement("div");
        gambleTimer = Math.floor(Math.random() * 300) + 300;
        gambleText.innerHTML = `<div></div>`;
        document.body.appendChild(gambleText);
        textSpeed = 5;
        
        choice1.remove();
        choice2.remove();

        Roll();
    }
}
function AddProtectorBullet(amount) {
    for (let i = 0; i < amount; i++) {
        bullets.push(new ProtectorBullet(1));
    }
    ProtectorBullet.Spacing();
    ChangePage('gamePage', false)
}
function AddShield(amount) {
    for (let i = 0; i < amount; i++) {
        let temp=new PlayerShield();
        temp.health=50;
        temp.maxHealth=50;
        bullets.push(temp);
    }
    boughtUpgrades[14]=1;
    ChangePage('gamePage', false)
}
function Roll() {
    if (gambleTimer % textSpeed == 0 && gambleTimer > 50) {
        let randomNum = Math.random() * 100;
        let prevChoice = gambleChoice;
        while (prevChoice == gambleChoice) {

            if (randomNum < 20) {
                gambleChoice = Math.floor(Math.random() * 2);
            }
            else if (randomNum < 60) {
                gambleChoice = Math.floor(Math.random() * 3) + 2;
            }
            else if (randomNum < 80) {
                gambleChoice = Math.floor(Math.random() * 3) + 5;
            }
            else if (randomNum < 90) {
                gambleChoice = Math.floor(Math.random() * 2) + 8;
            }
            else if (randomNum < 97) {
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
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:red; font-size:75px;background-color:gray;" id="upgrade">-1 Speed</div>`
                break;
            case 2:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">Nothing</div>`
                break;
            case 3:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">Heal 10</div>`
                break;
            case 4:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">+2 Speed</div>`
                break;
            case 5:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+1 Damage</div>`
                break;
            case 6:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+2 Projectiles</div>`
                break;
            case 7:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+0.25 Siphon</div>`
                break;
            case 8:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:blue; font-size:75px;background-color:gray;" id="upgrade">+4 Projectiles</div>`
                break;
            case 9:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:blue; font-size:75px;background-color:gray;" id="upgrade">+20 Max Health</div>`
                break;
            case 10:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:purple; font-size:75px;background-color:gray;" id="upgrade">+2 Damage</div>`
                break;
            case 11:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:purple; font-size:75px;background-color:gray;" id="upgrade">x3 XP multiplier</div>`
                break;
            case 12:
                gambleText.innerHTML = `<div style="position:absolute;left:${canvas.width / 2 - 200}px; transform:translateX(-50%); top:300px; z-index:3; color:yellow; font-size:75px;background-color:gray;" id="upgrade">+3 Damage</div>`
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
                increaseDamage(1);
                break;
            case 6:
                increaseProjectiles(2);
                break;
            case 7:
                addSiphon(0.25);
                break;
            case 8:
                increaseProjectiles(4);
                break;
            case 9:
                increaseMaxHealth(20);
                break;
            case 10:
                increaseDamage(2);
                break;
            case 11:
                multiplyXPGain(3);
                break;
            case 12:
                increaseDamage(3);
                break;
            case 13:
                increaseMaxHealth(40);
                break;
        }
    }
}
function TradeoffDeal(amount) {
    player.damageMultiplier *= amount;
    player.damageTakenMultiplier *= amount;
    boughtUpgrades[13] = true;
    ChangePage('gamePage', false)
}
function BulletDeleterAbility(amount) {
    
    new BulletDeleterIcon(50);
    boughtUpgrades[15] = 1;
    ChangePage('gamePage', false)
}
function IncreaseProjectileSize(amount) {
    player.projectileSizeMultiplier *=amount;
    boughtUpgrades[16]+=0.5;
    ChangePage('gamePage', false)
}
function HalveCollisionDamage(amount) {
    player.collisionDamageMultiplier *=amount;
    boughtTier2Upgrades[3]=1;
    ChangePage('gamePage', false)
}