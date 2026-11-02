import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, checkCompatibility } from '../website/js/compatibility.js';

const devices = [
  {
    id: 'test-device',
    manufacturer: 'Samsung',
    deviceName: 'Galaxy Test',
    modelNumbers: ['SM-T100'],
    aliases: ['GalaxyT'],
    codenames: ['t100'],
    compatibilityRecords: [
      {
        id: 'rec-1',
        firmware: 'T100XXU1AAAA',
        kernel: '6.1.100',
        status: 'tested',
        evidence: [],
        notes: [],
      },
      {
        id: 'rec-2',
        firmware: 'T100XXU1BBBB',
        kernel: '6.6.30',
        status: 'experimental',
        evidence: [],
        notes: [],
      },
    ],
  },
];

describe('normalize', () => {
  it('trims and lowercases', () => {
    assert.equal(normalize('  SM-T100 '), 'sm-t100');
    assert.equal(normalize('KERNEL 6.1'), 'kernel 6.1');
  });
});

describe('checkCompatibility', () => {
  it('returns exact_match on model + firmware + kernel', () => {
    const result = checkCompatibility(devices, 'SM-T100', 'T100XXU1AAAA', '6.1.100');
    assert.equal(result.type, 'exact_match');
    assert.equal(result.record.id, 'rec-1');
    assert.equal(result.status, 'tested');
  });

  it('matches model via alias or codename', () => {
    const viaAlias = checkCompatibility(devices, ' galaxyt ', 'T100XXU1BBBB', '6.6.30');
    const viaCodename = checkCompatibility(devices, 'T100', 'T100XXU1BBBB', '6.6.30');
    assert.equal(viaAlias.type, 'exact_match');
    assert.equal(viaCodename.type, 'exact_match');
    assert.equal(viaCodename.status, 'experimental');
  });

  it('matching model alone yields partial_match', () => {
    const result = checkCompatibility(devices, 'SM-T100', 'XXX', '1.0.0');
    assert.equal(result.type, 'partial_match');
    assert.deepEqual(result.matchedFields, ['Model']);
  });

  it('matching firmware alone yields partial_match', () => {
    const result = checkCompatibility(devices, 'XXX', 't100xxu1aaaa', '1.0.0');
    assert.equal(result.type, 'partial_match');
    assert.deepEqual(result.matchedFields, ['Firmware']);
  });

  it('matching kernel alone yields partial_match', () => {
    const result = checkCompatibility(devices, 'XXX', 'XXX', '6.1.100');
    assert.equal(result.type, 'partial_match');
    assert.deepEqual(result.matchedFields, ['Kernel']);
  });

  it('returns no_match with nothing familiar', () => {
    const result = checkCompatibility(devices, 'SM-Z999', 'ZZZ', '0.0.1');
    assert.equal(result.type, 'no_match');
  });

  it('handles records with missing fields', () => {
    const partial = [{
      id: 'd2', manufacturer: 'X', deviceName: 'X', modelNumbers: ['M1'],
      aliases: [], codenames: [],
      compatibilityRecords: [{ id: 'r1', status: 'unknown', firmware: '', kernel: null, evidence: [], notes: [] }],
    }];
    assert.equal(checkCompatibility(partial, 'M1', 'A', 'B').type, 'partial_match');
  });
});
