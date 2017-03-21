var sprites = {Beer: {
    sx: 512,
    sy: 99,
    w: 23,
    h: 32,
    frames: 1
  },
  Glass: {
    sx: 512,
    sy: 131,
    w: 23,
    h: 32,
    frames: 1
  },
  NPC: {
    sx: 512,
    sy: 66,
    w: 33,
    h: 33,
    frames: 1
  },
  ParedIzda: {
    sx: 0,
    sy: 0,
    w: 512,
    h: 480,
    frames: 1
  },
  Player: {
    sx: 512,
    sy: 0,
    w: 56,
    h: 66,
    frames: 1
  },
  TapperGameplay: {
    sx: 0,
    sy: 480,
    w: 512,
    h: 480,
    frames: 1
  }
};

var enemies = {
  straight: { x: 0,   y: -50, sprite: 'enemy_ship', health: 10, 
              E: 100 },
  ltr:      { x: 0,   y: -100, sprite: 'enemy_purple', health: 10, 
              B: 75, C: 1, E: 100, missiles: 2  },
  circle:   { x: 250,   y: -50, sprite: 'enemy_circle', health: 10, 
              A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
  wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20, 
              B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
  step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
              B: 150, C: 1.2, E: 75 }
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_BEER = 2,
    OBJECT_NPC = 4,
    OBJECT_WALL = 8,
    OBJECT_PLAYER_GLASS = 16;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();
  var fondo = new GameBoard();
  fondo.add(new TapField(), 1);

  Game.setBoard(0, fondo);
   
  Game.setBoard(3,new TitleScreen("Tapper", 
                                  "Press 'space' to start playing",
                                  playGame));
};

var level1 = [
 // Start,   End, Gap,  Type,   Override
  [ 0,      4000,  500, 'step' ],
  [ 6000,   13000, 800, 'ltr' ],
  [ 10000,  16000, 400, 'circle' ],
  [ 17800,  20000, 500, 'straight', { x: 50 } ],
  [ 18200,  20000, 500, 'straight', { x: 90 } ],
  [ 18200,  20000, 500, 'straight', { x: 10 } ],
  [ 22000,  25000, 400, 'wiggle', { x: 150 }],
  [ 22000,  25000, 400, 'wiggle', { x: 100 }]
];


var playGame = function() {
  var board = new GameBoard();
  board.add(new TapField(), 0);
  //board.add(new Wall(), 1);
  board.add(new PlayerBarMan(), 2);
  Game.setBoard(0, board);

};

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press 'space' to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press 'space' to play again",
                                  playGame));
};

var TapField = function() {

  // Set up the offscreen canvas
  this.setup('TapperGameplay',{x:0, y:0});
  this.w = Game.width; 
  this.h = Game.height;

  this.step = function(dt) {

  };
};

TapField.prototype = new Sprite();

var Wall = function() {

  // Set up the offscreen canvas
  this.setup('ParedIzda',{x:0, y:0});
  this.w = Game.width; 
  this.h = Game.height;

  this.step = function(dt) {

  };
}

Wall.prototype = new Sprite();
Wall.prototype.type = OBJECT_WALL;


var PlayerBarMan = function() { 
  this.setup('Player');
  this.posiciones = [
	{x:325, y:90},
	{x:357, y:185},
	{x:389, y:281},
	{x:421, y:377}];
  this.x = this.posiciones[0].x;
  this.y = this.posiciones[0].y;
  this.timeMove = 0.095;
  this.time = 0;
  this.pos = 0;

  this.step = function(dt) {
    this.time += dt;

    if(this.time > this.timeMove){
    	this.time = 0;
    	if(Game.keys['up']) { 
	    	this.pos--;
	  		if (this.pos < 0)
	  			this.pos = 3;
	    	this.x = this.posiciones[this.pos].x;
	  		this.y = this.posiciones[this.pos].y; 
	  	} else if(Game.keys['down']) { 
	  		this.pos++;
	    	if(this.pos > 3)
	    		this.pos = 0;
	    	this.x = this.posiciones[this.pos].x;
	  		this.y = this.posiciones[this.pos].y; 
	  	} else if(Game.keys['beer']){
	  		this.board.add(Object.create(new PlayerBeer(this.x, this.y, -50)), 3);
	  		this.board.add(Object.create(new Customer(this.x, this.y, 50)), 4);
	  	}
    }  

    

  };
};

PlayerBarMan.prototype = new Sprite();
PlayerBarMan.prototype.type = OBJECT_PLAYER;


var PlayerBeer = function(posX, posY, velocidad) {
  this.setup('Beer');
  this.x = posX;
  this.y = posY; 
  this.vx = velocidad;

  this.step = function(dt)  {
  	if(this.x < sprites.TapperGameplay.w)
	  this.x += this.vx * dt;	

	  if(this.board.collide(this, OBJECT_NPC)) {
	  	  this.board.add(Object.create(new PlayerGlass(this.x, this.y, 50)), 3);
	  	  this.hit();
	  }
	  /*else if(this.board.collide(this, OBJECT_WALL))
	  	  this.hit();*/	
	};
};

PlayerBeer.prototype = new Sprite();
PlayerBeer.prototype.type = OBJECT_PLAYER_BEER;

var Customer = function(posX, posY, velocidad) {
  this.setup('NPC');
  this.x = 30;
  this.y = 367; 
  this.vx = velocidad;
  this.posiciones = [
	{x:120, y:79},
	{x:90, y:175},
	{x:60, y:271},
	{x:30, y:367}];

  //this.pos = Math.floor((Math.random() * 4));

  this.step = function(dt)  {
  	if(this.x < sprites.TapperGameplay.w)
	  this.x += this.vx * dt;

	  if(this.board.collide(this, OBJECT_PLAYER_BEER))
	  	  this.hit();
	};

	

};

Customer.prototype = new Sprite();
Customer.prototype.type = OBJECT_NPC;

var PlayerGlass = function(posX, posY, velocidad) {
  this.setup('Glass');
  this.x = posX;
  this.y = posY; 
  this.vx = velocidad;

  this.step = function(dt)  {
  	if(this.x < sprites.TapperGameplay.w)
	  this.x += this.vx * dt;	

	  if(this.board.collide(this, OBJECT_PLAYER))
	  	  this.hit();	
	};
};

PlayerGlass.prototype = new Sprite();
PlayerGlass.prototype.type = OBJECT_PLAYER_GLASS;


window.addEventListener("load", function() {
  Game.initialize("game",sprites,playGame);
});


