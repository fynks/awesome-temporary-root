export function searchModules(modules, query) {
  if (!query) return [];
  const q = query.toLowerCase();

  return modules.filter(m => {
    const matchesName = m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    const matchesCategory = m.category && m.category.toLowerCase().includes(q);
    const matchesVersion = m.version && m.version.toLowerCase().includes(q);
    const matchesMethod = m.supportedRootMethods.some(rm => rm.toLowerCase().includes(q));
    
    return matchesName || matchesCategory || matchesVersion || matchesMethod;
  });
}

export function renderModuleResults(results, container) {
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<p>No modules found matching your search.</p>';
    return;
  }

  results.forEach(m => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <h3>${m.name}</h3>
      <p><strong>Category:</strong> ${m.category || 'N/A'}</p>
      <p><strong>Status:</strong> ${m.status.toUpperCase()}</p>
      <p><strong>Root Methods:</strong> ${m.supportedRootMethods.join(', ')}</p>
      <a href="/modules/${m.id}/" class="nav-link">View Details</a>
    `;
    container.appendChild(card);
  });
}
