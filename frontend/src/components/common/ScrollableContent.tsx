import React from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface ScrollableContentProps {
    children: React.ReactNode;
    maxHeight?: string | number;
    sx?: SxProps<Theme>;
}

/**
 * A container with a customizable max-height and consistent styling for scrolling content.
 * Includes a subtle background, border, and custom scrollbar styles.
 */
const ScrollableContent: React.FC<ScrollableContentProps> = ({ 
    children, 
    maxHeight = '150px',
    sx 
}) => {
    return (
        <Box sx={{ 
            maxHeight, 
            overflowY: 'auto',
            p: 1.5,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            '&::-webkit-scrollbar': {
                width: '4px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            },
            ...sx
        }}>
            {children}
        </Box>
    );
};

export default ScrollableContent;
