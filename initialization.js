
let enemies=[];
let bullets=[];
let enemyBullets=[];
let collectables=[];
let protectorBullets=[];
let newEnemyQueue=[];
let floatingObjects=[];
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
let mimicEnemySpawnTimer=0;
let healthPotionSpawnTimer=0;
let selfDestructEnemySpawnTimer=0;
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
const NUMUPGRADES=14;
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
const frameRate=1/61;
let lastTime=Date.now();
let difficulty=0;
let scaleMultiplier=0;
let bossMultiplier=0;
let originalScale=0;
//higher number = higher difficulty
function Commence(d){
    
    list=document.querySelectorAll('div[id$="Page"]');
    for(let i=0;i<list.length;i++){
        list[i].style.display="none";
    }
    document.querySelectorAll('img').forEach(img => img.remove());
    document.getElementById("gamePage").style.display="block";
    difficulty=d;
    Start();
}
async function Start(){
    player=new Player();
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
    mimicEnemySpawnTimer=0;
    selfDestructEnemySpawnTimer=0;
    
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
    floatingObjects=[];
    healthBar=new HealthBar();
    levellingBar=new LevellingBar();
    waveText=new WaveText();
    movingLeft=false;
    movingUp=false;
    movingRight=false;
    movingDown=false;
    isBossWave=false;
    bombIcon=null;
    timeWarpCounter=-1;
    let boughtUpgrades=new Array(NUMUPGRADES);
    for(let i=0;i<boughtUpgrades.length;i++){
        boughtUpgrades[i]=0;
    }

    movingLeft, movingRight, movingUp, movingDown=false;
    page="gamePage";
    
    
    background=new Image();
    background.src='images/background.webp';
    canvas.style.display = "block";

    lastTime=Date.now();
    if(difficulty==1){
        scaleMultiplier=0.75;
        bossMultiplier=0.75;
    }
    else if(difficulty==2){
        scaleMultiplier=1;
        bossMultiplier=1;
    }
    else if(difficulty==3){
        scaleMultiplier=1.5;
        bossMultiplier=1.5;
    }
    else{
        scaleMultiplier=2;
        bossMultiplier=2;
    }
    SCALE*=scaleMultiplier
    RandomizeEnemies(2, 0, 0,0,0);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await delay(100);
    loop();

}