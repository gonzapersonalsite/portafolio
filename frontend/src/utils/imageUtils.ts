/**
 * Utility to process image URLs, especially for Google Drive links which are
 * prone to 403 errors when using the direct 'uc' endpoint.
 * @param url The raw image URL from the database
 */
export const formatImageUrl = (url: string | undefined): string => {
    if (!url) return 'https://via.placeholder.com/400x225?text=No+Image';

    // Check if it's a Google Drive link
    if (url.includes('drive.google.com')) {
        let fileId = '';

        // Handle https://drive.google.com/file/d/FILE_ID/view...
        const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (dMatch) {
            fileId = dMatch[1];
        } else {
            // Handle https://drive.google.com/uc?id=FILE_ID...
            const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (idMatch) {
                fileId = idMatch[1];
            }
        }

        if (fileId) {
            // Use the thumbnail endpoint which is more reliable for embedding
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }
    }

    return url;
};
