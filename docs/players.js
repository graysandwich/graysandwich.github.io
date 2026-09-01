
// class Player {
//     static unlocked=false;
//     constructor(health) {
//         this.image = new Image();
//         this.image.src="images/player.webp";
//         this.speed = 5;
//         this.x = 2000 / 2;
//         this.y = 1100 / 2;
//         this.width = 50;
//         this.height = 50;
//         this.currentExp = 0;
//         this.nextLevel = 100;
//         this.damage = 1;
//         this.health = health;
//         this.maxHealth = health;
//         this.projectiles = 4;
//         this.slowed = false;
//         this.frostProjectiles = 0;
//         this.frostProjectileCooldown = 60;
//         this.frostProjectileMaxCooldown = 80;
//         this.laserProjectiles = 0;
//         this.slowCountdown = 0;
//         this.attackSpeed = 30;
//         this.bulletCooldown = 0;
//         this.siphon = 0;
//         this.redTimer = 0;
//         this.bombTimer = 1;
//         this.bombCount = 0;
//         this.xpMultiplier = 1;
//         this.accelerationX = 0;
//         this.accelerationY = 0;
//         this.timeWarpTimer = 0;
//         this.timeWarp = 0;
//         this.passiveHealing = 0;
//         this.passiveHealingTimer = 0;
//         this.damageMultiplier = 1;
//         this.damageTakenMultiplier = 1;
//         this.level = 1;
//         this.healMultiplier=1;
//         this.attackSpeedMultiplier=1;
//         this.projectileSizeMultiplier=1;
//         this.collisionDamageMultiplier=1;
//         this.iceBulletsPierce=false;
//         this.rebirth=0;
//         this.rebirthTimer=0;
//         this.windProjectiles=0;
//         this.windProjectileCooldown=60;
//         this.slowedDamageMultiplier=1;
//         this.bombDamage=4;
//         this.laserDamage=1;
//         this.maxHealthHalved=false;
//         this.originalMaxHealth=this.maxHealth;
//         this.canHeal=true;
//         this.constantDamageAmount=0;
//         this.constantDamageTimer=150;
//         this.bouncingProjectiles=0;
//         this.bouncingProjectileCooldown=0;
//         this.bouncingProjectileMaxCooldown = 120;
//         this.protectorDamage=1;
//         this.bouncingBulletDamage=1;
//     }
//     takeDamage(damage, bullet) {
//         if(this.rebirthTimer>0){
//             return;
//         }
//         console.log(bullet);
//         console.log(damage);
//         if(gameOver)return;
//         if(bullet!=null && bullet.isEnemy){
//             damage*=this.collisionDamageMultiplier;
//         }
//         if(playerShield!=null){
//             playerShield.takeDamage(damage);
//             return;
//         }
//         damage *= this.damageTakenMultiplier;
//         this.health -= damage;
        
//         //console.log(this.health);
//         floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"red"));
//         if (bullet!=null && bullet.frostbite) {
//             this.slowCountdown = Math.max(this.slowCountdown, 120);
//         }
//         this.redTimer = 10;
//         if(this.health<=0 && this.rebirth>0){
//             bullets.push(new Shockwave(this.x, this.y));
//             this.health=this.maxHealth/2;
//             this.rebirth--;
//             this.rebirthTimer=300;
//         }
//     }
//     act() {
//         if(gameOver)return;
//         if (this.frostProjectiles > 0 && this.frostProjectileCooldown <= 0) {
//             this.frostProjectileCooldown = this.frostProjectileMaxCooldown;
//             if (enemies.length > 0) {
//                 let closestEnemy = -1;
//                 let enemyDist = 999999;
//                 for (let i = 0; i < enemies.length; i++) {
//                     let newDist = Math.hypot(Math.abs(enemies[i].x - this.x), Math.abs(enemies[i].y - this.y));
//                     if (newDist < enemyDist && enemies[i].ignoreBullets == false) {
//                         enemyDist = newDist;
//                         closestEnemy = i;
//                     }
//                 }
//                 if (closestEnemy != -1) {
//                     let distanceX = Math.abs(this.x - enemies[closestEnemy].x);
//                     let distanceY = Math.abs(this.y - enemies[closestEnemy].y);
//                     let vx = 0;
//                     let vy = 0;
//                     if (distanceX == 0) {
//                         if (this.y > enemies[closestEnemy].y) {
//                             vy -= 5;
//                         }
//                         if (this.y < enemies[closestEnemy].y) {
//                             vy += 5;
//                         }
//                     }
//                     else {
//                         let angle = Math.atan(distanceY / distanceX);
//                         if (this.x > enemies[closestEnemy].x) {
//                             vx -= 5 * Math.cos(angle);
//                         }
//                         if (this.y > enemies[closestEnemy].y) {
//                             vy -= 5 * Math.sin(angle);
//                         }
//                         if (this.x < enemies[closestEnemy].x) {
//                             vx += 5 * Math.cos(angle);
//                         }
//                         if (this.y < enemies[closestEnemy].y) {
//                             vy += 5 * Math.sin(angle);
//                         }
//                         //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
//                     }
//                     bullets[bullets.length] = new FrostBullet(vx, vy, 1);
//                 }
//                 else {
//                     bullets[bullets.length] = new FrostBullet(5, 0, 1);
//                 }

