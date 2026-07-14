
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

class Enemy {
    static isActive = false;
    static seen = false;
    static spawnCooldown=0;
    static baseTimer=0;
    static randomTimer=0;
    static index=0;
    static health=0;
    static speed=0;
    constructor(speed, health) {
        this.image = new Image();
        this.image.src = 'images/enemy.webp';
        this.speed = speed;
        this.health = health;
        this.maxHealth=health;
        this.isBoss = false;
        this.isEnemy=true;
        this.value = 30;
        if (Math.random() < 0.5) {
            this.y = Math.random() * canvas.height;
            if (Math.random() < 0.5) {
                this.x = -200;
            }
            else {
                this.x = canvas.width + 200;
            }
        }
        else {
            this.x = Math.random() * canvas.width;
            if (Math.random() < 0.5) {
                this.y = -200;
            }
            else {
                this.y = canvas.height + 200;
            }
        }
        this.width = 50;
        this.height = 50;

        this.ignoreBullets = false;
        this.ignoreShield=false;
        this.giveXP = true;
        this.redTimer = 0;
        this.slowCountdown = -1;
        this.canSiphon = true;
        this.accelerationX=0;
        this.accelerationY=0;
        this.speedTimer=0;
        this.knockbackIFrame=0;
        this.hasHealthBar=true;
        this.healTimer=0;
        this.dead=false;
        //console.log(this.image);
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        if(this.isBoss){

            ctx.lineWidth = 5;
            ctx.strokeStyle = "blue";
            ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else{
            if(showHealthBars && this.hasHealthBar){
                ctx.fillStyle = "red";
                ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, this.width*1.5, 15)
                ctx.fillStyle = "green";
                ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, (this.width*1.5)/this.maxHealth*this.health, 15)
            }
        }
        if(this.healTimer>0){
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
    move() {
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
        if (this.slowCountdown > 0) {
            this.speed /= 2;
        }
        if (this.speedTimer > 0) {
            this.speed *= 2;
        }
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
        this.x+=this.accelerationX;
        this.y+=this.accelerationY;
        this.accelerationX/=1.05;
        this.accelerationY/=1.05;
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
        if(this.redTimer>0)this.redTimer--;
        this.healTimer--;
        this.checkForCollisions();
    }
    
    Heal(amount){
        this.health=Math.min(this.maxHealth,this.health+amount);
        floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,amount,"lime"));
        this.healTimer=10;
        if (this.isBoss) {
            this.bossBar.Update();
        }
    }
    checkForCollisions() {
        if(this.isBoss && 
            (player.x - player.width / 2) < (this.x + this.width / 2) &&
            (player.x + player.width / 2) > (this.x - this.width / 2) &&
            (player.y - player.height / 2) < (this.y + this.height / 2) &&
            (player.y + player.height / 2) > (this.y - this.height / 2) && this.knockbackIFrame <= 0)
        {
            player.takeDamage(2, this);
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
            if (this.isBoss) player.takeDamage(this.health, this);
            else player.takeDamage(Math.min(5, this.health), this);
            this.dead = true;
            this.giveXP = false;
            if (this.isBoss) {
                this.bossBar.image1.remove();
                this.bossBar.image2.remove();
                this.bossText.remove();
                bossesLeft--;
                if (bossesLeft == 0) {
                    ChangeWave();
                }
            }
        }
    }
    special() {
    }
    takeDamage(bullet) {
        let damage = bullet.damage * player.damageMultiplier;
        this.health -= damage;
        //console.log(this.health);
        if(bullet.frostbite){
            this.slowCountdown=200;
            floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"cyan"));
        }
        else{
            floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"orange"));
        }
        this.redTimer = 10;

        if (this.health <= 0) this.dead = true;
        if (this.isBoss) {
            this.bossBar.Update();
        }
        if (this.dead) {
            if (player.siphon > 0 && this.canSiphon) {
                player.Heal(player.siphon);

            }
            //enemies[index].image.remove();
            if (this.shield) {
                this.shield.dead = true;
            }


        }
    }
    
    AddForce(x, y) {
        if(this.isBoss){
            x/=2;
            y/=2;
        }
        this.accelerationX += x;
        this.accelerationY += y;
    }
    static Spawn(){
        this.spawnCooldown--;
        if(this.spawnCooldown<=0 ){
            this.spawnCooldown = Math.random() * this.randomTimer + this.baseTimer;
            this.spawnCooldown /= 1 + timeElapsed * SCALE;
            //console.log(ENEMYTYPES[0]+" "+this.index)
            const newEnemy = new ENEMYTYPES[this.index](this.speed, this.health);
            enemies[enemies.length] = newEnemy;
        }
    }
}
class BasicEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
    }
}
class LaserBoss extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/laserBoss.webp';
        this.width = 150;
        this.height = 150;

        this.shootTimer = 400;
        this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4
        this.isBoss = true;
        this.value = 500;
        this.image.style.zIndex = 1;

        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Nvidia</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.stage = 0;
        this.stageTimer = 0;
        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;
        this.bossBar = new BossBar(this);
        bossBars.push(this.bossBar);
    }
    timer() {
        this.speedTimer--;
        if (this.stage > 0) {
            if (this.slowCountdown > 0) {
                this.stageTimer += 0.5;
            }
            else {
                this.stageTimer++;
            }
            this.stageTimer+=difficulty*0.2-0.4;
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
            this.shootTimer = 450;
            this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4
            let distanceX = player.x - (this.x);
            let distanceY = player.y - (this.y);

            this.angle = Math.atan2(distanceY, distanceX);
            this.stage = 1;
            enemyBullets.push(new Laser(this.angle + 1.2, this.x, this.y));
            enemyBullets.push(new Laser(this.angle - 1.2, this.x, this.y));
            this.speed = 0;
            this.speedTimer = 375;
            this.speedTimer-=this.speedTimer*(bossMultiplier-1)*0.4
        }
    }
    special() {
        this.timer();
    }
}
class IceBoss extends Enemy {
    /*
    Idea: Frost circle that slows player and slows player bullets
    Ice wall that slowly shrinks over time to force player closer
    */
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/iceBoss.webp';
        this.width = 150;
        this.height = 150;

        this.shootTimer = 350;
        this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4
        this.isBoss = true;
        this.value = 500;
        //console.log(this.image.style.transform+" transofrmer");

        this.frostAura = new Image();
        this.frostAura.src = "images/frostAura.webp";
        this.frostAuraWidth = 750;
        this.frostAuraHeight = 750;

        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Job Application</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        //console.log(bossText.style.transform+" tradsnf");

        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.stage = 0;
        this.stageTimer = 0;

        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;
        this.bossBar = new BossBar(this);
        bossBars.push(this.bossBar);
        
    }
    timer() {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 250;
            this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4

            enemyBullets.push(new Icicle(0, 5, 3, this.x, this.y, 20, 40));
            enemyBullets.push(new Icicle(5, 0, 3, this.x, this.y, 40, 20));
            enemyBullets.push(new Icicle(0, -5, 3, this.x, this.y, 20, 40));
            enemyBullets.push(new Icicle(-5, 0, 3, this.x, this.y, 40, 20));
        }
        if (this.dead) {
            player.slowed = false;
            if (this.frostAura) this.frostAura.remove();
        }
    }
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
        if (this.dead == true) {
            player.slowed = false;
            this.frostAura.remove();
        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.globalAlpha=0.4;
        ctx.drawImage(this.frostAura, this.x - this.frostAuraWidth / 2, this.y - this.frostAuraHeight / 2, this.frostAuraWidth, this.frostAuraHeight);
        ctx.globalAlpha=1; 
        if(this.healTimer>0){
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
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();
        if (RectCircleColliding(this, player, 375, this.x, this.y)) {
            player.slowed = true;
        }
        else {
            player.slowed = false;
        }
        for(let i=0;i<bullets.length;i++){
            if(RectCircleColliding(this, bullets[i], 375, this.x, this.y)){
                bullets[i].slowed=true;
            }
            else{
                bullets[i].slowed=false;
            }
        }
        if (this.dead) {
            player.slowed = false;
            if (this.frostAura) this.frostAura.remove();
        }

    }
}
class BouncyBoss extends Enemy {
    /*
    Idea: Fast but bounces off of walls, gets slightly faster after each bounce
    */
    constructor(speed, health, first) {
        super(speed, health);
        this.first = first;
        this.image.style.zIndex = 1;
        this.image.style.transform = "translate(-50%, -50%)";
        //console.log(this.image.style.transform+" transofrmer");

        this.spawnTimer = 0;
        this.iFrame = 0;
        if (this.first) {
            this.speedX = speed / 1.4;
            this.speedY = speed / 1.4;
            this.image.src = 'images/bouncyBoss.webp';
            this.width = 150;
            this.height = 150;
            this.value = 500;
            this.isBoss = true;
            this.damage = 2;
            this.force = 15;
            this.bossText = document.createElement("div");
            this.bossText.style.position = "absolute"
            this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Legally Distinct Thwomp</div>`
            this.bossText.style.left = (canvas.width / 2-200) + "px";
            this.bossText.style.top = (25 + bossBars.length * 75) + "px";
            this.bossText.style.zIndex = 2;
            this.bossText.style.transform = "translate(-50%, -50%)";
            document.body.appendChild(this.bossText);
            this.ignoreShield=true;
            this.health=Math.ceil(this.health*bossMultiplier);
            this.maxHealth = this.health;
            this.bossBar = new BossBar(this);
            bossBars.push(this.bossBar);
            
        }
        else {
            let angle = Math.random() * Math.PI / 2;
            this.speedX = speed * Math.sin(angle);
            this.speedY = speed * Math.cos(angle);
            this.image.src = 'images/bouncyMinion.webp';
            this.value = 0;
            this.width = 75;
            this.height = 75;
            this.damage = 1;
            this.force = 10;
        }
        if(difficulty==1){
            speed*=0.75;
            this.maxSpeed=10
        }
        else if(difficulty==2){
            speed*=1
            this.maxSpeed=15
        }
        else if(difficulty==3){
            speed*=1.25;
            this.maxSpeed=20
        }
        else{
            speed*=1.5;
            this.maxSpeed=30;
        }
        this.image.style.border = "10px solid blue";

        //console.log(bossText.style.transform+" tradsnf");

    }
    timer() {
    }
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
    }
    move() {
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
        if (this.x < (this.width - 50) / 2) {
            this.x = (this.width - 50) / 2;
            this.speedX *= -1.03;
            this.speedY *= 1.03;
            this.makeClone();
        }
        if (this.y < (this.width - 50) / 2) {
            this.y = (this.width - 50) / 2;
            this.speedX *= 1.03;
            this.speedY *= -1.03;
            this.makeClone();
        }
        if (this.x > canvas.width - (this.width - 50) / 2) {
            this.x = canvas.width - (this.width - 50) / 2;
            this.speedX *= -1.03;
            this.speedY *= 1.03;
            this.makeClone();
        }
        if (this.y > canvas.height - (this.width - 50) / 2) {
            this.y = canvas.height - (this.width - 50) / 2;
            this.speedX *= 1.03;
            this.speedY *= -1.03;
            this.makeClone();
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
        this.image.style.left = this.x + "px";
        this.image.style.top = this.y + "px";

        if (
            (player.x - player.width / 2) < (this.x + this.width / 2) &&
            (player.x + player.width / 2) > (this.x - this.width / 2) &&
            (player.y - player.height / 2) < (this.y + this.height / 2) &&
            (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0 && (!this.first || this.spawnTimer > 120)
        ) {
            player.takeDamage(this.damage, this);
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
        if (this.slowCountdown > 0) {
            this.slowCountdown--;
        }
        else {
            this.image.style.filter = "brightness(100%)";
        }

        if (this.redTimer <= 0) {
            if (this.slowCountdown <= 0) {
                this.image.style.filter = "brightness(100%)";
            }
            else {
                this.image.style.filter = "brightness(50%)";
            }
        }
        else {
            this.image.style.filter = "sepia(100%) saturate(500%) hue-rotate(320deg)";
            this.redTimer--;
        }
        this.iFrame--;
        this.x+=this.accelerationX;
        this.y+=this.accelerationY;
        this.accelerationX/=1.05;
        this.accelerationY/=1.05;
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.strokeStyle = "red";
        if(this.healTimer>0){
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
        ctx.lineWidth=0;

        ctx.restore();
    }
    special() {
        //console.log(this.frostAura.style.left);

    }
    AddForce(){

    }
    makeClone() {
        if (!this.first || this.spawnTimer < 120) return;
        let temp = new BouncyBoss(5, 3, false);
        temp.x = this.x;
        temp.y = this.y;
        enemies.push(temp);
    }
}
class MageBoss extends Enemy {
    /*
    Idea: Frost circle that slows player and slows player bullets
    Ice wall that slowly shrinks over time to force player closer
    */
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/mageWaterMode.webp';
        this.width = 150;
        this.height = 150;

        this.shootTimer = 100;
        this.isBoss = true;
        this.value = 500;
        //console.log(this.image.style.transform+" transofrmer");

        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">The Demonlist</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        //console.log(bossText.style.transform+" tradsnf");

        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.cycle = 0;
        this.attackTimer = 0;

        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;

        this.bossBar = new BossBar(this);
        bossBars.push(this.bossBar);
        
    }
    timer() {
        //console.log(this.attackTimer);
        this.attackTimer--;
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.attackTimer > 0) {
            if (this.cycle == 0 && this.attackTimer % 2 != 0) {
                let distanceX = player.x - this.x;
                let distanceY = player.y-this.y;
                let distance=distanceX * distanceX + distanceY * distanceY;
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
            this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4
            this.cycle++;
            if (this.cycle == 3) this.cycle = 0;
            if (this.cycle == 0) {
                this.attackTimer = 120;
                this.image.src = 'images/mageFireMode.webp';
            }
            else if (this.cycle == 1) {
                this.attackTimer = 120;
                this.image.src = 'images/mageWaterMode.webp';
            }
            else if (this.cycle == 2) {
                this.attackTimer = 2;
                this.image.src = 'images/mageRockMode.webp';
            }
        }
    }
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
    }
    move() {
        super.move();
    }
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();

    }
    takeDamage(a){
        super.takeDamage(a);
        if(this.dead && MagePlayer.unlocked==false){
            MagePlayer.unlocked=true;
            newEnemyQueue.push("images/magePlayer.webp");
            isPlayerUnlocked.push(true);
        }
    }
}
class BulletHellBoss extends Enemy {
    /*
    Idea: cool bullet patterns
    */
    constructor(speed, health) {
        super(speed, health);
        this.maxHealth = health;
        this.image.src = 'images/bulletHellBoss.webp';
        this.width = 135;
        this.height = 135;

        this.shootTimer = 0;
        this.isBoss = true;
        this.value = 500;
        //console.log(this.image.style.transform+" transofrmer");

        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">McAfee</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        //console.log(bossText.style.transform+" tradsnf");

        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.angle = 0;
        this.walkTimer = 600;
        
        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;
        this.bossBar = new BossBar(this);
        bossBars.push(this.bossBar);
        this.loopingShotTimer = 0;
        this.spiralShotTimer = 0;
        this.laserTimer = 0;
        this.ignoreShield=true;
        
    }
    timer() {
        //console.log(this.attackTimer);
        this.attackTimer--;
        this.redTimer--;
        if (this.slowCountdown > 0) {
            this.walkTimer -= 0.5;
            this.loopingShotTimer -= 0.4;
            this.spiralShotTimer -= 0.4;
            this.laserTimer -= 0.4;
        }
        else {
            this.walkTimer-=1;
            this.loopingShotTimer-=0.8;
            this.spiralShotTimer-=0.8;
            this.laserTimer-=0.8;
        }
        if (this.health <= this.maxHealth/3) {
            this.image.src = "images/bulletHellBossEnraged.webp";
            this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">VIRUS DETECTED</div>`

            if (this.slowCountdown > 0) {
                this.loopingShotTimer -= 0.4;
                this.spiralShotTimer -= 0.4;
                this.laserTimer -= 0.4;
            }
            else {
                this.loopingShotTimer-=0.8;
                this.spiralShotTimer-=0.8;
                this.laserTimer-=0.8;
            }
        }
        if (this.walkTimer <= 0) {
            this.speed = 0;
            if (this.loopingShotTimer <= 0) {
                this.loopingShotTimer = 40;
                
                this.loopingShotTimer-=this.loopingShotTimer*(bossMultiplier-1)*0.4

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

                this.spiralShotTimer-=this.spiralShotTimer*(bossMultiplier-1)*0.4
                this.angle += 0.4;
                this.angle %= Math.PI * 2;
                for (let i = 0; i < 4; i++) {

                    let vx = 5 * Math.cos(this.angle);
                    let vy = 5 * Math.sin(this.angle);
                    let temp = new EnemyBullet(vx, vy, 1, this.x, this.y);
                    temp.width = 25;
                    temp.height = 25;
                    temp.image.src = "images/red.webp";
                    enemyBullets.push(temp);
                    this.angle += Math.PI / 2
                }
            }
            if (this.laserTimer <= 0) {
                this.laserTimer = 350;
                this.laserTimer-=this.laserTimer*(bossMultiplier-1)*0.4
                enemyBullets.push(new Laser(0, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI / 2, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI * 1.5, this.x, this.y));

            }

        }

    }
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
    }
    move() {
        let distanceX = Math.abs(this.x - canvas.width / 2);
        let distanceY = Math.abs(this.y - canvas.height / 2);
        if (this.slowCountdown > 0) {
            this.speed /= 2;
        }
        if (distanceX == 0) {
            if (this.y > canvas.width / 2) {
                this.y -= this.speed;
            }
            if (this.y < canvas.height / 2) {
                this.y += this.speed;
            }
        }
        else {
            let angle = Math.atan(distanceY / distanceX);
            if (this.x > canvas.width / 2) {
                this.x -= this.speed * Math.cos(angle);
            }
            if (this.y > canvas.height / 2) {
                this.y -= this.speed * Math.sin(angle);
            }
            if (this.x < canvas.width / 2) {
                this.x += this.speed * Math.cos(angle);
            }
            if (this.y < canvas.height / 2) {
                this.y += this.speed * Math.sin(angle);
            }
            //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
        }
        if(this.slowCountdown>0){
            this.speed*=2;
        }

        this.x+=this.accelerationX;
        this.y+=this.accelerationY;
        this.accelerationX/=1.05;
        this.accelerationY/=1.05;
        super.checkForCollisions();
    }
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();

    }
    AddForce(){

    }
}

