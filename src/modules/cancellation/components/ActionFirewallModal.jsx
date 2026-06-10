/**
 * 🌍 AYABUS CONSUMER WEB (The Friction Engine)
 * ------------------------------------------------------------------
 * Module: Cancellations (Module 10/24)
 * File: src/modules/cancellations/components/ActionFirewallModal.jsx
 * * DESCRIPTION:
 * The final security checkpoint before a destructive database commit. 
 * It employs a kinetic "Hold-to-Confirm" mechanic to mathematically 
 * guarantee user intent and eliminate accidental taps on mobile devices.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. KINETIC INTENT ENGINE: Uses `requestAnimationFrame` to power a 
 * buttery-smooth 1.5-second hold requirement. Releasing early aborts immediately.
 * 2. TOUCH-SAFE GEOMETRY: Disables native mobile behaviors (`touch-action: none`, 
 * `user-select: none`) on the button so the phone doesn't try to zoom or scroll 
 * while the user is holding their finger down.
 * 3. ISOLATED Z-INDEX DOMAIN: Mounts over the entire viewport with a blurred 
 * backdrop to force absolute cognitive focus on the financial consequence.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    AlertOctagon, 
    X, 
    ShieldAlert, 
    Loader2,
    ArrowRight
} from 'lucide-react';

export const ActionFirewallModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    ticket, 
    previewData, 
    isProcessing 
}) => {
    // ========================================================================
    // 1. THE KINETIC STATE MACHINE
    // ========================================================================
    const HOLD_DURATION = 1500; // 1.5 seconds to confirm
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);

    // Mutable refs to track animation outside the React render cycle for 60fps performance
    const requestRef = useRef(null);
    const startTimeRef = useRef(0);
    const isHoldingRef = useRef(false);
    const hasTriggeredRef = useRef(false);

    // --- UTILITY ---
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', currency: 'UGX', minimumFractionDigits: 0 
        }).format(amount || 0);
    };

    // ========================================================================
    // 2. THE ANIMATION LOOP (African Physics Engine)
    // ========================================================================
    const animateHold = useCallback(() => {
        if (!isHoldingRef.current) return;

        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
        
        setHoldProgress(progress);

        if (progress < 100) {
            requestRef.current = requestAnimationFrame(animateHold);
        } else {
            // FIREWALL BREACHED: Intent guaranteed. Execute action.
            if (!hasTriggeredRef.current) {
                hasTriggeredRef.current = true;
                onConfirm(); // Trigger the database commit
            }
        }
    }, [onConfirm]);

    // ========================================================================
    // 3. EVENT HANDLERS
    // ========================================================================
    const handlePointerDown = (e) => {
        // Prevent accidental triggers if already processing or missing data
        if (isProcessing || !previewData?.isEligible) return;
        
        // Disable native mobile behaviors during the press
        if (e.cancelable) e.preventDefault(); 
        
        isHoldingRef.current = true;
        hasTriggeredRef.current = false;
        startTimeRef.current = Date.now();
        setIsHolding(true);
        requestRef.current = requestAnimationFrame(animateHold);
    };

    const handlePointerUpOrLeave = () => {
        isHoldingRef.current = false;
        setIsHolding(false);
        setHoldProgress(0);
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
    };

    // Failsafe: Cleanup animation frames if component unmounts mid-hold
    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setHoldProgress(0);
            setIsHolding(false);
            hasTriggeredRef.current = false;
        }
    }, [isOpen]);

    // ========================================================================
    // 4. RENDER PAYLOAD
    // ========================================================================
    if (!isOpen) return null;

    // Failsafe extraction
    const estimatedRefund = previewData?.estimatedRefund || 0;
    const penaltyAmount = previewData?.penaltyAmount || 0;
    const seatNumber = ticket?.seat_number || 'N/A';

    return (
        <div className="afm-overlay">
            <div className="afm-backdrop" onClick={!isProcessing ? onClose : undefined} />
            
            <div className="afm-chassis slide-up-bounce">
                
                {/* --- HEADER --- */}
                <div className="afm-header">
                    <div className="afm-title-row">
                        <AlertOctagon size={24} className="text-danger" />
                        <h2>Confirm Cancellation</h2>
                    </div>
                    {!isProcessing && (
                        <button className="afm-close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* --- CONTEXT BODY --- */}
                <div className="afm-body">
                    <p className="afm-warning-text">
                        You are about to permanently cancel your seat (Seat {seatNumber}). 
                        This action cannot be undone, and the seat will be immediately released to other passengers.
                    </p>

                    {/* Financial Failsafe Recap */}
                    <div className="afm-financial-recap">
                        <div className="afm-recap-row">
                            <span>Penalty Applied:</span>
                            <span className="text-danger">- {formatMoney(penaltyAmount)}</span>
                        </div>
                        <div className="afm-recap-divider" />
                        <div className="afm-recap-row afm-recap-final">
                            <span>Final Refund Amount:</span>
                            <span className={estimatedRefund > 0 ? "text-success" : "text-main"}>
                                {formatMoney(estimatedRefund)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- THE KINETIC ACTION ZONE --- */}
                <div className="afm-footer">
                    <button 
                        className={`afm-hold-btn ${isProcessing ? 'afm-btn-processing' : ''}`}
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUpOrLeave}
                        onPointerLeave={handlePointerUpOrLeave}
                        // Touch cancel ensures we catch system interruptions (like a phone call)
                        onTouchCancel={handlePointerUpOrLeave} 
                        disabled={isProcessing || !previewData?.isEligible}
                    >
                        {/* The Fill Progress Bar */}
                        <div 
                            className="afm-hold-progress" 
                            style={{ width: `${holdProgress}%` }}
                        />
                        
                        {/* The Button Content (Z-indexed above the progress bar) */}
                        <div className="afm-btn-content">
                            {isProcessing ? (
                                <>
                                    <Loader2 size={18} className="afm-spin" />
                                    <span>Processing Cancellation...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldAlert size={18} />
                                    <span>{isHolding ? 'Keep Holding...' : 'Press and Hold to Cancel'}</span>
                                </>
                            )}
                        </div>
                    </button>
                    
                    {!isProcessing && (
                        <button className="afm-abort-btn" onClick={onClose}>
                            Abort and Keep Ticket
                        </button>
                    )}
                </div>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                /* --- OVERLAY DOMAIN --- */
                .afm-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: var(--z-modal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                }

                .afm-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    animation: fadeIn 0.2s ease-out;
                }

                /* --- CHASSIS --- */
                .afm-chassis {
                    position: relative;
                    width: 100%;
                    max-width: 440px;
                    background: var(--bg-surface);
                    border-radius: var(--radius-xl);
                    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid var(--border-subtle);
                }

                /* --- HEADER --- */
                .afm-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 24px 16px 24px;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .afm-title-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .afm-title-row h2 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .afm-close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .afm-close-btn:hover {
                    background: var(--bg-body);
                    color: var(--text-main);
                }

                /* --- BODY --- */
                .afm-body {
                    padding: 24px;
                }

                .afm-warning-text {
                    margin: 0 0 24px 0;
                    font-size: 15px;
                    line-height: 1.6;
                    color: var(--text-muted);
                }

                /* --- FINANCIAL RECAP --- */
                .afm-financial-recap {
                    background: var(--bg-body);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 16px;
                }

                .afm-recap-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                .afm-recap-divider {
                    height: 1px;
                    background: var(--border-subtle);
                    margin: 12px 0;
                }

                .afm-recap-final {
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .text-danger { color: #EF4444; }
                .text-success { color: #10B981; }
                .text-main { color: var(--text-main); }

                /* --- FOOTER & HOLD BUTTON --- */
                .afm-footer {
                    padding: 0 24px 24px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .afm-hold-btn {
                    position: relative;
                    width: 100%;
                    height: 56px;
                    border: none;
                    border-radius: var(--radius-md);
                    background: color-mix(in srgb, #EF4444 15%, transparent);
                    overflow: hidden;
                    cursor: pointer;
                    outline: none;
                    /* CRITICAL FOR TOUCH DEVICES */
                    touch-action: none; 
                    user-select: none;
                    -webkit-user-select: none;
                }

                .afm-hold-btn:active {
                    transform: scale(0.98);
                }

                .afm-hold-btn:disabled {
                    cursor: not-allowed;
                    transform: none;
                }

                .afm-btn-processing {
                    background: var(--bg-body) !important;
                    border: 1px solid var(--border-subtle);
                }

                /* The actual expanding red bar */
                .afm-hold-progress {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background: #EF4444;
                    z-index: 1;
                    /* Smooth snapping when released early */
                    transition: width 0.1s linear; 
                }

                /* The text/icon inside the button */
                .afm-btn-content {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 15px;
                    font-weight: 800;
                    color: #EF4444;
                    transition: color 0.2s;
                }

                /* Make text white if the progress bar overtakes it */
                .afm-hold-btn:active .afm-btn-content {
                    color: #FFF;
                    /* Drop shadow ensures text is readable while bar sweeps across */
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }

                .afm-btn-processing .afm-btn-content {
                    color: var(--text-main);
                }

                .afm-abort-btn {
                    background: transparent;
                    border: 1px solid transparent;
                    color: var(--text-muted);
                    height: 44px;
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .afm-abort-btn:hover {
                    color: var(--text-main);
                    background: var(--bg-body);
                }

                .afm-spin { animation: spin 1s linear infinite; }

                /* --- ANIMATIONS --- */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .slide-up-bounce {
                    animation: slideUpBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }
                
                @keyframes slideUpBounce {
                    0% { opacity: 0; transform: translateY(30px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* --- RESPONSIVE --- */
                @media (max-width: 480px) {
                    .afm-overlay { align-items: flex-end; padding: 0; }
                    .afm-chassis { 
                        border-radius: var(--radius-xl) var(--radius-xl) 0 0; 
                        max-width: 100%;
                        border-bottom: none;
                        border-left: none;
                        border-right: none;
                    }
                    /* On mobile, swiping up from bottom replaces the scale bounce */
                    @keyframes slideUpBounce {
                        0% { opacity: 0; transform: translateY(100%); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                }
            `}</style>
        </div>
    );
};