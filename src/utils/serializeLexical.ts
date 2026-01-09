import type { SerializedEditorState } from 'lexical'

/**
 * Simple utility to extract plain text from Lexical editor state
 */
/**
 * Extract text from a Lexical node recursively
 */
function extractText(node: any): string {
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

export function serializeLexical(editorState: SerializedEditorState | { children: any }): string {
  // Handle SerializedEditorState (has root property)
  if ('root' in editorState && editorState.root) {
    const root = editorState.root as { children?: any[] }
    if (!root.children || !Array.isArray(root.children)) {
      return ''
    }
    return root.children.map(extractText).join('\n')
  }

  // Handle fallback type with direct children property
  if (!editorState || !('children' in editorState) || !editorState.children) {
    return ''
  }

  return editorState.children.map(extractText).join('\n')
}

