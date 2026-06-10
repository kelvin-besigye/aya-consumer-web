/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 4 - Funnel Views)
 * File: Step4_Checkout.jsx
 * * DESCRIPTION:
 * The apex transaction view. Displays the final financial summary, manages 
 * the Payment Gateway state, and ultimately renders the Digital Boarding Pass 
 * upon a successful transaction.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. SMART AUTO-FILL: Intelligently pulls the `activePhone` from the primary 
 * passenger in the manifest and pre-fills the Mobile Money input, saving the 
 * user crucial keystrokes and reducing friction.
 * 2. STATE ISOLATION: Once payment is initiated, the UI mathematically locks down. 
 * The back button disappears, preventing the user from accidentally double-charging 
 * themselves by navigating away during the USSD push.
 * 3. SEAMLESS ARTIFACT TRANSITION: Upon success, the grid collapses and fluidly 
 * reveals the `DigitalTicketCard`, transitioning the user from "Buyer" to "Passenger".
 */

import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Lock, ShieldCheck, BusFront, 
    MapPin, Users, Ticket, CheckCircle2, Clock 
} from 'lucide-react';

// LIVE WIRES: The Atomic Components built in Phase 3
import { PaymentGateway } from '../components/PaymentGateway';
import { DigitalTicketCard } from '../components/DigitalTicketCard';

