import { Box3, Mesh, Texture, Vector3 } from 'three';
import type { BufferGeometry, Material, Object3D } from 'three';

export function prepareValve(root: Object3D) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof Texture) textures.add(value);
      }
    }
  });
  const dispose = () => {
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures) {
      const image = texture.source.data;
      if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) image.close();
      texture.dispose();
    }
    geometries.clear();
    materials.clear();
    textures.clear();
  };

  const model = root.getObjectByName('Electroválvula_567200');
  if (!model) {
    dispose();
    throw new Error('El GLB no contiene el grupo Electroválvula 567200.');
  }
  model.removeFromParent();
  const bounds = new Box3().setFromObject(model);
  const center = bounds.getCenter(new Vector3());
  model.position.x -= center.x;
  model.position.y -= bounds.min.y;
  model.position.z -= center.z;
  return { model, dispose };
}
