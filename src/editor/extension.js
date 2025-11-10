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

    get toolbar() {
        return null
    }

    get bubbleMenu() {
        return null
    }

    get keymap() {
        return {}
    }

    get commands() {
        return {}
    }

    get inputRules() {
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