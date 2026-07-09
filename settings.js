
function ToggleSettings(){
    showHealthBars=!showHealthBars;
    let temp=""
    if(showHealthBars){
        temp="ON"
    }
    else{
        temp="OFF"
    }
    document.getElementById("healthBarSetting").innerText="Show Healthbars: "+temp;
}
