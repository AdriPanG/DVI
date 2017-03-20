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
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;

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
  board.add(new PayerBarMan(), 1);
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


var PayerBarMan = function() { 
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
	  	}    
    }
    
  };
};

PayerBarMan.prototype = new Sprite();

PayerBarMan.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};


var PlayerBeer = function(x,y) {
  this.setup('Beer',{ vx: -700, damage: 10 });
  this.x = x - this.w;
  this.y = y - this.h/2; 
};

PlayerBeer.prototype = new Sprite();
PlayerBeer.prototype.type = OBJECT_PLAYER_BEER;

PlayerBeer.prototype.step = function(dt)  {
  this.x += this.vx * dt;
  var collision = this.board.collide(this,OBJECT_ENEMY);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.x < -this.w) { 
      this.board.remove(this); 
  }
};


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

Enemy.prototype.step = function(dt) {
  this.t += dt;

  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
  this.y += this.vy * dt;

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

  if(Math.random() < 0.01 && this.reload <= 0) {
    this.reload = this.reloadTime;
    if(this.missiles == 2) {
      this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
      this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
    } else {
      this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
    }

  }
  this.reload-=dt;

  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }
};

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      Game.points += this.points || 100;
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }
};

var EnemyMissile = function(x,y) {
  this.setup('enemy_missile',{ vy: 200, damage: 10 });
  this.x = x - this.w/2;
  this.y = y;
};

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

EnemyMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y > Game.height) {
      this.board.remove(this); 
  }
};



var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 12) {
    this.board.remove(this);
  }
};

window.addEventListener("load", function() {
  Game.initialize("game",sprites,playGame);
});