//             }
//             else {
//                 bullets[bullets.length] = new FrostBullet(5, 0, 1);
//             }

//         }
//         if (this.bouncingProjectiles > 0 && this.bouncingProjectileCooldown <= 0) {
//             this.bouncingProjectileCooldown = this.bouncingProjectileMaxCooldown;
//             if (enemies.length > 0) {
//                 let closestEnemy = -1;
//                 let enemyDist = 999999;
//                 for (let i = 0; i < enemies.length; i++) {
//                     let newDist = Math.hypot(Math.abs(enemies[i].x - this.x), Math.abs(enemies[i].y - this.y));
//                     if (newDist < enemyDist && enemies[i].ignoreBullets == false) {
//                         enemyDist = newDist;
//                         closestEnemy = i;
//                     }
//                 }
//                 if (closestEnemy != -1) {
//                     let distanceX = Math.abs(this.x - enemies[closestEnemy].x);
//                     let distanceY = Math.abs(this.y - enemies[closestEnemy].y);
//                     let vx = 0;
//                     let vy = 0;
//                     if (distanceX == 0) {
//                         if (this.y > enemies[closestEnemy].y) {
//                             vy -= 10;
//                         }
//                         if (this.y < enemies[closestEnemy].y) {
//                             vy += 10;
//                         }
//                     }
//                     else {
//                         let angle = Math.atan(distanceY / distanceX);
//                         if (this.x > enemies[closestEnemy].x) {
//                             vx -= 10 * Math.cos(angle);
//                         }
//                         if (this.y > enemies[closestEnemy].y) {
//                             vy -= 10 * Math.sin(angle);
//                         }
//                         if (this.x < enemies[closestEnemy].x) {
//                             vx += 10 * Math.cos(angle);
//                         }
//                         if (this.y < enemies[closestEnemy].y) {
//                             vy += 10 * Math.sin(angle);
//                         }
//                         //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
//                     }
//                     bullets[bullets.length] = new BouncingBullet(vx, vy, this.bouncingBulletDamage);
//                 }
//                 else {
//                     bullets[bullets.length] = new BouncingBullet(10, 0, this.bouncingBulletDamage);
//                 }

//             }
//             else {
//                 bullets[bullets.length] = new BouncingBullet(10, 0, this.bouncingBulletDamage);
//             }

