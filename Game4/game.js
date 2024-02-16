var balleye;
var stage;
var suunta;
var level;
var floors;
var floorsurface = {y: 0};
var background;
var diamonds;
var finish;
var starsprites;
var txtcheckpoint;
const delta = 20;
var paused = false;
var interval;
var momentum;
var spawn = {x: 0};
var groundedup = false;
var groundeddown = false;
var movewalls;
var groundedsound = false;
var timer = 0;
music();

function music() {
	var finntopvoid = new Audio('Finntopmusic_Void.mp3');
	finntopvoid.play();
}

function init() {
    // code here.
	stage = new createjs.Stage("demoCanvas");
	background();
	starsprites = stars();
	diamonds = points();
	floors = floor();
	finish = reddiamond();
	movewalls = movingwalls();
	loadAudio();
	

	txtcheckpoint = new createjs.Text("checkpoint!", "50px Arial", "White");
	txtcheckpoint.x = -500;
	TS135 = new createjs.Bitmap("B.TS135.png");
	TS135.regX = 50;
	TS135.regY = 50;
	TS135.x = 100;
	TS135.y = 100;
	suunta = {x: 0, y: 0, momentum: 0};

	//Let`s make her alive
	stage.addChild(TS135);

	balleye = new createjs.Bitmap("B.TS135E.png");
	balleye.regX = 50;
	balleye.regY = 50;
	balleye.x = 100;
	balleye.y = 100;
	animate();

	stage.addChild(balleye);
	stage.update();

	level = level01();
	
	interval = setInterval(update,delta);
}

function loadAudio() {
  var preload = new createjs.LoadQueue();
  preload.loadFile('406562__anthousai__hit-metallic-01.wav');
  preload.loadFile('274183__littlerobotsoundfactory__jingle-win-synth-04.wav');
  preload.loadFile('270404__littlerobotsoundfactory__jingle-achievement-00.wav');
  preload.loadFile('160068_jorickhoofd_tube-hit-with-metal-object-soft.wav');
  //preload.loadFile('Finntopmusic_Void.mp3');
}

