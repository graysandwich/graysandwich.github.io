
function IncreaseEnemyHealth(amount) {
    Enemy.healthMultiplier=amount;
    document.getElementById("modifierText").textContent="Modifier: Healthier Enemies"
    ChangePage('gamePage', false)
}
function IncreaseEnemySpeed(amount) {
    Enemy.speedMultiplier*=amount;
    ChangePage('gamePage', false)
    document.getElementById("modifierText").textContent="Modifier: Faster Enemies"
}
function SpawnBoss(amount) {
    let boss=null;
    let randomNum=Math.ceil(Math.random()*5)
    switch (randomNum) {
        case 1:
            boss = new LaserBoss(1, 60);
            break;
        case 2:
            boss = new IceBoss(1, 75);
            break;
        case 3:
            boss = new BouncyBoss(5, 60, true);
            break;
        case 4:
            boss = new MageBoss(2, 50, true);
            break;
        case 5:
            boss = new BulletHellBoss(3, 50, true);
            break;
    }
    if(isBossWave)bossesLeft++;
    enemies[enemies.length] = boss;
    ChangePage('gamePage', false)
    document.getElementById("modifierText").textContent="Modifier: Spawn Boss"
}
function HalveMaxHealth(){
    player.originalMaxHealth=player.maxHealth
    player.maxHealth/=2;
    player.health=Math.min(player.health, player.maxHealth);
    player.maxHealthHalved=true;
    player.healMultiplier/=2
    document.getElementById("modifierText").textContent="Modifier: 1/2 Max Health and Healing"
    ChangePage('gamePage', false)
}
function SlowPlayer(){
    player.slowCountdown=10000000;
    document.getElementById("modifierText").textContent="Modifier: Player Always Slowed"
    ChangePage('gamePage', false)
}
function RemoveHealing(){
    player.canHeal=false;
    document.getElementById("modifierText").textContent="Modifier: No Healing"
    ChangePage('gamePage', false)
}
function AddConstantDamage(){
    player.constantDamageAmount=1;
    document.getElementById("modifierText").textContent="Modifier: Constant Damage"
    ChangePage('gamePage', false)
}
function IncreaseScale(amount){
    SCALE*=amount;
    document.getElementById("modifierText").textContent="Modifier: 2x Enemies"
    ChangePage('gamePage', false)
}