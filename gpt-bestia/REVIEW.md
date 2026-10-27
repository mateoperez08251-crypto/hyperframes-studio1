# Revisión — ChatGPT es una bestia

Se mantuvo el mecanismo de choques del video de referencia, con 20 segundos.
La versión actual incorpora la voz de 18,181 s entregada por el usuario,
sin cambiar su velocidad. Se eligieron menta, verde y tinta, un cambio a
fondo oscuro y objetos de conversación y código.

Se revisaron las capturas de 0 / 2 / 3,8 / 6 / 8,3 / 11,4 / 14 / 16,8 / 19,3 s,
la hoja de beats y la hoja a 360 px. Los titulares se leen; los objetos no
ocultan las frases. Se amplió el símbolo oficial después de la primera revisión.

La composición se mantiene en una sola escena porque cada frase empuja a la
anterior, como en la referencia. Las capturas automáticas de review no detectan
las tres transiciones internas; por eso se añadieron capturas a ambos lados
de 4,6 / 9,3 / 15,2 s.

Las sacudidas causan desbordamiento intencional de unos pocos píxeles durante
los golpes; los textos en salida se cruzan al abandonar el cuadro. No son
solapamientos sostenidos de contenido que deba leerse.

Punto más débil: los detalles del código son un objeto secundario y no se
leen completos en teléfono; el mensaje principal sí conserva su tamaño.

La mezcla se mide, no se escucha. La verificación final de duración, formato,
loudness y pico verdadero queda registrada en verification.json.

## Corrección por comentario del usuario

El usuario señaló falta de sincronización durante la vista previa. Se midieron
los WAV finales: la tecla estaba a −27,4 dB de pico y los pops cerca de 0 dB,
lo que dejaba golpes visuales prácticamente sin acento audible. Se normalizó
cada muestra por función, se bajó la música y se añadieron graves procesados
a los cuatro golpes principales. Los picos se miden después del cambio de
tono y del recorte, con ventanas RMS de 10 ms, en vez de inferirse del original.
Se ajustaron los efectos de objetos a su asentamiento de 0,38 s. La tabla
audio-sync.json registra golpe visual, inicio de audio y pico objetivo
(un frame después del contacto). La auditoría independiente difiere 5 ms
por usar el inicio de ventana frente al centro; es menor que un frame.

## Narración recibida e incorporada

Se transcribió la voz en Colab con Whisper small en español y GPU. El audio
incluye la repetición «Sí. Solo. Con. Código» y el cierre «Esto es ChatGPT»;
se añadieron ambos momentos visuales. Los comienzos de «Es» y «una» se
refinaron con los silencios de la grabación. La voz empieza a 0,35 s y termina
a 18,531 s, sin acelerarla ni recortar el diálogo.

Las capturas nuevas a 0 / 1,2 / 3,25 / 4,9 / 7,6 / 8,8 / 11,4 / 12,8 /
14,7 / 16 / 18,5 / 19,9 s verifican los seis actos. Se revisaron también
las hojas automáticas de beats y de teléfono. Se bajó 45 px el bloque de
repetición para separarlo del logo y se comprobaron 11,4 y 12,8 s de nuevo.

Lint y check pasan sin errores ni advertencias; queda una observación
informativa por la sacudida de cámara durante un golpe. Música al 10 %,
efectos reducidos frente a la narración y remate visual hasta los 20 s.
Los tiempos fonéticos son estimaciones revisadas, no una garantía de
precisión de un fotograma. La correlación del archivo de voz completo contra
el MP4 final comprueba su posición en la mezcla; la tolerancia es 1 frame.
Resultados en verification-voz.json y voice-sync-verification.json.