function update() {

	timer+=delta/1000;

	if (paused) {
		return;
	}	

	suunta.y+=gravity*gravitydirection*delta/1000;

	//var suunta = {x: 5, y: 4}
	level.x-=suunta.x;
	floors.x-=suunta.x;

	for(i=0; i < movewalls.length; i++){
		//movewalls[i] = {shape: movingwall(100,300), max:500, min:0, direction:1}
		movewalls[i].shape.x -= suunta.x;
		
		if (movewalls[i].shape.y > movewalls[i].max || movewalls[i].shape.y < 0) {
			movewalls[i].direction*=-1;
		}
		movewalls[i].shape.y += movewalls[i].direction;
	}

	for (i=0;i< diamonds.length;i++){
    	diamonds[i].x -=suunta.x;
    //Diamonds move as fast as level
	}

	finish.x -=suunta.x;
	//finishing line moves as fast as level

	starsprites.x -=0.3*suunta.x;	

	for(var i = 0; i < 8; i++){
		var x = Math.cos(i*Math.PI/4) * 50 + TS135.x - level.x;
		var y = Math.sin(i*Math.PI/4) * 50 + TS135.y;

		for (var j=0;j< diamonds.length;j++){
    		if(diamonds[j].hitTest(x,y)){
    			
				let audio = new Audio('274183__littlerobotsoundfactory__jingle-win-synth-04.wav');
				audio.loop = false;
				audio.play();						

				spawn.x = diamonds[j].x;
    			createjs.Tween.get(txtcheckpoint)
     			.to({x: -300, y: 250},0)
    			.wait(400)
     			.to({x:400},500)
     			.wait(600)
     			.to({x:1200},500);
     			stage.addChild(txtcheckpoint);

    			stage.removeChild(diamonds[j]);
    			diamonds.splice(j,1);
    		}
		}

		if(finish.hitTest(x,y)){

			let audio = new Audio('270404__littlerobotsoundfactory__jingle-achievement-00.wav');
			audio.loop = false;
			audio.play(); 

			console.log("You are Vinner!");
			paused = true;

			var menu = new createjs.Shape();
			menu.graphics.beginFill("white");
			menu.graphics.beginStroke("black").
			mt(250,100).lt(750,100).lt(750,450).lt(250,450).lt(250,100);
			stage.addChild(menu);

			var againbutton = new createjs.Shape();
			againbutton.graphics.beginFill("#941bd1");
			againbutton.graphics.beginStroke("black").
			mt(305,230).lt(695,230).lt(695,330).lt(305,330).lt(305,230);
			stage.addChild(againbutton);

			againbutton.on("click", function(evt) {
    		console.log("new game");
    		timer = 0;
    		stage.removeAllChildren();
   			init();
   			paused = false;
   			gravitydirection = 1;
   			clearInterval(interval);
			stage.update();
			});

			var text = new createjs.Text("Congratulations!", "60px Arial", "black");
 			text.x = 285;
 			text.y = 200;
 			text.textBaseline = "alphabetic";
 			stage.addChild(text);

 			var againtxt = new createjs.Text("Again!", "60px Arial", "black");
 			againtxt.x = 400;
 			againtxt.y = 300;
 			againtxt.textBaseline = "alphabetic";
 			stage.addChild(againtxt);
 			console.log(timer);
 			function pad(num) {
 				var numstring = ""+num;
 				if(numstring.length==1){
 					return ("0"+numstring); 
 				}
 				else {
 					return (numstring);
 				}
			}

 			var txt = new createjs.Text("Your time: "+ Math.round(timer / 60) + ":" + pad (Math.round(timer % 60)), "64px Arial"+ "black");
 			txt.x = 300;
 			txt.y = 420;
 			txt.textBaseline = "alphabetic";
 			stage.addChild(txt);

			stage.removeChild(finish);
		}

		floorsurface.y = TS135.y;
		
		if(floors.hitTest(x,y)){
			suunta.y = 0;
			//2 ylhäällä, 6 alhaalla
			if(groundedsound == false){
				let audio = new Audio('160068_jorickhoofd_tube-hit-with-metal-object-soft.wav');
				audio.loop = false;
				audio.play();
				groundedsound = true;
			}

			if(i===6){
				groundedup = true;
				var i = 0;
				while(floors.hitTest(x,TS135.y-50)){
					TS135.y++;
				}
				suunta.y = 0;
				gravitydirection = -1;
			}
			if(i===2){
				groundeddown = true;
				var i = 0;
				while(floors.hitTest(x,TS135.y+50)){
					TS135.y--;
				}
				suunta.y = 0;
				gravitydirection = 1;
			}
			//TS135.y = floorsurface.y - suunta.y;

			/*	for(var i = 0; i < 8; i++){
		var x = Math.cos(i*Math.PI/4) * 50 + TS135.x - level.x;
		var y = Math.sin(i*Math.PI/4) * 50 + TS135.y; */
		}
	

		/*
			if (TS135.y>=450) {
		suunta.y = 0;
		TS135.y = 450;
		groundeddown = true;
	}	*/

		if(level.hitTest(x,y)) {
			
			if(groundedsound == false) {
				let audio = new Audio('406562__anthousai__hit-metallic-01.wav');
				audio.loop = false;
				audio.play();
				groundedsound = true;
			}
			
			gameOver();
		}

		//lets optimate movingwalls
		for(var j=0;j<movewalls.length;j++) {
			var distance = movewalls[j].start + movewalls[j].shape.x;
			if(distance > 0 && distance <400){
				if(movewalls[j].shape.hitTest(x,y-movewalls[j].shape.y)) {
					
					if(groundedsound == false) {
						var audio = new Audio('406562__anthousai__hit-metallic-01.wav');
						audio.loop = false;
						audio.play();
						groundedsound = true;
					}
					
					gameOver();
				}
			}
		}
	}
	
	if(groundeddown||groundedup) {
		suunta.y = 0;

		if(groundedsound == false){
				let audio = new Audio('160068_jorickhoofd_tube-hit-with-metal-object-soft.wav');
				audio.loop = false;
				audio.play();
				groundedsound = true;
			}
		/*
		if(groundedsound == false) {
			var audio = new Audio('406562__anthousai__hit-metallic-01.wav');
			audio.loop = false;
			audio.play();
			groundedsound = true;
		}
		*/
	}

	TS135.y+=suunta.y;

	if (TS135.y>=450) {
		suunta.y = 0;
		TS135.y = 450;
		groundeddown = true;
		gravitydirection = 1;
	}

	if (TS135.y<=50) {
		suunta.y = 0;
		TS135.y = 50;
		groundedup = true;
		gravitydirection = -1;
	}

	if (groundeddown === true) {
		if (suunta.x > 0 ) {
			suunta.momentum=2.15;
		}else if (suunta.x < 0 ) {
			suunta.momentum=-2.15;
		}else{
			suunta.momentum=0;
		}
	} else if (groundedup === true) {
		if (suunta.x < 0) {
			suunta.momentum=2.15;
		}else if (suunta.x > 0) {
			suunta.momentum=-2.15;
		}else{
			suunta.momentum=0;
		}
	} else {
		if (momentum < 0) {
			momentum += 0.05;

		}
		if (momentum > 0) {
			momentum -= 0.05;
		}
	}

	TS135.rotation+=suunta.momentum;

	balleye.y = TS135.y;
	balleye.rotation = TS135.rotation;
	stage.update();
}

