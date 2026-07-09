
class HealthBar {
    constructor() {
        this.image1 = document.createElement("img");
        this.image2 = document.createElement("img");
        this.image1.src = 'images/green.webp';
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
        //console.log(this.image1.style.width+" "+this.image2.style.width+" "+this.image1.style.left+" "+this.image2.style.left);
        document.body.appendChild(this.image2);
        document.body.appendChild(this.image1);
    }
    Update() {
        this.desiredWidth = Math.ceil(player.health / player.maxHealth * 400);
        if (this.desiredWidth < this.image1.width) {
            requestAnimationFrame(DecreaseHealthBar);
        }
        else {
            requestAnimationFrame(IncreaseHealthBar)
        }

    }
}

function DecreaseHealthBar() {
    if (healthBar.image1.width - 8 < healthBar.desiredWidth) {
        healthBar.image1.width = healthBar.desiredWidth;
        healthBar.image1.style.width = healthBar.desiredWidth + "px";
    }
    else {
        healthBar.image1.width -= 8;
        healthBar.image1.style.width = (parseInt(healthBar.image1.style.width) - 8) + "px";
    }
    if (healthBar.desiredWidth < healthBar.image1.width) {
        requestAnimationFrame(DecreaseHealthBar)
    }
}

function IncreaseHealthBar() {
    if (healthBar.image1.width + 8 > healthBar.desiredWidth) {
        healthBar.image1.width = healthBar.desiredWidth;
        healthBar.image1.style.width = healthBar.desiredWidth + "px";
    }
    else {
        healthBar.image1.width += 8;
        healthBar.image1.style.width = (parseInt(healthBar.image1.style.width) + 8) + "px";
    }
    if (healthBar.desiredWidth > healthBar.image1.width) {
        requestAnimationFrame(IncreaseHealthBar)
    }
}

