import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { Box3, BoxGeometry, Group, Mesh, MeshStandardMaterial, Texture, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWorkspace } from '../src/scene.ts';

test('work surface uses metres, lies at y=0 and releases its resources', () => {
  const workspace = createWorkspace();
  const table = workspace.scene.getObjectByName('workbench');
  assert.ok(table instanceof Mesh);
  const bounds = new Box3().setFromObject(table);
  const size = bounds.getSize(new Vector3());
  assert.ok(Math.abs(size.x - 2) < 1e-6);
  assert.ok(Math.abs(size.z - 2) < 1e-6);
  assert.ok(Math.abs(bounds.max.y) < 1e-6);
  let disposed = false;
  table.geometry.addEventListener('dispose', () => { disposed = true; });
  workspace.dispose();
  assert.equal(disposed, true);
  assert.equal(workspace.scene.children.length, 0);
});

test('the exported valve keeps its size and orientation and rests at the centre without its backdrop', async () => {
  const bytes = await readFile(new URL('../vlv.glb', import.meta.url));
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const model = gltf.scene.getObjectByName('Electroválvula_567200')!;
  assert.ok(model);
  const originalSize = new Box3().setFromObject(model).getSize(new Vector3());
  const rotation = model.quaternion.clone();
  const scale = model.scale.clone();
  const workspace = createWorkspace();
  assert.equal(workspace.addValve(gltf.scene), true);
  const bounds = new Box3().setFromObject(model);
  assert.ok(bounds.getSize(new Vector3()).distanceTo(originalSize) < 1e-8);
  assert.ok(Math.abs(bounds.min.y) < 1e-8);
  const center = bounds.getCenter(new Vector3());
  assert.ok(Math.abs(center.x) < 1e-8 && Math.abs(center.z) < 1e-8);
  assert.ok(model.scale.equals(scale));
  assert.ok(model.quaternion.equals(rotation));
  assert.equal(workspace.scene.getObjectByName('Fondo'), undefined);
  workspace.dispose();
});

test('shared valve and backdrop resources are released once, including loads after disposal', () => {
  for (const late of [false, true]) {
    const workspace = createWorkspace();
    const root = new Group();
    const model = new Group();
    model.name = 'Electroválvula_567200';
    const geometry = new BoxGeometry(0.1, 0.1, 0.1);
    const texture = new Texture();
    const material = new MeshStandardMaterial({ map: texture });
    model.add(new Mesh(geometry, material));
    const backdropGeometry = new BoxGeometry(1, 0.01, 1);
    root.add(model, new Mesh(geometry, material), new Mesh(backdropGeometry, material));
    const counts = [0, 0, 0, 0];
    [geometry, material, texture, backdropGeometry].forEach((resource, index) => {
      resource.addEventListener('dispose', () => { counts[index]++; });
    });
    if (late) workspace.dispose();
    assert.equal(workspace.addValve(root), !late);
    if (!late) assert.deepEqual(counts, [0, 0, 0, 0]);
    workspace.dispose();
    workspace.dispose();
    assert.deepEqual(counts, [1, 1, 1, 1]);
    assert.equal(workspace.scene.children.length, 0);
  }
});

test('an invalid model releases its resources and leaves the table available', () => {
  const workspace = createWorkspace();
  const root = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
  let released = false;
  root.geometry.addEventListener('dispose', () => { released = true; });
  assert.throws(() => workspace.addValve(root), /no contiene/);
  assert.equal(released, true);
  assert.ok(workspace.scene.getObjectByName('workbench'));
  workspace.dispose();
});
