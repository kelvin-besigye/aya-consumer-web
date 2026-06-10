/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Marketing (Module 12/24)
 * File: src/modules/marketing/components/FeatureDetailModal.jsx
 * * DESCRIPTION:
 * The expansion view for the Marketing Carousel. When a user taps a card, 
 * this component intercepts the screen to deliver the deep-dive value proposition.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. RESPONSIVE CHASSIS: Centers on desktop with a scale-fade, but docks 
 * flawlessly to the bottom of the screen on mobile as a thumb-friendly sheet.
 * 2. COGNITIVE ISOLATION: Locks background scrolling and utilizes a heavy 
 * CSS backdrop-blur to ensure the user actually reads the sales copy.
 * 3. HARDWARE ACCELERATION: All entrance and exit animations are bound to 
 * opacity and transform to guarantee 60fps rendering without CPU layout shifts.
 */

import React, { useEffect } from 'react';
import { 
    X, 
    CheckCircle2, 
    Armchair, 
    Gift, 
    SmartphoneNfc, 
    RefreshCcw, 
    Headset,
    Sparkles 
} from 'lucide-react';

// ========================================================================
// 1. THE ICON RESOLVER (Mirrors the CarouselCard)
// ========================================================================
const ICON_MAP = {
    'Armchair': Armchair,
    'Gift': Gift,
    'SmartphoneNfc': SmartphoneNfc,
    'RefreshCcw': RefreshCcw,
    'Headset': Headset
};

export const FeatureDetailModal = ({ isOpen, onClose, feature }) => {
    
    // ========================================================================
    // 2. THE OS INTERCEPTORS (Keyboard & Scroll Lock)
    // ========================================================================
    useEffect(() => {
        if (!isOpen) return;

        // Lock the body from scrolling underneath the modal
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Intercept Escape key for accessible exiting
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup function fires when modal closes or component unmounts
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Failsafe: Do not render anything if closed or data is missing
    if (!isOpen || !feature) return null;

    // Resolve Icon & Payload Data
    const IconComponent = ICON_MAP[feature.iconName] || Sparkles;
    const { title, body, bullet_points, cta_text } = feature.modal;

    // ========================================================================
    // 3. RENDER PAYLOAD
    // ========================================================================
    return (
        <div 
            className="fdm-overlay" 
            onClick={onClose} // Clicking the blurred background closes it
            role="dialog"
            aria-modal="true"
            aria-labelledby="fdm-title"
        >
            {/* Stop Propagation prevents the click event from bubbling up 
              to the overlay when the user clicks inside the white card 
            */}
            <div className="fdm-chassis slide-up-fade" onClick={(e) => e.stopPropagation()}>
                
                {/* --- HEADER ZONE --- */}
                <div className="fdm-header">
                    <div className="fdm-hero-icon-wrapper">
                        <IconComponent size={28} className="fdm-hero-icon" />
                    </div>
                    <button className="fdm-close-btn" onClick={onClose} aria-label="Close details">
                        <X size={24} />
                    </button>
                </div>

                {/* --- CONTENT DOMAIN --- */}
                <div className="fdm-scroll-body">
                    <h2 id="fdm-title" className="fdm-title">{title}</h2>
                    <p className="fdm-body-text">{body}</p>

                    {/* The Value Proposition Checklist */}
                    {bullet_points && bullet_points.length > 0 && (
                        <ul className="fdm-bullet-list">
                            {bullet_points.map((point, index) => (
                                <li key={index} className="fdm-bullet-item">
                                    <CheckCircle2 size={18} className="fdm-check-icon" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* --- ACTION FOOTER --- */}
                <div className="fdm-footer">
                    <button className="ayabus-btn fdm-cta-btn" onClick={onClose}>
                        {cta_text || 'Got it'}
                    </button>
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                /* --- OVERLAY & BLUR --- */
                .fdm-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: var(--z-modal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    padding: 24px;
                    animation: fadeInOverlay 0.3s ease-out;
                }

                /* --- THE CHASSIS --- */
                .fdm-chassis {
                    background: var(--bg-surface);
                    width: 100%;
                    max-width: 480px;
                    border-radius: var(--radius-xl);
                    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid var(--border-subtle);
                    /* Max height ensures it never bleeds off a short screen */
                    max-height: 90vh; 
                }

                /* --- HEADER --- */
                .fdm-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 24px 24px 16px 24px;
                }

                .fdm-hero-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 56px;
                    height: 56px;
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    border-radius: var(--radius-lg);
                }

                .fdm-hero-icon {
                    color: var(--brand-primary);
                }

                .fdm-close-btn {
                    background: var(--bg-body);
                    border: none;
                    color: var(--text-muted);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .fdm-close-btn:hover {
                    background: var(--border-subtle);
                    color: var(--text-main);
                    transform: rotate(90deg);
                }

                /* --- SCROLLABLE BODY --- */
                .fdm-scroll-body {
                    padding: 0 24px 24px 24px;
                    overflow-y: auto;
                    flex-grow: 1;
                }

                /* Custom Scrollbar for the inner content */
                .fdm-scroll-body::-webkit-scrollbar { width: 6px; }
                .fdm-scroll-body::-webkit-scrollbar-track { background: transparent; }
                .fdm-scroll-body::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 10px; }

                .fdm-title {
                    margin: 0 0 12px 0;
                    font-size: 24px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                    line-height: 1.2;
                }

                .fdm-body-text {
                    margin: 0 0 24px 0;
                    font-size: 15px;
                    color: var(--text-muted);
                    line-height: 1.6;
                    font-weight: 500;
                }

                /* --- BULLET LIST --- */
                .fdm-bullet-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .fdm-bullet-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    background: var(--bg-body);
                    padding: 16px;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border-subtle);
                }

                .fdm-check-icon {
                    color: var(--brand-primary);
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .fdm-bullet-item span {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-main);
                    line-height: 1.4;
                }

                /* --- FOOTER --- */
                .fdm-footer {
                    padding: 24px;
                    border-top: 1px solid var(--border-subtle);
                    background: var(--bg-surface);
                }

                .fdm-cta-btn {
                    width: 100%;
                    height: 52px;
                    font-size: 16px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    border-radius: var(--radius-md);
                }

                /* --- ANIMATIONS --- */
                @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .slide-up-fade {
                    animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                @keyframes slideUpFade {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* --- MOBILE DOCKING (The Apple Pay Style Sheet) --- */
                @media (max-width: 600px) {
                    .fdm-overlay {
                        padding: 0;
                        align-items: flex-end; /* Pushes the modal to the bottom */
                    }
                    .fdm-chassis {
                        max-width: 100%;
                        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
                        border-bottom: none;
                        border-left: none;
                        border-right: none;
                        /* Give extra padding at the bottom for the iPhone Home Bar */
                        padding-bottom: 24px; 
                        max-height: 85vh; /* Prevents it from covering the very top of the phone screen */
                    }
                    /* Override the animation to be a pure vertical slide up from the bottom edge */
                    @keyframes slideUpFade {
                        0% { transform: translateY(100%); }
                        100% { transform: translateY(0); }
                    }
                }
            `}</style>
        </div>
    );
};