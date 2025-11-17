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

export const base = {
    Doc,
    Text,

    Paragraph,
    Heading,
    HardBreak,

    Bold,
    Italic,
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
}

export const extensions = [
    Doc,
    Text,

    Paragraph,
    Heading,
    HardBreak,

    Bold,
    Italic,
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