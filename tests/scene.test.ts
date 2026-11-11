import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Box3, Mesh, Vector3 } from 'three';
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
