# Guía para agentes

## Proyecto

Neudralica es una mesa de trabajo 3D para visualizar componentes de hidráulica y neumática: válvulas, compresores, manómetros y mangueras. La base actual muestra una mesa vacía con cámara orbital. No incluye catálogo, conexiones funcionales, persistencia ni simulación física.

Esta es la fuente central de instrucciones para Codex, Antigravity y Claude Code. Mantén las reglas aquí; `CLAUDE.md` únicamente importa este archivo. No dupliques instrucciones por agente.

## Tecnología y estructura

- Usa TypeScript estricto, módulos ES, HTML/CSS nativos, Three.js y Vite. Node.js 24 y npm son la base de desarrollo.
- `src/main.ts` conecta el DOM, renderer y controles; `src/scene.ts` construye la escena y libera recursos; `src/style.css` contiene estilos; `tests/` usa el runner nativo de Node.
- Reutiliza código existente y addons de Three.js. Justifica cada dependencia nueva por una necesidad concreta. Versiona `package-lock.json` cuando cambien dependencias.
- Mantén cambios pequeños. No introduzcas frameworks, abstracciones, registros o plugins para necesidades futuras.
- Escribe documentación e interfaz en español e identificadores de código en inglés.

## Arquitectura: simulación y render

La separación entre lógica de simulación y representación visual es obligatoria al incorporar comportamiento físico:

- **Simulación:** contiene el estado físico, las reglas y los cálculos en TypeScript. No depende de Three.js, del DOM ni de WebGL.
- **Render:** contiene la escena, cámara, modelos y controles visuales. Lee el estado recibido para representarlo; no calcula física ni modifica directamente el estado de simulación.
- **Coordinación:** conecta las acciones del usuario con la simulación y entrega el estado resultante al render. Los movimientos de cámara no alteran el estado físico.
- **Datos compartidos:** usa tipos independientes de Three.js para comunicar acciones y estado. No almacenes objetos gráficos dentro del estado físico.
- **Tiempo:** la simulación avanza con un intervalo explícito en segundos. Su evolución no debe depender de la frecuencia de renderizado ni usar el número de fotogramas como reloj.
- **Verificación:** la lógica de simulación debe poder probarse en Node sin navegador ni GPU.

La estructura descrita arriba corresponde al código actual. Introduce `src/simulation/` y `src/rendering/` cuando implementes esta separación; no crees carpetas vacías ni un motor físico anticipado.

## Convenciones 3D

- Una unidad equivale a un metro. Y es vertical; la superficie de trabajo está en el plano XZ, con su cara superior en Y = 0.
- La mesa inicial mide 2 × 2 metros; cada celda mide 0.1 metros.
- No inventes presiones, caudales ni propiedades técnicas; documenta unidades y fuentes cuando se incorporen.
- No presentes una animación como simulación física validada.
- Libera geometrías, materiales, texturas, controles y eventos cuando dejen de utilizarse. No liberes recursos compartidos mientras otro objeto los use.
- Renderiza cuando cambie la vista. Añade un bucle continuo solo para animaciones; no crees recursos gráficos dentro de ese bucle.
- Conserva el redimensionamiento y el mensaje de fallo gráfico. Los controles HTML deben ser accesibles por teclado y tener etiquetas claras.

## Agregar un componente

1. Define función, dimensiones, unidades y referencias técnicas o visuales. Aclara si el alcance es solo visual.
2. Define por separado el comportamiento de simulación y la representación visual, conectados mediante datos independientes de Three.js. Si el alcance es solo visual, no inventes comportamiento físico.
3. Reutiliza patrones existentes. Crea la representación a escala y con orientación coherente; crea carpetas solo cuando tengan contenido real.
4. Documenta puntos de conexión cuando correspondan: posición local, orientación y función. No implementes un sistema de conexiones hasta que se solicite.
5. Comprueba apariencia, escala, posición y liberación de recursos. Registra procedencia y licencia de modelos o texturas externos.
6. Añade una prueba pequeña para lógica nueva de comportamiento; ejecuta las pruebas de simulación sin navegador ni GPU. Actualiza README cuando cambien capacidades o comandos.

No existe aún un contrato público para componentes. Define tipos compartidos cuando una funcionalidad concreta los necesite.

## Verificación y entrega

- Instala dependencias reproducibles con `npm ci`.
- Ejecuta `npm test` y `npm run build`. El build comprueba tipos; `npm run typecheck` lo hace por separado.
- Para cambios visuales, comprueba `npm run dev` en navegador: escena, giro, zoom, desplazamiento, restablecimiento, teclado y redimensionamiento. Comprueba `npm run preview` después de compilar.
- Añade pruebas proporcionadas al riesgo usando el runner nativo antes de incorporar otro. Evita pruebas que solo repitan constantes sin comprobar comportamiento.
- No reviertas cambios del usuario ni modifiques archivos ajenos a la tarea. Conserva la licencia. No versiones dependencias, compilados ni secretos.
- Al entregar, indica cambios, comprobaciones y limitaciones. Nunca declares ejecutada una prueba que no ejecutaste.
