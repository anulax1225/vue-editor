import { Editor } from "./editor.js"
import { Extension } from "./extension.js"
import { Node } from "./node.js"
import { Mark } from "./mark.js"
import { extensions, base } from "./extensions/index.js"

export function removeExtension(extensions, neadle) {
    return extensions.toSpliced(extensions.indexOf(neadle), 1);
}

export function removeExtensions(extensions, neadles) {
    neadles.forEach(neadle => extensions = removeExtension(extensions, neadle))
    return extensions;
}

export function replaceExtension(extensions, neadle, replacement) {
    return extensions.toSpliced(extensions.indexOf(neadle), 1, replacement);
}

export function replaceExtensions(extensions, neadleMap) {
    Object.entries(neadleMap).forEach(([neadle, replacement]) => extensions = replaceExtension(extensions, neadle, replacement));
    return extensions;
}

export {
    extensions as baseExtensions,
    base,
    Editor,
    Extension,
    Node,
    Mark,
}






