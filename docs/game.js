

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// class Enemy {
//     static isActive = false;
//     static seen = false;
//     static spawnCooldown=0;
//     static baseTimer=0;
//     static randomTimer=0;
//     static index=0;
//     static health=0;
//     static speed=0;
//     static healthMultiplier=1;
//     static speedMultiplier=1;
//     constructor(speed, health) {
//         this.image = new Image();
//         this.image.src = 'images/enemy.webp';
//         this.speed = speed;
//         this.health = health;
//         this.maxHealth=health;
//         this.isBoss = false;
//         this.isEnemy=true;
//         this.value = 30;
//         if (Math.random() < 0.5) {
//             this.y = Math.random() * 1100;
//             if (Math.random() < 0.5) {
//                 this.x = leftBorder-200;
//             }
//             else {
//                 this.x = rightBorder + 200;
//             }
//         }
//         else {
//             this.x = Math.random() * 2000;
//             if (Math.random() < 0.5) {
//                 this.y = topBorder -200;
//             }
//             else {
//                 this.y = bottomBorder + 200;
//             }
//         }
//         this.width = 50;
//         this.height = 50;

//         this.ignoreBullets = false;
//         this.ignoreShield=false;
//         this.giveXP = true;
//         this.redTimer = 0;
//         this.slowCountdown = -1;
//         this.canSiphon = true;
//         this.accelerationX=0;
//         this.accelerationY=0;
//         this.speedTimer=0;
//         this.knockbackIFrame=0;
//         this.hasHealthBar=true;
//         this.healTimer=0;
//         this.dead=false;
//         this.ignoreKnockback=false;
//         if(this.isBoss) this.ignoreKnockback=true;
//         let multiplier=1;
//         switch(currentWave){
//             case 8:
//                 multiplier=1.2;
//                 break;
//             case 9:
//                 multiplier=1.4;
//                 break;
//             case 10:
//                 multiplier=1.7;
//                 break;
//             case 11:
//                 multiplier=2;
//                 break;
//         }
//         multiplier*=Enemy.healthMultiplier;
//         this.health*=multiplier;
//         this.maxHealth*=multiplier;
//         this.speed*=Enemy.speedMultiplier
//         this.health=Math.ceil(this.health);
//         this.maxHealth=Math.ceil(this.maxHealth);
//         //console.log(this.image);
//     }
//     draw() {
//         if (this.dead) return;
//         ctx.save();
//         if(this.isBoss){

//             ctx.lineWidth = 5;
//             ctx.strokeStyle = "blue";
//             ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//         }
//         else{
//             if(showHealthBars && this.hasHealthBar){
//                 ctx.fillStyle = "red";
//                 ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, this.width*1.5, 15)
//                 ctx.fillStyle = "green";
//                 ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, (this.width*1.5)/this.maxHealth*this.health, 15)
//             }
//         }
//         if(this.healTimer>0){
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
//         else if (this.slowCountdown > 0) {
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
//     move() {
//         let distanceX = Math.abs(this.x - player.x);
//         let distanceY = Math.abs(this.y - player.y);
//         if (this.slowCountdown > 0) {
//             this.speed /= 2;
//         }
//         if (this.speedTimer > 0) {
//             this.speed *= 2;
//         }
//         if (distanceX == 0) {
//             if (this.y > player.y) {
//                 this.y -= this.speed;
//             }
//             if (this.y < player.y) {
//                 this.y += this.speed;
//             }
//         }
//         else {
//             let angle = Math.atan(distanceY / distanceX);
//             if (this.x > player.x) {
//                 this.x -= this.speed * Math.cos(angle);
//             }
//             if (this.y > player.y) {
//                 this.y -= this.speed * Math.sin(angle);
//             }
//             if (this.x < player.x) {
//                 this.x += this.speed * Math.cos(angle);
//             }
//             if (this.y < player.y) {
//                 this.y += this.speed * Math.sin(angle);
//             }
//             //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
//         }
//         this.x+=this.accelerationX;
//         this.y+=this.accelerationY;
//         this.accelerationX/=1.05;
//         this.accelerationY/=1.05;
//         this.knockbackIFrame--;
//         //console.log(this.redTimer);
//         if (this.slowCountdown > 0) {
//             this.speed *= 2;
//             this.slowCountdown--;
//         }
//         if (this.speedTimer > 0) {
//             this.speed /= 2;
//             this.speedTimer--;
//         }
//         if(this.redTimer>0)this.redTimer--;
//         this.healTimer--;
//         this.checkForCollisions();
//     }

