let mapBorders = { leftBorder: 0, rightBorder: 2000, topBorder: 0, bottomBorder: 1100 }
let nextEntityId = 1;
class Bullet {
    constructor(speedX, speedY, damage, owner) {
        if (typeof window !== "undefined") {
            this.image = new Image();
            this.image.src = 'images/bullet.webp';
        }
        this.speedX = speedX;
        this.speedY = speedY;
        this.x = owner.x;
        this.y = owner.y;
        this.owner = owner;
        this.damage = damage;
        this.width = 10;
        this.height = 10;
        this.width *= owner.projectileSizeMultiplier;
        this.height *= owner.projectileSizeMultiplier;
        this.frostbite = false;
        this.slowed = false;
        this.slowCountdown = 0;
        this.index = 0;
    }
    move(enemies, gameState) {
        this.slowCountdown--;
        if (this.slowed || this.slowCountdown > 0) {
            this.x += this.speedX / 3;
            this.y += this.speedY / 3;
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        for (let i = enemies.length - 1; i >= 0; i--) {

            if (
                (enemies[i].x - enemies[i].width / 2) < (this.x + this.width / 2) &&
                (enemies[i].x + enemies[i].width / 2) > (this.x - this.width / 2) &&
                (enemies[i].y - enemies[i].height / 2) < (this.y + this.height / 2) &&
                (enemies[i].y + enemies[i].height / 2) > (this.y - this.height / 2) && enemies[i].ignoreBullets == false
            ) {
                //console.log(enemies[i]+" "+this.damage);
                enemies[i].takeDamage(this, this.owner, gameState);
                this.dead = true;
            }
        }
        if (this.x < mapBorders.leftBorder - 20 || this.y < mapBorders.topBorder - 20 || this.x > mapBorders.rightBorder + 20 || this.y >= mapBorders.bottomBorder + 20) {
            this.dead = true;
        }
    }

}
function drawBullet(bullet, image) {
    ctx.save();
    ctx.drawImage(image, bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);


    ctx.restore();
}
function drawPlayerLaser(bullet, image) {
    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    ctx.rotate(bullet.spawnAngle - Math.PI / 2);
    ctx.drawImage(image, -bullet.width, 0, bullet.width, bullet.height);
    ctx.restore();
}
class PiercingBullet extends Bullet {
    constructor(speedX, speedY, damage, owner) {
        super(speedX, speedY, damage, owner);
        this.width = 40;
        this.height = 40;
        this.width *= owner.projectileSizeMultiplier;
        this.height *= owner.projectileSizeMultiplier;
        this.index = 11;
        this.hitEnemies = new Set();
    }
    move(enemies, gameState) {

        this.slowCountdown--;
        if (this.slowed || this.slowCountdown > 0) {
            this.x += this.speedX / 3;
            this.y += this.speedY / 3;
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        for (let i = enemies.length - 1; i >= 0; i--) {

            if (
                (enemies[i].x - enemies[i].width / 2) < (this.x + this.width / 2) &&
                (enemies[i].x + enemies[i].width / 2) > (this.x - this.width / 2) &&
                (enemies[i].y - enemies[i].height / 2) < (this.y + this.height / 2) &&
                (enemies[i].y + enemies[i].height / 2) > (this.y - this.height / 2) && enemies[i].ignoreBullets == false
            ) {
                if (!this.hitEnemies.has(enemies[i])) {
                    enemies[i].takeDamage(this, this.owner, gameState);
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }
        if (this.x < mapBorders.leftBorder - 20 || this.y < mapBorders.topBorder - 20 || this.x > mapBorders.rightBorder + 20 || this.y >= mapBorders.bottomBorder + 20) {
            this.dead = true;
        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.filter = "brightness(500%)"
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);


        ctx.restore();
    }
}
class FrostBullet extends Bullet {
    constructor(speedX, speedY, damage, owner) {
        super(speedX, speedY, damage, owner);
        this.width = 20;
        this.height = 20;
        this.width *= owner.projectileSizeMultiplier;
        this.height *= owner.projectileSizeMultiplier;
        this.index = 1;
        if (typeof window !== "undefined") {
            this.image.src = "images/frostProjectile.webp";
        }
        this.frostbite = true;
        this.hitEnemies = new Set();
    }
    move(enemies, gameState) {

        this.slowCountdown--;
        if (this.slowed || this.slowCountdown > 0) {
            this.x += this.speedX / 3;
            this.y += this.speedY / 3;
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        for (let i = enemies.length - 1; i >= 0; i--) {

            if (
                (enemies[i].x - enemies[i].width / 2) < (this.x + this.width / 2) &&
                (enemies[i].x + enemies[i].width / 2) > (this.x - this.width / 2) &&
                (enemies[i].y - enemies[i].height / 2) < (this.y + this.height / 2) &&
                (enemies[i].y + enemies[i].height / 2) > (this.y - this.height / 2) && enemies[i].ignoreBullets == false && !this.hitEnemies.has(enemies[i])
            ) {
                //console.log(enemies[i]+" "+this.damage);
                enemies[i].takeDamage(this, this.owner, gameState);
                this.hitEnemies.add(enemies[i]);
                if (this.owner.iceBulletsPierce == false) {
                    this.dead = true;
                }
            }
        }
        if (this.x < mapBorders.leftBorder - 100 || this.y < mapBorders.topBorder - 100 || this.x > mapBorders.rightBorder + 100 || this.y >= mapBorders.bottomBorder + 100) {
            this.dead = true;
        }
    }
}
class PlayerLaser extends Bullet {
    constructor(angle, x, y, owner) {
        super(0, 0, 1, owner);
        this.spawnAngle = angle;
        this.height = 2000;
        this.width = 10;
        this.index = 2;
        this.owner = owner;
        if (typeof window !== "undefined") {
            this.image.src = "images/blue.webp";
        }

    }
    move(enemies, gameState) {
        if(this.owner.dead)return;
        this.damage = this.owner.laserDamage;
        this.x = this.owner.x - 5;
        this.y = this.owner.y;
        if (this.iFrame > 0) {
            this.iFrame--;
        }
        else {
            for (let i = 0; i < enemies.length; i++) {
                let dx = enemies[i].x - this.x;
                let dy = enemies[i].y - this.y;

                let distanceToLine = Math.abs(dx * Math.sin(this.spawnAngle) - dy * Math.cos(this.spawnAngle));

                if (enemies[i].ignoreBullets == false && distanceToLine < 10 + enemies[i].width / 2 && enemies[i].y < this.owner.y) {
                    enemies[i].takeDamage(this, this.owner, gameState);
                    this.iFrame = 15;
                }
            }
        }

    }
}

class PlayerBomb extends Bullet {
    constructor(speedX, speedY, owner) {
        super(0, 0, 1, owner);
        this.shootTimer = 60;
        this.explodeTimer = 0;
        this.height = 25;
        this.width = 25;
        this.speedX = speedX;
        this.speedY = speedY;
        this.scale = 25;
        this.damage = owner.bombDamage;
        this.hitEnemies = new Set();
        this.maxExplodeTimer = 45;
        this.knockback = false;
        this.index = 3;
    }
    move(enemies, gameState) {
        if (this.explodeTimer <= 0) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        this.shootTimer--;
        this.explodeTimer--;
        if (this.shootTimer == 0 && this.explodeTimer < 0) {
            this.explodeTimer = 75;
            //this.image.src = "images/explosion.webp";
        }
        if (this.shootTimer > 0) {
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].ignoreBullets == false && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                    this.explodeTimer = this.maxExplodeTimer;
                    this.shootTimer = 0;
                    //this.image.src = "images/explosion.webp";
                }
            }
        }
        if (this.explodeTimer == 0) {
            this.dead = true;
        }
        if (this.explodeTimer > 0) {
            this.scale += 5;
            // console.log(this.image.style.height+" "+(this.width)+" BEFORE");
            this.width = this.scale;
            this.height = this.scale;
            //console.log(this.image.style.height+" "+(this.width)+" AFTER");
            for (let i = 0; i < enemies.length; i++) {
                if (!this.hitEnemies.has(enemies[i]) && enemies[i].ignoreBullets == false && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                    enemies[i].takeDamage(this, this.owner, gameState);
                    if (this.knockback) {
                        let angle = Math.atan2((enemies[i].y - this.y), (enemies[i].x - this.x));
                        enemies[i].AddForce(25 * Math.cos(angle), 25 * Math.sin(angle));
                    }
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }

    }
}
class ProtectorBullet extends Bullet {
    constructor(damage, owner, protectorBullets) {
        super(0, 0, 1, owner);
        this.height = 40;
        this.width = 40;
        //this.image.src = "images/protectorBullet.webp";
        this.offsetX = 0;
        this.offsetY = 0;
        // this.image.style.left = (player.x) + "px";
        // this.image.style.top = (player.y) + "px";
        // this.image.style.transform = "translate(-50%, -50%)";
        // this.image.zIndex = 1;
        this.damage = damage;
        this.angle = 0;
        this.index = 4;
        this.hitEnemies = new Map();
        this.owner = owner;
        this.width *= owner.projectileSizeMultiplier;
        this.height *= owner.projectileSizeMultiplier;
        this.order = owner.numProtectorBullets;
        owner.numProtectorBullets++;
        protectorBullets.push(this);
        //console.log(ProtectorBullet.protectorBullets[0]);
    }
    move(enemies, gameState) {
        if(this.owner.dead==true){
            return;
        }
        this.damage = this.owner.protectorDamage;
        this.width = 40 * this.owner.projectileSizeMultiplier;
        this.height = 40 * this.owner.projectileSizeMultiplier;
        if (this.owner.slowed == true || this.owner.slowCountdown > 0) {
            this.angle += 0.07 / 3;
        }
        else {
            this.angle += 0.07;
        }
        this.angle %= 2 * Math.PI;
        this.offsetX = 100 * Math.cos(this.angle);
        this.offsetY = 100 * Math.sin(this.angle);
        this.x = this.owner.x + this.offsetX;
        this.y = this.owner.y + this.offsetY;

        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].ignoreBullets == false && !this.hitEnemies.has(enemies[i]) && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                enemies[i].takeDamage(this, this.owner, gameState);
                if (!enemies[i].dead) this.hitEnemies.set(enemies[i], 30);
            }
        }
        for (const enemy of this.hitEnemies.keys()) {
            //console.log(this.hitEnemies.get(enemy));
            this.hitEnemies.set(enemy, this.hitEnemies.get(enemy) - 1);
            if (this.hitEnemies.get(enemy) <= 0) {
                this.hitEnemies.delete(enemy);
            }
        }

    }
    static Spacing(player, protectorBullets) {
        let ourBullets = [];
        for (let i in protectorBullets) {
            if (protectorBullets[i].owner === player) {
                ourBullets.push(protectorBullets[i]);
            }
        }
        for (let i = 0; i < ourBullets.length; i++) {
            ourBullets[i].angle = 2 * Math.PI / ourBullets.length * i;
        }
    }
}
class PlayerShield extends Bullet {
    constructor(health, owner) {
        super(0, 0, 0, owner);
        this.height = 100;
        this.width = 100;
        this.offsetX = 0;
        this.offsetY = 0;
        this.angle = 0;
        this.health = health;
        this.maxHealth = health;
        this.index = 5;
        this.owner.shieldMaxHealth = this.health;
        this.owner.shieldHealth = this.health;
    }
    move(enemies, gameState) {
        this.health = this.owner.shieldHealth;
        this.x = this.owner.x;
        this.y = this.owner.y;
        this.redTimer--;
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].ignoreBullets == false && enemies[i].ignoreShield == false && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                let angle = Math.atan2((enemies[i].y - this.owner.y), (enemies[i].x - this.owner.x));
                this.redTimer = 5;
                let damage = 1;
                if (enemies[i].isBoss) {
                    damage = 3;
                }
                this.takeDamage(damage, gameState.floatingObjects);
                enemies[i].AddForce(10 * Math.cos(angle), 10 * Math.sin(angle));
            }
        }
        for (let i = 0; i < gameState.enemyBullets.length; i++) {
            if (gameState.enemyBullets[i].ignoreShield == false && RectCircleColliding(this, gameState.enemyBullets[i], this.width / 2, this.x, this.y)) {
                gameState.enemyBullets[i].dead = true;
                this.redTimer = 5;
                let damage = gameState.enemyBullets[i].damage;
                this.takeDamage(damage, gameState.floatingObjects);
            }
        }

    }
    takeDamage(damage, floatingObjects) {
        if (damage == 0) return;
        this.health -= damage;
        this.owner.shieldHealth = this.health;
        floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, damage, "gray"));
        if (this.health <= 0) {
            this.owner.shieldHealth = 0;
            this.owner.shieldMaxHealth = 0;
            this.dead = true;
        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();

        ctx.globalAlpha = 0.4;
        if (this.redTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        else {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }


        ctx.restore();
    }

}
class ExpandingCircle extends Bullet {
    constructor(x, y, owner) {
        super(0, 0, 1, owner);
        this.timer = 30;
        this.height = 25;
        this.width = 25;
        this.index = 6;
        this.scale = 25;
    }
    move(enemies, gameState) {
        this.scale += 50;
        this.width = this.scale;
        this.height = this.scale;
        this.timer--;
        for (let i = 0; i < gameState.enemyBullets.length; i++) {
            if (gameState.enemyBullets[i].ignoreWipe == false && RectCircleColliding(this, gameState.enemyBullets[i], this.width / 2, this.x, this.y)) {
                gameState.enemyBullets[i].dead = true;
            }
        }
        if (this.timer <= 0) this.dead = true;

    }
}
class Shockwave extends ExpandingCircle {
    constructor(x, y, owner) {
        super(0, 0, owner);
        this.timer = 30;
        this.height = 25;
        this.width = 25;
        this.index = 12;
        this.scale = 25;
    }
    move(enemies, gameState) {
        super.move(enemies, gameState);
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].ignoreBullets == false && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                let angle = Math.atan2((enemies[i].y - this.y), (enemies[i].x - this.x));
                enemies[i].AddForce(3 * Math.cos(angle), 3 * Math.sin(angle));
            }
        }


    }
}
class BouncingBullet extends Bullet {
    constructor(speedX, speedY, damage, owner) {
        super(speedX, speedY, damage, owner);
        this.width = 40;
        this.height = 40;
        this.width *= owner.projectileSizeMultiplier;
        this.height *= owner.projectileSizeMultiplier;
        this.timer = 900;
        this.index = 7;
        this.hitEnemies = new Set();
    }
    move(enemies, gameState) {
        this.timer--;

        this.slowCountdown--;
        if (this.slowed || this.slowCountdown > 0) {
            this.x += this.speedX / 3;
            this.y += this.speedY / 3;
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }

        if (this.x < (this.width - 50) / 2 + mapBorders.leftBorder) {
            this.x = (this.width - 50) / 2 + mapBorders.leftBorder;
            this.speedX *= -1;
            this.hitEnemies = new Set();
        }
        if (this.y < (this.width - 50) / 2 + mapBorders.topBorder) {
            this.y = (this.width - 50) / 2 + mapBorders.topBorder;
            this.speedY *= -1;
            this.hitEnemies = new Set();
        }
        if (this.x > mapBorders.rightBorder - (this.width - 50) / 2) {
            this.x = mapBorders.rightBorder - (this.width - 50) / 2;
            this.speedX *= -1;
            this.hitEnemies = new Set();
        }
        if (this.y > mapBorders.bottomBorder - (this.width - 50) / 2) {
            this.y = mapBorders.bottomBorder - (this.width - 50) / 2;
            this.speedY *= -1;
            this.hitEnemies = new Set();
        }
        for (let i = enemies.length - 1; i >= 0; i--) {

            if (
                (enemies[i].x - enemies[i].width / 2) < (this.x + this.width / 2) &&
                (enemies[i].x + enemies[i].width / 2) > (this.x - this.width / 2) &&
                (enemies[i].y - enemies[i].height / 2) < (this.y + this.height / 2) &&
                (enemies[i].y + enemies[i].height / 2) > (this.y - this.height / 2) && enemies[i].ignoreBullets == false
            ) {
                if (!this.hitEnemies.has(enemies[i])) {
                    enemies[i].takeDamage(this, this.owner, gameState);
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }
        if (this.timer <= 0) {
            this.dead = true;
        }
    }
}
class PlayerFire extends Bullet {
    constructor(speedX, speedY, damage, owner) {
        super(speedX, speedY, damage, owner);
        this.width = 30;
        this.height = 30;
        this.index = 8;
        this.timer = 45;
        this.width *= owner.projectileSizeMultiplier;
        this.height *= owner.projectileSizeMultiplier;
    }
    move(enemies, floatingObjects) {
        super.move(enemies, floatingObjects);
        this.timer--;
        if (this.timer == 0) this.dead = true;

    }
}
class WindBullet extends Bullet {
    constructor(speedX, speedY, damage, owner) {
        super(speedX, speedY, damage, owner);
        this.width = 40;
        this.height = 40;
        this.width *= owner.projectileSizeMultiplier;
        this.height *= owner.projectileSizeMultiplier;
        this.index = 9;
        this.hitEnemies = new Set();
    }
    move(enemies, gameState) {

        this.slowCountdown--;
        if (this.slowed || this.slowCountdown > 0) {
            this.x += this.speedX / 3;
            this.y += this.speedY / 3;
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        for (let i = enemies.length - 1; i >= 0; i--) {

            if (
                (enemies[i].x - enemies[i].width / 2) < (this.x + this.width / 2) &&
                (enemies[i].x + enemies[i].width / 2) > (this.x - this.width / 2) &&
                (enemies[i].y - enemies[i].height / 2) < (this.y + this.height / 2) &&
                (enemies[i].y + enemies[i].height / 2) > (this.y - this.height / 2) && enemies[i].ignoreBullets == false
            ) {
                //console.log(enemies[i]+" "+this.damage);
                let angle = Math.atan2((enemies[i].y - this.owner.y), (enemies[i].x - this.owner.x));
                enemies[i].AddForce(5 * Math.cos(angle), 5 * Math.sin(angle));
                if (!this.hitEnemies.has(enemies[i])) {
                    enemies[i].takeDamage(this, this.owner, gameState.floatingObjects);
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }
        if (this.x < mapBorders.leftBorder - 100 || this.y < mapBorders.topBorder - 100 || this.x > mapBorders.rightBorder + 100 || this.y >= mapBorders.bottomBorder + 100) {
            this.dead = true;
        }
    }
}
class SummonedEnemy extends Bullet {
    constructor(speed, health, size, index, owner) {
        super(0, 0, health, owner);
        this.speed = speed;
        this.health = health;
        this.imageIndex = index;
        this.index = 13;
        this.width = size;
        this.height = size;
    }
    move(enemies, gameState) {
        super.move(enemies, gameState);
        if (enemies.length > 0) {
            let closestEnemy = -1;
            let enemyDist = 999999;
            for (let i = 0; i < enemies.length; i++) {
                let newDist = Math.hypot(Math.abs(enemies[i].x - this.x), Math.abs(enemies[i].y - this.y));
                if (newDist < enemyDist && enemies[i].ignoreBullets == false) {
                    enemyDist = newDist;
                    closestEnemy = i;
                }
            }
            if (closestEnemy != -1) {
                let distanceX = Math.abs(this.x - enemies[closestEnemy].x);
                let distanceY = Math.abs(this.y - enemies[closestEnemy].y);
                let vx = 0;
                let vy = 0;
                if (distanceX == 0) {
                    if (this.y > enemies[closestEnemy].y) {
                        vy -= this.speed;
                    }
                    if (this.y < enemies[closestEnemy].y) {
                        vy += this.speed;
                    }
                }
                else {
                    let angle = Math.atan(distanceY / distanceX);
                    if (this.x > enemies[closestEnemy].x) {
                        vx -= this.speed * Math.cos(angle);
                    }
                    if (this.y > enemies[closestEnemy].y) {
                        vy -= this.speed * Math.sin(angle);
                    }
                    if (this.x < enemies[closestEnemy].x) {
                        vx += this.speed * Math.cos(angle);
                    }
                    if (this.y < enemies[closestEnemy].y) {
                        vy += this.speed * Math.sin(angle);
                    }
                    //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
                }
                this.speedX = vx;
                this.speedY = vy;
            }
            else {
                this.speedX = 0;
                this.speedY = 0;
            }

        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.filter = "grayscale(100%)";
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.filter = "none";

        ctx.restore();
    }
}
class PlayerNuke extends PlayerBomb {
    constructor(speedX, speedY, owner) {
        super(speedX / 2, speedY / 2, owner);
        this.index = 14;
        this.maxExplodeTimer = 120;
        this.damage = player.bombDamage * 2;
        this.shootTimer = 240;
        this.knockback = true;
    }
    move(enemies, gameState) {
        super.move(enemies, gameState);

    }
}




function IncreaseLevelBar() {
    //console.log(levellingBar.instances);
    //console.log(levellingBar.image2.style.width);
    if (parseInt(levellingBar.image2.style.width) + levellingBar.speed > levellingBar.desiredWidth) {
        levellingBar.image2.style.width = levellingBar.desiredWidth + "px";
    }
    else {
        levellingBar.image2.style.width = (parseInt(levellingBar.image2.style.width) + levellingBar.speed) + "px";
    }
    if (levellingBar.desiredWidth > parseInt(levellingBar.image2.style.width)) {
        requestAnimationFrame(IncreaseLevelBar)
    }
    else levellingBar.instances = 0;
}

function DecreaseLevelBar() {
    if (levellingBar.image2.width - 8 < levellingBar.desiredWidth) {
        levellingBar.image2.width = levellingBar.desiredWidth;
    }
    else {
        levellingBar.image2.width -= 8;
    }
    if (levellingBar.desiredWidth < levellingBar.image2.width) {
        requestAnimationFrame(DecreaseLevelBar)
    }
}
class ShieldBar {
    constructor(owner) {
        this.image1 = document.createElement("img");
        this.image2 = document.createElement("img");
        this.image1.src = 'images/gray.webp';
        this.image2.src = 'images/red.webp';
        this.image1.style.position = 'absolute';
        this.image2.style.position = 'absolute';
        this.image1.style.width = "400px";
        this.image1.style.height = "30px";
        this.image2.style.width = "400px";
        this.image2.style.height = "30px";
        this.image1.style.left = "10px";
        this.image1.style.top = "60px";
        this.image2.style.left = "10px";
        this.image2.style.top = "60px";
        this.image1.style.zIndex = 2;
        this.image2.style.zIndex = 2;
        this.owner = owner;
        //console.log(this.image1.style.width+" "+this.image2.style.width+" "+this.image1.style.left+" "+this.image2.style.left);
        document.body.appendChild(this.image2);
        document.body.appendChild(this.image1);
    }
    Update() {
        this.desiredWidth = Math.ceil(this.owner.health / this.owner.maxHealth * 400);
        if (this.desiredWidth > parseInt(this.image1.style.width)) {
            this.image1.style.width = this.desiredWidth + "px";
        }
        requestAnimationFrame(DecreaseShieldBar);

    }
}

function DecreaseShieldBar() {
    if (shieldBar.image1.width - 8 < shieldBar.desiredWidth) {
        shieldBar.image1.width = shieldBar.desiredWidth;
        shieldBar.image1.style.width = shieldBar.desiredWidth + "px";
    }
    else {
        shieldBar.image1.width -= 8;
        shieldBar.image1.style.width = (parseInt(shieldBar.image1.style.width) - 8) + "px";
    }
    if (shieldBar.desiredWidth < shieldBar.image1.width) {
        requestAnimationFrame(DecreaseShieldBar)
    }
    if (shieldBar && shieldBar.owner.health <= 0) {
        shieldBar.image1.remove();
        shieldBar.image2.remove();
    }
}


class BossBar {
    constructor(bossBars, title) {
        this.width = 600;
        this.height = 30;
        this.x = (2000 / 2 - 500);
        this.y = (50 + 75 * bossBars.length);
        this.currentLength = 800;
        this.desiredLength = 800;
        this.title = title;
        this.index = bossBars.length;
    }
}

function drawIcon(icon, image) {

    ctx.save();
    ctx.drawImage(image, icon.x - icon.width / 2, icon.y - icon.height / 2, icon.width, icon.height);
    ctx.font = "50px Black Ops One";
    ctx.fillStyle = icon.indicator.color;
    ctx.fillText(icon.indicator.textContent, icon.indicator.x, icon.indicator.y);
    ctx.restore();
}
class Ability {
    constructor(size, amountOfAbilities) {
        this.size = size;
        this.width = size;
        this.height = size;
        this.x = (2000 - 650);
        this.y = (40 + 60 * amountOfAbilities);
        this.cooldown = 0;
        this.indicator = new AbilityIndicator(amountOfAbilities);
    }
    timer() {
        this.cooldown--;
        if (this.cooldown <= 0) {
            this.indicator.color = "red";
        }
    }
}
class BombIcon extends Ability {
    static version = 0;
    constructor(size, amountOfAbilities) {
        super(size, amountOfAbilities);
        this.index = 0;
    }
    timer() {
        super.timer();

        // if(BombIcon.version==0){
        //     this.image.src="images/bomb.webp"
        // }
        // else{
        //     this.image.src="images/playerNuke.webp"
        // }
    }
    Activate(player, bullets, enemies) {
        if (enemies.length == 0) {
            return;
        }
        let closestEnemy = null;
        let distance = 399200;
        for (let i = 0; i < enemies.length; i++) {
            let temp = Math.hypot(Math.abs(enemies[i].x - player.x), Math.abs(enemies[i].y - player.y));
            if (temp < distance) {
                distance = temp;
                closestEnemy = enemies[i];
            }
            //console.log(temp);
        }
        if (this.cooldown <= 0) {
            let distanceX = closestEnemy.x - player.x;
            let distanceY = closestEnemy.y - player.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 5 * Math.cos(angle);
                vy = 5 * Math.sin(angle);
            }
            console.log(BombIcon.version);
            if (BombIcon.version == 0) {
                bullets.push(new PlayerBomb(vx, vy, player))
                this.cooldown = 420;
            }
            else {
                bullets.push(new PlayerNuke(vx, vy, player))
                this.cooldown = 1200;
            }
            this.indicator.Switch();
        }
    }
}
class TimeWarpIcon extends Ability {
    static version = 0;
    constructor(size, amountOfAbilities) {
        super(size, amountOfAbilities);
        this.index = 1;
    }
    timer() {
        super.timer();

    }
    Activate(player) {
        if (this.cooldown <= 0) {
            player.timeWarpCounter = 200;
            if (TimeWarpIcon.version == 0) this.cooldown = 600;
            else this.cooldown = 1000;
            this.indicator.Switch();
        }
    }
}
class BulletDeleterIcon extends Ability {
    constructor(size, amountOfAbilities) {
        super(size, amountOfAbilities);
        this.index = 2;


    }
    Activate(player, bullets) {
        if (this.cooldown <= 0) {
            this.cooldown = 800;
            this.indicator.Switch();
            bullets.push(new ExpandingCircle(player.x, player.y, player));
        }
    }
}
class ChangeModeIcon extends Ability {
    constructor(size, amountOfAbilities) {
        super(size, amountOfAbilities);
        this.index = 3;
        this.mode = 1;

    }
    Activate(player) {
        if (this.cooldown <= 0) {
            this.cooldown = 60;
            this.indicator.Switch();
            player.mode++;
            if (player.mode == 4) {
                player.mode = 1;
            }
            this.mode = player.mode;
            if (player.mode == 1) {
                player.attackSpeed = 7;
                //this.image.src = "images/playerFire.webp";
            }
            else if (player.mode == 2) {
                player.attackSpeed = 35;
                //this.image.src = "images/playerIceBullet.webp";
            }
            else {
                player.attackSpeed = 30;
                //this.image.src = "images/playerWind.webp";
            }
        }
    }
}
class NecromancyIcon extends Ability {
    constructor(size, numAbilities) {
        super(size, numAbilities);
        this.index = 4;

        //this.counterText = new AbilityIndicator();
        this.counterText = "0x";
        this.counterTextX = (2000 - 750);
        this.counterTextY = (55 + 60 * (numAbilities));
    }
    Activate(player) {
        if (this.cooldown <= 0) {
            this.cooldown = 600;
            this.indicator.Switch();
            player.Summon();
        }
    }
    timer() {
        super.timer();
        //this.counterText.text.textContent = player.summonQueue.length + "x"
    }
}
class ShockwaveIcon extends Ability {
    constructor(size, numAbilities) {
        super(size, numAbilities);
        this.index = 5;

    }
    Activate(player) {
        if (this.cooldown <= 0) {
            this.cooldown = 1000;
            this.indicator.Switch();
            gameState.bullets.push(new Shockwave(player.x, player.y, player));
        }
    }
}
class RebirthsIcon {
    constructor(size) {
        this.width = 50;
        this.height = 50;
        this.x = (2000 - 800);
        this.y = (40);

        this.text = "X";
        this.textX = (2000 - 750);
        this.textY = (50);

    }
}
class TutorialText {
    static index = -1;
    static textOrder = ["Welcome to Crossover, a game with art assets taken from different parts of the internet. WASD to move.", "As you can see, the player automatically shoots bullets.", "Your job is simple: kill all the enemies and survive for as long as possible.", "Killing enemies gives experience points, and getting enough experience points will reward an upgrade.", "Experience bottles and health potions will periodically spawn. Collect them for XP and healing!", "Now, let's put your skills to the test!", "", "Congratulations on completing the tutorial!"]
    static fadeTimer = 0;
    static timer = 0;
    static canChangeWave = false;
    constructor(size) {

        this.text = document.createElement("div");
        this.text.style.position = "absolute";
        this.text.style.left = (screen.width / 2) + "px";
        this.text.style.top = (250) + "px";
        this.text.style.zIndex = "2";
        this.text.style.transform = "translate(-50%, -50%)";
        this.text.style.pointerEvents = "none";
        this.text.style.fontSize = "50px";
        this.text.style.textAlign = "center";
        this.text.style.fontFamily = "Black Ops One";
        this.text.style.color = " rgb(45, 169, 90)";
        this.text.style.width = "1500px"
        this.text.id = "tutorialText";
        this.text.textContent = "\(Fullscreen encouraged, press escape to go back\)"
        document.body.appendChild(this.text);

    }
    static Update() {
        TutorialText.timer++;
        //console.log(document.getElementById("tutorialText").style.left+" "+document.getElementById("tutorialText").style.top);
        TutorialText.fadeTimer--;
        if (TutorialText.index < 4 && (TutorialText.timer == 60 || TutorialText.timer == 540 || TutorialText.timer == 840)) {
            TutorialText.fadeTimer = 30;
        }
        if (player.currentExp > 40 && TutorialText.index < 3 && TutorialText.fadeTimer < 0) {
            TutorialText.fadeTimer = 30;
        }
        if (player.level > 1 && TutorialText.index < 4 && TutorialText.fadeTimer < 0) {
            TutorialText.fadeTimer = 30;
            TutorialText.timer = 0;
        }
        //console.log(TutorialText.index+" "+TutorialText.timer+" "+currentWave);
        if (TutorialText.timer == 480 && TutorialText.index == 4) {
            //console.log(TutorialText.index+" "+TutorialText.timer+" done");
            TutorialText.fadeTimer = 30;
            gameState.bossMultiplier = 0.3;
            TutorialText.canChangeWave = true;
        }
        if (TutorialText.timer == 720 && TutorialText.index == 5) {
            TutorialText.fadeTimer = 30;
        }
        if (gameState.currentWave == 4 && TutorialText.index == 6 && TutorialText.fadeTimer < 0) {
            DisableAllEnemies();
            TutorialText.fadeTimer = 30;
            TutorialText.timer = 0;
        }
        if (TutorialText.index == 7 && TutorialText.timer == 300) {
            EndTutorial();
        }
        if (TutorialText.fadeTimer > 0) {
            document.getElementById("tutorialText").style.color = "rgba(45, 169, 90," + (TutorialText.fadeTimer / 30) + ")";
        }
        else {
            document.getElementById("tutorialText").style.color = "rgb(45, 169, 90, 1)";
        }
        if (TutorialText.fadeTimer == 0) {

            TutorialText.index++;
            document.getElementById("tutorialText").textContent = TutorialText.textOrder[this.index];
        }
    }
}
class AbilityIndicator {
    constructor(length) {
        this.x = (2000 - 550);
        this.y = (50 + 60 * length);
        this.textContent = "";
        // this.text.style.fontSize = "50px";
        // this.text.style.textAlign = "center";
        // this.text.style.whiteSpace = "nowrap";
        // this.text.style.fontFamily = "Black Ops One";
        this.color = "red";
        // this.text.id = "text2";
        switch (length) {
            case 0:
                this.textContent = `Q`;
                break;
            case 1:
                this.textContent = `E`;
                break;
            case 2:
                this.textContent = `R`;
                break;
            case 3:
                this.textContent = `F`;
                break;
            case 4:
                this.textContent = `T`;
                break;
        }
    }
    Switch() {
        if (this.color == "red") {
            this.color = "black";
        }
        else {
            this.color = "red";
        }
    }
}

function drawWaveText(text) {
    ctx.save();
    ctx.font = "50px Black Ops One";
    ctx.fillStyle = "black";
    ctx.fillText(text.textContent, text.x, text.y);
    ctx.restore();
}
class WaveText {
    constructor(size) {
        this.size = size;
        this.x = 20;
        this.y = 40;
        this.textContent = "Wave 1";


    }
    Update(currentWave) {
        this.textContent = `Wave ${currentWave}`;
    }
}
class ModifierText {
    constructor(size) {
        this.size = size;
        this.text = document.createElement("div");
        this.text.style.position = "absolute";
        this.text.style.left = "210px";
        this.text.style.top = "170px";
        this.text.style.zIndex = "2";
        this.text.style.transform = "translate(-50%, -50%)";
        this.text.style.pointerEvents = "none";
        this.text.style.fontSize = "30px";
        this.text.style.whiteSpace = "nowrap";
        this.text.style.color = "black";
        this.text.style.width = "400px";
        this.text.style.textAlign = "left";
        this.text.style.fontFamily = "Black ops one";
        this.text.id = "modifierText";
        this.text.textContent = `Modifier: None`;
        document.body.appendChild(this.text);


    }
    Update() {
        this.text.innerHTML = `<b>Wave ${currentWave}</b>`;
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BombIcon };
}


class Player {
    static unlocked = false;
    constructor(health) {
        if (typeof window !== "undefined") {
            this.image = new Image();
            this.image.src = "images/player.webp";
        }
        this.speed = 5;
        this.x = 2000 / 2;
        this.y = 1100 / 2;
        this.width = 50;
        this.height = 50;
        this.currentExp = 0;
        this.nextLevel = 100;
        this.damage = 1;
        this.health = health;
        this.maxHealth = health;
        this.projectiles = 4;
        this.slowed = false;
        this.frostProjectiles = 0;
        this.frostProjectileCooldown = 60;
        this.frostProjectileMaxCooldown = 80;
        this.laserProjectiles = 0;
        this.slowCountdown = 0;
        this.attackSpeed = 30;
        this.bulletCooldown = 0;
        this.siphon = 0;
        this.redTimer = 0;
        this.bombTimer = 1;
        this.bombCount = 0;
        this.xpMultiplier = 1;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.timeWarpTimer = 0;
        this.timeWarp = 0;
        this.passiveHealing = 0;
        this.passiveHealingTimer = 0;
        this.damageMultiplier = 1;
        this.damageTakenMultiplier = 1;
        this.level = 1;
        this.healMultiplier = 1;
        this.attackSpeedMultiplier = 1;
        this.projectileSizeMultiplier = 1;
        this.collisionDamageMultiplier = 1;
        this.iceBulletsPierce = false;
        this.rebirth = 0;
        this.rebirthTimer = 0;
        this.windProjectiles = 0;
        this.windProjectileCooldown = 60;
        this.slowedDamageMultiplier = 1;
        this.bombDamage = 4;
        this.laserDamage = 1;
        this.maxHealthHalved = false;
        this.originalMaxHealth = this.maxHealth;
        this.canHeal = true;
        this.constantDamageAmount = 0;
        this.constantDamageTimer = 150;
        this.bouncingProjectiles = 0;
        this.bouncingProjectileCooldown = 0;
        this.bouncingProjectileMaxCooldown = 150;
        this.protectorDamage = 1;
        this.bouncingBulletDamage = 1;
        this.attackCooldown = 0;
        this.inputs = { up: false, down: false, left: false, right: false, ability1: false, ability2: false, ability3: false, ability4: false, ability5: false, }
        this.isReady = false;
        this.shield = null;
        this.abilities = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.timeWarpCounter = 0;
        this.numProtectorBullets = 0;
        this.shieldHealth = 0;
        this.shieldMaxHealth = 0;
        this.killedBoss = false;

        this.boughtUpgrades = new Array(29);
        let RESTRICTEDUPGRADES = [17, 18, 19, 20, 22, 23, 24, 25, 27, 28]

        for (let i = 0; i < this.boughtUpgrades.length; i++) {
            this.boughtUpgrades[i] = 0;
        }
        if (typeof window === "undefined") {
            this.boughtUpgrades[11] = 1;
        }
        for (let i = 0; i < RESTRICTEDUPGRADES.length; i++) {
            this.boughtUpgrades[RESTRICTEDUPGRADES[i]] = 1;
        }
    }
    takeDamage(damage, bullet, floatingObjects) {
        if (this.rebirthTimer > 0) {
            return;
        }
            console.log(this.shieldMaxHealth)
        if (this.shieldMaxHealth > 0) {
            this.shieldHealth -= damage;
            return;
        }
        damage *= this.damageTakenMultiplier;
        if (bullet.id) damage *= this.collisionDamageMultiplier;
        this.health -= damage;

        //console.log(this.health+" health");
        floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, damage, "red"));
        if (bullet != null && bullet.frostbite) {
            this.slowCountdown = Math.max(this.slowCountdown, 120);
        }
        this.redTimer = 10;
        if (typeof window !== "undefined" && this.health <= 0 && this.rebirth > 0) {
            this.useRebirth(gameState.bullets);
        }
        if (this.health <= 0) {
            this.dead = true;
        }
    }
    useRebirth(bullets) {

        bullets.push(new Shockwave(this.x, this.y, this));
        this.health = this.maxHealth / 2;
        this.rebirth--;
        this.rebirthTimer = 300;
    }
    act(enemies, bullets, floatingObjects) {
        if (this.frostProjectiles > 0 && this.frostProjectileCooldown <= 0) {
            this.frostProjectileCooldown = this.frostProjectileMaxCooldown;
            if (enemies.length > 0) {
                let closestEnemy = -1;
                let enemyDist = 999999;
                for (let i = 0; i < enemies.length; i++) {
                    let newDist = Math.hypot(Math.abs(enemies[i].x - this.x), Math.abs(enemies[i].y - this.y));
                    if (newDist < enemyDist && enemies[i].ignoreBullets == false) {
                        enemyDist = newDist;
                        closestEnemy = i;
                    }
                }
                if (closestEnemy != -1) {
                    let distanceX = Math.abs(this.x - enemies[closestEnemy].x);
                    let distanceY = Math.abs(this.y - enemies[closestEnemy].y);
                    let vx = 0;
                    let vy = 0;
                    if (distanceX == 0) {
                        if (this.y > enemies[closestEnemy].y) {
                            vy -= 5;
                        }
                        if (this.y < enemies[closestEnemy].y) {
                            vy += 5;
                        }
                    }
                    else {
                        let angle = Math.atan(distanceY / distanceX);
                        if (this.x > enemies[closestEnemy].x) {
                            vx -= 5 * Math.cos(angle);
                        }
                        if (this.y > enemies[closestEnemy].y) {
                            vy -= 5 * Math.sin(angle);
                        }
                        if (this.x < enemies[closestEnemy].x) {
                            vx += 5 * Math.cos(angle);
                        }
                        if (this.y < enemies[closestEnemy].y) {
                            vy += 5 * Math.sin(angle);
                        }
                        //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
                    }
                    bullets[bullets.length] = new FrostBullet(vx, vy, 1, this);
                }
                else {
                    bullets[bullets.length] = new FrostBullet(5, 0, 1, this);
                }

            }
            else {
                bullets[bullets.length] = new FrostBullet(5, 0, 1, this);
            }

        }
        if (this.bouncingProjectiles > 0 && this.bouncingProjectileCooldown <= 0) {
            this.bouncingProjectileCooldown = this.bouncingProjectileMaxCooldown;
            if (enemies.length > 0) {
                let closestEnemy = -1;
                let enemyDist = 999999;
                for (let i = 0; i < enemies.length; i++) {
                    let newDist = Math.hypot(Math.abs(enemies[i].x - this.x), Math.abs(enemies[i].y - this.y));
                    if (newDist < enemyDist && enemies[i].ignoreBullets == false) {
                        enemyDist = newDist;
                        closestEnemy = i;
                    }
                }
                if (closestEnemy != -1) {
                    let distanceX = Math.abs(this.x - enemies[closestEnemy].x);
                    let distanceY = Math.abs(this.y - enemies[closestEnemy].y);
                    let vx = 0;
                    let vy = 0;
                    if (distanceX == 0) {
                        if (this.y > enemies[closestEnemy].y) {
                            vy -= 10;
                        }
                        if (this.y < enemies[closestEnemy].y) {
                            vy += 10;
                        }
                    }
                    else {
                        let angle = Math.atan(distanceY / distanceX);
                        if (this.x > enemies[closestEnemy].x) {
                            vx -= 10 * Math.cos(angle);
                        }
                        if (this.y > enemies[closestEnemy].y) {
                            vy -= 10 * Math.sin(angle);
                        }
                        if (this.x < enemies[closestEnemy].x) {
                            vx += 10 * Math.cos(angle);
                        }
                        if (this.y < enemies[closestEnemy].y) {
                            vy += 10 * Math.sin(angle);
                        }
                        //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
                    }
                    bullets[bullets.length] = new BouncingBullet(vx, vy, this.bouncingBulletDamage, this);
                }
                else {
                    bullets[bullets.length] = new BouncingBullet(10, 0, this.bouncingBulletDamage, this);
                }

            }
            else {
                bullets[bullets.length] = new BouncingBullet(10, 0, this.bouncingBulletDamage, this);
            }

        }
        if (this.windProjectiles > 0 && chosenCharacter != 4 && this.windProjectileCooldown < 0) {
            this.windProjectileCooldown = 60;
            let angle = 0;
            for (let i = 0; i < this.windProjectiles; i++) {
                let temp = new WindBullet(10 * Math.cos(angle), 10 * Math.sin(angle), 0, this);
                bullets[bullets.length] = temp;
                angle += 2 * Math.PI / this.windProjectiles;
            }
        }
        //console.log(this.slowed);
        if (this.inputs.ability1 && this.abilities.length > 0) {
            this.abilities[0].Activate(this, bullets, enemies);
        }
        if (this.inputs.ability2 && this.abilities.length > 1) {
            this.abilities[1].Activate(this, bullets, enemies);
        }
        if (this.inputs.ability3 && this.abilities.length > 2) {
            this.abilities[2].Activate(this, bullets, enemies);
        }
        if (this.inputs.ability4 && this.abilities.length > 3) {
            this.abilities[3].Activate(this, bullets, enemies);
        }
        if (this.inputs.ability5 && this.abilities.length > 4) {
            this.abilities[4].Activate(this, bullets, enemies);
        }


        if (this.slowed || this.slowCountdown > 0) {
            this.speed /= 2;
            ProtectorBullet.slowed = true;
        }
        else {
            ProtectorBullet.slowed = false;
        }
        // if (timeWarpCounter > 0) {
        //     this.speed *= 2;
        // }
        if (this.timeWarpCounter > 0) {
            this.speed *= 2;
        }
        if (this.inputs.up && this.inputs.left) {
            this.y -= this.speed / 1.4142;
            this.x -= this.speed / 1.4142;
        } else if (this.inputs.up && this.inputs.right) {
            this.y -= this.speed / 1.4142;
            this.x += this.speed / 1.4142;
        } else if (this.inputs.down && this.inputs.right) {
            this.y += this.speed / 1.4142;
            this.x += this.speed / 1.4142;
        } else if (this.inputs.down && this.inputs.left) {
            this.y += this.speed / 1.4142;
            this.x -= this.speed / 1.4142;
        } else {
            if (this.inputs.up) this.y -= this.speed;
            if (this.inputs.down) this.y += this.speed;
            if (this.inputs.right) this.x += this.speed;
            if (this.inputs.left) this.x -= this.speed;
        }
        if (this.timeWarpCounter > 0) {
            this.speed /= 2;
        }
        this.x += this.accelerationX;
        this.y += this.accelerationY;

        if (this.x < mapBorders.leftBorder) this.x = mapBorders.leftBorder;
        if (this.y < mapBorders.topBorder) this.y = mapBorders.topBorder;
        if (this.x > mapBorders.rightBorder) this.x = mapBorders.rightBorder;
        if (this.y > mapBorders.bottomBorder) this.y = mapBorders.bottomBorder;
        if (this.slowed || this.slowCountdown > 0) this.speed *= 2;

        if (this.passiveHealingTimer <= 0 && this.passiveHealing > 0) {
            this.passiveHealingTimer = 300;
            this.Heal(this.passiveHealing, floatingObjects);
        }
        if (this.constantDamageTimer <= 0 && this.constantDamageAmount > 0) {
            this.constantDamageTimer = 240;

            this.takeDamage(this.constantDamageAmount, new EnemyBullet(0,0,1,0,0), floatingObjects);
        }
        this.Timers();
    }
    Timers() {
        this.frostProjectileCooldown--;
        this.slowCountdown--;
        this.bulletCooldown--;
        this.bombTimer--;
        this.timeWarpTimer--;
        this.redTimer--;
        this.passiveHealingTimer--;
        this.rebirthTimer--;
        this.windProjectileCooldown--;
        this.constantDamageTimer--;
        this.bouncingProjectileCooldown--;
        this.accelerationX /= 1.05;
        this.accelerationY /= 1.05;
        this.timeWarpCounter--;

    }
    AddForce(x, y) {
        this.accelerationX += x;
        this.accelerationY += y;
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        if (this.rebirthTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.filter = 'brightness(500%)';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.healTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'lime';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.redTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(84, 0, 0, 0.6)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.slowCountdown > 0 || this.slowed == true) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }
    Heal(amount, floatingObjects) {
        if (!this.canHeal) return;
        amount *= this.healMultiplier;
        this.health = Math.min(this.maxHealth, this.health + amount);
        floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, amount, "green"));

    }
    GainXP(amount) {
        if (gamemode == 4 || gamemode == 6) return;
        this.currentExp += amount * this.xpMultiplier;
    }
}
class BasicPlayer extends Player {
    constructor(health) {
        super(health);
        this.index = 0;
    }
    act(enemies, bullets, floatingObjects) {
        if (this.bulletCooldown <= 0) {
            //console.log(this.attackSpeed);
            this.bulletCooldown = this.attackSpeed;
            this.Attack(bullets);
        }
        super.act(enemies, bullets, floatingObjects);
    }
    Attack(bullets) {
        if (!bullets) return;
        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            let temp = new Bullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage, this);
            bullets[bullets.length] = temp;
            angle += 2 * Math.PI / this.projectiles;
        }
    }
}
class TankPlayer extends Player {
    constructor(health) {
        super(health);
        this.width = 65;
        this.height = 65;
        this.speed = 3.5;
        this.attackSpeed = 70;
        this.nextLevel = 120;
        this.damage = 2;
        this.index = 1;
        this.shieldTimer = 1800;
        this.boughtUpgrades[14] = 1;
    }
    act(enemies, bullets, floatingObjects) {
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack(bullets);
        }
        this.shieldTimer--;
        console.log(this.shieldMaxHealth);
        if (this.shieldTimer <= 0) {
            if (this.shieldMaxHealth == 0) {
                let temp = new PlayerShield(30, this);
                temp.width *= 65 / 50;
                temp.height *= 65 / 50;
                bullets.push(temp);
            }
            else {
                this.shieldHealth = this.shieldMaxHealth;
            }
            this.shieldTimer = 1800;
        }
        super.act(enemies, bullets, floatingObjects);
    }
    Attack(bullets) {

        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            bullets[bullets.length] = new Bullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage, this);
            angle += 2 * Math.PI / this.projectiles;
        }
    }
}
class HealerPlayer extends Player {
    constructor(health) {
        super(health);
        this.speed = 4.5;
        this.attackSpeed = 70;
        this.nextLevel = 100;
        this.damage = 1;
        this.passiveHealing = 1;
        this.siphon = 0.25;
        this.healMultiplier = 2;
        this.index = 2;
    }
    act(enemies, bullets, floatingObjects) {
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack(bullets);
        }
        super.act(enemies, bullets, floatingObjects);
    }
    Attack(bullets) {

        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            bullets[bullets.length] = new Bullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage, this);
            angle += 2 * Math.PI / this.projectiles;
        }
    }
    takeDamage(damage, bullet, floatingObjects) {
        if (this.shieldMaxHealth > 0) {
            this.shieldHealth -= damage;
            return;
        }
        damage *= this.damageTakenMultiplier;
        this.health -= damage;
        //gameState.sharedXP+=10*damage;

        //console.log(this.health);
        floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, damage, "red"));

        if (typeof window !== "undefined" && this.health <= 0 && this.rebirth > 0) {
            bullets.push(new Shockwave(this.x, this.y, this));
            this.health = this.maxHealth / 2;
            this.rebirth--;
            this.rebirthTimer = 300;
        }
        if (this.health <= 0) {
            this.dead = true;
        }
        if (bullet.frostbite) {
            this.slowCountdown = 120;
        }
        this.redTimer = 10;
    }
}
class MagePlayer extends Player {
    //1=fire mode, 2=ice mode, 3=air mode
    constructor(health, abilityIcons) {
        super(health);
        this.attackSpeed = 5;
        this.mode = 1;

        this.boughtUpgrades[0] = 1;
        this.boughtUpgrades[2] = 1;
        this.boughtUpgrades[11] = 1;
        if (typeof window !== "undefined") {
            boughtTier2Upgrades[0] = 1;
            boughtTier2Upgrades[2] = 1;
        }
        this.boughtUpgrades[17] = 0;
        this.boughtUpgrades[18] = 0;
        this.boughtUpgrades[20] = 0;
        this.boughtUpgrades[22] = 0;
        this.fireDamage = 0.5;
        this.tornadoDamage = 0;
        let temp = new ChangeModeIcon(50, abilityIcons.length)
        this.abilities.push(temp);
        abilityIcons.push(temp);
        
        this.index = 3;
    }
    act(enemies, bullets, floatingObjects) {
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed * this.attackSpeedMultiplier;
            this.Attack(bullets, enemies);
        }
        super.act(enemies, bullets, floatingObjects);
    }
    Attack(bullets, enemies) {
        if (this.mode == 1) {
            if (enemies.length > 0) {
                let closestEnemy = -1;
                let enemyDist = 999999;
                for (let i = 0; i < enemies.length; i++) {
                    let newDist = Math.hypot(Math.abs(enemies[i].x - this.x), Math.abs(enemies[i].y - this.y));
                    if (newDist < enemyDist && enemies[i].ignoreBullets == false) {
                        enemyDist = newDist;
                        closestEnemy = i;
                    }
                }
                if (closestEnemy != -1) {
                    let distanceX = enemies[closestEnemy].x - this.x;
                    let distanceY = enemies[closestEnemy].y - this.y;
                    let distance = distanceX * distanceX + distanceY * distanceY;
                    let vx = 0;
                    let vy = 0;

                    if (distance > 0) {
                        let angle = Math.atan2(distanceY, distanceX);
                        angle += Math.random() * 1.2 - 0.6;
                        vx = 7 * Math.cos(angle);
                        vy = 7 * Math.sin(angle);
                    }
                    bullets[bullets.length] = new PlayerFire(vx, vy, this.fireDamage, this);
                }

            }


        }
        else if (this.mode == 2) {
            let angle = 0;

            for (let i = 0; i < 4; i++) {
                let temp = new FrostBullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage, this);
                temp.index = 10;
                temp.width = 30;
                temp.height = 30;
                temp.width *= this.projectileSizeMultiplier;
                temp.height *= this.projectileSizeMultiplier;
                bullets[bullets.length] = temp;
                angle += 2 * Math.PI / 4;
            }
        }
        else if (this.mode == 3) {
            let angle = Math.PI / 4;
            for (let i = 0; i < this.projectiles; i++) {
                let temp = new WindBullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.tornadoDamage, this);
                bullets[bullets.length] = temp;
                angle += 2 * Math.PI / this.projectiles;
            }
        }
    }
}
function drawPheonixIcon(icon, image) {
    ctx.save();
    ctx.drawImage(image, icon.x - icon.width / 2, icon.y - icon.height / 2, icon.width, icon.height);
    ctx.font = "50px Black Ops One";
    ctx.fillStyle = "red"
    ctx.fillText(icon.text, icon.textX, icon.textY);;
    ctx.restore();
}
class PheonixPlayer extends Player {
    //has 10 revives but has low base health that cannot be increased
    constructor(health) {
        super(health);
        this.width = 50;
        this.height = 50;
        this.speed = 6;
        this.attackSpeed = 75;
        this.nextLevel = 150;
        this.damage = 1;
        this.rebirth = 1;
        this.index = 5;
        this.icon = new RebirthsIcon(50);
        this.boughtUpgrades[1] = 1;
        if (typeof window !== "undefined") boughtTier2Upgrades[1] = 1;

    }
    act(enemies, bullets, floatingObjects) {

        this.icon.text = "x" + this.rebirth;
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack(bullets);
        }
        super.act(enemies, bullets, floatingObjects);
    }
    Attack(bullets) {

        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            let temp = new PiercingBullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage, this);
            bullets[bullets.length] = temp;
            angle += 2 * Math.PI / this.projectiles;
        }
    }
}
class NecromancerPlayer extends Player {
    constructor(health, abilityIcons) {
        super(health);
        this.index = 4;
        this.attackSpeed = 60;
        this.damage = 1;
        this.summonQueue = [];
        this.isSummoning = false;
        this.summoningCooldown = 0;
        this.passiveSpawning = false;
        this.passiveSpawnCooldown = 0;
        this.boughtUpgrades[19] = 0;
        let temp = new NecromancyIcon(50, abilityIcons.length)
        this.ability = temp;
        this.abilities.push(temp);
        abilityIcons.push(temp);
        
    }
    act(enemies, bullets, floatingObjects) {
        this.ability.counterText = this.summonQueue.length + "x";
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack(bullets);
        }
        if (this.isSummoning) {
            this.summoningCooldown--;
            if (this.summoningCooldown <= 0) {
                this.summoningCooldown = 25;
                if (this.summonQueue.length > 0) {
                    let temp = new SummonedEnemy(this.summonQueue[0][0], this.summonQueue[0][1], this.summonQueue[0][2], this.summonQueue[0][3], this);
                    temp.x = this.x;
                    temp.y = this.y;
                    bullets.push(temp);
                    this.summonQueue.splice(0, 1);
                }
                else {
                    this.isSummoning = false;
                    this.summoningCooldown = 0;
                }
            }
        }
        this.passiveSpawnCooldown--;
        if (this.passiveSpawning && this.passiveSpawnCooldown <= 0) {
            this.passiveSpawnCooldown = 180;
            // let tempImage=new Image();
            // tempImage.src="images/enemy.webp";
            let temp = new SummonedEnemy(2, 3, 50, 0);
            temp.x = this.x;
            temp.y = this.y;
            bullets.push(temp);
        }

