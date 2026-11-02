let cachedDevices = null;
let cachedModules = null;

  // Fetch data from the correct relative path (dist/data is one level up from dist/website)
  async function loadData() {
    if (cachedDevices && cachedModules) {
      return { devices: cachedDevices, modules: cachedModules };
    }

    try {
      // Relative path from website/js/ to dist/data/ is ../../dist/data/
      // Since the preview server serves dist/ as root, the data is at /data/
      const devicesResp = await fetch('/data/devices.json');
      const modulesResp = await fetch('/data/modules.json');

      if (!devicesResp.ok || !modulesResp.ok) {
        throw new Error('Failed to load JSON datasets');
      }

      cachedDevices = await devicesResp.json();
      cachedModules = await modulesResp.json();

      return { devices: cachedDevices, modules: cachedModules };
    } catch (err) {
      console.error('Data load error:', err);
      throw err;
    }
  }
