import { AmbientLight, BoxGeometry, Color, DirectionalLight, GridHelper, Mesh, MeshStandardMaterial, Scene } from 'three';
import type { Object3D } from 'three';
import { prepareValve } from './valve.ts';

export function createWorkspace() {
  let disposed = false;
  let valve: ReturnType<typeof prepareValve> | undefined;
  const scene = new Scene();
  scene.background = new Color('#e8edf0');

  const geometry = new BoxGeometry(2, 0.08, 2);
  const material = new MeshStandardMaterial({ color: '#687d86', roughness: 0.85 });
  const table = new Mesh(geometry, material);
  table.name = 'workbench';
  table.position.y = -0.04;
  scene.add(table);

  const grid = new GridHelper(2, 20, '#305766', '#a6bac2');
  grid.position.y = 0.001;
  scene.add(grid);

  scene.add(new AmbientLight('#ffffff', 2));
  const light = new DirectionalLight('#ffffff', 3);
  light.position.set(3, 5, 2);
  scene.add(light);

  return {
    scene,
    addValve(root: Object3D) {
      const next = prepareValve(root);
      if (disposed) {
        next.dispose();
        return false;
      }
      valve?.model.removeFromParent();
      valve?.dispose();
      valve = next;
      scene.add(valve.model);
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      valve?.dispose();
      geometry.dispose();
      material.dispose();
      grid.dispose();
      scene.clear();
    },
  };
}
