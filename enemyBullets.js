class EnemyBullet {
    constructor(speedX, speedY, damage, x, y) {
        this.image = new Image();
        this.image.src = 'images/enemyBullet.webp';
        this.speedX = speedX;
        this.speedY = speedY;
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.width=10;
        this.height=10;
        this.frostbite = false;
        this.ignoreShield=false;
        this.ignoreWipe=false;
        this.hitPlayer=false;
        this.isEnemy=false;
    }
    move() {

        this.x += this.speedX;
        this.y += this.speedY;
        const dx = (this.x + 5) - (player.x + 5);
        const dy = (this.y + 5) - (player.y + 5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (player.width/2-10) + this.width / 2) {
            player.takeDamage(this.damage, this);
            this.dead = true;
            this.hitPlayer=true;
        }
        if (this.x < -500 || this.y < -500 || this.x > canvas.width + 500 || this.y >= canvas.height + 500) {
            this.dead = true;
        }
    }
    draw(){
        
        ctx.save();
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    special() {
    }
}
class PoisonBomb extends EnemyBullet {
    constructor(x, y, speedX, speedY) {
        super(speedX, speedY, 1, x, y);
        this.shootTimer = 120;
        this.explodeTimer = 0;
        this.height = 25;
        this.width = 25;
        this.x=x;
        this.y=y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.image.src = "images/poisonBomb.webp";
        this.image.zIndex = 1;
        this.scale = 25;
        this.iFrame = 0;
        this.ignoreShield=true;
    }
    move() {

        if (this.explodeTimer > 0 && this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2, this.x, this.y)) {
            player.takeDamage(this.damage, this);
            this.iFrame = 45;

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
            this.image.src = "images/poisonCloud.webp";
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
class EnemyBomb extends EnemyBullet {
    constructor(x, y, speedX, speedY, timer) {
        super(speedX, speedY, 1, x, y);
        this.shootTimer = Math.round(timer/2)*2;
        this.maxTimer=Math.round(timer/2)*2;
        this.explodeTimer = 0;
        this.height = 50;
        this.width = 50;
        this.damage=4;
        this.x=x;
        this.y=y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.image.src = "images/enemyBomb.webp";
        this.image.zIndex = 1;
        this.scale = 50;
        this.iFrame = 0;
        this.ignoreShield=true;
        console.log(this.x+" "+this.y+" "+this.speedX+" "+this.speedY)
    }
    move() {

        if (this.explodeTimer <= 0) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        if (this.explodeTimer > 0 && this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2-20, this.x, this.y)) {
            player.takeDamage(this.damage, this);
            this.iFrame = 61;

        }
    }
    special() {
        this.shootTimer--;
        this.explodeTimer--;
        this.iFrame--;
        if (this.shootTimer == 0 && this.explodeTimer < 0) {
            this.image.src = "images/explosion.webp";
            this.explodeTimer = 30;
        }
        if (this.explodeTimer >0) {
            this.scale += 10;
        }
        if (this.shootTimer > this.maxTimer/2) {
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
    draw(){
        if(this.explodeTimer>0){
            ctx.save();
            ctx.filter = 'hue-rotate(90deg)';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.filter="none";
            ctx.restore();
        } 
        else super.draw();
    }
}

class HomingBullet extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y) {
        super(speedX, speedY, damage, x, y);
        this.homingTimer = 0;
        this.image.src = 'images/homingBullet.webp';
        let lastSpeedX = 0;
        let lastSpeedY = 0;
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
        this.damage=2;
        this.width = "20";
        this.height = "20";
        let angle = Math.atan(distanceY / distanceX);
        if (distanceX == 0) {
            if (this.y > player.y) {
                this.speedY -= 5;
            }
            if (this.y < player.y) {
                this.speedY += 5;
            }
        }
        else {
            if (this.x > player.x) {
                this.speedX = -5 * Math.cos(angle);
            }
            if (this.y > player.y) {
                this.speedY = -5 * Math.sin(angle);
            }
            if (this.x < player.x) {
                this.speedX = 5 * Math.cos(angle);
            }
            if (this.y < player.y) {
                this.speedY = 5 * Math.sin(angle);
            }
        }
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
        this.target();
    }
    target() {
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
class HealerBossBullet extends HomingBullet {
    constructor(speedX, speedY, damage, x, y, owner) {
        super(speedX, speedY, damage, x, y);
        this.owner=owner;
        this.image.src = 'images/healingBossProjectile.webp';
        this.width = 40;
        this.height = 40;
        this.homingTimer=-120;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move(){
        super.move();
        if(this.dead && this.hitPlayer){
            this.owner.HealAll();
        }
    }
    draw(){
        
        ctx.save();
        ctx.filter="brightness(200%)";
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }

}
class HealerBossBullet2 extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y, owner) {
        super(speedX, speedY, damage, x, y);
        this.owner=owner;
        this.image.src = 'images/healingBossProjectile.webp';
        this.width = 40;
        this.height = 40;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move(){
        super.move();
        if(this.dead && this.hitPlayer){
            this.owner.HealAll();
        }
    }

}
class Icicle extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y, width, height) {
        super(speedX, speedY, damage, x, y);
        this.image.src = 'images/blue.webp';
        this.width = width;
        this.height = height;
        this.image.style.transform = "translate(-50%, -50%)";
        this.frostbite = true;
        this.timer = 100;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
        this.timer--;
        if (this.timer == 0 || (this.x < leftBorder || this.x > rightBorder || this.y < topBorder || this.y > bottomBorder)) {
            if (this.x < leftBorder || this.x > rightBorder || this.y < topBorder || this.y > bottomBorder) {
                this.dead = true;
            }
            else {
                this.timer = 100;
            }
            let temp = new EnemyBullet(1.5, 1.5, 1, this.x - 5, this.y - 5);
            temp.width = 20;
            temp.height = 20;
            temp.image.src = "images/blue.webp";
            temp.frostbite = true;
            enemyBullets.push(temp);
            let temp2 = new EnemyBullet(1.5, -1.5, 1, this.x - 5, this.y - 5);
            temp2.width = 20;
            temp2.height = 20;
            temp2.image.src = "images/blue.webp";
            temp2.frostbite = true;
            enemyBullets.push(temp2);
            let temp3 = new EnemyBullet(-1.5, 1.5, 1, this.x - 5, this.y - 5);
            temp3.width = 20;
            temp3.height = 20;
            temp3.image.src = "images/blue.webp";
            temp3.frostbite = true;
            enemyBullets.push(temp3);
            let temp4 = new EnemyBullet(-1.5, -1.5, 1, this.x - 5, this.y - 5);
            temp4.width = 20;
            temp4.height = 20;
            temp4.image.src = "images/blue.webp";
            temp4.frostbite = true;
            enemyBullets.push(temp4);
        }
    }

}
class EnemyTrap extends EnemyBullet {
    constructor(damage, x, y, width, height) {
        super(0, 0, damage, x, y);
        this.image.src = 'images/trap.webp';
        this.width = width - 10;
        this.height = height - 10;
        this.image.style.width = width + "px";
        this.image.style.height = height + "px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.deathTimer = 900;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
        this.deathTimer--;
        if (this.deathTimer == 0) {
            this.dead = true;
        }
    }

}
class BlackHole extends EnemyBullet {
    constructor(damage, x, y, vx, vy) {
        super(vx, vy, damage, x, y);
        this.image.src = 'images/blackHole.webp';
        this.width = 40;
        this.height = 40;
        this.x=x;
        this.y=y;
        this.deathTimer = 400;
        this.iFrame = 0;
        this.ignoreShield=true;

        this.background = new Image();
        this.background.src = "images/spiral.webp";
        this.background.width = 400;
        this.background.height = 400;
        this.ignoreShield=true;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    draw(){
        if (this.dead) return;
        ctx.save();
        ctx.globalAlpha=0.2;
        ctx.drawImage(this.background, this.x - this.background.width / 2, this.y - this.background.height / 2, this.background.width, this.background.height);
        ctx.globalAlpha=1;
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);


        ctx.restore();
    }
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    special() {
        this.deathTimer--;

        const dx = (this.x + 5) - (player.x + 5);
        const dy = (this.y + 5) - (player.y + 5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        //console.log(dx+" "+dy+" "+this.x+" "+this.y+" "+this.speedX+" "+this.speedY);
        if (distance < (200+player.width/2)) {
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
        if (distance < (100+player.width/2)) {
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
        if (distance < (player.width/2-10) + this.width / 2 && this.iFrame <= 0) {
            player.takeDamage(this.damage, this);
            this.iFrame = 40;
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
        this.image.src = "images/yellow.webp";
        this.ignoreWipe=true;
        this.ignoreShield=true;
    }
    move() {
        if (this.warningTimer < 0) {
            if (this.iFrame > 0) {
                this.iFrame--;
            }
            else {
                let dx = player.x - this.x;
                let dy = player.y - this.y;
                let distanceToLine = Math.abs(dx * Math.sin(this.spawnAngle) - dy * Math.cos(this.spawnAngle));

                let forwardDistance = dx * Math.cos(this.spawnAngle) + dy * Math.sin(this.spawnAngle);

                if (distanceToLine < 30 && forwardDistance > -15) {
                    player.takeDamage(1, this);
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
    draw(){
        ctx.save();
        if(this.warningTimer>0){
            ctx.filter='brightness(50%)';
        }
        ctx.translate(this.x, this.y);
        ctx.rotate(this.spawnAngle - Math.PI / 2);
        ctx.drawImage(this.image, -this.width, 0, this.width, this.height);
        ctx.filter='brightness(100%)';
        ctx.restore();
    }
}
class PermanentLaser extends Laser {
    constructor(angle, x, y) {
        super(angle, x, y);
        this.despawnTimer=9999999;
    }
}
class Fire extends EnemyBullet {
    constructor(damage, x, y, vx, vy) {
        super(vx, vy, damage, x, y);
        this.image.src = 'images/fire.webp';
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
        this.image.src = 'images/water.webp';
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
    move() {

        this.x += this.speedX;
        this.y += this.speedY;
        const dx = (this.x + 5) - (player.x + 5);
        const dy = (this.y + 5) - (player.y + 5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (player.width/2-10) + this.width / 2 && this.hit == false) {
            player.AddForce(-dx / 3.5, -dy / 3.5);
            player.slowCountdown = Math.max(player.slowCountdown, 120);
            this.hit = true;
        }
        if (this.x < -500 || this.y < -500 || this.x > canvas.width + 500 || this.y >= canvas.height + 500) {
            this.dead = true;
        }
    }

}
class BigRock extends EnemyBullet {
    constructor(damage, x, y, vx, vy) {
        super(vx, vy, damage, x, y);
        this.image.src = 'images/bigRock.webp';
        this.width = 80;
        this.height = 80;
        this.deathTimer = 100;
        this.ignoreWipe=false;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
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
        this.image.src = 'images/smallRock.webp';
        this.width = 40;
        this.height = 40;
        this.ignoreWipe=false;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }

}

class ChargingOrb extends EnemyBullet {
    constructor(x, y, speedX, speedY) {
        super(speedX, speedY, 1, x, y);
        this.shootTimer = 600;
        this.explodeTimer = 0;
        this.height = 25;
        this.width = 25;
        this.x=x;
        this.y=y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.image.src = "images/chargedOrb.webp";
        this.scale = 25;
        this.iFrame = 0;
        this.ignoreShield=true;
        this.hitEnemies = new Set();
    }
    move() {
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

            let distanceX = player.x - this.x;
            let distanceY = player.y - this.y;
            let distance = distanceX * distanceX + distanceY * distanceY;
            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                this.speedX = 3 * Math.cos(angle);
                this.speedY = 3 * Math.sin(angle);
            }


        }
        if (this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2 - 10, this.x, this.y)) {
            player.takeDamage(this.damage, this);
            this.iFrame = 15;

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
        if (this.x < -500 || this.y < -500 || this.x > canvas.width + 500 || this.y >= canvas.height + 500) {
            this.dead = true;
        }

    }
}
class SpinningBullet extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y) {
        super(speedX, speedY, damage, x, y);
        this.image.src = 'images/purple.webp';
        this.width = 20;
        this.height = 20;
        this.centerX = this.x;
        this.centerY = this.y;
        this.angle = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move() {
        this.centerX += this.speedX;
        this.centerY += this.speedY;
        this.angle += 0.05;
        this.angle %= 2 * Math.PI;
        this.offsetX = 50 * Math.cos(this.angle);
        this.offsetY = 50 * Math.sin(this.angle);
        this.x = this.centerX + this.offsetX;
        this.y = this.centerY + this.offsetY;

        if (RectCircleColliding(this, player, this.width / 2 - 10, this.x, this.y)) {
            player.takeDamage(this.damage, this);
            this.dead = true;

        }
        if (this.x < -500 || this.y < -500 || this.x > canvas.width + 500 || this.y >= canvas.height + 500) {
            this.dead = true;
        }

    }
    special() {
    }

}
class SplitterBullet extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y, tier, size) {
        super(speedX, speedY, tier, x, y);
        this.image.src = 'images/splitterBullet.webp';
        this.width = size;
        this.height = size;
        this.image.style.transform = "translate(-50%, -50%)";
        this.timer = 120;
        this.tier=tier;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
        this.timer--;
        if (this.timer == 0) {
            this.dead=true;
            if(this.tier>1){
                let angle=Math.atan2(this.speedY, this.speedX);
                let oppositeAngle=Math.atan2(-this.speedX, this.speedY);
                let temp = new SplitterBullet(3*Math.cos(angle), 3*Math.sin(angle), 1, this.x - 5, this.y - 5, this.tier-1, this.width/1.5);
                enemyBullets.push(temp);
                let temp2 = new SplitterBullet(-3*Math.cos(angle), -3*Math.sin(angle), 1, this.x - 5, this.y - 5, this.tier-1, this.width/1.5);
                enemyBullets.push(temp2);
                let temp3 = new SplitterBullet(3*Math.cos(oppositeAngle), 3*Math.sin(oppositeAngle), 1, this.x - 5, this.y - 5, this.tier-1, this.width/1.5);
                enemyBullets.push(temp3);
                let temp4 = new SplitterBullet(-3*Math.cos(oppositeAngle),-3*Math.sin(oppositeAngle), 1, this.x - 5, this.y - 5, this.tier-1, this.width/1.5);
                enemyBullets.push(temp4);
            }
        }
    }

}
class EngineerBullet extends EnemyBullet {
    constructor(x, y, speedX, speedY, type) {
        super(speedX, speedY, 1, x, y);
        this.shootTimer = Math.random()*120+60;
        this.height = 50;
        this.width = 50;
        this.x=x;
        this.y=y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.image.src = "images/engineerBullet.webp";
        this.type=type;
        this.ignoreShield=true;
    }
    move() {

        this.x += this.speedX;
        this.y += this.speedY;
    }
    special() {
        this.shootTimer--;
        if (this.shootTimer <= 0 || this.x < leftBorder-20 || this.y < topBorder-20 || this.x > rightBorder + 20 || this.y >= bottomBorder + 20) {
            this.dead=true;
            this.x=Math.min(rightBorder+20, this.x);
            this.x=Math.max(leftBorder-20, this.x);
            this.y=Math.max(topBorder-20, this.y);
            this.y=Math.min(bottomBorder+20, this.y);
            switch(this.type){
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
}
class FarmerBullet extends EnemyBullet {
    constructor(x, y, damage, speedX, speedY) {
        super(speedX, speedY, damage, x, y);
        this.width = 40;
        this.height = 40;
        this.image.src="images/farmerBullet.webp";
        this.iFrame = 0;
        this.ignoreShield=true;
        this.ignoreWipe=true;
    }
    move(){
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < (this.width - 50) / 2+leftBorder) {
            this.x = (this.width - 50) / 2+leftBorder;
            this.speedX *= -1;
        }
        if (this.y < (this.width - 50) / 2+topBorder) {
            this.y = (this.width - 50) / 2+topBorder;
            this.speedY *= -1;
        }
        if (this.x > rightBorder - (this.width - 50) / 2) {
            this.x =rightBorder - (this.width - 50) / 2;
            this.speedX *= -1;
        }
        if (this.y > bottomBorder - (this.width - 50) / 2) {
            this.y = bottomBorder - (this.width - 50) / 2;
            this.speedY *= -1;
        }
        this.iFrame--;
        for (let i = enemies.length - 1; i >= 0; i--) {

            if (
                (player.x - player.width / 2) < (this.x + this.width / 2) &&
                (player.x + player.width / 2) > (this.x - this.width / 2) &&
                (player.y - player.height / 2) < (this.y + this.height / 2) &&
                (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0
            ) {
                player.takeDamage(this.damage, this);
                this.iFrame = 20;
                let angle=Math.atan2((player.y-this.y),(player.x-this.x));
                this.speedX=-8*Math.cos(angle);
                this.speedY=-8*Math.sin(angle);
            }
        }
    }
}