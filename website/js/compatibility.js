export function normalize(text) {
  return text.trim().toLowerCase();
}

export function checkCompatibility(devices, modelInput, firmwareInput, kernelInput) {
  const model = normalize(modelInput);
  const firmware = normalize(firmwareInput);
  const kernel = normalize(kernelInput);

  // 1. Exact match search
  for (const device of devices) {
    for (const record of device.compatibilityRecords) {
      const recFirmware = normalize(record.firmware || '');
      const recKernel = normalize(record.kernel || '');
      
      // Check if model matches (any of modelNumbers or aliases or codenames)
      const modelMatches = device.modelNumbers.some(m => normalize(m) === model) ||
                           device.aliases.some(a => normalize(a) === model) ||
                           device.codenames.some(c => normalize(c) === model);

      if (modelMatches && recFirmware === firmware && recKernel === kernel) {
        return {
          type: 'exact_match',
          device,
          record,
          status: record.status
        };
      }
    }
  }

  // 2. Partial match search
  let matchedFields = [];
  for (const device of devices) {
    const modelMatches = device.modelNumbers.some(m => normalize(m) === model) ||
                         device.aliases.some(a => normalize(a) === model) ||
                         device.codenames.some(c => normalize(c) === model);
    
    if (modelMatches) matchedFields.push('Model');
    
    for (const record of device.compatibilityRecords) {
      const recFirmware = normalize(record.firmware || '');
      const recKernel = normalize(record.kernel || '');
      
      if (recFirmware === firmware) matchedFields.push('Firmware');
      if (recKernel === kernel) matchedFields.push('Kernel');
    }
  }

  const uniqueMatches = [...new Set(matchedFields)];
  if (uniqueMatches.length > 0) {
    return {
      type: 'partial_match',
      matchedFields: uniqueMatches
    };
  }

  // 3. No match
  return {
    type: 'no_match'
  };
}