//     Heal(amount){
//         let temp=Math.min(amount,this.maxHealth-this.health);
//         this.health=Math.min(this.maxHealth,this.health+amount);
//         if(temp!=0)floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,temp,"lime"));
//         this.healTimer=10;
//         if (this.isBoss) {
//             this.bossBar.Update();
//         }
//     }
//     checkForCollisions() {
//         if(this.isBoss && 
//             (player.x - player.width / 2) < (this.x + this.width / 2) &&
//             (player.x + player.width / 2) > (this.x - this.width / 2) &&
//             (player.y - player.height / 2) < (this.y + this.height / 2) &&
//             (player.y + player.height / 2) > (this.y - this.height / 2) && this.knockbackIFrame <= 0)
//         {
//             player.takeDamage(2, this);
//             if (this.x > player.x) {
//                 player.AddForce(-15, 0);
//             }
//             if (this.x < player.x) {

//                 player.AddForce(15, 0);
//             }
//             if (this.y > player.y) {

//                 player.AddForce(0, -15);
//             }
//             if (this.y < player.y) {

//                 player.AddForce(0, 15);
//             }
//             this.knockbackIFrame = 15;

//         }
//         else if (!this.isBoss &&
//             (player.x - player.width / 2) < (this.x + this.width / 2) &&
//             (player.x + player.width / 2) > (this.x - this.width / 2) &&
//             (player.y - player.height / 2) < (this.y + this.height / 2) &&
//             (player.y + player.height / 2) > (this.y - this.height / 2) && !this.dead
//         ) {
//             if (this.isBoss) player.takeDamage(this.health, this);
//             else player.takeDamage(Math.min(5, this.health), this);
//             this.dead = true;
//             this.giveXP = false;
//             if (this.isBoss) {
//                 this.bossBar.image1.remove();
//                 this.bossBar.image2.remove();
//                 this.bossText.remove();
//                 bossesLeft--;
//             }
//         }
//     }
//     CheckForCramming(){
//         if(this.ignoreBullets==true){
//             return;
//         }
//         for(let i=0;i<enemies.length;i++){
//             if(!enemies[i].ignoreKnockback && !enemies[i].ignoreBullets && !enemies[i].isBoss){
//                 if (
//                     (enemies[i].x - enemies[i].width / 2.5) < (this.x + this.width / 2.5) &&
//                     (enemies[i].x + enemies[i].width / 2.5) > (this.x - this.width / 2.5) &&
//                     (enemies[i].y - enemies[i].height / 2.5) < (this.y + this.height / 2.5) &&
//                     (enemies[i].y + enemies[i].height / 2.5) > (this.y - this.height / 2.5)
//                 ) {
//                     if (this.x > enemies[i].x) {
//                         enemies[i].AddForce(-0.5, 0);
//                     }
//                     if (this.x < enemies[i].x) {

//                         enemies[i].AddForce(0.5, 0);
//                     }
//                     if (this.y > enemies[i].y) {

//                         enemies[i].AddForce(0, -0.5);
//                     }
//                     if (this.y < enemies[i].y) {

//                         enemies[i].AddForce(0, 0.5);
//                     }
//                 }
//             }
//         }
//     }
//     special() {
//     }
//     takeDamage(bullet) {
//         let damage = bullet.damage * player.damageMultiplier;
//         if(this.slowCountdown>0) damage*=player.slowedDamageMultiplier
//         if(damage==0)return
//         this.health -= damage;
//         //console.log(this.health);
//         if(bullet.frostbite){
//             this.slowCountdown=200;
//             floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"cyan"));
//         }
//         else{
//             floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"orange"));
//         }
//         this.redTimer = 10;

//         if (this.health <= 0) this.dead = true;
//         if (this.isBoss) {
//             this.bossBar.Update();
//         }
//         if (this.dead) {
//             //enemies[index].image.remove();
//             if (this.shield) {
//                 this.shield.dead = true;
//             }


//         }
//     }

//     AddForce(x, y) {
//         if(this.isBoss){
//             x/=2;
//             y/=2;
//         }
//         this.accelerationX += x;
//         this.accelerationY += y;
//     }
// static Spawn(){
//     this.spawnCooldown--;
//     if(this.spawnCooldown<=0 ){
//         this.spawnCooldown = Math.random() * this.randomTimer + this.baseTimer;
//         this.spawnCooldown /= 1 + timeElapsed * SCALE;
//         //console.log(ENEMYTYPES[0]+" "+this.index)
//         const newEnemy = new ENEMYTYPES[this.index](this.speed, this.health);
//         enemies[enemies.length] = newEnemy;
//     }
// }
// }





//First Tier 2 Boss









/*
^ ENEMIES

v PLAYER BULLETS
*/


