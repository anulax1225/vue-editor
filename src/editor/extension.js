export class Extension {
    constructor(options = {}) {
        this.options = options;
        this.editor = null;
        this.name = this.constructor.name.toLowerCase();
    }

    get type() {
        return 'extension'
    }

    get priority() {
        return this.options.priority || 100
    }

    get schema() {
        return null
    }

    get plugins() {
        return []
    }

    get keymap() {
        return {}
    }

    get commands() {
        return {}
    }

    inputRules(schema) {
        return []
    }

    get pasteRules() {
        return []
    }

    onCreate(editor) {
        this.editor = editor
    }

    onDestroy() { }
}