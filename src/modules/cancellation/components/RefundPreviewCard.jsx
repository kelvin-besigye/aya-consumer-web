/**
 * 🌍 AYABUS CONSUMER WEB (The Friction Engine)
 * ------------------------------------------------------------------
 * Module: Cancellations (Module 10/24)
 * File: src/modules/cancellations/components/RefundPreviewCard.jsx
 * * DESCRIPTION:
 * The financial preview engine. It takes the output of the penalty.calculator
 * and renders a high-fidelity, transparent receipt. It psychologically 
 * prepares the user for the exact refund amount before they commit.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. TRANSPARENT LEDGER: Uses a strict top-down subtraction visual so the 
 * user understands exactly where their money is going.
 * 2. EMPATHETIC UX: Replaces harsh words like "Penalty" with "Adjustment" 
 * and leads with an explanation banner to soften the financial impact.
 * 3. DYNAMIC COLOR METRICS: Natively ties into index.css status variables 
 * (success/danger) to guide the user's eye instantly to the final number.
 */

import React from 'react';
import { 
    Receipt, 
    Info, 
    AlertTriangle, 
    CheckCircle2, 
    TrendingDown,
    Calculator
} from 'lucide-react';

export const RefundPreviewCard = ({ previewData, isLoading }) => {

    // ========================================================================
    // 1. UTILITIES
    // ========================================================================
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'UGX', 
            minimumFractionDigits: 0 
        }).format(amount || 0);
    };

    // ========================================================================
    // 2. BOOT & EMPTY STATES
    // ========================================================================
    if (isLoading) {
        return (
            <div className="rpc-chassis">
                <div className="rpc-skeleton-header pulse-glow" />
                <div className="rpc-skeleton-body pulse-glow" />
            </div>
        );
    }

    if (!previewData) {
        return (
            <div className="rpc-chassis rpc-empty-state">
                <div className="rpc-empty-icon-box">
                    <Calculator size={32} className="rpc-empty-icon" />
                </div>
                <h4>Refund Estimator</h4>
                <p>Select an upcoming journey from your list to calculate your estimated refund and view cancellation options.</p>
            </div>
        );
    }

    // ========================================================================
    // 3. THE MASTER LEDGER PAYLOAD
    // ========================================================================
    const {
        isEligible,
        originalTotal,
        baseFare,
        taxRetained,
        penaltyPercentage,
        penaltyAmount,
        estimatedRefund,
        explanation
    } = previewData;

    return (
        <div className="rpc-chassis slide-up">
            
            {/* --- HEADER --- */}
            <div className="rpc-header">
                <div className="rpc-title-row">
                    <Receipt size={20} className="rpc-brand-icon" />
                    <h2>Refund Estimate</h2>
                </div>
                <span className="rpc-secure-badge">Secure Calculation</span>
            </div>

            {/* --- EMPATHY BANNER --- */}
            <div className={`rpc-explanation-banner ${isEligible ? 'rpc-banner-info' : 'rpc-banner-danger'}`}>
                {isEligible ? <Info size={16} className="rpc-banner-icon" /> : <AlertTriangle size={16} className="rpc-banner-icon" />}
                <p>{explanation}</p>
            </div>

            {/* --- THE FINANCIAL LEDGER --- */}
            <div className="rpc-ledger">
                
                {/* Line 1: What they paid */}
                <div className="rpc-ledger-row rpc-muted-row">
                    <span>Original Ticket Price</span>
                    <span>{formatMoney(originalTotal)}</span>
                </div>

                {/* Line 2: The standard fee */}
                <div className="rpc-ledger-row rpc-muted-row">
                    <div className="rpc-row-label-group">
                        <span>Platform Booking Fee</span>
                        <span className="rpc-tiny-tag">Non-refundable</span>
                    </div>
                    <span>- {formatMoney(taxRetained)}</span>
                </div>

                <div className="rpc-divider-dashed" />

                {/* Line 3: The Refundable Base */}
                <div className="rpc-ledger-row rpc-base-row">
                    <span>Refundable Base Fare</span>
                    <span>{formatMoney(baseFare)}</span>
                </div>

                {/* Line 4: The Cancellation Adjustment (If applicable) */}
                {penaltyAmount > 0 && isEligible && (
                    <div className="rpc-ledger-row rpc-danger-row">
                        <div className="rpc-row-label-group">
                            <TrendingDown size={14} />
                            <span>Late Cancellation Adjustment ({penaltyPercentage}%)</span>
                        </div>
                        <span>- {formatMoney(penaltyAmount)}</span>
                    </div>
                )}

                <div className="rpc-divider-solid" />

                {/* Line 5: The Grand Total */}
                <div className="rpc-ledger-row rpc-final-row">
                    <div className="rpc-final-label">
                        <span>Estimated Refund</span>
                        {isEligible && estimatedRefund > 0 && (
                            <span className="rpc-final-subtext">Returns to original payment method</span>
                        )}
                    </div>
                    <span className={`rpc-final-amount ${estimatedRefund > 0 ? 'text-success' : 'text-danger'}`}>
                        {formatMoney(estimatedRefund)}
                    </span>
                </div>
            </div>

            {/* --- FOOTER EXPECTATIONS --- */}
            {isEligible && estimatedRefund > 0 && (
                <div className="rpc-footer-note">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>Refunds typically process within 1-3 business days depending on your bank or mobile money provider.</span>
                </div>
            )}

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for Light/Dark mode respect.
            ======================================================================== */}
            <style>{`
                .rpc-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);
                    width: 100%;
                }

                /* --- HEADER --- */
                .rpc-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .rpc-title-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .rpc-brand-icon {
                    color: var(--brand-primary);
                }

                .rpc-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .rpc-secure-badge {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--brand-primary);
                    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
                    padding: 4px 10px;
                    border-radius: var(--radius-sm);
                }

                /* --- BANNER --- */
                .rpc-explanation-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px;
                    border-radius: var(--radius-md);
                    margin-bottom: 24px;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .rpc-explanation-banner p { margin: 0; }
                .rpc-banner-icon { flex-shrink: 0; margin-top: 2px; }

                .rpc-banner-info {
                    background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
                    border: 1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent);
                    color: var(--text-main);
                }
                .rpc-banner-info .rpc-banner-icon { color: var(--brand-primary); }

                .rpc-banner-danger {
                    background: color-mix(in srgb, #EF4444 5%, transparent);
                    border: 1px solid color-mix(in srgb, #EF4444 20%, transparent);
                    color: var(--text-main);
                }
                .rpc-banner-danger .rpc-banner-icon { color: #EF4444; }

                /* --- THE LEDGER --- */
                .rpc-ledger {
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-body);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                }

                .rpc-ledger-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    font-size: 14px;
                }

                .rpc-row-label-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .rpc-muted-row {
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .rpc-tiny-tag {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    background: var(--bg-surface);
                    padding: 2px 6px;
                    border-radius: 4px;
                    border: 1px solid var(--border-subtle);
                }

                .rpc-base-row {
                    color: var(--text-main);
                    font-weight: 700;
                }

                .rpc-danger-row {
                    color: #EF4444;
                    font-weight: 600;
                }

                .rpc-divider-dashed {
                    width: 100%;
                    height: 1px;
                    background: repeating-linear-gradient(90deg, var(--border-subtle) 0, var(--border-subtle) 4px, transparent 4px, transparent 8px);
                    margin: 12px 0;
                }

                .rpc-divider-solid {
                    width: 100%;
                    height: 2px;
                    background: var(--border-subtle);
                    margin: 16px 0;
                }

                /* Final Row Formatting */
                .rpc-final-row {
                    align-items: flex-start;
                }

                .rpc-final-label {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .rpc-final-label span:first-child {
                    font-size: 16px;
                    font-weight: 900;
                    color: var(--text-main);
                }

                .rpc-final-subtext {
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .rpc-final-amount {
                    font-size: 28px;
                    font-weight: 900;
                    letter-spacing: -1px;
                    line-height: 1;
                }

                .text-success { color: #10B981; }
                .text-danger { color: #EF4444; }

                /* --- FOOTER --- */
                .rpc-footer-note {
                    margin-top: 24px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    font-size: 13px;
                    color: var(--text-muted);
                    line-height: 1.5;
                    background: color-mix(in srgb, #10B981 5%, transparent);
                    padding: 16px;
                    border-radius: var(--radius-md);
                }

                /* --- EMPTY & SKELETON STATES --- */
                .rpc-empty-state {
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    border: 1px dashed var(--border-subtle);
                    min-height: 400px;
                }

                .rpc-empty-icon-box {
                    width: 64px;
                    height: 64px;
                    background: var(--bg-body);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .rpc-empty-icon { color: var(--text-muted); }
                .rpc-empty-state h4 { margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: var(--text-main); }
                .rpc-empty-state p { margin: 0; color: var(--text-muted); font-size: 14px; max-width: 280px; line-height: 1.6; }

                .rpc-skeleton-header { height: 40px; border-radius: var(--radius-md); background: var(--bg-body); margin-bottom: 24px; width: 60%; }
                .rpc-skeleton-body { height: 300px; border-radius: var(--radius-lg); background: var(--bg-body); width: 100%; }

                /* --- ANIMATIONS --- */
                .slide-up { animation: rpcSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @keyframes rpcSlideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                
                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 480px) {
                    .rpc-chassis { padding: 24px 16px; }
                    .rpc-final-amount { font-size: 24px; }
                }
            `}</style>
        </div>
    );
};