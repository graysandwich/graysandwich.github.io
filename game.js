
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
    static healthMultiplier=1;
    static speedMultiplier=1;
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
                this.x = leftBorder-200;
            }
            else {
                this.x = rightBorder + 200;
            }
        }
        else {
            this.x = Math.random() * canvas.width;
            if (Math.random() < 0.5) {
                this.y = topBorder -200;
            }
            else {
                this.y = bottomBorder + 200;
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
        this.ignoreKnockback=false;
        if(this.isBoss) this.ignoreKnockback=true;
        let multiplier=1;
        switch(currentWave){
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
        multiplier*=Enemy.healthMultiplier;
        this.health*=multiplier;
        this.maxHealth*=multiplier;
        this.speed*=Enemy.speedMultiplier
        this.health=Math.ceil(this.health);
        this.maxHealth=Math.ceil(this.maxHealth);
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
            ctx.fillStyle = 'rgba(84, 0, 0, 0.6)';
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
        let temp=Math.min(amount,this.maxHealth-this.health);
        this.health=Math.min(this.maxHealth,this.health+amount);
        if(temp!=0)floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,temp,"lime"));
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
            }
        }
    }
    CheckForCramming(){
        if(this.ignoreBullets==true){
            return;
        }
        for(let i=0;i<enemies.length;i++){
            if(!enemies[i].ignoreKnockback && !enemies[i].ignoreBullets && !enemies[i].isBoss){
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
    takeDamage(bullet) {
        let damage = bullet.damage * player.damageMultiplier;
        if(this.slowCountdown>0) damage*=player.slowedDamageMultiplier
        if(damage==0)return
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
        this.bossText.id="bossText";
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
        this.bossText.id="bossText";
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
            player.slowCountdown=30;
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
            this.bossText.id="bossText";
            document.body.appendChild(this.bossText);
            this.ignoreShield=true;
            this.health=Math.ceil(this.health*bossMultiplier);
            this.maxHealth = this.health;
            this.bossBar = new BossBar(this);
            bossBars.push(this.bossBar);
            this.ignoreKnockback=true;
            
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
        if (this.x < (this.width - 50) / 2+leftBorder) {
            this.x = (this.width - 50) / 2+leftBorder;
            this.speedX *= -1.03;
            this.speedY *= 1.03;
            this.makeClone();
        }
        if (this.y < (this.width - 50) / 2+topBorder) {
            this.y = (this.width - 50) / 2+topBorder;
            this.speedX *= 1.03;
            this.speedY *= -1.03;
            this.makeClone();
        }
        if (this.x > rightBorder - (this.width - 50) / 2) {
            this.x =rightBorder - (this.width - 50) / 2;
            this.speedX *= -1.03;
            this.speedY *= 1.03;
            this.makeClone();
        }
        if (this.y > bottomBorder - (this.width - 50) / 2) {
            this.y = bottomBorder - (this.width - 50) / 2;
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
        let temp = new BouncyBoss(5, 4, false);
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
        this.bossText.id="bossText";
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
        this.bossText.id="bossText";
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
        this.ignoreKnockback=true;
        
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
        this.healTimer--;
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
        this.value = 750;
        //console.log(this.image.style.transform+" transofrmer");

        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Random Seed Glitchless</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        this.bossText.id="bossText";
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
                angle+=Math.random()*2-1;
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
    static spawned=false;
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
            SnakeBoss.spawned=true;
            this.image.src = 'images/snakeBoss.webp';
            this.isBoss = true;
            this.ignoreShield=true;
            this.value = 750;
            this.bossText = document.createElement("div");
            this.bossText.style.position = "absolute"
            this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Slither.io</div>`
            this.bossText.style.left = (canvas.width / 2-200) + "px";
            this.bossText.style.top = (25 + bossBars.length * 75) + "px";
            this.bossText.style.zIndex = 2;
            this.bossText.style.transform = "translate(-50%, -50%)";
            this.bossText.id="bossText";
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
        this.delay=(79-bodyCount)*20;
        this.iFrame=0;
        this.explodeTimer=0;
        this.ignoreKnockback=true;
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
            if(this.dead){
                SnakeBoss.spawned=false;
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
            this.healTimer--;
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
        this.value = 750;
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
        this.bossText.id="bossText";
        //console.log(bossText.style.transform+" tradsnf");

        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.isHealing=false;
        this.healAbilityTimer=1200;
        this.stopTimer=0;
        this.healCooldown=10-10*(bossMultiplier-1)*0.5;
        this.healCooldown=Math.round(this.healCooldown);
        this.healAuraTimer=0;
        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;
        this.bossBar = new BossBar(this);
        bossBars.push(this.bossBar);
        
    }
    timer() {
        this.stopTimer--;
        this.healAuraTimer--;
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
            this.healAbilityTimer-=0.5;
        }
        else {
            this.shootTimer--;
            this.healAbilityTimer--;
        }
        if (this.shootTimer <= 0 && this.isHealing==false) {
            this.shootTimer = 300;
            this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4;
            enemyBullets.push(new HealerBossBullet(0,0,1,this.x+75,this.y+75,this));
            enemyBullets.push(new HealerBossBullet(0,0,1,this.x-75,this.y+75,this));
            enemyBullets.push(new HealerBossBullet(0,0,1,this.x+75,this.y-75,this));
            enemyBullets.push(new HealerBossBullet(0,0,1,this.x-75,this.y-75,this));
            enemyBullets.push(new HealerBossBullet2(5,0,1,this.x,this.y,this));
            enemyBullets.push(new HealerBossBullet2(0,5,1,this.x,this.y,this));
            enemyBullets.push(new HealerBossBullet2(-5,0,1,this.x,this.y,this));
            enemyBullets.push(new HealerBossBullet2(0,-5,1,this.x,this.y,this));
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
            if(RectCircleColliding(this, enemies[i], 375, this.x, this.y) && !enemies[i].isBoss){
                enemies[i].Heal(100);
            }
        }
        this.healAuraTimer=10;
        this.Heal(5);
    }
    draw() {
        if (this.dead) return;
        ctx.save();        
        ctx.globalAlpha=0.4;
        ctx.fillStyle="lightgreen"
        if(this.healAuraTimer>0){
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
class EngineerBoss extends Enemy {
    /*
    Idea: Builds towers (stationary enemies) based on time passed.
    1. Basic sentry that shoots bullets
    2. Laser tower that shoots lasers
    3. Bomb tower that shoots bombs
    4. Ice tower that slows player
    */
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/engineerBoss.webp';
        this.width = 150;
        this.height = 150;

        this.shootTimer = 480;
        this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4
        this.isBoss = true;
        this.value = 750;
        //console.log(this.image.style.transform+" transofrmer");


        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">The Paragon</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        this.bossText.id="bossText";

        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
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
            this.shootTimer = 390;
            this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4;
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
            let randomNum=Math.random()*10;
            if(randomNum<4){
                enemyBullets.push(new EngineerBullet(this.x, this.y, vx, vy, 1));
            }
            else if(randomNum<7){
                enemyBullets.push(new EngineerBullet(this.x, this.y, vx, vy, 2));
            }
            else if(randomNum<9){
                enemyBullets.push(new EngineerBullet(this.x, this.y, vx, vy, 3));
            }
            else if(randomNum<10){
                enemyBullets.push(new EngineerBullet(this.x, this.y, vx, vy, 4));
            }
        }
        //console.log(this.healCooldown)
    }
    move(){
        super.move();
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
    }
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();

    }
}
class FarmerBoss extends Enemy {
    /*
    Idea: Throws grass that bounce off walls and never dissapear until it dies.
    After it dies, spawns bessie the cow that charges at the player and eats the grass
    */
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/farmerBoss.webp';
        this.width = 150;
        this.height = 150;

        this.shootTimer = 480;
        this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4
        this.isBoss = true;
        this.value = 0;
        bossesLeft++;
        //console.log(this.image.style.transform+" transofrmer");


        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Farmer John</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        this.bossText.id="bossText";

        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
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
            this.shootTimer = 240;
            this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4;
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
            console.log(this.x+" "+this.y+" "+player.x+" "+player.y+" "+vx+" "+vy);
            enemyBullets.push(new FarmerBullet(this.x, this.y, 1, vx, vy));
        }
        //console.log(this.healCooldown)
    }
    move(){
        super.move();
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    takeDamage(bullet, index) {
        if(this.dead)return;
        super.takeDamage(bullet, index);
        if(this.dead){
            let temp=new FarmerBossCow(2, 100);
            temp.x=this.x;
            temp.y=this.y;
            enemies.push(temp);
        }
    }
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();

    }
}
class FarmerBossCow extends Enemy {
    /*
    Idea: Throws grass that bounce off walls and never dissapear until it dies.
    After it dies, spawns bessie the cow that charges at the player and eats the grass
    */
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/farmerBossCow.webp';
        this.width = 150;
        this.height = 150;

        this.shootTimer = 400;
        this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4
        this.isBoss = true;
        this.value = 750;
        bossesLeft++;
        //console.log(this.image.style.transform+" transofrmer");


        this.bossText = document.createElement("div");
        this.bossText.style.position = "absolute"
        this.bossText.innerHTML = `<div style=" color:red;pointer-events:none; font-size:30px; white-space: nowrap; font-family:'Black Ops One'; text-align:center;" id="bossTitle">Bessie</div>`
        this.bossText.style.left = (canvas.width / 2-200) + "px";
        this.bossText.style.top = (25 + bossBars.length * 75) + "px";
        this.bossText.style.zIndex = 2;
        this.bossText.style.transform = "translate(-50%, -50%)";
        this.bossText.id="bossText";

        this.upgradeIndicator = new Image();
        this.upgradeIndicator.src = "images/spawnerUpgrade.webp"
        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.health=Math.ceil(this.health*bossMultiplier);
        this.maxHealth = this.health;
        this.bossBar = new BossBar(this);
        bossBars.push(this.bossBar);
        this.numBullets=4;
        this.angle=0;
        
    }
    timer() {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            this.shootTimer = Math.max(30, 400/this.speed);
            this.shootTimer-=this.shootTimer*(bossMultiplier-1)*0.4;
            for(let i=0;i<this.numBullets;i++){
                this.angle+=Math.PI*2/this.numBullets;
                let vx = 8 * Math.cos(this.angle);
                let vy = 8 * Math.sin(this.angle);
                let temp=new EnemyBullet(vx, vy, 2, this.x, this.y);
                temp.width=30;
                temp.height=30;
                temp.image.src="images/farmerBossCowBullet.webp";
                enemyBullets.push(temp);
            }
            this.angle+=Math.PI/8;
        }
        //console.log(this.healCooldown)
    }
    move(){
        super.move();
        for(let i=0;i<enemyBullets.length;i++){
            if(enemyBullets[i] instanceof FarmerBullet && (enemyBullets[i].x - enemyBullets[i].width / 2) < (this.x + this.width / 2) &&
            (enemyBullets[i].x + enemyBullets[i].width / 2) > (this.x - this.width / 2) &&
            (enemyBullets[i].y - enemyBullets[i].height / 2) < (this.y + this.height / 2) &&
            (enemyBullets[i].y + enemyBullets[i].height / 2) > (this.y - this.height / 2)){
                floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,this.upgradeIndicator, "red"));
                enemyBullets[i].dead=true;
                this.speed+=0.25;
            }
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
    takeDamage(bullet, index) {
        super.takeDamage(bullet, index);
        if(this.dead){
            for(let i=0;i<enemyBullets.length;i++){
                if(enemyBullets[i] instanceof FarmerBullet){
                    enemyBullets[i].dead=true;
                }
            }
        }
    }
    special() {
        //console.log(this.frostAura.style.left);
        this.timer();

    }
}
class SentryEngineerEnemy extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.image.src = 'images/sentryEngineerEnemy.webp';
        this.value = 0;
        this.damage=0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.canSiphon = false;
        this.giveXP=false;
        this.ignoreKnockback=true;
        this.ignoreShield=true;
        this.iFrame=0;
        this.shootTimer=60;
        //console.log(this.shootTimer);
    }
    special(){
        this.timer();
    }
    timer(){
        this.redTimer--;
        this.healTimer--;
        this.iFrame--;
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        }
        if(this.shootTimer<=0){
            
            this.shootTimer = 60;
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
            let temp=new EnemyBullet(vx, vy, 1, this.x, this.y);
            temp.height=20;
            temp.width=20;
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
    move() {
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
}
class LaserEngineerEnemy extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.image.src = 'images/laserEngineerEnemy.webp';
        this.value = 0;
        this.damage=0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.canSiphon = false;
        this.giveXP=false;
        this.ignoreKnockback=true;
        this.ignoreShield=true;
        this.shootTimer=60;
        this.laser=null;
        this.iFrame=0;
        //console.log(this.shootTimer);
    }
    special(){
        this.timer();
    }
    timer(){
        this.redTimer--;
        this.healTimer--;
        this.iFrame--;
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        }
        if(this.shootTimer<=0 && this.laser==null){
            
            let distanceX = player.x - (this.x);
            let distanceY = player.y - (this.y);

            this.angle = Math.atan2(distanceY, distanceX);
            this.stage = 1;
            this.laser=new PermanentLaser(this.angle, this.x, this.y);
            enemyBullets.push(this.laser);

        }
    }
    takeDamage(a, b){
        super.takeDamage(a, b);
        if(this.dead && this.laser){
            this.laser.dead=true;
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
    move() {
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
}
class BombEngineerEnemy extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.image.src = 'images/bombEngineerEnemy.webp';
        this.value = 0;
        this.damage=0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.canSiphon = false;
        this.giveXP=false;
        this.ignoreKnockback=true;
        this.ignoreShield=true;
        this.iFrame=0;
        this.shootTimer=60;
        //console.log(this.shootTimer);
    }
    special(){
        this.timer();
    }
    timer(){
        this.redTimer--;
        this.healTimer--;
        this.iFrame--;
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        }
        if(this.shootTimer<=0){
            
            this.shootTimer = 240;
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
            let temp=new EnemyBomb(this.x, this.y, vx, vy, Math.sqrt(distance)/5);
            temp.height=40;
            temp.width=40;
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
    move() {
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
}
class IceEngineerEnemy extends Enemy {
    constructor(x, y, health) {
        super(0, health);
        this.image.src = 'images/iceEngineerEnemy.webp';
        this.value = 0;
        this.damage=0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.canSiphon = false;
        this.giveXP=false;
        this.ignoreKnockback=true;
        this.ignoreShield=true;
        this.iFrame=0;
        this.frostAura = new Image();
        this.frostAura.src = "images/frostAura.webp";
        this.frostAuraWidth = 500;
        this.frostAuraHeight = 500;
        //console.log(this.shootTimer);
    }
    special(){
        this.timer();
        
    }
    timer(){
        this.redTimer--;
        this.healTimer--;
        this.iFrame--;
        
        if (RectCircleColliding(this, player, 250, this.x, this.y)) {
            player.slowCountdown = Math.max(player.slowCountdown, 30);
        }
        for(let i=0;i<bullets.length;i++){
            if(RectCircleColliding(this, bullets[i], 250, this.x, this.y)){
                bullets[i].slowCountdown=30;
            }
        }
        if (this.dead) {
            player.slowed = false;
        }
    }
    draw() {
        ctx.globalAlpha=0.4;
        ctx.drawImage(this.frostAura, this.x - this.frostAuraWidth / 2, this.y - this.frostAuraHeight / 2, this.frostAuraWidth, this.frostAuraHeight);
        ctx.globalAlpha=1; 
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    move() {
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
}

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
                this.x += this.vx*2;
                this.y += this.vy*2;
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
            this.speed = 3*Enemy.speedMultiplier;
        }
    }
}
class ShieldEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/shieldEnemy.webp';
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
        this.ignoreKnockback=true;
        if (this.x < leftBorder-90) {
            this.offsetX = 60;
            this.offsetY = 0;
            this.width = 100;
        }
        if (this.x > rightBorder + 90) {
            this.offsetX = -60;
            this.offsetY = 0;
            this.width = 100;
        }
        if (this.y < topBorder-90) {
            this.image.src = 'images/shieldRotated.webp';
            this.offsetX = 0;
            this.offsetY = 60;
            this.height = 100;
        }
        if (this.y > bottomBorder + 90) {
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
        this.healTimer--;
    }
    takeDamage(bullet, index) {
        floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,0,"gray"));

    }
    CheckForCramming(){
    }
}
class TrapperEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/trapperEnemy.webp';
        this.shootTimer = 30;
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
            this.healTimer--;
        }
    }
    takeDamage(bullet, index) {
        let damage = bullet.damage * player.damageMultiplier;
        if(this.slowCountdown>0) damage*=player.slowedDamageMultiplier
        if(damage==0)return
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
        this.width = 75;
        this.height = 75;
        this.value = 150;
        this.ignoreKnockback=true;
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
        this.ignoreKnockback=true;
        this.ignoreShield=true;
        //console.log(this.shootTimer);
    }
    special(){
        this.timer();
    }
    timer(){
        this.redTimer--;
        this.healTimer--;
    }
    draw(){
        super.draw();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
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
        if(this.speed==0){ 
            this.ignoreKnockback=true;
        }
        else{
            this.ignoreKnockback=false;
        }
        super.move();
        this.speed = savedSpeed;
    }
    timer() {
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0 && this.chargeTimer < 0 && this.accelerationX<0.1 && this.accelerationY<0.1) {
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
            enemyBullets.push(this.orb)
        }
    }
    AddForce(a, b){
        super.AddForce(a,b);
        if(this.orb && this.shootTimer > 200)this.orb.dead=true;
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
            this.ignoreKnockback=true;
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
    draw(){
        super.draw();
        if(this.shootTimer<=0){

            ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
    takeDamage(a, b) {
        super.takeDamage(a, b);
        if (this.dead && this.shootTimer <= 0) {
            this.dead = false;
            this.health=0;
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
        this.width = 50;
        this.height = 50;
        this.value = 80;
        this.targetX = Math.random() * (canvas.width - canvas.width / 10) + canvas.width / 20;
        this.targetY = Math.random() * (canvas.height - canvas.height / 10) + canvas.height / 20;
        this.moveTimer = 240;
        this.trollTimer = -1;
        this.ignoreKnockback=true;
        this.ignoreShield=true;
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
        this.speed=6.5-(this.health/this.maxHealth)*15/4;
    }
    draw(){
        if(this.exploding) ctx.filter = 'hue-rotate(90deg)';
        super.draw();
        ctx.filter="none"
    }
    takeDamage(a, b){
        if(this.dead) return;
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
            this.healTimer=-1;
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
        this.healTimer=-1;
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
            this.speed = 3*Enemy.speedMultiplier;
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
        this.value=150;

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
class SplitterEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/splitterEnemy.webp';
        this.shootTimer = 60;
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
            this.shootTimer = 210;
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
            let temp=new SplitterBullet(vx, vy, 1, this.x - 5, this.y - 5, 4, 80);
            enemyBullets.push(temp)
        }
    }
    special() {
        this.timer();
    }
        
    
}
class TeleporterEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/teleporterEnemy.webp';
        this.value = 30;
        this.width=75;
        this.height=75;    
        //console.log(this.shootTimer);
    }
    timer() {
    }
    takeDamage(a, b){
        super.takeDamage(a, b)
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
        this.x+=vx;
        this.y+=vy;
    }
    special() {
        this.timer();
    }
        
    
}
class IceEnemy extends Enemy {
    constructor(speed, health) {
        super(speed, health);
        this.image.src = 'images/iceEnemy.webp';
        this.shootTimer = 60;
        this.value = 30;
        this.width=50;
        this.height=50;    
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
            this.shootTimer = 240;
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
            let temp=new EnemyBullet(vx, vy, 1, this.x, this.y);
            temp.width = 20;
            temp.height = 20;
            temp.image.src = "images/iceEnemyProjectile.webp";
            temp.frostbite = true;
            enemyBullets.push(temp)
        }
    }
    special() {
        this.timer();
    }
        
    
}
const ENEMYTYPES=[BasicEnemy,ShooterEnemy,AimingEnemy,HomingEnemy,TrapperEnemy,ZombieEnemy,ShieldEnemy,ChargingEnemy,GhostEnemy,PoisonEnemy,BlackHoleEnemy,MimicEnemy,BuilderEnemy,WindupEnemy,SpawnerEnemy,SelfDestructEnemy,MachineGunEnemy,SmokeBombEnemy,SplitterEnemy,TeleporterEnemy, IceEnemy];

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
        this.slowCountdown=0;
    }
    move() {
        this.slowCountdown--;
        if (this.slowed || this.slowCountdown>0) {
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
        if (this.x < leftBorder-20 || this.y < topBorder-20 || this.x > rightBorder + 20 || this.y >= bottomBorder + 20) {
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
class PiercingBullet extends Bullet{
    constructor(speedX, speedY, damage) {
        super(speedX, speedY, damage);
        this.width = 40;
        this.height = 40;
        this.width*=player.projectileSizeMultiplier;
        this.height*=player.projectileSizeMultiplier;
        this.image.src="images/bullet.webp";
        this.hitEnemies = new Set();
    }
    move(){
        
        this.slowCountdown--;
        if (this.slowed || this.slowCountdown>0) {
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
                if(!this.hitEnemies.has(enemies[i])){
                    enemies[i].takeDamage(this);
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }
        if (this.x < leftBorder-20 || this.y < topBorder-20 || this.x > rightBorder+ 20 || this.y >= bottomBorder+ 20) {
            this.dead = true;
        }
    }
    draw() {
        if (this.dead) return;
        ctx.save();
        ctx.filter="brightness(500%)"
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        

        ctx.restore();
    }
}
class BouncingBullet extends Bullet{
    constructor(speedX, speedY, damage) {
        super(speedX, speedY, damage);
        this.width = 40;
        this.height = 40;
        this.width*=player.projectileSizeMultiplier;
        this.height*=player.projectileSizeMultiplier;
        this.timer=900;
        this.image.src="images/bouncingBullet.webp";
        this.hitEnemies = new Set();
    }
    move(){
        this.timer--;
        
        this.slowCountdown--;
        if (this.slowed || this.slowCountdown>0) {
            this.x += this.speedX / 3;
            this.y += this.speedY / 3;
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        
        if (this.x < (this.width - 50) / 2+leftBorder) {
            this.x = (this.width - 50) / 2+leftBorder;
            this.speedX *= -1;
            this.hitEnemies=new Set();
        }
        if (this.y < (this.width - 50) / 2+topBorder) {
            this.y = (this.width - 50) / 2+topBorder;
            this.speedY *= -1;
            this.hitEnemies=new Set();
        }
        if (this.x > rightBorder - (this.width - 50) / 2) {
            this.x =rightBorder - (this.width - 50) / 2;
            this.speedX *= -1;
            this.hitEnemies=new Set();
        }
        if (this.y > bottomBorder - (this.width - 50) / 2) {
            this.y = bottomBorder - (this.width - 50) / 2;
            this.speedY *= -1;
            this.hitEnemies=new Set();
        }
        for (let i = enemies.length - 1; i >= 0; i--) {

            if (
                (enemies[i].x - enemies[i].width / 2) < (this.x + this.width / 2) &&
                (enemies[i].x + enemies[i].width / 2) > (this.x - this.width / 2) &&
                (enemies[i].y - enemies[i].height / 2) < (this.y + this.height / 2) &&
                (enemies[i].y + enemies[i].height / 2) > (this.y - this.height / 2) && enemies[i].ignoreBullets == false 
            ) {
                if(!this.hitEnemies.has(enemies[i])){
                    enemies[i].takeDamage(this);
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }
        if(this.timer<=0){
            this.dead=true;
        }
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
        
        this.slowCountdown--;
        if (this.slowed || this.slowCountdown>0) {
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
                if(player.iceBulletsPierce==false){
                    this.dead=true;
                }
            }
        }
        if (this.x < leftBorder-100 || this.y < topBorder-100 || this.x > rightBorder+ 100 || this.y >= bottomBorder+ 100) {
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
        this.damage=player.laserDamage;
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
        this.damage = player.bombDamage;
        this.hitEnemies = new Set();
        this.maxExplodeTimer=45;
        this.knockback=false;
    }
    move() {
        if (this.explodeTimer <= 0) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        this.shootTimer--;
        this.explodeTimer--;
        if (this.shootTimer == 0 && this.explodeTimer < 0) {
            this.explodeTimer = 75;
            this.image.src = "images/explosion.webp";
        }
        if (this.shootTimer > 0) {
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].ignoreBullets == false && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                    this.explodeTimer = this.maxExplodeTimer;
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
                    if(this.knockback){
                        let angle=Math.atan2((enemies[i].y-player.y),(enemies[i].x-player.x));
                        enemies[i].AddForce(25*Math.cos(angle), 25*Math.sin(angle));
                    }
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }

    }
}
class PlayerNuke extends PlayerBomb {
    constructor(x, y, speedX, speedY) {
        super(x, y, speedX/2, speedY/2);
        this.image.src = "images/playerNuke.webp";
        this.maxExplodeTimer=120;
        this.damage=player.bombDamage*2;
        this.shootTimer=240;
        this.knockback=true;
    }
    move(){
        super.move();
        
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
class Shockwave extends ExpandingCircle {
    constructor(x, y) {
        super(0, 0, 1);
        this.timer=30;
        this.height = 25;
        this.width = 25;
        this.image.src = "images/shockwave.webp";
        this.scale = 25;
    }
    move() {
        super.move();
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].ignoreBullets==false && RectCircleColliding(this, enemies[i], this.width / 2, this.x, this.y)) {
                let angle=Math.atan2((enemies[i].y-player.y),(enemies[i].x-player.x));
                enemies[i].AddForce(3*Math.cos(angle), 3*Math.sin(angle));
            }
        }


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
        this.damage=player.protectorDamage;
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
        this.hitEnemies = new Set();
    }
    move(){
        
        this.slowCountdown--;
        if (this.slowed || this.slowCountdown>0) {
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
                if(!this.hitEnemies.has(enemies[i])){
                    enemies[i].takeDamage(this);
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }
        if (this.x < leftBorder-100 || this.y < topBorder-100 || this.x > rightBorder+ 100 || this.y >= bottomBorder+ 100) {
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

            player.GainXP(this.size / 2 * (1+player.level*player.level/5*0.15));
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



//Tier 1: Enemy, ShooterEnemy, AimingEnemy, HomingEnemy
//Tier 2: ChargingEnemy, ShieldEnemy
//Boss: LaserBoss, IceBoss

const worldDiv = document.getElementById("world");

function RandomizeEnemies(numTier1, numTier2, numTier3, numTier1Boss, numTier2Boss) {
    bossesLeft = numTier1Boss+numTier2Boss;
    let tier1 = [1, 2, 3, 4, 5, 6, 7];
    let tier2 = [1, 2, 3, 4, 5, 6, 7];
    let tier3 = [1, 2, 3, 4, 5, 6, 7];
    let tier1Bosses = [1, 2, 3, 4, 5];
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
            case 7:
                IceEnemy.isActive = true;
                if (!IceEnemy.seen) {
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
            case 7:
                TeleporterEnemy.isActive = true;
                if (!TeleporterEnemy.seen) {
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
            case 7:
                SplitterEnemy.isActive = true;
                if (!SplitterEnemy.seen) {
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
                boss = new MageBoss(2.5, 100, true);
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
                if(SnakeBoss.spawned){
                    numTier2Boss++;
                    break;
                }
                boss = new SnakeBoss(2.5,300,true,79);
                enemies[enemies.length] = boss;
                if (!SnakeBoss.seen) {
                    SnakeBoss.seen = true;
                    newEnemyQueue.push("images/snakeBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 3:
                boss = new HealerBoss(1.5,175);
                enemies[enemies.length] = boss;
                if (!HealerBoss.seen) {
                    HealerBoss.seen = true;
                    newEnemyQueue.push("images/healingBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 4:
                boss = new EngineerBoss(1,175);
                enemies[enemies.length] = boss;
                if (!EngineerBoss.seen) {
                    EngineerBoss.seen = true;
                    newEnemyQueue.push("images/engineerBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
            case 5:
                boss = new FarmerBoss(2,75);
                enemies[enemies.length] = boss;
                if (!FarmerBoss.seen) {
                    FarmerBoss.seen = true;
                    newEnemyQueue.push("images/farmerBoss.webp");
                    isPlayerUnlocked.push(false);
                }
                break;
        }
    }

}
function DisableAllEnemies(){
    for(let i=0;i<ENEMYTYPES.length;i++){
        ENEMYTYPES[i].isActive=false;
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
    
    SplitterEnemy.baseTimer=900;
    SplitterEnemy.randomTimer=800;
    SplitterEnemy.index=18;
    SplitterEnemy.health=15;
    SplitterEnemy.speed=1.5;
    
    TeleporterEnemy.baseTimer=800;
    TeleporterEnemy.randomTimer=500;
    TeleporterEnemy.index=19;
    TeleporterEnemy.health=9;
    TeleporterEnemy.speed=2;
    
    IceEnemy.baseTimer=300;
    IceEnemy.randomTimer=300;
    IceEnemy.index=20;
    IceEnemy.health=3;
    IceEnemy.speed=1.5;
    
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
    if (page == "gamePage") {
        requestAnimationFrame(loop);
    }
}
function GameLogic() {
    //console.log("test");
    timeWarpCounter--;
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
    if(player.health<=0) ctx.filter = "grayscale(100%)";
    if(enableShrinking){
        leftBorder=initialLeftBorder+timeElapsed/6;
        rightBorder=initialRightBorder-timeElapsed/6;
        topBorder=initialTopBorder+timeElapsed/6;
        bottomBorder=initialBottomBorder-timeElapsed/6;
        if(isBossWave==false){
            leftBorder=initialLeftBorder+timeElapsed/3;
            rightBorder=initialRightBorder-timeElapsed/3;
            topBorder=initialTopBorder+timeElapsed/3;
            bottomBorder=initialBottomBorder-timeElapsed/3;
        }
    }
    ctx.drawImage(background, -50+leftBorder, -50+topBorder, rightBorder-leftBorder+100, bottomBorder-topBorder+100);
    if(gameOver==false){
        player.act();
        Actions();
        
    }
    ctx.fillStyle="black"

    for(let i=mapObjects.length-1;i>=0;i--){
        mapObjects[i].draw();
    }
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
    if(gameOver==false && !(timeWarpCounter>0 && TimeWarpIcon.version==1)){
        if (!isBossWave && timeElapsed >= waveTimer && !(gamemode==0 && TutorialText.canChangeWave==false) && !(gamemode==6 && currentWave==10 && bossBars.length>0)) {
            ChangeWave();
        }
        else if(gamemode==6 && bossBars.length==0){
            ChangeWave();
        }
        if (newEnemyQueue.length > 0 && gamemode!=0 && currentPage=="gamePage") {
            ChangePage("newEnemyPage");
        }
        xpBagTimer--;
        healthPotionSpawnTimer--;
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
    }
    if(gamemode==4){
        if(currentWave<=5 && player.level<currentWave*3){
            player.currentExp+=100000;
        }
        else if(currentWave>5 && currentWave<=7 && player.level<5*3+(currentWave-5)*2){
            player.currentExp+=100000;
        }
        else if(currentWave>7 && currentWave<=11 && player.level<5*3+(2)*2+(currentWave-7)){
            player.currentExp+=100000;
        }
    }
    if(gamemode==6){
        if(player.level<currentWave*3+1 && currentWave<=5){
            player.currentExp+=100000;
        }
        else if(currentWave>5 && player.level<5*3+1+(currentWave-5)*2){
            player.currentExp+=100000;
        }
    }
    if(gamemode==0){
        TutorialText.Update();
    }
    ctx.restore();
    //console.log(enemyBullets.length);


}
function Actions(){
    
    SpawnEnemies();

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].move();
        if (bullets[i].dead) {
            bullets.splice(i, 1);
        }
    }
    if((timeWarpCounter>0 && TimeWarpIcon.version==1)){
        return;
    }
    if (!(gamemode==0 && player.level<2) && xpBagTimer < 0) {
        xpBagTimer = Math.random() * 200 + 200;
        xpBagTimer /= 1 + timeElapsed * 0.0003;
        const newCollectable = new XPBag(Math.random() * (canvas.width - canvas.width / 10) + canvas.width / 20, Math.random() * (canvas.height - canvas.height / 10) + canvas.height / 20);
        collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    if (!(gamemode==0 && player.level<2) && healthPotionSpawnTimer < 0 ) {
        healthPotionSpawnTimer = Math.random() * 300 + 450;
        healthPotionSpawnTimer /= 1 + timeElapsed * 0.0003;
        healthPotionSpawnTimer*=healthPotionSpawnMultiplier;
        const newCollectable = new HealthPotion(Math.random() * (canvas.width - canvas.width / 10) + canvas.width / 20, Math.random() * (canvas.height - canvas.height / 10) + canvas.height / 20);
        collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    for(let i=mapObjects.length-1;i>=0;i--){
        mapObjects[i].act();
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].dead) {
            if (enemies[i].giveXP) {
                player.GainXP(enemies[i].value);
                if(chosenCharacter==5){
                    player.summonQueue.push(new SummonedEnemy(enemies[i].speed, enemies[i].maxHealth*0.5, enemies[i].width, enemies[i].image))
                }
            }
            if (enemies[i].isBoss) {
                let index=0;
                enemies[i].bossText.remove();
                for(let j=bossBars.length-1;j>=0;j--){
                    if(bossBars[j].owner.dead==true){
                        index=j;
                        bossBars[j].image1.remove();
                        bossBars[j].image2.remove();
                        bossBars.splice(j, 1);
                    }
                }
                for(let j=index;j<bossBars.length;j++){
                    bossBars[j].image1.style.top=(parseInt(bossBars[j].image1.style.top)-75)+"px";
                    bossBars[j].image2.style.top=(parseInt(bossBars[j].image2.style.top)-75)+"px";

                }
                bossTexts = document.querySelectorAll('[id$="bossText"]');
                for (let j = index; j < bossTexts.length; j++) {
                    bossTexts[j].style.top=(parseInt(bossTexts[j].style.top)-75)+"px";
                }
                bossesLeft--;
                if (bossesLeft == 0 && isBossWave) {
                    ChangeWave();
                }
            }
            enemies.splice(i, 1);
        }
        else {
            //console.log(enemies[i]);
            enemies[i].move();
            enemies[i].CheckForCramming();
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
    LavaTerrain.timer();
}
function SpawnEnemies() {
    if(gamemode==0 && currentWave==1 && timeElapsed<=840){
        return;
    }
    for(let i=0;i<ENEMYTYPES.length;i++){
        if(ENEMYTYPES[i].isActive){
            ENEMYTYPES[i].Spawn();
        }
    }
    
}
function ChangeWave() {
    if(currentWave==3 || currentWave==5 || currentWave==7){
        killedBoss=true;
    }
    currentWave++;
    waveText.Update();
    timeElapsed = 0;
    if(gamemode!=6){
        switch (currentWave) {
            case 2:
                if(gamemode==0){
                    RandomizeEnemies(2, 0, 0, 0, 0);
                }
                else RandomizeEnemies(2, 1, 0, 0, 0);
                isBossWave = false;
                SCALE = 0.0015;
                break;
            case 3:
                if(gamemode==0){
                    RandomizeEnemies(1, 1, 0, 1, 0);
                }
                else RandomizeEnemies(2, 1, 0, 1, 0);
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
                SCALE = 0.0015;
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
                    newEnemyQueue.push("images/necromancerPlayer.webp");
                    isPlayerUnlocked.push(true);
                }
                break;
            case 9:
                RandomizeEnemies(2, 2, 3, 0, 1);
                isBossWave = true;
                SCALE = 0.0007;
                break;
            case 10:
                RandomizeEnemies(2, 2, 1, 2, 0);
                isBossWave = true;
                SCALE = 0.0006;
                if(difficulty>1 && PheonixPlayer.unlocked==false){
                    PheonixPlayer.unlocked=true;
                    newEnemyQueue.push("images/pheonixPlayer.webp");
                    isPlayerUnlocked.push(true);
                }
                break;
            case 11:
                RandomizeEnemies(2, 2, 2, 1, 1);
                isBossWave = true;
                SCALE = 0.0006;
                break;
            case 12:
                EndGame(true);
                break;
        }
    }
    else{
        switch (currentWave) {
            case 2:
                RandomizeEnemies(0, 0, 0, 1, 0);
                break;
            case 3:
                RandomizeEnemies(0, 0, 0, 0, 1);
                break;
            case 4:
                RandomizeEnemies(0, 0, 0, 2, 0);
                break;
            case 5:
                RandomizeEnemies(0, 0, 0, 0, 2);
                break;
            case 6:
                RandomizeEnemies(0, 0, 0, 2, 1);
                break;
            case 7:
                RandomizeEnemies(0, 0, 0, 0, 3);
                break;
            case 8:
                RandomizeEnemies(0, 0, 0, 3, 1);
                break;
            case 9:
                RandomizeEnemies(0, 0, 0, 1, 3);
                break;
            case 10:
                RandomizeEnemies(0, 0, 0, 3, 2);
                break;
            case 11:
                RandomizeEnemies(0, 0, 0, 3, 3);
                break;
            case 12:
                EndGame(true);
                break;
        }
    }

    if(gamemode==3){
        mapObjects=[];
        mapObjects.push(new Wall(-55+leftBorder, -55+topBorder, (rightBorder-leftBorder)+110, 30));
        mapObjects.push(new Wall(-25+leftBorder, bottomBorder+25, (rightBorder-leftBorder)+80, 30));
        mapObjects.push(new Wall(-55+leftBorder, -25+topBorder, 30,(bottomBorder-topBorder)+80));
        mapObjects.push(new Wall(rightBorder+25, -25+topBorder, 30, (bottomBorder-topBorder)+70));
        CreateTiles();
    }
    else if(gamemode==5){
        upgradingEnemy=true;
        ChangePage("upgradePage", false);
    }
    SCALE*=scaleMultiplier
    originalScale=SCALE;
}

function ChangePage(id, reset) {
    if (continueFlag) return;
    //console.log(id);
    if ((gameOver && id == "upgradePage")) {
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
        chosenCharacter=0;
        let descriptionText=document.getElementById("descriptionText");
        descriptionText.innerText="";
        list = document.querySelectorAll('[id$="Player"]');
        for (let i = 0; i < list.length; i++) {
            list[i].style.border = "";
        }
        document.getElementById("startButton").disabled = true; 
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
        let pheonixPlayerButton=document.getElementById("pheonixPlayer");
        let pheonixPlayerImage=document.getElementById("pheonixPlayerImage");
        let pheonixPlayerText=document.getElementById("pheonixPlayerText");
        if(PheonixPlayer.unlocked==false){
            pheonixPlayerButton.style.pointerEvents="none";
            pheonixPlayerImage.src="images/black.webp";
            pheonixPlayerText.textContent="Beat level 9 in Medium, Hard, or Extreme Demon Difficulty to Unlock";
            pheonixPlayerText.style.fontSize="20px";
            pheonixPlayerText.style.top="150px";
        }
        else{
            pheonixPlayerButton.style.pointerEvents="auto";
            pheonixPlayerImage.src="images/pheonixPlayer.webp";
            pheonixPlayerText.textContent="Pheonix";
            pheonixPlayerText.style.fontSize="30px";
            pheonixPlayerText.style.top="225px";
        }
    }
    else if(id=="gamemodeSelectionPage"){
    
        let gamemodeDescriptionText=document.getElementById("gamemodeDescriptionText");
        gamemodeDescriptionText.innerText="";
        list = document.querySelectorAll('[id$="gamemodeSelectionButton"]');
        for (let i = 0; i < list.length; i++) {
            list[i].style.border = "";
        }
        document.getElementById("difficultyConfirmationButton").disabled=true;
    }
    else if(id=="settingsPage"){
        let temp=""
        if(showHealthBars){
            temp="ON"
        }
        else{
            temp="OFF"
        }
        document.getElementById("healthBarSetting").innerText="Show Healthbars: "+temp;
    }
    else if(id=="enemyDescriptionSelectionPage"){
        
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
        if(SplitterEnemy.seen){
            images[26].src="images/splitterEnemy.webp";
            images[26].style.pointerEvents="auto";
        }
        if(TeleporterEnemy.seen){
            images[27].src="images/teleporterEnemy.webp";
            images[27].style.pointerEvents="auto";
        }
        if(IceEnemy.seen){
            images[28].src="images/iceEnemy.webp";
            images[28].style.pointerEvents="auto";
        }
        if(EngineerBoss.seen){
            images[29].src="images/engineerBoss.webp";
            images[29].style.pointerEvents="auto";
        }
        if(FarmerBoss.seen){
            images[30].src="images/farmerBoss.webp";
            images[30].style.pointerEvents="auto";
        }
    }
    else if (id == "gamePage") {
        if(choice1){
            choice1.remove();
        }
        if(choice2){
            choice2.remove();
        }
        if(choice3){
            choice3.remove();
        }
        if (reset) Start();
        else {
            lastTime = Date.now();
            loop();
        }
    }
    else if (id == "upgradePage") {
        paused = true;
        choice1 = document.createElement("div");
        choice2 = document.createElement("div");
        choice3 = document.createElement("div");
        if(upgradingEnemy==true){
            document.getElementById("upgradeText").style.color="red";
            document.getElementById('upgradeText').textContent="Pick Your Poison";
            Enemy.healthMultiplier=1;
            Enemy.speedMultiplier=1;
            player.slowCountdown=0;
            if(player.maxHealthHalved){
                player.maxHealth=player.originalMaxHealth;
                player.maxHealthHalved=false;
                player.healMultiplier*=2;
            }
            player.canHeal=true;
            player.constantDamageAmount=0;
            let randomNum = Math.floor(Math.random() * NUMENEMYUPGRADES);
            choice1.innerHTML=`<button onmouseover="this.style.backgroundColor='#65000B'" onmouseout="this.style.backgroundColor='#9B111E'" onclick="${ENEMYUPGRADES[randomNum].onclick}" style="position:absolute;left:${screen.width/2-200}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:#9B111E; font-size:150%;font-family:'black ops one'" id="upgrade">${ENEMYUPGRADES[randomNum].text}</button>`;

            let randomNum2 = Math.floor(Math.random() * NUMENEMYUPGRADES);
            while (randomNum == randomNum2) {
                randomNum2 = Math.floor(Math.random() * NUMENEMYUPGRADES);
            }
            choice2.innerHTML=`<button onmouseover="this.style.backgroundColor='#65000B'" onmouseout="this.style.backgroundColor='#9B111E'" onclick="${ENEMYUPGRADES[randomNum2].onclick}" style="position:absolute;left:${screen.width/2+200}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:#9B111E; font-size:150%;font-family:'black ops one'" id="upgrade">${ENEMYUPGRADES[randomNum2].text}</button>`;
            isLevelling=false;
            upgradingEnemy=false;
        }
        else if(killedBoss==false){
            document.getElementById("upgradeText").style.color="white";
            document.getElementById('upgradeText').textContent="Choose Your Upgrade";
            let randomNum = Math.floor(Math.random() * NUMUPGRADES);
            while (boughtUpgrades[randomNum] == 1) {
                randomNum = Math.floor(Math.random() * NUMUPGRADES);
            }
            choice1.innerHTML=`<button onmouseover="this.style.backgroundColor='#00CCFF'" onmouseout="this.style.backgroundColor='cyan'" onclick="${UPGRADES[randomNum].onclick}" style="position:absolute;left:${screen.width/2-400}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:cyan; font-size:150%;font-family:'black ops one'" id="upgrade">${UPGRADES[randomNum].text}</button>`;

            let randomNum2 = Math.floor(Math.random() * NUMUPGRADES);
            while (randomNum == randomNum2 || boughtUpgrades[randomNum2] == 1) {
                randomNum2 = Math.floor(Math.random() * NUMUPGRADES);
            }
            choice2.innerHTML=`<button onmouseover="this.style.backgroundColor='#00CCFF'" onmouseout="this.style.backgroundColor='cyan'" onclick="${UPGRADES[randomNum2].onclick}" style="position:absolute;left:${screen.width/2}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:cyan; font-size:150%;font-family:'black ops one'" id="upgrade">${UPGRADES[randomNum2].text}</button>`;
            
            let randomNum3 = Math.floor(Math.random() * NUMUPGRADES);
            while (randomNum == randomNum3 || randomNum3==randomNum2 || boughtUpgrades[randomNum3] == 1) {
                randomNum3 = Math.floor(Math.random() * NUMUPGRADES);
            }
            choice3.innerHTML=`<button onmouseover="this.style.backgroundColor='#00CCFF'" onmouseout="this.style.backgroundColor='cyan'" onclick="${UPGRADES[randomNum3].onclick}" style="position:absolute;left:${screen.width/2+400}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:cyan; font-size:150%;font-family:'black ops one'" id="upgrade">${UPGRADES[randomNum3].text}</button>`;
            document.body.appendChild(choice3);
            isLevelling=false;
        }
        else{
            document.getElementById("upgradeText").style.color="yellow";
            document.getElementById('upgradeText').textContent="Choose Your Upgrade";
            let randomNum = Math.floor(Math.random() * NUMTIER2UPGRADES);
            while (boughtTier2Upgrades[randomNum] == 1) {
                randomNum = Math.floor(Math.random() * NUMTIER2UPGRADES);
            }
            choice1.innerHTML=`<button onmouseover="this.style.backgroundColor='#E4D00A'" onmouseout="this.style.backgroundColor='yellow'" onclick="${TIER2UPGRADES[randomNum].onclick}" style="position:absolute;left:${screen.width/2-200}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:yellow; font-size:150%;font-family:'black ops one'" id="upgrade">${TIER2UPGRADES[randomNum].text}</button>`;

            let randomNum2 = Math.floor(Math.random() * NUMTIER2UPGRADES);
            while (randomNum == randomNum2 || boughtTier2Upgrades[randomNum2] == 1) {
                randomNum2 = Math.floor(Math.random() * NUMTIER2UPGRADES);
            }
            choice2.innerHTML=`<button onmouseover="this.style.backgroundColor='#E4D00A'" onmouseout="this.style.backgroundColor='yellow'" onclick="${TIER2UPGRADES[randomNum2].onclick}" style="position:absolute;left:${screen.width/2+200}px;transform:translateX(-50%);top:30%;width:15%;height:30%;z-index:3;background-color:yellow; font-size:150%;font-family:'black ops one'" id="upgrade">${TIER2UPGRADES[randomNum2].text}</button>`;
            killedBoss=false;
        }
        document.body.appendChild(choice1);
        document.body.appendChild(choice2);
    }
    else if (id == "newEnemyPage") {
        newEnemyText(newEnemyQueue[0]);
        newEnemyQueue.splice(0, 1);
    }
    else if (id == "controlsPage") {
        list = document.querySelectorAll('[id$="ControlButton"]');
        list[0].innerText=controls["left"].toUpperCase();
        list[1].innerText=controls["right"].toUpperCase();
        list[2].innerText=controls["up"].toUpperCase();
        list[3].innerText=controls["down"].toUpperCase();
        list[4].innerText=controls["ability1"].toUpperCase();
        list[5].innerText=controls["ability2"].toUpperCase();
        list[6].innerText=controls["ability3"].toUpperCase();
        list[7].innerText=controls["ability4"].toUpperCase();
        list[8].innerText=controls["ability5"].toUpperCase();
        list[9].innerText=controls["levelUp"].toUpperCase();
        list[10].innerText=controls["skipWave"].toUpperCase();
        list[11].innerText=controls["dealDamage"].toUpperCase();
    }
}

async function EndGame(win) {
    gameOver=true;
    if(gamemode==0){
        EndTutorial();
        return;
    }
    if(win){
        await delay(1500);
    }
    else{
        
        await delay(3000);
    }
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
    if(document.getElementById("pheonixIcon")){
        document.getElementById("pheonixIcon").remove()
    }
    if(document.getElementById("pheonixText")){
        document.getElementById("pheonixText").remove()
    }
    if(document.getElementById("modifierText")){
        document.getElementById("modifierText").remove();
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