//First Tier 2 Boss
class GambleBoss extends Enemy {
    /*
    Idea: gambling
    */
    constructor(speed, health) {
        super(speed, health);
        this.maxHealth = health;
        this.image.src = 'images/gambleBoss.webp';
        this.width = 150;
        this.height = 150;

        this.shootTimer = 0;
        this.isBoss = true;
        this.value = 500;
        //console.log(this.image.style.transform+" transofrmer");

        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Random Seed Glitchless</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        //console.log(bossText.style.transform+" tradsnf");

        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        
        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;

        this.bossBar = new BossBar(this);
        bossBars.push(this.bossBar);
        this.shootTimer=0;
        this.gambleTimer=60;
        this.currentGamble=0;
        this.laserTimer=-60;
        this.angle=0;
        
    }
    timer() {
        //console.log(this.attackTimer);
        this.redTimer--;
        this.gambleTimer--;
        this.laserTimer--;
        this.randomStuffTimer--;
        if (this.slowCountdown > 0) {
            this.walkTimer -= 0.5;
            this.shootTimer-=0.5;
        }
        else {
            this.walkTimer--;
            this.shootTimer--;
        }
        if(this.shootTimer<=0){
            this.gambleTimer=90;
            this.shootTimer=300;
        }
        if(this.gambleTimer>20 && this.gambleTimer%3==0){
            this.Gamble();
        }
        let distanceX = player.x - this.x;
        let distanceY = player.y - this.y;
        let distance = distanceX * distanceX + distanceY * distanceY;
        let vx = 0;
        let vy = 0;
        if(this.gambleTimer==0){
            switch(this.currentGamble){
                case 1:

                    if (distance > 0) {
                        let angle = 0
                        for (let i = 0; i < 32; i++) {
                            vx = 10 * Math.cos(angle);
                            vy = 10 * Math.sin(angle);
                            console.log(vx+" "+vy)
                            enemyBullets.push(new EnemyBullet(vx, vy,1, this.x, this.y))
                            angle += Math.PI/16;
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
                            let temp=new HomingBullet(vx/2, vy/2, 2, this.x, this.y);
                            temp.speedX=vx/2;
                            temp.speedY=vy/2;
                            enemyBullets.push(temp)
                            
                            angle += 0.4;
                        }
                        angle = Math.atan2(distanceY, distanceX);
                        angle -= 0.9;
                        for (let i = 0; i < 3; i++) {
                            vx = 5 * Math.cos(angle);
                            vy = 5 * Math.sin(angle);
                            let temp=new BlackHole(1,this.x, this.y,vx/2, vy/2);
                            temp.speedX=vx/2;
                            temp.speedY=vy/2;
                            enemyBullets.push(temp)
                            
                            angle += 0.6;
                        }
                    }
                    break;
                case 3:
                    let enemy1=new WindupEnemy(2,20);
                    enemy1.x=this.x+Math.random()*60;
                    enemy1.y=this.y+Math.random()*60;
                    enemies.push(enemy1);
                    let enemy2=new BuilderEnemy(1.5,12);
                    enemy2.x=this.x+Math.random()*60;
                    enemy2.y=this.y+Math.random()*60;
                    enemies.push(enemy2);
                    let enemy3=new SpawnerEnemy(1.5,25);
                    enemy3.x=this.x+Math.random()*60;
                    enemy3.y=this.y+Math.random()*60;
                    enemies.push(enemy3);
                    
                    break;
                case 4:
                    this.laserTimer=121;
                    break;
                case 5:
                    this.randomStuffTimer=121;
            }
        }
        if(this.laserTimer>-60 || this.randomStuffTimer>-60){
            this.speed=0;
        }
        else{
            this.speed=2;
        }
        if(this.laserTimer%5==1 && this.laserTimer>0){
            
            enemyBullets.push(new Laser(this.angle, this.x, this.y));
            this.angle+=Math.PI/12;
        }
        if(this.randomStuffTimer>0 && this.randomStuffTimer%3==0){

            if (distance > 0) {
                let angle = Math.atan2(distanceY, distanceX);
                angle+=Math.random()*1.5-0.75;
                let random=Math.ceil(Math.random()*6);
                vx=10*Math.cos(angle);
                vy=10*Math.sin(angle);
                switch(random){
                    case 1:
                        enemyBullets.push(new EnemyBullet(2, this.x, this.y, vx, vy))
                        break;
                    case 2:
                        enemyBullets.push(new HomingBullet(2, this.x, this.y, vx/2, vy/2))
                        break;
                    case 3:
                        enemyBullets.push(new PoisonBomb(this.x, this.y, vx/2, vy/2))
                        break;
                    case 4:
                        enemyBullets.push(new BlackHole(1, this.x, this.y, vx/2, vy/2))
                        break;
                    case 5:
                        enemyBullets.push(new Laser(angle, this.x, this.y));
                        break;
                    case 6:
                        enemyBullets.push(new BigRock(1, this.x, this.y, vx/2, vy/2));
                        break;


                }
            }
        }
    

    }
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
    }
    move() {
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
        if (this.slowCountdown > 0) {
            this.speed /= 2;
        }
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

        super.checkForCollisions();
    }
    Gamble(){
        let randomNum=Math.ceil(Math.random()*100);
        switch(difficulty){
            case 1:
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
            case 2:
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
            case 3:
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
            case 4:
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
        if(this.healTimer>0){
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
        if(this.gambleTimer>-60){

            switch(this.currentGamble){
                case 1:
                    ctx.fillStyle="white";
                    break;
                case 2:
                    ctx.fillStyle="green";
                    break;
                case 3:
                    ctx.fillStyle="blue";
                    break;
                case 4:
                    ctx.fillStyle="purple";
                    break;
                case 5:
                    ctx.fillStyle="yellow";
                    break;
            }
            ctx.fillRect(this.x-20, this.y-20, 40, 40);
        }
        ctx.restore();

    }
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();
        this.image.style.left = (this.x) + "px";
        this.image.style.top = (this.y) + "px";

    }
}
class SnakeBoss extends Enemy {
    /*
    idea: snake from slither.io. it is split into multiple sections with each section following the head. the head is the only part that can be damaged. other parts knockback the player if they collide. can occasionally get a speed boost

    */
    static segments=[];
    static spawnX;
    static spawnY;
    static delayX=[];
    static delayY=[];
    static count;
    constructor(speed, health, isLeader, bodyCount) {
        super(speed, health);
        this.width = 100;
        this.height = 100;
        this.isLeader=isLeader;
        this.shootTimer = 100;
        
        
        if(this.isLeader){
            SnakeBoss.spawnX=this.x;
            SnakeBoss.spawnY=this.y;
            SnakeBoss.segments=[];
            SnakeBoss.delayX=[];
            SnakeBoss.delayY=[];
            SnakeBoss.count=bodyCount;
            this.image.src = 'images/snakeBoss.webp';
            this.isBoss = true;
            this.value = 500;
            this.bossText = document.createElement("div");
            this.bossText.style.position = "absolute"
            this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Slither.io</div>`
            this.bossText.style.left = (canvas.width / 2-200) + "px";
            this.bossText.style.top = (25 + bossBars.length * 75) + "px";
            this.bossText.style.zIndex = 2;
            this.bossText.style.transform = "translate(-50%, -50%)";
            document.body.appendChild(this.bossText);
            this.bossBar = new BossBar(this);
            bossBars.push(this.bossBar);
        }
        else{
            SnakeBoss.count--;
            this.hasHealthBar=false;
            this.image.src = 'images/snakeBody.webp';
            this.isBoss = false;
            this.value = 0;
            this.x=SnakeBoss.spawnX;
            this.y=SnakeBoss.spawnY;
        }
        //console.log(this.image.style.transform+" transofrmer");

        
        //console.log(bossText.style.transform+" tradsnf");

        //console.log(this.shootTimer);
        this.cycle = 0;
        this.attackTimer = 0;

        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;

        this.bodyCount=bodyCount;
        this.spawnDelay=20;
        this.previousSegment=null;
        this.delay=(59-bodyCount)*20;
        this.iFrame=0;
        this.explodeTimer=0;
        SnakeBoss.segments.push(this);
        
    }
    timer(){
        this.spawnDelay--;
        this.iFrame--;
        this.explodeTimer--;
        if(this.explodeTimer>0){
            this.width-=3;
            this.height-=3;
        }
        else if(this.explodeTimer==0){
            this.dead=true;
        }
        if(this.spawnDelay==0 && this.bodyCount>0 && SnakeBoss.count>0){
            let temp=new SnakeBoss(2.5, 1,false, this.bodyCount-1);
            temp.previousSegment=this;
            this.nextSegment=temp;
            enemies.push(temp)
        }
    }
    async takeDamage(bullet, index) {
        if(this.isLeader){
            super.takeDamage(bullet, index);
            while(this.health<this.bodyCount*6){
                if(SnakeBoss.segments.length<=this.bodyCount){
                    SnakeBoss.count--;
                    this.bodyCount--;
                }
                else{

                    SnakeBoss.segments[this.bodyCount].Explode();
                    this.bodyCount--;
                }
            }
        }
    }
    move() {
        if(this.explodeTimer>0){
            return;
        }
        if(this.isLeader){
            let distanceX = Math.abs(this.x - player.x);
            let distanceY = Math.abs(this.y - player.y);
            let vx=0;
            let vy=0;
            if (distanceX == 0) {
                if (this.y > player.y) {
                    vx=-this.speed;
                    this.y -= this.speed;
                }
                if (this.y < player.y) {
                    vx=this.speed;
                    this.y += this.speed;
                }
            }
            else {
                let angle = Math.atan(distanceY / distanceX);
                if (this.x > player.x) {
                    vx=-this.speed * Math.cos(angle);
                    this.x -= this.speed * Math.cos(angle);
                }
                if (this.y > player.y) {
                    vy=-this.speed* Math.sin(angle);
                    this.y -= this.speed * Math.sin(angle);
                }
                if (this.x < player.x) {
                    vx=this.speed* Math.cos(angle);
                    this.x += this.speed * Math.cos(angle);
                    
                }
                if (this.y < player.y) {
                    vy=this.speed* Math.sin(angle);
                    this.y += this.speed * Math.sin(angle);
                }
                //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
            }
            if(this.redTimer>0)this.redTimer--;
            SnakeBoss.delayX.splice(1, 0, this.x);
            SnakeBoss.delayY.splice(1,0,this.y);
            if(SnakeBoss.delayX.length>80*20){
                SnakeBoss.delayX.splice(SnakeBoss.delayX.length-1,1);
                SnakeBoss.delayY.splice(SnakeBoss.delayY.length-1,1);
            }
            this.checkForCollisions();
            //console.log(this.redTimer);
        }
        else{
            this.x=SnakeBoss.delayX[this.delay];
            this.y=SnakeBoss.delayY[this.delay];
            this.checkForCollisions();

        }
    }
    checkForCollisions(){
        
        if (this.iFrame<=0 && RectCircleColliding(this, player, this.width / 2, this.x, this.y)) {
        
            let angle=Math.atan2((player.y-this.y),(player.x-this.x));
            player.AddForce(15*Math.cos(angle), 15*Math.sin(angle));
            player.takeDamage(2, this);
            this.iFrame = 15;
        }
    }
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();

    }
    Explode(){
        this.explodeTimer=30;
    }
    draw(){
        ctx.strokeStyle = "blue";
        ctx.lineWidth=5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
        ctx.stroke();
        if(this.isLeader){

            let angle=Math.atan2((player.y-this.y),(player.x-this.x));
            if (this.dead) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle+Math.PI/2);
            if (this.redTimer > 0) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(this.image, -this.width / 2,  -this.height / 2, this.width, this.height);
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
                ctx.beginPath();
                ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
                ctx.fill();
            }
            else if (this.slowCountdown > 0) {
                ctx.drawImage(this.image, - this.width / 2, -this.height / 2, this.width, this.height);
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.beginPath();
                ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
                ctx.fill();
            }
            else {
                ctx.drawImage(this.image,  -this.width / 2, -this.height / 2, this.width, this.height);
            }

            ctx.restore();
        }
        else{
            super.draw();
        }
    }
}
class HealerBoss extends Enemy {
    /*
    Idea: Heals self and enemies in a circle around it every time it deals damage
    */
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/healingBoss.webp';
        this.width = 150;
        this.height = 150;

        this.shootTimer = 60;
        this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4
        this.isBoss = true;
        this.value = 500;
        //console.log(this.image.style.transform+" transofrmer");


        this.healAura = new Image();
        this.healAuraWidth = 750;
        this.healAuraHeight = 750;
        this.healAura.src="images/healAura.webp"
        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">The Database</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        //console.log(bossText.style.transform+" tradsnf");

        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.isHealing=false;
        this.healAbilityTimer=1200;
        this.stopTimer=0;
        this.healCooldown=15-15*(bossMultiplier-1)*0.4;
        this.healCooldown=Math.round(this.healCooldown);

        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;
        this.bossBar = new BossBar(this);
        bossBars.push(this.bossBar);
        
    }
    timer() {
        this.stopTimer--;
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
            this.healAbilityTimer-=0.5;
        }
        else {
            this.shootTimer--;
            this.healAbilityTimer--;
        }
        if (this.shootTimer <= 0 && this.isHealing==false) {
            this.shootTimer = 160;
            this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4;
            enemyBullets.push(new HealerBossBullet(0,0,1,this.x+75,this.y+75,this));
            enemyBullets.push(new HealerBossBullet(0,0,1,this.x-75,this.y+75,this));
            enemyBullets.push(new HealerBossBullet(0,0,1,this.x+75,this.y-75,this));
            enemyBullets.push(new HealerBossBullet(0,0,1,this.x-75,this.y-75,this));
            
        }
        //console.log(this.healCooldown)
        if(this.stopTimer>0 && this.stopTimer%this.healCooldown==0){
            this.Heal(1);
        }
        if(this.stopTimer<=0 && this.isHealing){
            this.isHealing=false;
            this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">The Database</div>`
            this.image.src = "images/healingBoss.webp";
        }
        if(this.healAbilityTimer<=0){
            this.stopTimer=360;
            this.healAbilityTimer=1200;
            this.isHealing=true;
            this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Healing...</div>`
            this.image.src="images/healingBossHeal.webp";
        }
        if(this.isHealing){
            this.speed=0;
        }
        else{
            this.speed=1.5;
        }
    }
    move(){
        super.move();
    }
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
    }
    HealAll(){

        for(let i=0;i<enemies.length;i++){
            if(RectCircleColliding(this, enemies[i], 375, this.x, this.y)){
                enemies[i].Heal(1);
            }
        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();        
        ctx.globalAlpha=0.4;
        ctx.fillStyle="lightgreen"
        if(this.healTimer>0 && this.isHealing==false){
            ctx.drawImage(this.healAura, this.x - this.healAuraHeight / 2, this.y - this.healAuraHeight / 2, this.healAuraWidth, this.healAuraHeight);
        }
        ctx.drawImage(this.healAura, this.x - this.healAuraHeight / 2, this.y - this.healAuraHeight / 2, this.healAuraWidth, this.healAuraHeight);
        ctx.globalAlpha=1; 
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        if(this.healTimer>0 && this.isHealing==false){
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
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();

    }
}
// class CodingBoss extends Enemy {
//     /*
//     Idea: cool bullet patterns
//     */
//     constructor(speed, health) {
//         super(speed, health);
//         this.maxHealth = health;
//         this.image.src = 'images/bulletHellBoss.webp';
//         this.width = 135;
//         this.height = 135;

//         this.shootTimer = 300;
//         this.isBoss = true;
//         this.value = 500;
//         //console.log(this.image.style.transform+" transofrmer");

//         this.bossText = document.createElement("div");
//         this.bossText.style.position = "absolute"
//         this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">McAfee</div>`
//         this.bossText.style.left = (canvas.width / 2-200) + "px";
//         this.bossText.style.top = (25 + bossBars.length * 75) + "px";
//         this.bossText.style.zIndex = 2;
//         this.bossText.style.transform = "translate(-50%, -50%)";
//         //console.log(bossText.style.transform+" tradsnf");

//         document.body.appendChild(this.bossText);
//         //console.log(this.shootTimer);
        
//         this.health=Math.ceil(this.health*bossMultiplier);
//         this.maxHealth = this.health;
//         this.bossBar = new BossBar(this);
//         bossBars.push(this.bossBar);
//         this.currentAttack=0;
        
//     }
//     timer() {
//         //console.log(this.attackTimer);
//         this.redTimer--;
//         if (this.slowCountdown > 0) {
//             this.shootTimer-=0.5;
//         }
//         else {
//             this.shootTimer--;
//         }
//         if(this.shootTimer<=0){
//             this.shootTimer=300;
//             this.currentAttack=Math.ceil(Math.random()*1);
//         }
//         switch(this.currentAttack){
//             case 1:

//                 break;
//         }

//     }
//     takeDamage(bullet, index) {
//         super.takeDamage(bullet, index);
//     }
//     move() {
//         super.move();
//     }
//     special() {
//         //console.log(this.frostAura.style.left);
//         this.timer();
//     }
// }

class ShooterEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/shooterEnemy.webp';
        this.shootTimer = 30;
        this.order = 1;
        this.value = 30;
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
            this.shootTimer = 60;
            if (this.order == 1) {
                this.order = -1;
                enemyBullets[enemyBullets.length] = new EnemyBullet(5, 0, 1, this.x, this.y);
                enemyBullets[enemyBullets.length] = new EnemyBullet(-5, 0, 1, this.x, this.y);
            }
            else {
                this.order = 1;
                enemyBullets[enemyBullets.length] = new EnemyBullet(0, 5, 1, this.x, this.y);
                enemyBullets[enemyBullets.length] = new EnemyBullet(0, -5, 1, this.x, this.y);
            }
        }
    }
    special() {
        this.timer();
    }
}
class ChargingEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/chargingEnemy.webp';
        this.shootTimer = 100;
        this.order = 1;
        this.width = 50;
        this.height = 50;
        this.value = 80;
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
            this.image.src = 'images/chargingEnemySpecial.webp';
        }
        if (this.chargeTimer <= 0) {
            this.speed = 1;
            this.image.src = 'images/chargingEnemy.webp';
        }
        this.redTimer--;
        this.chargeTimer--;

    }
    move() {
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
                this.x += this.vx;
                this.y += this.vy;
            }

            if (this.slowCountdown > 0) {
                this.x += this.vx / 2;
                this.y += this.vy / 2;
            }
            else {
                this.x += this.vx;
                this.y += this.vy;
            }
        }
        this.x+=this.accelerationX;
        this.y+=this.accelerationY;
        this.accelerationX/=1.05;
        this.accelerationY/=1.05;

        super.checkForCollisions();
    }
    special() {
        this.timer();
    }
}
class AimingEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/aimingEnemy.webp';
        this.shootTimer = 45;
        this.value = 30;
        this.order = 1;
        //console.log(this.shootTimer);
    }
    special() {
        this.timer();
    }
    timer() {
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
            enemyBullets[enemyBullets.length] = new EnemyBullet(bulletvX, bulletvY, 1, this.x, this.y);
            enemyBullets[enemyBullets.length] = new EnemyBullet(bulletvX2, bulletvY2, 1, this.x, this.y);
            enemyBullets[enemyBullets.length] = new EnemyBullet(bulletvX3, bulletvY3, 1, this.x, this.y);
        }
    }

}

class HomingEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/homingEnemy.webp';
        this.shootTimer = 60;
        this.value = 30;
        this.order = 1;
        //console.log(this.shootTimer);
    }
    special() {
        this.timer();
    }
    timer() {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = 120;
            enemyBullets[enemyBullets.length] = new HomingBullet(0, 5, 2, this.x, this.y);
        }
    }
    move() {
        super.move();
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
        const distance = Math.hypot(distanceX, distanceY);
        //console.log(this.dead);
        if (distance < 300 && this.dead==false) {
            this.speed = 0;
        }
        else {
            this.speed = 3;
        }
    }
}
class ShieldEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/shieldEnemy.webp';
        this.order = 1;
        this.value = 80;
        this.width = 100;
        this.height = 100;
        this.shield = new EnemyShield(0, 1000, this);
        enemies.push(this.shield);
        this.constructor.baseTimer=900;
        this.constructor.randomTimer=750;
        this.constructor.index=6;
        this.constructor.health=15;
        this.constructor.speed=1.5;
        //console.log(this.shootTimer);
    }
    timer() {
    }
    move() {
        super.move();
        if (this.dead || this.health <= 0) this.shield.dead = true;
    }
    special() {
        this.timer();
    }
}
class EnemyShield extends Enemy {
    constructor(speed, health, owner) {
        super(speed, health);
        this.image.src = 'images/shield.webp';
        this.shootTimer = 30;
        this.order = 1;
        this.value = 30;
        this.damage=0;
        this.owner = owner;
        this.x = owner.x;
        this.y = owner.y;
        this.ignoreShield=true;
        this.width=150;
        this.height=150;
        this.hasHealthBar=false;
        this.giveXP=false;
        if (this.x < -90) {
            this.offsetX = 60;
            this.offsetY = 0;
            this.width = 100;
        }
        if (this.x > canvas.width + 90) {
            this.offsetX = -60;
            this.offsetY = 0;
            this.width = 100;
        }
        if (this.y < -90) {
            this.image.src = 'images/shieldRotated.webp';
            this.offsetX = 0;
            this.offsetY = 60;
            this.height = 100;
        }
        if (this.y > canvas.height + 90) {
            this.image.src = 'images/shieldRotated.webp';
            this.offsetX = 0;
            this.offsetY = -60;
            this.height = 100;
        }
        //console.log(this.shootTimer);
    }
    move() {
        this.x = this.owner.x + this.offsetX;
        this.y = this.owner.y + this.offsetY;
    }
    takeDamage(bullet, index) {
        floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,0,"gray"));

    }
}
class TrapperEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/trapperEnemy.webp';
        this.shootTimer = 30;
        this.order = 1;
        this.value = 30;
        this.constructor.baseTimer=400;
        this.constructor.randomTimer=400;
        this.constructor.index=4;
        this.constructor.health=4;
        this.constructor.speed=3;
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
            this.shootTimer = 50;
            enemyBullets.push(new EnemyTrap(1, this.x, this.y, 40, 40));
        }
    }
    special() {
        this.timer();
    }
}
class ZombieEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/zombieEnemy.webp';
        this.shootTimer = 30;
        this.order = 1;
        this.value = 30;
        this.deathCount = 0;
        this.deathTimer = 0;
        this.originalHealth = health;
        //console.log(this.shootTimer);
    }
    timer() {
        this.deathTimer--;
        if (this.deathTimer == 0) {
            this.ignoreBullets = false;
            this.health = this.originalHealth;
            this.image.src = "images/zombieEnemy.webp";
        }
    }
    special() {
        this.timer();
    }
    move() {
        if (this.deathTimer <= 0) {
            super.move();
        }
        else{   
            this.redTimer--;
        }
    }
    takeDamage(bullet, index) {
        let damage = bullet.damage * player.damageMultiplier;
        this.health -= damage;
        //console.log(this.health);
        
        if(bullet.frostbite){
            this.slowCountdown=200;
            floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"cyan"));
        }
        else{
            floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"orange"));
        }

        this.redTimer = 10;

        if (this.health <= 0) this.dead = true;
        if (this.dead && this.deathCount < 3) {
            this.dead = false;
            this.image.src = "images/deadZombie.webp";
            this.deathTimer = 300;
            this.health=0;
            this.deathCount++;
            this.ignoreBullets = true;
            this.image.style.filter = this.savedColor;
        }

        if (this.dead) {
            if (player.siphon > 0) {
                player.Heal(player.siphon)

            }
            if (this.isBoss) {
                bossBar.image1.remove();
                bossBar.image2.remove();
                if (this.frostAura) {
                    player.slowed = false;
                    this.frostAura.remove();
                }
                if (this.shield) {
                    this.shield.remove();
                    this.shield.parentNode.removeChild(image);
                }
                if (document.getElementById("bossTitle")) document.getElementById("bossTitle").remove();
            }
            if (enemies[index] && enemies[index].image) {
                enemies[index].image.remove();
                if (enemies[index].shield) {
                    enemies[index].shield.image.remove();
                    enemies[index].shield.dead = true;
                }
            }

        }
    }
}
class GhostEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/ghostEnemy.webp';
        this.shootTimer = 0;
        this.order = 1;
        this.value = 80;
        this.ghostTimer = 0;
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
            this.image.style.opacity = "1";
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
    draw() {
        if (this.dead) return;
        ctx.save();
        if(this.ignoreBullets){
            ctx.globalAlpha = 0.5;
        }
        
        if(showHealthBars){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, this.width*1.5, 15)
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, (this.width*1.5)/this.maxHealth*this.health, 15)
        }
        
        if(this.healTimer>0){
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
        ctx.globalAlpha = 1.0;

        ctx.restore();
    }
}
class PoisonEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/poisonEnemy.webp';
        this.shootTimer = 120;
        this.order = 1;
        this.value = 80;
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
    special() {
        this.timer();
    }
}
class BlackHoleEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/blackHoleEnemy.webp';
        this.shootTimer = 120;
        this.order = 1;
        this.value = 80;
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
    special() {
        this.timer();
    }
}
class BuilderEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/builderEnemy.webp';
        this.shootTimer = 120;
        this.order = 1;
        this.width = 75;
        this.height = 75;
        this.value = 150;
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
    special() {
        this.timer();
    }
}
class EnemyWall extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.image.src = 'images/enemyWall.webp';
        this.order = 1;
        this.value = 0;
        this.damage=0;
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 200;
        this.hasHealthBar=false;
        this.image.style.zIndex = -1;
        this.canSiphon = false;
        this.giveXP=false;
        //console.log(this.shootTimer);
    }
    special(){
        this.timer();
    }
    timer(){
        this.redTimer--;
    }
    move() {
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
class WindupEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/windupEnemy.webp';
        this.shootTimer = 200;
        this.chargeTimer = -1;
        this.order = 1;
        this.width = 50;
        this.height = 50;
        this.value = 150;
        this.orb;
        //console.log(this.shootTimer);
    }
    move() {
        let savedSpeed = this.speed;
        if (this.shootTimer > 200) {
            this.speed = 0;
        }
        super.move();
        this.speed = savedSpeed;
        if (this.x > player.x) {
            this.image.style.transform = "scaleX(-1)";
        }
        else {
            this.image.style.transform = "scaleX(1)";
        }
    }
    timer() {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0 && this.chargeTimer < 0) {
            this.shootTimer = 800;
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
            enemies.push(this.orb)
        }
    }
    special() {
        this.timer();
    }
    takeDamage(a, b) {
        super.takeDamage(a, b);
        if (this.dead && this.shootTimer > 200) {
            this.orb.dead = true;
        }
    }
}
class SpawnerEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/spawnerEnemy.webp';
        this.shootTimer = 400;
        this.order = 1;
        this.width = 100;
        this.height = 100;
        this.value = 150;
        this.spawnerPoints = 0;
        this.spawnerTimer = 0;
        this.releaseTimer = 0;
        this.releasing = false;
        //console.log(this.shootTimer);
    }
    move() {
        if (this.shootTimer <= 0 && this.speed > 0) {
            this.speed = 0;
            this.image.src = "images/spawner.webp";
        }
        if (this.spawnerTimer <= 0 && this.shootTimer <= 0 && !this.releasing) {
            this.spawnerPoints++;
            this.spawnerTimer = 80;
            let upgradeIndicator = new Image();
            upgradeIndicator.src = "images/spawnerUpgrade.webp"
            floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,upgradeIndicator, "red"));

        }

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
        if (!this.releasing) super.move();
    }
    timer() {
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
    special() {
        this.timer();
    }
    takeDamage(a, b) {
        super.takeDamage(a, b);
        if (this.dead && this.shootTimer <= 0) {
            this.dead = false;
            this.image.src = "images/spawnPortal.webp";
            this.releasing = true;
            this.ignoreBullets = true;
        }
    }
}
class MimicEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/xpBag.webp';
        this.shootTimer = 120;
        this.order = 1;
        this.width = 50;
        this.height = 50;
        this.value = 80;
        this.targetX = Math.random() * (canvas.width - canvas.width / 10) + canvas.width / 20;
        this.targetY = Math.random() * (canvas.height - canvas.height / 10) + canvas.height / 20;
        this.moveTimer = 240;
        this.trollTimer = -1;
        //console.log(this.shootTimer);
    }
    timer() {
        this.trollTimer--;
        this.redTimer--;
    }
    special() {
        this.timer();
    }
    move() {
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
            super.checkForCollisions();
        }
        if (this.dead) {
            this.hasHealthBar=false;
            this.dead = false;
            this.health=0;
            this.image.src = "images/mimicEnemyDead.webp"
            this.trollTimer = 60;
            this.ignoreBullets = true;
            this.image.style.filter = "brightness(100%)";
        }
        if (this.trollTimer == 0) {
            this.dead = true;
        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        if(showHealthBars && this.hasHealthBar && this.health<this.maxHealth){
            this.health=Math.max(this.health,0);
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, this.width*1.5, 15)
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, (this.width*1.5)/this.maxHealth*this.health, 15)
        }
        
        if(this.healTimer>0){
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
    takeDamage(a,b){
        super.takeDamage(a,b);
        if (this.dead) {
            this.dead = false;
            this.image.src = "images/mimicEnemyDead.webp"
            this.trollTimer = 60;
            this.ignoreBullets = true;
            this.image.style.filter = "brightness(100%)";
        }
    }
}
class SelfDestructEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/selfDestructEnemy.webp';
        this.shootTimer = 120;
        this.width = 75;
        this.height = 75;
        this.scale=75;
        this.value = 150;
        this.exploding=false;
        this.explodeTimer=0;
        this.iFrame=0;
        //console.log(this.shootTimer);
    }
    timer() {
        this.iFrame--;
        if(this.explodeTimer>0 && this.explodeTimer%140==1){
            let angle=0;
            for (let i = 0; i < 8; i++) {
                let vx = 10 * Math.cos(angle);
                let vy = 10 * Math.sin(angle);
                //console.log(vx+" "+vy)
                let temp=new EnemyBullet(vx, vy,1, this.x, this.y);
                temp.width=20;
                temp.height=20;
                temp.image.src= 'images/enemyBullet.webp'
                enemyBullets.push(temp);
                angle += Math.PI/4;
            }
        }
    }
    special() {
        this.timer();
        this.speed=6.5-this.health/4;
    }
    takeDamage(a, b){
        super.takeDamage(a, b);
        if(this.dead){
            this.SelfDestruct();
        }
        if(this.exploding && this.explodeTimer<0){
            this.dead=true;
        }
    }
    move(){
        if(this.exploding==false){
            super.move();
            if(this.dead){
                this.SelfDestruct();
            }
        }
        else{
            this.explodeTimer--;
            if (this.iFrame <= 0 && RectCircleColliding(this, player, this.width / 2, this.x, this.y)) {
                player.takeDamage(1, this);
                this.iFrame = 30;

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
    SelfDestruct(){
        this.dead=false;
        this.exploding=true;
        this.hasHealthBar=false;
        this.image.src='images/explosion.webp';
        this.redTimer=-1;
        this.slowCountdown=-1;
        this.ignoreBullets=true;
        this.explodeTimer=422;
    }
}
class MachineGunEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/machineGunEnemy.webp';
        this.shootTimer = 30;
        this.order = 1;
        this.value = 150;
        this.width=100;
        this.height=100;    
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
            let temp=new EnemyBullet(vx, vy, 1, this.x, this.y );
            temp.width=40;
            temp.height=40;
            temp.image.src="images/machineGunBullet.webp";
            enemyBullets.push(temp)
        }
    }
    special() {
        this.timer();
    }
        
    move() {
        super.move();
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
        const distance = Math.hypot(distanceX, distanceY);
        if (distance < 400 && this.dead==false) {
            this.speed = 0;
        }
        else {
            this.speed = 3;
        }
    }
    
    draw(){
        let angle=Math.atan2((player.y-this.y),(player.x-this.x));
        if (this.dead) return;
        ctx.save();
        if(showHealthBars){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, this.width*1.5, 15)
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, (this.width*1.5)/this.maxHealth*this.health, 15)
        }
        ctx.translate(this.x, this.y);
        ctx.rotate(angle-Math.PI/4)
        if (this.redTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, -this.width / 2,  -this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
            ctx.beginPath();
            ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
        else if (this.slowCountdown > 0) {
            ctx.drawImage(this.image, - this.width / 2, -this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
        else {
            ctx.drawImage(this.image,  -this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }
}
class SmokeBombEnemy extends Enemy {

    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/smokeBombEnemy.webp';
        this.width = 100;
        this.height = 100;

        this.isMoving=true;
        this.isExpanding=false;
        this.targetX = Math.random() * (canvas.width - canvas.width / 10) + canvas.width / 20;
        this.targetY = Math.random() * (canvas.height - canvas.height / 10) + canvas.height / 20;

        //console.log(this.shootTimer);

        this.speedAura = new Image();
        this.speedAura.src = "images/smoke.webp";
        this.speedAuraWidth = 75;
        this.speedAuraHeight =75;
        this.health=health;
        this.iFrame=0;

    }
    
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
    }
    move() {
        this.iFrame--;
        this.redTimer--;
        this.slowCountdown--;
        if (this.isMoving) {
            let distanceX = Math.abs(this.x - this.targetX);
            let distanceY = Math.abs(this.y - this.targetY);
            if(distanceX*distanceX+distanceY*distanceY<10){
                this.isMoving=false;
                this.isExpanding=true;
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
        if(this.isExpanding && this.speedAuraHeight<1000){
            this.speedAuraWidth+=1;
            this.speedAuraHeight+=1;
        }

        if (
            (player.x - player.width / 2) < (this.x + this.width / 2) &&
            (player.x + player.width / 2) > (this.x - this.width / 2) &&
            (player.y - player.height / 2) < (this.y + this.height / 2) &&
            (player.y + player.height / 2) > (this.y - this.height / 2) && this.iFrame <= 0 
        ) {
            player.takeDamage(2, this);
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
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        //ctx.globalAlpha=0.4;
        if(!this.moving) ctx.drawImage(this.speedAura, this.x - this.speedAuraWidth / 2, this.y - this.speedAuraHeight / 2, this.speedAuraWidth, this.speedAuraHeight);
        if(showHealthBars){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, this.width*1.5, 15)
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - this.width / 2-this.width/4, this.y - this.height, (this.width*1.5)/this.maxHealth*this.health, 15)
        }

        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
//ctx.globalAlpha=1; 
        if(this.healTimer>0){
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
    special() {
        //console.log(this.frostAura.style.left);
        // for(let i=0;i<enemies.length;i++){
        //     if (RectCircleColliding(this, enemies[i], 175, this.x, this.y)) {
        //         enemies[i].speedTimer=30;
        //     }
        // }

    }
}

/*
^ ENEMIES

v PLAYER BULLETS
*/


class Bullet {
    constructor(speedX, speedY, damage) {
        this.image = new Image();
        this.image.src = 'images/bullet.webp';
        this.speedX = speedX;
        this.speedY = speedY;
        this.x = player.x;
        this.y = player.y;
        this.damage = damage;
        this.width = 10;
        this.height = 10;
        this.width*=player.projectileSizeMultiplier;
        this.height*=player.projectileSizeMultiplier;
        // console.log(player.projectileSizeMultiplier)
        // console.log(this.width)
        this.frostbite = false;
        this.slowed = false;
    }
    move() {
        if (this.slowed) {
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
                enemies[i].takeDamage(this);
                this.dead = true;
            }
        }
        if (this.x < -100 || this.y < -100 || this.x > canvas.width + 100 || this.y >= canvas.height + 100) {
            this.dead = true;
        }
    }
    
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        

        ctx.restore();
    }
}
class FrostBullet extends Bullet {
    constructor(speedX, speedY, damage) {
        super(speedX, speedY, damage);
        this.width = 20;
        this.height = 20;
        this.width*=player.projectileSizeMultiplier;
        this.height*=player.projectileSizeMultiplier;
        this.image.src = "images/frostProjectile.webp";
        this.frostbite = true;
        this.hitEnemies = new Set();
    }
    move(){
        if (this.slowed) {
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
                enemies[i].takeDamage(this);
                this.hitEnemies.add(enemies[i]);
            }
        }
        if (this.x < -100 || this.y < -100 || this.x > canvas.width + 100 || this.y >= canvas.height + 100) {
            this.dead = true;
        }
    }
}
class PlayerLaser extends Bullet {
    constructor(angle, x, y) {
        super(0, 0, 1);
        this.spawnAngle = angle;
        this.height = 2000;
        this.width = 10;
        this.image.src = "images/blue.webp";
        this.image.style.position = "absolute";
        this.image.style.transformOrigin = "center top";
        this.image.style.transform = `rotate(${angle - Math.PI / 2}rad)`;

    }
    move() {
        this.x = player.x - 5;
        this.y = player.y;
        if (this.iFrame > 0) {
            this.iFrame--;
        }
        else {
            for (let i = 0; i < enemies.length; i++) {
                let dx = enemies[i].x - this.x;
                let dy = enemies[i].y - this.y;

                let distanceToLine = Math.abs(dx * Math.sin(this.spawnAngle) - dy * Math.cos(this.spawnAngle));

                if (enemies[i].ignoreBullets == false && distanceToLine < 10 + enemies[i].width / 2 && enemies[i].y < player.y) {
                    enemies[i].takeDamage(this);
                    this.iFrame = 15;
                }
            }
        }

    }
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.spawnAngle - Math.PI / 2);
        ctx.drawImage(this.image, -this.width, 0, this.width, this.height);
        ctx.restore();
    }
}
class PlayerBomb extends Bullet {
    constructor(x, y, speedX, speedY) {
        super(0, 0, 1);
        this.shootTimer = 60;
        this.explodeTimer = 0;
        this.height = 25;
        this.width = 25;
        this.speedX = speedX;
        this.speedY = speedY;
        this.image.src = "images/bomb.webp";
        this.scale = 25;
        this.damage = 3;
        this.hitEnemies = new Set();
    }
    move() {
        if (this.explodeTimer <= 0) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        this.shootTimer--;
        this.explodeTimer--;
        if (this.shootTimer == 0 && this.explodeTimer < 0) {
            this.explodeTimer = 50;
            this.image.src = "images/explosion.webp";
        }
        if (this.shootTimer > 0) {
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].ignoreBullets == false && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                    this.explodeTimer = 30;
                    this.shootTimer = 0;
                    this.image.src = "images/explosion.webp";
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
                    enemies[i].takeDamage(this);
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }

    }
}
class ExpandingCircle extends Bullet {
    constructor(x, y) {
        super(0, 0, 1);
        this.timer=30;
        this.height = 25;
        this.width = 25;
        this.image.src = "images/frostAura.webp";
        this.scale = 25;
    }
    move() {
        this.scale += 50;
        // console.log(this.image.style.height+" "+(this.width)+" BEFORE");
        this.width = this.scale;
        this.height = this.scale;
        this.timer--;
        for (let i = 0; i < enemyBullets.length; i++) {
            if (enemyBullets[i].ignoreWipe == false && RectCircleColliding(this, enemyBullets[i], this.width / 2, this.x, this.y)) {
                enemyBullets[i].dead=true;
            }
        }
        if(this.timer<=0)this.dead=true;

    }
}
class ProtectorBullet extends Bullet {
    static slowed=false;
    constructor(damage) {
        super(0, 0, 1);
        this.height = 40;
        this.width = 40;
        this.image.src = "images/protectorBullet.webp";
        this.offsetX = 0;
        this.offsetY = 0;
        this.image.style.left = (player.x) + "px";
        this.image.style.top = (player.y) + "px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.zIndex = 1;
        this.damage = damage;
        this.angle = 0;
        this.hitEnemies = new Map();
        this.width*=player.projectileSizeMultiplier;
        this.height*=player.projectileSizeMultiplier;
        protectorBullets.push(this);
    }
    move() {
        this.width=40*player.projectileSizeMultiplier;
        this.height=40*player.projectileSizeMultiplier;
        if(ProtectorBullet.slowed==true){
            this.angle += 0.07/3;
        }
        else{
            this.angle += 0.07;
        }
        this.angle %= 2 * Math.PI;
        this.offsetX = 100 * Math.cos(this.angle);
        this.offsetY = 100 * Math.sin(this.angle);
        this.x = player.x + this.offsetX;
        this.y = player.y + this.offsetY;

        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].ignoreBullets == false && !this.hitEnemies.has(enemies[i]) && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                enemies[i].takeDamage(this);
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
    static Spacing() {
        for (let i = 0; i < protectorBullets.length; i++) {
            protectorBullets[i].angle = 2 * Math.PI / protectorBullets.length * i;
        }
    }
}
class PlayerShield extends Bullet {
    constructor() {
        super(0, 0, 0);
        this.height = 100;
        this.width = 100;
        this.image.src = "images/grayCircle.webp";
        this.offsetX = 0;
        this.offsetY = 0;
        this.image.style.left = (player.x) + "px";
        this.image.style.top = (player.y) + "px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.zIndex = 1;
        this.angle = 0;
        this.health=30;
        this.maxHealth=30;
        playerShield=this;
        shieldBar=new ShieldBar(this);
    }
    move() {
        this.x=player.x;
        this.y=player.y;
        this.redTimer--;
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].ignoreBullets==false && enemies[i].ignoreShield==false && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                let angle=Math.atan2((enemies[i].y-player.y),(enemies[i].x-player.x));
                this.redTimer=5;
                let damage=1;
                if(enemies[i].isBoss){
                    damage=3;
                }
                this.takeDamage(damage);
                enemies[i].AddForce(10*Math.cos(angle), 10*Math.sin(angle));
            }
        }
        for (let i = 0; i < enemyBullets.length; i++) {
            if (enemyBullets[i].ignoreShield==false && RectCircleColliding(this, enemyBullets[i], this.width / 2, this.x, this.y)) {
                enemyBullets[i].dead=true;
                this.redTimer=5;
                let damage=enemyBullets[i].damage;
                this.takeDamage(damage);
            }
        }
        shieldBar.Update();
    
    }
    takeDamage(damage){
        if(damage==0)return;
        this.health-=damage;
        floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"gray"));
        if(this.health<=0){
            this.dead=true;
            playerShield=null;
            boughtUpgrades[14]=0;
        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        
        ctx.globalAlpha=0.4;
        if (this.redTimer > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(255, 80, 80, 0.6)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
        else {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        

        ctx.restore();
    }
    
}
class PlayerFire extends Bullet {
    constructor(speedX, speedY, damage) {
        super(speedX, speedY, damage);
        this.width = 30;
        this.height = 30;
        this.image.src = "images/playerFire.webp";
        this.timer=45;
        this.width*=player.projectileSizeMultiplier;
        this.height*=player.projectileSizeMultiplier;
    }
    move(){
        super.move();
        this.timer--;
        if(this.timer==0)this.dead=true;

    }
}
class WindBullet extends Bullet {
    constructor(speedX, speedY, damage) {
        super(speedX, speedY, damage);
        this.width = 40;
        this.height = 40;
        this.width*=player.projectileSizeMultiplier;
        this.height*=player.projectileSizeMultiplier;
        this.image.src = "images/playerWind.webp";
    }
    move(){
        if (this.slowed) {
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
                let angle=Math.atan2((enemies[i].y-player.y),(enemies[i].x-player.x));
                enemies[i].AddForce(5*Math.cos(angle), 5*Math.sin(angle));
            }
        }
        if (this.x < -100 || this.y < -100 || this.x > canvas.width + 100 || this.y >= canvas.height + 100) {
            this.dead = true;
        }
    }
}
class SummonedEnemy extends Bullet{
    constructor(speed, health, size, image){
        super(0,0,health);
        this.speed=speed;
        this.health=health;
        this.image=image;
        this.width=size;
        this.height=size;
    }
    move(){
        super.move();
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
                this.speedX=vx;
                this.speedY=vy;
            }
            else{
                this.speedX=0;
                this.speedY=0;
            }

        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.filter = "grayscale(100%)";
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.filter="none";

