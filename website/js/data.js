let cached = null;

export async function loadData() {
  if (cached) return cached;

  // Serve dist/ as the site root; dist/data lives at /data/
  const [devicesResp, modulesResp] = await Promise.all([
    fetch('/data/devices.json'),
    fetch('/data/modules.json'),
  ]);

  if (!devicesResp.ok || !modulesResp.ok) {
    throw new Error('Failed to load JSON datasets');
  }

  try {
    const [devices, modules] = await Promise.all([
      devicesResp.json(),
      modulesResp.json(),
    ]);
    cached = { devices, modules };
    return cached;
  } catch (err) {
    console.error('Data load error:', err);
    throw err;
  }
}
