// Content JSON stores line breaks as literal "\n" sequences in some entities
// and as real newlines in others, and bullet markers sometimes follow text on
// the same line. The UI and the agent markdown twins must read the same text.
export function normalizeRichText(text: string): string {
    return text.replace(/\\n/g, '\n').replace(/([^\n])\s+([●•*◦▪-])/g, '$1\n$2');
}
