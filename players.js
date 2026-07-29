
class Player {
    static unlocked=false;
    constructor(health) {
        this.image = new Image();
        this.image.src="images/player.webp";
        this.speed = 5;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
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
        this.healMultiplier=1;
        this.attackSpeedMultiplier=1;
        this.projectileSizeMultiplier=1;
        this.collisionDamageMultiplier=1;
        this.iceBulletsPierce=false;
        this.rebirth=0;
        this.rebirthTimer=0;
        this.windProjectiles=0;
        this.windProjectileCooldown=60;
        this.slowedDamageMultiplier=1;
        this.bombDamage=4;
        this.laserDamage=1;
        this.maxHealthHalved=false;
        this.originalMaxHealth=this.maxHealth;
        this.canHeal=true;
        this.constantDamageAmount=0;
        this.constantDamageTimer=150;
        this.bouncingProjectiles=0;
        this.bouncingProjectileCooldown=0;
        this.bouncingProjectileMaxCooldown = 120;
        this.protectorDamage=1;
    }
    takeDamage(damage, bullet) {
        if(this.rebirthTimer>0){
            return;
        }
        console.log(bullet);
        console.log(damage);
        if(gameOver)return;
        if(bullet!=null && bullet.isEnemy){
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
        if (bullet!=null && bullet.frostbite) {
            this.slowCountdown = Math.max(this.slowCountdown, 120);
        }
        this.redTimer = 10;
        if(this.health<=0 && this.rebirth>0){
            bullets.push(new Shockwave(this.x, this.y));
            this.health=this.maxHealth/2;
            this.rebirth--;
            this.rebirthTimer=300;
        }
    }
    act() {
        if(gameOver)return;
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
                    bullets[bullets.length] = new FrostBullet(vx, vy, 1);
                }
                else {
                    bullets[bullets.length] = new FrostBullet(5, 0, 1);
                }

            }
            else {
                bullets[bullets.length] = new FrostBullet(5, 0, 1);
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
                    bullets[bullets.length] = new BouncingBullet(vx, vy, 1);
                }
                else {
                    bullets[bullets.length] = new BouncingBullet(10, 0, 1);
                }

            }
            else {
                bullets[bullets.length] = new BouncingBullet(10, 0, 1);
            }

        }
        if(this.windProjectiles>0 && chosenCharacter!=4 && this.windProjectileCooldown<0){
            this.windProjectileCooldown=60;
            let angle = 0;
            for (let i = 0; i < this.windProjectiles; i++) {
                let temp=new WindBullet(10 * Math.cos(angle), 10 * Math.sin(angle), 0);
                bullets[bullets.length] = temp;
                angle += 2 * Math.PI / this.windProjectiles;
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

        if (this.x < leftBorder) this.x = leftBorder;
        if (this.y < topBorder) this.y = topBorder;
        if (this.x > rightBorder) this.x = rightBorder;
        if (this.y > bottomBorder) this.y = bottomBorder;
        if (this.slowed || this.slowCountdown > 0) this.speed *= 2;
        if (timeWarpCounter > 0) {
            this.speed /= 2;
        }
        if (this.passiveHealingTimer <= 0 && this.passiveHealing > 0) {
            this.passiveHealingTimer = 300;

            this.Heal(this.passiveHealing);
        }
        if (this.constantDamageTimer <= 0 && this.constantDamageAmount > 0) {
            this.constantDamageTimer = 240;

            this.takeDamage(this.constantDamageAmount, null);
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
        else if(this.healTimer>0){
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
        if(!this.canHeal)return;
        amount*=this.healMultiplier;
        this.health = Math.min(this.maxHealth, this.health+amount);
        floatingObjects.push(new FloatingObject(this.x-this.width/2+Math.random()*this.width,this.y,amount,"green"));

    }
    GainXP(amount){
        if(gamemode==4)return;
        this.currentExp+=amount*this.xpMultiplier;
    }
}
class BasicPlayer extends Player{
    constructor(health){
        super(health);
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
    constructor(health){
        super(health);
        this.width=65;
        this.height=65;
        this.speed=3.5;
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
        if(movingLeft){
            this.image.src=this.normalImage;
        }
        else if(movingRight){
            this.image.src=this.mirroredImage;
        }
        this.shieldTimer--;
        if(this.shieldTimer<=0){
            if(boughtUpgrades[14]==0){
                bullets.push(new PlayerShield());
                boughtUpgrades[14]=1;
            }
            else{
                playerShield.health=playerShield.maxHealth;
                shieldBar.Update();
            }
            this.shieldTimer=1800;
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
    constructor(health){
        super(health);
        this.speed=4.5;
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
    constructor(health){
        super(health);
        this.attackSpeed=5;
        this.mode=1;
        
        boughtUpgrades[0]=1;
        boughtUpgrades[2]=1;
        boughtUpgrades[11]=1;
        boughtTier2Upgrades[0]=1;
        boughtTier2Upgrades[2]=1;
        boughtUpgrades[17]=0;
        boughtUpgrades[18]=0;
        boughtUpgrades[20]=0;
        boughtUpgrades[22]=0;
        this.fireDamage=0.5;
        this.tornadoDamage=0;
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
            
            for (let i = 0; i < 4; i++) {
                let temp=new FrostBullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage);
                temp.image.src="images/playerIceBullet.webp"
                temp.width=30;
                temp.height=30;
                temp.width*=player.projectileSizeMultiplier;
                temp.height*=player.projectileSizeMultiplier;
                bullets[bullets.length] = temp;
                angle += 2 * Math.PI / 4;
            }
        }
        else if(this.mode==3){
            let angle = Math.PI/4;
            for (let i = 0; i < this.projectiles; i++) {
                let temp=new WindBullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.tornadoDamage);
                bullets[bullets.length] = temp;
                angle += 2 * Math.PI / this.projectiles;
            }
        }
    }
}
class NecromancerPlayer extends Player{
    constructor(health){
        super(health);
        this.image.src="images/necromancerPlayer.webp";
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
class PheonixPlayer extends Player{
    //has 10 revives but has low base health that cannot be increased
    constructor(health){
        super(health);
        this.width=50;
        this.height=50;
        this.speed=6;
        this.attackSpeed=75;
        this.nextLevel=150;
        this.damage=1;
        this.rebirth=1;
        this.image.src="images/pheonixPlayer.webp"
        new RebirthsIcon(50);
        boughtUpgrades[1]=1;
        boughtTier2Upgrades[1]=1;
    }
    act(){
        
        document.getElementById("pheonixText").textContent="x"+this.rebirth;
        if (this.bulletCooldown <= 0) {
            this.bulletCooldown = this.attackSpeed;
            this.Attack();
        }
        super.act();
    }
    Attack(){
        
        let angle = 0;
        for (let i = 0; i < this.projectiles; i++) {
            let temp=new PiercingBullet(10 * Math.cos(angle), 10 * Math.sin(angle), this.damage);
            bullets[bullets.length] = temp;
            angle += 2 * Math.PI / this.projectiles;
        }
    }
}