        super.act(enemies, bullets, floatingObjects);
    }
    Summon() {
        this.isSummoning = true;
    }
    Attack(bullets) {

        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            let temp = new Bullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage, this);
            bullets.push(temp);
            angle += 2 * Math.PI / this.projectiles;
        }
    }
}

function drawPlayer(currentPlayer, image) {
    ctx.save();
    if (currentPlayer.rebirthTimer > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'brightness(500%)';
        ctx.drawImage(image, currentPlayer.x - currentPlayer.width / 2, currentPlayer.y - currentPlayer.height / 2, currentPlayer.width, currentPlayer.height);
    }
    else if (currentPlayer.healTimer > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(image, currentPlayer.x - currentPlayer.width / 2, currentPlayer.y - currentPlayer.height / 2, currentPlayer.width, currentPlayer.height);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'lime';
        ctx.fillRect(currentPlayer.x - currentPlayer.width / 2, currentPlayer.y - currentPlayer.height / 2, currentPlayer.width, currentPlayer.height);
    }
    else if (currentPlayer.redTimer > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(image, currentPlayer.x - currentPlayer.width / 2, currentPlayer.y - currentPlayer.height / 2, currentPlayer.width, currentPlayer.height);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(84, 0, 0, 0.6)';
        ctx.fillRect(currentPlayer.x - currentPlayer.width / 2, currentPlayer.y - currentPlayer.height / 2, currentPlayer.width, currentPlayer.height);
    }
    else if (currentPlayer.slowCountdown > 0 || currentPlayer.slowed == true) {
        ctx.drawImage(image, currentPlayer.x - currentPlayer.width / 2, currentPlayer.y - currentPlayer.height / 2, currentPlayer.width, currentPlayer.height);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(currentPlayer.x - currentPlayer.width / 2, currentPlayer.y - currentPlayer.height / 2, currentPlayer.width, currentPlayer.height);
    }
    else {
        ctx.drawImage(image, currentPlayer.x - currentPlayer.width / 2, currentPlayer.y - currentPlayer.height / 2, currentPlayer.width, currentPlayer.height);
    }
    ctx.restore();
}

