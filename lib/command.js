"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name) {
        this.name = name;
        this.matcher = /^\/([\w]+)\b *(.*)?$/m;
    }
    checkComment(comment = "") {
        const command = comment.match(this.matcher);
        if (command && this.name === command[1]) {
            return {
                name: this.name,
                arguments: command[2],
            };
        }
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map