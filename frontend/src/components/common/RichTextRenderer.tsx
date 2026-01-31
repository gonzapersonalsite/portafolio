import React from 'react';
import { Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

interface RichTextRendererProps {
    text: string;
}

/**
 * Renders text with smart formatting:
 * - Detects bullet points (●, •, -, *) and renders them as proper lists
 * - Preserves paragraphs for normal text
 * - Handles mixed content
 */
const RichTextRenderer: React.FC<RichTextRendererProps> = ({ text }) => {
    if (!text) return null;

    // Normalize newlines: handle \r\n, \n, and escaped \\n (common in JSON from backend)
    let normalizedText = text.replace(/\\n/g, '\n');
    
    // Recovery for data with collapsed newlines (e.g. from aggressive sanitization)
    // Looks for " ● " pattern in the middle of text and forces a newline before the bullet
    normalizedText = normalizedText.replace(/([^\n])\s+([●•\-\*◦▪])/g, '$1\n$2');

    const lines = normalizedText.split(/\r?\n/);
    
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = (keyIndex: number) => {
        if (currentList.length > 0) {
            elements.push(
                <List key={`list-${keyIndex}`} dense sx={{ py: 0, my: 1 }}>
                    {currentList.map((item, i) => (
                        <ListItem key={i} alignItems="flex-start" sx={{ py: 0.5, pl: 0 }}>
                             <ListItemIcon sx={{ minWidth: 20, mt: 1 }}>
                                <CircleIcon sx={{ fontSize: 6, color: 'text.secondary' }} />
                             </ListItemIcon>
                             <ListItemText 
                                primary={item} 
                                primaryTypographyProps={{ 
                                    variant: 'body1', 
                                    color: 'text.secondary',
                                    sx: { lineHeight: 1.6 }
                                }}
                                sx={{ m: 0 }}
                             />
                        </ListItem>
                    ))}
                </List>
            );
            currentList = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        // Detect bullets: starts with ●, •, -, *, ◦, ▪ followed by optional space
        // We capture the text content in group 2
        const bulletMatch = trimmed.match(/^([●•\-\*◦▪])\s*(.*)/);
        
        if (bulletMatch) {
            // Add clean text to current list
            currentList.push(bulletMatch[2]);
        } else {
            // Not a bullet
            flushList(index);
            
            // If empty line, render a spacer or just ignore (HTML collapses whitespace)
            // But if it's a paragraph break, we want some space.
            if (!trimmed) {
                // Optional: add a spacer if strictly needed, or let margin handle it
                // For now, ignore empty lines to avoid double spacing, 
                // unless we want to preserve manual spacing.
                // Let's preserve empty lines as <br /> equivalent if desired, 
                // but usually stripping them is cleaner for "professional" look unless user double enters.
                // If the user wants a paragraph break, they usually leave an empty line.
                if (lines.length > 1 && index > 0 && lines[index-1].trim() !== '') {
                     elements.push(<Box key={`spacer-${index}`} sx={{ height: 8 }} />);
                }
            } else {
                elements.push(
                    <Typography 
                        key={`text-${index}`} 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ mb: 1, lineHeight: 1.6 }}
                    >
                        {line}
                    </Typography>
                );
            }
        }
    });
    
    flushList(lines.length);

    return <Box>{elements}</Box>;
};

export default RichTextRenderer;