class Enemy {
    static spawnCooldown = 0;
    static baseTimer = 200;
    static randomTimer = 200;
    static index = 0;
    static health = 0;
    static speed = 0;
    static isActive = false;
    constructor(speed, health) {

        this.speed = speed;
        this.health = health;
        this.maxHealth = health;
        this.isBoss = false;
        this.isEnemy = true;
        this.value = 30;
        this.id = nextEntityId;
        nextEntityId++;
        if (Math.random() < 0.5) {
            this.y = Math.random() * (mapBorders.rightBorder-mapBorders.leftBorder);
            if (Math.random() < 0.5) {
                this.x = mapBorders.leftBorder-200;
            }
            else {
                this.x = mapBorders.rightBorder + 200;
            }
        }
        else {
            this.x = Math.random() * (mapBorders.bottomBorder-mapBorders.topBorder);
            if (Math.random() < 0.5) {
                this.y = mapBorders.topBorder-200;
            }
            else {
                this.y = mapBorders.bottomBorder + 200;
            }
        }
        this.width = 50;
        this.height = 50;

        this.ignoreBullets = false;
        this.ignoreShield = false;
        this.giveXP = true;
        this.redTimer = 0;
        this.slowCountdown = -1;
        this.canSiphon = true;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.speedTimer = 0;
        this.knockbackIFrame = 0;
        this.hasHealthBar = true;
        this.healTimer = 0;
        this.dead = false;
        this.killCredit = null;
        this.ignoreKnockback = false;
        if (this.isBoss) this.ignoreKnockback = true;
        if(typeof window!=="undefined"){
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
            multiplier*=enemyHealthMultiplier;
            this.health*=multiplier;
        }
        this.health = Math.ceil(this.health);
        this.maxHealth = this.health;
        this.index = 0;
        
        //console.log(this.image);
    }
    move(players, floatingObjects, enemies) {
        if (this.slowCountdown > 0) {
            this.speed /= 2;
        }
        if (this.speedTimer > 0) {
            this.speed *= 2;
        }
        if(typeof window !== "undefined")this.speed*=enemySpeedMultiplier;
        if (players.length == 0) return;
        //console.log(players);
        let minDist = 100000;
        let minDistID = null;
        for (let id = 0; id < players.length; id++) {
            let dist = Math.hypot(players[id].x - this.x, players[id].y - this.y)
            if (dist < minDist) {
                minDist = dist;
                minDistID = id;
            }
        }
        let player = players[minDistID];
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
        if (distanceX == 0) {
            if (this.y > player.y) {
                this.y -= this.speed;
            }
            if (this.y < player.y) {
                this.y += this.speed;
            }
        }
        else {
            let angle = Math.atan(distanceY / distanceX);
            if (this.x > player.x) {
                this.x -= this.speed * Math.cos(angle);
            }
            if (this.y > player.y) {
                this.y -= this.speed * Math.sin(angle);
            }
            if (this.x < player.x) {
                this.x += this.speed * Math.cos(angle);
            }
            if (this.y < player.y) {
                this.y += this.speed * Math.sin(angle);
            }
            //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
        }
        this.checkForCollisions(players, floatingObjects);
        this.CheckForCramming(enemies);

        this.x += this.accelerationX;
        this.y += this.accelerationY;
        this.accelerationX /= 1.05;
        this.accelerationY /= 1.05;
        this.knockbackIFrame--;
        //console.log(this.redTimer);
        if (this.slowCountdown > 0) {
            this.speed *= 2;
            this.slowCountdown--;
        }
        if (this.speedTimer > 0) {
            this.speed /= 2;
            this.speedTimer--;
        }
        if(typeof window !== "undefined")this.speed/=enemySpeedMultiplier;
        if (this.redTimer > 0) this.redTimer--;
        this.healTimer--;
    }

    checkForCollisions(players, floatingObjects) {
        if (players.length == 0) return;
        let minDist = 100000;
        let minDistID = null;
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (this.isBoss && (player.x - player.width / 2) < (this.x + this.width / 2) && (player.x + player.width / 2) > (this.x - this.width / 2) && (player.y - player.height / 2) < (this.y + this.height / 2) && (player.y + player.height / 2) > (this.y - this.height / 2) && this.knockbackIFrame <= 0) {
                player.takeDamage(2, this, floatingObjects);
                if (this.x > player.x) {
                    player.AddForce(-15, 0);
                }
                if (this.x < player.x) {

                    player.AddForce(15, 0);
                }
                if (this.y > player.y) {

                    player.AddForce(0, -15);
                }
                if (this.y < player.y) {

                    player.AddForce(0, 15);
                }
                this.knockbackIFrame = 15;

            }
            else if (!this.isBoss &&
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && !this.dead
            ) {
                player.takeDamage(Math.min(5, this.health), this, floatingObjects);
                this.dead = true;
                this.giveXP = false;
                this.canSiphon = false;
            }
        }
    }
    CheckForCramming(enemies) {
        if (this.ignoreBullets == true) {
            return;
        }
        for (let i = 0; i < enemies.length; i++) {
            if (!enemies[i].ignoreKnockback && !enemies[i].ignoreBullets && !enemies[i].isBoss) {
                if (
                    (enemies[i].x - enemies[i].width / 2.5) < (this.x + this.width / 2.5) &&
                    (enemies[i].x + enemies[i].width / 2.5) > (this.x - this.width / 2.5) &&
                    (enemies[i].y - enemies[i].height / 2.5) < (this.y + this.height / 2.5) &&
                    (enemies[i].y + enemies[i].height / 2.5) > (this.y - this.height / 2.5)
                ) {
                    if (this.x > enemies[i].x) {
                        enemies[i].AddForce(-0.5, 0);
                    }
                    if (this.x < enemies[i].x) {

                        enemies[i].AddForce(0.5, 0);
                    }
                    if (this.y > enemies[i].y) {

                        enemies[i].AddForce(0, -0.5);
                    }
                    if (this.y < enemies[i].y) {

                        enemies[i].AddForce(0, 0.5);
                    }
                }
            }
        }
    }
    special() {
    }
    takeDamage(bullet, owner, gameState) {
        if (this.dead) return;
        let damage = 0;

        damage = bullet.damage * owner.damageMultiplier;
        if (this.slowCountdown > 0) damage *= owner.slowedDamageMultiplier
        if (damage == 0) return
        this.health -= damage;
        //console.log(this.health);

        if (bullet.frostbite) {
            this.slowCountdown = 200;
            gameState.floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, damage, "cyan"));
        }
        else {
            gameState.floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, damage, "orange"));
        }


        this.redTimer = 10;
        if (this.health <= 0) this.dead = true;
        if (this.dead) {
            //enemies[index].image.remove();
            this.killCredit = owner;
            this.value *= owner.xpMultiplier;
            if (this.shield) {
                this.shield.dead = true;
            }


        }
    }

    AddForce(x, y) {
        if (this.isBoss) {
            x /= 2;
            y /= 2;
        }
        this.accelerationX += x;
        this.accelerationY += y;
    }
    Heal(health, floatingObjects) {
        this.health = Math.min(this.health + health, this.maxHealth);
        this.healTimer = 10;

    }
    static Spawn() {
        if (typeof window === "undefined") return
        this.spawnCooldown--;
        if (this.spawnCooldown <= 0) {
            this.spawnCooldown = Math.random() * this.randomTimer + this.baseTimer;
            this.spawnCooldown /= 1 + timeElapsed * SCALE;
            //console.log(ENEMYTYPES[0]+" "+this.index)
            const newEnemy = new ENEMYTYPES[this.index](this.speed, this.health);
            enemies[enemies.length] = newEnemy;
        }
    }
}

function drawEnemy(enemy, image, showHealthBars, rotated) {
    let x = enemy.x;
    let y = enemy.y;
    if (rotated) {
        x = 0;
        y = 0;
    }
    if (enemy.dead) return;
    ctx.save();
    if (enemy.isBoss) {

        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
    }
    else {
        if (showHealthBars && enemy.hasHealthBar) {
            ctx.fillStyle = "red";
            ctx.fillRect(x - enemy.width / 2 - enemy.width / 4, y - enemy.height, enemy.width * 1.5, 15)
            ctx.fillStyle = "green";
            ctx.fillRect(x - enemy.width / 2 - enemy.width / 4, y - enemy.height, (enemy.width * 1.5) / enemy.maxHealth * enemy.health, 15)
        }
    }
    if (enemy.healTimer > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(image, x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'lime';
        ctx.fillRect(x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
    }
    else if (enemy.redTimer > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(image, x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(84, 0, 0, 0.6)';
        ctx.fillRect(x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
    }
    else if (enemy.slowCountdown > 0) {
        ctx.drawImage(image, x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
    }
    else {
        ctx.drawImage(image, x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
    }

    ctx.restore();
}
class BasicEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
    }
}
class ShooterEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 30;
        this.order = 1;
        this.value = 30;
        this.index = 1;
        //console.log(this.shootTimer);
    }
    timer(enemyBulletsArray) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 60;

            if (this.order == 1) {
                this.order = -1;
                enemyBulletsArray.push(new EnemyBullet(5, 0, 1, this.x, this.y));
                enemyBulletsArray.push(new EnemyBullet(-5, 0, 1, this.x, this.y));
            } else {
                this.order = 1;
                enemyBulletsArray.push(new EnemyBullet(0, 5, 1, this.x, this.y));
                enemyBulletsArray.push(new EnemyBullet(0, -5, 1, this.x, this.y));
            }
        }
    }
    special(enemyBulletsArray) {
        this.timer(enemyBulletsArray);
    }
}
class AimingEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 45;
        this.value = 30;
        this.index = 2;
        //console.log(this.shootTimer);
    }
    special(enemyBulletsArray, players) {
        this.timer(enemyBulletsArray, players);
    }
    timer(enemyBulletsArray, players) {
        if (players.length == 0) return;
        //console.log(players);
        let minDist = 100000;
        let minDistID = null;
        for (let id = 0; id < players.length; id++) {
            let dist = Math.hypot(players[id].x - this.x, players[id].y - this.y)
            if (dist < minDist) {
                minDist = dist;
                minDistID = id;
            }
        }
        let player = players[minDistID];
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 90;
            // let actualDistX=Math.abs(this.x-player.x);
            // let actualDistY=Math.abs(this.x-player.x);
            let distanceX = Math.abs(this.x - (player.x));
            let distanceY = Math.abs(this.y - (player.y));
            let bulletvX = 0;
            let bulletvY = 0;
            let bulletvX2 = 0;
            let bulletvY2 = 0;
            let bulletvX3 = 0;
            let bulletvY3 = 0;
            if (distanceX == 0) {
                if (enemy.y > (player.y)) {
                    bulletvY -= 5;
                }
                if (enemy.y < (player.y)) {
                    bulletvY += 5;
                }
            }
            else {
                let angle1 = Math.atan(distanceY / distanceX) + 0.2;
                let angle2 = Math.atan(distanceY / distanceX) - 0.2;
                let angle3 = Math.atan(distanceY / distanceX);
                if (this.x > (player.x)) {
                    bulletvX -= 10 * Math.cos(angle1);
                    bulletvX2 -= 10 * Math.cos(angle2);
                    bulletvX3 -= 10 * Math.cos(angle3);
                }
                if (this.y > (player.y)) {
                    bulletvY -= 10 * Math.sin(angle1);
                    bulletvY2 -= 10 * Math.sin(angle2);
                    bulletvY3 -= 10 * Math.sin(angle3);
                }
                if (this.x < (player.x)) {
                    bulletvX += 10 * Math.cos(angle1);
                    bulletvX2 += 10 * Math.cos(angle2);
                    bulletvX3 += 10 * Math.cos(angle3);
                }
                if (this.y < (player.y)) {
                    bulletvY += 10 * Math.sin(angle1);
                    bulletvY2 += 10 * Math.sin(angle2);
                    bulletvY3 += 10 * Math.sin(angle3);
                }

                //console.log(enemy.x+" "+enemy.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
            }
            //console.log(bulletvX+" "+bulletvY+" "+player.x+" "+player.y+" "+(player.x+speedX*60)+" "+(player.y+speedY*60));
            enemyBulletsArray.push(new EnemyBullet(bulletvX, bulletvY, 1, this.x, this.y));
            enemyBulletsArray.push(new EnemyBullet(bulletvX2, bulletvY2, 1, this.x, this.y));
            enemyBulletsArray.push(new EnemyBullet(bulletvX3, bulletvY3, 1, this.x, this.y));
        }
    }

}
class HomingEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 60;
        this.value = 30;
        this.index = 3;
        //console.log(this.shootTimer);
    }
    special(enemyBulletsArray) {
        this.timer(enemyBulletsArray);
    }
    timer(enemyBulletsArray) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 120;
            enemyBulletsArray.push(new HomingBullet(0, 0, 2, this.x, this.y));
        }
    }
    move(players, floatingObjects, enemies) {
        super.move(players, floatingObjects, enemies);
        if (players.length == 0) return;
        let player=FindClosestPlayer(this.x, this.y, players);
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
        const distance = Math.hypot(distanceX, distanceY);
        if (distance < 300) {
            this.speed = 0;
        }
        else {
            this.speed = 3;
        }
    }
}
class TrapperEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 30;
        this.value = 30;
        this.index = 4;
        //console.log(this.shootTimer);
    }
    timer(enemyBullets) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 50;
            enemyBullets.push(new EnemyTrap(1, this.x, this.y));
        }
    }
    special(enemyBullets) {
        this.timer(enemyBullets);
    }
}
class ZombieEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);

        this.shootTimer = 30;
        this.value = 30;
        this.deathCount = 0;
        this.deathTimer = 0;
        this.originalHealth = health;
        this.index = 5;
        //console.log(this.shootTimer);
    }
    timer() {
        this.deathTimer--;
        if (this.deathTimer == 0) {
            this.ignoreBullets = false;
            this.health = this.originalHealth;
        }
    }
    special() {
        this.timer();
    }
    move(players, floatingObjects, enemies) {
        if (this.deathTimer <= 0) {
            super.move(players, floatingObjects, enemies);
        }
        else {
            this.redTimer--;
            this.healTimer--;
        }
    }
    takeDamage(bullet, owner, gameState) {
        super.takeDamage(bullet, owner, gameState);

        if (this.dead && this.deathCount < 3) {
            this.dead = false;
            this.deathTimer = 300;
            this.health = 0;
            this.deathCount++;
            this.ignoreBullets = true;
        }

    }
}

class ShieldEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.value = 80;
        this.width = 100;
        this.height = 100;
        this.index = 6;
        //console.log(this.shootTimer);
    }
}
class EnemyShield extends Enemy {
    constructor(speed, health, owner) {
        super(speed, health);
        //this.image.src = 'images/shield.webp';
        this.shootTimer = 30;
        this.value = 30;
        this.damage = 0;
        this.owner = owner;
        this.x = owner.x;
        this.y = owner.y;
        this.ignoreShield = true;
        this.width = 150;
        this.height = 150;
        this.hasHealthBar = false;
        this.giveXP = false;
        this.ignoreKnockback = true;
        this.index = 1000;
        this.canSiphon = false;
        if (this.x < mapBorders.leftBorder - 90) {
            this.offsetX = 60;
            this.offsetY = 0;
            this.width = 100;
        }
        if (this.x > mapBorders.rightBorder + 90) {
            this.offsetX = -60;
            this.offsetY = 0;
            this.width = 100;
        }
        if (this.y < mapBorders.topBorder - 90) {
            //this.image.src = 'images/shieldRotated.webp';
            this.offsetX = 0;
            this.offsetY = 60;
            this.height = 100;
        }
        if (this.y > mapBorders.bottomBorder + 90) {
            //this.image.src = 'images/shieldRotated.webp';
            this.offsetX = 0;
            this.offsetY = -60;
            this.height = 100;
        }
        //console.log(this.shootTimer);
    }
    move() {
        this.x = this.owner.x + this.offsetX;
        this.y = this.owner.y + this.offsetY;
        this.healTimer--;
        if (this.owner == null || this.owner.dead == true) {
            this.dead = true;
        }
    }
    takeDamage(bullet, owner, gameState) {
        gameState.floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, 0, "gray"));

    }
    CheckForCramming() {
    }
}
class ChargingEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 100;
        this.width = 50;
        this.height = 50;
        this.value = 80;
        this.index = 7;
        //console.log(this.shootTimer);
    }
    timer() {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 200;
            this.speed = 10;
            this.chargeTimer = 50;
            //this.image.src = 'images/chargingEnemySpecial.webp';
        }
        if (this.chargeTimer <= 0) {
            this.speed = 1;
            //this.image.src = 'images/chargingEnemy.webp';
        }
        this.redTimer--;
        this.chargeTimer--;

    }
    move(players, floatingObjects, enemies) {
        if (players.length == 0) return;
        //console.log(players);
        let minDist = 100000;
        let minDistID = null;
        for (let id = 0; id < players.length; id++) {
            let dist = Math.hypot(players[id].x - this.x, players[id].y - this.y)
            if (dist < minDist) {
                minDist = dist;
                minDistID = id;
            }
        }
        let player = players[minDistID];
        this.healTimer--;
        if (this.chargeTimer > 0) {
            if (this.slowCountdown > 0) {
                this.x += this.vx * 4;
                this.y += this.vy * 4;
            }
            else {
                this.x += this.vx * 8;
                this.y += this.vy * 8;
            }
        }
        else {
            if(typeof window !== "undefined")this.speed*=enemySpeedMultiplier;
            let distanceX = Math.abs(this.x - player.x);
            let distanceY = Math.abs(this.y - player.y);
            if (distanceX == 0) {
                if (this.y > player.y) {
                    this.vy = -this.speed;
                }
                if (this.y < player.y) {
                    this.vy = this.speed;
                }
            }
            else {
                this.angle = Math.atan(distanceY / distanceX);
                if (this.x > player.x) {
                    this.vx = -this.speed * Math.cos(this.angle);
                }
                if (this.y > player.y) {
                    this.vy = -this.speed * Math.sin(this.angle);
                }
                if (this.x < player.x) {
                    this.vx = this.speed * Math.cos(this.angle);
                }
                if (this.y < player.y) {
                    this.vy = this.speed * Math.sin(this.angle);
                }
            }

            if (this.slowCountdown > 0) {
                this.x += this.vx;
                this.y += this.vy;
            }
            else {
                this.x += this.vx * 2;
                this.y += this.vy * 2;
            }
            if(typeof window !== "undefined")this.speed/=enemySpeedMultiplier;
        }
        this.x += this.accelerationX;
        this.y += this.accelerationY;
        this.accelerationX /= 1.05;
        this.accelerationY /= 1.05;
        super.checkForCollisions(players, floatingObjects);
    }
    special() {
        this.timer();
    }
}
class GhostEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 0;
        this.value = 80;
        this.ghostTimer = 0;
        this.index = 8;
        //console.log(this.shootTimer);
    }
    timer() {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.ghostTimer <= 0) {
            this.ignoreBullets = false;
        }
        else {
            this.ghostTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 240;
            this.ghostTimer = 120;
            this.ignoreBullets = true;
        }
    }
    special() {
        this.timer();
    }
}
function drawGhostEnemy(enemy, image, showHealthBars) {
    if (enemy.dead) return;
    ctx.save();
    if (enemy.ignoreBullets) {
        ctx.globalAlpha = 0.5;
    }
    drawEnemy(enemy, image, showHealthBars);
    ctx.restore();

}
class PoisonEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 120;
        this.value = 80;
        this.index = 9;
        //console.log(this.shootTimer);
    }
    timer(enemyBullets, players) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            if (players.length == 0) return;
            //console.log(players);
            let minDist = 100000;
            let minDistID = null;
            for (let id = 0; id < players.length; id++) {
                let dist = Math.hypot(players[id].x - this.x, players[id].y - this.y)
                if (dist < minDist) {
                    minDist = dist;
                    minDistID = id;
                }
            }
            let player = players[minDistID];
            this.shootTimer = 180;
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                angle += Math.random() - 0.3;
                vx = 5 * Math.cos(angle);
                vy = 5 * Math.sin(angle);
            }
            enemyBullets.push(new PoisonBomb(this.x, this.y, vx, vy))
        }
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }
}
class BlackHoleEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 120;
        this.value = 80;
        this.index = 10;
        //console.log(this.shootTimer);
    }
    timer(enemyBullets, players) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            this.shootTimer = 450;
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 3 * Math.cos(angle);
                vy = 3 * Math.sin(angle);
            }
            enemyBullets.push(new BlackHole(1, this.x, this.y, vx, vy))
        }
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }
}
class MimicEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        // this.image.src = 'images/xpBag.webp';
        this.shootTimer = 120;
        this.width = 50;
        this.height = 50;
        this.value = 80;
        this.targetX = Math.random() * (2000 - 2000 / 10) + 2000 / 20;
        this.targetY = Math.random() * (1100 - 1100 / 10) + 1100 / 20;
        this.moveTimer = 240;
        this.trollTimer = -1;
        this.ignoreKnockback = true;
        this.ignoreShield = true;
        this.index = 11;
        this.showHealthBar = false;
        //console.log(this.shootTimer);
    }
    timer() {
        this.trollTimer--;
        this.redTimer--;
    }
    special() {
        this.timer();
    }
    move(player, floatingObjects) {
        if (this.health < this.maxHealth) {
            this.showHealthBar = true;
        }
        if (this.moveTimer > 0) {
            let distanceX = Math.abs(this.x - this.targetX);
            let distanceY = Math.abs(this.y - this.targetY);
            if (this.speedTimer > 0) {
                this.speed *= 2;
            }
            if (this.slowCountdown > 0) {
                this.speed /= 2;
            }
            if (distanceX == 0) {
                if (this.y > this.targetY) {
                    this.y -= this.speed;
                }
                if (this.y < this.targetY) {
                    this.y += this.speed;
                }
            }
            else {
                let angle = Math.atan(distanceY / distanceX);
                if (this.x > this.targetX) {
                    this.x -= this.speed * Math.cos(angle);
                }
                if (this.y > this.targetY) {
                    this.y -= this.speed * Math.sin(angle);
                }
                if (this.x < this.targetX) {
                    this.x += this.speed * Math.cos(angle);
                }
                if (this.y < this.targetY) {
                    this.y += this.speed * Math.sin(angle);
                }
                //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
            }
            if (this.slowCountdown > 0) {
                this.speed *= 2;
            }
            if (this.speedTimer > 0) {
                this.speed /= 2;
            }
            this.moveTimer--;
        }

        if (this.trollTimer < 0) {
            super.checkForCollisions(player, floatingObjects);
        }
        if (this.dead) {
            this.hasHealthBar = false;
            this.dead = false;
            this.health = 0;
            //this.image.src = "images/mimicEnemyDead.webp"
            this.trollTimer = 60;
            this.ignoreBullets = true;
        }
        if (this.trollTimer == 0) {
            this.dead = true;
        }
    }
    takeDamage(a, b, c) {
        super.takeDamage(a, b, c);
        if (this.dead) {
            this.dead = false;
            //this.image.src = "images/mimicEnemyDead.webp"
            this.trollTimer = 60;
            this.ignoreBullets = true;
        }
    }
}
class BuilderEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 120;
        this.width = 75;
        this.height = 75;
        this.value = 150;
        this.index = 12;
        this.ignoreKnockback = true;
        //console.log(this.shootTimer);
    }
    timer(enemyBullets, players, enemies) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            this.shootTimer = 300;
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 3 * Math.cos(angle);
                vy = 3 * Math.sin(angle);
            }
            enemies.push(new EnemyWall(this.x + vx * 30, this.y + vy * 30, 40))
        }
    }
    special(enemyBullets, players, enemies) {
        this.timer(enemyBullets, players, enemies);
    }
}
class EnemyWall extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.value = 0;
        this.damage = 0;
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 200;
        this.index = 1001;
        this.hasHealthBar = false;
        this.canSiphon = false;
        this.giveXP = false;
        this.ignoreKnockback = true;
        this.ignoreShield = true;
        //console.log(this.shootTimer);
    }
    special() {
        this.timer();
    }
    timer() {
        this.redTimer--;
        this.healTimer--;
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    move(players) {
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2)
            ) {
                if (this.x - this.width / 2 > player.x) {
                    player.x -= player.speed;
                }
                if (this.x + this.width / 2 < player.x) {
                    player.x += player.speed;
                }
                if (this.y + this.height / 2 < player.y) {
                    player.y += player.speed;
                }
                if (this.y - this.height / 2 > player.y) {
                    player.y -= player.speed;
                }
            }
        }

    }
}
class WindupEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 200;
        this.chargeTimer = -1;
        this.width = 50;
        this.height = 50;
        this.value = 150;
        this.orb;
        this.index = 13;
        //console.log(this.shootTimer);
    }
    move(players, floatingObjects, enemies) {
        let savedSpeed = this.speed;
        if (this.shootTimer > 200) {
            this.speed = 0;
        }
        if (this.speed == 0) {
            this.ignoreKnockback = true;
        }
        else {
            this.ignoreKnockback = false;
        }
        super.move(players, floatingObjects, enemies);
        this.speed = savedSpeed;
    }
    timer(enemyBullets, players) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0 && this.chargeTimer < 0 && this.accelerationX < 0.1 && this.accelerationY < 0.1) {

            this.shootTimer = 800;
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 3 * Math.cos(angle);
                vy = 3 * Math.sin(angle);
            }
            this.orb = new ChargingOrb(this.x + vx * 20, this.y + vy * 20, vx, vy)
            enemyBullets.push(this.orb)
        }
    }
    AddForce(a, b) {
        super.AddForce(a, b);
        if (this.orb && this.shootTimer > 200) this.orb.dead = true;
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }
    takeDamage(a, b, c) {
        super.takeDamage(a, b, c);
        if (this.dead && this.shootTimer > 200) {
            this.orb.dead = true;
        }
    }
}
class SpawnerEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 400;
        this.width = 100;
        this.height = 100;
        this.value = 150;
        this.spawnerPoints = 0;
        this.spawnerTimer = 0;
        this.releaseTimer = 0;
        this.index = 14;
        this.releasing = false;
        //console.log(this.shootTimer);
    }
    move(players, floatingObjects, enemies) {
        if (this.shootTimer <= 0 && this.speed > 0) {
            this.speed = 0;
            //this.image.src = "images/spawner.webp";
            this.ignoreKnockback = true;
        }
        if (this.spawnerTimer <= 0 && this.shootTimer <= 0 && !this.releasing) {
            this.spawnerPoints++;
            this.spawnerTimer = 80;
            // let upgradeIndicator = new Image();
            // upgradeIndicator.src = "images/spawnerUpgrade.webp"
            floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, "special", "red"));

        }
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (this.shootTimer <= 0 && !this.releasing &&
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2)
            ) {
                if (this.x - this.width / 2 > player.x) {
                    player.x -= player.speed;
                }
                if (this.x + this.width / 2 < player.x) {
                    player.x += player.speed;
                }
                if (this.y + this.height / 2 < player.y) {
                    player.y += player.speed;
                }
                if (this.y - this.height / 2 > player.y) {
                    player.y -= player.speed;
                }
            }
        }

        if (!this.releasing) super.move(players, floatingObjects, enemies);
    }
    timer(enemies, floatingObjects) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        this.spawnerTimer--;
        if (this.releasing) {
            this.releaseTimer++;
            if (this.releaseTimer % 60 == 0) {
                let temp = 0;
                let random = 0;
                temp = Math.ceil(Math.random() * 6);
                if (temp <= 3) {
                    random = 1;
                }
                else if (temp <= 5) {
                    random = 2;
                }
                else {
                    random = 3;
                }
                while (random > this.spawnerPoints) {
                    temp = Math.ceil(Math.random() * 6);
                    if (temp <= 3) {
                        random = 1;
                    }
                    else if (temp <= 5) {
                        random = 2;
                    }
                    else {
                        random = 3;
                    }
                }
                let enemy;
                if (random == 1) {
                    let random2 = Math.ceil(Math.random() * 6);
                    switch (random2) {
                        case 1:
                            enemy = new BasicEnemy(2, 5);
                            break;
                        case 2:
                            enemy = new ShooterEnemy(2, 3);
                            break;
                        case 3:
                            enemy = new AimingEnemy(3.5, 1);
                            break;
                        case 4:
                            enemy = new HomingEnemy(1, 2);
                            break;
                        case 5:
                            enemy = new TrapperEnemy(3, 4);
                            break;
                        case 6:
                            enemy = new ZombieEnemy(2, 3);
                            break;
                    }
                }
                else if (random == 2) {
                    let random2 = Math.ceil(Math.random() * 6);
                    switch (random2) {
                        case 1:
                            enemy = new ChargingEnemy(1, 8);
                            break;
                        case 2:
                            enemy = new ShieldEnemy(1.5, 15);
                            break;
                        case 3:
                            enemy = new GhostEnemy(4, 4);
                            break;
                        case 4:
                            enemy = new PoisonEnemy(1, 5);
                            break;
                        case 5:
                            enemy = new BlackHoleEnemy(1.5, 5);
                            break;
                        case 6:
                            enemy = new MimicEnemy(3, 8);
                            break;
                    }
                }
                else {
                    let random2 = Math.ceil(Math.random() * 2);

                    switch (random2) {
                        case 1:
                            enemy = new BuilderEnemy(1.5, 12);
                            break;
                        case 2:
                            enemy = new WindupEnemy(2, 20);
                            break;
                        case 3:
                            enemy = new SelfDestructEnemy(2, 20);
                            break;
                        case 4:
                            enemy = new MachineGunEnemy(3, 15);
                            break;
                    }
                }
                enemy.x = this.x + Math.random() * 30 - 10;
                enemy.y = this.y + Math.random() * 30 - 10;
                enemies.push(enemy);
                this.spawnerPoints -= random;
            }
            if (this.spawnerPoints <= 0) {
                this.dead = true;
            }
        }
    }
    special(enemyBullets, players, enemies, bullets, floatingObjects) {
        this.timer(enemies, floatingObjects);
    }
    draw() {
        super.draw();
        if (this.shootTimer <= 0) {

            ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
    takeDamage(a, b, c) {
        super.takeDamage(a, b, c);
        if (this.dead && this.shootTimer <= 0) {
            this.dead = false;
            this.health = 0;
            //this.image.src = "images/spawnPortal.webp";
            this.releasing = true;
            this.ignoreBullets = true;
        }
    }
}
class SelfDestructEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 120;
        this.width = 75;
        this.height = 75;
        this.scale = 75;
        this.value = 150;
        this.exploding = false;
        this.explodeTimer = 0;
        this.iFrame = 0;
        this.index = 15;
        //console.log(this.shootTimer);
    }
    timer(enemyBullets, players) {
        this.iFrame--;
        if (this.explodeTimer > 0 && this.explodeTimer % 140 == 1) {
            let angle = 0;
            for (let i = 0; i < 8; i++) {
                let vx = 10 * Math.cos(angle);
                let vy = 10 * Math.sin(angle);
                //console.log(vx+" "+vy)
                let temp = new EnemyBullet(vx, vy, 1, this.x, this.y);
                temp.width = 20;
                temp.height = 20;
                //temp.image.src= 'images/enemyBullet.webp'
                enemyBullets.push(temp);
                angle += Math.PI / 4;
            }
        }
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
        this.speed = 6.5 - (this.health / this.maxHealth) * 15 / 4;
    }
    draw() {
        if (this.exploding) ctx.filter = 'hue-rotate(90deg)';
        super.draw();
        ctx.filter = "none"
    }
    takeDamage(a, b, c) {
        if (this.dead) return;
        super.takeDamage(a, b, c);
        if (this.dead) {
            this.SelfDestruct();
        }
        if (this.exploding && this.explodeTimer < 0) {
            this.dead = true;
        }
    }
    move(players, floatingObjects, enemies) {
        if (this.exploding == false) {
            super.move(players, floatingObjects, enemies);
            if (this.dead) {
                this.SelfDestruct();
            }
        }
        else {
            this.explodeTimer--;
            this.healTimer = -1;
            for (let id = 0; id < players.length; id++) {
                let player = players[id];
                let found = false;
                if (this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2, this.x, this.y)) {
                    player.takeDamage(1, this, floatingObjects);
                    found = true;

                }
                if (found) {
                    this.iFrame = 30;
                }
            }

            if (this.explodeTimer == 0) {
                this.dead = true;
            }
            if (this.explodeTimer > 0) {
                this.scale += 1;
                this.width = this.scale;
                this.height = this.scale;
            }

        }
    }
    SelfDestruct() {
        this.dead = false;
        this.exploding = true;
        this.hasHealthBar = false;
        //this.image.src='images/explosion.webp';
        this.redTimer = -1;
        this.healTimer = -1;
        this.slowCountdown = -1;
        this.ignoreBullets = true;
        this.explodeTimer = 422;
    }
}
class MachineGunEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 30;
        this.value = 150;
        this.width = 100;
        this.height = 100;
        this.index = 16;
        this.angle = 0;
        //console.log(this.shootTimer);
    }
    timer(enemyBullets, players) {
        if (players.length == 0) return;
        let player = FindClosestPlayer(this.x, this.y, players);
        this.angle = Math.atan2((player.y - this.y), (player.x - this.x));
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 30;
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 10 * Math.cos(angle);
                vy = 10 * Math.sin(angle);
            }
            let temp = new EnemyBullet(vx, vy, 1, this.x, this.y);
            temp.width = 40;
            temp.height = 40;
            temp.index = 8;
            enemyBullets.push(temp);
        }
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }

    move(players, floatingObjects, enemies) {
        super.move(players, floatingObjects, enemies);
        if (players.length == 0) return;
        let player = FindClosestPlayer(this.x, this.y, players);
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
        const distance = Math.hypot(distanceX, distanceY);
        if (distance < 400 && this.dead == false) {
            this.speed = 0;
        }
        else {
            this.speed = 3;
        }
    }

}
class SmokeBombEnemy extends Enemy {

    constructor(speed, health) {
        super(speed, health);
        this.width = 100;
        this.height = 100;

        this.isMoving = true;
        this.isExpanding = false;
        this.targetX = Math.random() * (2000 - 2000 / 10) + 2000 / 20;
        this.targetY = Math.random() * (1100 - 1100 / 10) + 1100 / 20;

        //console.log(this.shootTimer);

        // this.smoke = new Image();
        // this.smoke.src = "images/smoke.webp";
        this.smokeWidth = 75;
        this.smokeHeight = 75;
        this.health = health;
        this.iFrame = 0;
        this.value = 150;
        this.index = 17;
    }

    move(players, floatingObjects, enemies) {
        this.iFrame--;
        this.redTimer--;
        this.slowCountdown--;
        if (this.isMoving) {
            let distanceX = Math.abs(this.x - this.targetX);
            let distanceY = Math.abs(this.y - this.targetY);
            if (distanceX * distanceX + distanceY * distanceY < 10) {
                this.isMoving = false;
                this.isExpanding = true;
            }
            if (this.speedTimer > 0) {
                this.speed *= 2;
            }
            if (this.slowCountdown > 0) {
                this.speed /= 2;
            }
            if (distanceX == 0) {
                if (this.y > this.targetY) {
                    this.y -= this.speed;
                }
                if (this.y < this.targetY) {
                    this.y += this.speed;
                }
            }
            else {
                let angle = Math.atan(distanceY / distanceX);
                if (this.x > this.targetX) {
                    this.x -= this.speed * Math.cos(angle);
                }
                if (this.y > this.targetY) {
                    this.y -= this.speed * Math.sin(angle);
                }
                if (this.x < this.targetX) {
                    this.x += this.speed * Math.cos(angle);
                }
                if (this.y < this.targetY) {
                    this.y += this.speed * Math.sin(angle);
                }
                //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
            }
            if (this.slowCountdown > 0) {
                this.speed *= 2;
            }
            if (this.speedTimer > 0) {
                this.speed /= 2;
            }
        }
        if (this.isExpanding && this.smokeHeight < 1000) {
            this.smokeWidth += 1;
            this.smokeHeight += 1;
        }
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0
            ) {
                player.takeDamage(2, this, floatingObjects);
                if (this.x > player.x) {
                    player.AddForce(-10, 0);
                }
                if (this.x < player.x) {

                    player.AddForce(10, 0);
                }
                if (this.y > player.y) {

                    player.AddForce(0, -10);
                }
                if (this.y < player.y) {

                    player.AddForce(0, 10);
                }
                this.iFrame = 15;
            }
        }

    }
    special() {
        //console.log(this.frostAura.style.left);
        // for(let i=0;i<enemies.length;i++){
        //     if (RectCircleColliding(this, enemies[i], 175, this.x, this.y)) {
        //         enemies[i].speedTimer=30;
        //     }
        // }

    }
}
class SplitterEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 60;
        this.value = 150;
        this.width = 100;
        this.height = 100;
        this.index = 18;
        //console.log(this.shootTimer);
    }
    timer(enemyBullets, players) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 210;
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 3 * Math.cos(angle);
                vy = 3 * Math.sin(angle);
            }
            let temp = new SplitterBullet(vx, vy, 1, this.x - 5, this.y - 5, 4, 80);
            enemyBullets.push(temp)
        }
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }


}
class TeleporterEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.value = 30;
        this.width = 75;
        this.height = 75;
        this.index = 19;
        //console.log(this.shootTimer);
    }
    takeDamage(bullet, owner, gameState) {
        super.takeDamage(bullet, owner, gameState);
        let player = owner;
        let distanceX = player.x - this.x;
        let distanceY = player.y - this.y;
        let distance = distanceX * distanceX + distanceY * distanceY;
        let vx = 0;
        let vy = 0;

        if (distance > 0) {
            let angle = Math.atan2(distanceY, distanceX);
            vx = 35 * Math.cos(angle);
            vy = 35 * Math.sin(angle);
        }
        this.x += vx;
        this.y += vy;
    }


}
class IceEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.shootTimer = 60;
        this.value = 30;
        this.width = 50;
        this.height = 50;
        this.index = 20;
        //console.log(this.shootTimer);
    }
    timer(enemyBullets, players) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 240;
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 5 * Math.cos(angle);
                vy = 5 * Math.sin(angle);
            }
            let temp = new EnemyBullet(vx, vy, 1, this.x, this.y);
            temp.width = 20;
            temp.height = 20;
            temp.index = 10;
            temp.frostbite = true;
            enemyBullets.push(temp)
        }
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }


}
function drawMachineGunEnemy(enemy, image, angle, showHealthBars) {
    if (enemy.dead) return;

    ctx.save();

    if (showHealthBars) {
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x - enemy.width / 2 - enemy.width / 4, enemy.y - enemy.height, enemy.width * 1.5, 15);
        ctx.fillStyle = "green";
        ctx.fillRect(enemy.x - enemy.width / 2 - enemy.width / 4, enemy.y - enemy.height, (enemy.width * 1.5) / enemy.maxHealth * enemy.health, 15);
    }

    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(angle - Math.PI / 4);

    if (enemy.healTimer > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(image, x - enemy.width / 2, y - enemy.height / 2, enemy.width, enemy.height);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'lime';
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (enemy.redTimer > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(image, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);

        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (enemy.slowCountdown > 0) {
        ctx.drawImage(image, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);

        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    else {
        ctx.drawImage(image, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
    }

    ctx.restore();
}


function FindClosestPlayer(x, y, players) {

    if (players.length == 0) return;
    let minDist = 100000;
    let minDistID = null;
    for (let id = 0; id < players.length; id++) {
        let dist = Math.hypot(players[id].x - x, players[id].y - y)
        if (dist < minDist) {
            minDist = dist;
            minDistID = id;
        }
    }
    return players[minDistID];
}



class LaserBoss extends Enemy {
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.width = 150;
        this.height = 150;

        this.shootTimer = 400;
        this.shootTimer -= this.shootTimer * (bossMultiplier - 1) * 0.4
        this.isBoss = true;
        this.value = 500;

        // this.bossText = document.createElement("div");
        // this.bossText.style.position = "absolute"
        // this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        // this.bossText.style.zIndex = 2;
        // this.bossText.style.transform = "translate(-50%, -50%)";
        // this.bossText.id="bossText";
        //document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.stage = 0;
        this.index = 0;
        this.stageTimer = 0;
        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;
        this.bossBar = new BossBar(bossBars, "Nvidia");
        this.bossMultiplier = bossMultiplier;

        bossBars.push(this.bossBar);
    }
    timer(enemyBullets, players) {
        this.speedTimer--;
        if (this.stage > 0) {
            if (this.slowCountdown > 0) {
                this.stageTimer += 0.5;
            }
            else {
                this.stageTimer++;
            }
            this.stageTimer += (this.bossMultiplier - 1)
            if (this.stageTimer >= 20) {
                this.stage++;
                enemyBullets.push(new Laser(this.angle + (1.2 - this.stage * 0.2), this.x, this.y));
                enemyBullets.push(new Laser(this.angle - (1.2 - this.stage * 0.2), this.x, this.y));
                this.stageTimer = 0;
            }
            if (this.stage == 5) this.stage = 0;
        }
        if (this.speedTimer <= 0) {
            this.speed = 1;
        }
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            this.shootTimer = 550;
            this.shootTimer -= this.shootTimer * (this.bossMultiplier - 1) * 0.4
            let distanceX = player.x - (this.x);
            let distanceY = player.y - (this.y);

            this.angle = Math.atan2(distanceY, distanceX);
            this.stage = 1;
            enemyBullets.push(new Laser(this.angle + 1.2, this.x, this.y));
            enemyBullets.push(new Laser(this.angle - 1.2, this.x, this.y));
            this.speed = 0;
            this.speedTimer = 450;
            this.speedTimer -= this.speedTimer * (this.bossMultiplier - 1) * 0.4
        }
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }
}
class IceBoss extends Enemy {
    /*
    Idea: Frost circle that slows player and slows player bullets
    Ice wall that slowly shrinks over time to force player closer
    */
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.width = 150;
        this.height = 150;

        this.shootTimer = 350;
        this.shootTimer -= this.shootTimer * (bossMultiplier - 1) * 0.4
        this.isBoss = true;
        this.value = 500;
        //console.log(this.image.style.transform+" transofrmer");

        // this.frostAura = new Image();
        // this.frostAura.src = "images/frostAura.webp";
        this.frostAuraWidth = 750;
        this.frostAuraHeight = 750;
        this.index = 1;

        // this.bossText = document.createElement("div");
        // this.bossText.style.position = "absolute"
        // this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Job Application</div>`
        // this.bossText.style.left = (2000 / 2-200) + "px";
        // this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        // this.bossText.style.zIndex = 2;
        // this.bossText.style.transform = "translate(-50%, -50%)";
        // this.bossText.id="bossText";
        //console.log(bossText.style.transform+" tradsnf");

        //console.log(this.shootTimer);
        this.stage = 0;
        this.stageTimer = 0;
        this.bossMultiplier = bossMultiplier;
        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;
        this.bossBar = new BossBar(bossBars, "Job Application");
        bossBars.push(this.bossBar);

    }
    timer(enemyBullets, players) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 250;
            this.shootTimer -= this.shootTimer * (this.bossMultiplier - 1) * 0.4

            enemyBullets.push(new Icicle(0, 5, 3, this.x, this.y, 20, 40));
            enemyBullets.push(new Icicle(5, 0, 3, this.x, this.y, 40, 20));
            enemyBullets.push(new Icicle(0, -5, 3, this.x, this.y, 20, 40));
            enemyBullets.push(new Icicle(-5, 0, 3, this.x, this.y, 40, 20));
        }
    }
    takeDamage(bullet, index, gameState) {
        super.takeDamage(bullet, index, gameState);
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.globalAlpha = 0.4;
        ctx.drawImage(this.frostAura, this.x - this.frostAuraWidth / 2, this.y - this.frostAuraHeight / 2, this.frostAuraWidth, this.frostAuraHeight);
        ctx.globalAlpha = 1;
        if (this.healTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'lightgreen';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.redTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.slowCountdown > 0) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }
    special(enemyBullets, players, enemies, bullets) {
        //console.log(this.frostAura.style.left);
        this.timer(enemyBullets, players);
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (RectCircleColliding(this, player, 375, this.x, this.y)) {
                player.slowCountdown = 30;
            }
            for (let i = 0; i < bullets.length; i++) {
                if (RectCircleColliding(this, bullets[i], 375, this.x, this.y)) {
                    bullets[i].slowed = true;
                }
                else {
                    bullets[i].slowed = false;
                }
            }
        }


    }
}
class BouncyBoss extends Enemy {
    /*
    Idea: Fast but bounces off of walls, gets slightly faster after each bounce
    */
    constructor(speed, health, first, bossBars, bossMultiplier) {
        super(speed, health);
        this.first = first;
        //console.log(this.image.style.transform+" transofrmer");

        this.spawnTimer = 0;
        this.iFrame = 0;
        if (this.first) {
            this.speedX = speed / 1.4;
            this.speedY = speed / 1.4;
            this.width = 150;
            this.height = 150;
            this.value = 500;
            this.isBoss = true;
            this.damage = 2;
            this.force = 15;
            this.index = 2;
            this.ignoreShield = true;
            this.health = Math.ceil(this.health * bossMultiplier);
            if (typeof window === "undefined") {
                this.health *= 2;
            }
            this.maxHealth = this.health;
            this.bossBar = new BossBar(bossBars, "Legally Distinct Thwomp");
            bossBars.push(this.bossBar);
            this.ignoreKnockback = true;

        }
        else {
            let angle = Math.random() * Math.PI / 2;
            this.speedX = speed * Math.sin(angle);
            this.speedY = speed * Math.cos(angle);
            this.value = 0;
            this.width = 75;
            this.height = 75;
            this.damage = 1;
            this.force = 10;
            this.index = 1002;
        }
        this.maxSpeed = 20;
        if (bossMultiplier == 0.5) {
            speed *= 0.75;
            this.maxSpeed = 10
        }
        else if (bossMultiplier == 0.75) {
            speed *= 1
            this.maxSpeed = 15
        }
        else if (bossMultiplier == 1) {
            speed *= 1.25;
            this.maxSpeed = 20
        }
        else {
            speed *= 1.5;
            this.maxSpeed = 30;
        }

        //console.log(bossText.style.transform+" tradsnf");

    }
    move(players, floatingObjects, enemies) {
        this.spawnTimer++;
        if (this.slowCountdown > 0) {
            this.speedX /= 2;
            this.speedY /= 2;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.slowCountdown > 0) {
            this.speedX *= 2;
            this.speedY *= 2;
        }
        if (this.x < (this.width - 50) / 2 + mapBorders.leftBorder) {
            this.x = (this.width - 50) / 2 + mapBorders.leftBorder;
            this.speedX *= -1.03;
            this.speedY *= 1.03;
            this.makeClone(enemies);
        }
        if (this.y < (this.width - 50) / 2 + mapBorders.topBorder) {
            this.y = (this.width - 50) / 2 + mapBorders.topBorder;
            this.speedX *= 1.03;
            this.speedY *= -1.03;
            this.makeClone(enemies);
        }
        if (this.x > mapBorders.rightBorder - (this.width - 50) / 2) {
            this.x = mapBorders.rightBorder - (this.width - 50) / 2;
            this.speedX *= -1.03;
            this.speedY *= 1.03;
            this.makeClone(enemies);
        }
        if (this.y > mapBorders.bottomBorder - (this.width - 50) / 2) {
            this.y = mapBorders.bottomBorder - (this.width - 50) / 2;
            this.speedX *= 1.03;
            this.speedY *= -1.03;
            this.makeClone(enemies);
        }
        if (this.speedX < 0) {
            this.speedX = Math.max(this.speedX, -this.maxSpeed);
        }
        else {
            this.speedX = Math.min(this.speedX, this.maxSpeed);
        }
        if (this.speedY < 0) {
            this.speedY = Math.max(this.speedY, -this.maxSpeed);
        }
        else {
            this.speedY = Math.min(this.speedY, this.maxSpeed);
        }
        for (let id = 0; id < players.length; id++) {
            let player = players[id]
            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0 && (!this.first || this.spawnTimer > 120)
            ) {
                player.takeDamage(this.damage, this, floatingObjects);
                if (this.x > player.x) {
                    player.AddForce(-this.force, 0);
                }
                if (this.x < player.x) {

                    player.AddForce(this.force, 0);
                }
                if (this.y > player.y) {

                    player.AddForce(0, -this.force);
                }
                if (this.y < player.y) {

                    player.AddForce(0, this.force);
                }
                this.iFrame = 15;
            }
        }
        if (this.slowCountdown > 0) {
            this.slowCountdown--;
        }

        this.redTimer--;

        this.iFrame--;
        this.x += this.accelerationX;
        this.y += this.accelerationY;
        this.accelerationX /= 1.05;
        this.accelerationY /= 1.05;
    }
    special() {
        //console.log(this.frostAura.style.left);

    }
    AddForce() {

    }
    makeClone(enemies) {
        if (!this.first || this.spawnTimer < 120) return;
        let temp = new BouncyBoss(5, 4, false);
        temp.x = this.x;
        temp.y = this.y;
        enemies.push(temp);
    }
}
class MageBoss extends Enemy {
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.width = 150;
        this.height = 150;

        this.shootTimer = 100;
        this.isBoss = true;
        this.value = 500;
        //console.log(this.image.style.transform+" transofrmer");

