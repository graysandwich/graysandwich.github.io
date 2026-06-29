


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
        if(e.key==='w'){
            movingUp=true;
        }
        if(e.key==='a'){
            movingLeft=true;
        }
        if(e.key==='d'){
            movingRight=true;
        }
        if(e.key==='s'){
            movingDown=true;
        }
        if(e.key=="c"){
            player.currentExp+=10000;
        }
        if(e.key=="p"){
            player.currentExp+=1000;
            ChangeWave(); 
        }
        if(e.key=="o"){
            for(let i=0;i<enemies.length;i++){
                enemies[i].takeDamage(new Bullet(1,1,20), i);
            }
        }
        if(e.key=="q" && player.bombCount>0 && player.bombTimer<=0){
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
            player.bombTimer=420;
            bombIcon.indicator.style.color="black";
        }
        if(e.key=="e" && player.timeWarp>0 && player.timeWarpTimer<=0){
            timeWarpCounter=250;
            player.timeWarpTimer=800;
            timeWarpIcon.indicator.style.color="black";
        }
        if (['w', 'a', 's', 'd'].includes(e.key)) {
            e.preventDefault();
        }
    }
        
})

document.addEventListener("keyup", (e)=>{
    if(e.key==='w'){
        movingUp=false;
    }
    else if(e.key==='a'){
        movingLeft=false;
    }
    else if(e.key==='d'){
        movingRight=false;
    }
    else if(e.key==='s'){
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

    localStorage.setItem("ChargingEnemyFound", ChargingEnemy.seen);
    localStorage.setItem("PoisonEnemyFound", PoisonEnemy.seen);
    localStorage.setItem("GhostEnemyFound", GhostEnemy.seen);
    localStorage.setItem("ShieldEnemyFound", ShieldEnemy.seen);
    localStorage.setItem("BlackHoleEnemyFound", BlackHoleEnemy.seen);
    localStorage.setItem("MimicEnemyFound", MimicEnemy.seen);

    localStorage.setItem("WindupEnemyFound", WindupEnemy.seen);
    localStorage.setItem("BuilderEnemyFound", BuilderEnemy.seen);
    localStorage.setItem("SpawnerEnemyFound", SpawnerEnemy.seen);
    localStorage.setItem("SelfDestructEnemyFound", SelfDestructEnemy.seen);

    localStorage.setItem("LaserBossFound", LaserBoss.seen);
    localStorage.setItem("IceBossFound", IceBoss.seen);
    localStorage.setItem("BouncyBossFound", BouncyBoss.seen);
    localStorage.setItem("MageBossFound", MageBoss.seen);
    localStorage.setItem("BulletHellBossFound", BulletHellBoss.seen);

    localStorage.setItem("GambleBossFound", GambleBoss.seen);
});
document.addEventListener('DOMContentLoaded', () => {
    BasicEnemy.seen=JSON.parse(localStorage.getItem("BasicEnemyFound"));
    ShooterEnemy.seen=JSON.parse(localStorage.getItem("ShooterEnemyFound"));
    AimingEnemy.seen=JSON.parse(localStorage.getItem("AimingEnemyFound"));
    HomingEnemy.seen=JSON.parse(localStorage.getItem("HomingEnemyFound"));
    ZombieEnemy.seen=JSON.parse(localStorage.getItem("ZombieEnemyFound"));
    TrapperEnemy.seen=JSON.parse(localStorage.getItem("TrapperEnemyFound"));

    ChargingEnemy.seen=JSON.parse(localStorage.getItem("ChargingEnemyFound"));
    GhostEnemy.seen=JSON.parse(localStorage.getItem("GhostEnemyFound"));
    PoisonEnemy.seen=JSON.parse(localStorage.getItem("PoisonEnemyFound"));
    ShieldEnemy.seen=JSON.parse(localStorage.getItem("ShieldEnemyFound"));
    BlackHoleEnemy.seen=JSON.parse(localStorage.getItem("BlackHoleEnemyFound"));
    MimicEnemy.seen=JSON.parse(localStorage.getItem("MimicEnemyFound"));

    WindupEnemy.seen=JSON.parse(localStorage.getItem("WindupEnemyFound"));
    BuilderEnemy.seen=JSON.parse(localStorage.getItem("BuilderEnemyFound"));
    SpawnerEnemy.seen=JSON.parse(localStorage.getItem("SpawnerEnemyFound"));
    SelfDestructEnemy.seen=JSON.parse(localStorage.getItem("SelfDestructEnemyFound"));

    LaserBoss.seen=JSON.parse(localStorage.getItem("LaserBossFound"));
    IceBoss.seen=JSON.parse(localStorage.getItem("IceBossFound"));
    BouncyBoss.seen=JSON.parse(localStorage.getItem("BouncyBossFound"));
    MageBoss.seen=JSON.parse(localStorage.getItem("MageBossFound"));
    BulletHellBoss.seen=JSON.parse(localStorage.getItem("BulletHellBossFound"));
    GambleBoss.seen=JSON.parse(localStorage.getItem("GambleBossFound"));
});
