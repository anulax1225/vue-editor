import { Doc } from "./nodes/doc.js"
import { Text } from "./nodes/text.js"
import { Paragraph } from "./nodes/paragraph.js"
import { Heading } from "./nodes/heading.js"
import { CodeBlock } from "./nodes/codeBlock.js";
import { Image } from "./nodes/image.js";
import { HorizontalRule } from "./nodes/horizontalRule.js";
import { BlockQuote } from "./nodes/blockQuote.js";
import { Bold } from "./marks/bold.js";
import { Italic } from "./marks/italic.js";
import { Underline } from "./marks/underline.js";
import { Highlight } from "./marks/highlight.js";
import { HardBreak } from "./nodes/hardBreak.js";
import { Strike } from "./marks/strike.js";
import { Subscript } from "./marks/subscript.js";
import { TextColor } from "./marks/textColor.js";
import { FontSize } from "./marks/fontSize.js";
import { FontFamily } from "./marks/fontFamily.js";
import { Superscript } from "./marks/superscript.js";
import { Table } from "./nodes/table.js";
import { TableCell } from "./nodes/tableCell.js";
import { TableRow } from "./nodes/tableRow.js";
import { TableHeader } from "./nodes/tableHeader.js";
import { OrderedList } from "./nodes/orderedList.js";
import { ListItem } from "./nodes/listItem.js";
import { BulletList } from "./nodes/bulletList.js";
import { Code } from "./marks/code.js";
import { Link } from "./marks/link.js";

export function removeExtension(extensions, neadle) {
    const predicate = typeof neadle === 'function' ? () => neadle : () => extensions.find(ext => (new ext()).name === neadle);
    return extensions.toSpliced(extensions.indexOf(predicate()), 1);
}

export function removeExtensions(extensions, neadles) {
    neadles.forEach(neadle => extensions = removeExtension(extensions, neadle))
    return extensions;
}

export function allowExtensions(extensions, neadles) {
    let disallowed = [];
    extensions.forEach(ext => {
        let extInstance = new ext();
        let match = neadles.includes(extInstance.name);
        if (!match) disallowed.push(extInstance.name);
    });
    return removeExtensions(extensions, disallowed);
}

export function replaceExtension(extensions, neadle, replacement) {
    const predicate = typeof neadle === 'function' ? () => neadle : () => extensions.find(ext => (new ext()).name === neadle);
    return extensions.toSpliced(extensions.indexOf(predicate()), 1, replacement);
}

export function replaceExtensions(extensions, neadleMap) {
    Object.entries(neadleMap).forEach(([neadle, replacement]) => extensions = replaceExtension(extensions, neadle, replacement));
    return extensions;
}

export const base = {
    nodes: {
        Doc,
        Text,
        Paragraph,
        Heading,
        HardBreak,
        CodeBlock,
        HorizontalRule,
        BlockQuote,
        Image,
        Table,
        TableCell,
        TableRow,
        TableHeader,
        OrderedList,
        ListItem,
        BulletList
    },
    marks: {
        Bold,
        Italic,
        Code,
        Link,
        Underline,
        Highlight,
        Strike,
        Subscript,
        Superscript,
        TextColor,
        FontSize,
        FontFamily,
    }
}

export const baseExtensions = [
    Doc,
    Text,
    Paragraph,
    Heading,
    HardBreak,
    Bold,
    Italic,
    Code,
    Link,
    Underline,
    Highlight,
    Strike,
    Subscript,
    Superscript,
    TextColor,
    FontSize,
    FontFamily,
    CodeBlock,
    HorizontalRule,
    BlockQuote,
    Image,
    Table,
    TableCell,
    TableRow,
    TableHeader,
    OrderedList,
    ListItem,
    BulletList
];