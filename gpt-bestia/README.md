# ChatGPT es una bestia — con voz

Video 1920×1080, 30 fps, 20 s. La narración original dura 18,181 s y
se reproduce a velocidad natural desde 0,35 s.

- Entrega: chatgpt-bestia-20s-con-voz.mp4.
- Voz y tiempos: assets/voice/ y audio/voice-timing.json.
- Golpes y efectos: audio-sync.json.
- Validación: check-voz.json, verification-voz.json, voice-sync-verification.json.
- Revisión: REVIEW.md.

Regeneración desde el estudio (Node y FFmpeg):

```powershell
node tools/build.cjs
node tools/sync-voice.cjs
npx --yes hyperframes@0.8.193 check --json
```

build.cjs reutiliza los ayudantes de movimiento de ../claude-bestia.
Ejecutar después sync-voice.cjs para conservar el montaje narrado.
El proyecto queda editable en HyperFrames. La versión base sin narrador
se conserva como chatgpt-bestia-20s.mp4 y en backups/sin-voz/.
