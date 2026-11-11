import { PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWorkspace } from './scene.ts';
import './style.css';

const viewport = document.querySelector<HTMLDivElement>('#viewport')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset-camera')!;

function start() {
  let disposed = false;
  const renderer = new WebGLRenderer({ antialias: true });
  const workspace = createWorkspace();
  const camera = new PerspectiveCamera(45, 1, 0.01, 100);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label', 'Vista 3D de la mesa de trabajo vacía');
  viewport.append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.4;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI / 2 - 0.01;
  controls.listenToKeyEvents(renderer.domElement);

  const render = () => renderer.render(workspace.scene, camera);
  const reset = () => {
    camera.position.set(2.5, 2.2, 2.5);
    controls.target.set(0, 0, 0);
    controls.update();
    render();
  };
  const resize = () => {
    const { width, height } = viewport.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
  };
  controls.addEventListener('change', render);
  resetButton.addEventListener('click', reset);
  const observer = new ResizeObserver(resize);
  observer.observe(viewport);
  resize();
  reset();
  status.textContent = 'Cargando la válvula…';
  void new GLTFLoader().loadAsync(new URL('../vlv.glb', import.meta.url).href)
    .then((gltf) => {
      if (!workspace.addValve(gltf.scene)) return;
      renderer.domElement.setAttribute('aria-label', 'Vista 3D de la mesa de trabajo con una electroválvula');
      status.textContent = 'Electroválvula cargada a escala original. Vista visual, sin simulación física. Usa el zoom para ver los detalles.';
      render();
    })
    .catch((error: unknown) => {
      if (disposed) return;
      status.setAttribute('role', 'alert');
      status.textContent = 'No se pudo cargar la válvula. La mesa sigue disponible; recarga la página para intentarlo de nuevo.';
      console.error(error);
    });

  return () => {
    disposed = true;
    observer.disconnect();
    resetButton.removeEventListener('click', reset);
    controls.removeEventListener('change', render);
    controls.dispose();
    workspace.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

try {
  const dispose = start();
  import.meta.hot?.dispose(dispose);
} catch (error) {
  status.setAttribute('role', 'alert');
  status.textContent = 'No se pudo iniciar la vista 3D. Comprueba que tu navegador admita WebGL 2 y tenga la aceleración gráfica habilitada.';
  resetButton.disabled = true;
  console.error(error);
}
