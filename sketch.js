const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

var engine, world;
var backgroundImg;
var bird, slingshot;

var gameState = "onSling";
var score = 0;

//creating birds array
var birds = [];

function preload() {
    getBackgroundImg();
	bgImg = loadImage("sprites/bg1.png");

    //sounds
    birdselectsound = loadSound("sounds/bird_select.mp3");
    birdflysound = loadSound("sounds/bird_flying.mp3");
}

function setup(){
    createCanvas(1200,400);
    engine = Engine.create();
    world = engine.world;

    ground = new Ground(600,height,1200,20);
    platform = new Ground(150, 305, 300, 170);

    box1 = new Box(700,320,70,70);
    box2 = new Box(920,320,70,70);
    pig1 = new Pig(810, 350);
    log1 = new Log(810,260,300, PI/2);

    box3 = new Box(700,240,70,70);
    box4 = new Box(920,240,70,70);
    pig3 = new Pig(810, 220);

    log3 =  new Log(810,180,300, PI/2);

    box5 = new Box(810,160,70,70);
    log4 = new Log(760,120,150, PI/7);
    log5 = new Log(870,120,150, -PI/7);

    bird = new Bird(200,50);
    bird2 = new Bird(150,170);
    bird3 = new Bird(100,170);

    //pushing birds to the array
    birds.push(bird3);
    birds.push(bird2);
    birds.push(bird);

    slingshot = new SlingShot(bird.body,{x:200, y:50});

    //displaying the refresh button
    refresh = createImg("sprites/refresh.png");
    refresh.position(15, 10);

}

function draw(){

    //background 
    if(backgroundImg){
        background(backgroundImg);
    }
	else{
		background(bgImg);
	}
	

    //display score
    textStyle(BOLD);
    textSize(25);
    fill(146,42,42);
    text("Score: " + score, width-150, 50);

    //if mouseclicked on reload button then call reset() function
    refresh.mousePressed(reset);

    Engine.update(engine);
    
    //displaying the bodies
    box1.display();
    box2.display();
    ground.display();
    pig1.display();
    pig1.score();
    log1.display();

    box3.display();
    box4.display();
    pig3.display();
    pig3.score();
    log3.display();

    box5.display();
    log4.display();
    log5.display();

    platform.display(); 

     //displaying colorful birds
     bird.displayred();
     bird2.displayblue();
     bird3.displayyellow();
	
     //display trajectory
     bird.displaytrajectory();
     bird2.displaytrajectory();
     bird3.displaytrajectory();

    slingshot.display();  
    
    //instructions
    if(gameState==="launched"){

        if(birds.length>0){
            fill(146,42,42);
            text("Press 'Space' for Next Bird", 480, 50);        
        }
        else{
            fill(146,42,42);
            text("Click on 'Reload' to play again!",450, 50);
        }

        //when the score reaches 400 then game ends
        if(score === 400){
            gameState = "end";
        }

    }

    //end state
    if(gameState==="end"){
        fill(146,42,42);
        text("Game Over\nClick on 'Reload' to play again!",450,50);
    }
    
}

//reset function to reload the page
function reset(){
    location.reload();
}

//bird will be launched limited to how the sling is dragged
//and not in launched state
function mouseDragged(){
    if(mouseX >= 0 && mouseX < 200 && gameState!== "launched"){
        Body.setPosition(birds[birds.length-1].body, {x: mouseX , y: mouseY});
        birdflysound.play();
    }
}

//bird will fly once mouse is released
function mouseReleased(){
    slingshot.fly();
    //removing the bird that flew from the array
    birds.pop();
    gameState = "launched";
}

//attaching new bird when space is pressed and when in launched state
function keyPressed(){
    if(keyCode === 32 && gameState === "launched"){
        Body.setPosition(birds[birds.length-1].body,{x:200,y:50});
        slingshot.attach(birds[birds.length-1].body);
        birdselectsound.play();
        gameState="onSling";
    }
}

//to get background image based on timezone
async function getBackgroundImg(){
    var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
    var responseJSON = await response.json();

    var datetime = responseJSON.datetime;
    var hour = datetime.slice(11,13);
    
    if(hour>=06 && hour<=19){
        bg = "sprites/bg1.png";
    }
    else{
        bg = "sprites/bg2.jpg";
    }

    backgroundImg = loadImage(bg);
}