// class Bullet {
//     constructor(speedX, speedY, damage) {
//         this.image = new Image();
//         this.image.src = 'images/bullet.webp';
//         this.speedX = speedX;
//         this.speedY = speedY;
//         this.x = player.x;
//         this.y = player.y;
//         this.damage = damage;
//         this.width = 10;
//         this.height = 10;
//         this.width*=player.projectileSizeMultiplier;
//         this.height*=player.projectileSizeMultiplier;
//         // console.log(player.projectileSizeMultiplier)
//         // console.log(this.width)
//         this.frostbite = false;
//         this.slowed = false;
//         this.slowCountdown=0;
//     }
//     move() {
//         this.slowCountdown--;
//         if (this.slowed || this.slowCountdown>0) {
//             this.x += this.speedX / 3;
//             this.y += this.speedY / 3;
//         }
//         else {
//             this.x += this.speedX;
//             this.y += this.speedY;
//         }
//         for (let i = enemies.length - 1; i >= 0; i--) {

//             if (
//                 (enemies[i].x - enemies[i].width / 2) < (this.x + this.width / 2) &&
//                 (enemies[i].x + enemies[i].width / 2) > (this.x - this.width / 2) &&
//                 (enemies[i].y - enemies[i].height / 2) < (this.y + this.height / 2) &&
//                 (enemies[i].y + enemies[i].height / 2) > (this.y - this.height / 2) && enemies[i].ignoreBullets == false
//             ) {
//                 //console.log(enemies[i]+" "+this.damage);
//                 enemies[i].takeDamage(this);
//                 this.dead = true;
//             }
//         }
//         if (this.x < leftBorder-20 || this.y < topBorder-20 || this.x > rightBorder + 20 || this.y >= bottomBorder + 20) {
//             this.dead = true;
//         }
//     }

//     draw() {
//         if (this.dead) return;
//         ctx.save();
//         ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);


//         ctx.restore();
//     }
// }






/*
^ PLAYER BULLETS

v ENEMY BULLETS
*/



/*
^ ENEMY BULLETS

v COLLECTABLES
*/



//Tier 1: Enemy, ShooterEnemy, AimingEnemy, HomingEnemy
//Tier 2: ChargingEnemy, ShieldEnemy
//Boss: LaserBoss, IceBoss