        //console.log(this.shootTimer);
        this.cycle = 0;
        this.attackTimer = 0;
        this.index = 3;
        //this.health=Math.ceil(this.health*bossMultiplier);
        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;
        this.bossMultiplier = bossMultiplier;
        this.bossBar = new BossBar(bossBars, "The Demonlist");
        bossBars.push(this.bossBar);

    }
    timer(enemyBullets, players) {
        //console.log(this.attackTimer);
        this.attackTimer--;
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.attackTimer > 0) {
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            if (this.cycle == 0 && this.attackTimer % 2 != 0) {
                let distanceX = player.x - this.x;
                let distanceY = player.y - this.y;
                let distance = distanceX * distanceX + distanceY * distanceY;
                let vx = 0;
                let vy = 0;

                if (distance > 0) {
                    let angle = Math.atan2(distanceY, distanceX);
                    angle += Math.random() - 0.4;
                    vx = 10 * Math.cos(angle);
                    vy = 10 * Math.sin(angle);
                }
                enemyBullets.push(new Fire(1, this.x, this.y, vx, vy))
            }
            if (this.cycle == 1 && this.attackTimer % 40 == 1) {
                let distanceX = player.x - this.x;
                let distanceY = player.y - this.y;
                let distance = distanceX * distanceX + distanceY * distanceY;
                let vx = 0;
                let vy = 0;

                if (distance > 0) {
                    let angle = Math.atan2(distanceY, distanceX);
                    angle -= 0.2;
                    for (let i = 0; i < 9; i++) {
                        vx = 10 * Math.cos(angle);
                        vy = 10 * Math.sin(angle);
                        enemyBullets.push(new Water(1, this.x, this.y, vx, vy))
                        angle += 0.05;
                    }
                }
            }
            if (this.cycle == 2) {
                let distanceX = player.x - this.x;
                let distanceY = player.y - this.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                let vx = 0;
                let vy = 0;

                if (distance > 0) {
                    let angle = Math.atan2(distanceY, distanceX);
                    angle -= 0.6;
                    for (let i = 0; i < 4; i++) {
                        vx = 3 * Math.cos(angle);
                        vy = 3 * Math.sin(angle);
                        enemyBullets.push(new BigRock(2, this.x, this.y, vx, vy))
                        angle += 0.4;
                    }
                }
            }

        }
        if (this.shootTimer <= 0 && this.attackTimer <= 0) {
            this.shootTimer = 400;
            this.shootTimer -= this.shootTimer * (this.bossMultiplier - 1) * 0.4
            this.cycle++;
            if (this.cycle == 3) this.cycle = 0;
            if (this.cycle == 0) {
                this.attackTimer = 120;
                //this.image.src = 'images/mageFireMode.webp';
            }
            else if (this.cycle == 1) {
                this.attackTimer = 120;
                //this.image.src = 'images/mageWaterMode.webp';
            }
            else if (this.cycle == 2) {
                this.attackTimer = 2;
                //this.image.src = 'images/mageRockMode.webp';
            }
        }
    }
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
    }
    move(players, floatingObjects, enemies) {
        super.move(players, floatingObjects, enemies);
    }
    special(a, b) {
        //console.log(this.frostAura.style.left);
        this.timer(a, b);

    }
    takeDamage(a, b, c) {
        super.takeDamage(a, b, c);
        if (this.dead && typeof window !== "undefined" && MagePlayer.unlocked == false) {
            MagePlayer.unlocked = true;
            newEnemyQueue.push("images/magePlayer.webp");
            isPlayerUnlocked.push(true);
        }
    }
}
class BulletHellBoss extends Enemy {
    /*
    Idea: cool bullet patterns
    */
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.maxHealth = health;

        this.width = 135;
        this.height = 135;

        this.shootTimer = 0;
        this.isBoss = true;
        this.value = 500;
        //console.log(this.image.style.transform+" transofrmer");

        //console.log(bossText.style.transform+" tradsnf");

        //console.log(this.shootTimer);
        this.angle = 0;
        this.walkTimer = 600;

        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;
        this.bossBar = new BossBar(bossBars, "McAfee");
        bossBars.push(this.bossBar);
        this.loopingShotTimer = 0;
        this.spiralShotTimer = 0;
        this.laserTimer = 0;
        this.ignoreShield = true;
        this.ignoreKnockback = true;
        this.index = 4;
        this.bossMultiplier = bossMultiplier;

    }
    timer(enemyBullets, players) {
        //console.log(this.attackTimer);
        this.attackTimer--;
        this.knockbackIFrame--;
        this.redTimer--;
        if (this.slowCountdown > 0) {
            this.walkTimer -= 0.5;
            this.loopingShotTimer -= 0.4;
            this.spiralShotTimer -= 0.4;
            this.laserTimer -= 0.4;
        }
        else {
            this.walkTimer -= 1;
            this.loopingShotTimer -= 0.8;
            this.spiralShotTimer -= 0.8;
            this.laserTimer -= 0.8;
        }
        if (this.health <= this.maxHealth / 3) {
            // this.image.src = "images/bulletHellBossEnraged.webp";
            // this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">VIRUS DETECTED</div>`
            this.bossBar.title = "VIRUS DETECTED";
            if (this.slowCountdown > 0) {
                this.loopingShotTimer -= 0.4;
                this.spiralShotTimer -= 0.4;
                this.laserTimer -= 0.4;
            }
            else {
                this.loopingShotTimer -= 0.8;
                this.spiralShotTimer -= 0.8;
                this.laserTimer -= 0.8;
            }
        }
        if (this.walkTimer <= 0) {
            this.speed = 0;
            if (this.loopingShotTimer <= 0) {
                this.loopingShotTimer = 40;

                this.loopingShotTimer -= this.loopingShotTimer * (this.bossMultiplier - 1) * 0.4

                if (players.length == 0) return;
                let player = FindClosestPlayer(this.x, this.y, players);
                let distanceX = player.x - this.x;
                let distanceY = player.y - this.y;
                let distance = distanceX * distanceX + distanceY * distanceY;
                let vx = 0;
                let vy = 0;
                if (distance > 0) {
                    let angle = Math.atan2(distanceY, distanceX);
                    vx = 5 * Math.cos(angle);
                    vy = 5 * Math.sin(angle);
                }
                enemyBullets.push(new SpinningBullet(vx, vy, 1, this.x, this.y))

            }
            if (this.spiralShotTimer <= 0) {
                this.spiralShotTimer = 40;

                this.spiralShotTimer -= this.spiralShotTimer * (this.bossMultiplier - 1) * 0.4
                this.angle += 0.4;
                this.angle %= Math.PI * 2;
                for (let i = 0; i < 4; i++) {

                    let vx = 5 * Math.cos(this.angle);
                    let vy = 5 * Math.sin(this.angle);
                    let temp = new EnemyBullet(vx, vy, 1, this.x, this.y);
                    temp.width = 25;
                    temp.height = 25;
                    temp.index = 16;
                    enemyBullets.push(temp);
                    this.angle += Math.PI / 2
                }
            }
            if (this.laserTimer <= 0) {
                this.laserTimer = 350;
                this.laserTimer -= this.laserTimer * (this.bossMultiplier - 1) * 0.4
                enemyBullets.push(new Laser(0, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI / 2, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI * 1.5, this.x, this.y));

            }

        }

    }
    move(players, floatingObjects) {
        this.healTimer--;
        let distanceX = Math.abs(this.x - 2000 / 2);
        let distanceY = Math.abs(this.y - 1100 / 2);
        if (this.slowCountdown > 0) {
            this.speed /= 2;
        }
        if (distanceX == 0) {
            if (this.y > 2000 / 2) {
                this.y -= this.speed;
            }
            if (this.y < 1100 / 2) {
                this.y += this.speed;
            }
        }
        else {
            let angle = Math.atan(distanceY / distanceX);
            if (this.x > 2000 / 2) {
                this.x -= this.speed * Math.cos(angle);
            }
            if (this.y > 1100 / 2) {
                this.y -= this.speed * Math.sin(angle);
            }
            if (this.x < 2000 / 2) {
                this.x += this.speed * Math.cos(angle);
            }
            if (this.y < 1100 / 2) {
                this.y += this.speed * Math.sin(angle);
            }
            //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
        }
        if (this.slowCountdown > 0) {
            this.speed *= 2;
        }

        this.x += this.accelerationX;
        this.y += this.accelerationY;
        this.accelerationX /= 1.05;
        this.accelerationY /= 1.05;
        super.checkForCollisions(players, floatingObjects);
    }
    special(enemyBullets, players) {
        //console.log(this.frostAura.style.left);
        this.timer(enemyBullets, players);

    }
    AddForce() {

    }
}
class GambleBoss extends Enemy {
    /*
    Idea: gambling
    */
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.maxHealth = health;
        this.width = 150;
        this.height = 150;

        this.shootTimer = 0;
        this.isBoss = true;
        this.value = 750;
        //console.log(this.image.style.transform+" transofrmer");

        //console.log(bossText.style.transform+" tradsnf");

        //console.log(this.shootTimer);

        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;

        this.bossBar = new BossBar(bossBars, "Random Seed Glitchless");
        bossBars.push(this.bossBar);
        this.shootTimer = 0;
        this.gambleTimer = 60;
        this.currentGamble = 0;
        this.laserTimer = -60;
        this.angle = 0;
        this.index = 5;
        this.bossMultiplier = bossMultiplier;

    }
    timer(enemyBullets, players, enemies) {
        //console.log(this.attackTimer);
        this.gambleTimer--;
        this.laserTimer--;
        this.randomStuffTimer--;
        if (this.slowCountdown > 0) {
            this.walkTimer -= 0.5;
            this.shootTimer -= 0.5;
        }
        else {
            this.walkTimer--;
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.gambleTimer = 90;
            this.shootTimer = 300;
        }
        if (this.gambleTimer > 20 && this.gambleTimer % 3 == 0) {
            this.Gamble();
        }

        if (players.length == 0) return;
        let player = FindClosestPlayer(this.x, this.y, players);
        let distanceX = player.x - this.x;
        let distanceY = player.y - this.y;
        let distance = distanceX * distanceX + distanceY * distanceY;
        let vx = 0;
        let vy = 0;
        if (this.gambleTimer == 0) {
            switch (this.currentGamble) {
                case 1:

                    if (distance > 0) {
                        let angle = 0
                        for (let i = 0; i < 32; i++) {
                            vx = 10 * Math.cos(angle);
                            vy = 10 * Math.sin(angle);
                            console.log(vx + " " + vy)
                            enemyBullets.push(new EnemyBullet(vx, vy, 1, this.x, this.y))
                            angle += Math.PI / 16;
                        }
                    }
                    break;
                case 2:

                    if (distance > 0) {
                        let angle = Math.atan2(distanceY, distanceX);
                        angle -= 1.4;
                        for (let i = 0; i < 8; i++) {
                            vx = 5 * Math.cos(angle);
                            vy = 5 * Math.sin(angle);
                            let temp = new HomingBullet(vx / 2, vy / 2, 2, this.x, this.y);
                            temp.speedX = vx / 2;
                            temp.speedY = vy / 2;
                            enemyBullets.push(temp)

                            angle += 0.4;
                        }
                        angle = Math.atan2(distanceY, distanceX);
                        angle -= 0.9;
                        for (let i = 0; i < 3; i++) {
                            vx = 5 * Math.cos(angle);
                            vy = 5 * Math.sin(angle);
                            let temp = new BlackHole(1, this.x, this.y, vx / 2, vy / 2);
                            temp.speedX = vx / 2;
                            temp.speedY = vy / 2;
                            enemyBullets.push(temp)

                            angle += 0.6;
                        }
                    }
                    break;
                case 3:
                    let enemy1 = new WindupEnemy(2, 20);
                    enemy1.x = this.x + Math.random() * 60;
                    enemy1.y = this.y + Math.random() * 60;
                    enemies.push(enemy1);
                    let enemy2 = new BuilderEnemy(1.5, 12);
                    enemy2.x = this.x + Math.random() * 60;
                    enemy2.y = this.y + Math.random() * 60;
                    enemies.push(enemy2);
                    let enemy3 = new SpawnerEnemy(1.5, 25);
                    enemy3.x = this.x + Math.random() * 60;
                    enemy3.y = this.y + Math.random() * 60;
                    enemies.push(enemy3);

                    break;
                case 4:
                    this.laserTimer = 121;
                    break;
                case 5:
                    this.randomStuffTimer = 121;
            }
        }
        if (this.laserTimer > -60 || this.randomStuffTimer > -60) {
            this.speed = 0;
        }
        else {
            this.speed = 2;
        }
        if (this.laserTimer % 5 == 1 && this.laserTimer > 0) {

            enemyBullets.push(new Laser(this.angle, this.x, this.y));
            this.angle += Math.PI / 12;
        }
        if (this.randomStuffTimer > 0 && this.randomStuffTimer % 3 == 0) {

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                angle += Math.random() * 2 - 1;
                let random = Math.ceil(Math.random() * 6);
                vx = 10 * Math.cos(angle);
                vy = 10 * Math.sin(angle);
                switch (random) {
                    case 1:
                        enemyBullets.push(new EnemyBullet(2, this.x, this.y, vx, vy))
                        break;
                    case 2:
                        enemyBullets.push(new HomingBullet(2, this.x, this.y, vx / 2, vy / 2))
                        break;
                    case 3:
                        enemyBullets.push(new PoisonBomb(this.x, this.y, vx / 2, vy / 2))
                        break;
                    case 4:
                        enemyBullets.push(new BlackHole(1, this.x, this.y, vx / 2, vy / 2))
                        break;
                    case 5:
                        enemyBullets.push(new Laser(angle, this.x, this.y));
                        break;
                    case 6:
                        enemyBullets.push(new BigRock(1, this.x, this.y, vx / 2, vy / 2));
                        break;


                }
            }
        }


    }
    takeDamage(bullet, owner, gameState) {
        super.takeDamage(bullet, owner, gameState);
    }
    Gamble() {
        let randomNum = Math.ceil(Math.random() * 100);
        switch (this.bossMultiplier) {
            case 0.5:
                if (randomNum <= 50) {
                    this.currentGamble = 1
                }
                else if (randomNum <= 75) {
                    this.currentGamble = 2
                }
                else if (randomNum <= 90) {
                    this.currentGamble = 3
                }
                else if (randomNum <= 97) {
                    this.currentGamble = 4
                }
                else {
                    this.currentGamble = 5;
                }
                break;
            case 0.75:
                if (randomNum <= 40) {
                    this.currentGamble = 1
                }
                else if (randomNum <= 65) {
                    this.currentGamble = 2
                }
                else if (randomNum <= 85) {
                    this.currentGamble = 3
                }
                else if (randomNum <= 95) {
                    this.currentGamble = 4
                }
                else {
                    this.currentGamble = 5;
                }
                break;
            case 1:
                if (randomNum <= 30) {
                    this.currentGamble = 1
                }
                else if (randomNum <= 55) {
                    this.currentGamble = 2
                }
                else if (randomNum <= 78) {
                    this.currentGamble = 3
                }
                else if (randomNum <= 92) {
                    this.currentGamble = 4
                }
                else {
                    this.currentGamble = 5;
                }
                break;
            case 2:
                if (randomNum <= 20) {
                    this.currentGamble = 1
                }
                else if (randomNum <= 50) {
                    this.currentGamble = 2
                }
                else if (randomNum <= 70) {
                    this.currentGamble = 3
                }
                else if (randomNum <= 90) {
                    this.currentGamble = 4
                }
                else {
                    this.currentGamble = 5;
                }
                break;

        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        if (this.healTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'lime';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.redTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.slowCountdown > 0) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        ctx.restore();
        ctx.save();
        if (this.gambleTimer > -60) {

            switch (this.currentGamble) {
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
            ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
        }
        ctx.restore();

    }
    special(enemyBullets, players, enemies) {
        //console.log(this.frostAura.style.left);
        this.timer(enemyBullets, players, enemies);

    }
}
class SnakeBoss extends Enemy {
    /*
    idea: snake from slither.io. it is split into multiple sections with each section following the head. the head is the only part that can be damaged. other parts knockback the player if they collide. can occasionally get a speed boost

    */

    constructor(speed, health, isLeader, bodyCount, bossBars, bossMultiplier, leader) {
        super(speed, health);

        this.isLeader = isLeader;
        this.leader = isLeader ? null : leader;
        this.isBoss = isLeader;
        this.hasHealthBar = isLeader;
        this.ignoreShield = isLeader;
        this.canSiphon = false;
        this.exploding = false;

        this.delayX = isLeader ? new Float32Array(1600) : null;
        this.delayY = isLeader ? new Float32Array(1600) : null;
        this.delayHead = 0;
        this.delayFilled = 0;

        this.spawnX = isLeader ? this.x : 0;
        this.spawnY = isLeader ? this.y : 0;
        this.angle = 0;
        this.count = 0;
        this.maxCount = 80;

        this.value = isLeader ? 750 : 0;
        this.index = isLeader ? 6 : 1003;

        this.bossBar = null;

        this.width = 100;
        this.height = 100;
        this.shootTimer = 100;
        this.bossMultiplier = bossMultiplier;
        this.cycle = 0;
        this.attackTimer = 0;

        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;

        this.bodyCount = bodyCount;
        this.spawnDelay = 20;
        this.delay = (79 - bodyCount) * 20;
        this.iFrame = 0;
        this.explodeTimer = 0;
        this.ignoreKnockback = true;

        if (!isLeader) {
            this.x = -1000;
            this.y = -1000;
        }

        if (isLeader) {
            this.bossBar = new BossBar(bossBars, "Slither.io");
            bossBars.push(this.bossBar);
        }
    }
    toJSON() {
        return {
            id: this.id,
            x: this.x | 0,
            y: this.y | 0,
            index: this.index,
            width: this.width,
            height: this.height,
            angle: this.angle,
            health: this.health,
            maxHealth: this.maxHealth,
            isBoss: this.isBoss,
            isLeader: this.isLeader,
            hasHealthBar: this.hasHealthBar,
            bossName: this.isLeader ? "Slither.io" : null,
            title: this.isLeader && this.bossBar ? this.bossBar.title : null,
            barLength: this.isLeader && this.maxHealth > 0
                ? (this.health / this.maxHealth) * 600 | 0
                : 0,
            redTimer: this.redTimer,
            dead: this.dead
        };
    }
    timer(enemyBullets, players, enemies) {
        if (this.isLeader) {
            this.maxCount = this.maxHealth / 6;
        }
        if (!this.isLeader && this.explodeTimer <= 0 && !this.exploding && ((this.leader.health < this.leader.maxHealth - this.bodyCount * (this.leader.maxHealth / 80) || this.leader.dead == true))) {
            this.exploding = true;
            this.Explode();
        }
        this.spawnDelay--;
        this.iFrame--;
        this.explodeTimer--;
        if (this.explodeTimer > 0) {
            this.width -= 3;
            this.height -= 3;
        }
        else if (this.explodeTimer == 0) {
            this.dead = true;
        }
        if ((this.isLeader && this.spawnDelay == 0 && this.bodyCount > 0) || (this.spawnDelay == 0 && this.bodyCount > 0 && this.leader.count < this.leader.maxCount)) {
            let temp = null;
            if (this.isLeader) {
                temp = new SnakeBoss(2.5, 1, false, this.bodyCount - 1, null, this.bossMultiplier, this);
                this.count++;
            }
            else {
                temp = new SnakeBoss(2.5, 1, false, this.bodyCount - 1, null, this.bossMultiplier, this.leader);
                this.leader.count++;
            }
            enemies.push(temp)
        }
    }
    takeDamage(bullet, index, gameState) {
        if (this.isLeader) {
            super.takeDamage(bullet, index, gameState);
        }
    }
    move(players, floatingObjects) {
        if (this.explodeTimer > 0) {
            return;
        }
        if (this.isLeader) {
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            if(typeof window !== "undefined")this.speed*=enemySpeedMultiplier;
            this.angle = Math.atan2((player.y - this.y), (player.x - this.x));
            let distanceX = Math.abs(this.x - player.x);
            let distanceY = Math.abs(this.y - player.y);
            let vx = 0;
            let vy = 0;
            if (distanceX == 0) {
                if (this.y > player.y) {
                    vx = -this.speed;
                    this.y -= this.speed;
                }
                if (this.y < player.y) {
                    vx = this.speed;
                    this.y += this.speed;
                }
            }
            else {
                let angle = Math.atan(distanceY / distanceX);
                if (this.x > player.x) {
                    vx = -this.speed * Math.cos(angle);
                    this.x -= this.speed * Math.cos(angle);
                }
                if (this.y > player.y) {
                    vy = -this.speed * Math.sin(angle);
                    this.y -= this.speed * Math.sin(angle);
                }
                if (this.x < player.x) {
                    vx = this.speed * Math.cos(angle);
                    this.x += this.speed * Math.cos(angle);

                }
                if (this.y < player.y) {
                    vy = this.speed * Math.sin(angle);
                    this.y += this.speed * Math.sin(angle);
                }
                //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
            }
            if (this.redTimer > 0) this.redTimer--;
            this.delayHead = (this.delayHead - 1 + 1600) % 1600;
            this.delayX[this.delayHead] = this.x;
            this.delayY[this.delayHead] = this.y;
            this.delayFilled = Math.min(this.delayFilled + 1, 1600);
            this.checkForCollisions(players, floatingObjects);
            if(typeof window !== "undefined")this.speed/=enemySpeedMultiplier;
            //console.log(this.redTimer);
        }
        else {
            let index = (this.leader.delayHead + this.delay) % 1600;
            if (this.leader.delayFilled <= this.delay) {
                return;
            }
            this.x = this.leader.delayX[index];
            this.y = this.leader.delayY[index];
            this.checkForCollisions(players, floatingObjects);

        }
    }
    checkForCollisions(players, floatingObjects) {
        if (this.iFrame > 0) return;
        for (let id = 0; id < players.length; id++) {
            let player = players[id]
            if (this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2, this.x, this.y)) {

                let angle = Math.atan2((player.y - this.y), (player.x - this.x));
                player.AddForce(15 * Math.cos(angle), 15 * Math.sin(angle));
                player.takeDamage(2, this, floatingObjects);
                this.iFrame = 15;
            }
        }

    }
    special(enemyBullets, players, enemies) {
        //console.log(this.frostAura.style.left);
        this.timer(enemyBullets, players, enemies);

    }
    Explode() {
        this.explodeTimer = 30;
    }
}
class HealerBoss extends Enemy {
    /*
    Idea: Heals self and enemies in a circle around it every time it deals damage
    */
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.width = 150;
        this.height = 150;

        this.shootTimer = 60;
        this.shootTimer -= this.shootTimer * (bossMultiplier - 1) * 0.4
        this.isBoss = true;
        this.value = 750;
        //console.log(this.image.style.transform+" transofrmer");
        this.healAuraHeight = 750;
        this.healAuraWidth = 750;
        this.index = 7;
        this.bossMultiplier = bossMultiplier;
        //console.log(this.shootTimer);
        this.isHealing = false;
        this.healAbilityTimer = 1200;
        this.stopTimer = 0;
        this.healCooldown = 10 - 10 * (bossMultiplier - 1) * 0.5;
        this.healCooldown = Math.round(this.healCooldown);
        this.healAuraTimer = 0;
        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;
        this.bossBar = new BossBar(bossBars, "The Database");
        bossBars.push(this.bossBar);

    }
    timer(enemyBullets, players) {
        this.stopTimer--;
        this.healAuraTimer--;
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
            this.healAbilityTimer -= 0.5;
        }
        else {
            this.shootTimer--;
            this.healAbilityTimer--;
        }
        if (this.shootTimer <= 0 && this.isHealing == false) {
            this.shootTimer = 300;
            this.shootTimer -= this.shootTimer * (this.bossMultiplier - 1) * 0.4;
            enemyBullets.push(new HealerBossBullet(0, 0, 1, this.x + 75, this.y + 75, this));
            enemyBullets.push(new HealerBossBullet(0, 0, 1, this.x - 75, this.y + 75, this));
            enemyBullets.push(new HealerBossBullet(0, 0, 1, this.x + 75, this.y - 75, this));
            enemyBullets.push(new HealerBossBullet(0, 0, 1, this.x - 75, this.y - 75, this));
            enemyBullets.push(new HealerBossBullet2(5, 0, 1, this.x, this.y, this));
            enemyBullets.push(new HealerBossBullet2(0, 5, 1, this.x, this.y, this));
            enemyBullets.push(new HealerBossBullet2(-5, 0, 1, this.x, this.y, this));
            enemyBullets.push(new HealerBossBullet2(0, -5, 1, this.x, this.y, this));
        }
        //console.log(this.healCooldown)
        if (this.stopTimer > 0 && this.stopTimer % this.healCooldown == 0) {
            this.Heal(1);
        }
        if (this.stopTimer <= 0 && this.isHealing) {
            this.isHealing = false;
            this.bossBar.title = "The Database";
        }
        if (this.healAbilityTimer <= 0) {
            this.stopTimer = 360;
            this.healAbilityTimer = 1200;
            this.isHealing = true;
            this.bossBar.title = "Healing...";
        }
        if (this.isHealing) {
            this.speed = 0;
        }
        else {
            this.speed = 1.5;
        }
    }
    HealAll(enemies, floatingObjects) {

        for (let i = 0; i < enemies.length; i++) {
            if (RectCircleColliding(this, enemies[i], 375, this.x, this.y) && !enemies[i].isBoss) {
                enemies[i].Heal(100, floatingObjects);
            }
        }
        this.healAuraTimer = 10;
        this.Heal(5);
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "lightgreen"
        if (this.healAuraTimer > 0) {
            ctx.drawImage(this.healAura, this.x - this.healAuraHeight / 2, this.y - this.healAuraHeight / 2, this.healAuraWidth, this.healAuraHeight);
        }
        ctx.drawImage(this.healAura, this.x - this.healAuraHeight / 2, this.y - this.healAuraHeight / 2, this.healAuraWidth, this.healAuraHeight);
        ctx.globalAlpha = 1;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        if (this.healTimer > 0 && this.isHealing == false) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'lime';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.redTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else if (this.slowCountdown > 0) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }
    special(a, b) {
        //console.log(this.frostAura.style.left);
        this.timer(a, b);

    }
}
class EngineerBoss extends Enemy {
    /*
    Idea: Builds towers (stationary enemies) based on time passed.
    1. Basic sentry that shoots bullets
    2. Laser tower that shoots lasers
    3. Bomb tower that shoots bombs
    4. Ice tower that slows player
    */
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.width = 150;
        this.height = 150;

