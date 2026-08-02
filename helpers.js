


function RectCircleColliding(circle, rect, radius, x, y) {
    var distX = Math.abs(x - rect.x);
    var distY = Math.abs(y - rect.y);

    if (distX > (rect.width / 2 + radius)) { return false; }
    if (distY > (rect.height / 2 + radius)) { return false; }

    if (distX <= (rect.width / 2)) { return true; }
    if (distY <= (rect.height / 2)) { return true; }

    var dx = distX - rect.width / 2;
    var dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (radius * radius));
}

function shuffle(array) {
    const shuffled = [...array]; 
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
    return shuffled;
}
function rotateAroundPoint(pivotX, pivotY, objectX, objectY, angleInDegrees) {
    const radians = (Math.PI / 180) * angleInDegrees;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    const newX = cos * (objectX - pivotX) - sin * (objectY - pivotY) + pivotX;
    const newY = sin * (objectX - pivotX) + cos * (objectY - pivotY) + pivotY;

    return { x: newX, y: newY };
}


var delay = ms => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener("mousemove", (e)=>{
    mouseX=e.clientX;
    mouseY=e.clientY;
})
document.addEventListener("keydown", (e)=>{ 
    if(page=="gamePage"){
        let key=e.key.toLowerCase();
        if(key==controls["up"]){
            movingUp=true;
        }
        if(key==controls["left"]){
            movingLeft=true;
        }
        if(key==controls["right"]){
            movingRight=true;
        }
        if(key==controls["down"]){
            movingDown=true;
        }
        if(key==controls["levelUp"]){
            player.currentExp+=1000000;
        }
        if(key==controls["skipWave"]){
            ChangeWave();
        }
        if(key==controls["dealDamage"]){
            for(let i=0;i<enemies.length;i++){
                enemies[i].takeDamage(new Bullet(1,1,2000), i);
            }
        }
        if(key==controls["ability1"] && playerAbilities.length>0){
            playerAbilities[0].Activate();
        }
        if(key==controls["ability2"] && playerAbilities.length>1){
            playerAbilities[1].Activate();
        }
        if(key==controls["ability3"] && playerAbilities.length>2){
            playerAbilities[2].Activate();
        }
        if(key==controls["ability4"] && playerAbilities.length>3){
            playerAbilities[3].Activate();
        }
        if(key==controls["ability5"] && playerAbilities.length>4){
            playerAbilities[4].Activate();
        }
        if(e.key=="Escape" && gamemode==0){
            EndTutorial();
        }
        if (['w', 'a', 's', 'd'].includes(key)) {
            e.preventDefault();
        }
    }
    if(controlBeingToggled!=""){
        //console.log(e.key.toLowerCase()+" "+Object.values(controls)+" "+(e.key.toLowerCase() in Object.values(controls)))
        if(Object.values(controls).includes(e.key.toLowerCase()) && controls[controlBeingToggled]!=e.key.toLowerCase()){
            document.getElementById(controlBeingToggled+"ControlButton").innerText="Key already used"
        }
        else if(e.key.toLowerCase()=="escape"){
            controls[controlBeingToggled]="N/A";
            document.getElementById(controlBeingToggled+"ControlButton").innerText="N/A";
        }
        else{
            controls[controlBeingToggled]=e.key.toLowerCase();
            document.getElementById(controlBeingToggled+"ControlButton").innerText=e.key.toUpperCase();
        }
        controlBeingToggled="";
    }
        
})
async function EndTutorial(){

    gameOver = true;
    await delay(100);
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
    if(document.getElementById("waveText")){
        document.getElementById("waveText").remove()
    }
    document.getElementById("tutorialText").innerText="";

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

    ChangePage("IntroPage", false);
}
document.addEventListener("keyup", (e)=>{
    let key=e.key.toLowerCase();
    if(key==controls["up"]){
        movingUp=false;
    }
    else if(key==controls["left"]){
        movingLeft=false;
    }
    else if(key==controls["right"]){
        movingRight=false;
    }
    else if(key==controls["down"]){
        movingDown=false;
    }
    
        
})
window.addEventListener("beforeunload", (e)=>{
    localStorage.setItem("BasicEnemyFound", BasicEnemy.seen);
    localStorage.setItem("ShooterEnemyFound", ShooterEnemy.seen);
    localStorage.setItem("AimingEnemyFound", AimingEnemy.seen);
    localStorage.setItem("HomingEnemyFound", HomingEnemy.seen);
    localStorage.setItem("ZombieEnemyFound", ZombieEnemy.seen);
    localStorage.setItem("TrapperEnemyFound", TrapperEnemy.seen);
    localStorage.setItem("IceEnemyFound", IceEnemy.seen);

    localStorage.setItem("ChargingEnemyFound", ChargingEnemy.seen);
    localStorage.setItem("PoisonEnemyFound", PoisonEnemy.seen);
    localStorage.setItem("GhostEnemyFound", GhostEnemy.seen);
    localStorage.setItem("ShieldEnemyFound", ShieldEnemy.seen);
    localStorage.setItem("BlackHoleEnemyFound", BlackHoleEnemy.seen);
    localStorage.setItem("MimicEnemyFound", MimicEnemy.seen);
    localStorage.setItem("TeleporterEnemyFound", TeleporterEnemy.seen);

    localStorage.setItem("WindupEnemyFound", WindupEnemy.seen);
    localStorage.setItem("BuilderEnemyFound", BuilderEnemy.seen);
    localStorage.setItem("SpawnerEnemyFound", SpawnerEnemy.seen);
    localStorage.setItem("SelfDestructEnemyFound", SelfDestructEnemy.seen);
    localStorage.setItem("MachineGunEnemyFound", MachineGunEnemy.seen);
    localStorage.setItem("SmokeBombEnemyFound", SmokeBombEnemy.seen);
    localStorage.setItem("SplitterEnemyFound", SplitterEnemy.seen);

    localStorage.setItem("LaserBossFound", LaserBoss.seen);
    localStorage.setItem("IceBossFound", IceBoss.seen);
    localStorage.setItem("BouncyBossFound", BouncyBoss.seen);
    localStorage.setItem("MageBossFound", MageBoss.seen);
    localStorage.setItem("BulletHellBossFound", BulletHellBoss.seen);

    localStorage.setItem("GambleBossFound", GambleBoss.seen);
    localStorage.setItem("SnakeBossFound", SnakeBoss.seen);
    localStorage.setItem("HealerBossFound", HealerBoss.seen);
    localStorage.setItem("EngineerBossFound", EngineerBoss.seen);
    localStorage.setItem("FarmerBossFound", FarmerBoss.seen);
    
    localStorage.setItem("TankPlayerUnlocked", TankPlayer.unlocked);
    localStorage.setItem("HealerPlayerUnlocked", HealerPlayer.unlocked);
    localStorage.setItem("MagePlayerUnlocked", MagePlayer.unlocked);
    localStorage.setItem("NecromancerPlayerUnlocked", NecromancerPlayer.unlocked);
    localStorage.setItem("PheonixPlayerUnlocked", PheonixPlayer.unlocked);
    
    localStorage.setItem("ShowHealthbarSetting", showHealthBars);
    localStorage.setItem("leftControl", controls["left"]);
    localStorage.setItem("rightControl", controls["right"]);
    localStorage.setItem("upControl", controls["up"]);
    localStorage.setItem("downControl", controls["down"]);
    localStorage.setItem("ability1Control", controls["ability1"]);
    localStorage.setItem("ability2Control", controls["ability2"]);
    localStorage.setItem("ability3Control", controls["ability3"]);
    localStorage.setItem("ability4Control", controls["ability4"]);
    localStorage.setItem("ability5Control", controls["ability5"]);
    localStorage.setItem("levelUpControl", controls["levelUp"]);
    localStorage.setItem("skipWaveControl", controls["skipWave"]);
    localStorage.setItem("dealDamageControl", controls["dealDamage"]);
});
document.addEventListener('DOMContentLoaded', () => {
    BasicEnemy.seen=JSON.parse(localStorage.getItem("BasicEnemyFound"));
    ShooterEnemy.seen=JSON.parse(localStorage.getItem("ShooterEnemyFound"));
    AimingEnemy.seen=JSON.parse(localStorage.getItem("AimingEnemyFound"));
    HomingEnemy.seen=JSON.parse(localStorage.getItem("HomingEnemyFound"));
    ZombieEnemy.seen=JSON.parse(localStorage.getItem("ZombieEnemyFound"));
    TrapperEnemy.seen=JSON.parse(localStorage.getItem("TrapperEnemyFound"));
    IceEnemy.seen=JSON.parse(localStorage.getItem("IceEnemyFound"));

    ChargingEnemy.seen=JSON.parse(localStorage.getItem("ChargingEnemyFound"));
    GhostEnemy.seen=JSON.parse(localStorage.getItem("GhostEnemyFound"));
    PoisonEnemy.seen=JSON.parse(localStorage.getItem("PoisonEnemyFound"));
    ShieldEnemy.seen=JSON.parse(localStorage.getItem("ShieldEnemyFound"));
    BlackHoleEnemy.seen=JSON.parse(localStorage.getItem("BlackHoleEnemyFound"));
    MimicEnemy.seen=JSON.parse(localStorage.getItem("MimicEnemyFound"));
    TeleporterEnemy.seen=JSON.parse(localStorage.getItem("TeleporterEnemyFound"));

    WindupEnemy.seen=JSON.parse(localStorage.getItem("WindupEnemyFound"));
    BuilderEnemy.seen=JSON.parse(localStorage.getItem("BuilderEnemyFound"));
    SpawnerEnemy.seen=JSON.parse(localStorage.getItem("SpawnerEnemyFound"));
    SelfDestructEnemy.seen=JSON.parse(localStorage.getItem("SelfDestructEnemyFound"));
    MachineGunEnemy.seen=JSON.parse(localStorage.getItem("MachineGunEnemyFound"));
    SmokeBombEnemy.seen=JSON.parse(localStorage.getItem("SmokeBombEnemyFound"));
    SplitterEnemy.seen=JSON.parse(localStorage.getItem("SplitterEnemyFound"));

    LaserBoss.seen=JSON.parse(localStorage.getItem("LaserBossFound"));
    IceBoss.seen=JSON.parse(localStorage.getItem("IceBossFound"));
    BouncyBoss.seen=JSON.parse(localStorage.getItem("BouncyBossFound"));
    MageBoss.seen=JSON.parse(localStorage.getItem("MageBossFound"));
    BulletHellBoss.seen=JSON.parse(localStorage.getItem("BulletHellBossFound"));

    GambleBoss.seen=JSON.parse(localStorage.getItem("GambleBossFound"));
    SnakeBoss.seen=JSON.parse(localStorage.getItem("SnakeBossFound"));
    HealerBoss.seen=JSON.parse(localStorage.getItem("HealerBossFound"));
    EngineerBoss.seen=JSON.parse(localStorage.getItem("EngineerBossFound"));
    FarmerBoss.seen=JSON.parse(localStorage.getItem("FarmerBossFound"));

    BasicPlayer.unlocked=true;
    if(JSON.parse(localStorage.getItem("TankPlayerUnlocked"))!=null) TankPlayer.unlocked=JSON.parse(localStorage.getItem("TankPlayerUnlocked"));
    if(JSON.parse(localStorage.getItem("HealerPlayerUnlocked"))!=null) HealerPlayer.unlocked=JSON.parse(localStorage.getItem("HealerPlayerUnlocked"));
    if(JSON.parse(localStorage.getItem("MagePlayerUnlocked"))!=null) MagePlayer.unlocked=JSON.parse(localStorage.getItem("MagePlayerUnlocked"));
    if(JSON.parse(localStorage.getItem("NecromancerPlayerUnlocked"))!=null) NecromancerPlayer.unlocked=JSON.parse(localStorage.getItem("NecromancerPlayerUnlocked"));
    if(JSON.parse(localStorage.getItem("PheonixPlayerUnlocked"))!=null) PheonixPlayer.unlocked=JSON.parse(localStorage.getItem("PheonixPlayerUnlocked"));



    if(JSON.parse(localStorage.getItem("ShowHealthbarSetting"))!=null) showHealthBars=JSON.parse(localStorage.getItem("ShowHealthbarSetting"));
    if(localStorage.getItem("leftControl")!=null) controls["left"]=localStorage.getItem("leftControl");
    if(localStorage.getItem("rightControl")!=null) controls["right"]=localStorage.getItem("rightControl");
    if(localStorage.getItem("upControl")!=null) controls["up"]=localStorage.getItem("upControl");
    if(localStorage.getItem("downControl")!=null) controls["down"]=localStorage.getItem("downControl");
    if(localStorage.getItem("ability1Control")!=null) controls["ability1"]=localStorage.getItem("ability1Control");
    if(localStorage.getItem("ability2Control")!=null) controls["ability2"]=localStorage.getItem("ability2Control");
    if(localStorage.getItem("ability3Control")!=null) controls["ability3"]=localStorage.getItem("ability3Control");
    if(localStorage.getItem("ability4Control")!=null) controls["ability4"]=localStorage.getItem("ability4Control");
    if(localStorage.getItem("ability5Control")!=null) controls["ability5"]=localStorage.getItem("ability5Control");
    if(localStorage.getItem("levelUpControl")!=null) controls["levelUp"]=localStorage.getItem("levelUpControl");
    if(localStorage.getItem("skipWaveControl")!=null) controls["skipWave"]=localStorage.getItem("skipWaveControl");
    if(localStorage.getItem("dealDamageControl")!=null) controls["dealDamage"]=localStorage.getItem("dealDamageControl");

});
