function load_images()
{
    //player,gem,villan
     enemy_image=new Image;
     enemy_image.src="images/kirmada.png";

      player_img=new Image;
      player_img.src="images/bheem.png";

      ladoo_img=new Image
      ladoo_img.src="images/ladoo.jpg";
      
}

function init(){
   
    //objects of game
    canvas =document.getElementById("mycanvas");
    console.log(canvas);
     
    W=700;
    H=400;

    canvas.width = W;
    canvas.height= H;

    pen=canvas.getContext("2d");
    console.log(pen);

    game_over=false;
    e1 = {
        x:150,
        y:50,
        w:60,
        h:60,
        speed:20,
    };
    e2 = {
        x:300,
        y:150,
        w:60,
        h:60,
        speed:20,
    };
    e3 = {
        x:450,
        y:200,
        w:60,
        h:60,
        speed:20,
    };

    enemy=[e1,e2,e3];

    player={
        x:20,
        y:H/2,
        w:60,
        h:60,
        speed:20,
        moving:false,
health:100,
    };

    ladoo={
        x:W-100,
        y:H/2,
        w:60,
        h:60,
    };

    canvas.addEventListener('mousedown',function()
    {
        console.log("Mouse Pressed");
        player.moving=true;
    }
    );
    
    canvas.addEventListener('mouseup',function()
    {
        console.log("Mouse Released");
        player.moving=false;
    }
    );

   
}
function isOverlap(rect1,rect2)
{
    if (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y)
       return true;
      
      return false;
    }
function draw()
{

    pen.clearRect(0,0,W,H);
    pen.fillStyle = "red";
   //pen.fillRect(box.x,box.y,box.w,box.h);
    //pen.draw(enemy_image,box.x,box.y,box.w,box.h);

    pen.drawImage(player_img,player.x,player.y,player.w,player.h);
    
    pen.drawImage(ladoo_img,ladoo.x,ladoo.y,ladoo.w,ladoo.h);

        for(let i=0;i<enemy.length;i++)
        {
            pen.drawImage(enemy_image,enemy[i].x,enemy[i].y,enemy[i].w,enemy[i].h);
        }

        pen.fillStyle="white";
        pen.fillText("Score"+player.health,10,10);
}

function update()
{
//box.y+=10;

if(player.moving==true)
{
    player.x+=player.speed;
    player.health+=20;
}

for(let i=0;i<enemy.length;i++)
{
if(isOverlap(enemy[i],player)){
    player.health-=50;
    if(player.health<0)
    {
        console.log(player.health);
        game_over=true;
        alert("Game Over"+player.health);
    }
}

}
if(isOverlap(player,ladoo))
{
    console.log("You Won the game");
    alert("You Won!");
    game_over=true;
    return;
}

for(let i=0;i<enemy.length;i++)
{
    enemy[i].y+=enemy[i].speed;
    if(enemy[i].y>=H-enemy[i].h || enemy[i].y <0)
    {
         enemy[i].speed *= -1;
    }
}
}

function gameloop()
{
    if(game_over==true)
    {
       clearInterval(f); 
    }
    draw();
    update();
    console.log(" In GAME LOOP");
}

load_images();
init();
var f= setInterval(gameloop,100);