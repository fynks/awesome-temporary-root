import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { searchDevices } from '../website/js/device-search.js';
import { searchModules } from '../website/js/module-search.js';
import { loadData } from '../website/js/data.js';

describe('searchDevices', () => {
  const devices = [{
    id: 'd1', manufacturer: 'Samsung', deviceName: 'Galaxy S24',
    modelNumbers: ['SM-S928B'], aliases: [], codenames: [],
    compatibilityRecords: [{ firmware: 'S928BXXS6DZF2', kernel: '6.1.145', androidVersion: '14' }],
  }];

  it('matches by model number case-insensitively', () => {
    assert.equal(searchDevices(devices, 'sm-s928').length, 1);
  });
  it('matches by firmware', () => {
    assert.equal(searchDevices(devices, 'DZF2').length, 1);
  });
  it('matches by kernel', () => {
    assert.equal(searchDevices(devices, '6.1.145').length, 1);
  });
  it('returns nothing on no match or empty query', () => {
    assert.equal(searchDevices(devices, 'pixel').length, 0);
    assert.equal(searchDevices(devices, '').length, 0);
  });
});

describe('searchModules', () => {
  const modules = [{
    name: 'KernelSU', description: 'Kernel-based root', category: 'manager',
    version: '1.0', supportedRootMethods: ['Root My Galaxy'],
  }];

  it('matches by supported root method', () => {
    assert.equal(searchModules(modules, 'my galaxy').length, 1);
  });
  it('matches by description', () => {
    assert.equal(searchModules(modules, 'ROOT').length, 1);
  });
});

describe('loadData', () => {
  // data.js caches in-module state; only the real fetch path is testable here,
  // so verify it surfaces fetch failures rather than silently swallowing them.
  it('rejects when data fetch fails', async () => {
    await assert.rejects(() => loadData());
  });
});
