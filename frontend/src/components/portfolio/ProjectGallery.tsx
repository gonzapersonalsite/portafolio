import React, { useState, useEffect } from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { formatImageUrl } from '@/utils/imageUtils';

interface ProjectGalleryProps {
    open: boolean;
    onClose: () => void;
    imageUrls: string[];
    title: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ open, onClose, imageUrls, title }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);

    // Resetear el estado de la galería cada vez que se abre con un proyecto nuevo
    useEffect(() => {
        if (open) {
            setCurrentImageIndex(0);
            setZoomLevel(1);
        }
    }, [open]);

    const handleCloseGallery = () => {
        onClose();
        // Un pequeño delay para que la animación de cierre termine antes de resetear el zoom
        setTimeout(() => setZoomLevel(1), 300);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
        setZoomLevel(1);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
        setZoomLevel(1);
    };

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
    const handleResetZoom = () => setZoomLevel(1);

    if (!imageUrls || imageUrls.length === 0) {
        return null;
    }

    return (
        <Dialog 
            open={open} 
            onClose={handleCloseGallery}
            fullScreen
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)'
                }
            }}
        >
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                
                {/* Controles Top Right (Zoom y Cerrar) */}
                <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    display: 'flex',
                    gap: 1,
                    zIndex: 1300
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 2,
                        overflow: 'hidden',
                        mr: 2
                    }}>
                        <IconButton onClick={handleZoomOut} disabled={zoomLevel <= 1} sx={{ color: 'white', borderRadius: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}>
                            <ZoomOutIcon />
                        </IconButton>
                        <IconButton onClick={handleResetZoom} disabled={zoomLevel === 1} sx={{ color: 'white', borderRadius: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}>
                            <RestartAltIcon />
                        </IconButton>
                        <IconButton onClick={handleZoomIn} disabled={zoomLevel >= 4} sx={{ color: 'white', borderRadius: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}>
                            <ZoomInIcon />
                        </IconButton>
                    </Box>
                    
                    <IconButton
                        onClick={handleCloseGallery}
                        size="large"
                        sx={{ 
                            color: 'white', 
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Box>
                
                {/* Contenedor Principal de la Imagen (Fijo) */}
                <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    position: 'relative',
                    px: { xs: 2, md: 8 },
                    py: 2,
                    overflow: 'auto'
                }}>
                    {imageUrls.length > 1 && (
                        <IconButton 
                            onClick={handlePrevImage}
                            size="large"
                            sx={{ 
                                position: 'absolute', 
                                left: { xs: 8, md: 24 }, 
                                color: 'white', 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }, 
                                zIndex: 10 
                            }}
                        >
                            <ArrowBackIosNewIcon fontSize="large" />
                        </IconButton>
                    )}
                    
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img 
                            src={formatImageUrl(imageUrls[currentImageIndex])} 
                            alt={`${title} - ${currentImageIndex + 1}`}
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '100%', 
                                objectFit: 'contain',
                                filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))',
                                transform: `scale(${zoomLevel})`,
                                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                transformOrigin: 'center center',
                                cursor: zoomLevel === 1 ? 'zoom-in' : 'grab'
                            }}
                            onClick={zoomLevel === 1 ? handleZoomIn : undefined}
                        />
                    </Box>
                    
                    {imageUrls.length > 1 && (
                        <IconButton 
                            onClick={handleNextImage}
                            size="large"
                            sx={{ 
                                position: 'absolute', 
                                right: { xs: 8, md: 24 }, 
                                color: 'white', 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }, 
                                zIndex: 10 
                            }}
                        >
                            <ArrowForwardIosIcon fontSize="large" />
                        </IconButton>
                    )}
                </Box>
                
                {/* Tira de Miniaturas Fija en la Base */}
                {imageUrls.length > 1 && (
                    <Box sx={{ 
                        height: '100px', 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2, 
                        overflowX: 'auto', 
                        p: 2, 
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {imageUrls.map((url, idx) => (
                            <Box 
                                key={idx} 
                                onClick={() => setCurrentImageIndex(idx)}
                                sx={{ 
                                    width: 80, 
                                    height: 56, 
                                    cursor: 'pointer',
                                    opacity: currentImageIndex === idx ? 1 : 0.4,
                                    border: currentImageIndex === idx ? '2px solid white' : '2px solid transparent',
                                    borderRadius: 1,
                                    transition: 'all 0.2s ease-in-out',
                                    backgroundImage: `url(${formatImageUrl(url)})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    flexShrink: 0,
                                    '&:hover': {
                                        opacity: 0.8,
                                        transform: 'scale(1.05)'
                                    }
                                }} 
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Dialog>
    );
};

export default ProjectGallery;