function loop() {
    let timeChange = (Date.now() - lastTime) / 1000
    lastTime = Date.now();
    accumulator += timeChange;
    accumulator = Math.min(accumulator, frameRate * 4);
    //console.log(accumulator);
    while (accumulator > frameRate) {

        GameLogic();
        accumulator -= frameRate;

    }
    if (page == "gamePage") {
        requestAnimationFrame(loop);
    }
}
function GameLogic() {

    if (gameOver == false) {
        Actions();

    }
    Draw();
    //console.log(enemyBullets.length);


}
function Draw() {

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let cameraX = 0;
    let cameraY = 0;

    cameraX = (2000 / 2) - player.x - 200;
    cameraY = (1100 / 2) - player.y - 100;

    ctx.translate(cameraX, cameraY);
    if (player.timeWarpCounter > 0) {
        ctx.drawImage(timeWarpBackground, mapBorders.leftBorder-50, mapBorders.topBorder-50, mapBorders.rightBorder -mapBorders.leftBorder+ 100, mapBorders.bottomBorder-mapBorders.topBorder + 100);
    }
    else {
        ctx.drawImage(backgroundImage, mapBorders.leftBorder-50, mapBorders.topBorder-50, mapBorders.rightBorder-mapBorders.leftBorder + 100, mapBorders.bottomBorder-mapBorders.topBorder + 100);
    }


    let mapObjects = gameState.mapObjects || [];
    for (let i = mapObjects.length - 1; i >= 0; i--) {
        switch(mapObjects[i].index){
            case 0:
                drawWall(mapObjects[i]);
                break;
            default:
                mapObjects[i].draw();
                break;

        }

    }
    let collectables = gameState.collectables || [];
    for (let i = 0; i < collectables.length; i++) {
        drawCollectable(collectables[i], collectableImages[collectables[i].index]);
    }
    let bullets = gameState.bullets || [];
    for (let i = 0; i < bullets.length; i++) {
        switch (bullets[i].index) {
            case 0:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 1:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 2:
                drawPlayerLaser(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 3:
                if (bullets[i].shootTimer > 0) {
                    drawBullet(bullets[i], bulletImages[bullets[i].index]);
                }
                else {
                    drawBullet(bullets[i], otherImages.playerBombExploded);
                }
                break;
            case 4:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 5:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 6:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 7:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 8:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 9:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 10:
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 11:
                ctx.save();
                ctx.filter = "brightness(500%)"
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                ctx.restore();
                break;
            case 12:
                console.log(bullets[i])
                drawBullet(bullets[i], bulletImages[bullets[i].index]);
                break;
            case 13:
                ctx.save();
                ctx.filter = "grayscale(100%)";
                drawBullet(bullets[i], enemyImages[bullets[i].imageIndex]);
                ctx.restore();
                break;
            case 14:
                if (bullets[i].shootTimer > 0) {
                    drawBullet(bullets[i], bulletImages[bullets[i].index]);
                }
                else {
                    drawBullet(bullets[i], otherImages.playerBombExploded);
                }
                break;
        }
    }
    let enemyBullets = gameState.enemyBullets || [];
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        switch (enemyBullets[i].index) {
            case 0:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 1:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 2:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 3:
                if (enemyBullets[i].explodeTimer > 0) {
                    drawEnemy(enemyBullets[i], otherImages.poisonBombExploded);
                }
                else {
                    drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                }
                break;
            case 4:
                drawBlackHole(enemyBullets[i], enemyBulletImages[enemyBullets[i].index], otherImages.blackHoleBackground);
                break;
            case 5:
                drawLaser(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 6:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 7:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 8:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 9:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 10:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 11:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 12:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 13:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 14:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 15:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 16:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 17:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 18:
                ctx.save();
                ctx.filter = "brightness(200%)";
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                ctx.restore();
                break;
            case 19:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 20:
                ctx.save();
                if (enemyBullets[i].explodeTimer > 0) {
                    ctx.filter = "hue-rotate(90deg)";
                    drawBullet(enemyBullets[i], otherImages.playerBombExploded);
                }
                else {
                    drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                }
                ctx.restore();
                break;
            case 21:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
            case 22:
                drawBullet(enemyBullets[i], enemyBulletImages[enemyBullets[i].index]);
                break;
        }

    }
    if (player.index == 1 && player.inputs.right) {
        drawPlayer(player, otherImages.tankPlayerMirrored);
    }
    else {
        drawPlayer(player, playerImages[player.index]);
    }

    let enemies = gameState.enemies || [];
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].isBoss) {
            switch (enemies[i].index) {
                case 0:
                    drawOutline(enemies[i]);
                    drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    break;
                case 1:
                    ctx.save();
                    drawOutline(enemies[i]);
                    ctx.globalAlpha = 0.4;
                    ctx.drawImage(otherImages.frostAura, enemies[i].x - enemies[i].frostAuraWidth / 2, enemies[i].y - enemies[i].frostAuraHeight / 2, enemies[i].frostAuraWidth, enemies[i].frostAuraHeight);
                    ctx.restore();
                    drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    break;
                case 2:
                    drawOutline(enemies[i]);
                    drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    break;
                case 3:
                    drawOutline(enemies[i]);
                    if (enemies[i].cycle == 0) {

                        drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    }
                    else if (enemies[i].cycle == 1) {

                        drawEnemy(enemies[i], otherImages.mageWaterMode);
                    }
                    else {
                        drawEnemy(enemies[i], otherImages.mageRockMode);
                    }
                    break;
                case 4:
                    drawOutline(enemies[i]);
                    if (enemies[i].health <= enemies[i].maxHealth / 3) {

                        drawEnemy(enemies[i], otherImages.bulletHellBossEnraged);
                    }
                    else {

                        drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    }
                    break;
                case 5:
                    drawOutline(enemies[i]);
                    drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    if (enemies[i].gambleTimer > -60) {
                        switch (enemies[i].currentGamble) {
                            case 1:
                                ctx.fillStyle = "white";
                                break;
                            case 2:
                                ctx.fillStyle = "green";
                                break;
                            case 3:
                                ctx.fillStyle = "blue";
                                break;
                            case 4:
                                ctx.fillStyle = "purple";
                                break;
                            case 5:
                                ctx.fillStyle = "yellow";
                                break;
                        }
                        ctx.fillRect(enemies[i].x - 20, enemies[i].y - 20, 40, 40);
                    }
                    break;
                case 6:
                    drawSnakeBoss(enemies[i], bossImages[enemies[i].index]);
                    break;
                case 7:

                    ctx.save();
                    drawOutline(enemies[i]);
                    ctx.globalAlpha = 0.4;
                    if (enemies[i].healAuraTimer > 0) {
                        ctx.drawImage(otherImages.healAura, enemies[i].x - enemies[i].healAuraHeight / 2, enemies[i].y - enemies[i].healAuraHeight / 2, enemies[i].healAuraWidth, enemies[i].healAuraHeight);
                    }
                    ctx.drawImage(otherImages.healAura, enemies[i].x - enemies[i].healAuraWidth / 2, enemies[i].y - enemies[i].healAuraHeight / 2, enemies[i].healAuraWidth, enemies[i].healAuraHeight);
                    ctx.restore();
                    if (enemies[i].isHealing) {

                        drawEnemy(enemies[i], otherImages.healerBossHealing);
                    }
                    else {
                        drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    }
                    break;
                case 8:
                    drawOutline(enemies[i]);
                    drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    break;
                case 9:
                    drawOutline(enemies[i]);
                    drawEnemy(enemies[i], bossImages[enemies[i].index]);
                    break;
                case 1000:
                    drawOutline(enemies[i]);
                    drawEnemy(enemies[i], otherImages.farmerBossCow);
                    break;
            }
            continue;
        }
        switch (enemies[i].index) {
            case 0:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 1:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 2:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 3:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 4:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 5:
                if (enemies[i].deathTimer >= 0) {
                    //console.log(otherImages.zombieEnemyDead);
                    drawEnemy(enemies[i], otherImages.zombieEnemyDead);
                }
                else {
                    drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                }
                break;
            case 6:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 7:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 8:
                drawGhostEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 9:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 10:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 11:
                if (enemies[i].trollTimer > 0) {
                    drawEnemy(enemies[i], otherImages.mimicEnemyDead, showHealthBars);
                }
                else {
                    drawEnemy(enemies[i], enemyImages[enemies[i].index], enemies[i].showHealthBar);
                }
                break;
            case 12:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 13:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 14:
                if (enemies[i].releasing == true) {

                    drawEnemy(enemies[i], otherImages.spawnPortal, showHealthBars);
                }
                else if (enemies[i].speed == 0) {
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(enemies[i].x - enemies[i].width / 2, enemies[i].y - enemies[i].height / 2, enemies[i].width, enemies[i].height);

                    drawEnemy(enemies[i], otherImages.spawner, showHealthBars);
                }
                else {
                    drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                }

                break;
            case 15:
                if (enemies[i].exploding) {
                    ctx.save();
                    ctx.filter = 'hue-rotate(90deg)';
                    drawEnemy(enemies[i], otherImages.playerBombExploded, showHealthBars);
                    ctx.restore();
                }
                else drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 16:
                drawMachineGunEnemy(enemies[i], enemyImages[enemies[i].index], enemies[i].angle, showHealthBars);
                break;
            case 17:
                ctx.lineWidth = 5;
                ctx.strokeStyle = "blue";
                //ctx.globalAlpha=0.4;
                if (!enemies[i].moving) ctx.drawImage(otherImages.smoke, enemies[i].x - enemies[i].smokeWidth / 2, enemies[i].y - enemies[i].smokeHeight / 2, enemies[i].smokeWidth, enemies[i].smokeHeight);
                ctx.strokeRect(enemies[i].x - enemies[i].width / 2, enemies[i].y - enemies[i].height / 2, enemies[i].width, enemies[i].height);
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 18:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 19:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 20:
                drawEnemy(enemies[i], enemyImages[enemies[i].index], showHealthBars);
                break;
            case 1000:
                if (enemies[i].offsetX == 0) {
                    //console.log(otherImages.zombieEnemyDead);
                    drawEnemy(enemies[i], otherImages.rotatedShield);
                }
                else {
                    drawEnemy(enemies[i], otherImages.enemyShield);
                }
                break;
            case 1001:
                ctx.save();
                ctx.lineWidth = 5;
                ctx.strokeStyle = "black";
                ctx.strokeRect(enemies[i].x - enemies[i].width / 2, enemies[i].y - enemies[i].height / 2, enemies[i].width, enemies[i].height);
                drawEnemy(enemies[i], otherImages.enemyWall, showHealthBars);
                ctx.restore();
                break;
            case 1002:
                ctx.save();
                drawOutline(enemies[i]);
                drawEnemy(enemies[i], otherImages.bouncyMinion, showHealthBars);
                ctx.restore();
                break;
            case 1003:

                if (enemies[i].width <= 0) break;
                ctx.save();
                ctx.strokeStyle = "blue";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(enemies[i].x, enemies[i].y, enemies[i].width / 2, 0, Math.PI * 2);
                ctx.stroke();
                drawEnemy(enemies[i], otherImages.snakeBossSegment);
                ctx.restore();
                break;
            case 1004:
                ctx.save();
                drawOutline(enemies[i]);
                drawEnemy(enemies[i], otherImages.sentryEngineerEnemy, showHealthBars);
                ctx.restore();
                break;
            case 1005:
                ctx.save();
                drawOutline(enemies[i]);
                drawEnemy(enemies[i], otherImages.laserEngineerEnemy, showHealthBars);
                ctx.restore();
                break;
            case 1006:
                ctx.save();
                drawOutline(enemies[i]);
                drawEnemy(enemies[i], otherImages.bombEngineerEnemy, showHealthBars);
                ctx.restore();
                break;
            case 1007:
                ctx.save();
                drawOutline(enemies[i]);
                ctx.globalAlpha = 0.4;
                ctx.drawImage(otherImages.frostAura, enemies[i].x - enemies[i].frostAuraWidth / 2, enemies[i].y - enemies[i].frostAuraHeight / 2, enemies[i].frostAuraWidth, enemies[i].frostAuraHeight);
                drawEnemy(enemies[i], otherImages.iceEngineerEnemy, showHealthBars);
                ctx.restore();
                break;
        }
    }
    let floatingObjects = gameState.floatingObjects || [];
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
    for (let i = player.abilities.length - 1; i >= 0; i--) {
        let ability = player.abilities[i];
        switch (ability.index) {
            case 0:
                if (BombIcon.version == 0) {
                    drawIcon(ability, abilityIconImages[ability.index]);
                }
                else {
                    drawIcon(ability, otherImages.nukeIcon);
                }
                break;
            case 1:
                if (TimeWarpIcon.version == 0) {
                    drawIcon(ability, abilityIconImages[ability.index]);
                }
                else {
                    drawIcon(ability, otherImages.timeStopIcon);
                }
                break;
            case 2:
                drawIcon(ability, abilityIconImages[ability.index]);
                break;
            case 3:
                if (ability.mode == 1) {
                    drawIcon(ability, abilityIconImages[ability.index]);
                }
                else if (ability.mode == 2) {
                    drawIcon(ability, otherImages.mageIceMode);
                }
                else {
                    drawIcon(ability, otherImages.mageWindMode);
                }
                break;
            case 4:
                drawIcon(ability, abilityIconImages[ability.index]);
                ctx.font = "50px Black Ops One";
                ctx.fillStyle = "black";
                ctx.fillText(ability.counterText, ability.counterTextX, ability.counterTextY);
                break;
            case 5:
                drawIcon(ability, abilityIconImages[ability.index]);
                break;
        }


    }
    if (player.index == 5) {
        drawPheonixIcon(player.icon, otherImages.pheonixPlayerIcon);
    }

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
    if(player.maxHealthHalved){
        ctx.fillRect(10, 60, healthBarCurrentLength/2, 30);
    }
    else ctx.fillRect(10, 60, healthBarCurrentLength, 30);
    if (player.rebirthTimer > 0) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillRect(10, 60, player.rebirthTimer / 300 * 400, 30);
        ctx.strokeRect(10, 60, player.rebirthTimer / 300 * 400, 30);
    }

    levelBarDesiredLength = (player.currentExp / player.nextLevel) * 400
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
    if (gameState.currentPage !== "upgradePage") {
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


    drawWaveText(gameState.waveText);

    //console.log(gameState.currentPage);
}
function SpawnEnemies() {
    if (gamemode == 0 && gameState.currentWave == 1 && gameState.timeElapsed <= 840) {
        return;
    }
    for (let i = 0; i < ENEMYTYPES.length; i++) {
        //console.log(ENEMYTYPES[i].isActive+" "+ENEMYTYPES[i].spawnCooldown)
        if (ENEMYTYPES[i].isActive) {
            ENEMYTYPES[i].spawnCooldown--;
            if (ENEMYTYPES[i].spawnCooldown <= 0) {
                ENEMYTYPES[i].spawnCooldown = Math.random() * ENEMYTYPES[i].randomTimer + ENEMYTYPES[i].baseTimer;
                ENEMYTYPES[i].spawnCooldown /= 1 + gameState.timeElapsed * gameState.SCALE;
                const newEnemy = new ENEMYTYPES[i](ENEMYTYPES[i].speed, ENEMYTYPES[i].health);
                if (newEnemy.index == 6) {
                    const shield = new EnemyShield(0, 1000, newEnemy);
                    gameState.enemies.push(shield);
                }
                gameState.enemies.push(newEnemy);
            }
        }
    }

}
function Actions() {
    if (enableShrinking) {
        mapBorders.leftBorder = initialLeftBorder + gameState.timeElapsed / 8;
        mapBorders.rightBorder = initialRightBorder - gameState.timeElapsed /8;
        mapBorders.topBorder = initialTopBorder + gameState.timeElapsed / 8;
        mapBorders.bottomBorder = initialBottomBorder - gameState.timeElapsed / 8;
        if (gameState.bossesLeft==0) {
            mapBorders.leftBorder = initialLeftBorder + gameState.timeElapsed / 2.75;
            mapBorders.rightBorder = initialRightBorder - gameState.timeElapsed / 2.75;
            mapBorders.topBorder = initialTopBorder + gameState.timeElapsed / 2.75;
            mapBorders.bottomBorder = initialBottomBorder - gameState.timeElapsed / 2.75;
        }
    }
    player.act(gameState.enemies, gameState.bullets, gameState.floatingObjects);

    SpawnEnemies();
    let bullets = gameState.bullets;
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].move(gameState.enemies, gameState);
        if (bullets[i].dead) {
            bullets.splice(i, 1);
        }
    }
    if ((player.timeWarpCounter > 0 && TimeWarpIcon.version == 1)) {
        return;
    }

    if (!(gamemode == 0 && player.level < 2) && xpBagTimer < 0) {
        xpBagTimer = Math.random() * 200 + 200;
        xpBagTimer /= 1 + timeElapsed * 0.0003;
        const newCollectable = new XPBag(Math.random() * (2000 - 2000 / 10) + 2000 / 20, Math.random() * (1100 - 1100 / 10) + 1100 / 20);
        gameState.collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    if (!(gamemode == 0 && player.level < 2) && healthPotionSpawnTimer < 0) {
        healthPotionSpawnTimer = Math.random() * 300 + 450;
        healthPotionSpawnTimer /= 1 + timeElapsed * 0.0003;
        healthPotionSpawnTimer *= healthPotionSpawnMultiplier;
        const newCollectable = new HealthPotion(Math.random() * (2000 - 2000 / 10) + 2000 / 20, Math.random() * (1100 - 1100 / 10) + 1100 / 20);
        gameState.collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    for (let i = gameState.mapObjects.length - 1; i >= 0; i--) {
        gameState.mapObjects[i].act();
    }
    let enemies = gameState.enemies;
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].dead) {
            if (enemies[i].giveXP) {
                player.GainXP(enemies[i].value);
                if (chosenCharacter == 5) {
                    enemies[i].killCredit.summonQueue.push([enemies[i].speed, enemies[i].maxHealth * 0.5, enemies[i].width, enemies[i].index])
                }
            }
            if (enemies[i].canSiphon == true && player.siphon > 0) {
                player.Heal(player.siphon, gameState.floatingObjects)
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

                    ChangePage("upgradePage", false, player);
                }
            }
            enemies.splice(i, 1);
        }
        else {
            //console.log(enemies[i]);
            enemies[i].special(gameState.enemyBullets, [player], gameState.enemies, gameState.bullets, gameState.floatingObjects);
            enemies[i].move([player], gameState.floatingObjects, gameState.enemies);

        }
    }
    let enemyBullets = gameState.enemyBullets;
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].move([player], gameState.floatingObjects, gameState.enemies);
        enemyBullets[i].special([player], gameState.enemyBullets)
        if (enemyBullets[i].dead) {
            enemyBullets.splice(i, 1);
        }

    }
    let collectables = gameState.collectables;
    for (let i = collectables.length - 1; i >= 0; i--) {
        collectables[i].act([player], gameState.floatingObjects);
        if (collectables[i].dead) {
            if (collectables[i].index == 0) {
                player.currentExp += collectables[i].size / 2 * (1 + player.level * player.level / 5 * 0.15)
            }
            collectables.splice(i, 1);
        }
    }
    let floatingObjects = gameState.floatingObjects;
    for (let i = floatingObjects.length - 1; i >= 0; i--) {
        floatingObjects[i].move();
        if (floatingObjects[i].dead) {
            floatingObjects.splice(i, 1);
        }
    }
    let playerAbilities = gameState.abilityIcons;
    for (let i = playerAbilities.length - 1; i >= 0; i--) {
        playerAbilities[i].timer();
    }
    LavaTerrain.timer();
    isLevelling = false;
    if(upgradingEnemy && currentPage=="gamePage"){
        ChangePage("upgradePage", false, player);
    }
    if (currentPage == "gamePage" && player.killedBoss == true) {
        ChangePage("upgradePage", false, player);
    }
    if (player.currentExp >= player.nextLevel && currentPage=="gamePage" && !upgradingEnemy) {
        player.level++;
        if (player.level < 6) {
            player.nextLevel *= 1.5;
        }
        else if (player.playerLevel < 12) {
            player.nextLevel *= 1.3;
        }
        else {
            player.nextLevel *= 1.2;
        }
        if (player.index == 5) {
            player.rebirth++;
        }

        // if(chosenCharacter==6){
        //     player.rebirth++;
        // }
        //console.log(player.nextLevel+" "+player.level);
        player.currentExp = 0;
        if(player.canHeal)player.health = Math.min(player.health + 5, player.maxHealth);


        // console.log(player.currentExp+" "+player.nextLevel);
        //this.image2.style.width=(player.currentExp/player.nextLevel*400)+"px";
        ChangePage("upgradePage", false, player);

    }
    if (gameOver == false && !(gameState.timeWarpCounter > 0 && TimeWarpIcon.version == 1)) {
        if (!gameState.isBossWave && gameState.timeElapsed >= gameState.waveTimer && !(gamemode == 0 && TutorialText.canChangeWave == false) && !(gamemode == 6 && currentWave == 11 && gameState.bossBars.length > 0)) {
            [gameState.isBossWave, gameState.bossesLeft, gameState.currentWave, gameState.SCALE] = ChangeWave(gameState);
            gameState.timeElapsed = 0;
        }
        else if (gamemode == 6 && gameState.bossBars.length == 0) {
            [gameState.isBossWave, gameState.bossesLeft, gameState.currentWave, gameState.SCALE] = ChangeWave(gameState);
            gameState.timeElapsed = 0;
        }
        if (newEnemyQueue.length > 0 && gamemode != 0 && currentPage == "gamePage") {
            ChangePage("newEnemyPage");
        }
        xpBagTimer--;
        healthPotionSpawnTimer--;
        if (gameState.timeElapsed < 7200) {
            gameState.timeElapsed++;
        }
        if (player.health <= 0) {
            EndGame(false);
            player.health = 0;
        }
    }
    if (gamemode == 4) {
        if (gameState.currentWave <= 5 && player.level < gameState.currentWave * 3) {
            player.currentExp += 100000;
        }
        else if (gameState.currentWave > 5 && gameState.currentWave <= 7 && player.level < 5 * 3 + (gameState.currentWave - 5) * 2) {
            player.currentExp += 100000;
        }
        else if (gameState.currentWave > 7 && gameState.currentWave <= 11 && player.level < 5 * 3 + (2) * 2 + (gameState.currentWave - 7)) {
            player.currentExp += 100000;
        }
    }
    if (gamemode == 6) {
        if (player.level < gameState.currentWave * 3 + 1 && gameState.currentWave <= 5) {
            player.currentExp += 100000;
        }
        else if (gameState.currentWave > 5 && player.level < 5 * 3 + 1 + (gameState.currentWave - 5) * 2) {
            player.currentExp += 100000;
        }
    }
    if (gamemode == 0) {
        TutorialText.Update();
    }
}



