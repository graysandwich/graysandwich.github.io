
// const createPlayer = (data) => {
//     return {
//         ...data,
//         reset(){
//                 this.dead=false;
//                 this.health=this.maxHealth/2;
//                 this.x=1000;
//                 this.y=550;
//                 this.statusEffects.invincibility=240;
//                 this.accelerationX = 0;
//                 this.accelerationY = 0;
//                 this.inputs = { up: false, down: false, left: false, right: false, ability1: false, ability2: false, ability3: false, ability4: false, ability5: false, }
        
//             },
//             takeDamage(damage, bullet, floatingObjects) {   
//                 if (this.statusEffects.invincibility > 0) {
//                     return;
//                 }
//                 if (this.shieldMaxHealth > 0) {
//                     this.shieldHealth -= damage;
//                     return;
//                 }
//                 damage *= this.damageTakenMultiplier;
//                 if (bullet.id) damage *= this.collisionDamageMultiplier;
//                 damage=Math.round(damage*100)/100;
//                 this.health -= damage;
        
//                 //console.log(this.health+" health");
//                 floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, damage, "red"));
//                 if (bullet != null && bullet.frostbite) {
//                     this.statusEffects.slow = Math.max(this.statusEffects.slow, 120);
//                 }
//                 if(bullet !=null && bullet.weakens){
//                     this.statusEffects.weaken=Math.max(this.statusEffects.weaken, 240);
//                 }
//                 if(bullet !=null && bullet.blindnessAttack){
//                     this.statusEffects.blindness=Math.max(this.statusEffects.blindness, 180);
//                 }
//                 if(this.RPGCollectables.cloner==true){
//                     this.cloneDamageCountdown-=damage;
//                     if(this.cloneDamageCountdown<=0){
//                         this.cloneDamageCountdown=20;
//                         let temp=new BuilderPlayerDecoy(1,1);
//                         temp.hasHealthBar=false;
//                         temp.invincibilityTimer=300;
//                         temp.x=this.x;
//                         temp.y=this.y;
//                         temp.index=12;
//                         temp.width=player.width*1.5;
//                         temp.height=player.height*1.5;
//                         temp.ownerIndex=player.index;
//                         gameState.players.push(temp);
//                     }
//                 }
//                 this.redTimer = 10;
//                 if (typeof window !== "undefined" && this.health <= 0 && this.rebirth > 0) {
//                     this.useRebirth(gameState.bullets);
//                 }
//                 if (this.health <= 0) {
//                     this.dead = true;
//                 }
//             },
//             useRebirth(bullets) {
        
//                 bullets.push(new Shockwave(this.x, this.y, this));
//                 this.health = this.maxHealth / 2;
//                 this.rebirth--;
//                 this.statusEffects.invincibility = 300;
//             },
//             act(enemies, bullets, floatingObjects, gameState) {
//                 if (this.frostProjectiles > 0 && this.frostProjectileCooldown <= 0) {
//                     this.frostProjectileCooldown = this.frostProjectileMaxCooldown;
//                     if (enemies.length > 0) {
//                         let closestEnemy = -1;
//                         let enemyDist = 999999;
//                         for (let i = 0; i < enemies.length; i++) {
//                             let newDist = Math.hypot(Math.abs(enemies[i].x - this.x), Math.abs(enemies[i].y - this.y));
//                             if (newDist < enemyDist && enemies[i].ignoreBullets == false) {
//                                 enemyDist = newDist;
//                                 closestEnemy = i;
//                             }
//                         }
//                         if (closestEnemy != -1) {
//                             let distanceX = Math.abs(this.x - enemies[closestEnemy].x);
//                             let distanceY = Math.abs(this.y - enemies[closestEnemy].y);
//                             let vx = 0;
//                             let vy = 0;
//                             if (distanceX == 0) {
//                                 if (this.y > enemies[closestEnemy].y) {
//                                     vy -= 5;
//                                 }
//                                 if (this.y < enemies[closestEnemy].y) {
//                                     vy += 5;
//                                 }
//                             }
//                             else {
//                                 let angle = Math.atan(distanceY / distanceX);
//                                 if (this.x > enemies[closestEnemy].x) {
//                                     vx -= 5 * Math.cos(angle);
//                                 }
//                                 if (this.y > enemies[closestEnemy].y) {
//                                     vy -= 5 * Math.sin(angle);
//                                 }
//                                 if (this.x < enemies[closestEnemy].x) {
//                                     vx += 5 * Math.cos(angle);
//                                 }
//                                 if (this.y < enemies[closestEnemy].y) {
//                                     vy += 5 * Math.sin(angle);
//                                 }
//                                 //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
//                             }
//                             bullets[bullets.length] = new FrostBullet(vx, vy, 1, this);
//                         }
//                         else {
//                             bullets[bullets.length] = new FrostBullet(5, 0, 1, this);
//                         }
        
//                     }
//                     else {
//                         bullets[bullets.length] = new FrostBullet(5, 0, 1, this);
//                     }
        
