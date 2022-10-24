import type { PermissionLevel } from "./interfaces";

export enum PermissionLevels {
  none = 0,
  read = 1,
  write = 2,
  admin = 3,
}

export function checkPermission(required: PermissionLevel, actual: PermissionLevel): boolean {
  const requiredLevel = PermissionLevels[required];
  const actualLevel = PermissionLevels[actual];

  if (actualLevel >= requiredLevel) {
    return true;
  }

  return false;
}