//         }
//         if(this.windProjectiles>0 && chosenCharacter!=4 && this.windProjectileCooldown<0){
//             this.windProjectileCooldown=60;
//             let angle = 0;
//             for (let i = 0; i < this.windProjectiles; i++) {
//                 let temp=new WindBullet(10 * Math.cos(angle), 10 * Math.sin(angle), 0);
//                 bullets[bullets.length] = temp;
//                 angle += 2 * Math.PI / this.windProjectiles;
//             }
//         }
//         //console.log(this.slowed);
//         if (this.slowed || this.slowCountdown > 0) {
//             this.speed /= 2;
//             ProtectorBullet.slowed=true;
//         }
//         else{
//             ProtectorBullet.slowed=false;
//         }
//         if (timeWarpCounter > 0) {
//             this.speed *= 2;
//         }
//         if (movingUp && movingLeft) {
//             this.y -= this.speed / 1.4142;
//             this.x -= this.speed / 1.4142;
//         }
//         else if (movingUp && movingRight) {
//             this.y -= this.speed / 1.4142;
//             this.x += this.speed / 1.4142;
//         }
//         else if (movingDown && movingRight) {
//             this.y += this.speed / 1.4142;
//             this.x += this.speed / 1.4142;
//         }
//         else if (movingDown && movingLeft) {
//             this.y += this.speed / 1.4142;
//             this.x -= this.speed / 1.4142;
//         }
//         else {
//             if (movingUp) {
//                 this.y -= this.speed;
//             }
//             if (movingDown) {
//                 this.y += this.speed;
//             }
//             if (movingRight) {
//                 this.x += this.speed;
//             }
//             if (movingLeft) {
//                 this.x -= this.speed;
//             }
//         }
//         this.x += this.accelerationX;
//         this.y += this.accelerationY;

//         if (this.x < leftBorder) this.x = leftBorder;
//         if (this.y < topBorder) this.y = topBorder;
//         if (this.x > rightBorder) this.x = rightBorder;
//         if (this.y > bottomBorder) this.y = bottomBorder;
//         if (this.slowed || this.slowCountdown > 0) this.speed *= 2;
//         if (timeWarpCounter > 0) {
//             this.speed /= 2;
//         }
//         if (this.passiveHealingTimer <= 0 && this.passiveHealing > 0) {
//             this.passiveHealingTimer = 300;

//             this.Heal(this.passiveHealing);
//         }
//         if (this.constantDamageTimer <= 0 && this.constantDamageAmount > 0) {
//             this.constantDamageTimer = 240;

//             this.takeDamage(this.constantDamageAmount, null);
//         }
//         this.Timers();
//     }
//     Timers() {
//         this.frostProjectileCooldown--;
//         this.slowCountdown--;
//         this.bulletCooldown--;
//         this.bombTimer--;
//         this.timeWarpTimer--;
//         this.redTimer--;
//         this.passiveHealingTimer--;
//         this.rebirthTimer--;
//         this.windProjectileCooldown--;
//         this.constantDamageTimer--;
//         this.bouncingProjectileCooldown--;
//         this.accelerationX /= 1.05;
//         this.accelerationY /= 1.05;

//     }
//     AddForce(x, y) {
//         this.accelerationX += x;
//         this.accelerationY += y;
//     }
//     draw() {
//         if (this.dead) return;
//         ctx.save();
//         if (this.rebirthTimer > 0) {
//             ctx.globalCompositeOperation = 'source-over';
//             ctx.filter = 'brightness(500%)';
//             ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//         }
//         else if(this.healTimer>0){
//             ctx.globalCompositeOperation = 'source-over';
//             ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//             ctx.globalCompositeOperation = 'multiply';
//             ctx.fillStyle = 'lime';
//             ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//         }
//         else if (this.redTimer > 0) {
//             ctx.globalCompositeOperation = 'source-over';
//             ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//             ctx.globalCompositeOperation = 'multiply';
//             ctx.fillStyle = 'rgba(84, 0, 0, 0.6)';
//             ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//         }
//         else if (this.slowCountdown > 0 || this.slowed==true) {
//             ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//             ctx.globalCompositeOperation = 'multiply';
//             ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
//             ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//         }
//         else {
//             ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//         }

//         ctx.restore();
//     }
//     Heal(amount){
//         if(!this.canHeal)return;
//         amount*=this.healMultiplier;
//         this.health = Math.min(this.maxHealth, this.health+amount);
//         floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,amount,"green"));

//     }
//     GainXP(amount){
//         if(gamemode==4 || gamemode==6)return;
//         this.currentExp+=amount*this.xpMultiplier;
//     }
// }



