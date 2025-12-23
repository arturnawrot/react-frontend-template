import type { SerializedEditorState } from 'lexical'

/**
 * Simple utility to extract plain text from Lexical editor state
 */
export function serializeLexical(editorState: SerializedEditorState | { children: any }): string {
  if (!editorState || !editorState.children) {
    return ''
  }

  const extractText = (node: any): string => {
    if (typeof node === 'string') {
      return node
    }

    if (node.text) {
      return node.text
    }

    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractText).join('')
    }

    return ''
  }

  return editorState.children.map(extractText).join('\n')
}