        ctx.restore();
    }
}

/*
^ PLAYER BULLETS

v ENEMY BULLETS
*/


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
        this.image.style.left = (x) + "px";  // center horizontally on x
        this.image.style.top = y + "px";
        this.image.zIndex = 1;
        this.scale = 25;
        this.iFrame = 0;
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

class HomingBullet extends EnemyBullet {
    constructor(speedX, speedY, damage, x, y) {
        super(speedX, speedY, damage, x, y);
        this.homingTimer = 0;
        this.image.src = 'images/homingBullet.webp';
        let lastSpeedX = 0;
        let lastSpeedY = 0;
        let distanceX = Math.abs(this.x - player.x);
        let distanceY = Math.abs(this.y - player.y);
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
        if (this.timer == 0 || (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height)) {
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
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
            this.background.remove();
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
        this.height = 2000;
        this.width = 10;
        this.image.style.position = "absolute";
        this.image.style.transformOrigin = "center top";
        this.image.src = "images/yellow.webp";
        this.image.style.left = (x - this.width / 2) + "px";  // center horizontally on x
        this.image.style.top = y + "px";
        this.image.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
        this.image.style.filter = "brightness(30%)";
        this.image.style.zIndex = 0;
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
            player.slowCountdown = 120;
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
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special() {
        this.deathTimer--;
        if (this.deathTimer == 0) {
            for (let i = 0; i < 8; i++) {
                let angle = i * Math.PI * 2 / 8;
                bullets.push(new SmallRock(1, this.x, this.y, 5 * Math.sin(angle), 5 * Math.cos(angle)));
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
        this.image.src = 'images/blue.webp';
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

/*
^ ENEMY BULLETS

v COLLECTABLES
*/

class Collectable{
    constructor(x,y){
        this.image = new Image();
        this.x = x;
        this.y = y;
        this.timer=0;
    }
    act(){
        this.timer--;
        if (this.timer == 0) this.dead = true;
    }
    draw(){
        
        if (this.dead) return;
        ctx.save();
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        ctx.restore();
    }
}
class XPBag extends Collectable{
    constructor(x, y) {
        super(x,y);
        this.image.src = 'images/xpBag.webp';
        this.size = Math.round(Math.random() * 50 + 10);
        this.width = this.size * 2;
        this.height = this.size * 2;
        this.timer = 600;
    }
    act() {
        super.act();
        if (this.x < player.x + player.width && this.x + this.width - this.width / 6 > player.x && this.y < player.y + player.height && this.y + this.height - this.width / 6 > player.y) {
            player.GainXP(this.size / 2 * (1 + player.level * 0.2));
            this.dead = true;
        }
    }
}

class HealthPotion extends Collectable{
    constructor(x, y) {
        super(x,y)
        this.image.src = 'images/healthPotion.webp';
        this.x = x;
        this.y = y;
        this.size = Math.ceil(Math.random() * 4)+1;
        this.width = (this.size * 15 + 15);
        this.height = (this.size * 15 + 15);
        this.timer = 1000;
    }
    act() {
        super.act();
        if (this.x < player.x + player.width && this.x + this.width - this.width / 6 > player.x && this.y < player.y + player.height && this.y + this.height - this.width / 6 > player.y) {
            player.Heal(this.size);

            this.dead = true;
        }
    }
}

class FloatingObject{
    constructor(x, y, content, color){
        this.x=x;
        this.y=y;
        this.content=content;
        if(color){
            this.color=color;
        }
        this.timer=60;
        this.width=75;
        this.height=75;
        this.dead=false;
    }
    move(){
        this.y-=2;
        this.timer--;
        if(this.timer==0){
            this.dead=true;
        }
    }
    draw(){
        
        if (this.dead) return;
        ctx.save();
        if(this.content instanceof Image){
            ctx.drawImage(this.content, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        else{
            ctx.font=`${30}px Times New Roman`
            ctx.fillStyle=this.color;
            ctx.fillText(this.content,this.x,this.y);
        }

        ctx.restore();
    }
}

class Player {
    static unlocked=false;
    constructor() {
        this.image = new Image();
        this.image.src="images/player.webp";
        this.speed = 5;
        this.x = screen.width / 2;
        this.y = screen.height / 2;
        this.width = 50;
        this.height = 50;
        this.health = 10;
        this.currentExp = 0;
        this.nextLevel = 100;
        this.damage = 1;
        this.maxHealth = 10;
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
        this.healMultiplier=1;
        this.attackSpeedMultiplier=1;
        this.projectileSizeMultiplier=1;
        this.collisionDamageMultiplier=1;
        this.iceFormBulletsPierce=false;
    }
    takeDamage(damage, bullet) {
        if(bullet.isEnemy){
            damage*=this.collisionDamageMultiplier;
        }
        if(playerShield!=null){
            playerShield.takeDamage(damage);
            return;
        }
        damage *= this.damageTakenMultiplier;
        this.health -= damage;
        
        //console.log(this.health);
        floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"red"));
        console.log(damage+" "+bullet);
        if (bullet.frostbite) {
            this.slowCountdown = 120;
        }
        this.redTimer = 10;
    }
    act() {
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
                    bullets[bullets.length] = new FrostBullet(vx, vy, 1);
                }
                else {
                    bullets[bullets.length] = new FrostBullet(10, 0, 1);
                }

            }
            else {
                bullets[bullets.length] = new FrostBullet(10, 0, 1);
            }

        }
        //console.log(this.slowed);
        if (this.slowed || this.slowCountdown > 0) {
            this.speed /= 2;
            ProtectorBullet.slowed=true;
        }
        else{
            ProtectorBullet.slowed=false;
        }
        if (timeWarpCounter > 0) {
            this.speed *= 2;
        }
        if (movingUp && movingLeft) {
            this.y -= this.speed / 1.4142;
            this.x -= this.speed / 1.4142;
        }
        else if (movingUp && movingRight) {
            this.y -= this.speed / 1.4142;
            this.x += this.speed / 1.4142;
        }
        else if (movingDown && movingRight) {
            this.y += this.speed / 1.4142;
            this.x += this.speed / 1.4142;
        }
        else if (movingDown && movingLeft) {
            this.y += this.speed / 1.4142;
            this.x -= this.speed / 1.4142;
        }
        else {
            if (movingUp) {
                this.y -= this.speed;
            }
            if (movingDown) {
                this.y += this.speed;
            }
            if (movingRight) {
                this.x += this.speed;
            }
            if (movingLeft) {
                this.x -= this.speed;
            }
        }
        this.x += this.accelerationX;
        this.y += this.accelerationY;

        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x > canvas.width) this.x = canvas.width;
        if (this.y > canvas.height) this.y = canvas.height;
        if (this.slowed || this.slowCountdown > 0) this.speed *= 2;
        if (timeWarpCounter > 0) {
            this.speed /= 2;
        }
        if (this.passiveHealingTimer <= 0 && this.passiveHealing > 0) {
            this.passiveHealingTimer = 480;

            this.Heal(this.passiveHealing);
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
        this.accelerationX /= 1.05;
        this.accelerationY /= 1.05;

    }
    AddForce(x, y) {
        this.accelerationX += x;
        this.accelerationY += y;
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        if(this.healTimer>0){
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
        else if (this.slowCountdown > 0 || this.slowed==true) {
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
    Heal(amount){
        amount*=this.healMultiplier;
        this.health = Math.min(this.maxHealth, this.health+amount);
        floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,amount,"green"));

    }
    GainXP(amount){
        this.currentExp+=amount*this.xpMultiplier;
    }
}
class BasicPlayer extends Player{
    constructor(){
        super();
        this.image.src="images/player.webp";
    }
    act(){
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack();
        }
        super.act();
    }
    Attack(){
        
        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            let temp=new Bullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage);
            bullets[bullets.length] = temp;
            angle += 2 * Math.PI / this.projectiles;
        }
    }
}
class TankPlayer extends Player{
    constructor(){
        super();
        this.width=65;
        this.height=65;
        this.speed=3.5;
        this.health=35;
        this.maxHealth=35;
        this.attackSpeed=70;
        this.nextLevel=120;
        this.damage=2;
        this.image.src="images/tankPlayer.webp";
        this.normalImage="images/tankPlayer.webp";
        this.mirroredImage="images/tankPlayerMirrored.webp";
        this.shieldTimer=1800;
    }
    act(){
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack();
        }
        super.act();
    }
    Attack(){
        
        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            bullets[bullets.length] = new Bullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage);
            angle += 2 * Math.PI / this.projectiles;
        }
    }
}
class HealerPlayer extends Player{
    constructor(){
        super();
        this.speed=4.5;
        this.health=12;
        this.maxHealth=12;
        this.attackSpeed=70;
        this.nextLevel=100;
        this.damage=1;
        this.passiveHealing=1;
        this.siphon=0.25;
        this.healMultiplier=2;
        this.normalMode="images/healerPlayer.webp";
        this.image.src=this.normalMode;
    }
    act(){
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack();
        }
        super.act();
    }
    Attack(){
        
        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            bullets[bullets.length] = new Bullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage);
            angle += 2 * Math.PI / this.projectiles;
        }
    }
    takeDamage(damage, bullet) {
        if(playerShield!=null){
            playerShield.takeDamage(damage);
            return;
        }
        damage *= this.damageTakenMultiplier;
        this.health -= damage;
        this.GainXP(10*damage);
        
        //console.log(this.health);
        floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,damage,"red"));

        if (this.health <= 0) {
            EndGame(false);
        }
        if (bullet.frostbite) {
            this.slowCountdown = 120;
        }
        this.redTimer = 10;
    }
}
class MagePlayer extends Player{
    //1=fire mode, 2=ice mode, 3=air mode
    constructor(){
        super();
        this.health=10;
        this.maxHealth=10;
        this.attackSpeed=5;
        this.mode=1;
        boughtUpgrades[0]=1;
        boughtUpgrades[2]=1;
        boughtUpgrades[11]=1;
        boughtTier2Upgrades[0]=1;
        boughtTier2Upgrades[2]=1;
        boughtUpgrades[17]=0;
        boughtUpgrades[18]=0;
        this.fireDamage=0.5;
        new ChangeModeIcon(50);
        this.image.src="images/magePlayer.webp";
    }
    act(){
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed*this.attackSpeedMultiplier;
            this.Attack();
        }
        super.act();
    }
    Attack(){
        if(this.mode==1){
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
                    let distanceY = enemies[closestEnemy].y-this.y;
                    let distance=distanceX * distanceX + distanceY * distanceY;
                    let vx = 0;
                    let vy = 0;

                    if (distance > 0) {
                        let angle = Math.atan2(distanceY, distanceX);
                        angle += Math.random()*1.2 - 0.6;
                        vx = 7 * Math.cos(angle);
                        vy = 7 * Math.sin(angle);
                    }
                    bullets[bullets.length] = new PlayerFire(vx, vy, this.fireDamage);
                }

            }

        
        }
        else if(this.mode==2){
            let angle = 0;
            
            for (let i = 0; i < this.projectiles; i++) {
                let temp=new FrostBullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage);
                temp.image.src="images/playerIceBullet.webp"
                temp.width=30;
                temp.height=30;
                temp.width*=player.projectileSizeMultiplier;
                temp.height*=player.projectileSizeMultiplier;
                bullets[bullets.length] = temp;
                angle += 2 * Math.PI / this.projectiles;
            }
        }
        else if(this.mode==3){
            let angle = Math.PI/4;
            for (let i = 0; i < this.projectiles; i++) {
                let temp=new WindBullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage);
                bullets[bullets.length] = temp;
                angle += 2 * Math.PI / this.projectiles;
            }
        }
    }
}
class NecromancerPlayer extends Player{
    constructor(){
        super();
        this.image.src="images/necromancerPlayer.webp";
        this.health=8;
        this.maxHealth=8;
        this.attackSpeed=60;
        this.damage=1;
        this.summonQueue=[];
        this.isSummoning=false;
        this.summoningCooldown=0;
        this.passiveSpawning=false;
        this.passiveSpawnCooldown=0;
        boughtUpgrades[19]=0;
        new NecromancyIcon(50);
    }
    act(){
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack();
        }
        if(this.isSummoning){
            this.summoningCooldown--;
            if(this.summoningCooldown<=0){
                this.summoningCooldown=25;
                if(this.summonQueue.length>0){
                    let temp=this.summonQueue[0];
                    temp.x=player.x;
                    temp.y=player.y;
                    bullets.push(temp);
                    this.summonQueue.splice(0,1);
                }
                else{
                    this.isSummoning=false;
                    this.summoningCooldown=0;
                }
            }
        }
        this.passiveSpawnCooldown--;
        if(this.passiveSpawning && this.passiveSpawnCooldown<=0){
            this.passiveSpawnCooldown=180;
            let tempImage=new Image();
            tempImage.src="images/enemy.webp";
            let temp=new SummonedEnemy(2,3,50,tempImage);
            temp.x=player.x;
            temp.y=player.y;
            bullets.push(temp);
        }
    