//                 }
//                 if (this.bouncingProjectiles > 0 && this.bouncingProjectileCooldown <= 0) {
//                     this.bouncingProjectileCooldown = this.bouncingProjectileMaxCooldown;
//                     if (enemies.length > 0) {
//                         let closestEnemy = -1;
//                         let enemyDist = 999999;
//                         for (let i = 0; i < enemies.length; i++) {
//                             let newDist = Math.hypot(Math.abs(enemies[i].x - this.x), Math.abs(enemies[i].y - this.y));
//                             if (newDist < enemyDist && enemies[i].ignoreBullets == false) {
//                                 enemyDist = newDist;
//                                 closestEnemy = i;
//                             }
//                         }
//                         if (closestEnemy != -1) {
//                             let distanceX = Math.abs(this.x - enemies[closestEnemy].x);
//                             let distanceY = Math.abs(this.y - enemies[closestEnemy].y);
//                             let vx = 0;
//                             let vy = 0;
//                             if (distanceX == 0) {
//                                 if (this.y > enemies[closestEnemy].y) {
//                                     vy -= 10;
//                                 }
//                                 if (this.y < enemies[closestEnemy].y) {
//                                     vy += 10;
//                                 }
//                             }
//                             else {
//                                 let angle = Math.atan(distanceY / distanceX);
//                                 if (this.x > enemies[closestEnemy].x) {
//                                     vx -= 10 * Math.cos(angle);
//                                 }
//                                 if (this.y > enemies[closestEnemy].y) {
//                                     vy -= 10 * Math.sin(angle);
//                                 }
//                                 if (this.x < enemies[closestEnemy].x) {
//                                     vx += 10 * Math.cos(angle);
//                                 }
//                                 if (this.y < enemies[closestEnemy].y) {
//                                     vy += 10 * Math.sin(angle);
//                                 }
//                                 //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
//                             }
//                             bullets[bullets.length] = new BouncingBullet(vx, vy, this.bouncingBulletDamage, this);
//                         }
//                         else {
//                             bullets[bullets.length] = new BouncingBullet(10, 0, this.bouncingBulletDamage, this);
//                         }
        
//                     }
//                     else {
//                         bullets[bullets.length] = new BouncingBullet(10, 0, this.bouncingBulletDamage, this);
//                     }
        
//                 }
//                 if (this.windProjectiles > 0 && chosenCharacter != 4 && this.windProjectileCooldown < 0) {
//                     this.windProjectileCooldown = 60;
//                     let angle = 0;
//                     for (let i = 0; i < this.windProjectiles; i++) {
//                         let temp = new WindBullet(10 * Math.cos(angle), 10 * Math.sin(angle), 0, this);
//                         bullets[bullets.length] = temp;
//                         angle += 2 * Math.PI / Math.ceil(this.windProjectiles);
//                     }
//                 }
//                 //console.log(this.slowed);
//                 if (this.inputs.ability1 && this.abilities.length > 0) {
//                     this.abilities[0].Activate(this, gameState);
//                 }
//                 if (this.inputs.ability2 && this.abilities.length > 1) {
//                     this.abilities[1].Activate(this, gameState);
//                 }
//                 if (this.inputs.ability3 && this.abilities.length > 2) {
//                     this.abilities[2].Activate(this, gameState);
//                 }
//                 if (this.inputs.ability4 && this.abilities.length > 3) {
//                     this.abilities[3].Activate(this, gameState);
//                 }
//                 if (this.inputs.ability5 && this.abilities.length > 4) {
//                     this.abilities[4].Activate(this, gameState);
//                 }
        
        
//                 if (this.slowed || this.statusEffects.slow > 0) {
//                     this.speed /= 2;
//                     ProtectorBullet.slowed = true;
//                 }
//                 else {
//                     ProtectorBullet.slowed = false;
//                 }
//                 if (this.statusEffects.speed > 0) {
//                     this.speed *= 2;
//                 }
//                 if (this.inputs.up && this.inputs.left) {
//                     this.y -= this.speed / 1.4142;
//                     this.x -= this.speed / 1.4142;
//                 } else if (this.inputs.up && this.inputs.right) {
//                     this.y -= this.speed / 1.4142;
//                     this.x += this.speed / 1.4142;
//                 } else if (this.inputs.down && this.inputs.right) {
//                     this.y += this.speed / 1.4142;
//                     this.x += this.speed / 1.4142;
//                 } else if (this.inputs.down && this.inputs.left) {
//                     this.y += this.speed / 1.4142;
//                     this.x -= this.speed / 1.4142;
//                 } else {
//                     if (this.inputs.up) this.y -= this.speed;
//                     if (this.inputs.down) this.y += this.speed;
//                     if (this.inputs.right) this.x += this.speed;
//                     if (this.inputs.left) this.x -= this.speed;
//                 }
//                 if (this.statusEffects.speed > 0) {
//                     this.speed /= 2;
//                 }
//                 this.x += this.accelerationX;
//                 this.y += this.accelerationY;
        
