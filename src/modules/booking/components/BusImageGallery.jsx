/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 3 - UI Components)
 * File: BusImageGallery.jsx
 * * DESCRIPTION:
 * The visual anchor for Step 2 (Route Details). Consumes the resolved 
 * bucket URLs from booking.queries.js and renders a high-performance, 
 * bandwidth-friendly image gallery.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-LIBRARY CAROUSEL: Uses native CSS `scroll-snap` for 60fps 
 * mobile swiping without loading heavy JS libraries.
 * 2. PROGRESSIVE DOM RENDERING: Thumbnails use `loading="lazy"` so 
 * the user's data isn't drained downloading images they haven't looked at.
 * 3. IMMERSIVE LIGHTBOX: Includes a hardware-accelerated fullscreen 
 * viewer that locks the body scroll to prevent accidental page navigation.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ImageOff } from 'lucide-react';

export const BusImageGallery = ({ 
    images = [], 
    altTag = "AyaBus Partner Vehicle" 
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [failedImages, setFailedImages] = useState(new Set());

    // ========================================================================
    // 1. KEYBOARD NAVIGATION (For Lightbox & Desktop Accessibility)
    // ========================================================================
    const handleKeyDown = useCallback((e) => {
        if (!isLightboxOpen) return;
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') setIsLightboxOpen(false);
    }, [isLightboxOpen, activeIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (isLightboxOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isLightboxOpen]);

    // ========================================================================
    // 2. NAVIGATION LOGIC
    // ========================================================================
    const nextImage = (e) => {
        if (e) e.stopPropagation();
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleImageError = (index) => {
        setFailedImages(prev => new Set(prev).add(index));
    };

    // ========================================================================
    // 3. FAILSAFES
    // ========================================================================
    if (!images || images.length === 0) {
        return (
            <div className="gallery-empty-state">
                <ImageOff size={32} className="empty-icon" />
                <span>Interior visuals currently unavailable for this schedule.</span>
            </div>
        );
    }

    return (
        <div className="bus-gallery-chassis">
            
            {/* --- MAIN STAGE (Hero Image) --- */}
            <div className="gallery-main-stage" onClick={() => setIsLightboxOpen(true)}>
                {failedImages.has(activeIndex) ? (
                    <div className="gallery-error-state">
                        <ImageOff size={24} />
                        <span>Image could not be loaded</span>
                    </div>
                ) : (
                    <img 
                        src={images[activeIndex]} 
                        alt={`${altTag} - View ${activeIndex + 1}`} 
                        className="main-stage-img"
                        onError={() => handleImageError(activeIndex)}
                    />
                )}
                
                {/* Overlay Controls */}
                <div className="stage-overlay">
                    <div className="stage-counter">
                        {activeIndex + 1} / {images.length}
                    </div>
                    <button className="stage-expand-btn" aria-label="Open Fullscreen">
                        <Maximize2 size={18} />
                    </button>
                </div>

                {/* Quick Nav Arrows (Hidden on mobile, rely on thumbnails) */}
                {images.length > 1 && (
                    <>
                        <button className="stage-nav-btn left" onClick={prevImage}><ChevronLeft size={24}/></button>
                        <button className="stage-nav-btn right" onClick={nextImage}><ChevronRight size={24}/></button>
                    </>
                )}
            </div>

            {/* --- THUMBNAIL TRACK (Kinetic Scroll) --- */}
            {images.length > 1 && (
                <div className="gallery-thumbnail-track ayabus-hide-scrollbar">
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            className={`thumbnail-node ${idx === activeIndex ? 'is-active' : ''}`}
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`View image ${idx + 1}`}
                        >
                            {failedImages.has(idx) ? (
                                <div className="thumbnail-error"><ImageOff size={14} /></div>
                            ) : (
                                <img 
                                    src={img} 
                                    alt={`Thumbnail ${idx + 1}`} 
                                    loading="lazy" 
                                    onError={() => handleImageError(idx)}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* --- IMMERSIVE LIGHTBOX OVERLAY --- */}
            {isLightboxOpen && (
                <div className="gallery-lightbox-vault">
                    <div className="lightbox-backdrop" onClick={() => setIsLightboxOpen(false)} />
                    
                    <button className="lightbox-close-btn" onClick={() => setIsLightboxOpen(false)}>
                        <X size={28} />
                    </button>

                    <div className="lightbox-content">
                        {images.length > 1 && (
                            <button className="lightbox-nav-btn left" onClick={prevImage}><ChevronLeft size={36}/></button>
                        )}
                        
                        <img 
                            src={images[activeIndex]} 
                            alt={`Fullscreen ${altTag}`} 
                            className="lightbox-img" 
                        />

                        {images.length > 1 && (
                            <button className="lightbox-nav-btn right" onClick={nextImage}><ChevronRight size={36}/></button>
                        )}
                    </div>
                    
                    <div className="lightbox-footer">
                        {activeIndex + 1} OF {images.length} • {altTag.toUpperCase()}
                    </div>
                </div>
            )}

            {/* ========================================================================
                4. COMPONENT SCOPED STYLES (African Physics)
                Strictly bound to index.css for Dark/Light mode inheritance.
            ======================================================================== */}
            <style>{`
                .bus-gallery-chassis {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                }

                .gallery-empty-state {
                    width: 100%;
                    aspect-ratio: 16/9;
                    background: var(--bg-surface);
                    border: 1px dashed var(--border-subtle);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    color: var(--text-muted);
                    font-size: 13px;
                    font-weight: 500;
                    text-align: center;
                    padding: 24px;
                }

                .empty-icon { opacity: 0.5; }

                /* --- MAIN STAGE --- */
                .gallery-main-stage {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16/9; /* Standard cinematic ratio, prevents layout shift */
                    background: var(--bg-surface);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-subtle);
                    overflow: hidden;
                    cursor: zoom-in;
                    isolation: isolate;
                }

                .main-stage-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s var(--ease-main);
                }
                
                .gallery-main-stage:hover .main-stage-img {
                    transform: scale(1.02);
                }

                .gallery-error-state {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: var(--status-error);
                    gap: 8px;
                    font-size: 12px;
                    background: color-mix(in srgb, var(--status-error) 10%, transparent);
                }

                /* --- OVERLAYS & CONTROLS --- */
                .stage-overlay {
                    position: absolute;
                    bottom: 12px;
                    right: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    z-index: 2;
                }

                .stage-counter {
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    color: #FFF;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }

                .stage-expand-btn {
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    color: #FFF;
                    border: none;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .stage-expand-btn:hover { background: var(--brand-primary); }

                .stage-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.9);
                    color: #000;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 2;
                    opacity: 0;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .gallery-main-stage:hover .stage-nav-btn { opacity: 1; }
                .stage-nav-btn:hover { background: var(--brand-primary); color: #FFF; transform: translateY(-50%) scale(1.1); }
                .stage-nav-btn.left { left: 16px; }
                .stage-nav-btn.right { right: 16px; }

                /* --- THUMBNAIL TRACK --- */
                .gallery-thumbnail-track {
                    display: flex;
                    gap: 8px;
                    width: 100%;
                    overflow-x: auto;
                    overscroll-behavior-x: contain;
                    scroll-snap-type: x mandatory;
                    padding-bottom: 4px; /* Scrollbar padding */
                }

                .thumbnail-node {
                    flex: 0 0 calc(25% - 6px); /* Show exactly 4 at a time on desktop */
                    aspect-ratio: 16/9;
                    border-radius: var(--radius-md);
                    border: 2px solid transparent;
                    overflow: hidden;
                    cursor: pointer;
                    padding: 0;
                    background: var(--bg-surface);
                    scroll-snap-align: start;
                    transition: all 0.2s;
                    opacity: 0.6;
                }

                .thumbnail-node:hover { opacity: 1; }
                .thumbnail-node.is-active {
                    border-color: var(--brand-primary);
                    opacity: 1;
                    box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-primary) 30%, transparent);
                }

                .thumbnail-node img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .thumbnail-error {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                }

                /* --- THE LIGHTBOX VAULT --- */
                .gallery-lightbox-vault {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    z-index: var(--z-modal);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.2s ease-out;
                }

                .lightbox-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(8px);
                }

                .lightbox-close-btn {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    background: rgba(255,255,255,0.1);
                    color: #FFF;
                    border: none;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: background 0.2s;
                }
                .lightbox-close-btn:hover { background: var(--status-error); }

                .lightbox-content {
                    position: relative;
                    width: 100%;
                    max-width: 1200px;
                    height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                    padding: 0 80px;
                }

                .lightbox-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    user-select: none;
                }

                .lightbox-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: transparent;
                    color: rgba(255,255,255,0.5);
                    border: none;
                    cursor: pointer;
                    padding: 20px;
                    transition: color 0.2s, transform 0.2s;
                }
                .lightbox-nav-btn:hover { color: #FFF; transform: translateY(-50%) scale(1.1); }
                .lightbox-nav-btn.left { left: 16px; }
                .lightbox-nav-btn.right { right: 16px; }

                .lightbox-footer {
                    position: absolute;
                    bottom: 24px;
                    color: rgba(255,255,255,0.7);
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    z-index: 2;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 768px) {
                    /* On mobile, stage arrows interfere with swiping. Hide them. */
                    .stage-nav-btn { display: none !important; }
                    
                    /* Show 3.5 thumbnails on mobile to hint at scrollability */
                    .thumbnail-node { flex: 0 0 calc(30% - 6px); }

                    /* Tighten lightbox for mobile */
                    .lightbox-content { padding: 0; height: 100vh; }
                    .lightbox-nav-btn { display: none; /* Mobile relies on edge tapping/swiping in OS */ }
                    .lightbox-close-btn { top: 16px; right: 16px; width: 40px; height: 40px; }
                }
            `}</style>
        </div>
    );
};