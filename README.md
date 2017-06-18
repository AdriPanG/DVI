![alt text](https://github.com/AdriPanG/DVI/blob/master/NuclearBall/images/Title.png "Nuclear Ball")

# Descripción

NuclearBall es un juego basado en Tigerball, un juego creado para dispositivos móviles
Android e Ios (aunque en nuestro caso esta programado en HTML5 y para todos aquellos dispositivos que lo
soporten), que consiste en introducir una pelota saltarina en un cuenco a través de diferentes
niveles.

El objetivo del jugador es introducir la pelota en un barril en cada uno de los 10 niveles al
primer intento y pasar al siguiente nivel o, si fallas, perder una vida. Al empezar el juego podrás
seleccionar la pelota que quieras de las disponibles. También tendrás una bomba para pasarte
un nivel si te quedas atascado, y una moneda especial que aparece después de gastar todas las
vidas con un 50% de probabilidad de tener un lanzamiento extra o no.

# Ambientación

Donald Trump ha encontrado unos barriles de uranio y plutonio, con los cuales pretende crear
una nueva bomba nuclear e iniciar una Tercera Guerra Mundial. Un pequeño grupo de
mexicanos ha encontrado estas instalaciones y su objetivo es sabotear dichos barriles con una
pelota, hecha con un material especial, que destruye el uranio y el plutonio. Para evitar que
esto ocurra, Donald Trump los ha escondido en diferentes sitios y protegido con trampas, por lo
que los mexicanos deberán eliminar los barriles sorteando los obstáculos para evitar la
creación de esta nueva arma.

# Principales mecánicas

#### Escenario

El escenario donde transcurre el juego está formado por diez niveles de
dificultad. Los niveles se recorren de manera secuencial: una vez se introduzca la pelota en
el barril se pasa al siguiente nivel. Una vez superado el ultimo nivel se muestra la
puntuación final.

#### Niveles

Los niveles son bidimensionales a nivel lógico. Cada uno de ellos está construido
por una sala cerrada, de tamaño y forma fija. Cada nivel pasa al siguiente una vez
completado el mismo. Los 5 primeros niveles tendrán una ambientación, obstáculos y
dificultad determinada, y los siguientes 5 otra distinta.

#### Acción

La pelota (jugador) se puede lanzar al inicio de cada nivel, eligiendo la fuerza y la
dirección, y esta rebota por las paredes u obstáculos hasta introducirse en el barril (y 
pasar el nivel), detenerse por completo (y perder una vida) o destruirse con ciertos
obstáculos (perdiendo también una vida).

### Obstáculos

Los niveles presentan una serie de obstáculos haciendo que cada vez sea
más difícil superarlos. Hay obstáculos en los que rebota la pelota y otros que la
destruyen. Además, algunos obstáculos se mueven y/o rotan.

#### Bomba

Existe una bomba disponible para todo el juego, la cual, una vez seleccionada,
permite pasar ese nivel si el jugador se queda atascado.

####  Moneda

Cuando se pierden todas las vidas aparece una moneda con un 50% de
probabilidad de tener un intento extra para completar el nivel y pasar al siguiente sin vidas
y sin que vuelva a aparecer esta moneda.

#### Puntuación

En cada nivel se obtiene una puntuación en concreto, que se va sumando a
la puntuación total. Esta puntuación dependerá del número de rebotes que dé la pelota
(cuantos más rebotes mayor puntuación se obtendrá).


# Puedes probar los juegos en:

 - [Nuestra web de GitHub](https://adripang.github.io/DVI/)
