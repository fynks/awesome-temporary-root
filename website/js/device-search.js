export function searchDevices(devices, query) {
  if (!query) return [];
  const q = query.toLowerCase();

  return devices.filter(d => {
    const matchesName = d.deviceName.toLowerCase().includes(q) || d.manufacturer.toLowerCase().includes(q);
    const matchesModel = d.modelNumbers.some(m => m.toLowerCase().includes(q)) ||
                         d.aliases.some(a => a.toLowerCase().includes(q)) ||
                         d.codenames.some(c => c.toLowerCase().includes(q));
    const matchesRecord = d.compatibilityRecords.some(r => 
      (r.firmware && r.firmware.toLowerCase().includes(q)) ||
      (r.kernel && r.kernel.toLowerCase().includes(q)) ||
      (r.androidVersion && r.androidVersion.toLowerCase().includes(q))
    );

    return matchesName || matchesModel || matchesRecord;
  });
}

export function renderDeviceResults(results, container) {
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<p>No devices found matching your search.</p>';
    return;
  }

  results.forEach(d => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <h3>${d.deviceName} (${d.manufacturer})</h3>
      <p><strong>Models:</strong> ${d.modelNumbers.join(', ')}</p>
      <p><strong>Records:</strong> ${d.compatibilityRecords.length}</p>
      <a href="/devices/${d.id}/" class="nav-link">View Details</a>
    `;
    container.appendChild(card);
  });
}
