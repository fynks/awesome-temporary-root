export function normalize(text) {
  return text.trim().toLowerCase();
}

/**
 * Builds a lookup index once per dataset so checks are O(1) per field
 * instead of re-normalizing every string on every query.
 */
export function buildIndex(devices) {
  const byModel = new Map(); // normalized model string -> [{ device, record }]
  const models = new Set();
  const firmwares = new Set();
  const kernels = new Set();

  for (const device of devices) {
    const modelKeys = [...device.modelNumbers, ...device.aliases, ...device.codenames].map(normalize);

    for (const record of device.compatibilityRecords) {
      const entry = { device, record };
      for (const key of modelKeys) {
        if (!byModel.has(key)) byModel.set(key, []);
        byModel.get(key).push(entry);
      }
      if (record.firmware) firmwares.add(normalize(record.firmware));
      if (record.kernel) kernels.add(normalize(record.kernel));
    }

    for (const key of modelKeys) models.add(key);
  }

  return { byModel, anyField: { models, firmwares, kernels } };
}

export function checkCompatibility(devices, modelInput, firmwareInput, kernelInput) {
  if (!devices.__compatIndex) devices.__compatIndex = buildIndex(devices);
  const { byModel, anyField } = devices.__compatIndex;
  const model = normalize(modelInput);
  const firmware = normalize(firmwareInput);
  const kernel = normalize(kernelInput);

  // 1. Exact match: candidates pre-grouped by model
  for (const entry of byModel.get(model) || []) {
    const { record } = entry;
    const recFirmware = record.firmware ? normalize(record.firmware) : '';
    const recKernel = record.kernel ? normalize(record.kernel) : '';
    if (recFirmware === firmware && recKernel === kernel) {
      return { type: 'exact_match', device: entry.device, record, status: record.status };
    }
  }

  // 2. Partial match: deduped membership checks against sets
  const matchedFields = [];
  if (anyField.models.has(model)) matchedFields.push('Model');
  if (anyField.firmwares.has(firmware)) matchedFields.push('Firmware');
  if (anyField.kernels.has(kernel)) matchedFields.push('Kernel');

  if (matchedFields.length > 0) {
    return { type: 'partial_match', matchedFields };
  }

  // 3. No match
  return { type: 'no_match' };
}