        this.shootTimer = 480;
        this.shootTimer -= this.shootTimer * (bossMultiplier - 1) * 0.4
        this.isBoss = true;
        this.value = 750;
        this.index = 8;
        //console.log(this.image.style.transform+" transofrmer");
        this.bossMultiplier = bossMultiplier;
        //console.log(this.shootTimer);
        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;
        this.bossBar = new BossBar(bossBars, "The Paragon");
        bossBars.push(this.bossBar);

    }
    timer(enemyBullets, players) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 390;
            this.shootTimer -= this.shootTimer * (this.bossMultiplier - 1) * 0.4;
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 5 * Math.cos(angle);
                vy = 5 * Math.sin(angle);
            }
            let randomNum = Math.random() * 10;
            if (randomNum < 4) {
                enemyBullets.push(new EngineerBullet(this.x, this.y, vx, vy, 1));
            }
            else if (randomNum < 7) {
                enemyBullets.push(new EngineerBullet(this.x, this.y, vx, vy, 2));
            }
            else if (randomNum < 9) {
                enemyBullets.push(new EngineerBullet(this.x, this.y, vx, vy, 3));
            }
            else if (randomNum < 10) {
                enemyBullets.push(new EngineerBullet(this.x, this.y, vx, vy, 4));
            }
        }
        //console.log(this.healCooldown)
    }
    move(players, floatingObjects, enemies) {
        super.move(players, floatingObjects, enemies);
    }
    special(a, b) {
        //console.log(this.frostAura.style.left);
        this.timer(a, b);

    }
}
class SentryEngineerEnemy extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.value = 0;
        this.damage = 0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.canSiphon = false;
        this.giveXP = false;
        this.ignoreKnockback = true;
        this.ignoreShield = true;
        this.iFrame = 0;
        this.shootTimer = 60;
        this.index = 1004;
        //console.log(this.shootTimer);
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }
    timer(enemyBullets, players) {
        this.redTimer--;
        this.healTimer--;
        this.iFrame--;
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {

            this.shootTimer = 60;
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);

            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 10 * Math.cos(angle);
                vy = 10 * Math.sin(angle);
            }
            let temp = new EnemyBullet(vx, vy, 1, this.x, this.y);
            temp.height = 20;
            temp.width = 20;
            enemyBullets.push(temp);


        }
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    move(players, floatingObjects) {
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0
            ) {
                player.takeDamage(2, this, floatingObjects);
                if (this.x > player.x) {
                    player.AddForce(-10, 0);
                }
                if (this.x < player.x) {

                    player.AddForce(10, 0);
                }
                if (this.y > player.y) {

                    player.AddForce(0, -10);
                }
                if (this.y < player.y) {

                    player.AddForce(0, 10);
                }
                this.iFrame = 15;
            }
        }

    }
}
class LaserEngineerEnemy extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.value = 0;
        this.damage = 0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.canSiphon = false;
        this.giveXP = false;
        this.ignoreKnockback = true;
        this.ignoreShield = true;
        this.shootTimer = 60;
        this.laser = null;
        this.iFrame = 0;
        this.index = 1005;
        //console.log(this.shootTimer);
    }
    special(a, b) {
        this.timer(a, b);
    }
    timer(enemyBullets, players) {
        this.redTimer--;
        this.healTimer--;
        this.iFrame--;
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0 && this.laser == null) {

            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            let distanceX = player.x - (this.x);
            let distanceY = player.y - (this.y);

            this.angle = Math.atan2(distanceY, distanceX);
            this.stage = 1;
            this.laser = new PermanentLaser(this.angle, this.x, this.y);
            enemyBullets.push(this.laser);

        }
    }
    takeDamage(a, b, c) {
        super.takeDamage(a, b, c);
        if (this.dead && this.laser) {
            this.laser.dead = true;
        }
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    move(players, floatingObjects) {
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0
            ) {
                player.takeDamage(2, this, floatingObjects);
                if (this.x > player.x) {
                    player.AddForce(-10, 0);
                }
                if (this.x < player.x) {

                    player.AddForce(10, 0);
                }
                if (this.y > player.y) {

                    player.AddForce(0, -10);
                }
                if (this.y < player.y) {

                    player.AddForce(0, 10);
                }
                this.iFrame = 15;
            }
        }

    }
}
class BombEngineerEnemy extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.value = 0;
        this.damage = 0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.canSiphon = false;
        this.giveXP = false;
        this.ignoreKnockback = true;
        this.ignoreShield = true;
        this.iFrame = 0;
        this.shootTimer = 60;
        this.index = 1006;
        //console.log(this.shootTimer);
    }
    special(a, b) {
        this.timer(a, b);
    }
    timer(enemyBullets, players) {
        this.redTimer--;
        this.healTimer--;
        this.iFrame--;
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {

            this.shootTimer = 240;
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 5 * Math.cos(angle);
                vy = 5 * Math.sin(angle);
            }
            let temp = new EnemyBomb(this.x, this.y, vx, vy, Math.sqrt(distance) / 5);
            temp.height = 40;
            temp.width = 40;
            enemyBullets.push(temp);

        }
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    move(players, floatingObjects) {
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0
            ) {
                player.takeDamage(2, this, floatingObjects);
                if (this.x > player.x) {
                    player.AddForce(-10, 0);
                }
                if (this.x < player.x) {

                    player.AddForce(10, 0);
                }
                if (this.y > player.y) {

                    player.AddForce(0, -10);
                }
                if (this.y < player.y) {

                    player.AddForce(0, 10);
                }
                this.iFrame = 15;
            }
        }

    }
}
class IceEngineerEnemy extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.value = 0;
        this.damage = 0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.canSiphon = false;
        this.giveXP = false;
        this.ignoreKnockback = true;
        this.ignoreShield = true;
        this.iFrame = 0;
        this.index = 1007;
        this.frostAuraWidth = 500;
        this.frostAuraHeight = 500;
        //console.log(this.shootTimer);
    }
    special(a, b, c, d) {
        this.timer(a, b, c, d);

    }
    timer(enemyBullets, players, enemies, bullets) {
        this.redTimer--;
        this.healTimer--;
        this.iFrame--;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (RectCircleColliding(this, player, 250, this.x, this.y)) {
                player.slowCountdown = Math.max(player.slowCountdown, 30);
            }
        }
        for (let i = 0; i < bullets.length; i++) {
            if (RectCircleColliding(this, bullets[i], 250, this.x, this.y)) {
                bullets[i].slowCountdown = 30;
            }
        }
    }
    draw() {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(this.frostAura, this.x - this.frostAuraWidth / 2, this.y - this.frostAuraHeight / 2, this.frostAuraWidth, this.frostAuraHeight);
        ctx.globalAlpha = 1;
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    move(players, floatingObjects) {
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0
            ) {
                player.takeDamage(2, this, floatingObjects);
                if (this.x > player.x) {
                    player.AddForce(-10, 0);
                }
                if (this.x < player.x) {

                    player.AddForce(10, 0);
                }
                if (this.y > player.y) {

                    player.AddForce(0, -10);
                }
                if (this.y < player.y) {

                    player.AddForce(0, 10);
                }
                this.iFrame = 15;
            }
        }

    }
}
class FarmerBoss extends Enemy {
    /*
    Idea: Throws grass that bounce off walls and never dissapear until it dies.
    After it dies, spawns bessie the cow that charges at the player and eats the grass
    */
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.width = 150;
        this.height = 150;

        this.shootTimer = 480;
        this.shootTimer -= this.shootTimer * (bossMultiplier - 1) * 0.4
        this.isBoss = true;
        this.value = 0;
        this.index = 9;
        bossesLeft++;
        this.bossMultiplier = bossMultiplier;
        //console.log(this.image.style.transform+" transofrmer");



        //console.log(this.shootTimer);
        this.health = Math.ceil(this.health * bossMultiplier);
        if (typeof window === "undefined") {
            this.health *= 2;
        }
        this.maxHealth = this.health;
        this.bossBar = new BossBar(bossBars, "Farmer John");
        this.bossBars = bossBars
        bossBars.push(this.bossBar);

    }
    timer(enemyBullets, players) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 240;
            this.shootTimer -= this.shootTimer * (this.bossMultiplier - 1) * 0.4;
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                vx = 8 * Math.cos(angle);
                vy = 8 * Math.sin(angle);
            }
            enemyBullets.push(new FarmerBullet(this.x, this.y, 1, vx, vy));
        }
        //console.log(this.healCooldown)
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    takeDamage(bullet, index, gameState) {
        if (this.dead) return;
        super.takeDamage(bullet, index, gameState);
        if (this.dead) {
            gameState.bossesLeft++;
            let temp = new FarmerBossCow(2, 100, this.bossBars, this.bossMultiplier);
            temp.x = this.x;
            temp.y = this.y;
            gameState.enemies.push(temp);
        }
    }
    special(a, b) {
        //console.log(this.frostAura.style.left);
        this.timer(a, b);

    }
}
class FarmerBossCow extends Enemy {
    /*
    Idea: Throws grass that bounce off walls and never dissapear until it dies.
    After it dies, spawns bessie the cow that charges at the player and eats the grass
    */
    constructor(speed, health, bossBars, bossMultiplier) {
        super(speed, health);
        this.width = 150;
        this.height = 150;

        this.shootTimer = 400;
        this.shootTimer -= this.shootTimer * (bossMultiplier - 1) * 0.4
        this.isBoss = true;
        this.value = 750;
        this.index = 1000;
        bossesLeft++;
        //console.log(this.image.style.transform+" transofrmer");
        this.bossMultiplier = bossMultiplier;

        //console.log(this.shootTimer);
        this.health = Math.ceil(this.health * bossMultiplier);
        this.maxHealth = this.health;
        this.bossBar = new BossBar(this, "Bessie");
        bossBars.push(this.bossBar);
        this.numBullets = 4;
        this.angle = 0;

    }
    timer(enemyBullets, players, enemies, bullets, floatingObjects) {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = Math.max(30, 400 / this.speed);
            this.shootTimer -= this.shootTimer * (this.bossMultiplier - 1) * 0.4;
            console.log(this.angle);
            for (let i = 0; i < this.numBullets; i++) {
                this.angle += Math.PI * 2 / this.numBullets;
                let vx = 8 * Math.cos(this.angle);
                let vy = 8 * Math.sin(this.angle);
                let temp = new EnemyBullet(vx, vy, 2, this.x, this.y);
                temp.width = 30;
                temp.height = 30;
                temp.index = 22;
                enemyBullets.push(temp);
            }
            this.angle += Math.PI / 8;
        }
        for (let i = 0; i < enemyBullets.length; i++) {
            if (enemyBullets[i] instanceof FarmerBullet && (enemyBullets[i].x - enemyBullets[i].width / 2) < (this.x + this.width / 2) &&
                (enemyBullets[i].x + enemyBullets[i].width / 2) > (this.x - this.width / 2) &&
                (enemyBullets[i].y - enemyBullets[i].height / 2) < (this.y + this.height / 2) &&
                (enemyBullets[i].y + enemyBullets[i].height / 2) > (this.y - this.height / 2)) {
                floatingObjects.push(new FloatingObject(this.x - this.width / 2 + Math.random() * this.width, this.y, "special", "red"));
                enemyBullets[i].dead = true;

                this.speed += 0.25;
            }
        }
        //console.log(this.healCooldown)
    }
    takeDamage(bullet, index, gameState) {
        super.takeDamage(bullet, index, gameState);
        if (this.dead) {
            for (let i = 0; i < gameState.enemyBullets.length; i++) {
                if (gameState.enemyBullets[i] instanceof FarmerBullet) {
                    gameState.enemyBullets[i].dead = true;
                }
            }
        }
    }
    special(a, b, c, d, e) {
        //console.log(this.frostAura.style.left);
        this.timer(a, b, c, d, e);

    }
}

function drawSnakeBoss(enemy, image) {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.width / 2, 0, Math.PI * 2);
    ctx.stroke();
    if (enemy.isLeader) {

        let angle = enemy.angle;
        if (enemy.dead) return;
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(angle + Math.PI / 2);
        if (enemy.redTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
            ctx.beginPath();
            ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        else if (enemy.slowCountdown > 0) {
            ctx.drawImage(image, - enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        else {
            ctx.drawImage(image, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
        }

        ctx.restore();
    }
}
function drawLaser(laser, image) {
    ctx.save();
    if (laser.warningTimer > 0) {
        ctx.filter = 'brightness(50%)';
    }
    ctx.translate(laser.x, laser.y);
    ctx.rotate(laser.spawnAngle - Math.PI / 2);
    ctx.drawImage(image, -laser.width, 0, laser.width, laser.height);
    ctx.filter = 'brightness(100%)';
    ctx.restore();
}

class EnemyBullet {
    constructor(speedX, speedY, damage, x, y) {
        this.speedX = speedX;
        this.speedY = speedY;
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.width = 10;
        this.height = 10;
        this.frostbite = false;
        this.ignoreShield = false;
        this.ignoreWipe = false;
        this.hitPlayer = false;
        this.isEnemy = false;
        this.index = 0;
    }
    move(players, floatingObjects, enemies) {

        this.x += this.speedX;
        this.y += this.speedY;
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            const dx = (this.x + 5) - (player.x + 5);
            const dy = (this.y + 5) - (player.y + 5);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (player.width / 2 - 10) + this.width / 2) {
                player.takeDamage(this.damage, this, floatingObjects);
                this.dead = true;
                this.hitPlayer = true;
            }
            if (this.x < mapBorders.leftBorder - 500 || this.y < mapBorders.topBorder - 500 || this.x > mapBorders.rightBorder + 500 || this.y >= mapBorders.bottomBorder + 500) {
                this.dead = true;
            }
        }
    }
    draw() {
        if (typeof window === "undefined") return;
        ctx.save();
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    special() {
    }
}
class HomingBullet extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y) {
        super(speedX, speedY, damage, x, y);
        this.homingTimer = 0;
        let lastSpeedX = 0;
        let lastSpeedY = 0;
        this.damage = 2;
        this.width = 20;
        this.height = 20;
        this.index = 1;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(players) {
        this.target(players);
    }
    target(players) {
        if (players.length == 0) return;
        //console.log(players);
        let minDist = 100000;
        let minDistID = null;
        for (let id = 0; id < players.length; id++) {
            let dist = Math.hypot(players[id].x - this.x, players[id].y - this.y)
            if (dist < minDist) {
                minDist = dist;
                minDistID = id;
            }
        }
        let player = players[minDistID];
        if (this.homingTimer >= 120) return;
        this.homingTimer++;
        //console.log(this.x+" "+this.y+" before");

        let distanceX = this.x - player.x;
        let distanceY = this.y - player.y;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const desiredX = (distanceX / distance) * 10;
        const desiredY = (distanceY / distance) * 10;
        let differenceX = desiredX - this.speedX;
        let differenceY = desiredY - this.speedY;
        let steerAmount = Math.sqrt(differenceX * differenceX + differenceY * differenceY);
        if (steerAmount > 0.3) {
            differenceX = (differenceX / steerAmount) * 0.3;
            differenceY = (differenceY / steerAmount) * 0.3;
        }
        this.speedX -= differenceX;
        this.speedY -= differenceY;
        let speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (speed > 5) {
            this.speedX = this.speedX / speed * 5;
            this.speedY = this.speedY / speed * 5;
        }
        //this.previousAngle=angle;
        //console.log(this.x+" "+this.y+" after");
    }

}
class EnemyTrap extends EnemyBullet {
    constructor(damage, x, y) {
        super(0, 0, damage, x, y);
        this.width = 30;
        this.height = 30;
        this.deathTimer = 900;
        this.index = 2;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
        this.deathTimer--;
        if (this.deathTimer == 0) {
            this.dead = true;
        }
    }

}
class PoisonBomb extends EnemyBullet {
    constructor(x, y, speedX, speedY) {
        super(speedX, speedY, 1, x, y);
        this.shootTimer = 120;
        this.explodeTimer = 0;
        this.height = 25;
        this.width = 25;
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        //this.image.src = "images/poisonBomb.webp";
        this.scale = 25;
        this.iFrame = 0;
        this.ignoreShield = true;
        this.index = 3;
    }
    move(players, floatingObjects, enemies) {
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (this.explodeTimer > 0 && this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2, this.x, this.y)) {
                player.takeDamage(this.damage, this, floatingObjects);
                this.iFrame = 45;

            }
        }
    }
    special() {
        if (this.explodeTimer <= 0) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        this.shootTimer--;
        this.explodeTimer--;
        this.iFrame--;
        if (this.shootTimer == 0 && this.explodeTimer < 0) {
            //this.image.src = "images/poisonCloud.webp";
            this.scale = 250;
            this.explodeTimer = 600;
        }
        if (this.shootTimer > 60) {
            this.scale += 0.5;
        }
        else if (this.shootTimer > 0) {
            this.scale -= 0.5;
        }
        this.width = this.scale;
        this.height = this.scale;
        if (this.explodeTimer == 0) {
            this.dead = true;
        }

    }
}
class BlackHole extends EnemyBullet {
    constructor(damage, x, y, vx, vy) {
        super(vx, vy, damage, x, y);
        //this.image.src = 'images/blackHole.webp';
        this.width = 40;
        this.height = 40;
        this.x = x;
        this.y = y;
        this.deathTimer = 400;
        this.iFrame = 0;
        this.ignoreShield = true;
        this.index = 4;
        // this.background = new Image();
        // this.background.src = "images/spiral.webp";
        this.backgroundWidth = 400;
        this.backgroundHeight = 400;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move(players, floatingObjects, enemies) {
        this.x += this.speedX;
        this.y += this.speedY;
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            const dx = (this.x) - (player.x);
            const dy = (this.y) - (player.y);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (player.width / 2 - 10) + this.width / 2 && this.iFrame <= 0) {
                player.takeDamage(this.damage, this, floatingObjects);
                this.iFrame = 40;
            }
        }
    }
    special(players) {
        this.deathTimer--;

        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            const dx = (this.x) - (player.x);
            const dy = (this.y) - (player.y);
            const distance = Math.sqrt(dx * dx + dy * dy);
            //console.log(dx+" "+dy+" "+this.x+" "+this.y+" "+this.speedX+" "+this.speedY);
            if (distance < (200 + player.width / 2)) {
                if (dx > 0 && dy > 0) {
                    player.AddForce(Math.max(0, 0.25 - dx / 1000), Math.max(0, 0.25 - dy / 1000));
                }
                if (dx < 0 && dy > 0) {
                    player.AddForce(Math.min(0, -0.25 - dx / 1000), Math.max(0, 0.25 - dy / 1000));
                }
                if (dx > 0 && dy < 0) {
                    player.AddForce(Math.max(0, 0.25 - dx / 1000), Math.min(0, -0.25 - dy / 1000));
                }
                if (dx < 0 && dy < 0) {
                    player.AddForce(Math.min(0, -0.25 - dx / 1000), Math.min(0, -0.25 - dy / 1000));
                }
            }
            if (distance < (100 + player.width / 2)) {
                if (dx > 0 && dy > 0) {
                    player.AddForce(Math.max(0, 0.2 - dx / 1000), Math.max(0, 0.2 - dy / 1000));
                }
                if (dx < 0 && dy > 0) {
                    player.AddForce(Math.min(0, -0.2 - dx / 1000), Math.max(0, 0.2 - dy / 1000));
                }
                if (dx > 0 && dy < 0) {
                    player.AddForce(Math.max(0, 0.2 - dx / 1000), Math.min(0, -0.2 - dy / 1000));
                }
                if (dx < 0 && dy < 0) {
                    player.AddForce(Math.min(0, -0.2 - dx / 1000), Math.min(0, -0.2 - dy / 1000));
                }
            }
        }
        if (this.deathTimer == 0) {
            this.dead = true;
        }
        this.iFrame--;
    }

}
class Laser extends EnemyBullet {
    constructor(angle, x, y) {
        super(0, 0, 0.1, x, y);
        this.spawnAngle = angle;
        this.warningTimer = 60;
        this.despawnTimer = 125;
        this.height = 4000;
        this.width = 10;
        this.ignoreWipe = true;
        this.ignoreShield = true;
        this.index = 5;
    }
    move(players, floatingObjects, enemies) {
        if (this.warningTimer < 0) {
            if (this.iFrame > 0) {
                this.iFrame--;
            }
            else {
                let found = false;
                for (let id = 0; id < players.length; id++) {
                    let player = players[id];
                    let dx = player.x - this.x;
                    let dy = player.y - this.y;
                    let distanceToLine = Math.abs(dx * Math.sin(this.spawnAngle) - dy * Math.cos(this.spawnAngle));

                    let forwardDistance = dx * Math.cos(this.spawnAngle) + dy * Math.sin(this.spawnAngle);

                    if (distanceToLine < 30 && forwardDistance > -15) {
                        player.takeDamage(1, this, floatingObjects);
                        found = true;
                    }
                }
                if (found) {
                    this.iFrame = 15;
                }
            }
        }
        this.timer();
    }
    timer() {
        if (this.despawnTimer == 0) {
            this.dead = true;
        }
        if (this.warningTimer <= 0) {
            this.width = 20;
            this.despawnTimer--;
        }
        this.warningTimer--;
    }
}
class ChargingOrb extends EnemyBullet {
    constructor(x, y, speedX, speedY) {
        super(speedX, speedY, 1, x, y);
        this.shootTimer = 600;
        this.explodeTimer = 0;
        this.height = 25;
        this.width = 25;
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.scale = 25;
        this.iFrame = 0;
        this.index = 6;
        this.ignoreShield = true;
        this.hitEnemies = new Set();
    }
    move(players, floatingObjects, enemies) {
        if (this.explodeTimer > 0) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        else {
            this.x += this.speedX * 0.1;
            this.y += this.speedY * 0.1;
        }
        this.shootTimer--;
        this.explodeTimer--;
        this.iFrame--;
        if (this.shootTimer == 0 && this.explodeTimer < 0) {
            this.explodeTimer = 300;
            if (players.length == 0) return;
            let player = FindClosestPlayer(this.x, this.y, players);
            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                this.speedX = 3 * Math.cos(angle);
                this.speedY = 3 * Math.sin(angle);
            }


        }
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2 - 10, this.x, this.y)) {
                player.takeDamage(this.damage, this, floatingObjects);
                this.iFrame = 15;

            }
        }

        if (this.explodeTimer == 0) {
            this.dead = true;
        }
        if (this.explodeTimer < 0) {
            this.scale += 0.75;
            // console.log(this.image.style.height+" "+(this.width)+" BEFORE");
            this.width = this.scale;
            this.height = this.scale;
            //console.log(this.image.style.height+" "+(this.width)+" AFTER");
        }
        if (this.x < mapBorders.leftBorder - 500 || this.y < mapBorders.topBorder - 500 || this.x > mapBorders.rightBorder + 500 || this.y >= mapBorders.bottomBorder + 500) {
            this.dead = true;
        }

    }
}
class Icicle extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y, width, height) {
        super(speedX, speedY, damage, x, y);
        this.width = width;
        this.height = height;
        this.frostbite = true;
        this.timer = 100;
        this.index = 7;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(players, enemyBullets) {
        this.timer--;
        if (this.timer == 0 || (this.x < mapBorders.leftBorder || this.x > mapBorders.rightBorder || this.y < mapBorders.topBorder || this.y > mapBorders.bottomBorder)) {
            if (this.x < mapBorders.leftBorder || this.x > mapBorders.rightBorder || this.y < mapBorders.topBorder || this.y > mapBorders.bottomBorder) {
                this.dead = true;
            }
            else {
                this.timer = 100;
            }
            let temp = new EnemyBullet(1.5, 1.5, 1, this.x - 5, this.y - 5);
            temp.width = 20;
            temp.height = 20;
            temp.index = 7;
            temp.frostbite = true;
            enemyBullets.push(temp);
            let temp2 = new EnemyBullet(1.5, -1.5, 1, this.x - 5, this.y - 5);
            temp2.width = 20;
            temp2.height = 20;
            temp2.index = 7;
            temp2.frostbite = true;
            enemyBullets.push(temp2);
            let temp3 = new EnemyBullet(-1.5, 1.5, 1, this.x - 5, this.y - 5);
            temp3.width = 20;
            temp3.height = 20;
            temp3.index = 7;
            temp3.frostbite = true;
            enemyBullets.push(temp3);
            let temp4 = new EnemyBullet(-1.5, -1.5, 1, this.x - 5, this.y - 5);
            temp4.width = 20;
            temp4.height = 20;
            temp4.index = 7;
            temp4.frostbite = true;
            enemyBullets.push(temp4);
        }
    }

}
class SplitterBullet extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y, tier, size) {
        super(speedX, speedY, tier, x, y);
        this.width = size;
        this.height = size;
        this.timer = 120;
        this.tier = tier;
        this.index = 9;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(players, enemyBullets) {
        this.timer--;
        if (this.timer == 0) {
            this.dead = true;
            if (this.tier > 1) {
                let angle = Math.atan2(this.speedY, this.speedX);
                let oppositeAngle = Math.atan2(-this.speedX, this.speedY);
                let temp = new SplitterBullet(3 * Math.cos(angle), 3 * Math.sin(angle), 1, this.x - 5, this.y - 5, this.tier - 1, this.width / 1.5);
                enemyBullets.push(temp);
                let temp2 = new SplitterBullet(-3 * Math.cos(angle), -3 * Math.sin(angle), 1, this.x - 5, this.y - 5, this.tier - 1, this.width / 1.5);
                enemyBullets.push(temp2);
                let temp3 = new SplitterBullet(3 * Math.cos(oppositeAngle), 3 * Math.sin(oppositeAngle), 1, this.x - 5, this.y - 5, this.tier - 1, this.width / 1.5);
                enemyBullets.push(temp3);
                let temp4 = new SplitterBullet(-3 * Math.cos(oppositeAngle), -3 * Math.sin(oppositeAngle), 1, this.x - 5, this.y - 5, this.tier - 1, this.width / 1.5);
                enemyBullets.push(temp4);
            }
        }
    }

}
class Fire extends EnemyBullet {
    constructor(damage, x, y, vx, vy) {
        super(vx, vy, damage, x, y);
        this.index = 11;
        this.width = 40;
        this.height = 40;
        this.deathTimer = 30;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
        this.deathTimer--;
        if (this.deathTimer == 0) {
            this.dead = true;
        }
    }

}
class Water extends EnemyBullet {
    constructor(damage, x, y, vx, vy) {
        super(vx, vy, damage, x, y);
        this.index = 12;
        this.width = 40;
        this.height = 40;
        this.deathTimer = 120;
        this.frostbite = true;
        this.hit = false;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
        this.deathTimer--;
        if (this.deathTimer == 0) {
            this.dead = true;
        }
    }
    move(players) {

        this.x += this.speedX;
        this.y += this.speedY;
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            const dx = (this.x + 5) - (player.x + 5);
            const dy = (this.y + 5) - (player.y + 5);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (player.width / 2 - 10) + this.width / 2 && this.hit == false) {
                player.AddForce(-dx / 3.5, -dy / 3.5);
                player.slowCountdown = Math.max(player.slowCountdown, 120);
                this.hit = true;
            }
            if (this.x < mapBorders.leftBorder - 500 || this.y < mapBorders.topBorder - 500 || this.x > mapBorders.rightBorder + 500 || this.y >= mapBorders.bottomBorder + 500) {
                this.dead = true;
            }
        }
    }

}
class BigRock extends EnemyBullet {
    constructor(damage, x, y, vx, vy) {
        super(vx, vy, damage, x, y);
        this.index = 13;
        this.width = 80;
        this.height = 80;
        this.deathTimer = 100;
        this.ignoreWipe = false;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(players, enemyBullets) {
        this.deathTimer--;
        if (this.deathTimer == 0) {
            for (let i = 0; i < 8; i++) {
                let angle = i * Math.PI * 2 / 8;
                enemyBullets.push(new SmallRock(1, this.x, this.y, 5 * Math.sin(angle), 5 * Math.cos(angle)));
            }
            this.dead = true;
        }
    }

}
class SmallRock extends EnemyBullet {
    constructor(damage, x, y, vx, vy) {
        super(vx, vy, damage, x, y);
        this.index = 14;
        this.width = 40;
        this.height = 40;
        this.ignoreWipe = false;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }

}

class SpinningBullet extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y) {
        super(speedX, speedY, damage, x, y);
        this.index = 15;
        this.width = 20;
        this.height = 20;
        this.centerX = this.x;
        this.centerY = this.y;
        this.angle = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move(players, floatingObjects) {
        this.centerX += this.speedX;
        this.centerY += this.speedY;
        this.angle += 0.05;
        this.angle %= 2 * Math.PI;
        this.offsetX = 50 * Math.cos(this.angle);
        this.offsetY = 50 * Math.sin(this.angle);
        this.x = this.centerX + this.offsetX;
        this.y = this.centerY + this.offsetY;
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (RectCircleColliding(this, player, this.width / 2 - 10, this.x, this.y)) {
                player.takeDamage(this.damage, this, floatingObjects);
                this.dead = true;
            }
        }
        if (this.x < mapBorders.leftBorder - 500 || this.y < mapBorders.topBorder - 500 || this.x > mapBorders.rightBorder + 500 || this.y >= mapBorders.bottomBorder + 500) {
            this.dead = true;
        }

    }
    special() {
    }

}
class HealerBossBullet extends HomingBullet {
    constructor(speedX, speedY, damage, x, y, owner) {
        super(speedX, speedY, damage, x, y);
        this.owner = owner;
        this.index = 18;
        this.width = 40;
        this.height = 40;
        this.homingTimer = -120;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move(players, floatingObjects, enemies) {
        super.move(players, floatingObjects, enemies);
        if (this.dead && this.hitPlayer) {
            this.owner.HealAll(enemies, floatingObjects);
        }
    }
    draw() {

        ctx.save();
        ctx.filter = "brightness(200%)";
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }

}
class HealerBossBullet2 extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y, owner) {
        super(speedX, speedY, damage, x, y);
        this.owner = owner;
        this.index = 17;
        this.width = 40;
        this.height = 40;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move(players, floatingObjects, enemies) {
        super.move(players, floatingObjects, enemies);
        if (this.dead && this.hitPlayer) {
            this.owner.HealAll(enemies, floatingObjects);
        }
    }

}
class EngineerBullet extends EnemyBullet {
    constructor(x, y, speedX, speedY, type) {
        super(speedX, speedY, 1, x, y);
        this.shootTimer = Math.random() * 120 + 60;
        this.index = 19;
        this.height = 50;
        this.width = 50;
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.type = type;
        this.ignoreShield = true;
    }
    move(players, floatingObjects, enemies) {

        this.x += this.speedX;
        this.y += this.speedY;
        if (this.shootTimer <= 0 || this.x < mapBorders.leftBorder - 20 || this.y < mapBorders.topBorder - 20 || this.x > mapBorders.rightBorder + 20 || this.y >= mapBorders.bottomBorder + 20) {
            this.dead = true;
            this.x = Math.min(mapBorders.rightBorder + 20, this.x);
            this.x = Math.max(mapBorders.leftBorder - 20, this.x);
            this.y = Math.max(mapBorders.topBorder - 20, this.y);
            this.y = Math.min(mapBorders.bottomBorder + 20, this.y);
            switch (this.type) {
                case 1:
                    enemies.push(new SentryEngineerEnemy(this.x, this.y, 12));
                    break;
                case 2:
                    enemies.push(new LaserEngineerEnemy(this.x, this.y, 20));
                    break;
                case 3:
                    enemies.push(new BombEngineerEnemy(this.x, this.y, 20));
                    break;
                case 4:
                    enemies.push(new IceEngineerEnemy(this.x, this.y, 30));
                    break;
            }
        }
    }
    special() {
        this.shootTimer--;

    }
}
class EnemyBomb extends EnemyBullet {
    constructor(x, y, speedX, speedY, timer) {
        super(speedX, speedY, 1, x, y);
        this.shootTimer = Math.round(timer / 2) * 2;
        this.maxTimer = Math.round(timer / 2) * 2;
        this.explodeTimer = 0;
        this.height = 50;
        this.width = 50;
        this.damage = 4;
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.index = 20;
        this.scale = 50;
        this.iFrame = 0;
        this.ignoreShield = true;
    }
    move(players, floatingObjects) {

        if (this.explodeTimer <= 0) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (this.explodeTimer > 0 && this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2 - 20, this.x, this.y)) {
                player.takeDamage(this.damage, this, floatingObjects);
                this.iFrame = 61;

            }
        }
    }
    special() {
        this.shootTimer--;
        this.explodeTimer--;
        this.iFrame--;
        if (this.shootTimer == 0 && this.explodeTimer < 0) {
            this.explodeTimer = 30;
        }
        if (this.explodeTimer > 0) {
            this.scale += 10;
        }
        if (this.shootTimer > this.maxTimer / 2) {
            this.scale += 1;
        }
        else if (this.shootTimer > 0) {
            this.scale -= 1;
        }
        this.width = this.scale;
        this.height = this.scale;
        if (this.explodeTimer == 0) {
            this.dead = true;
        }

    }
    draw() {
        if (this.explodeTimer > 0) {
            ctx.save();
            ctx.filter = 'hue-rotate(90deg)';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.filter = "none";
            ctx.restore();
        }
        else super.draw();
    }
}
class FarmerBullet extends EnemyBullet {
    constructor(x, y, damage, speedX, speedY) {
        super(speedX, speedY, damage, x, y);
        this.width = 40;
        this.height = 40;
        this.index = 21;
        this.iFrame = 0;
        this.ignoreShield = true;
        this.ignoreWipe = true;
    }
    move(players, floatingObjects) {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < (this.width - 50) / 2 + mapBorders.leftBorder) {
            this.x = (this.width - 50) / 2 + mapBorders.leftBorder;
            this.speedX *= -1;
        }
        if (this.y < (this.width - 50) / 2 + mapBorders.topBorder) {
            this.y = (this.width - 50) / 2 + mapBorders.topBorder;
            this.speedY *= -1;
        }
        if (this.x > mapBorders.rightBorder - (this.width - 50) / 2) {
            this.x = mapBorders.rightBorder - (this.width - 50) / 2;
            this.speedX *= -1;
        }
        if (this.y > mapBorders.bottomBorder - (this.width - 50) / 2) {
            this.y = mapBorders.bottomBorder - (this.width - 50) / 2;
            this.speedY *= -1;
        }
        this.iFrame--;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0
            ) {
                player.takeDamage(this.damage, this, floatingObjects);
                this.iFrame = 20;
                let angle = Math.atan2((player.y - this.y), (player.x - this.x));
                this.speedX = -8 * Math.cos(angle);
                this.speedY = -8 * Math.sin(angle);
            }


        }
    }
}