async function EndGame(win) {
    gameOver = true;
    if (gamemode == 0) {
        EndTutorial();
        return;
    }
    if (win) {
        await delay(1500);
    }
    else {
        ctx.filter = "grayscale(100%)"
        await delay(3000);
    }
    ctx.strokeStyle = 'white';
    canvas.style.display = "none";
    ctx.filter = "none";
    if (healthBar) {
        healthBar.image1.remove();
        healthBar.image2.remove();
    }
    if (levellingBar) {
        levellingBar.image1.remove();
        levellingBar.image2.remove();
    }
    if (document.getElementById("pheonixIcon")) {
        document.getElementById("pheonixIcon").remove()
    }
    if (document.getElementById("pheonixText")) {
        document.getElementById("pheonixText").remove()
    }
    if (document.getElementById("modifierText")) {
        document.getElementById("modifierText").remove();
    }
    for (let i = 0; i < bossBars.length; i++) {
        bossBars[i].image1.remove();
        bossBars[i].image2.remove();
    }
    for (let i = 0; i < playerAbilities.length; i++) {
        playerAbilities[i].indicator.text.remove();
        playerAbilities[i].image.remove();
        if (playerAbilities[i].counterText) {
            playerAbilities[i].counterText.text.remove();
        }
    }
    if (shieldBar) {
        shieldBar.image1.remove();
        shieldBar.image2.remove();
    }


    if (win == true) {
        ChangePage("winPage", true);
    }
    else {
        ChangePage("losePage", true);
    }
}


async function newEnemyText() {
    if (gamemode == 100) return;
    let text = document.getElementById("introText");
    text.style.color = "white";
    text.style.backgroundColor = "black";
    if (isPlayerUnlocked[0] == false) {
        text.textContent = "New Enemy Discovered!";
    }
    else {
        text.textContent = "New Character Unlocked!"
    }
    let image = document.createElement("img");
    image.src = newEnemyQueue[0];
    image.style.width = 300;
    image.style.height = 300;
    image.style.position = 'absolute';
    image.style.width = "300px";
    image.style.height = "300px";
    image.style.left = (2000 / 2 - 200) + "px";
    image.style.top = (1100 / 2 - 200) + "px";
    image.style.transform = "translate(-50%, -50%)";
    image.style.zIndex = 100;
    document.body.appendChild(image);
    continueFlag = true;
    await delay(3000);
    continueFlag = false;
    image.remove();
    isPlayerUnlocked.splice(0, 1);
    ChangePage("gamePage", false);
}

