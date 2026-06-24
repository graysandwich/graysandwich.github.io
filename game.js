class Enemy{    
    static isActive=false;
    static seen=false;
    constructor(speed, health){
        this.image=document.createElement("img");
        this.image.src='images/enemy.webp';
        this.speed=speed;
        this.health=health;
        this.isBoss=false;
        this.value=30;
        if(Math.random()<0.5){
            this.y=Math.random()*screen.height;
            if(Math.random()<0.5){
                this.x=-200;
            }
            else{
                this.x=screen.width+200;
            }
        }
        else{
            this.x=Math.random()*screen.width;
            if(Math.random()<0.5){
                this.y=-200;
            }
            else{
                this.y=screen.height+200;
            }
        }
        this.image.style.position = 'absolute';
        this.image.width = 50;
        this.image.height = 50;
        this.ignoreBullets=false;
        this.image.style.width = "50px";
        this.image.style.height = "50px";
        this.image.style.left=(this.x)+"px";
        this.image.style.top=(this.y)+"px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.style.zIndex=0;
        this.redTimer=0;
        this.slowCountdown=-1;
        this.canSiphon=true;
        console.log(this.image);
        document.getElementById("world").appendChild(this.image);
    }
    move(){
        let distanceX=Math.abs(this.x-player.x);
        let distanceY=Math.abs(this.y-player.y);
        if(this.slowCountdown>0){
            this.speed/=2;
        }
        if(distanceX==0){
            if(this.y>player.y){
                this.y-=this.speed;
            }
            if(this.y<player.y){
                this.y+=this.speed;
            }
        }
        else{
            let angle=Math.atan(distanceY/distanceX);
            if(this.x>player.x){
                this.x-=this.speed*Math.cos(angle);
            }
            if(this.y>player.y){
                this.y-=this.speed*Math.sin(angle);
            }
            if(this.x<player.x){
                this.x+=this.speed*Math.cos(angle);
            }
            if(this.y<player.y){
                this.y+=this.speed*Math.sin(angle);
            }
            //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
        }
        
        this.image.style.left=this.x+"px";
        this.image.style.top=this.y+"px";
        //console.log(this.redTimer);
        if(this.slowCountdown>0){
            this.speed*=2;
            this.slowCountdown--;
        }
        this.checkForCollisions();
        this.changeColor();
    }
    checkForCollisions(){
        
        if (
                (player.x - player.image.width / 2) < (this.x + this.image.width / 2) && 
                (player.x + player.image.width / 2) > (this.x - this.image.width / 2) && 
                (player.y - player.image.height / 2) < (this.y + this.image.height / 2) && 
                (player.y + player.image.height / 2) > (this.y - this.image.height / 2) && !this.dead
            ){
            if(this.isBoss) player.takeDamage(this.health, this);
            else player.takeDamage(Math.min(5,this.health), this);
            
            this.dead=true;
        }
    }
    changeColor(){
        
        if(this.redTimer<=0){
            if(this.slowCountdown<=0){
                this.image.style.filter="brightness(100%)";
            }
            else{
                this.image.style.filter="brightness(50%)";
            }
        }
        else{
            this.image.style.filter="sepia(100%) saturate(500%) hue-rotate(320deg)";
            this.redTimer--;
        }
    }
    special(){
    }
    takeDamage(bullet, index){
        this.health-=bullet.damage;
        //console.log(this.health);
        let damageText=document.createElement("div");
        damageText.style.position="absolute";
        if(bullet.frostbite){
            damageText.innerHTML=`<div style="position:absolute; color:cyan;pointer-events:none; font-size:30px" >${bullet.damage}</div>`
            this.slowCountdown=200;
        }
        else{
            damageText.innerHTML=`<div style="position:absolute; color:orange;pointer-events:none; font-size:30px" >${bullet.damage}</div>`
        }
        damageText.style.left=(this.x-this.image.width/2+Math.random()*this.image.width)+"px";
        damageText.style.top=(this.y)+"px";
        damageText.style.zIndex=2;
        document.getElementById("world").appendChild(damageText);
        moveText(damageText, 0, parseInt(damageText.style.top));
        this.redTimer=10;

        if(this.health<=0)this.dead=true;
        if(this.isBoss){
            this.bossBar.Update();
        }
        if(this.dead){
            if(player.siphon>0 && this.canSiphon){
                player.health=Math.min(player.maxHealth, player.health+player.siphon);
                let damageText=document.createElement("div");
                damageText.style.position="absolute"
                damageText.innerHTML=`<div style="position:absolute; color:green;pointer-events:none; font-size:30px" >${player.siphon}</div>`
                
                damageText.style.left=(player.x-player.image.width/2+Math.random()*50)+"px";
                damageText.style.top=player.y+"px";
                document.getElementById("world").appendChild(damageText);
                moveText(damageText, 0, parseInt(damageText.style.top));
            }
            if(this.isBoss){
                this.bossBar.image1.remove();
                this.bossBar.image2.remove();
                this.bossText.remove();
                bossesLeft--;
                if(bossesLeft==0){
                    ChangeWave();
                }
                if(this.frostAura){
                    player.slowed=false;
                    this.frostAura.remove();
                }
            }
            if(enemies[index] && enemies[index].image){
                //enemies[index].image.remove();
                if(enemies[index].shield){
                    enemies[index].shield.image.remove();
                    enemies[index].shield.dead=true;
                }
            }
            
        }
    }
}
class BasicEnemy extends Enemy{
    constructor(speed, health){
        super(speed, health);
    }
}
class LaserBoss extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.maxHealth=health;
        this.image.src='images/laserBoss.webp';
        this.image.width=150;
        this.image.height=150;
        
        this.image.style.width = "150px";
        this.image.style.height = "150px";
        this.shootTimer=400;
        this.isBoss=true;
        this.value=500;
        this.image.style.zIndex=1;
        
        this.bossText=document.createElement("div");
        this.bossText.style.position="absolute"
        this.bossText.innerHTML=`<div style=" color:red;pointer-events:none; font-size:30px;text-align:center; white-space: nowrap; font-family:'Black Ops One';" id="bossTitle">Nvidia</div>`
        this.bossText.style.left=(screen.width/2)+"px";
        this.bossText.style.top=(25+bossBars.length*75)+"px";
        this.bossText.style.zIndex=2;
        this.bossText.style.transform="translate(-50%, -50%)";
        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.stage=0;
        this.stageTimer=0;

        this.bossBar=new BossBar(this);
        bossBars.push(this.bossBar);
    }
    timer(){
        this.speedTimer--;
        if(this.stage>0){
            if(this.slowCountdown>0){
                this.stageTimer+=0.5;
            }
            else{
                this.stageTimer++;
            }
            if(this.stageTimer>=20){
                this.stage++;
                enemyBullets.push(new Laser(this.angle+(1.2-this.stage*0.2), this.x, this.y));
                enemyBullets.push(new Laser(this.angle-(1.2-this.stage*0.2), this.x, this.y));
                this.stageTimer=0;
            }
            if(this.stage==5)this.stage=0;
        }
        if(this.speedTimer<=0){
            this.speed=1;
        }
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=400;
            let distanceX = player.x-(this.x);
            let distanceY = player.y-(this.y);

            this.angle = Math.atan2(distanceY, distanceX);
            this.stage=1;
            enemyBullets.push(new Laser(this.angle+1.2, this.x, this.y));
            enemyBullets.push(new Laser(this.angle-1.2, this.x, this.y));
            this.speed=0;
            this.speedTimer=300;
        }
    }
    special(){
        this.timer();
        if(this.x>player.x){
            this.image.style.transform="scaleX(-1)";
        }
        else{
            this.image.style.transform="scaleX(1)";
        }
        this.image.style.left=(this.x-this.image.width/2)+"px";
        this.image.style.top=(this.y-this.image.width/2)+"px";
    }
}
class IceBoss extends Enemy{    
    /*
    Idea: Frost circle that slows player and slows player bullets
    Ice wall that slowly shrinks over time to force player closer
    */
    constructor(speed, health){
        super(speed,health);
        this.maxHealth=health;
        this.image.src='images/iceBoss.webp';
        this.image.width=150;
        this.image.height=150;
        
        this.image.style.width = "150px";
        this.image.style.height = "150px";
        this.shootTimer=350;
        this.isBoss=true;
        this.value=500;
        this.image.style.zIndex=1;
        this.image.style.transform = "translate(-50%, -50%)";
        //console.log(this.image.style.transform+" transofrmer");

        this.frostAura=document.createElement("img");
        this.frostAura.src="images/frostAura.webp";
        this.frostAura.style.width="750px";
        this.frostAura.style.height="750px";
        this.frostAura.style.left=(this.x)+"px";
        this.frostAura.style.top=(this.y)+"px";
        this.frostAura.style.zIndex=-2;
        this.frostAura.style.position="absolute"
        this.frostAura.style.transform = "translate(-50%, -50%)";
        document.getElementById("world").appendChild(this.frostAura);

        this.bossText=document.createElement("div");
        this.bossText.style.position="absolute"
        this.bossText.innerHTML=`<div style=" color:red;pointer-events:none; font-size:30px;text-align:center; white-space: nowrap; font-family:'Black Ops One';" id="bossTitle">Job Application</div>`
        this.bossText.style.left=(screen.width/2)+"px";
        this.bossText.style.top=(25+bossBars.length*75)+"px";
        this.bossText.style.zIndex=2;
        this.bossText.style.transform="translate(-50%, -50%)";
        //console.log(bossText.style.transform+" tradsnf");
        
        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.stage=0;
        this.stageTimer=0;
        
        this.bossBar=new BossBar(this);
        bossBars.push(this.bossBar);
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=250;

            enemyBullets.push(new Icicle(0,5,3,this.x,this.y,20,40));
            enemyBullets.push(new Icicle(5,0,3,this.x,this.y,40,20));
            enemyBullets.push(new Icicle(0,-5,3,this.x,this.y,20,40));
            enemyBullets.push(new Icicle(-5,0,3,this.x,this.y,40,20));
        }
        if(this.dead){
            player.slowed=false;
            if(this.frostAura) this.frostAura.remove();
        }
    }
    takeDamage(bullet, index){
        super.takeDamage(bullet, index);
        if(this.dead==true){
            player.slowed=false;
            this.frostAura.remove();
        }
    }
    move(){
        super.move();
    }
    special(){
        //console.log(this.frostAura.style.left);
        this.timer();
        this.frostAura.style.left=(this.x)+"px";
        this.frostAura.style.top=(this.y)+"px";
        if(RectCircleColliding(this, player,375, this.x, this.y)){
            player.slowed=true;
        }
        else{
            player.slowed=false;
        }
        for(let i=0;i<bullets.length;i++){
            if(RectCircleColliding(this, bullets[i],375, this.x, this.y)){
                bullets[i].slowed=true;
            }
            else{
                bullets[i].slowed=false;
            }
        }
        this.image.style.left=(this.x)+"px";
        this.image.style.top=(this.y)+"px";
        if(this.dead){
            player.slowed=false;
            if(this.frostAura) this.frostAura.remove();
        }

    }
}
class BouncyBoss extends Enemy{    
    /*
    Idea: Fast but bounces off of walls, gets slightly faster after each bounce
    */
    constructor(speed, health, first){
        super(speed,health);
        this.maxHealth=health;
        this.first=first;
        this.image.style.zIndex=1;
        this.image.style.transform = "translate(-50%, -50%)";
        //console.log(this.image.style.transform+" transofrmer");

        this.spawnTimer=0;
        this.iFrame=0;
        if(this.first){
            this.speedX=speed/1.4;
            this.speedY=speed/1.4;
            this.image.src='images/bouncyBoss.webp';
            this.image.width=150;
            this.image.height=150;
            this.image.style.width = "150px";
            this.image.style.height = "150px";
            this.value=500;
            this.isBoss=true;
            this.damage=2;
            this.force=15;
            this.bossText=document.createElement("div");
            this.bossText.style.position="absolute"
            this.bossText.innerHTML=`<div style=" color:red;pointer-events:none; font-size:30px;text-align:center; white-space: nowrap; font-family:'Black Ops One';" id="bossTitle">Legally Distinct Thwomp</div>`
            this.bossText.style.left=(screen.width/2)+"px";
            this.bossText.style.top=(25+bossBars.length*75)+"px";
            this.bossText.style.zIndex=2;
            this.bossText.style.transform="translate(-50%, -50%)";
            document.body.appendChild(this.bossText);
            
            this.bossBar=new BossBar(this);
            bossBars.push(this.bossBar);
        }
        else{
            let angle=Math.random()*Math.PI/2;
            this.speedX=speed*Math.sin(angle);
            this.speedY=speed*Math.cos(angle);
            this.image.src='images/bouncyMinion.webp';
            this.value=0;
            this.image.width=75;
            this.image.height=75;
            this.image.style.width = "75px";
            this.image.style.height = "75px";
            this.damage=1;
            this.force=10;
        }
        this.image.style.border = "10px solid blue";

        //console.log(bossText.style.transform+" tradsnf");
        
    }
    timer(){
    }
    takeDamage(bullet, index){
        super.takeDamage(bullet, index);
    }
    move(){
        this.spawnTimer++;
        if(this.slowCountdown>0){
            this.speedX/=2;
            this.speedY/=2;
        }
        this.x+=this.speedX;
        this.y+=this.speedY;
        if(this.slowCountdown>0){
            this.speedX*=2;
            this.speedY*=2;
        }
        if(this.x<(this.image.width-50)/2){
            this.x=(this.image.width-50)/2;
            this.speedX*=-1.03;
            this.speedY*=1.03;
            this.makeClone();
        }
        if(this.y<(this.image.width-50)/2){
            this.y=(this.image.width-50)/2;
            this.speedX*=1.03;
            this.speedY*=-1.03;
            this.makeClone();
        }
        if(this.x>screen.width-(this.image.width-50)/2){
            this.x=screen.width-(this.image.width-50)/2;
            this.speedX*=-1.03;
            this.speedY*=1.03;
            this.makeClone();
        }
        if(this.y>screen.height-(this.image.width-50)/2){
            this.y=screen.height-(this.image.width-50)/2;
            this.speedX*=1.03;
            this.speedY*=-1.03;
            this.makeClone();
        }
        if(this.speedX<0){
            this.speedX=Math.max(this.speedX, -15);
        }
        else{
            this.speedX=Math.min(this.speedX, 15);
        }
        if(this.speedY<0){
            this.speedY=Math.max(this.speedY, -15);
        }
        else{
            this.speedY=Math.min(this.speedY, 15);
        }
        this.image.style.left=this.x+"px";
        this.image.style.top=this.y+"px";

        if (
            (player.x - player.image.width / 2) < (this.x + this.image.width / 2) && 
            (player.x + player.image.width / 2) > (this.x - this.image.width / 2) && 
            (player.y - player.image.height / 2) < (this.y + this.image.height / 2) && 
            (player.y + player.image.height / 2) > (this.y - this.image.height / 2) && this.iFrame<=0 && (!this.first || this.spawnTimer>120)
            ){
            player.takeDamage(this.damage, this);
            if (this.x>player.x){
                player.AddForce(-this.force, 0);
            }
            if (this.x<player.x){

                player.AddForce(this.force, 0);
            }
            if (this.y>player.y){

                player.AddForce(0, -this.force);
            }
            if (this.y<player.y){

                player.AddForce(0, this.force);
            }
            this.iFrame=15;
        }
        if(this.slowCountdown>0){
            this.slowCountdown--;
        }
        else{
            this.image.style.filter="brightness(100%)";
        }
        
        if(this.redTimer<=0){
            if(this.slowCountdown<=0){
                this.image.style.filter="brightness(100%)";
            }
            else{
                this.image.style.filter="brightness(50%)";
            }
        }
        else{
            this.image.style.filter="sepia(100%) saturate(500%) hue-rotate(320deg)";
            this.redTimer--;
        }
        this.iFrame--;
    }
    special(){
        //console.log(this.frostAura.style.left);

    }
    makeClone(){
        if(!this.first || this.spawnTimer<120) return;
        let temp=new BouncyBoss(5, 3, false);
        temp.x=this.x;
        temp.y=this.y;
        temp.image.style.left=this.x+"px";
        temp.image.style.top=this.y+"px";
        enemies.push(temp);
    }
}
class MageBoss extends Enemy{    
    /*
    Idea: Frost circle that slows player and slows player bullets
    Ice wall that slowly shrinks over time to force player closer
    */
    constructor(speed, health){
        super(speed,health);
        this.maxHealth=health;
        this.image.src='images/mageWaterMode.webp';
        this.image.width=150;
        this.image.height=150;
        
        this.image.style.width = "150px";
        this.image.style.height = "150px";
        this.shootTimer=100;
        this.isBoss=true;
        this.value=500;
        this.image.style.zIndex=1;
        this.image.style.transform = "translate(-50%, -50%)";
        //console.log(this.image.style.transform+" transofrmer");

        this.bossText=document.createElement("div");
        this.bossText.style.position="absolute"
        this.bossText.innerHTML=`<div style=" color:red;pointer-events:none; font-size:30px;text-align:center; white-space: nowrap; font-family:'Black Ops One';" id="bossTitle">The Demonlist</div>`
        this.bossText.style.left=(screen.width/2)+"px";
        this.bossText.style.top=(25+bossBars.length*75)+"px";
        this.bossText.style.zIndex=2;
        this.bossText.style.transform="translate(-50%, -50%)";
        //console.log(bossText.style.transform+" tradsnf");
        
        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.cycle=0;
        this.attackTimer=0;
        
        this.bossBar=new BossBar(this);
        bossBars.push(this.bossBar);
    }
    timer(){
        //console.log(this.attackTimer);
        this.attackTimer--;
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.attackTimer>0){
            if(this.cycle==0 && this.attackTimer%2!=0){
                let distanceX=player.x-this.x;
                let distanceY=player.y-this.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                let vx = 0;
                let vy = 0;

                if (distance > 0) {
                    let angle=Math.atan2(distanceY, distanceX);
                    angle+=Math.random()-0.4;
                    vx=10*Math.cos(angle);
                    vy=10*Math.sin(angle);
                }
                enemyBullets.push(new Fire(1, this.x, this.y, vx, vy))
            }
            if(this.cycle==1 && this.attackTimer%40==1){
                let distanceX=player.x-this.x;
                let distanceY=player.y-this.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                let vx = 0;
                let vy = 0;

                if (distance > 0) {
                    let angle=Math.atan2(distanceY, distanceX);
                    angle-=0.2;
                    for(let i=0;i<9;i++){
                        vx=10*Math.cos(angle);
                        vy=10*Math.sin(angle);
                        enemyBullets.push(new Water(1, this.x, this.y, vx, vy))
                        angle+=0.05;
                    }
                }
            }
            if(this.cycle==2){
                let distanceX=player.x-this.x;
                let distanceY=player.y-this.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                let vx = 0;
                let vy = 0;

                if (distance > 0) {
                    let angle=Math.atan2(distanceY, distanceX);
                    angle-=0.6;
                    for(let i=0;i<4;i++){
                        vx=3*Math.cos(angle);
                        vy=3*Math.sin(angle);
                        enemyBullets.push(new BigRock(2, this.x, this.y, vx, vy))
                        angle+=0.4;
                    }
                }
            }
        }
        if(this.shootTimer<=0 && this.attackTimer<=0){
            this.shootTimer=400;
            this.cycle++;
            if(this.cycle==3)this.cycle=0;
            if(this.cycle==0){
                this.attackTimer=120;
                this.image.src='images/mageFireMode.webp';
            }
            else if(this.cycle==1){
                this.attackTimer=120;
                this.image.src='images/mageWaterMode.webp';
            }
            else if(this.cycle==2){
                this.attackTimer=2;
                this.image.src='images/mageRockMode.webp';
            }
        }
    }
    takeDamage(bullet, index){
        super.takeDamage(bullet, index);
    }
    move(){
        super.move();
    }
    special(){
        //console.log(this.frostAura.style.left);
        this.timer();
        this.image.style.left=(this.x)+"px";
        this.image.style.top=(this.y)+"px";

    }
}
class BulletHellBoss extends Enemy{    
    /*
    Idea: cool bullet patterns
    */
    constructor(speed, health){
        super(speed,health);
        this.maxHealth=health;
        this.image.src='images/bulletHellBoss.webp';
        this.image.width=135;
        this.image.height=135;
        
        this.image.style.width = "150px";
        this.image.style.height = "150px";
        this.shootTimer=0;
        this.isBoss=true;
        this.value=500;
        this.image.style.zIndex=1;
        this.image.style.transform = "translate(-50%, -50%)";
        //console.log(this.image.style.transform+" transofrmer");

        this.bossText=document.createElement("div");
        this.bossText.style.position="absolute"
        this.bossText.innerHTML=`<div style=" color:red;pointer-events:none; font-size:30px;text-align:center; white-space: nowrap; font-family:'Black Ops One';" id="bossTitle">McAfee</div>`
        this.bossText.style.left=(screen.width/2)+"px";
        this.bossText.style.top=(25+bossBars.length*75)+"px";
        this.bossText.style.zIndex=2;
        this.bossText.style.transform="translate(-50%, -50%)";
        //console.log(bossText.style.transform+" tradsnf");
        
        document.body.appendChild(this.bossText);
        //console.log(this.shootTimer);
        this.angle=0;
        this.walkTimer=600;
        this.bossBar=new BossBar(this);
        bossBars.push(this.bossBar);
        this.loopingShotTimer=0;
        this.spiralShotTimer=0;
        this.laserTimer=0;
    }
    timer(){
        //console.log(this.attackTimer);
        this.attackTimer--;
        if(this.slowCountdown>0){
            this.walkTimer-=0.5;
            this.loopingShotTimer-=0.5;
            this.spiralShotTimer-=0.5;
            this.laserTimer-=0.5;
        }
        else{
            this.walkTimer--;
            this.loopingShotTimer--;
            this.spiralShotTimer--;
            this.laserTimer--;
        } 
        if(this.health<=50){
            this.image.src="images/bulletHellBossEnraged.webp";
            this.bossText.innerHTML=`<div style=" color:red;pointer-events:none; font-size:30px;text-align:center; white-space: nowrap; font-family:'Black Ops One';" id="bossTitle">VIRUS DETECTED</div>`
            
            if(this.slowCountdown>0){
                this.loopingShotTimer-=0.5;
                this.spiralShotTimer-=0.5;
                this.laserTimer-=0.5;
            }
            else{
                this.loopingShotTimer--;
                this.spiralShotTimer--;
                this.laserTimer--;
            } 
        }
        if(this.walkTimer<=0){
            this.speed=0;
            if(this.loopingShotTimer<=0){
                this.loopingShotTimer=40;

                let distanceX=player.x-this.x;
                let distanceY=player.y-this.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                let vx = 0;
                let vy = 0;
                if (distance > 0) {
                    let angle=Math.atan2(distanceY, distanceX);
                    vx=5*Math.cos(angle);
                    vy=5*Math.sin(angle);
                }
                enemyBullets.push(new SpinningBullet(vx, vy, 1, this.x, this.y))
            }
            if(this.spiralShotTimer<=0){
                this.spiralShotTimer=40;

                this.angle+=0.4;
                this.angle%=Math.PI*2;
                for(let i=0;i<4;i++){

                    let vx=5*Math.cos(this.angle);
                    let vy=5*Math.sin(this.angle);
                    let temp=new EnemyBullet(vx, vy, 1, this.x, this.y);
                    temp.image.width=25;
                    temp.image.height=25;
                    temp.image.style.width="25px";
                    temp.image.style.width="25px";
                    temp.image.src="images/red.webp";
                    enemyBullets.push(temp);
                    this.angle+=Math.PI/2
                }
            }
            if(this.laserTimer<=0){
                this.laserTimer=350;
                enemyBullets.push(new Laser(0, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI/2, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI, this.x, this.y));
                enemyBullets.push(new Laser(Math.PI*1.5, this.x, this.y));
                
            }
            
        }
       
    }
    takeDamage(bullet, index){
        super.takeDamage(bullet, index);
    }
    move(){
        let distanceX=Math.abs(this.x-screen.width/2);
        let distanceY=Math.abs(this.y-screen.height/2);
        if(this.slowCountdown>0){
            this.speed/=2;
        }
        if(distanceX==0){
            if(this.y>screen.width/2){
                this.y-=this.speed;
            }
            if(this.y<screen.height/2){
                this.y+=this.speed;
            }
        }
        else{
            let angle=Math.atan(distanceY/distanceX);
            if(this.x>screen.width/2){
                this.x-=this.speed*Math.cos(angle);
            }
            if(this.y>screen.height/2){
                this.y-=this.speed*Math.sin(angle);
            }
            if(this.x<screen.width/2){
                this.x+=this.speed*Math.cos(angle);
            }
            if(this.y<screen.height/2){
                this.y+=this.speed*Math.sin(angle);
            }
            //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
        }
        
        this.image.style.left=this.x+"px";
        this.image.style.top=this.y+"px";
        super.checkForCollisions();
    }
    special(){
        //console.log(this.frostAura.style.left);
        this.timer();
        this.image.style.left=(this.x)+"px";
        this.image.style.top=(this.y)+"px";

    }
}

class ShooterEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/shooterEnemy.webp';
        this.shootTimer=30;
        this.order=1;
        this.value=30;
        //console.log(this.shootTimer);
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=60;
            if(this.order==1){
                this.order=-1;
                enemyBullets[enemyBullets.length]=new EnemyBullet(5, 0, 1, this.x, this.y);
                enemyBullets[enemyBullets.length]=new EnemyBullet(-5, 0, 1, this.x, this.y);
            }
            else{
                this.order=1;    
                enemyBullets[enemyBullets.length]=new EnemyBullet(0, 5, 1, this.x, this.y);
                enemyBullets[enemyBullets.length]=new EnemyBullet(0, -5, 1, this.x, this.y);
            }
        }
    }
    special(){
        this.timer();
    }
}
class ChargingEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/chargingEnemy.webp';
        this.shootTimer=100;
        this.order=1;
        this.image.width=40;
        this.image.height=40;
        this.value=80;
        //console.log(this.shootTimer);
    }
    timer(){
        if(this.shootTimer>=0 && this.image.src!="images/chargingEnemySpecial.webp" && this.redTimer<=0){
            this.image.style.filter='hue-rotate('+this.shootTimer+'deg)';
        }
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer==0){
            this.image.style.filter='hue-rotate(-90deg)';
        }
        if(this.shootTimer<=0){
            this.shootTimer=200;
            this.speed=10;
            this.chargeTimer=50;
            this.image.src='images/chargingEnemySpecial.webp';
        }
        if(this.chargeTimer<=0){
            this.speed=1;
            this.image.src='images/chargingEnemy.webp';
        }
        this.chargeTimer--;
        
    }
    move(){
        if(this.chargeTimer>0){
            if(this.slowCountdown>0){
                this.x+=this.vx*4;
                this.y+=this.vy*4;
            }
            else{
                this.x+=this.vx*8;
                this.y+=this.vy*8;
            }
        }
        else{
            let distanceX=Math.abs(this.x-player.x);
            let distanceY=Math.abs(this.y-player.y);
            if(distanceX==0){
                if(this.y>player.y){
                    this.vy=-this.speed;
                }
                if(this.y<player.y){
                    this.vy=this.speed;
                }
            }
            else{
                this.angle=Math.atan(distanceY/distanceX);
                if(this.x>player.x){
                    this.vx=-this.speed*Math.cos(this.angle);
                }
                if(this.y>player.y){
                    this.vy=-this.speed*Math.sin(this.angle);
                }
                if(this.x<player.x){
                    this.vx=this.speed*Math.cos(this.angle);
                }
                if(this.y<player.y){
                    this.vy=this.speed*Math.sin(this.angle);
                }
                this.x+=this.vx;
                this.y+=this.vy;
            }
            
            if(this.slowCountdown>0){
                this.x+=this.vx/2;
                this.y+=this.vy/2;
            }
            else{
                this.x+=this.vx;
                this.y+=this.vy;
            }
        }        
        
        this.image.style.left=this.x+"px";
        this.image.style.top=this.y+"px";
        if(this.slowCountdown>0){
            this.speed*=2;
            this.slowCountdown--;
        }
        super.checkForCollisions();
        super.changeColor();
    }
    special(){
        this.timer();
    }
}
class AimingEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/aimingEnemy.webp';
        this.shootTimer=45;
        this.value=30;
        this.order=1;
        //console.log(this.shootTimer);
    }
    special(){
        this.timer();
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=90;
            // let actualDistX=Math.abs(this.x-player.x);
            // let actualDistY=Math.abs(this.x-player.x);
            let distanceX=Math.abs(this.x-(player.x));
            let distanceY=Math.abs(this.y-(player.y));
            let bulletvX=0;
            let bulletvY=0;
            let bulletvX2=0;
            let bulletvY2=0;
            let bulletvX3=0;
            let bulletvY3=0;
            if(distanceX==0){
                if(enemy.y>(player.y)){
                    bulletvY-=5;
                }
                if(enemy.y<(player.y)){
                    bulletvY+=5;
                }
            }
            else{
                let angle1=Math.atan(distanceY/distanceX)+0.2;
                let angle2=Math.atan(distanceY/distanceX)-0.2;
                let angle3=Math.atan(distanceY/distanceX);
                if(this.x>(player.x)){
                    bulletvX-=10*Math.cos(angle1);
                    bulletvX2-=10*Math.cos(angle2);
                    bulletvX3-=10*Math.cos(angle3);
                }
                if(this.y>(player.y)){
                    bulletvY-=10*Math.sin(angle1);
                    bulletvY2-=10*Math.sin(angle2);
                    bulletvY3-=10*Math.sin(angle3);
                }
                if(this.x<(player.x)){
                    bulletvX+=10*Math.cos(angle1);
                    bulletvX2+=10*Math.cos(angle2);
                    bulletvX3+=10*Math.cos(angle3);
                }
                if(this.y<(player.y)){
                    bulletvY+=10*Math.sin(angle1);
                    bulletvY2+=10*Math.sin(angle2);
                    bulletvY3+=10*Math.sin(angle3);
                }

                //console.log(enemy.x+" "+enemy.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
            }
            //console.log(bulletvX+" "+bulletvY+" "+player.x+" "+player.y+" "+(player.x+speedX*60)+" "+(player.y+speedY*60));
            enemyBullets[enemyBullets.length]=new EnemyBullet(bulletvX, bulletvY, 1, this.x+20, this.y+20);
            enemyBullets[enemyBullets.length]=new EnemyBullet(bulletvX2, bulletvY2, 1, this.x+20, this.y+20);
            enemyBullets[enemyBullets.length]=new EnemyBullet(bulletvX3, bulletvY3, 1, this.x+20, this.y+20);
        }
    }
    
}

class HomingEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/homingEnemy.webp';
        this.shootTimer=60;
        this.value=30;
        this.order=1;
        //console.log(this.shootTimer);
    }
    special(){
        this.timer();
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=120;
            enemyBullets[enemyBullets.length]=new HomingBullet(0, 5, 2, this.x, this.y);
        }
    }
    move(){
        super.move();
        let distanceX=Math.abs(this.x-player.x);
        let distanceY=Math.abs(this.y-player.y);
        const distance = Math.hypot(distanceX,distanceY);
        if(distance<300){
            this.speed=0;
        }
        else{
            this.speed=3;
        }
    }
}
class ShieldEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/shieldEnemy.webp';
        this.order=1;
        this.value=80;
        this.image.width=100;
        this.image.height=100;
        this.image.style.width="100px";
        this.image.style.height="100px";
        this.shield=new EnemyShield(0, 1000, this);
        enemies.push(this.shield);
        //console.log(this.shootTimer);
    }
    timer(){
    }
    move(){
        super.move();
        if(this.dead || this.health<=0)this.shield.dead=true;
    }
    special(){
        this.timer();
    }
}
class EnemyShield extends Enemy{
    constructor(speed, health, owner){
        super(speed,health);
        this.image.src='images/shield.webp';
        this.shootTimer=30;
        this.order=1;
        this.value=30;
        this.owner=owner;
        this.x=owner.x;
        this.y=owner.y;
        this.image.style.width="100px";
        this.image.style.height="100px";
        if(this.x<-90){
            this.offsetX=60;
            this.offsetY=0;
            this.image.width=100;
        }
        if(this.x>screen.width+90){
            this.offsetX=-60;
            this.offsetY=0;
            this.image.width=100;
        }
        if(this.y<-90){
            this.image.src='images/shieldRotated.webp';
            this.offsetX=0;
            this.offsetY=60;
            this.image.height=100;
        }
        if(this.y>screen.height+90){
            this.image.src='images/shieldRotated.webp';
            this.offsetX=0;
            this.offsetY=-60;
            this.image.height=100;
        }
        //console.log(this.shootTimer);
    }
    move(){
        this.x=this.owner.x+this.offsetX;
        this.y=this.owner.y+this.offsetY;
        this.image.style.left=this.x+"px";
        this.image.style.top=this.y+"px";
    }
    takeDamage(bullet, index){
        let damageText=document.createElement("div");
        damageText.style.position="absolute"
        damageText.innerHTML=`<div style="position:absolute; color:gray;pointer-events:none; font-size:30px" >${0}</div>`
        damageText.style.left=(this.x-this.image.width/2+Math.random()*this.image.width)+"px";
        damageText.style.top=(this.y)+"px";
        damageText.style.zIndex=2;
        document.getElementById("world").appendChild(damageText);
        moveText(damageText, 0, parseInt(damageText.style.top));
    }
}
class TrapperEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/trapperEnemy.webp';
        this.shootTimer=30;
        this.order=1;
        this.value=30;
        //console.log(this.shootTimer);
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=50;
            enemyBullets.push(new EnemyTrap(1, this.x, this.y, 40, 40));
        }
    }
    special(){
        this.timer();
    }
}
class ZombieEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/zombieEnemy.webp';
        this.shootTimer=30;
        this.order=1;
        this.value=30;
        this.deathCount=0;
        this.deathTimer=0;
        this.originalHealth=health;
        //console.log(this.shootTimer);
    }
    timer(){
        this.deathTimer--;
        if(this.deathTimer==0){
            this.ignoreBullets=false;
            this.image.src="images/zombieEnemy.webp";
        }
    }
    special(){
        this.timer();
    }
    move(){
        if(this.deathTimer<=0){
            super.move();
        }
        else{
            super.changeColor();
        }
    }
    takeDamage(bullet, index){
        this.health-=bullet.damage;
        //console.log(this.health);
        let damageText=document.createElement("div");
        damageText.style.position="absolute"
        if(bullet.frostbite){
            damageText.innerHTML=`<div style="position:absolute; color:cyan;pointer-events:none; font-size:30px" >${bullet.damage}</div>`
            this.image.style.filter="brightness(50%)";
            this.slowCountdown=200;
        }
        else{
            damageText.innerHTML=`<div style="position:absolute; color:orange;pointer-events:none; font-size:30px" >${bullet.damage}</div>`
        }
        damageText.style.left=(this.x-this.image.width/2+Math.random()*this.image.width)+"px";
        damageText.style.top=(this.y)+"px";
        damageText.style.zIndex=2;
        document.getElementById("world").appendChild(damageText);
        moveText(damageText, 0, parseInt(damageText.style.top));
        if(this.redTimer<=0)this.savedColor=this.image.style.filter;

        this.redTimer=10;

        if(this.health<=0)this.dead=true;
        if(this.dead && this.deathCount<3){
            this.dead=false;
            this.health=this.originalHealth;
            this.image.src="images/deadZombie.webp";
            this.deathTimer=300;
            this.deathCount++;
            this.ignoreBullets=true;
            this.image.style.filter=this.savedColor;
        }
        
        if(this.dead){
            if(player.siphon>0){
                player.health=Math.min(player.maxHealth, player.health+player.siphon);
                let damageText=document.createElement("div");
                damageText.style.position="absolute"
                damageText.innerHTML=`<div style="position:absolute; color:green;pointer-events:none; font-size:30px" >${player.siphon}</div>`
                
                damageText.style.left=(player.x-player.image.width/2+Math.random()*50)+"px";
                damageText.style.top=player.y+"px";
                document.getElementById("world").appendChild(damageText);
                moveText(damageText, 0, parseInt(damageText.style.top));
            }
            if(this.isBoss){
                bossBar.image1.remove();
                bossBar.image2.remove();
                if(this.frostAura){
                    player.slowed=false;
                    this.frostAura.remove();
                }
                if(this.shield){
                    this.shield.remove();
                    this.shield.parentNode.removeChild(image);
                }
                if(document.getElementById("bossTitle"))document.getElementById("bossTitle").remove();
            }
            if(enemies[index] && enemies[index].image){
                enemies[index].image.remove();
                if(enemies[index].shield){
                    enemies[index].shield.image.remove();
                    enemies[index].shield.dead=true;
                }
            }
            enemies.splice(index,1);
            
        }
    }
}
class GhostEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/ghostEnemy.webp';
        this.shootTimer=0;
        this.order=1;
        this.value=80;
        this.ghostTimer=0;
        //console.log(this.shootTimer);
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.ghostTimer<=0){
            this.ignoreBullets=false;
            this.image.style.opacity="1";
        }
        else{
            this.ghostTimer--;
        }
        if(this.shootTimer<=0){
            this.shootTimer=240;
            this.ghostTimer=120;
            this.ignoreBullets=true;
            this.image.style.opacity="0.5";
        }
    }
    special(){
        this.timer();
    }
}
class PoisonEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/poisonEnemy.webp';
        this.shootTimer=120;
        this.order=1;
        this.value=80;
        //console.log(this.shootTimer);
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=180;
            let distanceX=player.x-this.x;
            let distanceY=player.y-this.y;
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle=Math.atan2(distanceY, distanceX);
                angle+=Math.random()-0.3;
                vx=5*Math.cos(angle);
                vy=5*Math.sin(angle);
            }
            enemyBullets.push(new PoisonBomb(this.x, this.y, vx, vy))
        }
    }
    special(){
        this.timer();
    }
}
class BlackHoleEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/blackHoleEnemy.webp';
        this.shootTimer=120;
        this.order=1;
        this.value=80;
        //console.log(this.shootTimer);
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=450;
            let distanceX=player.x-this.x;
            let distanceY=player.y-this.y;
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle=Math.atan2(distanceY, distanceX);
                vx=3*Math.cos(angle);
                vy=3*Math.sin(angle);
            }
            enemyBullets.push(new BlackHole(1,this.x, this.y, vx, vy))
        }
    }
    special(){
        this.timer();
    }
}
class BuilderEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/builderEnemy.webp';
        this.shootTimer=120;
        this.order=1;
        this.image.width=75;
        this.image.style.width="75px";
        this.image.height=75;
        this.image.style.height="75px";
        this.value=150;
        //console.log(this.shootTimer);
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0){
            this.shootTimer=240;
            let distanceX=player.x-this.x;
            let distanceY=player.y-this.y;
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle=Math.atan2(distanceY, distanceX);
                vx=3*Math.cos(angle);
                vy=3*Math.sin(angle);
            }
            enemies.push(new EnemyWall(this.x+vx*30, this.y+vy*30, 40))
        }
    }
    special(){
        this.timer();
    }
}
class EnemyWall extends Enemy{
    constructor(x, y, health){
        super(0,health);
        this.image.src='images/enemyWall.webp';
        this.order=1;
        this.value=0;
        this.x=x;
        this.y=y;
        this.image.width=200;
        this.image.height=200;
        this.image.style.width="200px";
        this.image.style.height="200px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.style.zIndex=-1;
        this.canSiphon=false;
        //console.log(this.shootTimer);
    }
    move(){
        this.image.style.left=this.x+"px";
        this.image.style.top=this.y+"px";
        if (
                (player.x - player.image.width / 2) < (this.x + this.image.width / 2) && 
                (player.x + player.image.width / 2) > (this.x - this.image.width / 2) && 
                (player.y - player.image.height / 2) < (this.y + this.image.height / 2) && 
                (player.y + player.image.height / 2) > (this.y - this.image.height / 2)
            ){
            if(this.x-this.image.width/2>player.x){
                player.x-=player.speed;
            }
            if(this.x+this.image.width/2<player.x){
                player.x+=player.speed;
            }
            if(this.y+this.image.height/2<player.y){
                player.y+=player.speed;
            }
            if(this.y-this.image.height/2>player.y){
                player.y-=player.speed;
            }
        }
        if(this.redTimer<=0){
            if(this.slowCountdown<=0){
                this.image.style.filter="brightness(100%)";
            }
            else{
                this.image.style.filter="brightness(50%)";
            }
        }
        else{
            this.image.style.filter="sepia(100%) saturate(500%) hue-rotate(320deg)";
            this.redTimer--;
        }
    }
}
class WindupEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/windupEnemy.webp';
        this.shootTimer=200;
        this.chargeTimer=-1;
        this.order=1;
        this.image.width=50;
        this.image.style.width="50px";
        this.image.height=50;
        this.image.style.height="50px";
        this.image.style.zIndex=-1;
        this.value=150;
        this.orb;
        //console.log(this.shootTimer);
    }
    move(){
        let savedSpeed=this.speed;
        if(this.shootTimer>200){
            this.speed=0;
        }
        super.move();
        this.speed=savedSpeed;
        if(this.x>player.x){
            this.image.style.transform="scaleX(-1)";
        }
        else{
            this.image.style.transform="scaleX(1)";
        }
        this.image.style.left=(this.x-this.image.width/2)+"px";
        this.image.style.top=(this.y-this.image.width/2)+"px";
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
        }
        else{
            this.shootTimer--;
        } 
        if(this.shootTimer<=0 && this.chargeTimer<0){
            this.shootTimer=800;
            let distanceX=player.x-this.x;
            let distanceY=player.y-this.y;
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle=Math.atan2(distanceY, distanceX);
                vx=3*Math.cos(angle);
                vy=3*Math.sin(angle);
            }
            this.orb=new ChargingOrb(this.x+vx*20, this.y+vy*20, vx, vy)
            enemies.push(this.orb)
        }
    }
    special(){
        this.timer();
    }
    takeDamage(a,b){
        super.takeDamage(a,b);
        if(this.dead && this.shootTimer>200){
            this.orb.dead=true;
        }
    }
}
class SpawnerEnemy extends Enemy{    
    constructor(speed, health){
        super(speed,health);
        this.image.src='images/spawnerEnemy.webp';
        this.shootTimer=400;
        this.order=1;
        this.image.width=100;
        this.image.style.width="100px";
        this.image.height=100;
        this.image.style.height="100px";
        this.image.style.zIndex=-1;
        this.value=150;
        this.spawnerPoints=0;
        this.spawnerTimer=0;
        this.releaseTimer=0;
        this.releasing=false;
        //console.log(this.shootTimer);
    }
    move(){
        if(this.shootTimer<=0 && this.speed>0){
            this.speed=0;
            this.image.src="images/spawner.webp";
        }
        if(this.spawnerTimer%60==0 && this.shootTimer<=0 && !this.releasing){
            this.spawnerPoints++;
            
            let upgradeIndicator=document.createElement("img");
            upgradeIndicator.style.position="absolute";
            upgradeIndicator.src="images/spawnerUpgrade.webp"
            upgradeIndicator.style.left=(this.x-this.image.width/2+Math.random()*this.image.width)+"px";
            upgradeIndicator.style.top=(this.y)+"px";
            upgradeIndicator.style.width="75px";
            upgradeIndicator.style.height="75px";
            upgradeIndicator.style.zIndex=2;
            upgradeIndicator.style.transform = "translate(-50%, -50%)";
            document.getElementById("world").appendChild(upgradeIndicator);
            moveText(upgradeIndicator, 0, parseInt(upgradeIndicator.style.top));
        }
        
        if (this.shootTimer<=0 && !this.releasing &&
                (player.x - player.image.width / 2) < (this.x + this.image.width / 2) && 
                (player.x + player.image.width / 2) > (this.x - this.image.width / 2) && 
                (player.y - player.image.height / 2) < (this.y + this.image.height / 2) && 
                (player.y + player.image.height / 2) > (this.y - this.image.height / 2)
            ){
            if(this.x-this.image.width/2>player.x){
                player.x-=player.speed;
            }
            if(this.x+this.image.width/2<player.x){
                player.x+=player.speed;
            }
            if(this.y+this.image.height/2<player.y){
                player.y+=player.speed;
            }
            if(this.y-this.image.height/2>player.y){
                player.y-=player.speed;
            }
        }
        if(!this.releasing)super.move();
    }
    timer(){
        if(this.slowCountdown>0){
            this.shootTimer-=0.5;
            if(this.shootTimer<=0){
                this.spawnerTimer+=0.5;
            }
        }
        else{
            this.shootTimer--;
            if(this.shootTimer<=0){
                this.spawnerTimer+=0.5;
            }
        } 
        if(this.releasing){
            this.releaseTimer++;
            if(this.releaseTimer%60==0){
                let temp=0;
                let random=0;
                temp=Math.ceil(Math.random()*6);
                if(temp<=3){
                    random=1;
                }
                else if(temp<=5){
                    random=2;
                }
                else{
                    random=3;
                }
                while(random>this.spawnerPoints){
                    temp=Math.ceil(Math.random()*6);
                    if(temp<=3){
                        random=1;
                    }
                    else if(temp<=5){
                        random=2;
                    }
                    else{
                        random=3;
                    }
                }
                let enemy;
                if(random==1){
                    let random2=Math.ceil(Math.random()*6);
                    switch (random2){
                        case 1:
                            enemy=new BasicEnemy(2,5);
                            break;
                        case 2:
                            enemy=new ShooterEnemy(2,3);
                            break;
                        case 3:
                            enemy=new AimingEnemy(3.5,1);
                            break;
                        case 4:
                            enemy=new HomingEnemy(1,2);
                            break;
                        case 5:
                            enemy=new TrapperEnemy(3,4);
                            break;
                        case 6:
                            enemy=new ZombieEnemy(2,3);
                            break;
                    }
                }
                else if(random==2){
                    let random2=Math.ceil(Math.random()*5);
                    
                    switch (random2){
                        case 1:
                            enemy=new ChargingEnemy(1,8);
                            break;
                        case 2:
                            enemy=new ShieldEnemy(1.5,15);
                            break;
                        case 3:
                            enemy=new GhostEnemy(4,4);
                            break;
                        case 4:
                            enemy=new PoisonEnemy(1,5);
                            break;
                        case 5:
                            enemy=new BlackHoleEnemy(1.5,5);
                            break;
                    }
                }
                else{
                    let random2=Math.ceil(Math.random()*2);

                    switch (random2){
                        case 1:
                            enemy=new BuilderEnemy(1.5,15);
                            break;
                        case 2:
                            enemy=new WindupEnemy(2,20);
                            break;
                    }
                }
                enemy.x=this.x+Math.random()*30-10;
                enemy.y=this.y+Math.random()*30-10;
                enemies.push(enemy);
                this.spawnerPoints-=random;
            }
            if(this.spawnerPoints<=0){
                this.dead=true;
            }
        }
    }
    special(){
        this.timer();
    }
    takeDamage(a,b){
        super.takeDamage(a,b);
        if(this.dead && this.shootTimer<=0){
            this.dead=false;
            this.image.src="images/spawnPortal.webp";
            this.releasing=true;
            this.ignoreBullets=true;            
        }
    }
}

