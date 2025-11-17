// tableMarkdown.js
import { MarkdownParser, MarkdownSerializer } from 'prosemirror-markdown'
import { extensions } from './extensions'
import { tableNodes } from 'prosemirror-tables'
import { Schema } from 'prosemirror-model'

/**
 * Creates an extended markdown parser that supports tables
 */
export function createCompleteMarkdownParser(schema) {
    // Get the base parser configuration
    const baseParser = MarkdownParser.fromSchema(schema)
    
    // Extend with table parsing rules
    const tokens = {
        ...baseParser.tokens,
        table: {
            block: 'table',
            getAttrs: () => ({}),
            parse: (state, token) => {
                const rows = []
                const children = token.children || []
                
                for (let i = 0; i < children.length; i++) {
                    const child = children[i]
                    if (child.type === 'tr') {
                        rows.push(child)
                    }
                }
                
                state.openNode(schema.nodes.table)
                
                for (let i = 0; i < rows.length; i++) {
                    parseTableRow(state, rows[i], schema, i === 0)
                }
                
                state.closeNode()
            }
        },
        tr: { block: 'table_row' },
        th: { block: 'table_header' },
        td: { block: 'table_cell' }
    }
    
    return new MarkdownParser(schema, baseParser.tokenizer, tokens)
}

function parseTableRow(state, token, schema, isHeader) {
    state.openNode(schema.nodes.table_row)
    
    const cells = token.children || []
    
    for (const cell of cells) {
        const cellType = isHeader || cell.type === 'th' 
            ? schema.nodes.table_header 
            : schema.nodes.table_cell
        
        state.openNode(cellType)
        state.openNode(schema.nodes.paragraph)
        
        // Parse cell content
        if (cell.children) {
            for (const child of cell.children) {
                state.addNode(parseInline(child, schema, state))
            }
        }
        
        state.closeNode() // paragraph
        state.closeNode() // cell
    }
    
    state.closeNode() // row
}

function parseInline(token, schema, state) {
    if (token.type === 'text') {
        return schema.text(token.content)
    }
    // Add more inline parsing as needed
    return schema.text(token.content || '')
}

/**
 * Creates an extended markdown serializer that supports tables
 */