class PermanentLaser extends Laser {
    constructor(angle, x, y) {
        super(angle, x, y);
        this.despawnTimer = 9999999;
    }
}



function drawBlackHole(bullet, image, background) {
    if (bullet.dead) return;
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.drawImage(background, bullet.x - bullet.backgroundWidth / 2, bullet.y - bullet.backgroundHeight / 2, bullet.backgroundWidth, bullet.backgroundHeight);
    ctx.globalAlpha = 1;
    ctx.drawImage(image, bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);


    ctx.restore();
}

class Wall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.width = width;
        this.height = height;
        this.maxWidth = width;
        this.maxHeight = height;
        this.index=0;
    }
    static timer() {
    }
    act() {
        if (enableShrinking) {


            if (this.width > 100) {
                this.width = (this.maxWidth - gameState.timeElapsed / 4)
            }
            else {
                this.height = (this.maxHeight - gameState.timeElapsed / 4)
            }
            if (this.x < 500) {
                this.x = this.initialX + gameState.timeElapsed / 8;
            }
            else {
                this.x = this.initialX - gameState.timeElapsed / 8;
            }
            if (this.y < 500) {
                this.y = this.initialY + gameState.timeElapsed / 8;
            }
            else {
                this.y = this.initialY - gameState.timeElapsed / 8;
            }
            if (gameState.bossesLeft==0) {

                if (this.width > 100) {
                    this.width = (this.maxWidth - gameState.timeElapsed / 1.375)
                }
                else {
                    this.height = (this.maxHeight - gameState.timeElapsed / 1.375)
                }
                if (this.x < 500) {
                    this.x = this.initialX + gameState.timeElapsed / 2.75;
                }
                else {
                    this.x = this.initialX - gameState.timeElapsed / 2.75;
                }
                if (this.y < 500) {
                    this.y = this.initialY + gameState.timeElapsed / 2.75;
                }
                else {
                    this.y = this.initialY - gameState.timeElapsed / 2.75;
                }
            }
        }
    }
}
class WaterTerrain{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.index=1;
        this.changeColorTimer=0;
    }
    static timer(){
    }
    act(){
        this.changeColorTimer--;
        if(this.changeColorTimer<=0){
            
            this.color="#27ADF5";
        }
        if(
            (player.x - player.width / 2+10) < (this.x + this.width / 2) &&
            (player.x + player.width / 2-10) > (this.x - this.width / 2) &&
            (player.y - player.height / 2+10) < (this.y + this.height / 2) &&
            (player.y + player.height / 2-10) > (this.y - this.height / 2) )
        {
            this.color="#1f4153";
            player.slowCountdown=Math.max(player.slowCountdown, 30);
            this.changeColorTimer=30;
        }
    }
    draw(){
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    }
}
class LavaTerrain{
    static iFrame=0;
    constructor(x, y, width, height, damage, color, alternateColor){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.damage=damage;
        this.orignalColor=color;
        this.color=color;
        this.alternateColor=alternateColor;
        this.changeColorTimer=0;
        this.image=new Image();
        if(this.damage==1){
            this.image.src="images/lava.webp"
            this.index=2;
        }
        if(this.damage==2){
            this.image.src="images/strongerLava.webp"
            this.index=3;
        }
    }
    static timer(){
        LavaTerrain.iFrame--;
    }
    act(){
        this.changeColorTimer--;
        if(
            (player.x - player.width / 2+10) < (this.x + this.width / 2) &&
            (player.x + player.width / 2-10) > (this.x - this.width / 2) &&
            (player.y - player.height / 2+10) < (this.y + this.height / 2) &&
            (player.y + player.height / 2-10) > (this.y - this.height / 2))
        {
            if(LavaTerrain.iFrame<=0){
                LavaTerrain.iFrame=60;
                player.takeDamage(this.damage,this, gameState.floatingObjects);

            }
            
        }
    }
    draw(){
        ctx.save();
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();

    }
}
class HealTerrain{
    constructor(x, y, width, height, color, alternateColor){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.orignalColor=color;
        this.color=color;
        this.alternateColor=alternateColor;
        this.iFrame=0;
        this.index=4;
    }
    act(){
        this.iFrame--;
        this.changeColorTimer--;
        if(this.iFrame<=0){
            
            this.color=this.orignalColor;
        }
        if(
            (player.x - player.width / 2+10) < (this.x + this.width / 2) &&
            (player.x + player.width / 2-10) > (this.x - this.width / 2) &&
            (player.y - player.height / 2+10) < (this.y + this.height / 2) &&
            (player.y + player.height / 2-10) > (this.y - this.height / 2) && this.iFrame<=0)
        {
            this.color=this.alternateColor;
            if(this.iFrame<=0){
                this.iFrame=120;
                player.Heal(1, gameState.floatingObjects);

            }
            
        }
    }
    draw(){
        ctx.fillStyle=this.color
        ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    }
}
class TestTerrain{
    constructor(x, y, width, height, value){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.value=(value+1)/2*255;
        
    }
    static timer(){
    }
    act(){
    }
    draw(){
        ctx.fillStyle=`rgb(${this.value}, ${this.value}, ${this.value})`;
        ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    }
}




function drawWall(wall) {
    ctx.save();

    ctx.fillStyle = "#4A4A4A";
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);


    ctx.restore();
}







