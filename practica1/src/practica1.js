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
	var tablero = [];
	var nCartasEncontradas = 0;
	var textoEstado = "Memory Game";	
	var cartaVolteadaActual = undefined;
	

	this.initGame = function(){		
		// Aqui hay que desordenar las cartas, de momento las insertamos dos veces en orden
		tablero = [ new MemoryGameCard("8-ball"), new MemoryGameCard("potato"), new MemoryGameCard("dinosaur"), new MemoryGameCard("kronos"),new MemoryGameCard("rocket"), new MemoryGameCard("unicorn"), new MemoryGameCard("guy"), new MemoryGameCard("zeppelin"),
					new MemoryGameCard("8-ball"), new MemoryGameCard("potato"), new MemoryGameCard("dinosaur"), new MemoryGameCard("kronos"),new MemoryGameCard("rocket"), new MemoryGameCard("unicorn"), new MemoryGameCard("guy"), new MemoryGameCard("zeppelin")];

		this.loop();
	}

	this.draw = function(){
		// Mostramos el estado actual
		gs.drawMessage(textoEstado);

		// Mostramos las cartas
		for(var i = 0; i < tablero.length ; i++){
			tablero[i].draw(gs, i);
		}
	}	

	this.loop = function(){
		setInterval( this.draw , 16);
	}

	this.onClick = function(cardId){
		// Para comprobar que se ha pulsado una carta y que no ha sido encontrada
		// anteriormente 
		if(tablero[cardId] !== undefined && tablero[cardId].estado !== 2){
			tablero[cardId].flip();
			// Si solo hay una carta levantada
			if(cartaVolteadaActual === undefined){			
				cartaVolteadaActual = cardId;
			}
			else{ // Si es la segunda carta levantada
				if(tablero[cardId].compareTo(tablero[cartaVolteadaActual])){
					textoEstado = "Match found!!";
					tablero[cardId].found();
					tablero[cartaVolteadaActual].found();
					nCartasEncontradas++;
					cartaVolteadaActual = undefined;
					if(nCartasEncontradas === tablero.length/2)
						textoEstado = "You win!!";
				}
				else{
					textoEstado = "Try Again";
					setTimeout(function(){ 					
						tablero[cardId].estado = 0;
						tablero[cartaVolteadaActual].estado = 0;
						cartaVolteadaActual = undefined;
					}, 1000);
				}
				
			}	
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
	this.id = id;
	this.estado = 0;

	this.flip = function(){
		this.estado = 1;		
	}

	this.found = function(){
		this.estado = 2;
	}

	this.compareTo = function(otherCard){
		if(otherCard.id === this.id){
			return true;
		}
		return false;
	}

	this.draw = function(gs, pos){
		switch(this.estado){
				case 0:
					gs.draw("back", pos);
					break;
				case 1:
					gs.draw(id, pos);
					break;
				case 2:
					gs.draw(id, pos);
					break;
			}
	}
};
