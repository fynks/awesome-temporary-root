export function formatStatus(status) {
  const map = {
    tested: 'Tested',
    reproduced: 'Reproduced',
    experimental: 'Experimental',
    candidate: 'Candidate',
    known_issue: 'Known Issue',
    unknown: 'Unknown'
  };
  return map[status] || status;
}

export function formatEvidence(evidence) {
  return evidence.map(url => `<a href="${url}" target="_blank">${url}</a>`).join(', ');
}
