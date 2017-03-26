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

var posDead = [
    {x:335, y:100},
    {x:367, y:195},
    {x:399, y:291},
    {x:431, y:387},
    {x:105, y:89},
    {x:75, y:180},
    {x:45, y:281},
    {x:15, y:377}
    ];

var OBJECT_PLAYER = 1,
    OBJECT_BEER = 2,
    OBJECT_NPC = 4,
    OBJECT_WALL = 8,
    OBJECT_GLASS = 16,
    OBJECT_DEADZONE = 32;

// Generador del nivel
var level1 = [
 // delay, nCust, tiempo
  { delay: 5, 
  	nCust: 1,
  	tiempo: 5},
  { delay: 2, 
  	nCust: 1,
  	tiempo: 2},
  { delay: 7, 
  	nCust: 1,
  	tiempo: 4},
  { delay: 4, 
  	nCust: 1,
  	tiempo: 1}
];


var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();
 
  var board = new GameBoard();

  Game.setBoard(0,new Portada(playGame));
};

var playGame = function() {
  var board = new GameBoard();
  board.add(new TapField());
  board.add(new Wall());
  board.add(new PlayerBarMan());
  board.add(new Level(level1,winGame));
  board.add(new GamePoints());

  for (var i = posDead.length - 1; i >= 0; i--) {
    board.add(Object.create(new DeadZone(posDead[i].x, posDead[i].y)));
  }

  var Cliente = function(velocidad, posicion){
  	return new Customer(velocidad, posicion);
  }

  //Numero de customers en el level
  var numCustomers = 0;
  for(var i = 0; i < 4; i++){
  	board.add(new Spawner(i, level1[i].delay, level1[i].nCust, level1[i].tiempo, Cliente));
    numCustomers += level1[i].nCust;
  }
  GameManager.setNumCliente(numCustomers);

  Game.setBoard(0, board);

};

var winGame = function() {
  var board = new GameBoard();
  Game.setBoard(0,new TitleScreen("You win with " + Game.points + " points!", 
                                  "Press 'space' to play again",
                                  playGame));
};

