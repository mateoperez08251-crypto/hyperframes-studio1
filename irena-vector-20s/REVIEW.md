# Revisión — prueba vectorial de Irena, 20 s

Se eligió la guía nueva de ilustración SVG por capas del directorio skill.
Se adaptaron su paleta, cel shading, geometría redondeada, luces de borde y
parallax a la historia de Irena. Se mantienen los humanos y los objetos de
esta narración; no se trasladó al relato histórico el ejemplo nuclear.

## Imagen y movimiento

Se revisaron capturas de 0 / 2,8 / 5,4 / 7 / 9,8 / 10,6 / 11,8 / 14,6 /
16,4 / 18,8 / 19,8 s, la hoja de beats, la de teléfono y las tres secuencias
a ambos lados de los cambios de escena. La luz llena el encuadre entre la
calle y el retrato; el muro de primer plano conduce a la aparición de Irena.
El único corte directo coincide con el paso de su nombre al año 1940.

Correcciones realizadas:

- Calle: recorte de los adoquines al plano del suelo y apagado de ventanas
  en «oscuras»; comprobado de nuevo a 3,6 s.
- Muro: base continua de mortero para eliminar transparencias entre ladrillos.
- Familias: expresiones de preocupación al cerrarse la verja y niños acercándose
  a los adultos. Se abre espacio entre barrotes para conservar rostros legibles.
- Localización: fondo sólido detrás de Varsovia / Polonia; Polonia se mantiene
  más de 2 s y se acentúa al pronunciarse.
- Nombre y año: llegadas ajustadas a los tiempos de voz, en vez de iniciar
  todo el movimiento sobre la sílaba y terminarlo tarde.

Las capturas finales a 3,6 / 9,9 / 11,5 / 16,2 / 18,8 s comprobaron estos cambios.
Lint, runtime, layout, contraste y craft pasan sin errores ni advertencias.
Los grupos que salen deliberadamente del cuadro para parallax o transiciones
llevan data-layout-allow-overflow en el elemento gráfico correspondiente.

## Audio

Fragmento 0–19,08 s del narrador original, sin cambiar el tempo. La frase
termina en «Polonia» y el último segundo permite cerrar visualmente.
Se reutilizan los tiempos existentes de la narración, con corte verificado
mediante los silencios de la grabación. Música al 16 %; 16 efectos concretos.

Los efectos principales se normalizan individualmente y tienen más nivel
que en la prueba anterior: verja, cambio de plano, papel, apoyos y cerradura.
Los picos se miden después del procesado. El sonido se mide, no se escucha.
verification.json contiene nivel de mezcla, pico verdadero, duración, frames,
correlación del narrador con la mezcla y relaciones RMS de efectos frente a voz.

## Límite de esta prueba

El plano del gueto es general: los adultos se reconocen mejor que los niños
en un teléfono. En una versión larga convendría añadir un plano de manos y
rostros antes del cierre. Esta entrega prioriza comprobar el estilo completo
en 20 s. El retrato y la calle son ilustrativos; no se presentan como documento
fotográfico ni como reconstrucción exacta de una calle histórica.