class LevellingBar {
    constructor() {
        this.image1 = document.createElement("img");
        this.image2 = document.createElement("img");
        this.image1.src = 'images/black.webp';
        this.image2.src = 'images/yellow.webp';
        this.image1.style.position = 'absolute';
        this.image2.style.position = 'absolute';
        this.image1.style.width = "400px";
        this.image1.style.height = "30px";
        this.image2.style.width = "0px";
        this.image2.style.height = "30px";
        this.image1.style.left = "10px";
        this.image1.style.top = "100px";
        this.image2.style.left = "10px";
        this.image2.style.top = "100px";
        this.image1.style.zIndex = 2;
        this.image2.style.zIndex = 2;
        document.body.appendChild(this.image1);
        document.body.appendChild(this.image2);
        this.instances = 0;
        //console.log(this.image1.style.top+" asdkjf what");
    }
    Update() {

        this.desiredWidth = Math.min(player.currentExp / player.nextLevel * 400, 400);
        this.speed = (this.desiredWidth - parseInt(this.image2.style.width)) / 5;
        if (this.instances == 0) {
            requestAnimationFrame(IncreaseLevelBar);
            this.instances = 1;
        }
        let extraExp = 0;
        if (player.currentExp >= player.nextLevel && continueFlag==false) {
            extraExp = player.currentExp - player.nextLevel;
            player.level++;
            if (player.level < 6) {
                player.nextLevel *= 1.5;
            }
            else if (player.level < 10) {
                player.nextLevel *= 1.3;
            }
            else {
                player.nextLevel *= 1.2;
            }
            //console.log(player.nextLevel+" "+player.level);
            player.currentExp = 0;
            player.Heal(5);
            // console.log(player.currentExp+" "+player.nextLevel);
            //this.image2.style.width=(player.currentExp/player.nextLevel*400)+"px";
            if(currentPage=="gamePage"){
                ChangePage("upgradePage", true);
            }
            else{
                isLevelling=true;
            }
        }
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
        this.owner=owner;
        //console.log(this.image1.style.width+" "+this.image2.style.width+" "+this.image1.style.left+" "+this.image2.style.left);
        document.body.appendChild(this.image2);
        document.body.appendChild(this.image1);
    }
    Update() {
        this.desiredWidth = Math.ceil(this.owner.health / this.owner.maxHealth * 400);
        if(this.desiredWidth>parseInt(this.image1.style.width)){
            this.image1.style.width=this.desiredWidth+"px";
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
    if(shieldBar && shieldBar.owner.health<=0){
        shieldBar.image1.remove();
        shieldBar.image2.remove();
    }
}


class BossBar {
    constructor(owner) {
        this.image1 = document.createElement("img");
        this.image2 = document.createElement("img");
        this.image1.src = 'images/red.webp';
        this.image2.src = 'images/green.webp';
        this.image1.style.position = 'absolute';
        this.image2.style.position = 'absolute';
        this.image1.width = 600;
        this.image1.height = 30;
        this.image2.width = 600;
        this.image2.height = 30;
        this.image1.style.width = "600px";
        this.image1.style.height = "30px";
        this.image2.style.width = "600px";
        this.image2.style.height = "30px";
        this.image1.style.left = (canvas.width / 2 - 500) + "px";
        this.image1.style.top = (50 + 75 * bossBars.length) + "px";
        this.image2.style.left = (canvas.width / 2 - 500) + "px";
        this.image2.style.top = (50 + 75 * bossBars.length) + "px";
        this.image1.style.zIndex = 2;
        this.image2.style.zIndex = 2;
        this.owner = owner;
        document.body.appendChild(this.image1);
        document.body.appendChild(this.image2);
        this.DecreaseHealthBar = this.DecreaseHealthBar.bind(this);
        this.IncreaseHealthBar = this.IncreaseHealthBar.bind(this);
        //console.log(this.image1.style.top+" asdkjf what");
    }
    Update() {
        this.desiredWidth = this.owner.health / this.owner.maxHealth * 600;
        if(this.desiredWidth==this.image2.width)return;
        if(this.desiredWidth<this.image2.width){
            requestAnimationFrame(this.DecreaseHealthBar);
        }
        else{
            requestAnimationFrame(this.IncreaseHealthBar);
        }
    }
    DecreaseHealthBar() {
        if (this.image2.width - 8 < this.desiredWidth) {
            this.image2.width = this.desiredWidth;
            this.image2.style.width = this.desiredWidth + "px";
        }
        else {
            this.image2.width -= 8;
            this.image2.style.width = (parseInt(this.image2.style.width) - 8) + "px";
        }
        if (this.desiredWidth < this.image2.width) {
            requestAnimationFrame(this.DecreaseHealthBar)
        }
    }

    IncreaseHealthBar() {
        if (this.image2.width + 8 > this.desiredWidth) {
            this.image2.width = this.desiredWidth;
            this.image2.style.width = this.desiredWidth + "px";
        }
        else {
            this.image2.width += 8;
            this.image2.style.width = (parseInt(this.image2.style.width) + 8) + "px";
        }
        if (this.desiredWidth < this.image2.width) {
            requestAnimationFrame(this.IncreaseHealthBar)
        }
    }

}

class Ability{
    constructor(size){
        this.size = size;
        this.image = document.createElement("img");
        this.image.src = 'images/bomb.webp';
        this.image.style.position = 'absolute';
        
        this.image.width = size;
        this.image.height = size;
        this.image.style.left = size + "px";
        this.image.style.top = size + "px";
        this.image.style.left = (canvas.width - 650) + "px";
        this.image.style.top = (40+60*playerAbilities.length)+"px";
        this.image.style.transform = "translate(-50%, -50%)";
        this.image.style.zIndex = 2;
        this.cooldown=0;
        document.body.appendChild(this.image);
        this.indicator=new AbilityIndicator();
        playerAbilities.push(this);
    }
    timer(){
        this.cooldown--;
        if (this.cooldown<=0) {
            this.indicator.text.style.color = "red";
        }
    }
}
class BombIcon extends Ability{
    constructor(size) {
        super(size);


    }
    Activate(){
        if(this.cooldown<=0){
            let distanceX=mouseX-screen.width/2;
            let distanceY=mouseY-screen.height/2;
            let distance = distanceX * distanceX + distanceY * distanceY;
            console.log(mouseX+" "+mouseY+" "+distance);
            let vx = 0;
            let vy = 0;

            if (distance > 0) {
                let angle=Math.atan2(distanceY, distanceX);
                vx=5*Math.cos(angle);
                vy=5*Math.sin(angle);
            }
            bullets.push(new PlayerBomb(player.x, player.y, vx, vy))
            this.cooldown=420;
            this.indicator.Switch();
        }
    }
}
class TimeWarpIcon extends Ability{
    constructor(size) {
        super(size);
        this.image.src = 'images/green.webp';


    }
    Activate(){
        if(this.cooldown<=0){
            timeWarpCounter=250;
            this.cooldown=600;
            this.indicator.Switch();
        }
    }
}
class BulletDeleterIcon extends Ability{
    constructor(size) {
        super(size);
        this.image.src = 'images/blue.webp';


    }
    Activate(){
        if(this.cooldown<=0){
            this.cooldown=800;
            this.indicator.Switch();
            bullets.push(new ExpandingCircle(player.x, player.y));
        }
    }
}
class ChangeModeIcon extends Ability{
    constructor(size) {
        super(size);
        this.image.src = 'images/playerFire.webp';

    }
    Activate(){
        if(this.cooldown<=0){
            this.cooldown=60;
            this.indicator.Switch();
            player.mode++;
            if(player.mode==4){
                player.mode=1;
            }
            if(player.mode==1){
                player.attackSpeed=5;
                this.image.src="images/playerFire.webp";
            }
            else if(player.mode==2){
                player.attackSpeed=35;
                this.image.src="images/playerIceBullet.webp";
            }
            else{
                player.attackSpeed=50;
                this.image.src="images/playerWind.webp";
            }
        }
    }
}
class AbilityIndicator{
    constructor(){
        this.text = document.createElement("div"); 
        this.text.style.position = "absolute";
        this.text.style.left = (canvas.width - 550) + "px";
        this.text.style.top = (40+60*playerAbilities.length)+"px";
        this.text.style.zIndex = "2";
        this.text.style.transform = "translate(-50%, -50%)";
        this.text.style.pointerEvents = "none";
        this.text.style.fontSize = "50px";
        this.text.style.textAlign = "center";
        this.text.style.whiteSpace = "nowrap";
        this.text.style.fontFamily = "Black Ops One";
        this.text.style.color = "red";
        this.text.id = "text2";
        switch(playerAbilities.length){
            case 0:
                this.text.textContent = `Q`;
                break;
            case 1:
                this.text.textContent = `E`;
                break;
            case 2:
                this.text.textContent = `R`;
                break;
            case 3:
                this.text.textContent = `F`;
                break;
        }
        document.body.appendChild(this.text);
    }
    Switch() {
        if (this.text.style.color == "red") {
            this.text.style.color = "black";
        }
        else {
            this.text.style.color = "red";
        }
    }
}
class WaveText {
    constructor(size) {
        this.size = size;
        this.text = document.createElement("div");
        this.text.style.position = "absolute";
        this.text.style.left = "90px";
        this.text.style.top = "30px";
        this.text.style.zIndex = "2";
        this.text.style.transform = "translate(-50%, -50%)";
        this.text.style.pointerEvents = "none";
        this.text.style.fontSize = "45px";
        this.text.style.whiteSpace = "nowrap";
        this.text.style.color = "black";
        this.text.style.fontFamily="Black ops one";
        this.text.id = "waveText";
        this.text.innerHTML = `<b>Wave 1</b>`;
        document.body.appendChild(this.text);


    }
    Update() {
        this.text.innerHTML = `<b>Wave ${currentWave}</b>`;
    }
}