var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight; 

var canvas = document.getElementById("canvas");
if(w>600){
    canvas.width=w-20;
    canvas.height=h-150;
}
else{
    canvas.width=w;
    canvas.height=h;
}
var ctx = canvas.getContext("2d");
var frame=0,time=0,score=0,dx=5;
var aliens=[],gun=[];
var alive=true,target=false;

x=100;
y=canvas.height/2;

spaceship_img = new Image();
spaceship_img.src = 'sprite/rocket.png';
alien_img=new Image();
alien_img.src='sprite/alien.png';
bullet_img=new Image();
bullet_img.src="sprite/bullet.png";
spaceship_img.onload=animate();

clock();
document.getElementById('highscore').textContent += localStorage.getItem("Spacewar");;

function alien(y,num){
    this.y=y;
    this.x=1700;
    this.attack=function(){
        ctx.drawImage(alien_img,this.x,this.y,50,50);
    }
}
function bullet(x,y){
    this.y=y;
    this.x=x;
    this.fire=function(){
        ctx.drawImage(bullet_img,this.x,this.y,50,50);
    }
}
function gameover(enemy){
    if( (x+90 === enemy.x) && ( (Math.abs(y-enemy.y)<=50) || (Math.abs(enemy.y-y)<=70) ) ){
        //console.log('out');
        return true;
    }
}
function animate(){
    ctx.clearRect(0,0,w,h);
    frame++;
    
    if(frame==1 || (frame/150) % 1 == 0){
            var yPos=Math.random()*800;
            aliens.push(new alien(yPos));
        }
    document.addEventListener('keyup',function(e){
        if(e.code=='Space'){
            //console.log('space');
            gun.push(new bullet(x+50,y+25));
        }
    });
    for (i = 0; i < aliens.length; i += 1) {
        aliens[i].x += -dx;
        aliens[i].attack(); 
        if(aliens[i].x<-50){
            aliens.splice(i,1);
        }
    }
    for (i = 0; i < gun.length; i += 1) {
        gun[i].x += 5;
        gun[i].fire();
        if(gun[i].x>canvas.width){
            gun.splice(i,1);
        }
    }
    for (i = 0; i < aliens.length; i += 1) {
        if (gameover(aliens[i])) {
            // alert("KHELA KHATAM");
            alive=false;
        }
    }
    for (i = 0; i < aliens.length; i += 1) {
        for(let j=0;j<gun.length;j++){
            if(gun[j]!=undefined || null){
                if((gun[j].x==aliens[i].x) && (Math.abs(gun[j].y-aliens[i].y)<50)){
                    console.log('hit');
                    target=true;
                }
            }
        }
    }   
    if(target){
        score++;
        document.getElementById('score').textContent="Score: "+score;
        target=false;
        console.log('target: ',target);
    } 
    ctx.drawImage(spaceship_img,x,y,100,100);

    if(y<0){
        y=0;
    }
    else if(x<0){
        x=0;
    }
    if(!alive){
        clearInterval(mytimer);
        //console.log(score);
        document.getElementById("gameover").play();
        document.getElementById('overlay').style.display="block";
        document.getElementById('urscore').textContent += score;
        var hs= localStorage.getItem("Spacewar");
            if(hs==null || hs<score){
                hs=score;
            }
            localStorage.setItem("Spacewar",hs);
            document.getElementById('highsc').textContent += hs;
    }
    else{
        requestAnimationFrame(animate);
    }
}
function clock(){
    mytimer= setInterval(myclock,1000);
    var c=0;
    function myclock(){
        ++c;    
        sec.innerHTML=pad(c);
        function pad(val){
            var valstr= val+"";
            if(valstr.length<2){
                return "Time: 0"+valstr;
            }
            else{
                return "Time: "+valstr;
            }
        }
        timeTaken=c;
        if(timeTaken % 30==0){
            score += 5;
            document.getElementById("bonus").play();
            dx++;
            document.getElementById('score').textContent = 'Score: '+score
        }
    }
}
document.addEventListener('keydown',function(e){
    if(e.code==='ArrowRight'){
        x += 5;

    }
    if(e.code==='ArrowLeft'){
        x += -5;
        
    }
    if(e.code==='ArrowUp'){
        y += -5;
       
    }
    if(e.code==='ArrowDown'){
        y += 5;
       
    }
});