"""Make named PCM selections; preserve originals and measure processed timing."""
import concurrent.futures
import argparse
import hashlib
import json
import math
import pathlib
import subprocess
import numpy as np

root=pathlib.Path(__file__).resolve().parents[1]
packs={item['pack']:item for item in json.loads((root/'fuentes.json').read_text(encoding='utf8'))}
plan=[]
def add(category,name,pack,filename,description,mode='action'):
    matches=[item for item in packs[pack]['audioFiles'] if pathlib.PurePosixPath(item).name==filename+'.ogg']
    assert len(matches)==1,(pack,filename,matches)
    plan.append({'id':name,'category':category,'original':matches[0],
                 'pack':pack,'description':description,'timingMode':mode})
def impact(name,filename,description): add('impactos',name,'impact-sounds',filename,description,'impact')
def rpg(name,filename,description): add('foley',name,'rpg-audio',filename,description)
for i in range(3):
    add('pasos',f'paso_concreto_{i+1:02}','impact-sounds',f'footstep_concrete_{i:03}','Apoyo del pie sobre suelo duro','impact')
for surface,spanish in [('wood','madera'),('grass','hierba'),('carpet','alfombra')]:
    for i in range(2): add('pasos',f'paso_{spanish}_{i+1:02}','impact-sounds',f'footstep_{surface}_{i:03}',f'Apoyo del pie sobre {spanish}','impact')
for i in range(2): add('pasos',f'paso_mojado_{i+1:02}','100-cc0-sfx-2',f'sfx100v2_footstep_wet_{i+1:02}','Paso sobre superficie mojada','impact')
for i in range(3):
    rpg(f'papel_hoja_{i+1:02}',f'bookFlip{i+1}','Pasar una hoja de libro o calendario')
    rpg(f'ropa_{i+1:02}',f'cloth{i+1}','Movimiento de tela en un gesto')
for name,source,description in [
    ('libro_abrir','bookOpen','Abrir un libro'),('libro_cerrar','bookClose','Cerrar un libro'),
    ('libro_apoyar','bookPlace1','Apoyar un libro sobre una superficie'),
    ('cinturon_mover','beltHandle1','Manipular cinturón o correa'),
    ('maletin_cuero','handleSmallLeather','Manipular cuero; apoyo para maletín'),
    ('cuero_caida','dropLeather','Caída de un objeto de cuero'),
    ('cerrojo_metal','metalLatch','Accionar un cierre metálico'),
    ('clic_metal','metalClick','Clic mecánico metálico'),
    ('madera_cruje_01','creak1','Crujido de material'),('madera_cruje_02','creak2','Otra variación de crujido')]: rpg(name,source,description)
for i in range(2):
    rpg(f'puerta_abrir_{i+1:02}',f'doorOpen_{i+1}','Apertura de puerta')
    rpg(f'puerta_cerrar_{i+1:02}',f'doorClose_{i+1}','Cierre de puerta')
for name,source,description in [
    ('metal_pesado_01','impactMetal_heavy_000','Golpe contra metal pesado'),
    ('metal_pesado_02','impactMetal_heavy_001','Variación de impacto metálico'),
    ('madera_pesada_01','impactWood_heavy_000','Golpe contra madera'),
    ('madera_pesada_02','impactWood_heavy_001','Variación de madera'),
    ('golpe_suave','impactSoft_medium_000','Impacto amortiguado'),
    ('golpe_fuerte_01','impactPunch_heavy_000','Golpe corporal estilizado'),
    ('golpe_fuerte_02','impactPunch_heavy_001','Otra variación de golpe'),
    ('cristal_ligero','impactGlass_light_000','Impacto de vidrio ligero'),
    ('cristal_fuerte','impactGlass_heavy_000','Impacto de vidrio pesado'),
    ('campana','impactBell_heavy_000','Resonancia metálica de campana')]: impact(name,source,description)
for i in range(2): add('impactos',f'piedras_{i+1:02}','100-cc0-sfx-2',f'sfx100v2_stones_{i+1:02}','Movimiento o golpe de piedras','impact')
add('impactos','trueno_01','100-cc0-sfx-2','sfx100v2_thunder_01','Trueno para relámpago o tormenta','impact')
for i in range(2): add('transiciones',f'aire_{i+1:02}','100-cc0-sfx-2',f'sfx100v2_air_{i+1:02}','Desplazamiento de aire; probar como barrido')
for name,source,description in [
    ('expandir','maximize_001','Expansión de elemento'),('contraer','minimize_001','Contracción de elemento')]:
    add('transiciones',name,'interface-sounds',source,description)
for name,source,description in [
    ('clic_01','click_001','Clic de interfaz'),('clic_02','click_002','Otra variación de clic'),('clic_03','click_003','Clic alternativo'),
    ('tick_01','tick_001','Marca breve para dato o punto'),('tick_02','tick_002','Variación de marca'),
    ('seleccionar','select_001','Selección de opción'),('interruptor','switch_001','Cambio de interruptor'),('toggle','toggle_001','Activación de control'),
    ('confirmacion_01','confirmation_001','Confirmación o resultado'),('confirmacion_02','confirmation_002','Variación de confirmación'),
    ('error','error_001','Error de interfaz'),('pregunta','question_001','Interrogación de interfaz'),
    ('glitch_01','glitch_001','Fallo digital'),('glitch_02','glitch_002','Variación de fallo digital'),
    ('scroll','scroll_001','Desplazamiento de interfaz'),('cristal_ui','glass_001','Detalle sonoro de cristal para interfaz'),
    ('abrir_panel','open_001','Abrir panel'),('cerrar_panel','close_001','Cerrar panel')]: add('ui',name,'interface-sounds',source,description)