function gameOver() {
	console.log("hit");
	var menu = new createjs.Shape();
	menu.graphics.beginFill("white");
	menu.graphics.beginStroke("black").
	mt(300,100).lt(700,100).lt(700,450).lt(300,450).lt(300,100);
	stage.addChild(menu);

	var again = new createjs.Shape();
	again.graphics.beginFill("#941bd1");
	again.graphics.beginStroke("black").
	mt(375,350).lt(625,350).lt(625,425).lt(375,425).lt(375,350);

	var checkpoint = new createjs.Shape();
	checkpoint.graphics.beginFill("blue");
	checkpoint.graphics.beginStroke("black").
	mt(375,250).lt(625,250).lt(625,325).lt(375,325).lt(375,250);
	stage.addChild(checkpoint);

	again.on("click" , function(evt) {
		console.log("new game");
		stage.removeAllChildren();
		init();
		paused = false;
		gravitydirection = 1;
		clearInterval(interval);
		stage.update();
		
	});

	checkpoint.on("click", function(evt) {
		console.log("Last checkpoint");
		stage.removeAllChildren();
		init();
		paused = false;
		gravitydirection = 1;
		clearInterval(interval);
		level.x = spawn.x;
		finish.x = spawn.x;
		floors.x = spawn.x;

		for (j=0;j< diamonds.length;j++){
			diamonds[j].x = spawn.x;
		}

		for (j=0;j< movewalls.length;j++){
			movewalls[j].shape.x = spawn.x;
		}

		stage.update();
	});

	stage.addChild(again);

	var text = new createjs.Text("Game over!", "60px Arial", "black");
	text.x = 350;
	text.y = 200;
	text.textBaseline = "alphabetic";
	stage.addChild(text);

	var againtxt = new createjs.Text("New game", "30px Arial", "white");
	againtxt.x = 430;
	againtxt.y = 375;
	stage.addChild(againtxt);

	var checkpointtxt = new createjs.Text("Last checkpoint", "30px Arial", "white");
	checkpointtxt.x = 395;
	checkpointtxt.y = 250;
	stage.addChild(checkpointtxt);

	var spacetxt = new createjs.Text("(Space)", "30px Arial", "white");
	spacetxt.x = 450;
	spacetxt.y = 275;
	stage.addChild(spacetxt);
	
	paused = true;
	//game over

}

function animate() {
	var random = 3000*Math.random()+1000;

	createjs.Tween.get(balleye)
	.to({visible:false}, random)
	.to({visible:true}, 300)
	.call(animate);
}

const r = 82;
const leftkey = 37;
const rightkey = 39;
const upkey = 38;
const downkey = 40;
const space = 32;
const gravity = 9.80665;
const speed = 5;
var gravitydirection = 1;

document.onkeydown = function (event) {
	var key_press = event.keyCode;

	if (paused) {

		if (key_press == space) {
			console.log("Last checkpoint");
			stage.removeAllChildren();
			init();
			paused = false;
			gravitydirection = 1;
			clearInterval(interval);
			level.x = spawn.x;
			finish.x = spawn.x;
			floors.x = spawn.x;

			for (j=0;j< diamonds.length;j++){
				diamonds[j].x = spawn.x;
			}


			for (k=0;k< movewalls.length;k++) {
				movewalls[k].shape.x = spawn.x;
			}

			stage.update();
		}
	}

	if (key_press == leftkey) {
		suunta.x = -1*speed;
	}

	if (key_press == rightkey) {
		suunta.x = 1*speed;
	}

//*************************************************************************************************

	if (key_press == space) {
		//suunta.y = -1*gravitydirection*gravity;
		gravitydirection*=-1;
		groundeddown = false;
		groundedup = false;
		groundedsound = false;
	}
}

document.onkeyup = function (event) {
	var key_up = event.keyCode;

	if (key_up == leftkey) {
		suunta.x = 0;
	}

	if (key_up == rightkey) {
		suunta.x = 0;
	}

}