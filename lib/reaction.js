"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionTypes = [
    "+1",
    "-1",
    "laugh",
    "confused",
    "heart",
    "hooray",
    "rocket",
    "eyes",
];
class Reaction {
    constructor(type) {
        this._type = this.sanitize(type);
    }
    get type() {
        return this._type;
    }
    sanitize(name) {
        if (exports.reactionTypes.includes(name)) {
            return name;
        }
        return "+1";
    }
}
exports.Reaction = Reaction;
//# sourceMappingURL=reaction.js.map