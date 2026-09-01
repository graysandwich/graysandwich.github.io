
function IncreaseEnemyHealth(amount) {
    enemyHealthMultiplier=amount;
    document.getElementById("modifierText").textContent="Modifier: Healthier Enemies"
    upgradingEnemy = false;
    ChangePage('gamePage', false)
}
function IncreaseEnemySpeed(amount) {
    enemySpeedMultiplier*=amount;
    ChangePage('gamePage', false)
    document.getElementById("modifierText").textContent="Modifier: Faster Enemies"
    upgradingEnemy = false;
}
function SpawnBoss(amount) {
    let boss=null;
    let randomNum=Math.ceil(Math.random()*5)
    switch (randomNum) {
        case 1:
            boss = new LaserBoss(1, 60, gameState.bossBars, gameState.bossMultiplier);
            break;
        case 2:
            boss = new IceBoss(1, 75, gameState.bossBars, gameState.bossMultiplier);
            break;
        case 3:
            boss = new BouncyBoss(5, 60, true, gameState.bossBars, gameState.bossMultiplier);
            break;
        case 4:
            boss = new MageBoss(2, 50, gameState.bossBars, gameState.bossMultiplier);
            break;
        case 5:
            boss = new BulletHellBoss(3, 50, gameState.bossBars, gameState.bossMultiplier);
            break;
    }
    if(gameState.isBossWave)gameState.bossesLeft++;
    gameState.enemies.push(boss);
    ChangePage('gamePage', false)
    document.getElementById("modifierText").textContent="Modifier: Spawn Boss"
    upgradingEnemy = false;
}
function HalveMaxHealth(){
    player.originalMaxHealth=player.maxHealth
    player.maxHealth/=2;
    player.health=Math.min(player.health, player.maxHealth);
    player.maxHealthHalved=true;
    player.healMultiplier/=2
    document.getElementById("modifierText").textContent="Modifier: 1/2 Max Health and Healing"
    upgradingEnemy = false;
    ChangePage('gamePage', false)
}
function SlowPlayer(){
    player.slowCountdown=10000000;
    document.getElementById("modifierText").textContent="Modifier: Player Always Slowed"
    upgradingEnemy = false;
    ChangePage('gamePage', false)
}
function RemoveHealing(){
    player.canHeal=false;
    document.getElementById("modifierText").textContent="Modifier: No Healing"
    upgradingEnemy = false;
    ChangePage('gamePage', false)
}
function AddConstantDamage(){
    player.constantDamageAmount=1;
    document.getElementById("modifierText").textContent="Modifier: Constant Damage"
    upgradingEnemy = false;
    ChangePage('gamePage', false)
}
function IncreaseScale(amount){
    gameState.SCALE*=amount;
    document.getElementById("modifierText").textContent="Modifier: 2x Enemies"
    upgradingEnemy = false;
    ChangePage('gamePage', false)
}