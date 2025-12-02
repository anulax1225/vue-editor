import { MarkdownParser, MarkdownSerializer } from 'prosemirror-markdown'
import MarkdownIt from "markdown-it"
import { extensions } from './extensions'
import { tableNodes } from 'prosemirror-tables'
import { Schema } from 'prosemirror-model'

// Build schema from extensions and table nodes
const schema = new Schema({
    nodes: {
        ...extensions
            .map(ext => new ext())
            .filter(ext => ext.type === 'node')
            .reduce((acc, ext) => {
                acc[ext.name] = ext.schema
                return acc
            }, {}),
        ...tableNodes({
            tableGroup: "block",
            cellContent: "block+",
        }),
    },
    marks: extensions
        .map(ext => new ext())
        .filter(ext => ext.type === 'mark')
        .reduce((acc, ext) => {
            acc[ext.name] = ext.schema
            return acc
        }, {}),
})

function listIsTight(tokens, i) {
    while (++i < tokens.length) {
        if (tokens[i].type !== "list_item_open") return tokens[i].hidden
    }
    return false
}

/**
 * Preprocesses markdown-it tokens to wrap inline content in table cells with paragraphs.
 * This is necessary because prosemirror-tables expects cellContent: "block+" but
 * markdown-it produces direct inline tokens inside th/td.
 */
function wrapTableCellInlineContent(tokens) {
    const result = []
    
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        result.push(token)
        
        // Check if this is a table header or cell opening
        if (token.type === 'th_open' || token.type === 'td_open') {
            // Look ahead to see if next token is inline
            if (i + 1 < tokens.length && tokens[i + 1].type === 'inline') {
                // Insert paragraph_open before the inline content
                result.push({
                    type: 'paragraph_open',
                    tag: 'p',
                    nesting: 1,
                    attrs: null,
                    map: null,
                    level: token.level + 1,
                    children: null,
                    content: '',
                    markup: '',
                    info: '',
                    meta: null,
                    block: true,
                    hidden: false
                })
                
                // Add the inline token
                i++
                result.push(tokens[i])
                
                // Insert paragraph_close after the inline content
                result.push({
                    type: 'paragraph_close',
                    tag: 'p',
                    nesting: -1,
                    attrs: null,
                    map: null,
                    level: token.level + 1,
                    children: null,
                    content: '',
                    markup: '',
                    info: '',
                    meta: null,
                    block: true,
                    hidden: false
                })
            }
        }
    }
    
    return result
}

// Custom MarkdownParser that preprocesses tokens
class TableAwareMarkdownParser extends MarkdownParser {
    parse(text, markdownEnv = {}) {
        // Parse with markdown-it
        const tokens = this.tokenizer.parse(text, markdownEnv)
        
        // Preprocess to wrap table cell content in paragraphs
        const processedTokens = wrapTableCellInlineContent(tokens)
        
        // Use parent class's parsing logic with processed tokens
        // We need to manually create the parse state and parse the processed tokens
        const MarkdownParseState = this.constructor.MarkdownParseState
        
        // Since MarkdownParseState is not exported, we'll use the standard parse
        // but replace the tokenizer output
        const originalParse = this.tokenizer.parse
        this.tokenizer.parse = () => processedTokens
        
        try {
            return super.parse(text, markdownEnv)
        } finally {
            this.tokenizer.parse = originalParse
        }
    }
}

export function createMarkdownParser(schema) {
    // Initialize markdown-it with table support enabled
    const md = MarkdownIt("commonmark", { html: false }).enable('table')
    
    // Build tokens object based on what exists in the schema
    const tokens = {}
    
    // Node tokens
    if (schema.nodes.blockquote) {
        tokens.blockquote = { block: "blockquote" }
    }
    if (schema.nodes.paragraph) {
        tokens.paragraph = { block: "paragraph" }
    }
    if (schema.nodes.list_item) {
        tokens.list_item = { block: "list_item" }
    }
    if (schema.nodes.bullet_list) {
        tokens.bullet_list = { 
            block: "bullet_list", 
            getAttrs: (_, tokens, i) => ({ tight: listIsTight(tokens, i) }) 
        }
    }
    if (schema.nodes.ordered_list) {
        tokens.ordered_list = {
            block: "ordered_list",
            getAttrs: (tok, tokens, i) => ({
                order: +tok.attrGet("start") || 1,
                tight: listIsTight(tokens, i)
            })
        }
    }
    if (schema.nodes.heading) {
        tokens.heading = { 
            block: "heading", 
            getAttrs: tok => ({ level: +tok.tag.slice(1) }) 
        }
    }
    if (schema.nodes.code_block) {
        tokens.code_block = { block: "code_block", noCloseToken: true }
        tokens.fence = { 
            block: "code_block", 
            getAttrs: tok => ({ params: tok.info || "" }), 
            noCloseToken: true 
        }
    }
    if (schema.nodes.horizontal_rule) {
        tokens.hr = { node: "horizontal_rule" }
    }
    if (schema.nodes.image) {
        tokens.image = {
            node: "image",
            getAttrs: tok => ({
                src: tok.attrGet("src"),
                title: tok.attrGet("title") || null,
                alt: (tok.children && tok.children[0] && tok.children[0].content) || null
            })
        }
    }
    if (schema.nodes.hard_break) {
        tokens.hardbreak = { node: "hard_break" }
    }
    
    // Mark tokens
    if (schema.marks.em) {
        tokens.em = { mark: "em" }
    } else {
        tokens.em = { ignore: true }
    }
    
    if (schema.marks.strong) {
        tokens.strong = { mark: "strong" }
    } else {
        tokens.strong = { ignore: true }
    }
    
    if (schema.marks.link) {
        tokens.link = {
            mark: "link",
            getAttrs: tok => ({
                href: tok.attrGet("href"),
                title: tok.attrGet("title") || null
            })
        }
    } else {
        tokens.link = { ignore: true }
    }
    
    if (schema.marks.code) {
        tokens.code_inline = { mark: "code", noCloseToken: true }
    } else {
        tokens.code_inline = { ignore: true }
    }
    
    // Table tokens
    if (schema.nodes.table) {
        tokens.table = { block: 'table' }
        tokens.thead = { ignore: true }
        tokens.tbody = { ignore: true }
    }
    
    if (schema.nodes.table_row) {
        tokens.tr = { block: 'table_row' }
    }
    
    // Table cells - with preprocessing, these can be simple
    if (schema.nodes.table_header) {
        tokens.th = { block: 'table_header' }
    }
    
    if (schema.nodes.table_cell) {
        tokens.td = { block: 'table_cell' }
    }

    // Use custom parser that preprocesses tokens
    return new TableAwareMarkdownParser(schema, md, tokens)
}

