/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Marketing (Module 12/24)
 * File: src/modules/marketing/components/MarketingCarousel.jsx
 * * DESCRIPTION:
 * The apex kinetic track. It renders the CarouselCard components inside a 
 * hardware-accelerated horizontal flex container.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ADAPTIVE PHYSICS ENGINE: Uses `requestAnimationFrame` for continuous, 
 * jitter-free autonomous drifting. It seamlessly switches to CSS `scroll-snap` 
 * the moment user interaction is detected.
 * 2. INFINITE ILLUSION: Clones the payload data to create a continuous loop, 
 * resetting the scroll position mathematically behind the scenes.
 * 3. OPTICAL MASKING: Employs a `-webkit-mask-image` linear gradient to fade 
 * the edges of the track into the background, creating a premium depth-of-field effect.
 */

import React, { useEffect, useRef, useState } from 'react';
import { CarouselCard } from './CarouselCard';

export const MarketingCarousel = ({ features = [], onFeatureSelect }) => {
    // ========================================================================
    // 1. HARDWARE REFS & STATE
    // ========================================================================
    const trackRef = useRef(null);
    const isInteractingRef = useRef(false);
    const [isSnapping, setIsSnapping] = useState(false);

    // To create the infinite loop, we render the array 3 times.
    const infiniteFeatures = [...features, ...features, ...features];

    // ========================================================================
    // 2. THE KINETIC AUTO-SCROLL ENGINE
    // ========================================================================
    useEffect(() => {
        const track = trackRef.current;
        if (!track || features.length === 0) return;

        let animationFrameId;
        let lastTimestamp = performance.now();
        let exactScrollX = track.scrollLeft;

        // Auto-scroll velocity (pixels per millisecond)
        const VELOCITY = 0.035; 

        const driftLoop = (timestamp) => {
            if (!isInteractingRef.current) {
                const deltaTime = timestamp - lastTimestamp;
                
                // Calculate new position
                exactScrollX += (VELOCITY * deltaTime);

                // THE INFINITE RESET LOGIC:
                // If we have scrolled exactly one-third of the total cloned width,
                // we silently snap back to the beginning of the second clone.
                // Because the clones are identical, the user's eye cannot detect the reset.
                const oneThirdWidth = track.scrollWidth / 3;
                if (exactScrollX >= oneThirdWidth * 2) {
                    exactScrollX = oneThirdWidth;
                }

                track.scrollLeft = exactScrollX;
            } else {
                // If the user is actively scrolling, sync the internal mathematical tracker 
                // to their physical position so it doesn't jump when they let go.
                exactScrollX = track.scrollLeft;
            }

            lastTimestamp = timestamp;
            animationFrameId = requestAnimationFrame(driftLoop);
        };

        animationFrameId = requestAnimationFrame(driftLoop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [features.length]);

    // ========================================================================
    // 3. INTERACTION INTERCEPTORS
    // ========================================================================
    const handleInteractionStart = () => {
        isInteractingRef.current = true;
        setIsSnapping(true); // Turn on CSS mandatory snapping
    };

    const handleInteractionEnd = () => {
        isInteractingRef.current = false;
        // Delay removing snap to allow the CSS scroll-snap animation to finish settling
        setTimeout(() => {
            if (!isInteractingRef.current) {
                setIsSnapping(false);
            }
        }, 1000); 
    };

    // Failsafe rendering
    if (!features || features.length === 0) return null;

    // ========================================================================
    // 4. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="mcar-viewport">
            
            {/* The optical mask container provides the faded edges */}
            <div className="mcar-mask-container">
                <div 
                    ref={trackRef}
                    className={`mcar-track ${isSnapping ? 'mcar-snap-active' : 'mcar-drift-active'}`}
                    onMouseEnter={handleInteractionStart}
                    onMouseLeave={handleInteractionEnd}
                    onTouchStart={handleInteractionStart}
                    onTouchEnd={handleInteractionEnd}
                    onFocus={handleInteractionStart}
                    onBlur={handleInteractionEnd}
                    aria-live="off"
                >
                    {infiniteFeatures.map((feature, index) => (
                        <CarouselCard 
                            key={`${feature.id}-${index}`} 
                            feature={feature} 
                            onClick={onFeatureSelect}
                        />
                    ))}
                    
                    {/* Visual spacer to prevent the last card from hugging the wall perfectly */}
                    <div className="mcar-spacer" />
                </div>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .mcar-viewport {
                    width: 100%;
                    position: relative;
                    padding: 24px 0;
                    background: transparent;
                }

                /* --- OPTICAL MASKING --- */
                /* This creates a gradient that is transparent at the extreme edges, 
                   fading to solid black in the middle. When used as a mask, it 
                   smoothly fades the cards out as they scroll off-screen. */
                .mcar-mask-container {
                    width: 100%;
                    -webkit-mask-image: linear-gradient(
                        90deg, 
                        transparent 0%, 
                        rgba(0,0,0,1) 5%, 
                        rgba(0,0,0,1) 95%, 
                        transparent 100%
                    );
                    mask-image: linear-gradient(
                        90deg, 
                        transparent 0%, 
                        rgba(0,0,0,1) 5%, 
                        rgba(0,0,0,1) 95%, 
                        transparent 100%
                    );
                }

                /* --- THE TRACK --- */
                .mcar-track {
                    display: flex;
                    gap: 20px;
                    padding: 16px 24px; /* Padding accommodates box-shadow hover states */
                    overflow-x: auto;
                    
                    /* Hide scrollbars completely for a clean app feel */
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE and Edge */
                }
                .mcar-track::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                }

                /* Physics Toggle 1: User is touching the carousel */
                .mcar-snap-active {
                    scroll-snap-type: x mandatory;
                    scroll-behavior: smooth;
                    /* Allows smooth inertial scrolling on iOS */
                    -webkit-overflow-scrolling: touch; 
                }

                /* Physics Toggle 2: The system is auto-scrolling */
                .mcar-drift-active {
                    scroll-snap-type: none;
                    scroll-behavior: auto;
                    /* Disable pointer events on the track while drifting so random 
                       touches don't register until InteractionStart fires */
                    cursor: grab;
                }
                
                .mcar-drift-active:active {
                    cursor: grabbing;
                }

                /* Spacer element to ensure the math for the infinite loop padding stays exact */
                .mcar-spacer {
                    flex-shrink: 0;
                    width: 4px;
                    height: 1px;
                }

                /* --- RESPONSIVE ADJUSTMENTS --- */
                @media (max-width: 768px) {
                    .mcar-track {
                        gap: 16px;
                        padding: 12px 16px;
                    }
                    .mcar-mask-container {
                        /* On smaller mobile screens, make the fade edge sharper */
                        -webkit-mask-image: linear-gradient(
                            90deg, 
                            transparent 0%, 
                            rgba(0,0,0,1) 8%, 
                            rgba(0,0,0,1) 92%, 
                            transparent 100%
                        );
                    }
                }
            `}</style>
        </div>
    );
};