var loseGame = function() {
  var board = new GameBoard();
  Game.setBoard(0,new TitleScreen("You lose with " + Game.points + " points!", 
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
};

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
  this.timeBeer = 1;
  this.timeBeerFixed = 1;
  this.pos = 0;

  this.step = function(dt) {
    this.time += dt;
    this.timeBeer += dt;

    if(this.time > this.timeMove){
    	this.time = 0;
    	if(Game.keys['up']) { 
	    	this.pos--;
	  		if (this.pos < 0)
	  			this.pos = 3;
	    	this.x = this.posiciones[this.pos].x;
	  		this.y = this.posiciones[this.pos].y; 
	  		this.timeBeer = 1;
	  	} else if(Game.keys['down']) { 
	  		this.pos++;
	    	if(this.pos > 3)
	    		this.pos = 0;
	    	this.x = this.posiciones[this.pos].x;
	  		this.y = this.posiciones[this.pos].y; 
	  		this.timeBeer = 1;
	  	} else if(Game.keys['beer']){
	  		if(this.timeBeer > this.timeBeerFixed){
	  			this.timeBeer = 0;
	  			this.board.add(new Beer(this.x, this.y, -50));
	  		}
	  	}
    }   

  };
};

PlayerBarMan.prototype = new Sprite();
PlayerBarMan.prototype.type = OBJECT_PLAYER;


var Beer = function(posX, posY, velocidad) {
	this.setup('Beer');
	this.x = posX - 12;
	this.y = posY; 
	this.vx = velocidad;

	this.step = function(dt)  {
  		this.x += this.vx * dt;	
	    if(this.board.collide(this, OBJECT_NPC)) {	  	    
	  	    this.board.remove(this);
	  	    this.board.add(Object.create(new PlayerGlass(this.x, this.y, 50)));	  	    
          	GameManager.addJarra();
	    }
    	if(this.board.collide(this, OBJECT_DEADZONE)) {
        	this.board.remove(this);
          GameManager.youLose();
      }
	};
};

Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_BEER;


var Customer = function(velocidad, pos) {
  this.setup('NPC');
  this.spritesCustomers = [{
	    sx: 64,
	    sy: 96,
	    w: 32,
	    h: 32,
	    frames: 1
	  },
	  {
	    sx: 63,
	    sy: 64,
	    w: 32,
	    h: 32,
	    frames: 1
	  },
	  {
	    sx: 64,
	    sy: 32,
	    w: 32,
	    h: 32,
	    frames: 1
	  },
	  {
	    sx: 64,
	    sy: 0,
	    w: 32,
	    h: 32,
	    frames: 1
	  }
	];
  this.posiciones = [
    {x:120, y:80},
    {x:90, y:176},
    {x:60, y:272},
    {x:30, y:368}];
  this.x = this.posiciones[pos].x;
  this.y = this.posiciones[pos].y;
  this.vx = velocidad;
  this.s = this.spritesCustomers[aleatorio(0,3)];

  this.draw = function(ctx){
  	this.image = new Image();
    this.image.src = 'img/customers.png';

    ctx.drawImage(this.image,
                     this.s.sx + this.s.frames * this.s.w, 
                     this.s.sy, 
                     this.s.w, this.s.h, 
                     Math.floor(this.x), Math.floor(this.y),
                     this.s.w, this.s.h);
  }

  this.step = function(dt)  {
  	this.x += this.vx * dt;


    if(this.board.collide(this, OBJECT_GLASS)) {
  	  this.board.remove(this);
  	  Game.points += 50;
      GameManager.subCliente();
    }
  	if(this.board.collide(this, OBJECT_DEADZONE)) {
	  	this.board.remove(this);
      GameManager.youLose();
    }
	};

};

Customer.prototype = new Sprite();
Customer.prototype.type = OBJECT_NPC;


var PlayerGlass = function(posX, posY, velocidad) {
  this.setup('Glass');
  this.x = posX;
  this.y = posY; 
  this.vx = velocidad;

  this.step = function(dt) {
  	this.x += this.vx * dt;	

  	if(this.board.collide(this, OBJECT_PLAYER)) {
  	  this.board.remove(this);
      GameManager.jarrasCogidas();
    }
  	if(this.board.collide(this, OBJECT_DEADZONE)) {
  	  this.board.remove(this);
      GameManager.youLose();
    }
	};
};

PlayerGlass.prototype = new Sprite();
PlayerGlass.prototype.type = OBJECT_GLASS;


var DeadZone = function(posX, posY) {
  
  this.draw = function (ctx) {
    
    this.x = posX;
    this.y = posY;
    this.w = 10;
    this.h = 60;
    this.frames = 1;
    ctx.fillRect(this.x, this.sy, this.w, this.h);

};

  this.step = function(dt) {

  };
};

DeadZone.prototype = new Sprite();
DeadZone.prototype.type = OBJECT_DEADZONE;


var Spawner = function(posicion, delay, nCust, tiempo, cliente){

	this.tiempoDelay = 0;
	this.tiempoTranscurrido = 0;
	this.generados = 0;
	this.cliente = cliente;

	this.draw = function(){};

	this.step = function(dt){
		this.tiempoDelay += dt;
		if(this.tiempoDelay > delay){
			this.tiempoTranscurrido += dt;
			if(this.tiempoTranscurrido > tiempo && this.generados < nCust){
				this.tiempoTranscurrido = 0;
				this.board.add(Object.create(this.cliente(50, posicion)));
				this.generados++;
			}
		}
	};
};

Spawner.prototype = new Sprite();


var GameManager = new function() {
  this.numClientes = 0;
  this.numJarras = 0;
  
  this.setNumCliente = function(nClientes){
      this.numClientes = nClientes;
  }

  this.subCliente = function(){
      this.numClientes--;
  }

  this.jarrasCogidas = function(){
      this.numJarras--;
      Game.points += 100;
      if(this.numClientes === 0 && this.numJarras === 0){
          winGame();
      }
  }

  this.youLose = function(){
    loseGame();
  }

  this.addJarra = function(){
      this.numJarras++;
  }

};

var aleatorio = function aleatorio(min, max) {
    return Math.round(Math.random()*(max-min)+parseInt(min));
}

window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});