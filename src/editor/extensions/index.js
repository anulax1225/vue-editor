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

export const base = {
    Doc,
    Text,
    Paragraph,
    Heading,
    CodeBlock,
    HorizontalRule,
    BlockQuote,
    Bold,
    Italic,
    Image,
}

export const extensions = [
    Doc,
    Text,
    Paragraph,
    Heading,
    CodeBlock,
    HorizontalRule,
    BlockQuote,
    Bold,
    Italic,
    Image,
];