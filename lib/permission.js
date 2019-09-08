"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PermissionLevels;
(function (PermissionLevels) {
    PermissionLevels[PermissionLevels["none"] = 0] = "none";
    PermissionLevels[PermissionLevels["read"] = 1] = "read";
    PermissionLevels[PermissionLevels["write"] = 2] = "write";
    PermissionLevels[PermissionLevels["admin"] = 3] = "admin";
})(PermissionLevels = exports.PermissionLevels || (exports.PermissionLevels = {}));
function checkPermission(required, actual) {
    const requiredLevel = PermissionLevels[required];
    const actualLevel = PermissionLevels[actual];
    if (actualLevel >= requiredLevel) {
        return true;
    }
    return false;
}
exports.checkPermission = checkPermission;
//# sourceMappingURL=permission.js.map