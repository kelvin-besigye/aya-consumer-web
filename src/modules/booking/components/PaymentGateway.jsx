/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 3 - UI Components)
 * File: PaymentGateway.jsx
 * * DESCRIPTION:
 * The apex financial conversion layer (Step 4). Manages the selection 
 * of MTN MoMo, Airtel Money, or Card payments. 
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. DYNAMIC TRUST SIGNALS: Visually reinforces the "1-Click Refund" 
 * and SSL encryption policies right next to the pay button to reduce 
 * cart abandonment.
 * 2. EXPLICIT MOMO ROUTING: Separates the "Passenger Phone" from the 
 * "Payment Phone". A user might book for their mother but pay with 
 * their own MTN number.
 * 3. KINETIC POLLING STATE: When the payment fires, the button physically 
 * transforms into a pulsing instruction banner telling the user to 
 * "Check your phone for the PIN prompt", mapping directly to the 
 * polling matrix we built in payment.service.js.
 */

import React from 'react';
import { 
    Smartphone, 
    CreditCard, 
    ShieldCheck, 
    Lock, 
    Loader2, 
    Info, 
    CheckCircle2 
} from 'lucide-react';

export const PaymentGateway = ({ 
    totalAmount = 0,
    currency = 'UGX',
    selectedMethod = null, // 'MTN' | 'AIRTEL' | 'CARD'
    onSelectMethod,
    paymentPhone = '',
    onChangePaymentPhone,
    onInitiatePayment,
    isProcessing = false,
    pollingMessage = "Processing your request..."
}) => {

    // ========================================================================
    // 1. NATIVE FORMATTERS
    // ========================================================================
    const formattedTotal = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(totalAmount);

    // ========================================================================
    // 2. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="pg-chassis">
            
            {/* --- HEADER & SECURE TOTAL --- */}
            <div className="pg-header-vault">
                <div className="pg-header-text">
                    <h3>Payment Details</h3>
                    <p className="text-muted">All transactions are secure and encrypted.</p>
                </div>
                <div className="pg-total-display">
                    <span className="total-label">Total to Pay</span>
                    <span className="total-value">{formattedTotal}</span>
                </div>
            </div>

            {/* --- PAYMENT METHOD SELECTORS --- */}
            <div className="pg-method-grid">
                
                {/* MTN Mobile Money */}
                <button 
                    className={`pg-method-card ${selectedMethod === 'MTN' ? 'is-active mtn-theme' : ''}`}
                    onClick={() => onSelectMethod('MTN')}
                    disabled={isProcessing}
                    aria-pressed={selectedMethod === 'MTN'}
                >
                    <div className="method-icon-circle mtn-icon">
                        <Smartphone size={20} />
                    </div>
                    <span className="method-name">MTN MoMo</span>
                    {selectedMethod === 'MTN' && <CheckCircle2 size={16} className="active-check" />}
                </button>

                {/* Airtel Money */}
                <button 
                    className={`pg-method-card ${selectedMethod === 'AIRTEL' ? 'is-active airtel-theme' : ''}`}
                    onClick={() => onSelectMethod('AIRTEL')}
                    disabled={isProcessing}
                    aria-pressed={selectedMethod === 'AIRTEL'}
                >
                    <div className="method-icon-circle airtel-icon">
                        <Smartphone size={20} />
                    </div>
                    <span className="method-name">Airtel Money</span>
                    {selectedMethod === 'AIRTEL' && <CheckCircle2 size={16} className="active-check" />}
                </button>

                {/* Credit / Debit Card */}
                <button 
                    className={`pg-method-card ${selectedMethod === 'CARD' ? 'is-active card-theme' : ''}`}
                    onClick={() => onSelectMethod('CARD')}
                    disabled={isProcessing}
                    aria-pressed={selectedMethod === 'CARD'}
                >
                    <div className="method-icon-circle card-icon">
                        <CreditCard size={20} />
                    </div>
                    <span className="method-name">Bank Card</span>
                    {selectedMethod === 'CARD' && <CheckCircle2 size={16} className="active-check" />}
                </button>
            </div>

            {/* --- DYNAMIC INPUT ZONE --- */}
            <div className={`pg-dynamic-zone ${selectedMethod ? 'is-open' : ''}`}>
                
                {/* MOMO CONFIGURATION (MTN & AIRTEL) */}
                {(selectedMethod === 'MTN' || selectedMethod === 'AIRTEL') && (
                    <div className="pg-momo-vault fade-in">
                        <div className="pg-input-group">
                            <label htmlFor="payment-phone">
                                Mobile Money Number
                            </label>
                            <div className="pg-input-wrapper">
                                <span className="country-code">+256</span>
                                <input 
                                    type="tel" 
                                    id="payment-phone"
                                    className="pg-input with-prefix" 
                                    placeholder="7XX XXX XXX"
                                    value={paymentPhone}
                                    onChange={(e) => onChangePaymentPhone(e.target.value)}
                                    disabled={isProcessing}
                                    autoComplete="tel-national"
                                />
                            </div>
                        </div>

                        <div className="pg-instruction-panel">
                            <Info size={16} className="instruction-icon" />
                            <p>
                                A payment prompt will appear on this phone. 
                                Enter your Mobile Money PIN to authorize the exact amount of <strong>{formattedTotal}</strong>.
                            </p>
                        </div>
                    </div>
                )}

                {/* CARD CONFIGURATION (Future-Proof / Stripe Iframe Container) */}
                {selectedMethod === 'CARD' && (
                    <div className="pg-card-vault fade-in">
                        <div className="pg-card-simulation">
                            <Lock size={16} className="text-muted" />
                            <span>PCI Compliant Secure Payment Gateway will load here.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* --- TRUST SIGNALS & ACTION BAR --- */}
            <div className="pg-action-vault">
                <div className="pg-trust-signals">
                    <div className="trust-pill">
                        <ShieldCheck size={14} className="text-success" />
                        <span>SSL Encrypted</span>
                    </div>
                    <div className="trust-pill">
                        <Lock size={14} className="text-success" />
                        <span>Instant Refunds Active</span>
                    </div>
                </div>

                <button 
                    className={`pg-pay-btn ${isProcessing ? 'is-processing' : ''}`}
                    onClick={onInitiatePayment}
                    disabled={!selectedMethod || (selectedMethod !== 'CARD' && paymentPhone.length < 9) || isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={20} className="spin-anim" />
                            <span>{pollingMessage}</span>
                        </>
                    ) : (
                        <>
                            <Lock size={16} />
                            <span>Pay {formattedTotal}</span>
                        </>
                    )}
                </button>
            </div>

            {/* ========================================================================
                3. COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css for instant Dark/Light mode syncing.
            ======================================================================== */}
            <style>{`
                .pg-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.02);
                }

                /* --- HEADER & TOTAL --- */
                .pg-header-vault {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 1px dashed var(--border-subtle);
                    padding-bottom: 20px;
                }
                .pg-header-text h3 { margin: 0 0 4px 0; font-size: 18px; color: var(--text-main); font-weight: 800; }
                .pg-header-text p { margin: 0; font-size: 13px; color: var(--text-muted); }
                
                .pg-total-display {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    text-align: right;
                }
                .total-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                .total-value { font-size: 24px; font-weight: 900; color: var(--brand-primary); letter-spacing: -0.5px; }

                /* --- METHOD GRID --- */
                .pg-method-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }

                .pg-method-card {
                    background: var(--bg-body);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 16px 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s var(--ease-main);
                    position: relative;
                    color: var(--text-main);
                }

                .pg-method-card:hover:not(:disabled) {
                    border-color: var(--text-muted);
                    transform: translateY(-2px);
                }

                .method-icon-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-surface);
                    color: var(--text-main);
                    transition: all 0.2s;
                }

                .method-name { font-size: 14px; font-weight: 700; }

                .active-check {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    color: inherit;
                    animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes scaleIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                /* Active Themes (Brand Colors) */
                .pg-method-card.is-active.mtn-theme {
                    border-color: #FFCC00;
                    background: color-mix(in srgb, #FFCC00 5%, transparent);
                    color: #B28E00; /* Darker yellow for text contrast in light mode */
                }
                .pg-method-card.is-active.mtn-theme .method-icon-circle { background: #FFCC00; color: #000; }

                .pg-method-card.is-active.airtel-theme {
                    border-color: #FF0000;
                    background: color-mix(in srgb, #FF0000 5%, transparent);
                    color: #FF0000;
                }
                .pg-method-card.is-active.airtel-theme .method-icon-circle { background: #FF0000; color: #FFF; }

                .pg-method-card.is-active.card-theme {
                    border-color: var(--brand-primary);
                    background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
                    color: var(--brand-primary);
                }
                .pg-method-card.is-active.card-theme .method-icon-circle { background: var(--brand-primary); color: #FFF; }

                /* --- DYNAMIC ZONE (Inputs) --- */
                .pg-dynamic-zone {
                    display: none;
                    flex-direction: column;
                    gap: 16px;
                }
                .pg-dynamic-zone.is-open { display: flex; }

                .fade-in { animation: fadeIn 0.3s ease-out; }

                .pg-momo-vault {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: var(--bg-body);
                    padding: 20px;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-subtle);
                }

                .pg-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .pg-input-group label { font-size: 13px; font-weight: 600; color: var(--text-main); }
                
                .pg-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .country-code {
                    position: absolute;
                    left: 16px;
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text-muted);
                    pointer-events: none;
                }
                .pg-input.with-prefix {
                    width: 100%;
                    height: 52px; /* Extra height for fat-finger safety on mobile */
                    padding: 0 16px 0 64px;
                    background: var(--bg-input);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 16px; /* 16px prevents iOS auto-zoom */
                    font-weight: 700;
                    letter-spacing: 1px;
                    transition: border-color 0.2s;
                }
                .pg-input.with-prefix:focus { outline: none; border-color: var(--brand-primary); }
                .pg-input.with-prefix:disabled { opacity: 0.6; cursor: not-allowed; }

                .pg-instruction-panel {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    padding: 16px;
                    border-radius: var(--radius-md);
                    border-left: 4px solid var(--brand-primary);
                }
                .instruction-icon { color: var(--brand-primary); flex-shrink: 0; margin-top: 2px; }
                .pg-instruction-panel p { margin: 0; font-size: 13px; color: var(--text-main); line-height: 1.5; }

                .pg-card-simulation {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 120px;
                    background: var(--bg-body);
                    border: 1px dashed var(--border-subtle);
                    border-radius: var(--radius-lg);
                    color: var(--text-muted);
                    font-size: 13px;
                    font-weight: 500;
                }

                /* --- ACTION VAULT --- */
                .pg-action-vault {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-top: 8px;
                }

                .pg-trust-signals {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .trust-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-muted);
                }
                .text-success { color: #10B981; }

                .pg-pay-btn {
                    width: 100%;
                    height: 56px;
                    border-radius: var(--radius-md);
                    background: var(--brand-primary);
                    color: #FFF;
                    border: none;
                    font-size: 16px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 25%, transparent);
                }
                .pg-pay-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.05); }
                .pg-pay-btn:active:not(:disabled) { transform: translateY(0); }
                .pg-pay-btn:disabled { background: var(--border-subtle); color: var(--text-muted); box-shadow: none; cursor: not-allowed; }
                
                .pg-pay-btn.is-processing {
                    background: var(--text-main);
                    color: var(--bg-body);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                }

                .spin-anim { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 640px) {
                    .pg-chassis { padding: 16px; }
                    .pg-header-vault { flex-direction: column; gap: 12px; }
                    .pg-total-display { align-items: flex-start; text-align: left; }
                    .pg-method-grid { grid-template-columns: 1fr; gap: 12px; }
                    .pg-method-card { flex-direction: row; justify-content: flex-start; padding: 16px; }
                    .active-check { top: 50%; transform: translateY(-50%); }
                    @keyframes scaleIn {
                        from { transform: translateY(-50%) scale(0); opacity: 0; }
                        to { transform: translateY(-50%) scale(1); opacity: 1; }
                    }
                }
            `}</style>
        </div>
    );
};