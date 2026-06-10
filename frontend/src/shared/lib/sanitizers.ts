/**
 * Parses a string or array of strings into a clean array of URLs.
 * Handles multiline strings, cleans invisible characters and trims spaces.
 * Useful for extracting arrays from multiline textareas.
 */
export const parseUrlStringToArray = (input: string | string[] | undefined | null): string[] => {
    if (!input) return [];
    
    if (typeof input === 'string') {
        return input
            .split('\n')
            .map(u => u.replace(/^[`'"]+|[`'"]+$/g, '').trim())
            .filter(Boolean);
    }
    
    if (Array.isArray(input)) {
        return input
            .map(u => {
                const cleanU = typeof u === 'string' ? u.trim() : String(u);
                return cleanU.replace(/^[`'"]+|[`'"]+$/g, '').trim();
            })
            .filter(Boolean);
    }
    
    return [];
};

/**
 * Parses a comma-separated string into an array of trimmed strings.
 */
export const parseCommaSeparatedString = (input: string | string[] | undefined | null): string[] => {
    if (!input) return [];
    
    if (typeof input === 'string') {
        return input
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
    }
    
    if (Array.isArray(input)) {
        return input
            .map(t => String(t).trim())
            .filter(Boolean);
    }
    
    return [];
};
