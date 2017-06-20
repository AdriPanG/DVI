![alt text](https://github.com/AdriPanG/DVI/blob/master/NuclearBall/images/Title.png "Nuclear Ball")

# Descripción

NuclearBall es un juego basado en [Tigerball](https://play.google.com/store/apps/details?id=com.Laxarus.TigerBall&hl=es), un juego creado para dispositivos móviles Android e Ios (aunque en nuestro caso esta programado en HTML5 y para todos aquellos dispositivos que lo soporten), que consiste en introducir una pelota saltarina en un cuenco a través de diferentes niveles.

El **objetivo** del jugador es introducir la pelota en un barril en cada uno de los 10 niveles al primer intento y pasar al siguiente nivel o, si fallas, perder una vida. Al empezar el juego puedes seleccionar la pelota que quieras de las disponibles. También tienes una bomba para pasarte un nivel si te quedas atascado, y una moneda especial que aparece después de gastar todas las vidas, con un 50% de probabilidad de tener un lanzamiento extra o no.

**El juego finaliza** cuando el jugador supera los diez niveles o cuando pierde todas las vidas.

# Ambientación

Donald Trump ha encontrado unos barriles de uranio y plutonio, con los cuales pretende crear una nueva bomba nuclear e iniciar una Tercera Guerra Mundial. Un pequeño grupo de mexicanos ha encontrado estas instalaciones y su objetivo es sabotear dichos barriles con una pelota, hecha con un material especial, que destruye el uranio y el plutonio. Para evitar que esto ocurra, Donald Trump los ha escondido en diferentes sitios y protegido con trampas, por lo que los mexicanos deberán eliminar los barriles sorteando los obstáculos para evitar la creación de esta nueva arma.

# Principales mecánicas

### Acción

La pelota (jugador) se puede lanzar al inicio de cada nivel, eligiendo la fuerza y la dirección. Ésta rebota por las paredes u obstáculos hasta introducirse en el barril (y pasar el nivel), destruirse con ciertos obstáculos (perdiendo una vida) o hasta que se pulse el botón de reintentar (perdiendo también una vida).


### Escenario

El escenario donde transcurre el juego está formado por diez niveles de dificultad. Los niveles se recorren de manera secuencial: una vez se introduzca la pelota en el barril se pasa al siguiente nivel. Una vez superado el ultimo nivel se muestra la puntuación final.

### Niveles

Los niveles son bidimensionales a nivel lógico. Cada uno de ellos está construido por una sala cerrada, de tamaño y forma fija. Cada nivel pasa al siguiente una vez completado el mismo. Los 5 primeros niveles tendrán una ambientación, obstáculos y
dificultad determinada, y los siguientes 5 otra distinta.

### Obstáculos

Los niveles presentan una serie de obstáculos haciendo que cada vez sea más difícil superarlos. Hay obstáculos en los que rebota la pelota y otros que la destruyen. Además, algunos obstáculos se mueven y/o rotan.

### Bomba

Existe una bomba disponible para todo el juego la cual, una vez seleccionada, permite pasar al siguiente nivel si el jugador se queda atascado.

###  Moneda

Cuando se pierden todas las vidas aparece una moneda con un 50% de probabilidad de tener un intento extra para completar el nivel y pasar al siguiente sin vidas y sin que vuelva a aparecer esta moneda.

### Puntuación

En cada nivel se obtiene una puntuación en concreto, que se va sumando a la puntuación total. Esta puntuación dependerá del número de rebotes que dé la pelota (cuantos más rebotes mayor puntuación se obtendrá).

# Implementación

Para implementar el juego se han utilizado las librerias de [Quintus](http://www.html5quintus.com/) y [Box2D](http://box2d.org/), utilizando los lenguajes de programación HTML5 y JavaScript. 

Se han modificado partes de las librerias anteriormente mencionadas y se ha creado toda la lógica en el archivo "NuclearBall.js". En este ultimo se han utilizado una serie de componentes:

### Sprites

En esta parte se incluyen los Sprites utilizados para crear la pelota, paredes, cajas, obstáculos y la moneda. Para ello se ha utilizado la librería Pyshics de Quintus que se apoya en la libreria Box2D, con la que se controlan todos los rebotes de la pelota y las físicas del juego.

En esta parte también se han incluido animaciones para las explosiones, rotación de la moneda y uso de la bomba.

### Escenas

En esta parte se han creado las escenas (menus) para cada condición del juego: cuando se pierde una o todas las vidas y cuando se acaba el juego (ganando o perdiendo) .

Tambien se han utilizado escenas para el HUD, que muestra las vidas disponibles, el nivel actual, la puntuación, la bomba y la opcion de reintentar. 

Por ultimo se han creado escenas para los niveles y las pantallas de créditos.

### Input

Se han sobreescrito las entradas del ratón y el control táctil para controlar el lanzamiento de la pelota, utilizando la distancia euclídea para calcular la dirección y la potencia en función de la posición del ratón.

#  Equipo de trabajo:

### Adrián Panadero Gonzalez

Se ha encargado de la implementación del jugador, puntuación, vidas, niveles, búsqueda de recursos y realización del vídeo del gameplay. (Carga de trabajo: 40%)

### Juan José Prieto Escolar

Se ha encargado de la implementación del jugador, bomba, moneda, lógica del juego, recursos gráficos, animaciones y sonidos. (Carga de trabajo: 60%)

# Referencias

Para la realización del proyecto se han utilizado los siguientes recursos:

### Librerías

* [Quintus](http://www.html5quintus.com/)
* [Box2D](http://box2d.org/)

### Recursos gráficos

* [Balls - por jousway](http://jousway.deviantart.com)
* [Background, walls, boxes and obstacles - por Game Art 2d](http://www.gameart2d.com)
* [Direction arrow - por Nallebeorn](https://opengameart.org/users/nallebeorn)
* [Bomba - por richtaur](https://opengameart.org/users/richtaur)
* [Explosión en barril - por Cuzco](https://opengameart.org/users/cuzco)
* [Explosión verde en barril - por Daniel Cook](http://hasgraphics.com/8-bit-sinistar-clone-graphics/)
* [Explosión de la pelota - por Osmic](https://opengameart.org/users/osmic)
* [Botones UI (reintentar, cancelar y siguiente) - por GDquest](https://opengameart.org/users/gdquest)
* [Paneles UI - por Hawkadium](https://opengameart.org/users/hawkadium)
* [Fondo botones UI - por Kenney](https://opengameart.org/users/kenney)

### Música y sonidos

* [Música - por Tristan_Lohengrin](https://www.freesound.org/people/Tristan_Lohengrin/)
* [Sonido lanzamiento - por orginaljun](https://www.freesound.org/people/orginaljun/)
* [Explosión de pelota - por cabled_mess](https://www.freesound.org/people/cabled_mess/)
* [Explosión de barril - por cydon](https://www.freesound.org/people/cydon/)
* [Explosión verde de barril - por dragline777](https://www.freesound.org/people/dragline777/)

# Gameplay

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/kRqdO5gZ2QE/0.jpg)](https://www.youtube.com/watch?v=kRqdO5gZ2QE)

# Puedes probar el juego y otros proyectos nuestros en:

 - [Nuestra web de GitHub](https://adripang.github.io/DVI/)