/*
^ ENEMIES

v PLAYER BULLETS
*/


class Bullet{    
    constructor(speedX, speedY, damage){
        this.image=document.createElement("img");
        this.image.src='images/bullet.webp';
        this.speedX=speedX;
        this.speedY=speedY;
        this.x=player.x;
        this.y=player.y;
        this.damage=damage;
        this.image.style.position = 'absolute';
        this.image.style.width  = "10px";
        this.image.style.height = "10px";
        this.image.width  = 10;
        this.image.height = 10;
        this.width=10;
        this.height=10;
        this.image.style.left = this.x+'px';
        this.image.style.top= this.y+'px';
        this.image.style.transform = "translate(-50%, -50%)";
        this.frostbite=false;
        this.slowed=false;
        document.getElementById("world").appendChild(this.image);
    }
    move(){
        if(this.slowed){
            this.x+=this.speedX/3;
            this.y+=this.speedY/3;
        }    
        else{
            this.x+=this.speedX;
            this.y+=this.speedY;
        }
        this.image.style.left=this.x+"px";
        this.image.style.top=this.y+"px";
        for(let i=enemies.length-1;i>=0;i--){

            if (
                (enemies[i].x - enemies[i].image.width / 2) < (this.x + this.width / 2) && 
                (enemies[i].x + enemies[i].image.width / 2) > (this.x - this.width / 2) && 
                (enemies[i].y - enemies[i].image.height / 2) < (this.y + this.height / 2) && 
                (enemies[i].y + enemies[i].image.height / 2) > (this.y - this.height / 2) && enemies[i].ignoreBullets==false
            ){    
                //console.log(enemies[i]+" "+this.damage);
                enemies[i].takeDamage(this, i);
                this.dead=true;
            }
        }
        if(this.x<-100 || this.y<-100 || this.x>screen.width+100 || this.y>=screen.height+100){
            this.dead=true;
        }
    }
}
class FrostBullet extends Bullet{    
    constructor(speedX, speedY, damage){
        super(speedX, speedY, damage);
        this.image.width=20;
        this.image.height=20;
        this.image.style.width="20px";
        this.image.style.height="20px";
        this.image.src="images/frostProjectile.webp";
        this.frostbite=true;
    }
}
class PlayerLaser extends Bullet{
    constructor(angle, x, y){
        super(0,0,1);
        this.spawnAngle=angle;
        this.warningTimer=60;
        this.despawnTimer=75;
        this.image.height=2000;
        this.image.width=10;
        this.image.style.height="2000px";
        this.image.style.width="10px";
        this.image.style.position = "absolute";
        this.image.style.transformOrigin = "center top";
        this.image.src="images/blue.webp";
        this.image.style.left = (x) + "px";  // center horizontally on x
        this.image.style.top = y + "px";  
        this.image.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
        this.image.style.zIndex=-1;

    }
    move(){
        this.x=player.x-5;
        this.y=player.y;
        this.image.style.left = this.x + "px";
        this.image.style.top=this.y+"px";
        if(this.iFrame>0){
            this.iFrame--;
        }
        else{
            for(let i=0;i<enemies.length;i++){
                let dx = enemies[i].x - this.x;
                let dy = enemies[i].y - this.y;

                let distanceToLine = Math.abs(dx * Math.sin(this.spawnAngle) - dy * Math.cos(this.spawnAngle));

                if (enemies[i].ignoreBullets==false && distanceToLine < 10+enemies[i].image.width/2 && enemies[i].y<player.y) {
                    enemies[i].takeDamage(this, i);
                    this.iFrame = 15;
                }
            }
        }
        
    }
}
class PlayerBomb extends Bullet{
    constructor(x, y, speedX, speedY){
        super(0,0,1);
        this.shootTimer=60;
        this.explodeTimer=0;
        this.image.height=25;
        this.image.width=25;
        this.speedX=speedX;
        this.speedY=speedY;
        this.image.style.height="25px";
        this.image.style.width="25px";
        this.image.style.position = "absolute";
        this.image.style.transformOrigin = "center top";
        this.image.src="images/bomb.webp";
        this.image.style.left = (x) + "px";  // center horizontally on x
        this.image.style.top = y + "px";  
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.zIndex=1;
        this.scale=25;
        this.damage=3;
        this.hitEnemies = new Set();
    }
    move(){
        if(this.explodeTimer<=0){
            this.x+=this.speedX;
            this.y+=this.speedY;
        }
        this.image.style.left = this.x + "px";
        this.image.style.top=this.y+"px";
        this.shootTimer--;
        this.explodeTimer--;
        if(this.shootTimer==0 && this.explodeTimer<0){
            this.explodeTimer=40;
            this.image.src="images/explosion.webp";
        }
        if(this.shootTimer>0){
            for(let i=0;i<enemies.length;i++){
                if(enemies[i].ignoreBullets==false && RectCircleColliding(this, enemies[i], this.image.width/2, this.x, this.y)){
                    this.explodeTimer=30;
                    this.shootTimer=0;
                    this.image.src="images/explosion.webp";
                }
            }
        }
        if(this.explodeTimer==0){
            this.dead=true;
        }
        if(this.explodeTimer>0){
            this.scale+=5;
           // console.log(this.image.style.height+" "+(this.image.width)+" BEFORE");
            this.image.width=this.scale;
            this.image.style.width=this.scale+"px";
            this.image.height=this.scale;
            this.image.style.height=this.scale+"px";
            //console.log(this.image.style.height+" "+(this.image.width)+" AFTER");
            for(let i=0;i<enemies.length;i++){
                if(!this.hitEnemies.has(enemies[i]) && enemies[i].ignoreBullets==false && RectCircleColliding(this, enemies[i], this.image.width/2, this.x, this.y)){
                    enemies[i].takeDamage(this, i);
                    this.hitEnemies.add(enemies[i]);
                }
            }
        }
        
    }
}
class ProtectorBullet extends Bullet{
    
    constructor(damage){
        super(0,0,1);
        this.explodeTimer=0;
        this.image.height=40;
        this.image.width=40;
        this.image.style.height="40px";
        this.image.style.width="40px";
        this.image.style.position = "absolute";
        this.image.style.transformOrigin = "center top";
        this.image.src="images/protectorBullet.webp";
        this.offsetX=0;
        this.offsetY=0;
        this.image.style.left = (player.x) + "px";
        this.image.style.top = (player.y) + "px";  
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.zIndex=1;
        this.damage=damage;
        this.angle=0;
        this.hitEnemies = new Map();
        protectorBullets.push(this);
    }
    move(){
        this.angle+=0.07;
        this.angle%=2*Math.PI;
        this.offsetX=100*Math.cos(this.angle);
        this.offsetY=100*Math.sin(this.angle);
        this.x=player.x+this.offsetX;
        this.y=player.y+this.offsetY;
        this.image.style.left = this.x + "px";
        this.image.style.top=this.y+"px";

        for(let i=0;i<enemies.length;i++){
            if(enemies[i].ignoreBullets==false && !this.hitEnemies.has(enemies[i]) && RectCircleColliding(this, enemies[i], this.image.width/2, this.x, this.y)){
                enemies[i].takeDamage(this, i);
                if(!enemies[i].dead)this.hitEnemies.set(enemies[i],30);
            }
        }
        for(const enemy of this.hitEnemies.keys()){
            //console.log(this.hitEnemies.get(enemy));
            this.hitEnemies.set(enemy,this.hitEnemies.get(enemy)-1);
            if(this.hitEnemies.get(enemy)<=0){
                this.hitEnemies.delete(enemy);
            }
        }
        
    }
    static Spacing(){
        for(let i=0;i<protectorBullets.length;i++){
            protectorBullets[i].angle=2*Math.PI/protectorBullets.length*i;
        }
    }
}

/*
^ PLAYER BULLETS

v ENEMY BULLETS
*/


class EnemyBullet{    
    constructor(speedX, speedY, damage, x, y){
        this.image=document.createElement("img");
        this.image.src='images/enemyBullet.webp';
        this.speedX=speedX;
        this.speedY=speedY;
        this.x=x;
        this.y=y;
        this.damage=damage;
        this.image.style.position = 'absolute';
        this.image.width = "10";
        this.image.height = "10";
        this.image.style.left = this.x+'px';
        this.image.style.top= this.y+'px';
        this.frostbite=false;
        this.image.style.transform = "translate(-50%, -50%)";
        document.getElementById("world").appendChild(this.image);
    }
    move(){

        this.x+=this.speedX;
        this.y+=this.speedY;
        this.image.style.left=(this.x)+"px";
        this.image.style.top=(this.y)+"px";
        const dx = (this.x + 5) - (player.x + 5);
        const dy = (this.y + 5) - (player.y + 5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 15+this.image.width/2) {
            player.takeDamage(this.damage,this);
            this.dead=true;
        }
        if(this.x<-500 || this.y<-500 || this.x>screen.width+500 || this.y>=screen.height+500){
            this.dead=true;
        }
    }
    special(){
    }
}
class PoisonBomb extends EnemyBullet{
    constructor(x, y, speedX, speedY){
        super(speedX,speedY,1,x,y);
        this.shootTimer=120;
        this.explodeTimer=0;
        this.image.height=25;
        this.image.width=25;
        this.speedX=speedX;
        this.speedY=speedY;
        this.image.style.height="25px";
        this.image.style.width="25px";
        this.image.style.position = "absolute";
        this.image.style.transformOrigin = "center top";
        this.image.src="images/poisonBomb.webp";
        this.image.style.left = (x) + "px";  // center horizontally on x
        this.image.style.top = y + "px";  
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.zIndex=1;
        this.scale=25;
        this.iFrame=0;
    }
    move(){
        
        if(this.explodeTimer>0 && this.iFrame<=0 && RectCircleColliding(this, player, this.image.width/2, this.x, this.y)){
            player.takeDamage(this.damage, this);
            this.iFrame=30;
            
        }
    }
    special(){
        if(this.explodeTimer<=0){
            this.x+=this.speedX;
            this.y+=this.speedY;
        }
        this.image.style.left = this.x + "px";
        this.image.style.top=this.y+"px";
        this.shootTimer--;
        this.explodeTimer--;
        this.iFrame--;
        if(this.shootTimer==0 && this.explodeTimer<0){
            this.image.src="images/poisonCloud.webp";
            this.scale=250;
            this.explodeTimer=600;
        }
        if(this.shootTimer>60){
            this.scale+=0.5;
        }
        else if(this.shootTimer>0){
            this.scale-=0.5;
        }
        this.image.width=this.scale;
        this.image.style.width=this.scale+"px";
        this.image.height=this.scale;
        this.image.style.height=this.scale+"px";
        if(this.explodeTimer==0){
            this.dead=true;
        }
        
    }
}

