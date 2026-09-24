import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTranslation } from 'react-i18next';
import { fitSize, type Size } from '../lib/fitSize';

export interface GallerySlide {
    src: string;
    thumbSrc: string;
    alt: string;
}

interface ProjectGalleryProps {
    title: string;
    slides: GallerySlide[];
    onClose: () => void;
}

const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;
const PAN_STEP_PX = 80;

// While zoomed, the arrow keys pan the image instead of changing it.
const PAN_DIRECTIONS: Record<string, readonly [number, number]> = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
};

// White icons on a dark translucent background stay legible over light and dark screenshots.
const controlSx = {
    color: 'common.white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
} as const;

const groupedControlSx = {
    color: 'common.white',
    borderRadius: 0,
    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.3)' },
} as const;

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ title, slides, onClose }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [naturalSize, setNaturalSize] = useState<(Size & { src: string }) | null>(null);
    const [viewportSize, setViewportSize] = useState<Size | null>(null);
    const [dragging, setDragging] = useState(false);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const thumbnailRefs = useRef<Array<HTMLElement | null>>([]);
    // Point of the image, as a fraction of the scrollable area, that stays centred across zoom changes.
    const focalPoint = useRef({ x: 0.5, y: 0.5 });
    const dragStart = useRef<{ x: number; y: number; left: number; top: number } | null>(null);

    const total = slides.length;
    const slide = slides[currentIndex];
    const zoomed = zoomLevel > 1;
    const fittedSize =
        naturalSize?.src === slide.src && viewportSize ? fitSize(naturalSize, viewportSize) : null;

    const changeZoom = (next: (current: number) => number) => {
        const viewport = viewportRef.current;
        if (viewport) {
            focalPoint.current = {
                x: (viewport.scrollLeft + viewport.clientWidth / 2) / viewport.scrollWidth,
                y: (viewport.scrollTop + viewport.clientHeight / 2) / viewport.scrollHeight,
            };
        }
        setZoomLevel((current) => Math.min(Math.max(next(current), 1), MAX_ZOOM));
    };
    const zoomIn = () => changeZoom((current) => current + ZOOM_STEP);
    const zoomOut = () => changeZoom((current) => current - ZOOM_STEP);
    const resetZoom = () => changeZoom(() => 1);

    const showImage = (index: number) => {
        setCurrentIndex(index);
        setZoomLevel(1);
    };
    const stepImage = (delta: number) => {
        setCurrentIndex((current) => (current + delta + total) % total);
        setZoomLevel(1);
    };

    // The image is sized from its fitted size, so the zoomed overflow can be scrolled to on every side.
    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        viewport.scrollLeft = focalPoint.current.x * viewport.scrollWidth - viewport.clientWidth / 2;
        viewport.scrollTop = focalPoint.current.y * viewport.scrollHeight - viewport.clientHeight / 2;
    }, [zoomLevel]);

    // Measures the space available to the image. A callback ref, because the dialog mounts its
    // content after the first commit. The border box ignores scrollbars, so showing them while
    // zoomed does not feed back into the fitted size.
    const attachViewport = useCallback((viewport: HTMLDivElement | null) => {
        viewportRef.current = viewport;
        if (!viewport) return;
        const observer = new ResizeObserver(() => {
            const style = getComputedStyle(viewport);
            setViewportSize({
                width: viewport.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
                height: viewport.offsetHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
            });
        });
        observer.observe(viewport, { box: 'border-box' });
        return () => {
            observer.disconnect();
            viewportRef.current = null;
        };
    }, []);

    // Arrow keys and buttons change the image without touching the strip; keep the active
    // thumbnail in view when the strip overflows (phones with many images).
    useEffect(() => {
        thumbnailRefs.current[currentIndex]?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const panDirection = PAN_DIRECTIONS[event.key];
            if (zoomed && panDirection) {
                event.preventDefault();
                viewportRef.current?.scrollBy({ left: panDirection[0] * PAN_STEP_PX, top: panDirection[1] * PAN_STEP_PX });
            } else if (event.key === 'ArrowLeft' && total > 1) {
                stepImage(-1);
            } else if (event.key === 'ArrowRight' && total > 1) {
                stepImage(1);
            } else if (event.key === '+' || event.key === '=') {
                zoomIn();
            } else if (event.key === '-') {
                zoomOut();
            } else if (event.key === '0') {
                resetZoom();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    // Mouse drag pans the zoomed image; touch screens already pan the scroll container natively.
    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const viewport = viewportRef.current;
        if (!zoomed || !viewport || event.pointerType !== 'mouse' || event.button !== 0) return;
        dragStart.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
        viewport.setPointerCapture(event.pointerId);
        setDragging(true);
    };
    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const start = dragStart.current;
        const viewport = viewportRef.current;
        if (!start || !viewport) return;
        viewport.scrollLeft = start.left - (event.clientX - start.x);
        viewport.scrollTop = start.top - (event.clientY - start.y);
    };
    const handlePointerEnd = () => {
        dragStart.current = null;
        setDragging(false);
    };

    const imageSize: React.CSSProperties = fittedSize
        ? { width: fittedSize.width * zoomLevel, height: fittedSize.height * zoomLevel }
        : { maxWidth: viewportSize?.width ?? '100%', maxHeight: viewportSize?.height ?? '100%' };

    return (
        <Dialog
            open
            onClose={onClose}
            fullScreen
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)'
                    }
                }
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', color: 'common.white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
                    <DialogTitle
                        sx={{ flex: 1, minWidth: 0, p: 0, fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 700 }}
                    >
                        {title}
                    </DialogTitle>
                    <Box sx={{ ...controlSx, display: 'flex', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                        <IconButton
                            onClick={zoomOut}
                            disabled={!zoomed}
                            aria-label={t('projects.gallery.zoomOut')}
                            sx={groupedControlSx}
                        >
                            <ZoomOutIcon />
                        </IconButton>
                        <IconButton
                            onClick={resetZoom}
                            disabled={!zoomed}
                            aria-label={t('projects.gallery.resetZoom')}
                            sx={groupedControlSx}
                        >
                            <RestartAltIcon />
                        </IconButton>
                        <IconButton
                            onClick={zoomIn}
                            disabled={zoomLevel >= MAX_ZOOM}
                            aria-label={t('projects.gallery.zoomIn')}
                            sx={groupedControlSx}
                        >
                            <ZoomInIcon />
                        </IconButton>
                    </Box>
                    <IconButton
                        onClick={onClose}
                        aria-label={t('projects.gallery.close')}
                        sx={{ ...controlSx, flexShrink: 0 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex' }}>
                    <Box
                        ref={attachViewport}
                        role="region"
                        aria-label={t('projects.gallery.viewer')}
                        tabIndex={zoomed ? 0 : -1}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerEnd}
                        onPointerCancel={handlePointerEnd}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            overflow: 'auto',
                            overscrollBehavior: 'contain',
                            px: { xs: 2, md: 12 },
                            py: 2,
                            cursor: zoomed ? (dragging ? 'grabbing' : 'grab') : 'default',
                            '&:focus-visible': { outline: '2px solid white', outlineOffset: -2 },
                        }}
                    >
                        <img
                            key={slide.src}
                            src={slide.src}
                            alt={slide.alt}
                            draggable={false}
                            onLoad={(event) => {
                                const image = event.currentTarget;
                                setNaturalSize({ src: slide.src, width: image.naturalWidth, height: image.naturalHeight });
                            }}
                            onClick={zoomed ? undefined : zoomIn}
                            style={{
                                ...imageSize,
                                // Auto margins centre the image while it fits and, unlike flex
                                // centring, never push the zoomed overflow out of scroll reach.
                                margin: 'auto',
                                flexShrink: 0,
                                display: 'block',
                                filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))',
                                cursor: zoomed ? undefined : 'zoom-in',
                            }}
                        />
                    </Box>

                    {total > 1 && (
                        <>
                            <IconButton
                                onClick={() => stepImage(-1)}
                                size="large"
                                aria-label={t('projects.gallery.previousImage')}
                                sx={{
                                    ...controlSx,
                                    position: 'absolute',
                                    top: '50%',
                                    left: { xs: 8, md: 24 },
                                    transform: 'translateY(-50%)',
                                }}
                            >
                                <ArrowBackIosNewIcon fontSize="large" />
                            </IconButton>
                            <IconButton
                                onClick={() => stepImage(1)}
                                size="large"
                                aria-label={t('projects.gallery.nextImage')}
                                sx={{
                                    ...controlSx,
                                    position: 'absolute',
                                    top: '50%',
                                    right: { xs: 8, md: 24 },
                                    transform: 'translateY(-50%)',
                                }}
                            >
                                <ArrowForwardIosIcon fontSize="large" />
                            </IconButton>
                        </>
                    )}
                </Box>

                <Box role="status" sx={{ px: 2, py: 1, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {t('projects.gallery.counter', { index: currentIndex + 1, total })}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 720, mx: 'auto' }}>
                        {slide.alt}
                    </Typography>
                </Box>

                {total > 1 && (
                    <Box sx={{
                        height: '100px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        overscrollBehaviorX: 'contain',
                        p: 2,
                        scrollPaddingInline: (theme) => theme.spacing(2),
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        // Auto margins center the strip while it fits and collapse to zero once it
                        // overflows; justifyContent: 'center' would push the first thumbnails out of
                        // scroll reach on narrow screens.
                        '& > :first-of-type': { marginInlineStart: 'auto' },
                        '& > :last-of-type': { marginInlineEnd: 'auto' }
                    }}>
                        {slides.map((thumbnail, idx) => (
                            <Box
                                component="button"
                                type="button"
                                key={thumbnail.src}
                                ref={(element: HTMLElement | null) => { thumbnailRefs.current[idx] = element; }}
                                onClick={() => showImage(idx)}
                                aria-label={t('projects.gallery.thumbnail', {
                                    index: idx + 1,
                                    total,
                                    title
                                })}
                                aria-pressed={currentIndex === idx}
                                sx={{
                                    width: 80,
                                    height: 56,
                                    cursor: 'pointer',
                                    opacity: currentIndex === idx ? 1 : 0.4,
                                    border: currentIndex === idx ? '2px solid white' : '2px solid transparent',
                                    borderRadius: 1,
                                    transition: 'all 0.2s ease-in-out',
                                    backgroundImage: `url(${thumbnail.thumbSrc})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    flexShrink: 0,
                                    appearance: 'none',
                                    padding: 0,
                                    '&:hover': {
                                        opacity: 0.8,
                                        transform: 'scale(1.05)'
                                    },
                                    '&:focus-visible': {
                                        opacity: 1,
                                        outline: '2px solid white',
                                        outlineOffset: 2,
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