export function createCompleteMarkdownSerializer(schema) {
    return new MarkdownSerializer(
        {
            // Block nodes
            paragraph(state, node) {
                state.renderInline(node)
                state.closeBlock(node)
            },
            blockquote(state, node) {
                state.wrapBlock("> ", null, node, () => state.renderContent(node))
            },
            code_block(state, node) {
                state.write("```" + (node.attrs.params || "") + "\n")
                state.text(node.textContent, false)
                state.ensureNewLine()
                state.write("```")
                state.closeBlock(node)
            },
            heading(state, node) {
                state.write(state.repeat("#", node.attrs.level) + " ")
                state.renderInline(node)
                state.closeBlock(node)
            },
            horizontal_rule(state, node) {
                state.write(node.attrs.markup || "---")
                state.closeBlock(node)
            },
            bullet_list(state, node) {
                state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ")
            },
            ordered_list(state, node) {
                let start = node.attrs.order || 1
                let maxW = String(start + node.childCount - 1).length
                let space = state.repeat(" ", maxW + 2)
                state.renderList(node, space, i => {
                    let nStr = String(start + i)
                    return state.repeat(" ", maxW - nStr.length) + nStr + ". "
                })
            },
            list_item(state, node) {
                state.renderContent(node)
            },
            hard_break(state, node, parent, index) {
                for (let i = index + 1; i < parent.childCount; i++)
                    if (parent.child(i).type != node.type) {
                        state.write("\\\n")
                        return
                    }
            },
            image(state, node) {
                state.write("![" + state.esc(node.attrs.alt || "") + "](" + 
                    state.esc(node.attrs.src) +
                    (node.attrs.title ? " " + state.quote(node.attrs.title) : "") + ")")
            },
            
            // Table nodes
            table(state, node) {
                state.renderTable(node)
                state.closeBlock(node)
            },
            table_row(state, node) {
                // Handled by renderTable
            },
            table_cell(state, node) {
                // Handled by renderTable
            },
            table_header(state, node) {
                // Handled by renderTable
            }
        },
        {
            // Mark serializers
            em: { open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true },
            strong: { open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true },
            link: {
                open(_state, mark, parent, index) {
                    return "["
                },
                close(state, mark, parent, index) {
                    return "](" + state.esc(mark.attrs.href) + 
                        (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")"
                }
            },
            code: { open: "`", close: "`", escape: false }
        }
    )
}

// Extend MarkdownSerializer prototype with table rendering
MarkdownSerializer.prototype.renderTable = function(node) {
    const rows = []
    const widths = []
    
    // First pass: collect all cell contents and calculate column widths
    node.forEach((row, rowOffset, rowIndex) => {
        const cells = []
        row.forEach((cell, cellOffset, cellIndex) => {
            const content = this.renderTableCell(cell)
            cells.push(content)
            
            // Track max width for each column
            if (!widths[cellIndex]) widths[cellIndex] = 3 // minimum width
            widths[cellIndex] = Math.max(widths[cellIndex], content.length)
        })
        rows.push({ cells, isHeader: rowIndex === 0 })
    })
    
    // Second pass: render with proper alignment
    rows.forEach((row, rowIndex) => {
        this.write("| ")
        row.cells.forEach((content, cellIndex) => {
            const width = widths[cellIndex]
            const padded = content.padEnd(width, ' ')
            this.write(padded + " | ")
        })
        this.write("\n")
        
        // Add separator after header row
        if (rowIndex === 0) {
            this.write("| ")
            widths.forEach(width => {
                this.write(this.repeat("-", width) + " | ")
            })
            this.write("\n")
        }
    })
}

MarkdownSerializer.prototype.renderTableCell = function(node) {
    const state = {
        out: "",
        closed: false,
        nodes: this.nodes,
        marks: this.marks,
        delim: this.delim,
        esc: this.esc.bind(this),
        quote: this.quote.bind(this),
        repeat: this.repeat.bind(this),
        renderContent(node) {
            node.forEach((child, offset, index) => {
                this.render(child, node, index)
            }, this)
        },
        renderInline(parent) {
            let active = []
            parent.forEach((child, offset, index) => {
                let marks = child.marks
                
                // Close marks that are not in the new set
                let i = 0
                while (i < active.length) {
                    if (!marks.includes(active[i])) {
                        this.text(this.marks[active[i].type.name].close, false)
                        active.splice(i, 1)
                    } else {
                        i++
                    }
                }
                
                // Open marks that are in the new set but not active
                marks.forEach(mark => {
                    if (!active.includes(mark)) {
                        active.push(mark)
                        this.text(this.marks[mark.type.name].open, false)
                    }
                })
                
                if (child.isText) {
                    this.text(child.text.replace(/\|/g, '\\|').replace(/\n/g, ' '), true)
                }
            }, this)
            
            // Close remaining marks
            while (active.length) {
                this.text(this.marks[active.pop().type.name].close, false)
            }
        },
        render(node, parent, index) {
            if (node.isText) {
                this.text(node.text.replace(/\|/g, '\\|').replace(/\n/g, ' '), true)
            } else if (this.nodes[node.type.name]) {
                this.nodes[node.type.name](this, node, parent, index)
            } else {
                this.renderContent(node)
            }
        },
        text(text, escape) {
            if (escape !== false) text = this.esc(text)
            this.out += text
        }
    }
    
    node.forEach((child, offset, index) => {
        if (child.type.name === 'paragraph') {
            state.renderInline(child)
        } else {
            state.render(child, node, index)
        }
    })
    
    return state.out.trim()
}

const schema = new Schema({
    nodes: [
        ...extensions.filter(ext => ext.type === 'node'),
        tableNodes({
            tableGroup: "block",
            cellContent: "block+",
        }),
    ],
    marks:  extensions.filter(ext => ext.type === 'mark'),
})

// Create parser and serializer with table support
export const markdownParser = createCompleteMarkdownParser(schema)
export const markdownSerializer = createCompleteMarkdownSerializer(schema)

// Use them in your editor
export function getMarkdown(doc) {
    return markdownSerializer.serialize(doc)
}

export function parseMarkdown(markdown) {
    return markdownParser.parse(markdown)
}