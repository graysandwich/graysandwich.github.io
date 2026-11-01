class Lake{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.index=0;
        this.waters=[];
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                this.waters.push(new WaterTerrain(x+i*50,y+j*50,50,50));
            }
        }
        this.XPBag=new XPBag(this.x+this.width*50/2-25,this.y+this.height*50/2-25);
        this.XPBag.value=10000;
        this.XPBag.timer=9999999;
        this.XPBag.width=50;
        this.XPBag.height=50;
        this.centerX=this.x+this.width*50/2-25;
        this.centerY=this.y+this.height*50/2-25;
    }
    act(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        for(let i=0;i<this.waters.length;i++){
            this.waters[i].act();
        }
        if(!this.XPBag)return;
        this.XPBag.act([player]);
        if(this.XPBag.dead){
            player.currentExp += this.XPBag.value;
            this.XPBag=null;
        }
    }
    draw(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        for(let i=0;i<this.waters.length;i++){
            this.waters[i].draw();
        }
        if(this.XPBag){
            ctx.filter="hue-rotate(120deg)";
            drawCollectable(this.XPBag, collectableImages[this.XPBag.index]);
            ctx.filter="none";
        }
    }
}
class Dungeon{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.index=0;
        this.centerX=this.x+this.width*50/2-25;
        this.centerY=this.y+this.height*50/2-25;
        this.spawned=false;
        this.XPBag=new XPBag(this.x+this.width*50/2-25,this.y+this.height*50/2-25);
        this.XPBag.value=10000;
        this.XPBag.timer=9999999;
        this.XPBag.width=50;
        this.XPBag.height=50;
    }
    act(){
        let distance=(this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y);
        if(distance>1500000)return;
        if(this.spawned==false){
            this.spawned=true;
            for(let i=0;i<4;i++){

                let temp=new SentryEngineerEnemy(this.centerX+(-1*(i%2*2-1))*this.width*50/2, this.centerY+(-1*(i>1?1:-1))*this.height*50/2, 6);
                temp.structureEnemy=true;
                gameState.enemies.push(temp);
            }
        }
        if(!this.XPBag)return;
        this.XPBag.act([player]);
        if(this.XPBag.dead){
            player.currentExp += this.XPBag.value;
            this.XPBag=null;
        }
    }
    draw(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        
        if(this.XPBag){
            ctx.filter="hue-rotate(120deg)";
            drawCollectable(this.XPBag, collectableImages[this.XPBag.index]);
            ctx.filter="none";
        }
    }
}
class DigSite{
    constructor(x, y, width, height, numOfWalls){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.index=0;
        this.centerX=this.x+this.width*50/2-25;
        this.centerY=this.y+this.height*50/2-25;
        this.spawned=false;
        this.XPBag=new XPBag(this.x+this.width*50/2-25,this.y+this.height*50/2-25);
        this.XPBag.value=10000;
        this.XPBag.timer=9999999;
        this.XPBag.width=50;
        this.XPBag.height=50;
        this.numOfWalls=numOfWalls;
    }
    act(){
        let distance=(this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y);
        if(distance>1500000)return;
        if(this.spawned==false){
            this.spawned=true;
            for(let i=0;i<this.numOfWalls;i++){
                while(true){
                    let x=this.centerX+Math.random()*this.width*100-this.height*50
                    let y=this.centerY+Math.random()*this.height*100-this.height*50
                    if(Math.abs(x-this.centerX)>100 && Math.abs(y-this.centerY)>100){
                        let temp=new EnemyWall(x,y, 13);
                        temp.structureEnemy=true;
                        gameState.enemies.push(temp);
                        break;
                    }
                }
            }
        }
        if(!this.XPBag)return;
        this.XPBag.act([player]);
        if(this.XPBag.dead){
            player.currentExp += this.XPBag.value;
            this.XPBag=null;
        }
    }
    draw(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        
        if(this.XPBag){
            ctx.filter="hue-rotate(120deg)";
            drawCollectable(this.XPBag, collectableImages[this.XPBag.index]);
            ctx.filter="none";
        }
    }
}
class IceStructure{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.index=0;
        this.centerX=this.x+this.width*50/2-25;
        this.centerY=this.y+this.height*50/2-25;
        this.spawned=false;
        this.omenGlobe=new RPGItem(this.x+this.width*50/2-25,this.y+this.height*50/2-25);
        this.omenGlobe.timer=9999999;
        this.omenGlobe.width=50;
        this.omenGlobe.height=50;
    }
    act(){
        let distance=(this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y);
        if(distance>1750000)return;
        if(this.spawned==false){
            this.spawned=true;
            let spawnEnemies=[new IceEngineerEnemy(this.centerX, this.centerY+this.height*50/2, 15), new IceEngineerEnemy(this.centerX, this.centerY-this.height*50/2, 15),new IceEngineerEnemy(this.centerX-this.width*50/2, this.centerY, 15),new IceEngineerEnemy(this.centerX+this.width*50/2, this.centerY, 15), new IceEngineerEnemy(this.centerX-this.height*40, this.centerY-this.height*40, 15), new IceEngineerEnemy(this.centerX+this.height*40, this.centerY-this.height*40, 15), new IceEngineerEnemy(this.centerX-this.height*40, this.centerY+this.height*40, 15), new IceEngineerEnemy(this.centerX+this.height*40, this.centerY+this.height*40, 15)]
            
            let boss=new IceBoss(1, 75, bossBars, gameState.bossMultiplier);
            let index=Math.floor(Math.random()*4);
            boss.x=this.centerX;
            boss.y=this.centerY;
            boss.index=1010;
            boss.speed=0;
            boss.isBoss=false;
            boss.ignoreKnockback=true;
            boss.hasHealthBar=true;
            switch(index){
                case 0:
                    spawnEnemies[0]=boss;
                    boss.y+=this.height*50/2;
                    break;
                case 1:
                    spawnEnemies[1]=boss;
                    boss.y-=this.height*50/2;
                    break;
                case 2:
                    spawnEnemies[2]=boss;
                    boss.x-=this.width*50/2;
                    break;
                case 3:
                    spawnEnemies[3]=boss;
                    boss.x+=this.width*50/2;
                    break;
            }
            for(let i=0;i<spawnEnemies.length;i++){
                spawnEnemies[i].structureEnemy=true;
                gameState.enemies.push(spawnEnemies[i]);
            }

        }
        if(!this.omenGlobe)return;
        this.omenGlobe.act([player]);
        if(this.omenGlobe.dead){
            obtainingCollectable=true;
            if(player.RPGCollectables.omenGlobe==false){
                player.RPGCollectables.omenGlobe=true;
                newEnemyQueue.push("images/omenGlobe.webp");
            }
            else{
                player.currentExp+=999999;
            }
            this.omenGlobe=null;
            

        }
    }
    draw(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        
        if(this.omenGlobe){
            ctx.filter="hue-rotate(120deg)";
            drawCollectable(this.omenGlobe, collectableImages[this.omenGlobe.index]);
            ctx.filter="none";
        }
    }
}
class SpawnerStructure{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.index=0;
        this.centerX=this.x+this.width*50/2-25;
        this.centerY=this.y+this.height*50/2-25;
        this.spawned=false;
        this.cloner=new RPGItem(this.x+this.width*50/2-25,this.y+this.height*50/2-25);
        this.cloner.timer=9999999;
        this.cloner.width=50;
        this.cloner.height=50;
        this.cloner.index=4;
        this.iFrame=15;
    }
    act(){

        let distance=(this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y);
        if(distance>1500000)return;
        this.iFrame--;
        if (
            (player.x - player.width / 2) < (this.centerX + this.width*50 / 2) &&
            (player.x + player.width / 2) > (this.centerX - this.width*50 / 2) &&
            (player.y - player.height / 2) < (this.centerY + this.height*50 / 2) &&
            (player.y + player.height / 2) > (this.centerY - this.height*50 / 2) && this.iFrame <= 0
        ) {
            player.takeDamage(1, this, gameState.floatingObjects);
            this.iFrame = 20;
        }
        if(this.spawned==false){
            this.spawned=true;
            let enemy=new RPGSpawner(0,100);
            enemy.x=this.centerX;
            enemy.y=this.centerY;
            enemy.structureEnemy=true;
            gameState.enemies.push(enemy);
            

        }
        if(!this.cloner)return;
        this.cloner.act([player]);
        if(this.cloner.dead){
            obtainingCollectable=true;
            if(player.RPGCollectables.cloner==false){
                player.RPGCollectables.cloner=true;
                newEnemyQueue.push("images/cloner.webp");
            }
            else{
                player.currentExp+=999999;
            }
            this.cloner=null;
            

        }
    }
    draw(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        if (
            (player.x - player.width / 2) < (this.centerX + this.width*50 / 2) &&
            (player.x + player.width / 2) > (this.centerX - this.width*50 / 2) &&
            (player.y - player.height / 2) < (this.centerY + this.height*50 / 2) &&
            (player.y + player.height / 2) > (this.centerY - this.height*50 / 2) && this.iFrame <= 0
        ) {
            ctx.fillStyle="darkred";
        }
        else ctx.fillStyle="red";
        ctx.fillRect(this.centerX-300,this.centerY-300, 600, 600); 
        
        if(this.cloner){
            drawCollectable(this.cloner, collectableImages[this.cloner.index]);
            ctx.filter="none";
        }
    }
}
class PoisonStructure{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.index=0;
        this.centerX=this.x+this.width*50/2-25;
        this.centerY=this.y+this.height*50/2-25;
        this.spawned=false;
        this.brewingStand=new RPGItem(this.x+this.width*50/2-25,this.y+this.height*50/2-25);
        this.brewingStand.timer=9999999;
        this.brewingStand.width=50;
        this.brewingStand.height=50;
        this.brewingStand.index=5;
        this.iFrame=15;
        this.poisonTimer=360;
        
    }
    act(){

        let distance=(this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y);
        if(distance>1500000)return;
        this.poisonTimer--;
        if(this.poisonTimer<=0){
            this.poisonTimer=360;
            for(let i=0;i<20;i++){
                gameState.enemyBullets.push(new PoisonBomb(this.centerX, this.centerY, 5*Math.sin(Math.PI*2/20*i), 5*Math.cos(Math.PI*2/20*i),120));
            }
        }
        if(this.spawned==false){
            this.spawned=true;
            let enemy=new PoisonDefender(2,100,this,true);
            enemy.x=this.centerX;
            enemy.y=this.centerY;
            enemy.structureEnemy=true;
            gameState.enemies.push(enemy);
            
            let enemy2=new PoisonDefender(2,100,this,false);
            enemy2.x=this.centerX;
            enemy2.y=this.centerY;
            enemy.structureEnemy=true;
            gameState.enemies.push(enemy2);
            

        }
        if(!this.brewingStand)return;
        this.brewingStand.act([player]);
        if(this.brewingStand.dead){
            obtainingCollectable=true;
            if(player.RPGCollectables.brewingStand==false){
                player.RPGCollectables.brewingStand=true;
                newEnemyQueue.push("images/brewingStand.webp");
            }
            else{
                player.currentExp+=999999;
            }
            this.brewingStand=null;
            healthPotionSpawnMultiplier /=2;
            

        }
    }
    draw(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 50, 0, 2 * Math.PI);
        ctx.fillStyle="rgb(51, 13, 56)";
        ctx.fill();
        ctx.fillStyle="rgba(190, 45, 154, 0.73)";
        ctx.fillRect(this.centerX-350,this.centerY-350, 700, 700); 
        if(this.brewingStand){
            drawCollectable(this.brewingStand, collectableImages[this.brewingStand.index]);
            ctx.filter="none";
        }
    }
}
class RPGSpawner extends Enemy{
    constructor(speed, health){
        super(speed,health);
        this.shootTimer = 120;
        this.value = 500;
        this.height=100;
        this.width=100;
        this.index=1011;
        this.iFrame=0;
        this.cloner=new RPGItem(this.x+this.width*50/2-25,this.y+this.height*50/2-25);
        this.cloner.timer=9999999;
        this.cloner.width=50;
        this.cloner.height=50;
        this.cloner.index=4;
    }
    timer(enemies) {
        if(Math.hypot(player.x-this.x, player.y-this.y)>900)return;
        this.iFrame--;
        this.healTimer--;
        this.redTimer--;
        if (this.slowCountdown > 0) {
            this.slowCountdown--;
        }
        if (this.slowCountdown > 0) {
            this.shootTimer -= 0.5;
        }
        else {
            this.shootTimer--;
        }
        if (this.shootTimer <= 0) {
            for(let i=0;i<4;i++){
                this.shootTimer=900;
                let temp = Math.ceil(Math.random() * 6);
                let random=0;
                if (temp <= 3) {
                    random = 1;
                }
                else if (temp <= 5) {
                    random = 2;
                }
                else {
                    random = 3;
                }
                let enemy;
                if (random == 1) {
                    let random2 = Math.ceil(Math.random() * 6);
                    switch (random2) {
                        case 1:
                            enemy = new BasicEnemy(BasicEnemy.speed, BasicEnemy.health);
                            break;
                        case 2:
                            enemy = new ShooterEnemy(ShooterEnemy.speed, ShooterEnemy.health);
                            break;
                        case 3:
                            enemy = new AimingEnemy(AimingEnemy.speed, AimingEnemy.health);
                            break;
                        case 4:
                            enemy = new HomingEnemy(HomingEnemy.speed, HomingEnemy.health);
                            break;
                        case 5:
                            enemy = new TrapperEnemy(TrapperEnemy.speed, TrapperEnemy.health);
                            break;
                        case 6:
                            enemy = new ZombieEnemy(ZombieEnemy.speed, ZombieEnemy.health);
                            break;
                    }
                }
                else if (random == 2) {
                    let random2 = Math.ceil(Math.random() * 5)+1;
                    switch (random2) {
                        case 2:
                            enemy = new ShieldEnemy(ShieldEnemy.speed, ShieldEnemy.health);
                            break;
                        case 3:
                            enemy = new GhostEnemy(GhostEnemy.speed, GhostEnemy.health);
                            break;
                        case 4:
                            enemy = new PoisonEnemy(PoisonEnemy.speed, PoisonEnemy.health);
                            break;
                        case 5:
                            enemy = new BlackHoleEnemy(BlackHoleEnemy.speed, BlackHoleEnemy.health);
                            break;
                        case 6:
                            enemy = new MimicEnemy(MimicEnemy.speed, MimicEnemy.health);
                            break;
                    }
                }
                else {
                    let random2 = Math.ceil(Math.random() * 2);

                    switch (random2) {
                        case 1:
                            enemy = new BuilderEnemy(BuilderEnemy.speed, BuilderEnemy.health);
                            break;
                        case 2:
                            enemy = new WindupEnemy(WindupEnemy.speed, WindupEnemy.health);
                            break;
                        case 3:
                            enemy = new SelfDestructEnemy(SelfDestructEnemy.speed, SelfDestructEnemy.health);
                            break;
                        case 4:
                            enemy = new MachineGunEnemy(MachineGunEnemy.speed, MachineGunEnemy.health);
                            break;
                    }
                }
                enemy.x = this.x + 100*(i%2==0 ? 1 : -1);
                enemy.y = this.y + 100*(i>1 ? 1 : -1);
                enemies.push(enemy);
            }
        }
    
    }
    move(){
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
    AddForce(x, y){
    
    }
    special(enemyBullets, players, enemies) {
        this.timer(enemies);
    }
}
class PoisonDefender extends Enemy {
    constructor(speed, health, owner,isTopHalf) {
        super(speed, health);
        this.shootTimer = 60;
        this.value = 500;
        this.index = 1012;
        this.reloadSpeed=60;
        this.width=100;
        this.height=100;
        this.owner=owner;
        this.x=this.owner.centerY;
        this.y=this.owner.centerX;
        this.iFrame=0;
        this.doesKnockback=true;
        this.isTopHalf=isTopHalf;
        if(typeof window !== "undefined" && gamemode==7){
            this.reloadSpeed*=MisprintRandom();
        }
        //console.log(this.shootTimer);
    }
    move(players, floatingObjects, enemies){
        if(this.dead)return;
        if(this.owner.brewingStand==null){
            super.move(players,floatingObjects,enemies);
            return;
        }
        if(this.x>this.owner.centerX+300){
            this.x=this.owner.centerX+300;
        }
        if(this.x<this.owner.centerX-300){
            this.x=this.owner.centerX-300;
        }
        if(this.y<this.owner.centerY-300){
            this.y=this.owner.centerY-300;
        }
        if(this.y>this.owner.centerY+300){
            this.y=this.owner.centerY+300;
        }
        if(this.y<this.owner.centerY && this.isTopHalf){
            this.y=this.owner.centerY;
        }
        if(this.y>this.owner.centerY && !this.isTopHalf){
            this.y=this.owner.centerY;
        }
        
        if(Math.hypot(player.x-this.x,player.y-this.y)>800){
            let temp=new BuilderPlayerDecoy(1,1);
            temp.x=this.owner.centerX;
            temp.y=this.owner.centerY;
            console.log("check")
            super.move([temp],[],enemies);
        }
        else{
            super.move(players,floatingObjects,enemies);
        }
        if(this.dead)this.dead=false;
        
    }
    timer(enemyBullets, players) {
        if(Math.hypot(player.x-this.x, player.y-this.y)>1250)return;
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
            this.shootTimer = this.reloadSpeed;
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
            enemyBullets.push(new PoisonBomb(this.x, this.y, vx, vy,Math.floor(Math.sqrt(distance)/5)))
        }
    }
    special(enemyBullets, players) {
        this.timer(enemyBullets, players);
    }
}
class HealingSpring{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.index=0;
        this.terrains=[];
        for(let i=0;i<width;i++){
            for(let j=0;j<height;j++){
                if(Math.random()<0.1)this.terrains.push(new HealTerrain(x+i*50,y+j*50, 50, 50, "#169848", "#0e4615"));
            }
        }
        this.centerX=this.x+this.width*50/2-25;
        this.centerY=this.y+this.height*50/2-25;
    }
    act(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        for(let i=0;i<this.terrains.length;i++){
            this.terrains[i].act();
        }
    }
    draw(){
        if((this.centerX-player.x)*(this.centerX-player.x)+(this.centerY-player.y)*(this.centerY-player.y)>1500000)return;
        for(let i=0;i<this.terrains.length;i++){
            this.terrains[i].draw();
        }
    }
}