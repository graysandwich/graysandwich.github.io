

var delay = ms => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener("mousemove", (e)=>{
    mouseX=e.clientX;
    mouseY=e.clientY;
})
document.addEventListener("keydown", (e)=>{ 
    if(typeof window === "undefined")return;
    if(currentPage=="gamePage"){
        let key=e.key.toLowerCase();
        if(key==controls["up"]){
            player.inputs.up=true;
        }
        if(key==controls["left"]){
            player.inputs.left=true;
        }
        if(key==controls["right"]){
            player.inputs.right=true;
        }
        if(key==controls["down"]){
            player.inputs.down=true;
        }
        if(key==controls["levelUp"]){
            if(gamemode==100)return;
            player.currentExp+=1000000;
        }
        if(key==controls["skipWave"]){
            [gameState.isBossWave, gameState.bossesLeft, gameState.currentWave, gameState.SCALE] = ChangeWave(gameState);
        }
        if(key==controls["dealDamage"]){
            for(let i=0;i<gameState.enemies.length;i++){
                gameState.enemies[i].takeDamage(new Bullet(1,1,2000, player), player, gameState);
            }
        }
        if(key=='l'){
            player.killedBoss=true;
            changePage("upgradePage", false, player);
        }
        if(key==controls["ability1"] && player.abilities.length>0){
            player.inputs.ability1=true;
        }
        if(key==controls["ability2"] && player.abilities.length>1){
            player.inputs.ability2=true;
        }
        if(key==controls["ability3"] && player.abilities.length>2){
            player.inputs.ability3=true;
        }
        if(key==controls["ability4"] && player.abilities.length>3){
            player.inputs.ability4=true;
        }
        if(key==controls["ability5"] && player.abilities.length>4){
            player.inputs.ability5=true;
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
    if(document.getElementById("tutorialText"))document.getElementById("tutorialText").innerText="";

    for(let i=0;i<playerAbilities.length;i++){
        playerAbilities[i].indicator.text.remove();
        playerAbilities[i].image.remove();
        if(playerAbilities[i].counterText){
            playerAbilities[i].counterText.text.remove();    
        }
    }
    
    chosenCharacter=0;
    let descriptionText=document.getElementById("descriptionText");
    
    descriptionText.innerText="";
    list = document.querySelectorAll('[id$="Player"]');
    for (let i = 0; i < list.length; i++) {
        list[i].style.border = "";
    }
    document.getElementById("startButton").disabled = true; 

    ChangePage("IntroPage", true);
}

document.addEventListener("keyup", (e)=>{
    if(typeof window ==="undefined" || gamemode==100)return;
    let key=e.key.toLowerCase();
    if(currentPage=="gamePage" || currentPage=="upgradePage" || currentPage=="newEnemyPage"){

        if(key==controls["up"]){
            player.inputs.up=false;
        }
        else if(key==controls["left"]){
            player.inputs.left=false;
        }
        else if(key==controls["right"]){
            player.inputs.right=false;
        }
        else if(key==controls["down"]){
            player.inputs.down=false;
        }
        if(key==controls["ability1"] && player.abilities.length>0){
            player.inputs.ability1=false;
        }
        if(key==controls["ability2"] && player.abilities.length>1){
            player.inputs.ability2=false;
        }
        if(key==controls["ability3"] && player.abilities.length>2){
            player.inputs.ability3=false;
        }
        if(key==controls["ability4"] && player.abilities.length>3){
            player.inputs.ability4=false;
        }
        if(key==controls["ability5"] && player.abilities.length>4){
            player.inputs.ability5=false;
        }
        if(currentPage!="upgradePage" && (key=="escape" || key==controls.pause2)){
            ChangePage("pausePage",false);
        }
    }
        
})
window.addEventListener("resize", () => {
    const scale = Math.min(window.innerWidth / 1536, window.innerHeight / 695);
    canvas.style.width = `${1536 * scale}px`;
    canvas.style.height = `${695 * scale}px`;
});
function SaveAndExit(){
    // localStorage.setItem("currentGamestate", JSON.stringify(gameState));
    // localStorage.setItem("currentPlayer", JSON.stringify(player));
    EndTutorial();
}


function MisprintRandom(){
    return Math.pow(Math.random(),4)*3.75+0.25;
}
function RPGScaling(){
    let value=Math.sqrt(Math.abs((player.x-1000)*(player.x-1000))+Math.abs((player.y-550)*(player.y-550)))/6500+1;
    return value;
}