        super.act();
    }
    Summon(){
        this.isSummoning=true;
    }
    Attack(){
        
        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            let temp=new Bullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage);
            bullets[bullets.length] = temp;
            angle += 2 * Math.PI / this.projectiles;
        }
    }
}


//Tier 1: Enemy, ShooterEnemy, AimingEnemy, HomingEnemy
//Tier 2: ChargingEnemy, ShieldEnemy
//Boss: LaserBoss, IceBoss

const worldDiv = document.getElementById("world");
const ENEMYTYPES=[BasicEnemy,ShooterEnemy,AimingEnemy,HomingEnemy,TrapperEnemy,ZombieEnemy,ShieldEnemy,ChargingEnemy,GhostEnemy,PoisonEnemy,BlackHoleEnemy,MimicEnemy,BuilderEnemy,WindupEnemy,SpawnerEnemy,SelfDestructEnemy,MachineGunEnemy,SmokeBombEnemy];

function RandomizeEnemies(numTier1, numTier2, numTier3, numTier1Boss, numTier2Boss) {
    InitializeStats();
    bossesLeft = numTier1Boss+numTier2Boss;
    let tier1 = [1, 2, 3, 4, 5, 6];
    let tier2 = [1, 2, 3, 4, 5, 6];
    let tier3 = [1, 2, 3, 4, 5, 6];
    let tier1Bosses = [1, 2, 3, 4, 5];
    let tier2Bosses = [1, 2, 3];
    tier1 = shuffle(tier1);
    tier2 = shuffle(tier2);
    tier3 = shuffle(tier3);
    tier1Bosses = shuffle(tier1Bosses);
    tier2Bosses = shuffle(tier2Bosses);

    BasicEnemy.isActive = false;
    ShooterEnemy.isActive = false;
    AimingEnemy.isActive = false;
    HomingEnemy.isActive = false;
    ChargingEnemy.isActive = false;
    ShieldEnemy.isActive = false;
    TrapperEnemy.isActive = false;
    ZombieEnemy.isActive = false;
    GhostEnemy.isActive = false;
    PoisonEnemy.isActive = false;
    BlackHoleEnemy.isActive = false;
    BuilderEnemy.isActive = false;
    WindupEnemy.isActive = false;
    SpawnerEnemy.isActive = false;
    MimicEnemy.isActive=false;
    SelfDestructEnemy.isActive=false;
    MachineGunEnemy.isActive=false;
    SmokeBombEnemy.isActive=false;
    for (let i = 0; i < numTier1; i++) {
        switch (tier1[i]) {
            case 1:
                BasicEnemy.isActive = true;
                if (!BasicEnemy.seen) {
                    BasicEnemy.seen = true;
                    newEnemyQueue.push("images/enemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                ShooterEnemy.isActive = true;
                if (!ShooterEnemy.seen) {
                    ShooterEnemy.seen = true;
                    newEnemyQueue.push("images/shooterEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                AimingEnemy.isActive = true;
                if (!AimingEnemy.seen) {
                    AimingEnemy.seen = true;
                    newEnemyQueue.push("images/aimingEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 4:
                HomingEnemy.isActive = true;
                if (!HomingEnemy.seen) {
                    HomingEnemy.seen = true;
                    newEnemyQueue.push("images/homingEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 5:
                TrapperEnemy.isActive = true;
                if (!TrapperEnemy.seen) {
                    TrapperEnemy.seen = true;
                    newEnemyQueue.push("images/trapperEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 6:
                ZombieEnemy.isActive = true;
                if (!ZombieEnemy.seen) {
                    ZombieEnemy.seen = true;
                    newEnemyQueue.push("images/zombieEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }
    for (let i = 0; i < numTier2; i++) {
        switch (tier2[i]) {
            case 1:
                ChargingEnemy.isActive = true;
                if (!ChargingEnemy.seen) {
                    ChargingEnemy.seen = true;
                    newEnemyQueue.push("images/chargingEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                ShieldEnemy.isActive = true;
                if (!ShieldEnemy.seen) {
                    ShieldEnemy.seen = true;
                    newEnemyQueue.push("images/shieldEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                GhostEnemy.isActive = true;
                if (!GhostEnemy.seen) {
                    GhostEnemy.seen = true;
                    newEnemyQueue.push("images/ghostEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 4:
                PoisonEnemy.isActive = true;
                if (!PoisonEnemy.seen) {
                    PoisonEnemy.seen = true;
                    newEnemyQueue.push("images/poisonEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 5:
                BlackHoleEnemy.isActive = true;
                if (!BlackHoleEnemy.seen) {
                    BlackHoleEnemy.seen = true;
                    newEnemyQueue.push("images/blackHoleEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 6:
                MimicEnemy.isActive = true;
                if (!MimicEnemy.seen) {
                    MimicEnemy.seen = true;
                    newEnemyQueue.push("images/mimicEnemyDead.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }
    for (let i = 0; i < numTier3; i++) {
        switch (tier3[i]) {
            case 1:
                BuilderEnemy.isActive = true;
                if (!BuilderEnemy.seen) {
                    BuilderEnemy.seen = true;
                    newEnemyQueue.push("images/builderEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                WindupEnemy.isActive = true;
                if (!WindupEnemy.seen) {
                    WindupEnemy.seen = true;
                    newEnemyQueue.push("images/windupEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                SpawnerEnemy.isActive = true;
                if (!SpawnerEnemy.seen) {
                    SpawnerEnemy.seen = true;
                    newEnemyQueue.push("images/spawnerEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 4:
                SelfDestructEnemy.isActive = true;
                if (!SelfDestructEnemy.seen) {
                    SelfDestructEnemy.seen = true;
                    newEnemyQueue.push("images/selfDestructEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 5:
                MachineGunEnemy.isActive = true;
                if (!MachineGunEnemy.seen) {
                    MachineGunEnemy.seen = true;
                    newEnemyQueue.push("images/machineGunEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 6:
                SmokeBombEnemy.isActive = true;
                if (!SmokeBombEnemy.seen) {
                    SmokeBombEnemy.seen = true;
                    newEnemyQueue.push("images/smokeBombEnemy.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }
    for (let i = 0; i < numTier1Boss; i++) {
        switch (tier1Bosses[i]) {
            case 1:
                boss = new LaserBoss(1, 120);
                enemies[enemies.length] = boss;
                if (!LaserBoss.seen) {
                    LaserBoss.seen = true;
                    newEnemyQueue.push("images/laserBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                boss = new IceBoss(1, 150);
                if (!IceBoss.seen) {
                    IceBoss.seen = true;
                    newEnemyQueue.push("images/iceBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                enemies[enemies.length] = boss;
                break;
            case 3:
                boss = new BouncyBoss(5, 120, true);
                if (!BouncyBoss.seen) {
                    BouncyBoss.seen = true;
                    newEnemyQueue.push("images/bouncyBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                enemies[enemies.length] = boss;
                break;
            case 4:
                boss = new MageBoss(2, 100, true);
                if (!MageBoss.seen) {
                    MageBoss.seen = true;
                    newEnemyQueue.push("images/mageWaterMode.webp");
                    isPlayerUnlocked.push(false);
                }
                enemies[enemies.length] = boss;
                break;
            case 5:
                boss = new BulletHellBoss(3, 100, true);
                if (!BulletHellBoss.seen) {
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
                boss = new GambleBoss(1.5, 175);
                enemies[enemies.length] = boss;
                if (!GambleBoss.seen) {
                    GambleBoss.seen = true;
                    newEnemyQueue.push("images/gambleBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 2:
                boss = new SnakeBoss(2.5,300,true,59);
                enemies[enemies.length] = boss;
                if (!SnakeBoss.seen) {
                    SnakeBoss.seen = true;
                    newEnemyQueue.push("images/snakeBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                boss = new HealerBoss(1.5,150);
                enemies[enemies.length] = boss;
                if (!HealerBoss.seen) {
                    HealerBoss.seen = true;
                    newEnemyQueue.push("images/healingBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }

}
function InitializeStats(){
    BasicEnemy.baseTimer=200;
    BasicEnemy.randomTimer=200;
    BasicEnemy.index=0;
    BasicEnemy.health=5;
    BasicEnemy.speed=2;

    ShooterEnemy.baseTimer=300;
    ShooterEnemy.randomTimer=200;
    ShooterEnemy.index=1;
    ShooterEnemy.health=3;
    ShooterEnemy.speed=2;

    ChargingEnemy.baseTimer=900;
    ChargingEnemy.randomTimer=500;
    ChargingEnemy.index=7;
    ChargingEnemy.health=8;
    ChargingEnemy.speed=1;

    AimingEnemy.baseTimer=400;
    AimingEnemy.randomTimer=400;
    AimingEnemy.index=2;
    AimingEnemy.health=1;
    AimingEnemy.speed=3.5;

    HomingEnemy.baseTimer=400;
    HomingEnemy.randomTimer=400;
    HomingEnemy.index=3;
    HomingEnemy.health=2;
    HomingEnemy.speed=1;
    
    ShieldEnemy.baseTimer=900;
    ShieldEnemy.randomTimer=750;
    ShieldEnemy.index=6;
    ShieldEnemy.health=15;
    ShieldEnemy.speed=1.5;
    
    TrapperEnemy.baseTimer=400;
    TrapperEnemy.randomTimer=400;
    TrapperEnemy.index=4;
    TrapperEnemy.health=4;
    TrapperEnemy.speed=3;
    
    ZombieEnemy.baseTimer=450;
    ZombieEnemy.randomTimer=300;
    ZombieEnemy.index=5;
    ZombieEnemy.health=3;
    ZombieEnemy.speed=2;

    GhostEnemy.baseTimer=750;
    GhostEnemy.randomTimer=500;
    GhostEnemy.index=8;
    GhostEnemy.health=4;
    GhostEnemy.speed=4;

    PoisonEnemy.baseTimer=750;
    PoisonEnemy.randomTimer=500;
    PoisonEnemy.index=9;
    PoisonEnemy.health=5;
    PoisonEnemy.speed=1;

    BlackHoleEnemy.baseTimer=800;
    BlackHoleEnemy.randomTimer=600;
    BlackHoleEnemy.index=10;
    BlackHoleEnemy.health=5;
    BlackHoleEnemy.speed=1.5;

    BuilderEnemy.baseTimer=1000;
    BuilderEnemy.randomTimer=900;
    BuilderEnemy.index=12;
    BuilderEnemy.health=12;
    BuilderEnemy.speed=1.5;
    
    WindupEnemy.baseTimer=900;
    WindupEnemy.randomTimer=800;
    WindupEnemy.index=13;
    WindupEnemy.health=20;
    WindupEnemy.speed=2;
    
    SpawnerEnemy.baseTimer=900;
    SpawnerEnemy.randomTimer=800;
    SpawnerEnemy.index=14;
    SpawnerEnemy.health=25;
    SpawnerEnemy.speed=1.5;

    MimicEnemy.baseTimer=700;
    MimicEnemy.randomTimer=600;
    MimicEnemy.index=11;
    MimicEnemy.health=8;
    MimicEnemy.speed=3;

    SelfDestructEnemy.baseTimer=800;
    SelfDestructEnemy.randomTimer=750;
    SelfDestructEnemy.index=15;
    SelfDestructEnemy.health=20;
    SelfDestructEnemy.speed=2;
    
    MachineGunEnemy.baseTimer=900;
    MachineGunEnemy.randomTimer=800;
    MachineGunEnemy.index=16;
    MachineGunEnemy.health=15;
    MachineGunEnemy.speed=3;
    
    SmokeBombEnemy.baseTimer=1000;
    SmokeBombEnemy.randomTimer=900;
    SmokeBombEnemy.index=17;
    SmokeBombEnemy.health=27;
    SmokeBombEnemy.speed=3;
}

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
    if (page == "gamePage" && gameOver==false) {
        requestAnimationFrame(loop);
    }
}
function GameLogic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timeWarpCounter > 0) {
        background.src = "images/timeWarpBackground.webp";
    }
    if (timeWarpCounter == -1) {
        background.src = "images/background.webp";
    }
    
    
    ctx.save();
    const cameraX = (canvas.width / 2) - player.x-200;
    const cameraY = (canvas.height / 2) - player.y-100;
    ctx.translate(cameraX, cameraY);
    
    ctx.drawImage(background, -50, -50, canvas.width+100, canvas.height+100);

    player.act();
    SpawnEnemies();

    if (xpBagTimer < 0) {
        xpBagTimer = Math.random() * 200 + 200;
        xpBagTimer /= 1 + timeElapsed * 0.0003;
        const newCollectable = new XPBag(Math.random() * (canvas.width - canvas.width / 10) + canvas.width / 20, Math.random() * (canvas.height - canvas.height / 10) + canvas.height / 20);
        collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    if (healthPotionSpawnTimer < 0) {
        healthPotionSpawnTimer = Math.random() * 300 + 450;
        healthPotionSpawnTimer /= 1 + timeElapsed * 0.0003;
        healthPotionSpawnTimer*=healthPotionSpawnMultiplier;
        const newCollectable = new HealthPotion(Math.random() * (canvas.width - canvas.width / 10) + canvas.width / 20, Math.random() * (canvas.height - canvas.height / 10) + canvas.height / 20);
        collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].move();
        if (bullets[i].dead) {
            bullets.splice(i, 1);
        }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].dead) {
            if (enemies[i].giveXP) {
                player.GainXP(enemies[i].value);
                if(!enemies[i].isBoss && chosenCharacter==5){
                    player.summonQueue.push(new SummonedEnemy(enemies[i].speed, Math.ceil(enemies[i].maxHealth*0.5), enemies[i].width, enemies[i].image))
                }
            }
            if (enemies[i].isBoss) {
                enemies[i].bossBar.image1.remove();
                enemies[i].bossBar.image2.remove();
                enemies[i].bossText.remove();
                bossesLeft--;
                if (bossesLeft == 0) {
                    killedBoss=true;
                    ChangeWave();
                }
            }
            enemies.splice(i, 1);
        }
        else {
            enemies[i].move();
            enemies[i].special();
            if (enemies[i].dead) {
                if (enemies[i].giveXP) {
                    player.GainXP(enemies[i].value);
                }
                enemies.splice(i, 1);
            }
        }
    }
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].move();
        enemyBullets[i].special();
        if (enemyBullets[i].dead) {
            enemyBullets.splice(i, 1);
        }

    }
    for (let i = collectables.length - 1; i >= 0; i--) {
        collectables[i].act();
        if (collectables[i].dead) {
            collectables.splice(i, 1);
        }
    }
    for (let i = floatingObjects.length - 1; i >= 0; i--) {
        floatingObjects[i].move();
        if (floatingObjects[i].dead) {
            floatingObjects.splice(i, 1);
        }
    }
    for (let i = playerAbilities.length - 1; i >= 0; i--) {
        playerAbilities[i].timer();
    }
    ctx.fillStyle="black"
    ctx.fillRect(-55, -55, canvas.width+110, 30);
    ctx.fillRect(-25, canvas.height+25, canvas.width+80, 30);
    ctx.fillRect(-55, -25, 30, canvas.height+80);
    ctx.fillRect(canvas.width+25, -25, 30, canvas.height+70);

    for (let i = collectables.length - 1; i >= 0; i--) {
        collectables[i].draw();
    }
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].draw();
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].draw();
    }
    player.draw();
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].draw();
    }
    for (let i = floatingObjects.length - 1; i >= 0; i--) {
        floatingObjects[i].draw();
    }
    if (!isBossWave && timeElapsed >= waveTimer) {
        ChangeWave();
    }
    if (newEnemyQueue.length > 0) {
        ChangePage("newEnemyPage");
    }
    xpBagTimer--;
    healthPotionSpawnTimer--;
    timeWarpCounter--;
    if(timeElapsed<7200 || !isBossWave){
        timeElapsed++;
    }
    if (isBossWave) {
        timeElapsed = Math.min(timeElapsed, 3600);
    }
    if (player.health <= 0) {
        EndGame(false);
        player.health=0;
    }
    if(currentPage=="gamePage" && killedBoss==true){
        ChangePage("upgradePage", false);
    }
    if(currentPage=="gamePage" && isLevelling==true){
        ChangePage("upgradePage", false);
    }
    levellingBar.Update();
    healthBar.Update();
    ctx.restore();
    //console.log(enemyBullets.length);


}
function SpawnEnemies() {
    for(let i=0;i<ENEMYTYPES.length;i++){
        if(ENEMYTYPES[i].isActive){
            ENEMYTYPES[i].Spawn();
        }
    }
    
}
function ChangeWave() {
    currentWave++;
    waveText.Update();
    timeElapsed = 0;
    bossBars = new Array();
    switch (currentWave) {
        case 2:
            RandomizeEnemies(2, 1, 0, 0, 0);
            isBossWave = false;
            SCALE = 0.0015;
            break;
        case 3:
            RandomizeEnemies(2, 1, 0, 1, 0);
            isBossWave = true;
            SCALE = 0.0005;
            break;
        case 4:
            RandomizeEnemies(3, 2, 1, 0, 0);
            isBossWave = false;
            SCALE = 0.001;
            if(TankPlayer.unlocked==false){
                TankPlayer.unlocked=true;
                newEnemyQueue.push("images/tankPlayer.webp");
                isPlayerUnlocked.push(true);
            }
            break;
        case 5:
            RandomizeEnemies(1, 2, 1, 1, 0);
            isBossWave = true;
            SCALE = 0.0004;
            break;
        case 6:
            RandomizeEnemies(2, 3, 2, 0, 0);
            isBossWave = false;
            SCALE = 0.0012;
            if(HealerPlayer.unlocked==false){
                HealerPlayer.unlocked=true;
                newEnemyQueue.push("images/healerPlayer.webp");
                isPlayerUnlocked.push(true);
            }
            break;
        case 7:
            RandomizeEnemies(2, 1, 1, 0, 1);
            isBossWave = true;
            SCALE = 0.0004;
            break;
        case 8:
            RandomizeEnemies(2, 2, 2, 1, 0);
            isBossWave = true;
            SCALE = 0.0005;
            if(difficulty>1 && NecromancerPlayer.unlocked==false){
                NecromancerPlayer.unlocked=true;
                newEnemyQueue.push("images/player.webp");
                isPlayerUnlocked.push(true);
            }
            break;
        case 8:
            RandomizeEnemies(2, 2, 2, 0, 1);
            isBossWave = true;
            SCALE = 0.0005;
            break;
        case 9:
            RandomizeEnemies(2, 2, 1, 2, 0);
            isBossWave = true;
            SCALE = 0.0005;
            break;
        case 10:
            RandomizeEnemies(2, 2, 2, 1, 1);
            isBossWave = true;
            SCALE = 0.0005;
            break;
        case 11:
            EndGame(true);
            break;
    }
    SCALE*=scaleMultiplier
    originalScale=SCALE;
}

function ChangePage(id, reset) {
    if (continueFlag) return;
    //console.log(id);
    if (gameOver && id == "upgradePage") {
        return;
    }
    currentPage=id;
    list = document.querySelectorAll('div[id$="Page"]');
    if (id != "upgradePage" && id != "newEnemyPage") {
        for (let i = 0; i < list.length; i++) {
            list[i].style.display = "none";
        }
    }
    page = id;
    document.getElementById(id).style.display = "block";
    if (id == "losePage" || id=="winPage") {
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
    if(id=="characterSelectionPage"){
        let tankPlayerButton=document.getElementById("tankPlayer");
        let tankPlayerImage=document.getElementById("tankPlayerImage");
        let tankPlayerText=document.getElementById("tankPlayerText");
        if(TankPlayer.unlocked==false){
            tankPlayerButton.style.pointerEvents="none";
            tankPlayerImage.src="images/black.webp";
            tankPlayerText.textContent="Clear Level 3 in any difficulty to unlock";
            tankPlayerText.style.fontSize="20px";
            tankPlayerText.style.top="200px";
        }
        else{
            tankPlayerButton.style.pointerEvents="auto";
            tankPlayerImage.src="images/tankPlayer.webp";
            tankPlayerText.textContent="Tank";
            tankPlayerText.style.fontSize="30px";
            tankPlayerText.style.top="225px";
        }
        let healerPlayerButton=document.getElementById("healerPlayer");
        let healerPlayerImage=document.getElementById("healerPlayerImage");
        let healerPlayerText=document.getElementById("healerPlayerText");
        if(HealerPlayer.unlocked==false){
            healerPlayerButton.style.pointerEvents="none";
            healerPlayerImage.src="images/black.webp";
            healerPlayerText.textContent="Clear Level 5 in any difficulty to unlock";
            healerPlayerText.style.fontSize="20px";
            healerPlayerText.style.top="200px";
        }
        else{
            healerPlayerButton.style.pointerEvents="auto";
            healerPlayerImage.src="images/healerPlayer.webp";
            healerPlayerText.textContent="Healer";
            healerPlayerText.style.fontSize="30px";
            healerPlayerText.style.top="225px";
        }
        let magePlayerButton=document.getElementById("magePlayer");
        let magePlayerImage=document.getElementById("magePlayerImage");
        let magePlayerText=document.getElementById("magePlayerText");
        if(MagePlayer.unlocked==false){
            magePlayerButton.style.pointerEvents="none";
            magePlayerImage.src="images/black.webp";
            magePlayerText.textContent="Defeat The Demonlist boss to unlock";
            magePlayerText.style.fontSize="20px";
            magePlayerText.style.top="200px";
        }
        else{
            magePlayerButton.style.pointerEvents="auto";
            magePlayerImage.src="images/magePlayer.webp";
            magePlayerText.textContent="Mage";
            magePlayerText.style.fontSize="30px";
            magePlayerText.style.top="225px";
        }
    }
    else if(id=="characterSelection2Page"){
        let necromancyPlayerButton=document.getElementById("necromancerPlayer");
        let necromancyPlayerImage=document.getElementById("necromancerPlayerImage");
        let necromancyPlayerText=document.getElementById("necromancerPlayerText");
        if(NecromancerPlayer.unlocked==false){
            necromancyPlayerButton.style.pointerEvents="none";
            necromancyPlayerImage.src="images/black.webp";
            necromancyPlayerText.textContent="Beat level 7 in Medium, Hard, or Extreme Demon Difficulty to Unlock";
            necromancyPlayerText.style.fontSize="20px";
            necromancyPlayerText.style.top="150px";
        }
        else{
            necromancyPlayerButton.style.pointerEvents="auto";
            necromancyPlayerImage.src="images/necromancerPlayer.webp";
            necromancyPlayerText.textContent="Necromancer";
            necromancyPlayerText.style.fontSize="30px";
            necromancyPlayerText.style.top="225px";
        }
    }
    if(id=="settingsPage"){
        let temp=""
        console.log(showHealthBars);
        if(showHealthBars){
            temp="ON"
        }
        else{
            temp="OFF"
        }
        document.getElementById("healthBarSetting").innerText="Show Healthbars: "+temp;
    }
    if(id=="enemyDescriptionSelectionPage"){
        
        images = document.querySelectorAll('[id$="GuideImage"]');
        buttons = document.querySelectorAll('[id$="GuideButton"]');
        for (let i = 0; i < images.length; i++) {
            images[i].src="images/questionMark.png";
            buttons[i].style.pointerEvents="none";
        }
        if(BasicEnemy.seen){
            images[0].src="images/Enemy.webp";
            images[0].style.pointerEvents="auto";
        }
        if(ShooterEnemy.seen){
            images[1].src="images/shooterEnemy.webp";
            images[1].style.pointerEvents="auto";
        }
        if(AimingEnemy.seen){
            images[2].src="images/aimingEnemy.webp";
            images[2].style.pointerEvents="auto";
        }
        if(HomingEnemy.seen){
            images[3].src="images/homingEnemy.webp";
            images[3].style.pointerEvents="auto";
        }
        if(TrapperEnemy.seen){
            images[4].src="images/trapperEnemy.webp";
            images[4].style.pointerEvents="auto";
        }
        if(ZombieEnemy.seen){
            images[5].src="images/zombieEnemy.webp";
            images[5].style.pointerEvents="auto";
        }
        if(ShieldEnemy.seen){
            images[6].src="images/shieldEnemy.webp";
            images[6].style.pointerEvents="auto";
        }
        if(ChargingEnemy.seen){
            images[7].src="images/chargingEnemy.webp";
            images[7].style.pointerEvents="auto";
        }
        if(GhostEnemy.seen){
            images[8].src="images/ghostEnemy.webp";
            images[8].style.pointerEvents="auto";
        }
        if(PoisonEnemy.seen){
            images[9].src="images/poisonEnemy.webp";
            images[9].style.pointerEvents="auto";
        }
        if(BlackHoleEnemy.seen){
            images[10].src="images/blackHoleEnemy.webp";
            images[10].style.pointerEvents="auto";
        }
        if(MimicEnemy.seen){
            images[11].src="images/mimicEnemyDead.webp";
            images[11].style.pointerEvents="auto";
        }
        if(BuilderEnemy.seen){
            images[12].src="images/builderEnemy.webp";
            images[12].style.pointerEvents="auto";
        }
        if(WindupEnemy.seen){
            images[13].src="images/windupEnemy.webp";
            images[13].style.pointerEvents="auto";
        }
        if(SpawnerEnemy.seen){
            images[14].src="images/spawnerEnemy.webp";
            images[14].style.pointerEvents="auto";
        }
        if(SelfDestructEnemy.seen){
            images[15].src="images/selfDestructEnemy.webp";
            images[15].style.pointerEvents="auto";
        }
        if(MachineGunEnemy.seen){
            images[16].src="images/machineGunEnemy.webp";
            images[16].style.pointerEvents="auto";
        }
        if(SmokeBombEnemy.seen){
            images[17].src="images/smokeBombEnemy.webp";
            images[17].style.pointerEvents="auto";
        }
        if(LaserBoss.seen){
            images[18].src="images/laserBoss.webp";
            images[18].style.pointerEvents="auto";
        }
        if(IceBoss.seen){
            images[19].src="images/iceBoss.webp";
            images[19].style.pointerEvents="auto";
        }
        if(BouncyBoss.seen){
            images[20].src="images/bouncyBoss.webp";
            images[20].style.pointerEvents="auto";
        }
        if(MageBoss.seen){
            images[21].src="images/mageFireMode.webp";
            images[21].style.pointerEvents="auto";
        }
        if(BulletHellBoss.seen){
            images[22].src="images/bulletHellBoss.webp";
            images[22].style.pointerEvents="auto";
        }
        if(GambleBoss.seen){
            images[23].src="images/gambleBoss.webp";
            images[23].style.pointerEvents="auto";
        }
        if(SnakeBoss.seen){
            images[24].src="images/snakeBoss.webp";
            images[24].style.pointerEvents="auto";
        }
        if(HealerBoss.seen){
            images[25].src="images/healingBoss.webp";
            images[25].style.pointerEvents="auto";
        }
    }
    if (id == "gamePage") {
        if(choice1){
            choice1.remove();
        }
        if(choice2){
            choice2.remove();
        }
        if (reset) Start();
        else {
            lastTime = Date.now();
            loop();
        }
    }
    if (id == "upgradePage") {
        paused = true;
        choice1 = document.createElement("div");
        choice2 = document.createElement("div");
        if(killedBoss==false){
            document.getElementById("upgradeText").style.color="white";
            let randomNum = Math.floor(Math.random() * NUMUPGRADES);
            while (boughtUpgrades[randomNum] == 1) {
                randomNum = Math.floor(Math.random() * NUMUPGRADES);
            }
            choice1.innerHTML=`<button onclick="${UPGRADES[randomNum].onclick}" style="position:absolute;left:${canvas.width/2-400}px; transform:translateX(-50%); top:120px; z-index:3" id="upgrade">${UPGRADES[randomNum].text}</button>`;

            let randomNum2 = Math.floor(Math.random() * NUMUPGRADES);
            while (randomNum == randomNum2 || boughtUpgrades[randomNum2] == 1) {
                randomNum2 = Math.floor(Math.random() * NUMUPGRADES);
            }
            choice2.innerHTML=`<button onclick="${UPGRADES[randomNum2].onclick}" style="position:absolute;left:${canvas.width/2}px; transform:translateX(-50%); top:120px; z-index:3" id="upgrade">${UPGRADES[randomNum2].text}</button>`;
            isLevelling=false;
        }
        else{
            document.getElementById("upgradeText").style.color="yellow";
            let randomNum = Math.floor(Math.random() * NUMTIER2UPGRADES);
            while (boughtTier2Upgrades[randomNum] == 1) {
                randomNum = Math.floor(Math.random() * NUMTIER2UPGRADES);
            }
            choice1.innerHTML=`<button onclick="${TIER2UPGRADES[randomNum].onclick}" style="position:absolute;left:${canvas.width/2-400}px; transform:translateX(-50%); top:120px; z-index:3" id="upgrade">${TIER2UPGRADES[randomNum].text}</button>`;

            let randomNum2 = Math.floor(Math.random() * NUMTIER2UPGRADES);
            while (randomNum == randomNum2 || boughtTier2Upgrades[randomNum2] == 1) {
                randomNum2 = Math.floor(Math.random() * NUMTIER2UPGRADES);
            }
            choice2.innerHTML=`<button onclick="${TIER2UPGRADES[randomNum2].onclick}" style="position:absolute;left:${canvas.width/2}px; transform:translateX(-50%); top:120px; z-index:3" id="upgrade">${TIER2UPGRADES[randomNum2].text}</button>`;
            killedBoss=false;
        }
        document.body.appendChild(choice1);
        document.body.appendChild(choice2);
    }
    if (id == "newEnemyPage") {
        newEnemyText(newEnemyQueue[0]);
        newEnemyQueue.splice(0, 1);
    }
}

async function EndGame(win) {
    gameOver = true;
    await delay(1500);
    ctx.strokeStyle = 'white';
    canvas.style.display = "none";
    if(healthBar){
        healthBar.image1.remove();
        healthBar.image2.remove();
    }
    if(levellingBar){
        levellingBar.image1.remove();
        levellingBar.image2.remove();
    }
    for(let i=0;i<bossBars.length;i++){
        bossBars[i].image1.remove();
        bossBars[i].image2.remove();
    }
    for(let i=0;i<playerAbilities.length;i++){
        playerAbilities[i].indicator.text.remove();
        playerAbilities[i].image.remove();
        if(playerAbilities[i].counterText){
            playerAbilities[i].counterText.text.remove();    
        }
    }
    if(shieldBar){
        shieldBar.image1.remove();
        shieldBar.image2.remove();
    }
    
    chosenCharacter=0;
    let descriptionText=document.getElementById("descriptionText");
    descriptionText.innerText="";
    list = document.querySelectorAll('[id$="Player"]');
    for (let i = 0; i < list.length; i++) {
        list[i].style.border = "";
    }
    document.getElementById("startButton").disabled = true; 

    if(win==true){
        ChangePage("winPage",true);
    }
    else{  
        ChangePage("losePage", true);
    }
}


async function newEnemyText() {
    let text=document.getElementById("introText");
    text.style.color="white";
    text.style.backgroundColor="black";
    if(isPlayerUnlocked[0]==false){
        text.textContent="New Enemy Discovered!";
    }
    else{
        text.textContent="New Character Unlocked!"
    }
    let image = document.createElement("img");
    image.src = newEnemyQueue[0];
    image.style.width = 300;
    image.style.height = 300;
    image.style.position = 'absolute';
    image.style.width = "300px";
    image.style.height = "300px";
    image.style.left = (canvas.width / 2-200) + "px";
    image.style.top = (canvas.height / 2-200) + "px";
    image.style.transform = "translate(-50%, -50%)";
    image.style.zIndex = 100;
    document.body.appendChild(image);
    continueFlag = true;
    await delay(3000);
    continueFlag = false;
    image.remove();
    isPlayerUnlocked.splice(0,1);
    ChangePage("gamePage", false);
}