export const Step4_Checkout = ({ 
    route, 
    manifest = [], 
    totalPrice = 0, 
    onBack, 
    onCompleteBooking, // Function to hit the database and finalize
    currency = 'UGX' 
}) => {

    // ========================================================================
    // 1. TRANSACTION STATE MACHINE
    // ========================================================================
    const [selectedMethod, setSelectedMethod] = useState(null);
    // Auto-fill the payment phone with the primary passenger's phone number
    const [paymentPhone, setPaymentPhone] = useState(manifest[0]?.activePhone || '');
    
    // Status: 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED'
    const [transactionState, setTransactionState] = useState('IDLE');
    const [pollingMessage, setPollingMessage] = useState('Initiating secure connection...');
    const [finalTicketData, setFinalTicketData] = useState(null);

    // ========================================================================
    // 2. NATIVE FORMATTERS
    // ========================================================================
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency', currency: currency, maximumFractionDigits: 0
        }).format(amount);
    };

    const formatTime = (isoString) => {
        if (!isoString) return "--:--";
        return new Intl.DateTimeFormat('en-UG', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(isoString));
    };

    // ========================================================================
    // 3. THE PAYMENT ORCHESTRATOR (Simulation for Prototype)
    // In production, this wires to payment.service.js which handles MTN/Airtel APIs.
    // ========================================================================
    const handleInitiatePayment = async () => {
        setTransactionState('PROCESSING');
        
        // Phase 1: Contacting Provider
        setPollingMessage(`Connecting to ${selectedMethod} Network...`);
        await new Promise(res => setTimeout(res, 1500));

        // Phase 2: USSD Push
        setPollingMessage('Check your phone for the PIN prompt...');
        await new Promise(res => setTimeout(res, 3000));

        // Phase 3: Verifying Transaction
        setPollingMessage('Verifying payment receipt...');
        await new Promise(res => setTimeout(res, 1500));

        // Generate the finalized ticket data artifact
        const generatedTicket = {
            pnrCode: `AYA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            ticketId: `TKT-${Date.now().toString().slice(-6)}`,
            passengerName: manifest[0]?.passengerName || 'AyaBus Passenger',
            seats: manifest.map(p => p.seatId),
            origin: route.origin,
            destination: route.destination,
            departureDate: route.departure_date || 'Today', // Should format from real route data
            departureTime: formatTime(route.departure_time),
            boardingPark: route.origin_park,
            operatorName: route.partner_name,
            busClass: route.class_name,
            isCached: true
        };

        setFinalTicketData(generatedTicket);
        setTransactionState('SUCCESS');
        
        // Optionally notify the parent wrapper that the booking is complete
        if (onCompleteBooking) onCompleteBooking(generatedTicket);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ========================================================================
    // 4. FAILSAFES
    // ========================================================================
    if (!route || manifest.length === 0) {
        return (
            <div className="co-error-state">
                <ShieldAlert size={32} />
                <p>Checkout session invalid. Please re-select your seats.</p>
                <button onClick={onBack} className="ayabus-btn">Return to Seating</button>
            </div>
        );
    }

    // ========================================================================
    // 5. RENDER PAYLOAD (Ticket View)
    // If successful, completely replace the UI with the final artifact.
    // ========================================================================
    if (transactionState === 'SUCCESS' && finalTicketData) {
        return (
            <div className="co-success-vault fade-in">
                <DigitalTicketCard 
                    ticketData={finalTicketData}
                    // In production, this hits your ticket.engine.js to generate the real base64 QR
                    qrCodeUrl={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${finalTicketData.pnrCode}`}
                    onDownloadPdf={() => console.log('Downloading PDF...')}
                    onShare={() => console.log('Opening native share sheet...')}
                />
            </div>
        );
    }

    // ========================================================================
    // 6. RENDER PAYLOAD (Checkout View)
    // ========================================================================
    return (
        <div className="co-chassis">
            
            {/* --- TOP NAV: THE ESCAPE HATCH --- */}
            {/* Hidden during processing to prevent accidental double-charges */}
            <header className="co-header-vault">
                <div className="co-header-left">
                    <button 
                        className="ayabus-btn-ghost co-back-btn" 
                        onClick={onBack}
                        disabled={transactionState === 'PROCESSING'}
                        style={{ opacity: transactionState === 'PROCESSING' ? 0.3 : 1 }}
                    >
                        <ArrowLeft size={20} /> Edit Passengers
                    </button>
                </div>
                <div className="co-header-secure">
                    <Lock size={16} className="text-success" />
                    <span>Secure Checkout</span>
                </div>
            </header>

            {/* --- MAIN WORKSPACE GRID --- */}
            <main className="co-main-grid">
                
                {/* LEFT COLUMN: The Immutable Ledger Summary */}
                <div className="co-summary-column">
                    <div className="co-card summary-card">
                        <div className="summary-header">
                            <h3>Journey Summary</h3>
                            <div className="operator-badge">
                                <BusFront size={14} /> {route.partner_name}
                            </div>
                        </div>

                        <div className="summary-route-matrix">
                            <div className="route-node">
                                <span className="city">{route.origin}</span>
                                <span className="time">{formatTime(route.departure_time)}</span>
                            </div>
                            <div className="route-bridge">
                                <div className="line"></div>
                            </div>
                            <div className="route-node text-right">
                                <span className="city">{route.destination}</span>
                                <span className="time">{formatTime(route.arrival_time)}</span>
                            </div>
                        </div>

                        <div className="summary-park-info">
                            <MapPin size={14} className="text-muted" />
                            <span>Boarding at <strong>{route.origin_park}</strong></span>
                        </div>

                        <div className="summary-manifest-list">
                            <div className="list-header">
                                <Users size={14} /> Passenger Manifest
                            </div>
                            {manifest.map((passenger, idx) => (
                                <div key={idx} className="manifest-item">
                                    <div className="item-identity">
                                        <span className="seat-badge">{passenger.seatId}</span>
                                        <span className="name">{passenger.passengerName || `Passenger ${idx + 1}`}</span>
                                    </div>
                                    <span className="luggage-tag">{passenger.luggage} LUGGAGE</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-total-vault">
                            <div className="total-row">
                                <span>Subtotal ({manifest.length} Seats)</span>
                                <span>{formatCurrency(route.price * manifest.length)}</span>
                            </div>
                            <div className="total-row massive">
                                <span>Total to Pay</span>
                                <strong>{formatCurrency(totalPrice)}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Trust Signals Block */}
                    <div className="co-trust-block hide-on-mobile">
                        <div className="trust-item">
                            <ShieldCheck size={24} className="text-success" />
                            <div className="trust-text">
                                <h4>Buyer Protection Active</h4>
                                <p>Your payment is held in escrow until you board the bus.</p>
                            </div>
                        </div>
                        <div className="trust-item">
                            <Ticket size={24} className="text-success" />
                            <div className="trust-text">
                                <h4>Instant Digital Ticket</h4>
                                <p>Your boarding pass is issued immediately upon payment success.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: The Payment Gateway */}
                <div className="co-payment-column">
                    <PaymentGateway 
                        totalAmount={totalPrice}
                        currency={currency}
                        selectedMethod={selectedMethod}
                        onSelectMethod={setSelectedMethod}
                        paymentPhone={paymentPhone}
                        onChangePaymentPhone={setPaymentPhone}
                        onInitiatePayment={handleInitiatePayment}
                        isProcessing={transactionState === 'PROCESSING'}
                        pollingMessage={pollingMessage}
                    />
                </div>
            </main>

            {/* ========================================================================
                7. COMPONENT-SCOPED STYLES (African Physics)
            ======================================================================== */}
            <style>{`
                .co-chassis {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding-bottom: 60px;
                    background: var(--bg-canvas);
                    min-height: calc(100vh - var(--header-height));
                }

                .co-success-vault {
                    display: flex;
                    justify-content: center;
                    padding: 40px 24px;
                    min-height: calc(100vh - var(--header-height));
                    background: var(--bg-canvas);
                }

                /* --- HEADER VAULT --- */
                .co-header-vault {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px;
                    background: var(--bg-surface);
                    border-bottom: 1px solid var(--border-subtle);
                }
                .co-back-btn { gap: 8px; font-size: 14px; height: 40px; padding: 0 16px; transition: opacity 0.3s; }
                
                .co-header-secure {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 800;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    background: color-mix(in srgb, #10B981 10%, transparent);
                    padding: 8px 16px;
                    border-radius: var(--radius-full);
                }
                .text-success { color: #10B981; }

                /* --- MAIN GRID PHYSICS --- */
                .co-main-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr; /* Payment side gets slightly more room */
                    gap: 32px;
                    padding: 32px 24px;
                    align-items: start;
                }

                .co-summary-column, .co-payment-column {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                /* --- SUMMARY CARD (The Ledger) --- */
                .co-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .summary-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px;
                    background: var(--bg-body);
                    border-bottom: 1px solid var(--border-subtle);
                }
                .summary-header h3 { margin: 0; font-size: 18px; font-weight: 800; color: var(--text-main); }
                .operator-badge { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--text-main); }

                .summary-route-matrix {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px;
                }
                .route-node { display: flex; flex-direction: column; width: 40%; }
                .route-node.text-right { text-align: right; }
                .route-node .city { font-size: 20px; font-weight: 900; color: var(--text-main); letter-spacing: -0.5px; }
                .route-node .time { font-size: 14px; font-weight: 700; color: var(--brand-primary); }
                
                .route-bridge { flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 16px; }
                .route-bridge .line { width: 100%; height: 2px; background: repeating-linear-gradient(to right, var(--border-subtle) 0, var(--border-subtle) 6px, transparent 6px, transparent 12px); }

                .summary-park-info {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: var(--bg-body);
                    font-size: 13px;
                    color: var(--text-muted);
                    border-top: 1px dashed var(--border-subtle);
                    border-bottom: 1px dashed var(--border-subtle);
                }
                .summary-park-info strong { color: var(--text-main); font-weight: 700; }

                .summary-manifest-list {
                    display: flex;
                    flex-direction: column;
                    padding: 24px;
                    gap: 12px;
                }
                .list-header { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .manifest-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-body); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); }
                .item-identity { display: flex; align-items: center; gap: 12px; }
                .seat-badge { background: var(--text-main); color: var(--bg-body); font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 4px; }
                .manifest-item .name { font-size: 14px; font-weight: 600; color: var(--text-main); }
                .luggage-tag { font-size: 10px; font-weight: 800; color: var(--text-muted); background: var(--bg-surface); padding: 4px 8px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); }

                .summary-total-vault {
                    padding: 24px;
                    background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
                    border-top: 2px solid var(--brand-primary);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .total-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: var(--text-main); font-weight: 600; }
                .total-row.massive { font-size: 16px; margin-top: 8px; padding-top: 16px; border-top: 1px dashed var(--border-subtle); }
                .total-row.massive strong { font-size: 32px; font-weight: 900; color: var(--brand-primary); letter-spacing: -1px; }

                /* --- TRUST BLOCK --- */
                .co-trust-block {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 24px;
                    border: 1px dashed var(--border-subtle);
                    border-radius: var(--radius-lg);
                }
                .trust-item { display: flex; align-items: flex-start; gap: 16px; }
                .trust-text h4 { margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: var(--text-main); }
                .trust-text p { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.5; }

                .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (min-width: 1025px) {
                    .hide-on-desktop { display: none !important; }
                }

                @media (max-width: 1024px) {
                    /* Flip grid on tablets/mobile: Summary on top, Payment on bottom */
                    .co-main-grid {
                        grid-template-columns: 1fr;
                        padding: 24px 16px;
                    }
                    .hide-on-mobile { display: none !important; }
                    /* Reverse flex order so Payment Gateway is at the top of the column stack on mobile */
                    .co-main-grid { display: flex; flex-direction: column-reverse; }
                }

                @media (max-width: 640px) {
                    .co-header-vault { padding: 16px; }
                    .co-success-vault { padding: 16px; }
                    .route-node .city { font-size: 18px; }
                    .total-row.massive strong { font-size: 28px; }
                }
            `}</style>
        </div>
    );
};