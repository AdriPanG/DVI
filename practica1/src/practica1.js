/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
	var cartas = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"];
	var nCartasEncontradas = 0;
	var textoEstado = "Memory Game";
	var tablero = [];
	

	this.initGame = function(){		
		// Aqui hay que desordenar las cartas, de momento las insertamos dos veces en orden
		tablero = [{id: "8-ball", estado: 0}, {id: "potato", estado: 0} , {id: "dinosaur", estado: 0}, {id: "kronos", estado:0}, {id: "rocket", estado:0}, {id: "unicorn",estado:0}, {id: "guy", estado:0}, {id: "zeppelin", estado:0}, 
					{id: "8-ball", estado: 0}, {id: "potato", estado: 0} , {id: "dinosaur", estado: 0}, {id: "kronos", estado:0}, {id: "rocket", estado:0}, {id: "unicorn",estado:0}, {id: "guy", estado:0}, {id: "zeppelin", estado:0}]

		this.loop();
	}

	this.draw = function(){
		// Mostramos el estado actual
		gs.drawMessage(textoEstado);

		// Mostramos las cartas
		for(var i = 0; i < tablero.length ; i++){
			switch(tablero[i].estado){
				case 0:
					gs.draw("back", i);
					break;
				case 1:
					gs.draw(tablero[i].id, i);
					break;
				case 2:
					break;
			}
		}
	}	

	this.loop = function(){
		setInterval( this.draw , 16);
	}

	this.onClick = function(cardId){
		tablero[cardId].estado = 1;
	}

}


/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {

	this.flip = function(){
		
	}
};