function RandomizeEnemies(numTier1, numTier2, numTier3, numTier1Boss, numTier2Boss, enemies, bossBars, bossMultiplier) {
    bossesLeft = numTier1Boss + numTier2Boss;
    let tier1 = [1, 2, 3, 4, 5, 6, 7];//missing 
    let tier2 = [1, 2, 3, 4, 5, 6, 7]; // 
    let tier3 = [1, 2, 3, 4, 5, 6, 7]; //
    let tier1Bosses = [1, 2, 3, 4, 5];//
    let tier2Bosses = [1, 2, 3, 4, 5];
    tier1 = shuffle(tier1);
    tier2 = shuffle(tier2);
    tier3 = shuffle(tier3);
    tier1Bosses = shuffle(tier1Bosses);
    tier2Bosses = shuffle(tier2Bosses);
    DisableAllEnemies();
    for (let i = 0; i < numTier1; i++) {
        switch (tier1[i]) {
            case 1:
                BasicEnemy.isActive = true;
                if (typeof window !== "undefined" && !BasicEnemy.seen) {
                    BasicEnemy.seen = true;
                    newEnemyQueue.push("images/enemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                ShooterEnemy.isActive = true;
                if (typeof window !== "undefined" && !ShooterEnemy.seen) {
                    ShooterEnemy.seen = true;
                    newEnemyQueue.push("images/shooterEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                AimingEnemy.isActive = true;
                if (typeof window !== "undefined" && !AimingEnemy.seen) {
                    AimingEnemy.seen = true;
                    newEnemyQueue.push("images/aimingEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 4:
                HomingEnemy.isActive = true;
                if (typeof window !== "undefined" && !HomingEnemy.seen) {
                    HomingEnemy.seen = true;
                    newEnemyQueue.push("images/homingEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 5:
                TrapperEnemy.isActive = true;
                if (typeof window !== "undefined" && !TrapperEnemy.seen) {
                    TrapperEnemy.seen = true;
                    newEnemyQueue.push("images/trapperEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 6:
                ZombieEnemy.isActive = true;
                if (typeof window !== "undefined" && !ZombieEnemy.seen) {
                    ZombieEnemy.seen = true;
                    newEnemyQueue.push("images/zombieEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 7:
                IceEnemy.isActive = true;
                if (typeof window !== "undefined" && !IceEnemy.seen) {
                    IceEnemy.seen = true;
                    newEnemyQueue.push("images/iceEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }
    for (let i = 0; i < numTier2; i++) {
        switch (tier2[i]) {
            case 1:
                ChargingEnemy.isActive = true;
                if (typeof window !== "undefined" && !ChargingEnemy.seen) {
                    ChargingEnemy.seen = true;
                    newEnemyQueue.push("images/chargingEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                ShieldEnemy.isActive = true;
                if (typeof window !== "undefined" && !ShieldEnemy.seen) {
                    ShieldEnemy.seen = true;
                    newEnemyQueue.push("images/shieldEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                GhostEnemy.isActive = true;
                if (typeof window !== "undefined" && !GhostEnemy.seen) {
                    GhostEnemy.seen = true;
                    newEnemyQueue.push("images/ghostEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 4:
                PoisonEnemy.isActive = true;
                if (typeof window !== "undefined" && !PoisonEnemy.seen) {
                    PoisonEnemy.seen = true;
                    newEnemyQueue.push("images/poisonEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 5:
                BlackHoleEnemy.isActive = true;
                if (typeof window !== "undefined" && !BlackHoleEnemy.seen) {
                    BlackHoleEnemy.seen = true;
                    newEnemyQueue.push("images/blackHoleEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 6:
                MimicEnemy.isActive = true;
                if (typeof window !== "undefined" && !MimicEnemy.seen) {
                    MimicEnemy.seen = true;
                    newEnemyQueue.push("images/mimicEnemyDead.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 7:
                TeleporterEnemy.isActive = true;
                if (typeof window !== "undefined" && !TeleporterEnemy.seen) {
                    TeleporterEnemy.seen = true;
                    newEnemyQueue.push("images/teleporterEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }
    for (let i = 0; i < numTier3; i++) {
        switch (tier3[i]) {
            case 1:
                BuilderEnemy.isActive = true;
                if (typeof window !== "undefined" && !BuilderEnemy.seen) {
                    BuilderEnemy.seen = true;
                    newEnemyQueue.push("images/builderEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                WindupEnemy.isActive = true;
                if (typeof window !== "undefined" && !WindupEnemy.seen) {
                    WindupEnemy.seen = true;
                    newEnemyQueue.push("images/windupEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                SpawnerEnemy.isActive = true;
                if (typeof window !== "undefined" && !SpawnerEnemy.seen) {
                    SpawnerEnemy.seen = true;
                    newEnemyQueue.push("images/spawnerEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 4:
                SelfDestructEnemy.isActive = true;
                if (typeof window !== "undefined" && !SelfDestructEnemy.seen) {
                    SelfDestructEnemy.seen = true;
                    newEnemyQueue.push("images/selfDestructEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 5:
                MachineGunEnemy.isActive = true;
                if (typeof window !== "undefined" && !MachineGunEnemy.seen) {
                    MachineGunEnemy.seen = true;
                    newEnemyQueue.push("images/machineGunEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 6:
                SmokeBombEnemy.isActive = true;
                if (typeof window !== "undefined" && !SmokeBombEnemy.seen) {
                    SmokeBombEnemy.seen = true;
                    newEnemyQueue.push("images/smokeBombEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 7:
                SplitterEnemy.isActive = true;
                if (typeof window !== "undefined" && !SplitterEnemy.seen) {
                    SplitterEnemy.seen = true;
                    newEnemyQueue.push("images/splitterEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }
    for (let i = 0; i < numTier1Boss; i++) {
        switch (tier1Bosses[i]) {
            case 1:
                enemies.push(new LaserBoss(1, 120, bossBars, bossMultiplier));
                if (typeof window !== "undefined" && !LaserBoss.seen) {
                    LaserBoss.seen = true;
                    newEnemyQueue.push("images/laserBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                enemies.push(new LaserBoss(1, 120, bossBars, bossMultiplier));
                if (typeof window !== "undefined" && !IceBoss.seen) {
                    IceBoss.seen = true;
                    newEnemyQueue.push("images/iceBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                boss = new BouncyBoss(5, 120, true, bossBars, bossMultiplier);
                if (typeof window !== "undefined" && !BouncyBoss.seen) {
                    BouncyBoss.seen = true;
                    newEnemyQueue.push("images/bouncyBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                enemies[enemies.length] = boss;
                break;
            case 4:
                boss = new MageBoss(2.5, 100, bossBars, bossMultiplier);
                if (typeof window !== "undefined" && !MageBoss.seen) {
                    MageBoss.seen = true;
                    newEnemyQueue.push("images/mageWaterMode.webp");
                    isPlayerUnlocked.push(false);
                }
                enemies[enemies.length] = boss;
                break;
            case 5:
                boss = new BulletHellBoss(3, 100, bossBars, bossMultiplier);
                if (typeof window !== "undefined" && !BulletHellBoss.seen) {
                    BulletHellBoss.seen = true;
                    newEnemyQueue.push("images/bulletHellBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                SCALE /= 1.2;
                enemies[enemies.length] = boss;
                break;
        }
    }
    for (let i = 0; i < numTier2Boss; i++) {
        switch (tier2Bosses[i]) {
            case 1:
                boss = new GambleBoss(1.5, 175, bossBars, bossMultiplier);
                enemies[enemies.length] = boss;
                if (typeof window !== "undefined" && !GambleBoss.seen) {
                    GambleBoss.seen = true;
                    newEnemyQueue.push("images/gambleBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                boss = new SnakeBoss(2.5, 300, true, 79, bossBars, bossMultiplier);
                enemies[enemies.length] = boss;
                if (typeof window !== "undefined" && !SnakeBoss.seen) {
                    SnakeBoss.seen = true;
                    newEnemyQueue.push("images/snakeBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                boss = new HealerBoss(1.5, 175, bossBars, bossMultiplier);
                enemies[enemies.length] = boss;
                if (typeof window !== "undefined" && !HealerBoss.seen) {
                    HealerBoss.seen = true;
                    newEnemyQueue.push("images/healingBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 4:
                boss = new EngineerBoss(1, 175, bossBars, bossMultiplier);
                enemies[enemies.length] = boss;
                if (typeof window !== "undefined" && !EngineerBoss.seen) {
                    EngineerBoss.seen = true;
                    newEnemyQueue.push("images/engineerBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 5:
                boss = new FarmerBoss(2, 75, bossBars, bossMultiplier);
                enemies[enemies.length] = boss;
                if (typeof window !== "undefined" && !FarmerBoss.seen) {
                    FarmerBoss.seen = true;
                    newEnemyQueue.push("images/farmerBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }
    // let boss = new BulletHellBoss(3, 100, bossBars);
    // enemies.push(boss);
    // ShieldEnemy.isActive=true;
    // boss = new SnakeBoss(2.5,300,true,79, bossBars, bossMultiplier, null);
    // enemies[enemies.length] = boss;


}
function DisableAllEnemies() {
    for (let i = 0; i < ENEMYTYPES.length; i++) {
        ENEMYTYPES[i].isActive = false;
    }
}

function InitializeStats() {
    BasicEnemy.baseTimer = 200;
    BasicEnemy.randomTimer = 200;
    BasicEnemy.index = 0;
    BasicEnemy.health = 5;
    BasicEnemy.speed = 2;

    ShooterEnemy.baseTimer = 300;
    ShooterEnemy.randomTimer = 200;
    ShooterEnemy.index = 1;
    ShooterEnemy.health = 3;
    ShooterEnemy.speed = 2;

    ChargingEnemy.baseTimer = 900;
    ChargingEnemy.randomTimer = 500;
    ChargingEnemy.index = 7;
    ChargingEnemy.health = 8;
    ChargingEnemy.speed = 1;

    AimingEnemy.baseTimer = 400;
    AimingEnemy.randomTimer = 400;
    AimingEnemy.index = 2;
    AimingEnemy.health = 1;
    AimingEnemy.speed = 3.5;

    HomingEnemy.baseTimer = 400;
    HomingEnemy.randomTimer = 400;
    HomingEnemy.index = 3;
    HomingEnemy.health = 2;
    HomingEnemy.speed = 1;

    ShieldEnemy.baseTimer = 900;
    ShieldEnemy.randomTimer = 750;
    ShieldEnemy.index = 6;
    ShieldEnemy.health = 15;
    ShieldEnemy.speed = 1.5;

    TrapperEnemy.baseTimer = 400;
    TrapperEnemy.randomTimer = 400;
    TrapperEnemy.index = 4;
    TrapperEnemy.health = 4;
    TrapperEnemy.speed = 3;

    ZombieEnemy.baseTimer = 450;
    ZombieEnemy.randomTimer = 300;
    ZombieEnemy.index = 5;
    ZombieEnemy.health = 3;
    ZombieEnemy.speed = 2;

    GhostEnemy.baseTimer = 750;
    GhostEnemy.randomTimer = 500;
    GhostEnemy.index = 8;
    GhostEnemy.health = 4;
    GhostEnemy.speed = 4;

    PoisonEnemy.baseTimer = 750;
    PoisonEnemy.randomTimer = 500;
    PoisonEnemy.index = 9;
    PoisonEnemy.health = 5;
    PoisonEnemy.speed = 1;

    BlackHoleEnemy.baseTimer = 800;
    BlackHoleEnemy.randomTimer = 600;
    BlackHoleEnemy.index = 10;
    BlackHoleEnemy.health = 5;
    BlackHoleEnemy.speed = 1.5;

    BuilderEnemy.baseTimer = 1000;
    BuilderEnemy.randomTimer = 900;
    BuilderEnemy.index = 12;
    BuilderEnemy.health = 12;
    BuilderEnemy.speed = 1.5;

    WindupEnemy.baseTimer = 900;
    WindupEnemy.randomTimer = 800;
    WindupEnemy.index = 13;
    WindupEnemy.health = 20;
    WindupEnemy.speed = 2;

    SpawnerEnemy.baseTimer = 900;
    SpawnerEnemy.randomTimer = 800;
    SpawnerEnemy.index = 14;
    SpawnerEnemy.health = 25;
    SpawnerEnemy.speed = 1.5;

    MimicEnemy.baseTimer = 700;
    MimicEnemy.randomTimer = 600;
    MimicEnemy.index = 11;
    MimicEnemy.health = 8;
    MimicEnemy.speed = 3;

    SelfDestructEnemy.baseTimer = 800;
    SelfDestructEnemy.randomTimer = 750;
    SelfDestructEnemy.index = 15;
    SelfDestructEnemy.health = 20;
    SelfDestructEnemy.speed = 2;

    MachineGunEnemy.baseTimer = 900;
    MachineGunEnemy.randomTimer = 800;
    MachineGunEnemy.index = 16;
    MachineGunEnemy.health = 15;
    MachineGunEnemy.speed = 3;

    SmokeBombEnemy.baseTimer = 1000;
    SmokeBombEnemy.randomTimer = 900;
    SmokeBombEnemy.index = 17;
    SmokeBombEnemy.health = 27;
    SmokeBombEnemy.speed = 3;

    SplitterEnemy.baseTimer = 900;
    SplitterEnemy.randomTimer = 800;
    SplitterEnemy.index = 18;
    SplitterEnemy.health = 15;
    SplitterEnemy.speed = 1.5;

    TeleporterEnemy.baseTimer = 800;
    TeleporterEnemy.randomTimer = 500;
    TeleporterEnemy.index = 19;
    TeleporterEnemy.health = 9;
    TeleporterEnemy.speed = 2;

    IceEnemy.baseTimer = 300;
    IceEnemy.randomTimer = 300;
    IceEnemy.index = 20;
    IceEnemy.health = 3;
    IceEnemy.speed = 1.5;

}
function ChangePage(id, reset, player) {
    if (continueFlag) return;
    if (id == "upgradePage" && isLevelling) return;
    if ((gameOver && id == "upgradePage")) {
        return;
    }
    currentPage = id;
    list = document.querySelectorAll('div[id$="Page"]');
    if (id != "upgradePage" && id != "newEnemyPage") {
        for (let i = 0; i < list.length; i++) {
            list[i].style.display = "none";
        }
    }
    page = id;
    document.getElementById(id).style.display = "block";
    if (id == "losePage" || id == "winPage") {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].isBoss) {
                enemies[i].bossText.remove();
            }
        }
        if (document.getElementById("indicator")) document.getElementById("indicator").remove();
        if (document.getElementById("indicator2")) document.getElementById("indicator2").remove();
        if (document.getElementById("waveText")) document.getElementById("waveText").remove();
    }
    //console.log(id)
    if (id == "characterSelectionPage") {
        chosenCharacter = 0;
        let descriptionText = document.getElementById("descriptionText");
        descriptionText.innerText = "";
        list = document.querySelectorAll('[id$="Player"]');
        for (let i = 0; i < list.length; i++) {
            list[i].style.border = "";
        }
        document.getElementById("startButton").disabled = true;
        let tankPlayerButton = document.getElementById("tankPlayer");
        let tankPlayerImage = document.getElementById("tankPlayerImage");
        let tankPlayerText = document.getElementById("tankPlayerText");
        if (TankPlayer.unlocked == false) {
            tankPlayerButton.style.pointerEvents = "none";
            tankPlayerImage.src = "images/black.webp";
            tankPlayerText.textContent = "Clear wave 3 in any difficulty to unlock";
            tankPlayerText.style.fontSize = "20px";
            tankPlayerText.style.top = "200px";
        }
        else {
            tankPlayerButton.style.pointerEvents = "auto";
            tankPlayerImage.src = "images/tankPlayer.webp";
            tankPlayerText.textContent = "Tank";
            tankPlayerText.style.fontSize = "30px";
            tankPlayerText.style.top = "225px";
        }
        let healerPlayerButton = document.getElementById("healerPlayer");
        let healerPlayerImage = document.getElementById("healerPlayerImage");
        let healerPlayerText = document.getElementById("healerPlayerText");
        if (HealerPlayer.unlocked == false) {
            healerPlayerButton.style.pointerEvents = "none";
            healerPlayerImage.src = "images/black.webp";
            healerPlayerText.textContent = "Clear wave 5 in any difficulty to unlock";
            healerPlayerText.style.fontSize = "20px";
            healerPlayerText.style.top = "200px";
        }
        else {
            healerPlayerButton.style.pointerEvents = "auto";
            healerPlayerImage.src = "images/healerPlayer.webp";
            healerPlayerText.textContent = "Healer";
            healerPlayerText.style.fontSize = "30px";
            healerPlayerText.style.top = "225px";
        }
        let magePlayerButton = document.getElementById("magePlayer");
        let magePlayerImage = document.getElementById("magePlayerImage");
        let magePlayerText = document.getElementById("magePlayerText");
        if (MagePlayer.unlocked == false) {
            magePlayerButton.style.pointerEvents = "none";
            magePlayerImage.src = "images/black.webp";
            magePlayerText.textContent = "Defeat The Demonlist boss to unlock";
            magePlayerText.style.fontSize = "20px";
            magePlayerText.style.top = "200px";
        }
        else {
            magePlayerButton.style.pointerEvents = "auto";
            magePlayerImage.src = "images/magePlayer.webp";
            magePlayerText.textContent = "Mage";
            magePlayerText.style.fontSize = "30px";
            magePlayerText.style.top = "225px";
        }
    }
    else if (id == "characterSelection2Page") {
        let descriptionText = document.getElementById("descriptionText2");
        descriptionText.innerText = "";
        list = document.querySelectorAll('[id$="Player"]');
        for (let i = 0; i < list.length; i++) {
            list[i].style.border = "";
        }
        document.getElementById("startButton2").disabled = true;
        let necromancyPlayerButton = document.getElementById("necromancerPlayer");
        let necromancyPlayerImage = document.getElementById("necromancerPlayerImage");
        let necromancyPlayerText = document.getElementById("necromancerPlayerText");
        if (NecromancerPlayer.unlocked == false) {
            necromancyPlayerButton.style.pointerEvents = "none";
            necromancyPlayerImage.src = "images/black.webp";
            necromancyPlayerText.textContent = "Beat wave 7 in Medium, Hard, or Extreme Demon Difficulty to Unlock";
            necromancyPlayerText.style.fontSize = "20px";
            necromancyPlayerText.style.top = "150px";
        }
        else {
            necromancyPlayerButton.style.pointerEvents = "auto";
            necromancyPlayerImage.src = "images/necromancerPlayer.webp";
            necromancyPlayerText.textContent = "Necromancer";
            necromancyPlayerText.style.fontSize = "30px";
            necromancyPlayerText.style.top = "225px";
        }
        let pheonixPlayerButton = document.getElementById("pheonixPlayer");
        let pheonixPlayerImage = document.getElementById("pheonixPlayerImage");
        let pheonixPlayerText = document.getElementById("pheonixPlayerText");
        if (PheonixPlayer.unlocked == false) {
            pheonixPlayerButton.style.pointerEvents = "none";
            pheonixPlayerImage.src = "images/black.webp";
            pheonixPlayerText.textContent = "Beat wave 9 in Medium, Hard, or Extreme Demon Difficulty to Unlock";
            pheonixPlayerText.style.fontSize = "20px";
            pheonixPlayerText.style.top = "150px";
        }
        else {
            pheonixPlayerButton.style.pointerEvents = "auto";
            pheonixPlayerImage.src = "images/pheonixPlayer.webp";
            pheonixPlayerText.textContent = "Pheonix";
            pheonixPlayerText.style.fontSize = "30px";
            pheonixPlayerText.style.top = "225px";
        }
    }
    else if (id == "gamemodeSelectionPage") {

        let gamemodeDescriptionText = document.getElementById("gamemodeDescriptionText");
        gamemodeDescriptionText.innerText = "";
        list = document.querySelectorAll('[id$="gamemodeSelectionButton"]');
        for (let i = 0; i < list.length; i++) {
            list[i].style.border = "";
        }
        document.getElementById("difficultyConfirmationButton").disabled = true;
    }
    else if (id == "settingsPage") {
        let temp = ""
        if (showHealthBars) {
            temp = "ON"
        }
        else {
            temp = "OFF"
        }
        document.getElementById("healthBarSetting").innerText = "Show Healthbars: " + temp;
    }
    else if (id == "enemyDescriptionSelectionPage") {

        images = document.querySelectorAll('[id$="GuideImage"]');
        buttons = document.querySelectorAll('[id$="GuideButton"]');
        for (let i = 0; i < images.length; i++) {
            images[i].src = "images/questionMark.png";
            buttons[i].style.pointerEvents = "none";
        }
        if (BasicEnemy.seen) {
            images[0].src = "images/Enemy.webp";
            images[0].style.pointerEvents = "auto";
        }
        if (ShooterEnemy.seen) {
            images[1].src = "images/shooterEnemy.webp";
            images[1].style.pointerEvents = "auto";
        }
        if (AimingEnemy.seen) {
            images[2].src = "images/aimingEnemy.webp";
            images[2].style.pointerEvents = "auto";
        }
        if (HomingEnemy.seen) {
            images[3].src = "images/homingEnemy.webp";
            images[3].style.pointerEvents = "auto";
        }
        if (TrapperEnemy.seen) {
            images[4].src = "images/trapperEnemy.webp";
            images[4].style.pointerEvents = "auto";
        }
        if (ZombieEnemy.seen) {
            images[5].src = "images/zombieEnemy.webp";
            images[5].style.pointerEvents = "auto";
        }
        if (ShieldEnemy.seen) {
            images[6].src = "images/shieldEnemy.webp";
            images[6].style.pointerEvents = "auto";
        }
        if (ChargingEnemy.seen) {
            images[7].src = "images/chargingEnemy.webp";
            images[7].style.pointerEvents = "auto";
        }
        if (GhostEnemy.seen) {
            images[8].src = "images/ghostEnemy.webp";
            images[8].style.pointerEvents = "auto";
        }
        if (PoisonEnemy.seen) {
            images[9].src = "images/poisonEnemy.webp";
            images[9].style.pointerEvents = "auto";
        }
        if (BlackHoleEnemy.seen) {
            images[10].src = "images/blackHoleEnemy.webp";
            images[10].style.pointerEvents = "auto";
        }
        if (MimicEnemy.seen) {
            images[11].src = "images/mimicEnemyDead.webp";
            images[11].style.pointerEvents = "auto";
        }
        if (BuilderEnemy.seen) {
            images[12].src = "images/builderEnemy.webp";
            images[12].style.pointerEvents = "auto";
        }
        if (WindupEnemy.seen) {
            images[13].src = "images/windupEnemy.webp";
            images[13].style.pointerEvents = "auto";
        }
        if (SpawnerEnemy.seen) {
            images[14].src = "images/spawnerEnemy.webp";
            images[14].style.pointerEvents = "auto";
        }
        if (SelfDestructEnemy.seen) {
            images[15].src = "images/selfDestructEnemy.webp";
            images[15].style.pointerEvents = "auto";
        }
        if (MachineGunEnemy.seen) {
            images[16].src = "images/machineGunEnemy.webp";
            images[16].style.pointerEvents = "auto";
        }
        if (SmokeBombEnemy.seen) {
            images[17].src = "images/smokeBombEnemy.webp";
            images[17].style.pointerEvents = "auto";
        }
        if (LaserBoss.seen) {
            images[18].src = "images/laserBoss.webp";
            images[18].style.pointerEvents = "auto";
        }
        if (IceBoss.seen) {
            images[19].src = "images/iceBoss.webp";
            images[19].style.pointerEvents = "auto";
        }
        if (BouncyBoss.seen) {
            images[20].src = "images/bouncyBoss.webp";
            images[20].style.pointerEvents = "auto";
        }
        if (MageBoss.seen) {
            images[21].src = "images/mageFireMode.webp";
            images[21].style.pointerEvents = "auto";
        }
        if (BulletHellBoss.seen) {
            images[22].src = "images/bulletHellBoss.webp";
            images[22].style.pointerEvents = "auto";
        }
        if (GambleBoss.seen) {
            images[23].src = "images/gambleBoss.webp";
            images[23].style.pointerEvents = "auto";
        }
        if (SnakeBoss.seen) {
            images[24].src = "images/snakeBoss.webp";
            images[24].style.pointerEvents = "auto";
        }
        if (HealerBoss.seen) {
            images[25].src = "images/healingBoss.webp";
            images[25].style.pointerEvents = "auto";
        }
        if (SplitterEnemy.seen) {
            images[26].src = "images/splitterEnemy.webp";
            images[26].style.pointerEvents = "auto";
        }
        if (TeleporterEnemy.seen) {
            images[27].src = "images/teleporterEnemy.webp";
            images[27].style.pointerEvents = "auto";
        }
        if (IceEnemy.seen) {
            images[28].src = "images/iceEnemy.webp";
            images[28].style.pointerEvents = "auto";
        }
        if (EngineerBoss.seen) {
            images[29].src = "images/engineerBoss.webp";
            images[29].style.pointerEvents = "auto";
        }
        if (FarmerBoss.seen) {
            images[30].src = "images/farmerBoss.webp";
            images[30].style.pointerEvents = "auto";
        }
    }
    else if (id == "gamePage") {
        if (choice1) {
            choice1.remove();
        }
        if (choice2) {
            choice2.remove();
        }
        if (choice3) {
            choice3.remove();
        }
        if (reset) Start();
        else {
            if (gamemode != 100) {
                lastTime = Date.now();
                loop();
            }
            else {
                changeMultiplayerPage("gamePage");
            }
        }
    }
    else if (id == "upgradePage") {
        paused = true;
        isLevelling = true;
        choice1 = document.createElement("div");
        choice2 = document.createElement("div");
        choice3 = document.createElement("div");
        if (upgradingEnemy == true) {
            document.getElementById("upgradeText").style.color = "red";
            document.getElementById('upgradeText').textContent = "Pick Your Poison";
            enemyHealthMultiplier = 1;
            enemySpeedMultiplier = 1;
            player.slowCountdown = 0;
            if (player.maxHealthHalved) {
                player.maxHealth = player.originalMaxHealth;
                player.maxHealthHalved = false;
                player.healMultiplier *= 2;
            }
            player.canHeal = true;
            player.constantDamageAmount = 0;
            let randomNum = Math.floor(Math.random() * NUMENEMYUPGRADES);
            choice1.innerHTML = `<button onmouseover="this.style.backgroundColor='#65000B'" onmouseout="this.style.backgroundColor='#9B111E'" onclick="${ENEMYUPGRADES[randomNum].onclick}" style="position:absolute;left:${screen.width / 2 - 200}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:#9B111E; font-size:150%;font-family:'black ops one'" id="upgrade">${ENEMYUPGRADES[randomNum].text}</button>`;

            document.body.appendChild(choice1);
            let randomNum2 = Math.floor(Math.random() * NUMENEMYUPGRADES);
            while (randomNum == randomNum2) {
                randomNum2 = Math.floor(Math.random() * NUMENEMYUPGRADES);
            }
            choice2.innerHTML = `<button onmouseover="this.style.backgroundColor='#65000B'" onmouseout="this.style.backgroundColor='#9B111E'" onclick="${ENEMYUPGRADES[randomNum2].onclick}" style="position:absolute;left:${screen.width / 2 + 200}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:#9B111E; font-size:150%;font-family:'black ops one'" id="upgrade">${ENEMYUPGRADES[randomNum2].text}</button>`;
            
            document.body.appendChild(choice2);
            isLevelling = false;
        }
        else if (!player || player.killedBoss == false) {
            console.log(player.boughtUpgrades);
            document.getElementById("upgradeText").style.color = "white";
            document.getElementById('upgradeText').textContent = "Choose Your Upgrade";
            let randomNum = Math.floor(Math.random() * NUMUPGRADES);
            while (player.boughtUpgrades[randomNum] == 1) {
                randomNum = Math.floor(Math.random() * NUMUPGRADES);
            }

            choice1.innerHTML = `<button onmouseover="this.style.backgroundColor='#00CCFF'" onmouseout="this.style.backgroundColor='cyan'" onclick="${UPGRADES[randomNum].onclick}" style="position:absolute;left:${screen.width / 2 - 400}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:cyan; font-size:150%;font-family:'black ops one'" id="upgrade1">${UPGRADES[randomNum].text}</button>`;

            document.body.appendChild(choice1);
            document.getElementById("upgrade1").onclick = () => {
                UPGRADES[randomNum].onclick(player);
            };

            let randomNum2 = Math.floor(Math.random() * NUMUPGRADES);
            while (randomNum == randomNum2 || player.boughtUpgrades[randomNum2] == 1) {
                randomNum2 = Math.floor(Math.random() * NUMUPGRADES);
            }
            choice2.innerHTML = `<button onmouseover="this.style.backgroundColor='#00CCFF'" onmouseout="this.style.backgroundColor='cyan'" onclick="${UPGRADES[randomNum2].onclick}" style="position:absolute;left:${screen.width / 2}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:cyan; font-size:150%;font-family:'black ops one'" id="upgrade2">${UPGRADES[randomNum2].text}</button>`;

            document.body.appendChild(choice2);
            document.getElementById("upgrade2").onclick = () => {
                UPGRADES[randomNum2].onclick(player);
            };

            let randomNum3 = Math.floor(Math.random() * NUMUPGRADES);
            while (randomNum == randomNum3 || randomNum3 == randomNum2 || player.boughtUpgrades[randomNum3] == 1) {
                randomNum3 = Math.floor(Math.random() * NUMUPGRADES);
            }
            choice3.innerHTML = `<button onmouseover="this.style.backgroundColor='#00CCFF'" onmouseout="this.style.backgroundColor='cyan'" onclick="${UPGRADES[randomNum3].onclick}" style="position:absolute;left:${screen.width / 2 + 400}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:cyan; font-size:150%;font-family:'black ops one'" id="upgrade3">${UPGRADES[randomNum3].text}</button>`;
            document.body.appendChild(choice3);
            document.getElementById("upgrade3").onclick = () => {
                UPGRADES[randomNum3].onclick(player);
            };
        }
        else {
            document.getElementById("upgradeText").style.color = "yellow";
            document.getElementById('upgradeText').textContent = "Choose Your Upgrade";
            let randomNum = Math.floor(Math.random() * NUMTIER2UPGRADES);
            while (boughtTier2Upgrades[randomNum] == 1) {
                randomNum = Math.floor(Math.random() * NUMTIER2UPGRADES);
            }

            choice1.innerHTML = `<button onmouseover="this.style.backgroundColor='#E4D00A'" onmouseout="this.style.backgroundColor='yellow'" onclick="${TIER2UPGRADES[randomNum].onclick}" style="position:absolute;left:${screen.width / 2 - 200}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:yellow; font-size:150%;font-family:'black ops one'" id="upgrade1">${TIER2UPGRADES[randomNum].text}</button>`;

            document.body.appendChild(choice1);
            document.getElementById("upgrade1").onclick = () => {
                TIER2UPGRADES[randomNum].onclick(player);
            };

            let randomNum2 = Math.floor(Math.random() * NUMTIER2UPGRADES);
            while (randomNum == randomNum2 || boughtTier2Upgrades[randomNum2] == 1) {
                randomNum2 = Math.floor(Math.random() * NUMTIER2UPGRADES);
            }
            choice2.innerHTML = `<button onmouseover="this.style.backgroundColor='#E4D00A'" onmouseout="this.style.backgroundColor='yellow'" onclick="${TIER2UPGRADES[randomNum2].onclick}" style="position:absolute;left:${screen.width / 2 + 200}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:yellow; font-size:150%;font-family:'black ops one'" id="upgrade2">${TIER2UPGRADES[randomNum2].text}</button>`;

            document.body.appendChild(choice2);
            document.getElementById("upgrade2").onclick = () => {
                TIER2UPGRADES[randomNum2].onclick(player);
            };



            player.killedBoss = false;
        }
    }
    else if (id == "newEnemyPage") {
        newEnemyText(newEnemyQueue[0]);
        newEnemyQueue.splice(0, 1);
    }
    else if (id == "controlsPage") {
        list = document.querySelectorAll('[id$="ControlButton"]');
        list[0].innerText = controls["left"].toUpperCase();
        list[1].innerText = controls["right"].toUpperCase();
        list[2].innerText = controls["up"].toUpperCase();
        list[3].innerText = controls["down"].toUpperCase();
        list[4].innerText = controls["ability1"].toUpperCase();
        list[5].innerText = controls["ability2"].toUpperCase();
        list[6].innerText = controls["ability3"].toUpperCase();
        list[7].innerText = controls["ability4"].toUpperCase();
        list[8].innerText = controls["ability5"].toUpperCase();
        list[9].innerText = controls["levelUp"].toUpperCase();
        list[10].innerText = controls["skipWave"].toUpperCase();
        list[11].innerText = controls["dealDamage"].toUpperCase();
    }
}
function ChangeWave(gameState) {
    if (typeof window !== "undefined" && (gameState.currentWave == 3 || gameState.currentWave == 5 || gameState.currentWave == 7)) {
        player.killedBoss = true;
    }
    gameState.currentWave++;
    gameState.waveText.Update(gameState.currentWave);
    let isBossWave = false;
    let bossesLeft = 0;
    let enemies = gameState.enemies;
    let bossBars = gameState.bossBars;
    let bossMultiplier = gameState.bossMultiplier;
    if(typeof window!=="undefined" && gamemode==3){
        gameState.mapObjects = [
            new Wall(-55, -55, 2110, 30),
            new Wall(-25, 1125, 2080, 30),
            new Wall(-55, -25, 30, 1180),
            new Wall(2025, -25, 30, 1170)
        ];
        CreateTiles();
    }
    else if(typeof window!=="undefined" &&gamemode==5){
        upgradingEnemy=true;
    }
    if (typeof window === "undefined" || gamemode != 6) {
        switch (gameState.currentWave) {
            case 2:
                if (typeof window !== "undefined" && gamemode == 0) {
                    RandomizeEnemies(2, 0, 0, 0, 0, enemies, bossBars, gameState.bossMultiplier);
                }
                else RandomizeEnemies(2, 1, 0, 0, 0, enemies, bossBars, gameState.bossMultiplier);
                isBossWave = false;
                SCALE = 0.0015;
                break;
            case 3:
                if (typeof window !== "undefined" && gamemode == 0) {
                    RandomizeEnemies(1, 1, 0, 1, 0, enemies, bossBars, gameState.bossMultiplier);
                }
                else RandomizeEnemies(2, 1, 0, 1, 0, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 1;
                isBossWave = true;
                SCALE = 0.0005;
                break;
            case 4:
                RandomizeEnemies(3, 2, 1, 0, 0, enemies, bossBars, gameState.bossMultiplier);
                isBossWave = false;
                SCALE = 0.001;
                if (typeof window !== "undefined" && TankPlayer.unlocked == false) {
                    TankPlayer.unlocked = true;
                    newEnemyQueue.push("images/tankPlayer.webp");
                    isPlayerUnlocked.push(true);
                }
                break;
            case 5:
                RandomizeEnemies(1, 2, 1, 1, 0, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 1;
                isBossWave = true;
                SCALE = 0.0004;
                break;
            case 6:
                RandomizeEnemies(2, 3, 2, 0, 0, enemies, bossBars, gameState.bossMultiplier);
                isBossWave = false;
                SCALE = 0.0015;
                if (typeof window !== "undefined" && HealerPlayer.unlocked == false) {
                    HealerPlayer.unlocked = true;
                    newEnemyQueue.push("images/healerPlayer.webp");
                    isPlayerUnlocked.push(true);
                }
                break;
            case 7:
                RandomizeEnemies(2, 1, 1, 0, 1, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 1;
                isBossWave = true;
                SCALE = 0.0004;
                break;
            case 8:
                RandomizeEnemies(2, 2, 2, 1, 0, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 1;
                isBossWave = true;
                SCALE = 0.0005;
                if (typeof window !== "undefined" && difficulty > 1 && NecromancerPlayer.unlocked == false) {
                    NecromancerPlayer.unlocked = true;
                    newEnemyQueue.push("images/necromancerPlayer.webp");
                    isPlayerUnlocked.push(true);
                }
                break;
            case 9:
                RandomizeEnemies(2, 2, 3, 0, 1, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 1;
                isBossWave = true;
                SCALE = 0.0007;
                break;
            case 10:
                RandomizeEnemies(2, 2, 1, 2, 0, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 2;
                isBossWave = true;
                SCALE = 0.0006;
                if (typeof window !== "undefined" && difficulty > 1 && PheonixPlayer.unlocked == false) {
                    PheonixPlayer.unlocked = true;
                    newEnemyQueue.push("images/pheonixPlayer.webp");
                    isPlayerUnlocked.push(true);
                }
                break;
            case 11:
                RandomizeEnemies(2, 2, 2, 1, 1, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 2;
                isBossWave = true;
                SCALE = 0.0006;
                break;
            case 12:
                if (typeof window !== "undefined") EndGame(true);
                break;
        }
    }
    else {
        switch (gameState.currentWave) {
            case 2:
                RandomizeEnemies(0, 0, 0, 1, 0, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 1;
                break;
            case 3:
                RandomizeEnemies(0, 0, 0, 0, 1, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 1;
                break;
            case 4:
                RandomizeEnemies(0, 0, 0, 2, 0, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 2;
                break;
            case 5:
                RandomizeEnemies(0, 0, 0, 0, 2, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 2;
                break;
            case 6:
                RandomizeEnemies(0, 0, 0, 2, 1, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 3;
                break;
            case 7:
                RandomizeEnemies(0, 0, 0, 0, 3, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 3;
                break;
            case 8:
                RandomizeEnemies(0, 0, 0, 3, 1, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 4;
                break;
            case 9:
                RandomizeEnemies(0, 0, 0, 1, 3, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 4;
                break;
            case 10:
                RandomizeEnemies(0, 0, 0, 3, 2, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 5;
                break;
            case 11:
                RandomizeEnemies(0, 0, 0, 3, 3, enemies, bossBars, gameState.bossMultiplier);
                bossesLeft = 6;
                break;
            case 12:
                EndGame(true);
                break;
        }
        gameState.waveTimer=3600;
    }

    SCALE *= gameState.scaleMultiplier
    return [isBossWave, bossesLeft, gameState.currentWave, SCALE];
    //originalScale=SCALE;
}
const ENEMYTYPES = [BasicEnemy, ShooterEnemy, AimingEnemy, HomingEnemy, TrapperEnemy, ZombieEnemy, ShieldEnemy, ChargingEnemy, GhostEnemy, PoisonEnemy, BlackHoleEnemy, MimicEnemy, BuilderEnemy, WindupEnemy, SpawnerEnemy, SelfDestructEnemy, MachineGunEnemy, SmokeBombEnemy, SplitterEnemy, TeleporterEnemy, IceEnemy];
// Rest of enemy types:

class FloatingObject {
    constructor(x, y, content, color) {
        this.x = x;
        this.y = y;
        this.content = content;
        if (color) {
            this.color = color;
        }
        this.timer = 60;
        this.width = 75;
        this.height = 75;
        this.dead = false;
    }
    move() {
        this.y -= 2;
        this.timer--;
        if (this.timer == 0) {
            this.dead = true;
        }
    }
    draw() {
        if (typeof window === "undefined") return;
        if (this.dead) return;
        ctx.save();
        if (this.content instanceof Image) {
            ctx.drawImage(this.content, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else {
            ctx.font = `${30}px Times New Roman`
            ctx.fillStyle = this.color;
            ctx.fillText(this.content, this.x, this.y);
        }

        ctx.restore();
    }
}

class Collectable {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.timer = 0;
    }
    act() {
        this.timer--;
        if (this.timer == 0) this.dead = true;
    }
    draw() {

        if (this.dead) return;
        ctx.save();
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        ctx.restore();
    }
}
class XPBag extends Collectable {
    constructor(x, y) {
        super(x, y);
        this.size = Math.round(Math.random() * 50 + 10);
        this.width = this.size * 2;
        this.height = this.size * 2;
        this.timer = 600;
        this.index = 0;

    }
    act(players) {
        super.act();
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (this.x < player.x + player.width && this.x + this.width - this.width / 6 > player.x && this.y < player.y + player.height && this.y + this.height - this.width / 6 > player.y) {

                this.dead = true;
            }
        }
    }
}
class HealthPotion extends Collectable {
    constructor(x, y) {
        super(x, y)
        this.x = x;
        this.y = y;
        this.size = Math.ceil(Math.random() * 4) + 1;
        this.width = (this.size * 15 + 15);
        this.height = (this.size * 15 + 15);
        this.timer = 1000;
        this.index = 1;
    }
    act(players, floatingObjects) {
        super.act();
        for (let id = 0; id < players.length; id++) {
            let player = players[id];
            if (this.x < player.x + player.width && this.x + this.width - this.width / 6 > player.x && this.y < player.y + player.height && this.y + this.height - this.width / 6 > player.y) {
                player.Heal(this.size, floatingObjects);

                this.dead = true;
            }
        }
    }
}
function drawCollectable(collectable, image) {
    ctx.save();
    ctx.drawImage(image, collectable.x - collectable.width / 2, collectable.y - collectable.height / 2, collectable.width, collectable.height);


    ctx.restore();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Bullet, Enemy, Player, FloatingObject, ENEMYTYPES, InitializeStats, EnemyBullet, PlayerLaser, BasicPlayer, BombIcon, TimeWarpIcon, RandomizeEnemies, ChangeWave, WaveText, Wall, EnemyShield, XPBag, HealthPotion, ProtectorBullet, PlayerShield, BulletDeleterIcon, TankPlayer, MagePlayer, HealerPlayer, PheonixPlayer, NecromancerPlayer };
}


function drawOutline(object) {

    ctx.save();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "blue";
    ctx.strokeRect(object.x - object.width / 2, object.y - object.height / 2, object.width, object.height);
    ctx.restore();
}
function RectCircleColliding(circle, rect, radius, x, y) {
    var distX = Math.abs(x - rect.x);
    var distY = Math.abs(y - rect.y);

    if (distX > (rect.width / 2 + radius)) { return false; }
    if (distY > (rect.height / 2 + radius)) { return false; }

    if (distX <= (rect.width / 2)) { return true; }
    if (distY <= (rect.height / 2)) { return true; }

    var dx = distX - rect.width / 2;
    var dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (radius * radius));
}

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}


