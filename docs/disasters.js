

class Hurricane{
    constructor(forceX, forceY, timer){
        this.forceX=forceX;
        this.forceY=forceY;
        this.timer=timer-200;
        this.particleMoveTimer=300;
        this.particles=[];
        for(let i=0;i<10;i++){
            for(let j=0;j<6;j++){
                let image=new Image();
                image.src="images/hurricaneArrow.webp";
                this.particles.push(new WindParticle(i*200,j*183.3,40,40,image, forceX, forceY));
            }
        }
    }
    act(gameState, players){
        this.timer--;
        for(let i=0;i<gameState.enemies.length;i++){
            if(inBorder(gameState.enemies[i])){
                gameState.enemies[i].AddForce(this.forceX,this.forceY);
            }
        }
        for(let i=0;i<players.length;i++){
            players[i].AddForce(this.forceX,this.forceY);
        }
        if(this.timer<=0){
            this.dead=true;
        }
        this.particleMoveTimer--;
        for(let i=0;i<this.particles.length;i++){
            this.particles[i].x+=this.forceX*10;
            this.particles[i].y+=this.forceY*10;
            if(this.particles[i].x>mapBorders.rightBorder){
                this.particles[i].x=mapBorders.leftBorder;
            }
            if(this.particles[i].x<mapBorders.leftBorder){
                this.particles[i].x=mapBorders.rightBorder;
            }
            if(this.particles[i].y>mapBorders.bottomBorder){
                this.particles[i].y=mapBorders.topBorder;
            }
            if(this.particles[i].y<mapBorders.topBorder){
                this.particles[i].y=mapBorders.bottomBorder;
            }
        }
        if(this.particleMoveTimer==0){
            
            this.particleMoveTimer=300;
        }
    }
    draw(){
        for(let i=0;i<this.particles.length;i++){
            this.particles[i].draw();
        }
    }
}
class Volcano{
    constructor(severity, timer){
        this.width=severity*250;
        this.height=severity*250;
        this.timer=timer-200;
        this.reloadSpeed=(12/severity);
        this.x=Math.random()*(mapBorders.rightBorder-mapBorders.leftBorder);
        this.y=Math.random()*(mapBorders.bottomBorder-mapBorders.topBorder);
        this.shootTimer=0;
    }
    act(gameState, players){
        this.timer--;
        this.shootTimer--;
        if(this.timer<=0){
            this.dead=true;
        }
        if(this.shootTimer<0){
            this.shootTimer=this.reloadSpeed;
            let direction=Math.random(0)*2*Math.PI;
            gameState.enemyBullets.push(new VolcanoRock(Math.cos(direction)*4, Math.sin(direction)*4, Math.ceil(gameState.currentWave/3), this.x, this.y))
        }
        
    }
    draw(){
        ctx.drawImage(otherImages.volcano, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}
class Tornado{
    constructor(severity, timer){
        this.width=severity*350;
        this.height=severity*350;
        this.timer=timer-200;
        
        if (Math.random() < 0.5) {
            this.y = Math.random() * (mapBorders.bottomBorder-mapBorders.topBorder)+mapBorders.topBorder;
            if (Math.random() < 0.5) {
                this.x = mapBorders.leftBorder-200;
            }
            else {
                this.x = mapBorders.rightBorder + 200;
            }
        }
        else {
            this.x = Math.random() * (mapBorders.rightBorder-mapBorders.leftBorder)+mapBorders.leftBorder;
            if (Math.random() < 0.5) {
                this.y = mapBorders.topBorder-200;
            }
            else {
                this.y = mapBorders.bottomBorder + 200;
            }
        }
        this.shootTimer=0;
        this.targetX=Math.random()*(mapBorders.rightBorder-mapBorders.leftBorder);
        this.targetY=Math.random()*(mapBorders.bottomBorder-mapBorders.topBorder);
        this.speedX=0;
        this.speedY=0;
        this.maxSpeed=severity*6;
    }
    act(gameState, players){
        this.timer--;
        this.shootTimer--;
        if(this.timer<=0){
            this.dead=true;
        }
        for(let i=0;i<players.length;i++){
            let player=players[i];
            const dx = (this.x) - (player.x);
            const dy = (this.y) - (player.y);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (this.width/2 + player.width / 2)) {
                if (dx > 0 && dy > 0) {
                    player.AddForce(Math.max(0, 0.7 - dx / 400), Math.max(0, 0.7 - dy / 400));
                }
                if (dx < 0 && dy > 0) {
                    player.AddForce(Math.min(0, -0.7 - dx / 400), Math.max(0, 0.7 - dy / 400));
                }
                if (dx > 0 && dy < 0) {
                    player.AddForce(Math.max(0, 0.7 - dx / 400), Math.min(0, -0.7 - dy / 400));
                }
                if (dx < 0 && dy < 0) {
                    player.AddForce(Math.min(0, -0.7 - dx / 400), Math.min(0, -0.7 - dy / 400));
                }
            }
        }
        for(let i=0;i<gameState.enemies.length;i++){
            let player=gameState.enemies[i];
            const dx = (this.x) - (player.x);
            const dy = (this.y) - (player.y);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (this.width/2 + player.width / 2)) {
                if (dx > 0 && dy > 0) {
                    player.AddForce(Math.max(0, 0.7 - dx / 400), Math.max(0, 0.7 - dy / 400));
                }
                if (dx < 0 && dy > 0) {
                    player.AddForce(Math.min(0, -0.7 - dx / 400), Math.max(0, 0.7 - dy / 400));
                }
                if (dx > 0 && dy < 0) {
                    player.AddForce(Math.max(0, 0.7 - dx / 400), Math.min(0, -0.7 - dy / 400));
                }
                if (dx < 0 && dy < 0) {
                    player.AddForce(Math.min(0, -0.7 - dx / 400), Math.min(0, -0.7 - dy / 400));
                }
            }
        }
        
        let distanceX = this.x - this.targetX;
        let distanceY = this.y - this.targetY;
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
        if (speed > this.maxSpeed) {
            this.speedX = this.speedX / speed * this.maxSpeed;
            this.speedY = this.speedY / speed * this.maxSpeed;
        }
        this.x += this.speedX;
        this.y += this.speedY;

        if(Math.abs(this.x-this.targetX)<100 && Math.abs(this.y-this.targetY)<100){
            this.targetX=player.x;
            this.targetY=player.y;

            
        }
        
    }
    draw(){
        ctx.drawImage(otherImages.tornado, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}
class Avalanche{
    constructor(severity, timer){
        this.severity=severity;
        this.timer=timer-200;
        this.particleMoveTimer=300;
        this.particles=[];
        this.reloadSpeed=8/severity;
        this.shootTimer=0;
        this.angle=Math.random()*2*Math.PI;
    }
    act(gameState, players){
        this.timer--;
        this.shootTimer--;
        if(this.shootTimer<0){
            let dx=Math.cos(this.angle);
            let dy=Math.sin(this.angle);
            let centerX=1000;
            let centerY=550;
            let newX=centerX*2-centerY*2/dy*dx;
            let newY=centerY*2-centerX*2/dx*dy;
            let bullet=null;
            let speed=this.severity*7.5;
            if(newX>-centerX && newX<centerX*3){
                if(dy>0){
                    bullet=new EnemyBullet(-speed*Math.cos(this.angle), -speed*Math.sin(this.angle), Math.ceil(gameState.currentWave/4), centerX*3-newX, centerY*3);
                }
                else{
                    bullet=new EnemyBullet(-speed*Math.cos(this.angle), -speed*Math.sin(this.angle), Math.ceil(gameState.currentWave/4), newX-centerX, -centerY);
                }
            }
            else{
                if(dx>0){
                    bullet=new EnemyBullet(-speed*Math.cos(this.angle), -speed*Math.sin(this.angle), Math.ceil(gameState.currentWave/4), centerX*3, centerY*3-newY);
                }
                else{
                    bullet=new EnemyBullet(-speed*Math.cos(this.angle), -speed*Math.sin(this.angle), Math.ceil(gameState.currentWave/4), -centerX, newY-centerY);
                }
            }

            let offsetAmount=Math.random()*(this.severity*1500)-this.severity*750;
            let oppositeAngle = Math.atan2(-Math.cos(this.angle), Math.sin(this.angle));
            let offsetX=offsetAmount*Math.cos(oppositeAngle);
            let offsetY=offsetAmount*Math.sin(oppositeAngle);
            bullet.x+=offsetX;
            bullet.y+=offsetY;
            let size=Math.random()*(this.severity*125)+50;
            bullet.width=size;
            bullet.height=size;
            bullet.index=32;
            bullet.hitboxType="circle";
            bullet.despawnDist=2000;
            gameState.enemyBullets.push(bullet);
            this.shootTimer=this.reloadSpeed;
        }
        if(this.timer<0)this.dead=true;
        
    }
    draw(){
    }
}
class Blizzard{
    constructor(severity, timer){
        this.severity=severity;
        this.timer=timer-200;
        this.particles=[];
        if(this.severity<0.4){
            player.constantDamageAmount=0.5*Math.ceil(gameState.currentWave/6);
        }
        else if(this.severity<0.7){
            player.constantDamageAmount=Math.ceil(gameState.currentWave/6);
        }
        else{
            player.constantDamageAmount=1.5*Math.ceil(gameState.currentWave/6);
        }
    }
    act(gameState, players){
        this.timer--;
        for(let i=0;i<gameState.enemies.length;i++){
            if(inBorder(gameState.enemies[i])){
                gameState.enemies[i].slowCountdown=30;
            }
        }
        for(let i=0;i<players.length;i++){
            if(players[i].statusEffects)players[i].statusEffects.slow=30;
            else players[i].slowCountdown=30;
        }
        if(this.severity>0.4){
            for(let i=0;i<gameState.bullets.length;i++){
                if(inBorder(gameState.bullets[i])){
                    gameState.bullets[i].slowCountdown=30;
                }
            }
            for(let i=0;i<gameState.enemyBullets.length;i++){
                if(inBorder(gameState.enemyBullets[i])){
                    gameState.enemyBullets[i].slowCountdown=30;
                }
            }
        }
        if(this.timer<=0){
            player.constantDamageAmount=0;
            this.dead=true;
        }
    }
    draw(){
    }
}

class Particle{
    constructor(x, y, width, height, image){
        this.x=x;
        this.y=y;
        this.image=image;
        this.width=width;
        this.height=height;

    }
    draw(){
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}
class WindParticle{
    constructor(x, y, width, height, image, forceX, forceY){
        this.x=x;
        this.y=y;
        this.image=image;
        this.width=width;
        this.height=height;
        this.forceX=forceX;
        this.forceY=forceY;
        this.angle=Math.atan2(this.forceY,this.forceX);

    }
    draw(){
        ctx.save();
        ctx.globalAlpha=0.6;
        ctx.translate(this.x+this.width/2,this.y+this.height/2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image,  - this.width / 2,  - this.height / 2, this.width, this.height);
        ctx.restore();
    }
}
function inBorder(object){
    if(object.x>mapBorders.leftBorder && object.y>mapBorders.topBorder && object.x<mapBorders.rightBorder && object.y<mapBorders.bottomBorder){
        return true;
    }
    return false;
    
}
class VolcanoRock extends EnemyBullet{
    
    constructor(vx, vy, damage, x, y) {
        super(vx, vy, damage, x, y);
        this.index = 33;
        this.width = 40;
        this.height = 40;

        //this.previousAngle=Math.atan(distanceY/distanceX);
    }
}