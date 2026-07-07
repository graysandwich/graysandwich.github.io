
let enemies=[];
let bullets=[];
let enemyBullets=[];
let collectables=[];
let protectorBullets=[];
let newEnemyQueue=[];
let floatingObjects=[];
let playerAbilities=[];
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
let machineGunEnemySpawnTimer=0;
let smokeBombEnemySpawnTimer=0;
let waveTimer=0;
let isBossWave=false;
let movingLeft, movingRight, movingUp, movingDown=false;
let page="gamePage";
let healthBar, levellingBar, bossBars, boss, waveText, background, gambleText, choice1, choice2, shieldBar, playerShield;
let xpBagTimer=Math.random()*200+200;
let timeElapsed=0;
let mouseX=0;
let mouseY=0;
let currentWave=0;
let SCALE=0.001;
let continueFlag=false;
const NUMUPGRADES=16;
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
let isUnlockingCharacter=false;
let chosenCharacter=0;
let images={};
let doneLoading=false;
const imageSources = {
//   aimingEnemy: 'images/aimingEnemy.webp',
//   background: 'images/background.webp',
//   bigRock: 'images/bigRock.webp',
//   black: 'images/black.webp',
//   blackHole: 'images/blackHole.webp',
//   blackHoleEnemy: 'images/blackHoleEnemy.webp',
//   blue: 'images/blue.webp',
//   bomb: 'images/bomb.webp',
//   bouncyBoss: 'images/bouncyBoss.webp',
//   bouncyMinion: 'images/bouncyMinion.webp',
//   builderEnemy: 'images/builderEnemy.webp',
//   bullet: 'images/bullet.webp',
//   bulletHellBoss: 'images/bulletHellBoss.webp',
//   bulletHellBossEnraged: 'images/bulletHellBossEnraged.webp',
//   chargedOrb: 'images/chargedOrb.webp',
//   chargingEnemy: 'images/chargingEnemy.webp',
//   chargingEnemySpecial: 'images/chargingEnemySpecial.webp',
//   chargingOrb: 'images/chargingOrb.webp',
//   circleBullet: 'images/circleBullet.webp',
//   deadZombie: 'images/deadZombie.webp',
//   enemy: 'images/enemy.webp',
//   enemyBullet: 'images/enemyBullet.webp',
//   enemyWall: 'images/enemyWall.webp',
//   explosion: 'images/explosion.webp',
//   fire: 'images/fire.webp',
//   frostAura: 'images/frostAura.webp',
//   frostProjectile: 'images/frostProjectile.webp',
//   gambleBoss: 'images/gambleBoss.webp',
//   ghostEnemy: 'images/ghostEnemy.webp',
//   gray: 'images/gray.webp',
//   grayCircle: 'images/grayCircle.webp',
//   green: 'images/green.webp',
//   healerPlayer: 'images/healerPlayer.webp',
//   healthPotion: 'images/healthPotion.webp',
//   homingBullet: 'images/homingBullet.webp',
//   homingEnemy: 'images/homingEnemy.webp',
//   iceBoss: 'images/iceBoss.webp',
//   icicle: 'images/icicle.webp',
//   introBackground: 'images/introBackground.webp',
//   laserBoss: 'images/laserBoss.webp',
//   machineGunBullet: 'images/machineGunBullet.webp',
//   machineGunEnemy: 'images/machineGunEnemy.webp',
//   mageFireMode: 'images/mageFireMode.webp',
//   mageRockMode: 'images/mageRockMode.webp',
//   mageWaterMode: 'images/mageWaterMode.webp',
//   mimicEnemyDead: 'images/mimicEnemyDead.webp',
  player: 'images/player.webp',
//   poisonBomb: 'images/poisonBomb.webp',
//   poisonCloud: 'images/poisonCloud.webp',
//   poisonEnemy: 'images/poisonEnemy.webp',
//   protectorBullet: 'images/protectorBullet.webp',
//   red: 'images/red.webp',
//   selfDestructEnemy: 'images/selfDestructEnemy.webp',
//   shield: 'images/shield.webp',
//   shieldEnemy: 'images/shieldEnemy.webp',
//   shieldRotated: 'images/shieldRotated.webp',
//   shooterEnemy: 'images/shooterEnemy.webp',
//   smallRock: 'images/smallRock.webp',
//   smoke: 'images/smoke.webp',
//   smokeBombEnemy: 'images/smokeBombEnemy.webp',
//   snakeBody: 'images/snakeBody.webp',
//   snakeBoss: 'images/snakeBoss.webp',
//   spawner: 'images/spawner.webp',
//   spawnerEnemy: 'images/spawnerEnemy.webp',
//   spawnerUpgrade: 'images/spawnerUpgrade.webp',
//   spawnPortal: 'images/spawnPortal.webp',
//   spiral: 'images/spiral.webp',
  tankPlayer: 'images/tankPlayer.webp',
  tankPlayerMirrored: 'images/tankPlayerMirrored.webp',
//   timeWarpBackground: 'images/timeWarpBackground.webp',
//   trap: 'images/trap.webp',
//   trapperEnemy: 'images/trapperEnemy.webp',
//   water: 'images/water.webp',
//   white: 'images/white.webp',
//   windupEnemy: 'images/windupEnemy.webp',
//   xpBag: 'images/xpBag.webp',
//   yellow: 'images/yellow.webp',
//   zombieEnemy: 'images/zombieEnemy.webp'
};