for name,source,description in [
    ('subida_digital','highUp','Subida tonal electrónica'),('bajada_digital','lowDown','Bajada tonal electrónica'),
    ('powerup_01','powerUp1','Potenciador de juego'),('powerup_02','powerUp2','Otro potenciador'),
    ('salto_01','phaseJump1','Salto electrónico estilizado'),('salto_02','phaseJump2','Variación de salto'),
    ('laser_01','laser1','Disparo láser'),('laser_02','laser2','Variación de láser'),('tres_tonos','threeTone1','Señal de tres tonos')]: add('retro',name,'digital-audio',source,description)
for name,source,description in [
    ('ambiente_abstracto_01','loop_ambient_01','Fondo ambiental abstracto; revisar timbre antes de usar'),
    ('ambiente_abstracto_02','loop_ambient_02','Variación de ambiente abstracto'),
    ('maquina_01','loop_machine_01','Fondo de maquinaria'),('maquina_02','loop_machine_02','Variación de maquinaria'),
    ('agua_01','loop_water_01','Agua en movimiento'),('carretera','loop_highway','Tráfico de carretera; contexto moderno'),
    ('construccion','loop_construction_site','Obra en construcción')]: add('ambientes',name,'100-cc0-sfx-2','sfx100v2_'+source,description,'bed')

targets={'pasos':-8,'foley':-8,'impactos':-6,'transiciones':-10,'ui':-12,'retro':-10,'ambientes':-20}
def convert(item):
    source=root/item['original']
    data=subprocess.check_output(['ffmpeg','-v','error','-i',str(source),'-ac','2','-ar','48000','-f','f32le','pipe:1'])
    wave=np.frombuffer(data,dtype='<f4').reshape(-1,2).astype(np.float64)
    peak=float(np.max(np.abs(wave)))
    assert peak>1e-6,source
    gain=targets[item['category']]-20*math.log10(peak)
    relative=pathlib.Path('seleccion')/item['category']/(item['id']+'.wav')
    target=root/relative; target.parent.mkdir(parents=True,exist_ok=True)
    subprocess.run(['ffmpeg','-v','error','-i',str(source),'-af',f'volume={gain:.8f}dB','-ar','48000','-ac','2','-c:a','pcm_s16le','-y',str(target)],check=True)
    processed=subprocess.check_output(['ffmpeg','-v','error','-i',str(target),'-f','f32le','pipe:1'])
    wave=np.frombuffer(processed,dtype='<f4').reshape(-1,2).astype(np.float64)
    energy=np.mean(wave**2,axis=1)
    window=min(480,len(energy))
    summed=np.convolve(energy,np.ones(window)/window,mode='valid')
    item.update(file=relative.as_posix(),duration=round(len(wave)/48000,6),sampleRate=48000,channels=2,
                peakDbFS=round(20*math.log10(max(float(np.max(np.abs(wave))),1e-10)),3),
                rmsDbFS=round(10*math.log10(max(float(np.mean(energy)),1e-12)),3),
                peak10msSeconds=round((int(np.argmax(summed))+window/2)/48000,6),
                gainAppliedDb=round(gain,4),sha256=hashlib.sha256(target.read_bytes()).hexdigest(),
                source=packs[item['pack']]['source'],author=packs[item['pack']]['author'],license='CC0 1.0')
    assert abs(item['peakDbFS']-targets[item['category']])<.05,item
    return item

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--catalog-only',action='store_true')
    args=parser.parse_args()
    assert len({item['id'] for item in plan})==len(plan)
    if args.catalog_only:
        catalog=json.loads((root/'catalogo.json').read_text(encoding='utf8'))
    else:
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            catalog=list(pool.map(convert,plan))
        (root/'catalogo.json').write_text(json.dumps(catalog,indent=2,ensure_ascii=False),encoding='utf8')
    lines=['# Catálogo de selección WAV','',
           'Mediciones sobre WAV procesado: 48 kHz, estéreo, PCM 16 bits. Picos RMS de ventana de 10 ms.',
           'Selección por etiquetas del autor y verificación técnica; no evaluación auditiva del timbre.','']
    for category in targets:
        lines += ['## '+category,'','| Archivo | Uso candidato | Duración s | Pico 10 ms s | Pico dBFS | RMS dBFS |','|---|---|---:|---:|---:|---:|']
        for item in catalog:
            if item['category']==category:
                lines.append(f"| [{item['id']}]({item['file']}) | {item['description']} | {item['duration']:.3f} | {item['peak10msSeconds']:.3f} | {item['peakDbFS']:.1f} | {item['rmsDbFS']:.1f} |")
        lines.append('')
    (root/'CATALOGO.md').write_text('\n'.join(lines),encoding='utf8')
    print(json.dumps({'selected':len(catalog),'categories':{cat:sum(x['category']==cat for x in catalog) for cat in targets},'allDecoded':True},indent=2))
