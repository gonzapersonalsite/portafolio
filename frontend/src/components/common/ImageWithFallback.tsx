import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import type { BoxProps } from '@mui/material';

interface ImageWithFallbackProps extends BoxProps<'img'> {
    src?: string;
    alt: string;
    fallbackSrc?: string;
    type?: 'profile' | 'project' | 'general';
    aspectRatio?: string;
    objectPosition?: string;
    referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    alt,
    fallbackSrc,
    type = 'general',
    aspectRatio,
    objectPosition = 'center',
    sx,
    referrerPolicy,
    ...props
}) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if image is already loaded in cache when component mounts or src changes
    const onImageRef = (img: HTMLImageElement | null) => {
        if (img) {
            setIsLoading(!img.complete);
        }
    };

    const getFallbackUrl = () => {
        if (fallbackSrc) return fallbackSrc;
        
        if (type === 'profile') {
            return "/profile-fallback.jpg";
        }
        return "https://placehold.co/600x400?text=Project+Image";
    };

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setIsLoading(false);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    const finalSrc = hasError ? getFallbackUrl() : (src || getFallbackUrl());

    // If aspectRatio is provided, we use a container to reserve space
    if (aspectRatio) {
        return (
            <Box 
                sx={[
                    { 
                        position: 'relative', 
                        width: '100%', 
                        aspectRatio,
                        overflow: 'hidden' // Ensures children (img/skeleton) respect parent's borderRadius
                    },
                    ...(Array.isArray(sx) ? sx : [sx])
                ]} 
            >
                {isLoading && (
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{ position: 'absolute', top: 0, left: 0 }}
                    />
                )}
                <Box
                    component="img"
                    src={finalSrc}
                    alt={alt}
                    onError={handleError}
                    onLoad={handleLoad}
                    ref={onImageRef}
                    referrerPolicy={referrerPolicy}
                    {...props}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition,
                        opacity: isLoading ? 0 : 1,
                        transition: 'opacity 0.3s ease-in-out',
                    }}
                />
            </Box>
        );
    }

    // Fallback for when no aspectRatio is provided (legacy behavior but with skeleton overlay if possible)
    // Without aspect ratio, we can't perfectly reserve space, but we can try.
    return (
        <Box 
            sx={[
                { 
                    position: 'relative', 
                    display: 'inline-block', 
                    width: '100%',
                    overflow: 'hidden' 
                },
                ...(Array.isArray(sx) ? sx : [sx])
            ]}
        >
             {isLoading && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%" // This might not work well if parent has no height
                    sx={{ position: 'absolute', top: 0, left: 0, minHeight: '200px' }} 
                />
            )}
            <Box
                component="img"
                src={finalSrc}
                alt={alt}
                onError={handleError}
                onLoad={handleLoad}
                ref={onImageRef}
                referrerPolicy={referrerPolicy}
                {...props}
                sx={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    objectPosition,
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                }}
            />
        </Box>
    );
};

export default ImageWithFallback;
