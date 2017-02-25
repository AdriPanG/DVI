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
		tablero = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin", 
					"8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"]
	}

	this.draw = function(){
		// Mostramos el estado actual
		gs.drawMessage(textoEstado);

		// Mostramos las cartas
		for(var i = 0; i < tablero.length ; i++){
			gs.draw(tablero[i], i);
		}
	}	

}


/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {

};