export function createMarkdownSerializer(schema) {
    const nodes = {}
    const marks = {}
    
    // Build serializer based on what exists in schema
    if (schema.nodes.paragraph) {
        nodes.paragraph = function(state, node) {
            state.renderInline(node)
            state.closeBlock(node)
        }
    }
    
    if (schema.nodes.blockquote) {
        nodes.blockquote = function(state, node) {
            state.wrapBlock("> ", null, node, () => state.renderContent(node))
        }
    }
    
    if (schema.nodes.code_block) {
        nodes.code_block = function(state, node) {
            state.write("```" + (node.attrs.params || "") + "\n")
            state.text(node.textContent, false)
            state.ensureNewLine()
            state.write("```")
            state.closeBlock(node)
        }
    }
    
    if (schema.nodes.heading) {
        nodes.heading = function(state, node) {
            state.write(state.repeat("#", node.attrs.level) + " ")
            state.renderInline(node)
            state.closeBlock(node)
        }
    }
    
    if (schema.nodes.horizontal_rule) {
        nodes.horizontal_rule = function(state, node) {
            state.write(node.attrs.markup || "---")
            state.closeBlock(node)
        }
    }
    
    if (schema.nodes.bullet_list) {
        nodes.bullet_list = function(state, node) {
            state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ")
        }
    }
    
    if (schema.nodes.ordered_list) {
        nodes.ordered_list = function(state, node) {
            let start = node.attrs.order || 1
            let maxW = String(start + node.childCount - 1).length
            let space = state.repeat(" ", maxW + 2)
            state.renderList(node, space, i => {
                let nStr = String(start + i)
                return state.repeat(" ", maxW - nStr.length) + nStr + ". "
            })
        }
    }
    
    if (schema.nodes.list_item) {
        nodes.list_item = function(state, node) {
            state.renderContent(node)
        }
    }
    
    if (schema.nodes.hard_break) {
        nodes.hard_break = function(state, node, parent, index) {
            for (let i = index + 1; i < parent.childCount; i++) {
                if (parent.child(i).type !== node.type) {
                    state.write("\\\n")
                    return
                }
            }
        }
    }
    
    if (schema.nodes.image) {
        nodes.image = function(state, node) {
            state.write("![" + state.esc(node.attrs.alt || "") + "](" +
                state.esc(node.attrs.src) +
                (node.attrs.title ? " " + state.quote(node.attrs.title) : "") + ")")
        }
    }
    
    // Table serialization
    if (schema.nodes.table) {
        nodes.table = function(state, node) {
            const rows = []
            const widths = []

            node.forEach((row) => {
                const cells = []
                row.forEach((cell) => {
                    const content = getCellContent(cell, state)
                    cells.push(content)
                    const colIndex = cells.length - 1
                    widths[colIndex] = Math.max(widths[colIndex] || 3, content.length)
                })
                rows.push(cells)
            })

            rows.forEach((cells, rowIndex) => {
                state.write("|")
                cells.forEach((content, colIndex) => {
                    state.write(" " + content.padEnd(widths[colIndex]) + " |")
                })
                state.write("\n")

                if (rowIndex === 0) {
                    state.write("|")
                    widths.forEach(width => {
                        state.write(" " + state.repeat("-", width) + " |")
                    })
                    state.write("\n")
                }
            })

            state.closeBlock(node)
        }
    }
    
    if (schema.nodes.table_row) {
        nodes.table_row = function() { }
    }
    if (schema.nodes.table_cell) {
        nodes.table_cell = function() { }
    }
    if (schema.nodes.table_header) {
        nodes.table_header = function() { }
    }
    
    // Marks
    if (schema.marks.em) {
        marks.em = { open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true }
    }
    if (schema.marks.strong) {
        marks.strong = { open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true }
    }
    if (schema.marks.link) {
        marks.link = {
            open: "[",
            close(state, mark) {
                return "](" + state.esc(mark.attrs.href) +
                    (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")"
            }
        }
    }
    if (schema.marks.code) {
        marks.code = { open: "`", close: "`", escape: false }
    }

    return new MarkdownSerializer(nodes, marks)
}

function getCellContent(cell, state) {
    let content = ""
    cell.forEach((node) => {
        if (node.type.name === 'paragraph') {
            node.forEach((child) => {
                if (child.isText) {
                    content += child.text.replace(/\|/g, '\\|').replace(/\n/g, ' ')
                }
            })
        }
    })
    return content.trim()
}

export const markdownParser = createMarkdownParser(schema)
export const markdownSerializer = createMarkdownSerializer(schema)

export function getMarkdown(doc) {
    return markdownSerializer.serialize(doc)
}

export function parseMarkdown(markdown) {
    return markdownParser.parse(markdown)
}