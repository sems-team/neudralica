# Neudralica

Mesa de trabajo 3D para visualizar componentes de hidráulica y neumática en el navegador, construida con **Three.js, TypeScript y Vite**, sin framework de interfaz.

La mesa mide 2 × 2 metros e incluye cuadrícula de 10 cm, iluminación, cámara orbital y una electroválvula cargada desde `vlv.glb`. La válvula se muestra a la escala y orientación exportadas, centrada y apoyada sobre la superficie, sin el objeto «Fondo» del archivo. Su alcance es únicamente visual: no incluye conexiones, persistencia ni simulación física. Las dimensiones exportadas no se han contrastado con una ficha técnica.

## Requisitos

- **Node.js 24**, con **npm** incluido. Descarga la rama 24 desde [Node.js](https://nodejs.org/en/download).
- Navegador moderno con WebGL 2 y aceleración gráfica habilitada.

Si ya utilizas [nvm](https://github.com/nvm-sh/nvm), desde la raíz del repositorio ejecuta:

```sh
nvm install
nvm use
```

`.nvmrc` selecciona Node.js 24. Comprueba la instalación:

```sh
node --version
npm --version
```

No necesitas instalar TypeScript ni Vite globalmente; npm instala sus versiones locales.

## Instalación y ejecución

Desde la raíz del repositorio:

```sh
npm ci
npm run dev
```

Abre la dirección que indique Vite, normalmente `http://localhost:5173`. Detén el servidor con `Ctrl+C`.

`npm ci` instala las versiones de `package-lock.json`. Usa `npm install` para modificar dependencias y versiona el lockfile actualizado.

## Comprobación y compilación

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

- `npm test`: comprueba la mesa, la carga del GLB real, su colocación y la liberación de recursos, incluidas cargas tardías y modelos inválidos, con el runner nativo de Node, sin navegador ni GPU.
- `npm run typecheck`: comprueba TypeScript sin generar archivos.
- `npm run build`: comprueba tipos y genera el sitio estático en `dist/`.
- `npm run preview`: sirve la compilación local, normalmente en `http://localhost:4173`. No es un servidor de producción.

Para publicar, sirve `dist/` mediante alojamiento estático. Este repositorio no configura despliegue automático.

## Uso

- Arrastra con el botón izquierdo para girar.
- Usa la rueda para acercar o alejar.
- Arrastra con el botón derecho para desplazar.
- Enfoca la vista con Tab y usa las flechas para desplazar la cámara.
- Pulsa **Restablecer cámara** para volver a la vista inicial.

La válvula conserva su tamaño exportado; usa el zoom para examinarla. Durante la carga se muestra su estado. Si falla, la mesa sigue disponible y puedes recargar la página para reintentar.

En pantallas táctiles, usa un dedo para girar y dos para acercar o desplazar. La vista se adapta al tamaño disponible.

## Organización y agentes

```text
index.html       Interfaz y entrada
src/main.ts      Renderer, cámara, controles y DOM
src/scene.ts     Mesa, cuadrícula, luces y limpieza
src/valve.ts     Colocación de la válvula y liberación de recursos del GLB
src/style.css    Estilos
tests/           Comprobaciones de escena
AGENTS.md        Convenciones y flujo para agregar componentes
CLAUDE.md        Importación de instrucciones compartidas
```

Lee [AGENTS.md](AGENTS.md) antes de modificar el proyecto. Incluye el flujo mínimo para agregar componentes, unidades y reglas de mantenimiento. No fija todavía un motor físico ni un contrato de conexiones.

El recurso `vlv.glb` fue proporcionado con el proyecto y exportado desde Blender. No se descargaron modelos ni texturas externos. La procedencia y licencia del modelo no se han verificado; la licencia del código no acredita por sí sola los derechos sobre el recurso.

[Codex](https://learn.chatgpt.com/docs/agent-configuration/agents-md) y [Antigravity](https://antigravity.google/docs/rules/) admiten `AGENTS.md` en la raíz. Para [Claude Code](https://code.claude.com/docs/en/memory), `CLAUDE.md` importa `@AGENTS.md`, también útil para versiones sin carga nativa. Abre los agentes desde la raíz y comprueba las instrucciones cargadas; las políticas locales pueden afectar su lectura.

Dependencias directas: `three` en ejecución y `typescript`, `vite`, `@types/three` en desarrollo. Los controles orbitales forman parte de los addons de Three.js.

## Licencia

Consulta [LICENSE](LICENSE).
