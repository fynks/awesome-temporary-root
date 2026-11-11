/**
 * Single-source-of-truth data index for awesome-temporary-root.
 *
 * All device/tool/manager/module/CVE data lives in src/data/*.json. This file
 * loads them and exposes computed counts used by the README-sync validation,
 * the device explorer, the tools directory, and llms.txt.
 *
 * The JSON files are the source of truth; do not duplicate device data in the
 * README except where the README's canonical tables intentionally restate it.
 */

import devicesData from "./devices.json";
import toolsData from "./tools.json";
import managersData from "./managers.json";
import modulesData from "./modules.json";
import cvesData from "./cves.json";

export type Device = (typeof devicesData)["devices"][number];
export type Tool = (typeof toolsData)["tools"][number];
export type Manager = (typeof managersData)["managers"][number];
export type Module = (typeof modulesData)["modules"][number];
export type Cve = (typeof cvesData)["cves"][number];

export const devices = devicesData.devices as Device[];
export const tools = toolsData.tools as Tool[];
export const managers = managersData.managers as Manager[];
export const modules = modulesData.modules as Module[];
export const cves = cvesData.cves as Cve[];

export type Status = "Tested" | "Experimental" | "Upstream profile" | "Community reported" | "Unverified candidate" | "Deprecated/unavailable";

export const STATUS_LABELS: Record<Status, string> = {
  Tested: "Tested",
  Experimental: "Experimental",
  "Upstream profile": "Upstream profile",
  "Community reported": "Community reported",
  "Unverified candidate": "Unverified candidate",
  "Deprecated/unavailable": "Deprecated/unavailable",
};

/** Count devices by brand. */
export function countByBrand() {
  const counts: Record<string, number> = {};
  for (const d of devices) counts[d.brand] = (counts[d.brand] ?? 0) + 1;
  return counts;
}

/** Count devices by status. */
export function countByStatus() {
  const counts: Record<Status, number> = {} as Record<Status, number>;
  for (const d of devices) counts[d.status as Status] = (counts[d.status as Status] ?? 0) + 1;
  return counts;
}

/** Count devices by method/CVE. */
export function countByMethod() {
  const counts: Record<string, number> = {};
  for (const d of devices) counts[d.method] = (counts[d.method] ?? 0) + 1;
  return counts;
}

/** Total number of distinct device entries (a row may cover several models). */
export function totalDevices() {
  return devices.length;
}

/** Count hardware-confirmed targets (status Tested only). */
export function totalTested() {
  return devices.filter((d) => d.status === "Tested").length;
}

/** Count tools. */
export function totalTools() {
  return tools.length;
}

/** Count managers. */
export function totalManagers() {
  return managers.length;
}

/** Count modules. */
export function totalModules() {
  return modules.length;
}

/** Distinct brands. */
export function brands() {
  return [...new Set(devices.map((d) => d.brand))].sort();
}

/** Search devices by query (model, market name, brand, kernel, loader). */
export function searchDevices(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return devices;
  return devices.filter((d) =>
    [d.marketName, d.brand, d.models.join(" "), d.kernelRelease, d.loader]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}

/** Filter devices by status. */
export function filterByStatus(status: Status) {
  return devices.filter((d) => d.status === status);
}

/** Filter devices by brand. */
export function filterByBrand(brand: string) {
  return devices.filter((d) => d.brand === brand);
}

export default {
  devices,
  tools,
  managers,
  modules,
  cves,
  countByBrand,
  countByStatus,
  countByMethod,
  totalDevices,
  totalTested,
  totalTools,
  totalManagers,
  totalModules,
  brands,
  searchDevices,
  filterByStatus,
  filterByBrand,
};
