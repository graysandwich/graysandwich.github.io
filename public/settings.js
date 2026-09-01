
function ToggleHealthBars(){
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
function ToggleControls(direction){
    if(document.getElementById(controlBeingToggled+"ControlButton")) document.getElementById(controlBeingToggled+"ControlButton").innerText=controls[controlBeingToggled].toUpperCase();
    
    controlBeingToggled=direction;
    let text="Press a key";
    document.getElementById(direction+"ControlButton").innerText=text;
}