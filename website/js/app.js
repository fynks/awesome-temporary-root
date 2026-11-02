import { loadData } from './data.js';
import { checkCompatibility } from './compatibility.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checker-form');
  const resultArea = document.getElementById('result-area');
  const resultContent = document.getElementById('result-content');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const model = document.getElementById('model').value.trim();
    const firmware = document.getElementById('firmware').value.trim();
    const kernel = document.getElementById('kernel').value.trim();

    resultContent.innerHTML = '<p>Loading data and checking...</p>';
    resultArea.classList.remove('hidden');

    try {
      const { devices, modules } = await loadData();
      const result = checkCompatibility(devices, model, firmware, kernel);
      
      renderResult(result);
    } catch (err) {
      resultContent.innerHTML = `<p class="error">Error loading data: ${err.message}</p>`;
    }
  });
});

function renderResult(result) {
  const resultContent = document.getElementById('result-content');
  
  if (result.type === 'exact_match') {
    const statusClass = `status-${result.status}`;
    let warning = '';
    if (result.status === 'experimental') {
      warning = `<div class="warning-box"><strong>Warning:</strong> Experimental status. Not fully verified.</div>`;
    } else if (result.status === 'candidate') {
      warning = `<div class="warning-box"><strong>Note:</strong> Candidate status. Testing incomplete.</div>`;
    }

    resultContent.innerHTML = `
      <div class="result-card">
        <h3>Exact Match Found</h3>
        <p><strong>Device:</strong> ${result.device.deviceName} (${result.device.manufacturer})</p>
        <p><strong>Model:</strong> ${result.record.firmware ? result.device.modelNumbers.join(', ') : 'N/A'}</p>
        <p><strong>Firmware:</strong> ${result.record.firmware}</p>
        <p><strong>Kernel:</strong> ${result.record.kernel}</p>
        <p><strong>Status:</strong> <span class="${statusClass}">${result.status.toUpperCase()}</span></p>
        ${warning}
        <p><strong>Root Method:</strong> ${result.record.rootMethod || 'N/A'}</p>
        <p><strong>Android Version:</strong> ${result.record.androidVersion || 'N/A'}</p>
        <ul class="evidence-list">
          <strong>Evidence:</strong>
          ${result.record.evidence.map(ev => `<li><a href="${ev}" target="_blank">${ev}</a></li>`).join('')}
        </ul>
        ${result.record.notes.length > 0 ? `<p><strong>Notes:</strong> ${result.record.notes.join(' ')}</p>` : ''}
      </div>
    `;
  } else if (result.type === 'partial_match') {
    resultContent.innerHTML = `
      <div class="result-card">
        <h3>Partial Match</h3>
        <p>No exact match found for all three fields (Model, Firmware, Kernel).</p>
        <p><strong>Matched Fields:</strong> ${result.matchedFields.join(', ')}</p>
        <p><strong>Note:</strong> Partial matching does not establish compatibility.</p>
        <p>Please check the <a href="/devices/">Devices</a> list for similar models.</p>
      </div>
    `;
  } else {
    resultContent.innerHTML = `
      <div class="result-card">
        <h3>No Record Found</h3>
        <p>«No documented compatibility record was found for this exact combination. This does not necessarily mean the device is incompatible.»</p>
        <p>Please verify your model, firmware, and kernel strings against the <a href="/devices/">Devices</a> database.</p>
      </div>
    `;
  }
}
