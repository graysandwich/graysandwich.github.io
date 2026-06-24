
let enemies=[];
let bullets=[];
let enemyBullets=[];
let collectables=[];
let protectorBullets=[];
let newEnemyQueue=[];
let enemySpawnTimer=0;
let shooterEnemySpawnTimer=0;
let aimingEnemySpawnTimer=0;
let homingEnemySpawnTimer=0;
let chargingEnemySpawnTimer=0;
let shieldEnemySpawnTimer=0;
let trapperEnemySpawnTimer=0;
let zombieEnemySpawnTimer=0;
let ghostEnemySpawnTimer=0;
let poisonEnemySpawnTimer=0;
let blackHoleEnemySpawnTimer=0;
let builderEnemySpawnTimer=0;
let windupEnemySpawnTimer=0;
let spawnerEnemySpawnTimer=0;
let healthPotionSpawnTimer=0;
let waveTimer=0;
let isBossWave=false;
let movingLeft, movingRight, movingUp, movingDown=false;
let page="gamePage";
let healthBar, levellingBar, bossBars, boss, bombIcon, waveText, timeWarpIcon, background, gambleText, choice1, choice2;
let xpBagTimer=Math.random()*200+200;
let timeElapsed=0;
let mouseX=0;
let mouseY=0;
let currentWave=0;
let SCALE=0.001;
let continueFlag=false;
const NUMUPGRADES=13;
let boughtUpgrades=new Array(NUMUPGRADES);
for(let i=0;i<boughtUpgrades.length;i++){
    boughtUpgrades[i]=0;
}
let timeWarpCounter=0;
let gambleTimer=0;
let gambleChoice=0;
let textSpeed=5;
let bossesLeft=0;
let gameOver=false;
let accumulator=0;
const frameRate=1/60;
let lastTime=Date.now();
function Commence(){
    
    list=document.querySelectorAll('div[id$="Page"]');
    for(let i=0;i<list.length;i++){
        list[i].style.display="none";
    }
    document.querySelectorAll('img').forEach(img => img.remove());
    document.getElementById("gamePage").style.display="block";
    Start();
}
function Start(){
    player=new Player();
    player.image.width = "50";
    player.image.height = "50";
    player.image.style.left = player.x+'px';
    player.image.style.top= player.y+'px';
    player.image.style.zIndex=1;
    gameOver=false;
    enemySpawnTimer=0;
    aimingEnemySpawnTimer=0;
    homingEnemySpawnTimer=0;
    chargingEnemySpawnTimer=0;
    shooterEnemySpawnTimer=0;
    trapperEnemySpawnTimer=0;
    zombieEnemySpawnTimer=0;
    ghostEnemySpawnTimer=0;
    poisonEnemySpawnTimer=0;
    blackHoleEnemySpawnTimer=0;
    builderEnemySpawnTimer=0;
    windupEnemySpawnTimer=0;
    spawnerEnemySpawnTimer=0;
    
    healthPotionSpawnTimer=Math.random()*600+700;
    xpBagTimer=Math.random()*200+200;
    timeElapsed=0;
    waveTimer=2000;
    currentWave=1;
    SCALE=0.0012;
    enemies=[];
    bullets=[];
    enemyBullets=[];
    collectables=[];
    protectorBullets=[];
    bossBars=[];
    newEnemyQueue=[];
    healthBar=new HealthBar();
    levellingBar=new LevellingBar();
    waveText=new WaveText();
    movingLeft=false;
    movingUp=false;
    movingRight=false;
    movingDown=false;
    isBossWave=false;
    bombIcon=null;
    document.getElementById("world").appendChild(player.image);

    let boughtUpgrades=new Array(NUMUPGRADES);
    for(let i=0;i<boughtUpgrades.length;i++){
        boughtUpgrades[i]=0;
    }

    movingLeft, movingRight, movingUp, movingDown=false;
    page="gamePage";
    const wall1=document.createElement("img");
    wall1.src="images/black.webp";
    wall1.style.position='absolute';
    wall1.width=screen.width+90;
    wall1.height=20;
    wall1.style.left="-45px";
    wall1.style.top="-40px";
    document.getElementById("world").appendChild(wall1);
    const wall2=document.createElement("img");
    wall2.src="images/black.webp";
    wall2.style.position='absolute';
    wall2.width=screen.width+50;
    wall2.height=20;
    wall2.style.left="-25px";
    wall2.style.top=(screen.height+25)+"px";
    document.getElementById("world").appendChild(wall2);
    const wall3=document.createElement("img");
    wall3.src="images/black.webp";
    wall3.style.position='absolute';
    wall3.width=20;
    wall3.height=screen.height+70;
    wall3.style.left="-45px";
    wall3.style.top="-25px";
    document.getElementById("world").appendChild(wall3);
    const wall4=document.createElement("img");
    wall4.src="images/black.webp";
    wall4.style.position='absolute';
    wall4.width=20;
    wall4.height=screen.height+70;
    wall4.style.left=(screen.width+25)+"px";
    wall4.style.top="-25px";
    document.getElementById("world").appendChild(wall4);

    
    background=document.createElement("img");
    background.src='images/background.webp';
    background.style.position = 'absolute';
    background.style.width = (screen.width*2)+"px";
    background.style.height = (screen.height*2)+"px";
    background.style.left = (-screen.width/2)+'px';
    background.style.top= (-screen.height/2)+'px';
    background.style.zIndex=-4;
    document.getElementById("world").appendChild(background);

    lastTime=Date.now();
    RandomizeEnemies(2, 0, 0,0);
    loop();

}