class HomingBullet extends EnemyBullet{
    constructor(speedX, speedY, damage, x, y){
        super(speedX, speedY, damage, x, y);
        this.homingTimer=0;
        this.image.src='images/homingBullet.webp';
        let lastSpeedX=0;
        let lastSpeedY=0;
        let distanceX=Math.abs(this.x-player.x);
        let distanceY=Math.abs(this.y-player.y);
        this.image.width="20";
        this.image.height="20";
        let angle=Math.atan(distanceY/distanceX);
        if(distanceX==0){
            if(this.y>player.y){
                this.speedY-=5;
            }
            if(this.y<player.y){
                this.speedY+=5;
            }
        }
        else{
            if(this.x>player.x){
                this.speedX=-5*Math.cos(angle);
            }
            if(this.y>player.y){
                this.speedY=-5*Math.sin(angle);
            }
            if(this.x<player.x){
                this.speedX=5*Math.cos(angle);
            }
            if(this.y<player.y){
                this.speedY=5*Math.sin(angle);
            }
        }
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(){
        this.target();
    }
    target(){
        if(this.homingTimer>=120)return;
        this.homingTimer++;
        //console.log(this.x+" "+this.y+" before");
        
        let distanceX=this.x-player.x;
        let distanceY=this.y-player.y;
        let distance=Math.sqrt(distanceX*distanceX+distanceY*distanceY);
        
        const desiredX = (distanceX / distance) * 10;
        const desiredY = (distanceY / distance) * 10;
        let differenceX=desiredX-this.speedX;
        let differenceY=desiredY-this.speedY;
        let steerAmount=Math.sqrt(differenceX*differenceX+differenceY*differenceY);
        if(steerAmount>0.3){
            differenceX=(differenceX/steerAmount)*0.3;
            differenceY=(differenceY/steerAmount)*0.3;
        }
        this.speedX-=differenceX;
        this.speedY-=differenceY;
        let speed=Math.sqrt(this.speedX*this.speedX+this.speedY*this.speedY);
        if(speed>5){
            this.speedX=this.speedX/speed*5;
            this.speedY=this.speedY/speed*5;
        }
        //this.previousAngle=angle;
        //console.log(this.x+" "+this.y+" after");
    }

}
class Icicle extends EnemyBullet{
    constructor(speedX, speedY, damage, x, y, width, height){
        super(speedX, speedY, damage, x, y);
        this.image.src='images/blue.webp';
        this.image.width=width;
        this.image.height=height;
        this.image.style.transform = "translate(-50%, -50%)";
        this.frostbite=true;
        this.timer=100;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(){
        this.timer--;
        if(this.timer==0 || (this.x<0 || this.x>screen.width || this.y<0 || this.y>screen.height)){
            if(this.x<0 || this.x>screen.width || this.y<0 || this.y>screen.height){
                this.dead=true;
            }
            else{
                this.timer=100;
            }
            let temp=new EnemyBullet(1.5, 1.5, 1, this.x-5, this.y-5);
            temp.image.width=20;
            temp.image.height=20;
            temp.image.src="images/blue.webp";
            temp.frostbite=true;
            enemyBullets.push(temp);
            let temp2=new EnemyBullet(1.5, -1.5, 1, this.x-5, this.y-5);
            temp2.image.width=20;
            temp2.image.height=20;
            temp2.image.src="images/blue.webp";
            temp2.frostbite=true;
            enemyBullets.push(temp2);
            let temp3=new EnemyBullet(-1.5, 1.5, 1, this.x-5, this.y-5);
            temp3.image.width=20;
            temp3.image.height=20;
            temp3.image.src="images/blue.webp";
            temp3.frostbite=true;
            enemyBullets.push(temp3);
            let temp4=new EnemyBullet(-1.5, -1.5, 1, this.x-5, this.y-5);
            temp4.image.width=20;
            temp4.image.height=20;
            temp4.image.src="images/blue.webp";
            temp4.frostbite=true;
            enemyBullets.push(temp4);
        }
    }

}
class EnemyTrap extends EnemyBullet{
    constructor(damage, x, y, width, height){
        super(0, 0, damage, x, y);
        this.image.src='images/trap.webp';
        this.image.width=width-10;
        this.image.height=height-10;
        this.image.style.width=width+"px";
        this.image.style.height=height+"px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.deathTimer=900;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(){
        this.deathTimer--;
        if(this.deathTimer==0){
            this.dead=true;
        }
    }

}
class BlackHole extends EnemyBullet{
    constructor(damage, x, y, vx, vy){
        super(vx, vy, damage, x, y);
        this.image.src='images/blackHole.webp';
        this.image.width=40;
        this.image.height=40;
        this.image.style.width=40+"px";
        this.image.style.height=40+"px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.deathTimer=400;
        this.iFrame=0;

        this.background=document.createElement("img");
        this.background.src="images/spiral.webp";
        this.background.style.width="400px";
        this.background.style.height="400px";
        this.background.style.left=(this.x)+"px";
        this.background.style.top=(this.y)+"px";
        this.background.zIndex=-2;
        this.background.style.position="absolute"
        this.background.style.opacity="0.1";
        this.background.style.transform = "translate(-50%, -50%)";
        document.getElementById("world").appendChild(this.background);
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move(){
        this.x+=this.speedX;
        this.y+=this.speedY;
        this.image.style.left=(this.x)+"px";
        this.image.style.top=(this.y)+"px";
        this.background.style.left=(this.x)+"px";
        this.background.style.top=(this.y)+"px";
        const dx = (this.x + 5) - (player.x + 5);
        const dy = (this.y + 5) - (player.y + 5);
        const distance = Math.sqrt(dx * dx + dy * dy);
    }
    special(){
        this.deathTimer--;
        
        const dx = (this.x + 5) - (player.x + 5);
        const dy = (this.y + 5) - (player.y + 5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        //console.log(dx+" "+dy+" "+this.x+" "+this.y+" "+this.speedX+" "+this.speedY);
        if(distance<225){
            if(dx>0 && dy>0){
                player.AddForce(Math.max(0,0.25-dx/1000),Math.max(0,0.25-dy/1000));
            }
            if(dx<0 && dy>0){
                player.AddForce(Math.min(0,-0.25-dx/1000),Math.max(0,0.25-dy/1000));
            }
            if(dx>0 && dy<0){
                player.AddForce(Math.max(0,0.25-dx/1000),Math.min(0,-0.25-dy/1000));
            }
            if(dx<0 && dy<0){
                player.AddForce(Math.min(0,-0.25-dx/1000),Math.min(0,-0.25-dy/1000));
            }
        }
        if(distance<150){
            if(dx>0 && dy>0){
                player.AddForce(Math.max(0,0.2-dx/1000),Math.max(0,0.2-dy/1000));
            }
            if(dx<0 && dy>0){
                player.AddForce(Math.min(0,-0.2-dx/1000),Math.max(0,0.2-dy/1000));
            }
            if(dx>0 && dy<0){
                player.AddForce(Math.max(0,0.2-dx/1000),Math.min(0,-0.2-dy/1000));
            }
            if(dx<0 && dy<0){
                player.AddForce(Math.min(0,-0.2-dx/1000),Math.min(0,-0.2-dy/1000));
            }
        }
        if(distance<15+this.image.width/2 && this.iFrame<=0){
            player.takeDamage(this.damage, this);
            this.iFrame=40;
        }
        if(this.deathTimer==0){
            this.dead=true;
            this.background.remove();
        }
        this.iFrame--;
    }

}

class Laser extends EnemyBullet{
    constructor(angle, x, y){
        super(0,0,0.1, x, y);
        this.spawnAngle=angle;
        this.warningTimer=60;
        this.despawnTimer=125;
        this.image.height=2000;
        this.image.width=10;
        this.image.style.position = "absolute";
        this.image.style.transformOrigin = "center top";
        this.image.src="images/yellow.webp";
        this.image.style.left = (x - this.image.width / 2) + "px";  // center horizontally on x
        this.image.style.top = y + "px";  
        this.image.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
        this.image.style.filter="brightness(30%)";
        this.image.style.zIndex=0;
    }
    move(){
        if(this.warningTimer<0){
            if(this.iFrame>0){
                this.iFrame--;
            }
            else{
                let dx = player.x - this.x;
                let dy = player.y - this.y;
                let distanceToLine = Math.abs(dx * Math.sin(this.spawnAngle) - dy * Math.cos(this.spawnAngle));

                let forwardDistance = dx * Math.cos(this.spawnAngle) + dy * Math.sin(this.spawnAngle);

                if (distanceToLine < 30 && forwardDistance > -15) {
                    player.takeDamage(1,this);
                    this.iFrame = 10;
                }
            }
        }
        this.timer();
    }
    timer(){
        if(this.despawnTimer==0){
            this.dead=true;
        }
        if(this.warningTimer<=0){
            this.image.width=20;
            this.despawnTimer--;
            this.image.style.filter="brightness(100%)";
        }
        this.warningTimer--;
    }
}
class Fire extends EnemyBullet{
    constructor(damage, x, y, vx, vy){
        super(vx, vy, damage, x, y);
        this.image.src='images/fire.webp';
        this.image.width=40;
        this.image.height=40;
        this.image.style.width=40+"px";
        this.image.style.height=40+"px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.deathTimer=30;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(){
        this.deathTimer--;
        if(this.deathTimer==0){
            this.dead=true;
        }
    }

}
class Water extends EnemyBullet{
    constructor(damage, x, y, vx, vy){
        super(vx, vy, damage, x, y);
        this.image.src='images/water.webp';
        this.image.width=40;
        this.image.height=40;
        this.image.style.width=40+"px";
        this.image.style.height=40+"px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.deathTimer=120;
        this.frostbite=true;
        this.hit=false;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(){
        this.deathTimer--;
        if(this.deathTimer==0){
            this.dead=true;
        }
    }
    move(){

        this.x+=this.speedX;
        this.y+=this.speedY;
        this.image.style.left=(this.x)+"px";
        this.image.style.top=(this.y)+"px";
        const dx = (this.x + 5) - (player.x + 5);
        const dy = (this.y + 5) - (player.y + 5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 15+this.image.width/2 && this.hit==false) {
            player.AddForce(-dx/3.5,-dy/3.5);
            player.slowTimer=120;
            this.hit=true;
        }
        if(this.x<-500 || this.y<-500 || this.x>screen.width+500 || this.y>=screen.height+500){
            this.dead=true;
        }
    }

}
class BigRock extends EnemyBullet{
    constructor(damage, x, y, vx, vy){
        super(vx, vy, damage, x, y);
        this.image.src='images/bigRock.webp';
        this.image.width=80;
        this.image.height=80;
        this.image.style.width=80+"px";
        this.image.style.height=80+"px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.deathTimer=100;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    special(){
        this.deathTimer--;
        if(this.deathTimer==0){
            for(let i=0;i<8;i++){
                let angle=i*Math.PI*2/8;
                bullets.push(new SmallRock(1, this.x, this.y, 5*Math.sin(angle), 5*Math.cos(angle)));
            }
            this.dead=true;
        }
    }

}
class SmallRock extends EnemyBullet{
    constructor(damage, x, y, vx, vy){
        super(vx, vy, damage, x, y);
        this.image.src='images/smallRock.webp';
        this.image.width=40;
        this.image.height=40;
        this.image.style.width=40+"px";
        this.image.style.height=40+"px";
        this.image.style.transform = "translate(-50%, -50%)";
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }

}

class ChargingOrb extends EnemyBullet{
    constructor(x, y, speedX, speedY){
        super(speedX,speedY,1,x, y);
        this.shootTimer=600;
        this.explodeTimer=0;
        this.image.height=25;
        this.image.width=25;
        this.speedX=speedX;
        this.speedY=speedY;
        this.image.style.height="25px";
        this.image.style.width="25px";
        this.image.style.position = "absolute";
        this.image.style.transformOrigin = "center top";
        this.image.src="images/chargedOrb.webp";
        this.image.style.left = (x) + "px";  // center horizontally on x
        this.image.style.top = y + "px";  
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.zIndex=1;
        this.scale=25;
        this.iFrame=0;
        this.hitEnemies = new Set();
    }
    move(){
        if(this.explodeTimer>0){
            this.x+=this.speedX;
            this.y+=this.speedY;
        }
        else{
            this.x+=this.speedX*0.1;
            this.y+=this.speedY*0.1;
        }
        this.image.style.left = this.x + "px";
        this.image.style.top=this.y+"px";
        this.shootTimer--;
        this.explodeTimer--;
        this.iFrame--;
        if(this.shootTimer==0 && this.explodeTimer<0){
            this.explodeTimer=300;
            
            let distanceX=player.x-this.x;
            let distanceY=player.y-this.y;
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if (distance > 0) {
                let angle=Math.atan2(distanceY, distanceX);
                this.speedX=3*Math.cos(angle);
                this.speedY=3*Math.sin(angle);
            }
            
            
        }
        if(this.iFrame<=0 && RectCircleColliding(this, player, this.image.width/2-10, this.x, this.y)){
            player.takeDamage(this.damage, this);
            this.iFrame=15;
            
        }
        
        if(this.explodeTimer==0){
            this.dead=true;
        }
        if(this.explodeTimer<0){
            this.scale+=0.75;
           // console.log(this.image.style.height+" "+(this.image.width)+" BEFORE");
            this.image.width=this.scale;
            this.image.style.width=this.scale+"px";
            this.image.height=this.scale;
            this.image.style.height=this.scale+"px";
            //console.log(this.image.style.height+" "+(this.image.width)+" AFTER");
        }
        if(this.x<-500 || this.y<-500 || this.x>screen.width+500 || this.y>=screen.height+500){
            this.dead=true;
        }
        
    }
}
class SpinningBullet extends EnemyBullet{
    constructor(speedX, speedY, damage, x, y){
        super(speedX, speedY, damage, x, y);
        this.image.src='images/blue.webp';
        this.image.width=20;
        this.image.height=20;
        this.image.style.width=20+"px";
        this.image.style.height=20+"px";
        this.centerX=this.x;
        this.centerY=this.y;
        this.angle=0;
        this.offsetX=0;
        this.offsetY=0;
        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
    move(){
        this.centerX+=this.speedX;
        this.centerY+=this.speedY;
        this.angle+=0.1;
        this.angle%=2*Math.PI;
        this.offsetX=50*Math.cos(this.angle);
        this.offsetY=50*Math.sin(this.angle);
        this.x=this.centerX+this.offsetX;
        this.y=this.centerY+this.offsetY;
        this.image.style.left = this.x + "px";
        this.image.style.top=this.y+"px";
        
        if(RectCircleColliding(this, player, this.image.width/2-10, this.x, this.y)){
            player.takeDamage(this.damage, this);
            this.dead=true;
            
        }
        if(this.x<-500 || this.y<-500 || this.x>screen.width+500 || this.y>=screen.height+500){
            this.dead=true;
        }

    }
    special(){
    }

}

/*
^ ENEMY BULLETS

v COLLECTABLES
*/

class XPBag{
    constructor(x, y){
        this.image=document.createElement("img");
        this.image.src='images/xpBag.webp';
        this.x=x;
        this.y=y;
        this.image.style.position = 'absolute';
        this.size=Math.round(Math.random()*50+10);
        this.image.width = this.size*2;
        this.image.height = this.size*2;
        this.image.style.width = this.size*2+"px";
        this.image.style.height = this.size*2+"px";
        this.image.style.left = this.x+'px';
        this.image.style.top= this.y+'px';
        this.image.style.transform = "translate(-50%, -50%)";
        this.timer=600;
        this.image.style.zIndex=-1;
        document.getElementById("world").appendChild(this.image);
    }
    act(){
        this.timer--;
        if (this.x<player.x+player.image.width && this.x+this.image.width-this.image.width/6>player.x && this.y<player.y+player.image.height && this.y+this.image.height-this.image.width/6>player.y) {
            player.currentExp+=this.size/2*(1+player.level*0.2);
            this.dead=true;
        }
        if(this.timer==0)this.dead=true;
    }
}

class HealthPotion{
    constructor(x, y){
        this.image=document.createElement("img");
        this.image.src='images/healthPotion.webp';
        this.x=x;
        this.y=y;
        this.image.style.position = 'absolute';
        this.size=Math.ceil(Math.random()*4);
        this.image.width = (this.size*20+15);
        this.image.height = (this.size*20+15);
        this.image.style.width = (this.size*20+15)+"px";
        this.image.style.height = (this.size*20+15)+"px";
        this.image.style.left = this.x+'px';
        this.image.style.top= this.y+'px';
        this.image.style.transform = "translate(-50%, -50%)";
        this.timer=600;
        this.image.style.zIndex=-1;
        document.getElementById("world").appendChild(this.image);
    }
    act(){
        this.timer--;
        if (this.x<player.x+player.image.width && this.x+this.image.width-this.image.width/6>player.x && this.y<player.y+player.image.height && this.y+this.image.height-this.image.width/6>player.y) {
            player.health=Math.min(player.maxHealth, player.health+this.size);
            let damageText=document.createElement("div");
            damageText.style.position="absolute"
            damageText.innerHTML=`<div style="position:absolute; color:green;pointer-events:none; font-size:30px" >${this.size}</div>`
            
            damageText.style.left=(player.x-player.image.width/2+Math.random()*50)+"px";
            damageText.style.top=player.y+"px";
            document.getElementById("world").appendChild(damageText);
            moveText(damageText, 0, parseInt(damageText.style.top));
            this.dead=true;
        }
        if(this.timer==0)this.dead=true;
    }
}


class Player{    
    constructor(){
        this.image=document.createElement("img");
        this.image.src='images/player.webp';
        this.speed=5;
        this.x=screen.width/2;
        this.y=screen.height/2;
        this.image.style.position = 'absolute';
        this.image.width = 50;
        this.image.height = 50;
        this.image.style.left = this.x+'px';
        this.image.style.top= this.y+'px';
        this.image.style.width="50px";
        this.image.style.height="50px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.health=10;
        this.currentExp=0;
        this.nextLevel=100;
        this.damage=1;
        this.maxHealth=10;
        this.projectiles=4;
        this.slowed=false;
        this.frostProjectiles=0;
        this.frostProjectileCooldown=60;
        this.frostProjectileMaxCooldown=80;
        this.laserProjectiles=0;
        this.slowTimer=0;
        this.attackSpeed=30;
        this.bulletCooldown=0;
        this.siphon=0;
        this.redTimer=0;
        this.bombTimer=1;
        this.bombCount=0;
        this.xpMultiplier=1;
        this.accelerationX=0;
        this.accelerationY=0;
        this.timeWarpTimer=0;
        this.timeWarp=0;
        this.passiveHealing=0;
        this.passiveHealingTimer=0;
        this.level=1;
        document.getElementById("world").appendChild(this.image);
    }
    takeDamage(damage, bullet){
        //console.log(damage);
        this.health-=damage;
        //console.log(this.health);
        let damageText=document.createElement("div");
        damageText.style.position="absolute"
        damageText.innerHTML=`<div style="position:absolute; color:red;pointer-events:none; font-size:30px" >${damage}</div>`
        if(bullet.frostbite){   
            damageText.innerHTML=`<div style="position:absolute; color:cyan;pointer-events:none; font-size:30px" >${damage}</div>`
        }
        damageText.style.left=(this.x-this.image.width/2+Math.random()*50)+"px";
        damageText.style.top=this.y+"px";
        document.getElementById("world").appendChild(damageText);
        moveText(damageText, 0, parseInt(damageText.style.top));
        if(this.health<=0){
            lose();
        }
        if(bullet.frostbite){
            this.slowTimer=120;
        }
        this.redTimer=10;
    }
    act(){
        if(this.bulletCooldown<=0){
            this.bulletCooldown=this.attackSpeed;
            let angle=0;
            for(let i=0;i<this.projectiles;i++){
                bullets[bullets.length]=new Bullet(10*Math.cos(angle), 10*Math.sin(angle), this.damage);
                angle+=2*Math.PI/this.projectiles;
            }
        }
        if(this.frostProjectiles>0 && this.frostProjectileCooldown<=0){
            this.frostProjectileCooldown=this.frostProjectileMaxCooldown;
            if(enemies.length>0){
                let closestEnemy=-1;
                let enemyDist=999999;
                for(let i=0;i<enemies.length;i++){
                    let newDist=Math.hypot(Math.abs(enemies[i].x-this.x), Math.abs(enemies[i].y-this.y));
                    if(newDist<enemyDist && enemies[i].ignoreBullets==false){
                        enemyDist=newDist;
                        closestEnemy=i;
                    }
                }
                let distanceX=Math.abs(this.x-enemies[closestEnemy].x);
                let distanceY=Math.abs(this.y-enemies[closestEnemy].y);
                let vx=0;
                let vy=0;
                if(closestEnemy!=-1){
                    if(distanceX==0){
                        if(this.y>enemies[closestEnemy].y){
                            vy-=this.speed;
                        }
                        if(this.y<enemies[closestEnemy].y){
                            vy+=this.speed;
                        }
                    }
                    else{
                        let angle=Math.atan(distanceY/distanceX);
                        if(this.x>enemies[closestEnemy].x){
                            vx-=this.speed*Math.cos(angle);
                        }
                        if(this.y>enemies[closestEnemy].y){
                            vy-=this.speed*Math.sin(angle);
                        }
                        if(this.x<enemies[closestEnemy].x){
                            vx+=this.speed*Math.cos(angle);
                        }
                        if(this.y<enemies[closestEnemy].y){
                            vy+=this.speed*Math.sin(angle);
                        }
                        //console.log(this.x+" "+this.y+" "+Math.sin(angle)+" "+Math.cos(angle)+" "+angle);
                    }
                    bullets[bullets.length]=new FrostBullet(vx, vy, 1);
                }
                else{
                    bullets[bullets.length]=new FrostBullet(10, 0, 1);
                }

            }
            else{
                bullets[bullets.length]=new FrostBullet(10, 0, 1);
            }
            
        }
        //console.log(this.slowed);
        if(this.slowed || this.slowTimer>0){
            this.speed/=2;
        }
        if(timeWarpCounter>0){
            this.speed*=2;
        }
        if(movingUp && movingLeft){
            this.y-=this.speed/1.4142;
            this.x-=this.speed/1.4142;
        }
        else if(movingUp && movingRight){
            this.y-=this.speed/1.4142;
            this.x+=this.speed/1.4142;
        }
        else if(movingDown && movingRight){
            this.y+=this.speed/1.4142;
            this.x+=this.speed/1.4142;
        }
        else if(movingDown && movingLeft){
            this.y+=this.speed/1.4142;
            this.x-=this.speed/1.4142;
        }
        else{
            if(movingUp){
                this.y-=this.speed;
            }
            if(movingDown){
                this.y+=this.speed;
            }
            if(movingRight){
                this.x+=this.speed;
            }
            if(movingLeft){
                this.x-=this.speed;
            }
        } 
        this.x+=this.accelerationX;
        this.y+=this.accelerationY;

        if(this.x<0)this.x=0;
        if(this.y<0)this.y=0;
        if(this.x>screen.width)this.x=screen.width;
        if(this.y>screen.height)this.y=screen.height;
        if(this.slowed || this.slowTimer>0)this.speed*=2;
        if(timeWarpCounter>0){
            this.speed/=2;
        }
        if(this.bombTimer<=0 && this.bombCount>0){
            bombIcon.indicator.style.color="red";
        }
        if(this.timeWarpTimer<=0 && this.timeWarp>0){
            timeWarpIcon.indicator.style.color="red";
        }
        if(this.redTimer<=0 && !this.slowed && this.slowTimer<=0){
            this.image.style.filter="sepia(0%) saturate(100%) hue-rotate(0deg)"
        }
        else if(this.slowed || this.slowTimer>0){

            this.image.style.filter="brightness(50%)";
        }
        else{
            this.image.style.filter="sepia(100%) saturate(500%) hue-rotate(320deg)";
            this.redTimer--;
        }
        if(this.passiveHealingTimer<=0 && this.passiveHealing>0){
            this.passiveHealingTimer=480;
            
            this.health=Math.min(this.maxHealth, this.health+this.passiveHealing);
            let damageText=document.createElement("div");
            damageText.style.position="absolute"
            damageText.innerHTML=`<div style="position:absolute; color:green;pointer-events:none; font-size:30px" >${this.passiveHealing}</div>`
            
            damageText.style.left=(this.x-this.image.width/2+Math.random()*50)+"px";
            damageText.style.top=this.y+"px";
            document.getElementById("world").appendChild(damageText);
            moveText(damageText, 0, parseInt(damageText.style.top));
        }
        this.Timers();
    }
    Timers(){
        this.frostProjectileCooldown--;
        this.slowTimer--;
        this.bulletCooldown--;
        this.bombTimer--;
        this.timeWarpTimer--;
        this.passiveHealingTimer--;
        this.accelerationX/=1.05;
        this.accelerationY/=1.05;

    }
    AddForce(x, y){
        this.accelerationX+=x;
        this.accelerationY+=y;
    }
    AddDamageAura(){
        
    }
}

class HealthBar{
    constructor(){
        this.image1=document.createElement("img");
        this.image2=document.createElement("img");
        this.image1.src='images/green.webp';
        this.image2.src='images/red.webp';
        this.image1.style.position='absolute';
        this.image2.style.position='absolute';
        this.image1.style.width = "400px";
        this.image1.style.height = "30px";
        this.image2.style.width = "400px";
        this.image2.style.height = "30px";
        this.image1.style.left = "10px";
        this.image1.style.top= "60px";
        this.image2.style.left = "10px";
        this.image2.style.top= "60px";
        this.image1.style.zIndex=2;
        this.image2.style.zIndex=2;
        //console.log(this.image1.style.width+" "+this.image2.style.width+" "+this.image1.style.left+" "+this.image2.style.left);
        document.body.appendChild(this.image2);
        document.body.appendChild(this.image1);
    }
    Update(){
        this.desiredWidth=Math.ceil(player.health/player.maxHealth*400);
        if(this.desiredWidth<this.image1.width){
            requestAnimationFrame(DecreaseHealthBar);
        }
        else{
            requestAnimationFrame(IncreaseHealthBar)
        }
        
    }
}

function DecreaseHealthBar(){
    if(healthBar.image1.width-8<healthBar.desiredWidth){
        healthBar.image1.width=healthBar.desiredWidth;
        healthBar.image1.style.width=healthBar.desiredWidth+"px";
    }
    else{
        healthBar.image1.width-=8;
        healthBar.image1.style.width=(parseInt(healthBar.image1.style.width)-8)+"px";
    }
    if(healthBar.desiredWidth<healthBar.image1.width){
        requestAnimationFrame(DecreaseHealthBar)
    }
}

function IncreaseHealthBar(){
    if(healthBar.image1.width+8>healthBar.desiredWidth){
        healthBar.image1.width=healthBar.desiredWidth;
        healthBar.image1.style.width=healthBar.desiredWidth+"px";
    }
    else{
        healthBar.image1.width+=8;
        healthBar.image1.style.width=(parseInt(healthBar.image1.style.width)+8)+"px";
    }
    if(healthBar.desiredWidth>healthBar.image1.width){
        requestAnimationFrame(IncreaseHealthBar)
    }
}

class LevellingBar{
    constructor(){
        this.image1=document.createElement("img");
        this.image2=document.createElement("img");
        this.image1.src='images/black.webp';
        this.image2.src='images/yellow.webp';
        this.image1.style.position='absolute';
        this.image2.style.position='absolute';
        this.image1.style.width = "400px";
        this.image1.style.height = "30px";
        this.image2.style.width = "0px";
        this.image2.style.height = "30px";
        this.image1.style.left = "10px";
        this.image1.style.top= "100px";
        this.image2.style.left = "10px";
        this.image2.style.top= "100px";
        this.image1.style.zIndex=2;
        this.image2.style.zIndex=2;
        document.body.appendChild(this.image1);
        document.body.appendChild(this.image2);
        this.instances=0;
        //console.log(this.image1.style.top+" asdkjf what");
    }
    Update(){
        
        this.desiredWidth=Math.min(player.currentExp/player.nextLevel*400, 400);
        this.speed=(this.desiredWidth-parseInt(this.image2.style.width))/5;
        if(this.instances==0){
            requestAnimationFrame(IncreaseLevelBar);
            this.instances=1;
        }
        let extraExp=0;
        if(player.currentExp>=player.nextLevel){
            extraExp=player.currentExp-player.nextLevel;
            player.level++;
            if(player.level<6){
                player.nextLevel*=1.5;
            }
            else if(player.level<9){
                player.nextLevel*=1.3;
            }
            else{
                player.nextLevel*=1.1;
            }
            //console.log(player.nextLevel+" "+player.level);
            player.currentExp=0;
            player.health=Math.min(player.health+5, player.maxHealth);
            // console.log(player.currentExp+" "+player.nextLevel);
            //this.image2.style.width=(player.currentExp/player.nextLevel*400)+"px";
            ChangePage("upgradePage", true);
        }
    }
}

function IncreaseLevelBar(){
    //console.log(levellingBar.instances);
    //console.log(levellingBar.image2.style.width);
    if(parseInt(levellingBar.image2.style.width)+levellingBar.speed>levellingBar.desiredWidth){
        levellingBar.image2.style.width=levellingBar.desiredWidth+"px";
    }
    else{
        levellingBar.image2.style.width=(parseInt(levellingBar.image2.style.width)+levellingBar.speed)+"px";
    }
    if(levellingBar.desiredWidth>parseInt(levellingBar.image2.style.width)){
        requestAnimationFrame(IncreaseLevelBar)
    }
    else levellingBar.instances=0;
}

function DecreaseLevelBar(){
    if(levellingBar.image2.width-8<levellingBar.desiredWidth){
        levellingBar.image2.width=levellingBar.desiredWidth;
    }
    else{
        levellingBar.image2.width-=8;
    }
    if(levellingBar.desiredWidth<levellingBar.image2.width){
        requestAnimationFrame(DecreaseLevelBar  )
    }
}

class BossBar{
    constructor(owner){
        this.image1=document.createElement("img");
        this.image2=document.createElement("img");
        this.image1.src='images/red.webp';
        this.image2.src='images/green.webp';
        this.image1.style.position='absolute';
        this.image2.style.position='absolute';
        this.image1.width = 600;
        this.image1.height = 30;
        this.image2.width = 600;
        this.image2.height = 30;
        this.image1.style.width = "600px";
        this.image1.style.height = "30px";
        this.image2.style.width = "600px";
        this.image2.style.height = "30px";
        this.image1.style.left = (screen.width/2-300)+"px";
        this.image1.style.top= (50+75*bossBars.length)+"px";
        this.image2.style.left = (screen.width/2-300)+"px";
        this.image2.style.top= (50+75*bossBars.length)+"px";
        this.image1.style.zIndex=2;
        this.image2.style.zIndex=2;
        this.owner=owner;
        document.body.appendChild(this.image1);
        document.body.appendChild(this.image2);
        this.DecreaseHealthBar = this.DecreaseHealthBar.bind(this);
        this.IncreaseHealthBar = this.IncreaseHealthBar.bind(this);
        //console.log(this.image1.style.top+" asdkjf what");
    }
    Update(){
        this.desiredWidth=this.owner.health/this.owner.maxHealth*600;
        requestAnimationFrame(this.DecreaseHealthBar);
    }
    DecreaseHealthBar(){
        if(this.image2.width-8<this.desiredWidth){
            this.image2.width=this.desiredWidth;
            this.image2.style.width=this.desiredWidth+"px";
        }
        else{
            this.image2.width-=8;
            this.image2.style.width=(parseInt(this.image2.style.width)-8)+"px";
        }
        if(this.desiredWidth<this.image2.width){
            requestAnimationFrame(this.DecreaseHealthBar)
        }
    }

    IncreaseHealthBar(){
        if(this.image1.width+8>this.desiredWidth){
            this.image1.width=this.desiredWidth;
            this.image1.style.width=this.desiredWidth+"px";
        }
        else{
            this.image1.width+=8;
            this.image1.style.width=(parseInt(this.image1.style.width)+8)+"px";
        }
        if(this.desiredWidth>this.image1.width){
            requestAnimationFrame(this.IncreaseHealthBar)
        }
    }
}


class BombIcon{
    constructor(size){
        this.size=size;
        this.image=document.createElement("img");
        this.image.src='images/bomb.webp';
        this.image.style.position='absolute';
        this.image.width = size;
        this.image.height = size;
        this.image.style.left = size+"px";
        this.image.style.top= size+"px";
        this.image.style.left = (screen.width-300)+"px";
        this.image.style.top= "40px";
        this.image.style.transform="translate(-50%, -50%)";
        this.image.style.zIndex=2;
        document.body.appendChild(this.image);
        this.indicator=document.createElement("div");this.indicator = document.createElement("div");
        this.indicator.style.position = "absolute";
        this.indicator.style.left = (screen.width - 200) + "px";
        this.indicator.style.top = "40px";
        this.indicator.style.zIndex = "2";
        this.indicator.style.transform = "translate(-50%, -50%)";
        this.indicator.style.pointerEvents = "none";
        this.indicator.style.fontSize = "50px";
        this.indicator.style.textAlign = "center";
        this.indicator.style.whiteSpace = "nowrap";
        this.indicator.style.fontFamily = "Black Ops One";
        this.indicator.style.color = "red";
        this.indicator.id="indicator";
        this.indicator.innerHTML = `<b>Q</b>`;

document.body.appendChild(this.indicator);
        console.log(this.indicator.style.left+" "+this.indicator.style.position);
        document.body.appendChild(this.indicator);
        

    }
    Switch(){
        console.log(this.indicator.style.color);
        if(this.indicator.style.color=="red"){
            this.indicator.style.color="black";
        }
        else{
            this.indicator.style.color="red";
        }
    }
}
class TimeWarpIcon{
    constructor(size){
        this.size=size;
        this.image=document.createElement("img");
        this.image.src='images/green.webp';
        this.image.style.position='absolute';
        this.image.width = size;
        this.image.height = size;
        this.image.style.left = size+"px";
        this.image.style.top= size+"px";
        this.image.style.left = (screen.width-300)+"px";
        this.image.style.top= "100px";
        this.image.style.transform="translate(-50%, -50%)";
        this.image.style.zIndex=2;
        document.body.appendChild(this.image);
        this.indicator=document.createElement("div");this.indicator = document.createElement("div");
        this.indicator.style.position = "absolute";
        this.indicator.style.left = (screen.width - 200) + "px";
        this.indicator.style.top = "100px";
        this.indicator.style.zIndex = "2";
        this.indicator.style.transform = "translate(-50%, -50%)";
        this.indicator.style.pointerEvents = "none";
        this.indicator.style.fontSize = "50px";
        this.indicator.style.textAlign = "center";
        this.indicator.style.whiteSpace = "nowrap";
        this.indicator.style.fontFamily = "Black Ops One";
        this.indicator.style.color = "red";
        this.indicator.id="indicator2";
        this.indicator.innerHTML = `<b>E</b>`;

        document.body.appendChild(this.indicator);
        console.log(this.indicator.style.left+" "+this.indicator.style.position);
        

    }
    Switch(){
        console.log(this.indicator.style.color);
        if(this.indicator.style.color=="red"){
            this.indicator.style.color="black";
        }
        else{
            this.indicator.style.color="red";
        }
    }
}
class WaveText{
    constructor(size){
        this.size=size;
        this.text=document.createElement("div");
        this.text.style.position = "absolute";
        this.text.style.left ="80px";
        this.text.style.top = "30px";
        this.text.style.zIndex = "2";
        this.text.style.transform = "translate(-50%, -50%)";
        this.text.style.pointerEvents = "none";
        this.text.style.fontSize = "45px";
        this.text.style.whiteSpace = "nowrap";
        this.text.style.color = "black";
        this.text.id="waveText";
        this.text.innerHTML = `<b>Wave 1</b>`;
        document.body.appendChild(this.text);
        

    }
    Update(){
        this.text.innerHTML=`<b>Wave ${currentWave}</b>`;
    }
}

//Tier 1: Enemy, ShooterEnemy, AimingEnemy, HomingEnemy
//Tier 2: ChargingEnemy, ShieldEnemy
//Boss: LaserBoss, IceBoss

const worldDiv = document.getElementById("world");
function RandomizeEnemies(numTier1, numTier2, numTier3, numBoss){
    bossesLeft=numBoss;
    let tier1=[1,2,3,4,5,6];
    let tier2=[1,2,3,4,5];
    let tier3=[1,2,3];
    let bosses=[1,2,3,4, 5];
    tier1=shuffle(tier1);
    tier2=shuffle(tier2);
    tier3=shuffle(tier3);
    bosses=shuffle(bosses);
    
    BasicEnemy.isActive=false;
    ShooterEnemy.isActive=false;
    AimingEnemy.isActive=false;
    HomingEnemy.isActive=false;
    ChargingEnemy.isActive=false;
    ShieldEnemy.isActive=false;
    TrapperEnemy.isActive=false;
    ZombieEnemy.isActive=false;
    GhostEnemy.isActive=false;
    PoisonEnemy.isActive=false;
    BlackHoleEnemy.isActive=false;
    BuilderEnemy.isActive=false;
    WindupEnemy.isActive=false;
    SpawnerEnemy.isActive=false;
    for(let i=0;i<numTier1;i++){
        switch (tier1[i]){
            case 1:
                BasicEnemy.isActive=true;
                if(!BasicEnemy.seen){
                    BasicEnemy.seen=true;
                    newEnemyQueue.push("images/enemy.webp");
                }
                break;
            case 2:
                ShooterEnemy.isActive=true;
                if(!ShooterEnemy.seen){
                    ShooterEnemy.seen=true;
                    newEnemyQueue.push("images/shooterEnemy.webp");
                }
                break;
            case 3:
                AimingEnemy.isActive=true;
                if(!AimingEnemy.seen){
                    AimingEnemy.seen=true;
                    newEnemyQueue.push("images/aimingEnemy.webp");
                }
                break;
            case 4:
                HomingEnemy.isActive=true;
                if(!HomingEnemy.seen){
                    HomingEnemy.seen=true;
                    newEnemyQueue.push("images/homingEnemy.webp");
                }
                break;
            case 5:
                TrapperEnemy.isActive=true;
                if(!TrapperEnemy.seen){
                    TrapperEnemy.seen=true;
                    newEnemyQueue.push("images/trapperEnemy.webp");
                }
                break;
            case 6:
                ZombieEnemy.isActive=true;
                if(!ZombieEnemy.seen){
                    ZombieEnemy.seen=true;
                    newEnemyQueue.push("images/zombieEnemy.webp");
                }
                break;
        }
    }
    for(let i=0;i<numTier2;i++){
        switch (tier2[i]){
            case 1:
                ChargingEnemy.isActive=true;
                if(!ChargingEnemy.seen){
                    ChargingEnemy.seen=true;
                    newEnemyQueue.push("images/chargingEnemy.webp");
                }
                break;
            case 2:
                ShieldEnemy.isActive=true;
                if(!ShieldEnemy.seen){
                    ShieldEnemy.seen=true;
                    newEnemyQueue.push("images/shieldEnemy.webp");
                }
                break;
            case 3:
                GhostEnemy.isActive=true;
                if(!GhostEnemy.seen){
                    GhostEnemy.seen=true;
                    newEnemyQueue.push("images/ghostEnemy.webp");
                }
                break;
            case 4:
                PoisonEnemy.isActive=true;
                if(!PoisonEnemy.seen){
                    PoisonEnemy.seen=true;
                    newEnemyQueue.push("images/poisonEnemy.webp");
                }
                break;
            case 5:
                BlackHoleEnemy.isActive=true;
                if(!BlackHoleEnemy.seen){
                    BlackHoleEnemy.seen=true;
                    newEnemyQueue.push("images/blackHoleEnemy.webp");
                }
                break;
        }
    }
    for(let i=0;i<numTier3;i++){
        switch (tier3[i]){
            case 1:
                BuilderEnemy.isActive=true;
                if(!BuilderEnemy.seen){
                    BuilderEnemy.seen=true;
                    newEnemyQueue.push("images/builderEnemy.webp");
                }
                break;
            case 2:
                WindupEnemy.isActive=true;
                if(!WindupEnemy.seen){
                    WindupEnemy.seen=true;
                    newEnemyQueue.push("images/windupEnemy.webp");
                }
                break;
            case 3:
                SpawnerEnemy.isActive=true;
                if(!SpawnerEnemy.seen){
                    SpawnerEnemy.seen=true;
                    newEnemyQueue.push("images/spawnerEnemy.webp");
                }
                break;
        }
    }
    for(let i=0;i<numBoss;i++){
        switch (bosses[i]){
            case 1:
                boss=new LaserBoss(1, 100);
                enemies[enemies.length]=boss;
                if(!LaserBoss.seen){
                    LaserBoss.seen=true;
                    newEnemyQueue.push("images/laserBoss.webp");
                }
                break;
            case 2:
                boss=new IceBoss(1, 150);
                if(!IceBoss.seen){
                    IceBoss.seen=true;
                    newEnemyQueue.push("images/iceBoss.webp");
                }
                enemies[enemies.length]=boss;
                break;
            case 3:
                boss=new BouncyBoss(5, 100, true);
                if(!BouncyBoss.seen){
                    BouncyBoss.seen=true;
                    newEnemyQueue.push("images/bouncyBoss.webp");
                }
                enemies[enemies.length]=boss;
                break;
            case 4:
                boss=new MageBoss(2, 100, true);
                if(!MageBoss.seen){
                    MageBoss.seen=true;
                    newEnemyQueue.push("images/mageWaterMode.webp");
                }
                enemies[enemies.length]=boss;
                break;
            case 5:
                boss=new BulletHellBoss(2, 100, true);
                if(!BulletHellBoss.seen){
                    BulletHellBoss.seen=true;
                    newEnemyQueue.push("images/bulletHellBoss.webp");
                }
                SCALE/=1.2;
                enemies[enemies.length]=boss;
                break;
        }
    }
    
}

function loop(){
    let timeChange=(Date.now()-lastTime)/1000
    lastTime=Date.now();
    accumulator+=timeChange;
    while(accumulator>frameRate){

        if(timeElapsed==1){
            healthBar.image1.style.width = "400px";
        }
        if(timeWarpCounter>0 && timeWarpCounter%2==0){
            timeWarpCounter--;
            background.src="images/timeWarpBackground.webp";
        }
        else{
            GameLogic();
            accumulator-=frameRate;
        }
    }
    if(page=="gamePage"){
        requestAnimationFrame(loop);
    }
}
function GameLogic(){
    if(timeWarpCounter==-1){
        background.src="images/background.webp";
    }
    const cameraX = (screen.width / 2) - (player.x+25); 
    const cameraY = (screen.height / 2) - (player.y+100); 

    worldDiv.style.left = cameraX + "px";
    worldDiv.style.top = cameraY + "px";
    player.act();
    if(enemySpawnTimer<0 && BasicEnemy.isActive){
        enemySpawnTimer=Math.random()*200+200;
        enemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new BasicEnemy(2, 5);
        enemies[enemies.length]=newEnemy;
    }
    if(shooterEnemySpawnTimer<0 && ShooterEnemy.isActive){
        shooterEnemySpawnTimer=Math.random()*200+300;
        shooterEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new ShooterEnemy(2, 3);
        enemies[enemies.length]=newEnemy;
        //console.log(newEnemy.health);
    }
    if(aimingEnemySpawnTimer<0 && AimingEnemy.isActive){
        aimingEnemySpawnTimer=Math.random()*400+400;
        aimingEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new AimingEnemy(3.5, 1);
        enemies[enemies.length]=newEnemy;
        //console.log(newEnemy.health);
    }
    if(homingEnemySpawnTimer<0 && HomingEnemy.isActive){
        homingEnemySpawnTimer=Math.random()*400+400;
        homingEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new HomingEnemy(1, 2);
        enemies[enemies.length]=newEnemy;
        //console.log(newEnemy.health);
    }
    if(chargingEnemySpawnTimer<0 && ChargingEnemy.isActive){
        chargingEnemySpawnTimer=Math.random()*500+900;
        chargingEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new ChargingEnemy(1, 8);
        enemies[enemies.length]=newEnemy;
        //console.log(newEnemy.health);
    }
    if(shieldEnemySpawnTimer<0 && ShieldEnemy.isActive){
        shieldEnemySpawnTimer=Math.random()*750+900;
        shieldEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new ShieldEnemy(1.5, 15);
        enemies[enemies.length]=newEnemy;
        //console.log(newEnemy.health);
    }
    if(trapperEnemySpawnTimer<0 && TrapperEnemy.isActive){
        trapperEnemySpawnTimer=Math.random()*400+400;
        trapperEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new TrapperEnemy(3, 4);
        enemies[enemies.length]=newEnemy;
        //console.log(newEnemy.health);
    }
    if(zombieEnemySpawnTimer<0 && ZombieEnemy.isActive){
        zombieEnemySpawnTimer=Math.random()*300+450;
        zombieEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new ZombieEnemy(2, 3);
        enemies[enemies.length]=newEnemy;
        //console.log(newEnemy.health);
    }
    if(ghostEnemySpawnTimer<0 && GhostEnemy.isActive){
        ghostEnemySpawnTimer=Math.random()*500+750;
        ghostEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new GhostEnemy(4, 4);
        enemies[enemies.length]=newEnemy;
        //console.log(newEnemy.health);
    }
    if(poisonEnemySpawnTimer<0 && PoisonEnemy.isActive){
        poisonEnemySpawnTimer=Math.random()*500+750;
        poisonEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new PoisonEnemy(1, 5);
        enemies[enemies.length]=newEnemy;
    }
    if(blackHoleEnemySpawnTimer<0 && BlackHoleEnemy.isActive){
        blackHoleEnemySpawnTimer=Math.random()*600+800;
        blackHoleEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new BlackHoleEnemy(1.5, 5);
        enemies[enemies.length]=newEnemy;
    }
    if(builderEnemySpawnTimer<0 && BuilderEnemy.isActive){
        builderEnemySpawnTimer=Math.random()*800+900;
        builderEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new BuilderEnemy(1.5, 12);
        enemies[enemies.length]=newEnemy;
    }
    if(windupEnemySpawnTimer<0 && WindupEnemy.isActive){
        windupEnemySpawnTimer=Math.random()*800+900;
        windupEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new WindupEnemy(2, 20);
        enemies[enemies.length]=newEnemy;
    }
    if(spawnerEnemySpawnTimer<0 && SpawnerEnemy.isActive){
        spawnerEnemySpawnTimer=Math.random()*900+1000;
        spawnerEnemySpawnTimer/=1+timeElapsed*SCALE;
        const newEnemy=new SpawnerEnemy(1.5, 25);
        enemies[enemies.length]=newEnemy;
    }
    if(xpBagTimer<0){
        xpBagTimer=Math.random()*200+200;
        const newCollectable=new XPBag(Math.random()*(screen.width-screen.width/10)+screen.width/20, Math.random()*(screen.height-screen.height/10)+screen.height/20);
        collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    if(healthPotionSpawnTimer<0){
        healthPotionSpawnTimer=Math.random()*600+700;
        const newCollectable=new HealthPotion(Math.random()*(screen.width-screen.width/10)+screen.width/20, Math.random()*(screen.height-screen.height/10)+screen.height/20);
        collectables.push(newCollectable);
        //console.log(newEnemy.health);
    }
    player.image.style.left = player.x+'px';
    player.image.style.top= player.y+'px';
    for(let i=enemies.length-1;i>=0;i--){
        enemies[i].move();
        enemies[i].special();
        if(enemies[i].dead){
            player.currentExp+=enemies[i].value*player.xpMultiplier;
            enemies[i].image.remove();
            enemies.splice(i,1);
        }
    }
    for(let i=bullets.length-1;i>=0;i--){
        bullets[i].move();
        if(bullets[i].dead){
            bullets[i].image.remove();
            bullets.splice(i,1);
        }
    }
    for(let i=enemyBullets.length-1;i>=0;i--){
        enemyBullets[i].move();
        enemyBullets[i].special();
        if(enemyBullets[i].dead){
            enemyBullets[i].image.remove();
            if(enemyBullets[i].image2){
                enemyBullets[i].image2.remove();
            }
            enemyBullets.splice(i,1);
        }

    }
    for(let i=collectables.length-1;i>=0;i--){
        collectables[i].act();
        if(collectables[i].dead){
            collectables[i].image.remove();
            collectables.splice(i,1);
        }
    }
    if(!isBossWave && timeElapsed>=waveTimer){
        ChangeWave();
    }
    if(newEnemyQueue.length>0){
        ChangePage("newEnemyPage");
    }
    enemySpawnTimer--;
    shooterEnemySpawnTimer--;
    aimingEnemySpawnTimer--;
    homingEnemySpawnTimer--;
    chargingEnemySpawnTimer--;
    shieldEnemySpawnTimer--;
    trapperEnemySpawnTimer--;
    zombieEnemySpawnTimer--;
    ghostEnemySpawnTimer--;
    poisonEnemySpawnTimer--;
    blackHoleEnemySpawnTimer--;
    timeWarpCounter--;
    builderEnemySpawnTimer--;
    windupEnemySpawnTimer--;
    spawnerEnemySpawnTimer--;
    healthPotionSpawnTimer--;
    xpBagTimer--;
    timeElapsed++;
    levellingBar.Update();
    healthBar.Update();
    //console.log(enemyBullets.length);


}
function ChangeWave(){
    currentWave++;
    waveText.Update();
    timeElapsed=0;
    bossBars=new Array();
    switch(currentWave){
        case 2:
            RandomizeEnemies(2,1,0,0);
            isBossWave=false;
            SCALE=0.0015;
            break;
        case 3:
            RandomizeEnemies(2,1,0,1);
            isBossWave=true;
            SCALE=0.0005;
            break;
        case 4:
            RandomizeEnemies(3,2,1,0);
            isBossWave=false;
            SCALE=0.001;
            break;
        case 5:
            RandomizeEnemies(1,2,1,1);
            isBossWave=true;
            SCALE=0.0004;
            break;
        case 6:
            RandomizeEnemies(2,3,1,1);
            isBossWave=true;
            SCALE=0.0005;
            break;
        case 7:
            RandomizeEnemies(2,2,2,2);
            isBossWave=true;
            SCALE=0.0005;
            break;
    }
}

function ChangePage(id, reset){
    if(continueFlag)return;
    console.log(id);
    if(gameOver && id!="gamePage" && id!="losePage"){
        return;
    }
    list=document.querySelectorAll('div[id$="Page"]');
    if(id!="upgradePage" && id!="newEnemyPage"){
        for(let i=0;i<list.length;i++){
            list[i].style.display="none";
        }
    }
    page=id;
    document.getElementById(id).style.display="block";
    if(id=="losePage"){
        document.querySelectorAll('img').forEach(img => img.remove());
        for(let i=0;i<enemies.length;i++){
            if(enemies[i].isBoss){
                enemies[i].bossText.remove();
            }
        }
        if(document.getElementById("indicator"))document.getElementById("indicator").remove();
        if(document.getElementById("indicator2"))document.getElementById("indicator2").remove();
        if(document.getElementById("waveText"))document.getElementById("waveText").remove();
    }
    if(id=="gamePage"){
        choice1.remove();
        choice2.remove();
        if(reset)Start();
        else{
        lastTime=Date.now();
            loop();
        }
    }
    if(id=="upgradePage"){
        paused=true;
        choice1=document.createElement("div");
        choice2=document.createElement("div");
        let randomNum=Math.floor(Math.random()*NUMUPGRADES);
        while(boughtUpgrades[randomNum]==1){
            randomNum=Math.floor(Math.random()*NUMUPGRADES);
        }   
        switch(randomNum){
            case 0:
                choice1.innerHTML=`<button onclick="increaseDamage(1)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">+1 Damage</button>`
                break;
            case 1:
                choice1.innerHTML=`<button onclick="increaseMaxHealth(10)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">+10 Max Health</button>`
                break;
            case 2:
                choice1.innerHTML=`<button onclick="increaseProjectiles(2)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">+2 Projectiles</button>`
                break;
            case 3:
                choice1.innerHTML=`<button onclick="addFrostProjectiles(1)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">+1 Frost Projectile Attack</button>`
                break;
            case 4:
                choice1.innerHTML=`<button onclick="addLaserProjectiles(1)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">Laser Attack</button>`
                break;
            case 5:
                choice1.innerHTML=`<button onclick="speedUpAttacks(1.2)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">Faster Attack Speed</button>`
                break;
            case 6:
                choice1.innerHTML=`<button onclick="addSiphon(0.25)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">+0.25 Siphon</button>`
                break;
            case 7:
                choice1.innerHTML=`<button onclick="multiplyXPGain(2)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">2x XP gain</button>`
                break;
            case 8:
                choice1.innerHTML=`<button onclick="addBomb(1)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">Bomb Attack (Aims to Mouse)</button>`
                break;
            case 9:
                choice1.innerHTML=`<button onclick="addTimeWarp(1)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">Speed Up Ability</button>`
                break;
            case 10:
                choice1.innerHTML=`<button onclick="AddPassiveHealing(1)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">+1 Passive Healing</button>`
                break;
            case 11:
                choice1.innerHTML=`<button onclick="Gamble(1)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">Mystery Box</button>`
                break;
            case 12:
                choice1.innerHTML=`<button onclick="AddProtectorBullet(2)" style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:120px; z-index:3" id="upgrade">+2 Protectors</button>`
                break;
        } 

        let randomNum2=Math.floor(Math.random()*NUMUPGRADES);
        while(randomNum==randomNum2 || boughtUpgrades[randomNum2]==1){
            randomNum2=Math.floor(Math.random()*NUMUPGRADES);
        }   

        switch(randomNum2){

            case 0:
                choice2.innerHTML=`<button onclick="increaseDamage(1)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">+1 Damage</button>`
                break;
            
            case 1:
                choice2.innerHTML=`<button onclick="increaseMaxHealth(10)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">+10 Max Health</button>`
                break;
               
            case 2:
                choice2.innerHTML=`<button onclick="increaseProjectiles(2)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">+2 projectiles</button>`
                break;
            case 3:
                choice2.innerHTML=`<button onclick="addFrostProjectiles(1)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">+1 Frost Projectile Attack</button>`
                break;
            case 4:
                choice2.innerHTML=`<button onclick="addLaserProjectiles(1)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">Laser Attack</button>`
                break;
            case 5:
                choice2.innerHTML=`<button onclick="speedUpAttacks(1.2)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">Faster Attack Speed</button>`
                break;
            case 6:
                choice2.innerHTML=`<button onclick="addSiphon(0.25)" style="position:absolute;left:${screen.width/2+100}px; text-align:center;top:120px; z-index:3" id="upgrade">+0.25 Siphon</button>`
                break;
            case 7:
                choice2.innerHTML=`<button onclick="multiplyXPGain(2)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">2x XP gain</button>`
                break;
            case 8:
                choice2.innerHTML=`<button onclick="addBomb(1)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">Bomb Attack (Aims to Mouse)</button>`
                break;
            case 9:
                choice2.innerHTML=`<button onclick="addTimeWarp(1)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">Speed Up Ability</button>`
                break;
            case 10:
                choice2.innerHTML=`<button onclick="AddPassiveHealing(1)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">+1 Passive Healing</button>`
                break;
            case 11:
                choice2.innerHTML=`<button onclick="Gamble(1)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">Mystery Box</button>`
                break;
            case 12:
                choice2.innerHTML=`<button onclick="AddProtectorBullet(2)" style="position:absolute;left:${screen.width/2+100}px; text-align:center; top:120px; z-index:3" id="upgrade">+2 Protectors</button>`
                break;
        }
        document.body.appendChild(choice1);
        document.body.appendChild(choice2);
    }
    if(id=="newEnemyPage"){
        newEnemyText(newEnemyQueue[0]);
        newEnemyQueue.splice(0,1);
    }
}

function lose(){

    let loseScreen=document.getElementById("loseText");
    if(loseScreen){
        loseScreen.remove();
    }
    gameOver=true;
    ChangePage("losePage", true);
}

function increaseDamage(amount){
    player.damage+=amount;
    boughtUpgrades[0]=1;
    
    ChangePage('gamePage', false)
}

function increaseMaxHealth(amount){
    player.health+=amount;
    player.maxHealth+=amount;
    ChangePage('gamePage', false)
}

function increaseProjectiles(amount){
    player.projectiles+=amount;
    boughtUpgrades[2]+=0.5;
    ChangePage('gamePage', false)
}

function addFrostProjectiles(amount){
    player.frostProjectiles+=amount;
    player.frostProjectileMaxCooldown=100/player.frostProjectiles;
    ChangePage('gamePage', false)
}
function addLaserProjectiles(amount){
    bullets.push(new PlayerLaser(-Math.PI/2, player.x, player.y))
    boughtUpgrades[4]=1;
    ChangePage('gamePage', false)
}
function speedUpAttacks(amount){
    player.attackSpeed/=amount;
    ChangePage('gamePage', false)
}
function addSiphon(amount){
    player.siphon+=amount;
    ChangePage('gamePage', false)
}
function multiplyXPGain(amount){
    player.xpMultiplier*=amount;
    ChangePage('gamePage', false)
}
function addBomb(amount){
    player.bombCount+=amount;
    bombIcon=new BombIcon(50);
    boughtUpgrades[8]=1;
    ChangePage('gamePage', false)
}
function addTimeWarp(amount){
    player.timeWarp+=amount;
    timeWarpIcon=new TimeWarpIcon(50);
    boughtUpgrades[9]=1;
    ChangePage('gamePage', false)
}
function AddPassiveHealing(amount){
    player.passiveHealing+=amount;
    ChangePage('gamePage', false)
}
function Gamble(numGambles){
    for(let i=0;i<numGambles;i++){
        gambleText=document.createElement("div");
        gambleTimer=Math.floor(Math.random()*300)+300;
        gambleText.innerHTML=`<div></div>`;
        document.body.appendChild(gambleText);
        textSpeed=5;
        document.querySelectorAll("button").forEach(upgrade=>upgrade.remove());
    
        Roll();
    }
}
function AddProtectorBullet(amount){
    for(let i=0;i<amount;i++){
        bullets.push(new ProtectorBullet(1));
    }
    ProtectorBullet.Spacing();
    ChangePage('gamePage', false)
}
function Roll(){
    if(gambleTimer%textSpeed==0 && gambleTimer>50){
        let randomNum=Math.random()*100;
        let prevChoice=gambleChoice;
        while(prevChoice==gambleChoice){

            if(randomNum<20){
                gambleChoice=Math.floor(Math.random()*2);
            }
            else if(randomNum<60){
                gambleChoice=Math.floor(Math.random()*3)+2;
            }
            else if(randomNum<80){
                gambleChoice=Math.floor(Math.random()*3)+5;
            }
            else if(randomNum<90){
                gambleChoice=Math.floor(Math.random()*2)+8;
            }
            else if(randomNum<97){
                gambleChoice=Math.floor(Math.random()*2)+10;
            }
            else{
                gambleChoice=Math.floor(Math.random()*2)+12;
            }
        }
        
        //console.log(gambleText);
        switch(gambleChoice){
            case 0:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:red; font-size:75px; background-color:gray" id="upgrade">-3 health</div>`
                break;
            case 1:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:red; font-size:75px;background-color:gray;" id="upgrade">-1 Speed</div>`
                break;
            case 2:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">Nothing</div>`
                break;
            case 3:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">Heal 10</div>`
                break;
            case 4:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:black; font-size:75px;background-color:gray;" id="upgrade">+2 Speed</div>`
                break;
            case 5:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+1 Damage</div>`
                break;
            case 6:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+2 Projectiles</div>`
                break;
            case 7:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:green; font-size:75px;background-color:gray;" id="upgrade">+0.25 Siphon</div>`
                break;
            case 8:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:blue; font-size:75px;background-color:gray;" id="upgrade">+4 Projectiles</div>`
                break;
            case 9:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:blue; font-size:75px;background-color:gray;" id="upgrade">+20 Max Health</div>`
                break;
            case 10:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:purple; font-size:75px;background-color:gray;" id="upgrade">+2 Damage</div>`
                break;
            case 11:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:purple; font-size:75px;background-color:gray;" id="upgrade">x3 XP multiplier</div>`
                break;
            case 12:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:yellow; font-size:75px;background-color:gray;" id="upgrade">+3 Damage</div>`
                break;
            case 13:
                gambleText.innerHTML=`<div style="position:absolute;left:${screen.width/2-100}px; text-align:center; top:300px; z-index:3; color:yellow; font-size:75px;background-color:gray; " id="upgrade">+40 Max Health</div>`
                break;

        }
    }
    if(gambleTimer==400){
        textSpeed=7;
    }
    if(gambleTimer==300){
        textSpeed=12;
    }
    if(gambleTimer==200){
        textSpeed=20;
    }
    if(gambleTimer==150){
        textSpeed=30;
    }
    if(gambleTimer==120){
        textSpeed=40;
    }
    if(gambleTimer>0){
        gambleTimer--;
        requestAnimationFrame(Roll);
    }
    else{
        gambleText.remove();
        switch(gambleChoice){
            case 0:
                player.health-=3;
                //console.log(this.health);
                if(player.health<=0){
                    lose();
                }
                ChangePage('gamePage', false)
                break;
            case 1:
                player.speed-=1;
                ChangePage('gamePage', false)
                break;
            case 2:
                ChangePage('gamePage', false)
                break;
            case 3:
                player.health=Math.min(player.health+10, player.maxHealth);
                ChangePage('gamePage', false)
                break;
            case 4:
                player.speed+=2;
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
async function newEnemyText(){
    let image=document.createElement("img");
    image.src=newEnemyQueue[0];
    image.style.width=300;
    image.style.height=300;
    image.style.position = 'absolute';
    image.style.width = "300px";
    image.style.height = "300px";
    image.style.left=(screen.width/2)+"px";
    image.style.top=(screen.height/2)+"px";
    image.style.transform = "translate(-50%, -50%)";
    image.style.zIndex=100;
    document.body.appendChild(image);
    continueFlag=true;
    await delay(3000);
    continueFlag=false;
    image.remove();
    ChangePage("gamePage", false);
}