//                 if (this.x < mapBorders.leftBorder) this.x = mapBorders.leftBorder;
//                 if (this.y < mapBorders.topBorder) this.y = mapBorders.topBorder;
//                 if (this.x > mapBorders.rightBorder) this.x = mapBorders.rightBorder;
//                 if (this.y > mapBorders.bottomBorder) this.y = mapBorders.bottomBorder;
//                 if (this.slowed || this.statusEffects.slow > 0) this.speed *= 2;
        
//                 if (this.passiveHealingTimer <= 0 && this.passiveHealing > 0) {
//                     this.passiveHealingTimer = 300;
//                     this.Heal(this.passiveHealing, floatingObjects);
//                 }
//                 if (this.constantDamageTimer <= 0 && this.constantDamageAmount > 0) {
//                     this.constantDamageTimer = 240;
        
//                     this.takeDamage(this.constantDamageAmount, new EnemyBullet(0,0,1,0,0), floatingObjects);
//                 }
//                 if(this.regenerationTimer<=0 && this.statusEffects.regeneration>0){
//                     this.regenerationTimer=30;
//                     this.Heal(1,floatingObjects);
//                 }
//                 if(this.health<=this.maxHealth/3 && this.boughtUpgrades[37]==1 && this.regenerationAbilityCooldown<=0){
//                     this.statusEffects.regeneration=Math.max(this.statusEffects.regeneration, 240);
//                     this.regenerationAbilityCooldown=1800;
//                 }
//                 this.Timers();
//             },
//             Timers() {
//                 this.frostProjectileCooldown--;
//                 this.bulletCooldown--;
//                 this.bombTimer--;
//                 this.redTimer--;
//                 this.passiveHealingTimer--;
//                 this.windProjectileCooldown--;
//                 this.constantDamageTimer--;
//                 this.bouncingProjectileCooldown--;
//                 this.regenerationTimer--;
//                 this.accelerationX /= 1.05;
//                 this.accelerationY /= 1.05;
//                 for(let id in this.statusEffects){
//                     if(this.doublePositiveEffects && Player.positiveEffects.includes(id)){
//                         this.statusEffects[id]-=0.5;
//                     }
//                     else this.statusEffects[id]--;
//                 }
        
//             },
//             AddForce(x, y) {
//                 this.accelerationX += x;
//                 this.accelerationY += y;
//             },
//             Heal(amount, floatingObjects) {
//                 if (!this.canHeal) return;
//                 amount *= this.healMultiplier;
//                 this.health = Math.min(this.maxHealth, this.health + amount);
//                 floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, amount, "green"));
        
//             },
//             GainXP(amount) {
//                 if (gamemode == 4 || gamemode == 6) return;
//                 this.currentExp += amount * this.xpMultiplier;
//             }
//     };
// };
// function CheckContinue(){

//     let temp=localStorage.getItem("currentGamestate");
//     let tempPlayer=JSON.parse(localStorage.getItem("currentPlayer"));
//         console.log(tempPlayer  )
//     if(temp && tempPlayer){
//         document.getElementById("continueButton").disabled=false;
//         gameState=JSON.parse(temp);
//         player=createPlayer(tempPlayer);
//     }
//     else{
//         document.getElementById("continueButton").disabled=true;
//     }
// }
// CheckContinue();
// function Continue(){
    
//     const scale = Math.min(window.innerWidth / 1536, window.innerHeight / 695);
//     canvas.style.width = `${1536 * scale}px`;
//     canvas.style.height = `${695 * scale}px`;
//     canvas.width = 1536;
//     canvas.height = 695; 
//     canvas.style.display = "block";
//     gameOver = false;
//     healthBarCurrentLength = 400;
//     healthBarDesiredLength = 400;
//     levelBarCurrentLength = 0;
//     levelBarDesiredLength = 0;
//     shieldBarCurrentLength = 0;
//     shieldBarDesiredLength = 0;
//     for (let i = 0; i < boughtTier2Upgrades.length; i++) {
//         boughtTier2Upgrades[i] = 0;
//     }

//     localStorage.setItem("currentGamestate",null);
//     localStorage.setItem("currentPlayer",null);
//     ChangePage("gamePage",true,67);
//     ChangePage("pausePage",false);
// }
let openingMessages=["I promise if you ignore the graphics this game is actually fun", "If the word larp means what I think it does then I'm larping as a gamedev", "This game reached update 2.2 in 3 weeks, just saying", "If you're seeing this and don't study at [REDACTED], literally how did you get here", "Running out of ideas since update 3.2!", "Credit goes to literally the entire internet for my art assets", "Infinity War was the most ambitious crossove-", "Nothing is more permanent than a temporary solution"];
if(localStorage.getItem("BasicEnemyFound")!="true"){
    document.getElementById("splashText").innerText=openingMessages[0];
}
else{
    document.getElementById("splashText").innerText=openingMessages[Math.floor(Math.random()*openingMessages.length)];
    if(Math.random()<0.001){
        document.getElementById("splashText").innerText="Congratulations! You have found the 0.1% splash text! Have a cookie 🍪"
    }
}