//higher number = higher difficulty
function SetDifficulty(d){
    difficulty=d;
    ChangePage("characterSelectionPage");
}
function SelectCharacter(character){
    chosenCharacter=character;
    let descriptionText=document.getElementById("descriptionText");
    document.getElementById("basicPlayer").style.border="";
    document.getElementById("tankPlayer").style.border="";
    document.getElementById("healerPlayer").style.border="";
    document.getElementById("magePlayer").style.border="";
    switch(chosenCharacter){
        case 1:
            descriptionText.innerText="The basic character. He is the chosen one (as in he got chosen when I randomly clicked on one of my screenshots for a placeholder image)."
            document.getElementById("basicPlayer").style.border="5px solid red";
            break;
        case 2:
            if(TankPlayer.unlocked){
                descriptionText.innerText="Has high health but is really slow and attacks slowly. Gains a shield every 30 seconds. Spammable meatshield (wait, wrong game)."
            }
            else{
                descriptionText.innerText="LOCKED"
            }
            document.getElementById("tankPlayer").style.border="5px solid red";
            break;
        case 3:
            if(HealerPlayer.unlocked){
                descriptionText.innerText="Starts with passive healing and siphon. Gets 2x healing from all sources. Taking damage gives XP. Is not the impostor."

            }
            else{
                descriptionText.innerText="LOCKED"
            }
            document.getElementById("healerPlayer").style.border="5px solid red";
            break;
        case 4:
            if(MagePlayer.unlocked){
                descriptionText.innerText="The boss when you unlock him as a playable character. Has an active ability to switch between three elements: Fire, Ice, and Wind."

            }
            else{
                descriptionText.innerText="LOCKED"
            }
            document.getElementById("magePlayer").style.border="5px solid red";
            break;
    }
    document.getElementById("startButton").disabled = false; 
}
function loadImage(image){
    return new Promise((resolve, reject) =>{
        const img=new Image();
        img.onload=()=>resolve(img);
        img.onerror=()=>reject(new Error(`${image} Failed`));
        img.src=image;
    })
}
async function preloadImages(){
    let keys=Object.keys(imageSources);
    let loaded=await Promise.all(keys.map(key=>loadImage(imageSources[key])));
    //console.log(keys+" "+loaded);
    images=Object.fromEntries(keys.map((key,i)=>[key,loaded[i]]));
    doneLoading=true;
    return;
}
async function Commence(){
    
    list=document.querySelectorAll('div[id$="Page"]');
    for(let i=0;i<list.length;i++){
        list[i].style.display="none";
    }
    //document.querySelectorAll('img').forEach(img => img.remove());
    if(doneLoading){
        document.getElementById("loadingPage").style.display="none";
        Start();
    }
    else{
        document.getElementById("gamePage").style.display="block";
        await delay(0.1);
        Commence();
    }
}
async function Start(){

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
    machineGunEnemySpawnTimer=0;
    smokeBombEnemySpawnTimer=0;
    
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
    playerAbilities=[];
    healthBar=new HealthBar();
    levellingBar=new LevellingBar();
    waveText=new WaveText();
    movingLeft=false;
    movingUp=false;
    movingRight=false;
    movingDown=false;
    isBossWave=false;
    isUnlockingCharacter=false;
    shieldBar=null;
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
        scaleMultiplier=0.5;
        bossMultiplier=0.5;
        player.health=Math.ceil(player.health*1.8);
        player.maxHealth=player.health;
    }
    else if(difficulty==2){
        scaleMultiplier=0.75;
        bossMultiplier=0.75;
        player.health=Math.ceil(player.health*1.4);
        player.maxHealth=player.health;
    }
    else if(difficulty==3){
        scaleMultiplier=1;
        bossMultiplier=1;
    }
    else{
        scaleMultiplier=2;
        bossMultiplier=2;
    }
    SCALE*=scaleMultiplier
    switch(chosenCharacter){
        case 1:
            player=new BasicPlayer();
            break;
        case 2:
            player=new TankPlayer();
            break;
        case 3:
            player=new HealerPlayer();
            break;
        case 4:
            player=new MagePlayer();
            break;
    }
    RandomizeEnemies(2, 0, 0,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await delay(100);
    loop();

}
preloadImages();