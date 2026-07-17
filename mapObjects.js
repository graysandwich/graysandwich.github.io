class Wall{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.maxWidth=width;
        this.maxHeight=height;
    }
    static timer(){
    }
    act(){
        if(enableShrinking){

            if(this.width>100){
                this.width=(this.maxWidth-timeElapsed/3)
            }
            else{
                this.height=(this.maxHeight-timeElapsed/3)
            }
            if(this.x<500){
                this.x=this.initialX+timeElapsed/6;
            }
            else{
                this.x=this.initialX-timeElapsed/6;
            }
            if(this.y<500){
                this.y=this.initialY+timeElapsed/6;
            }
            else{
                this.y=this.initialY-timeElapsed/6;
            }
            if(isBossWave==false){

                if(this.width>100){
                    this.width=(this.maxWidth-timeElapsed/1.5)
                }
                else{
                    this.height=(this.maxHeight-timeElapsed/1.5)
                }
                if(this.x<500){
                    this.x=this.initialX+timeElapsed/3;
                }
                else{
                    this.x=this.initialX-timeElapsed/3;
                }
                if(this.y<500){
                    this.y=this.initialY+timeElapsed/3;
                }
                else{
                    this.y=this.initialY-timeElapsed/3;
                }
            }
        }
    }
    draw(){
        ctx.fillStyle="black";
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}
class WaterTerrain{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.changeColorTimer=0;
    }
    static timer(){
    }
    act(){
        this.changeColorTimer--;
        if(this.changeColorTimer<=0){
            
            this.color="#27ADF5";
        }
        if(
            (player.x - player.width / 2+10) < (this.x + this.width / 2) &&
            (player.x + player.width / 2-10) > (this.x - this.width / 2) &&
            (player.y - player.height / 2+10) < (this.y + this.height / 2) &&
            (player.y + player.height / 2-10) > (this.y - this.height / 2) )
        {
            this.color="#1f4153";
            player.slowCountdown=30;
            this.changeColorTimer=30;
        }
    }
    draw(){
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    }
}
class LavaTerrain{
    static iFrame=60;
    constructor(x, y, width, height, damage, color, alternateColor){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.damage=damage;
        this.orignalColor=color;
        this.color=color;
        this.alternateColor=alternateColor;
        this.changeColorTimer=0;
    }
    static timer(){
        LavaTerrain.iFrame--;
    }
    act(){
        this.changeColorTimer--;
        if(this.changeColorTimer<=0){
            
            this.color=this.orignalColor;
        }
        if(
            (player.x - player.width / 2+10) < (this.x + this.width / 2) &&
            (player.x + player.width / 2-10) > (this.x - this.width / 2) &&
            (player.y - player.height / 2+10) < (this.y + this.height / 2) &&
            (player.y + player.height / 2-10) > (this.y - this.height / 2))
        {
            this.color=this.alternateColor;
            this.changeColorTimer=30;
            if(LavaTerrain.iFrame<=0){
                LavaTerrain.iFrame=60;
                player.takeDamage(this.damage,this);

            }
            
        }
    }
    draw(){
        ctx.fillStyle=this.color
        ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    }
}
class TestTerrain{
    constructor(x, y, width, height, value){
        this.x=x;
        this.y=y;
        this.initialX=x;
        this.initialY=y;
        this.width=width;
        this.height=height;
        this.value=(value+1)/2*255;
        
    }
    static timer(){
    }
    act(){
    }
    draw(){
        ctx.fillStyle=`rgb(${this.value}, ${this.value}, ${this.value})`;
        ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    }
}