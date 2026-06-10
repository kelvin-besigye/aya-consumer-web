/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 4 - Funnel Views)
 * File: Step3_SeatVault.jsx
 * * DESCRIPTION:
 * The interactive seating and manifest generation view. Merges the spatial 
 * selection of seats with the dynamic collection of passenger details.
 * * WORLD-CLASS ENGINEERING:
 * 1. DYNAMIC SYNCHRONIZATION: The PassengerInputs form instantly scales 
 * up or down based exactly on the seats clicked in the ChassisGrid.
 * 2. THE VALIDATION GATE: The "Continue" button is algorithmically locked 
 * until a seat is chosen and the primary contact number is provided, 
 * ensuring data integrity before hitting the payment gateway.
 * 3. DUAL-SCROLL PHYSICS: On desktop, the ChassisGrid and PassengerInputs 
 * scroll independently so the user never loses sight of the bus layout 
 * while typing in names.
 */

import React, { useMemo } from 'react';
import { ArrowLeft, Armchair, Users, ChevronRight, ShieldAlert, Info } from 'lucide-react';

// LIVE WIRES: The Atomic Components built in Phase 3
import { ChassisGrid } from '../components/ChassisGrid';
import { PassengerInputs } from '../components/PassengerInputs';

export const Step3_SeatVault = ({ 
    route, 
    bookedSeats = [], // Array of string IDs e.g. ['4', '5'] fetched from DB
    manifest = [],    // Zustand store array: [{ seatId: '12', passengerName: '', activePhone: '', luggage: 'STANDARD' }]
    onToggleSeat,     // Zustand action
    onUpdatePassenger,// Zustand action
    totalPrice = 0,   // Calculated by Zustand based on seats + luggage
    onBack, 
    onProceed,
    currency = 'UGX'
}) => {

    // ========================================================================
    // 1. FAILSAFES
    // ========================================================================
    if (!route) {
        return (
            <div className="sv-error-state">
                <ShieldAlert size={32} />
                <p>Route context lost. Please return to search.</p>
                <button onClick={onBack} className="ayabus-btn">Go Back</button>
            </div>
        );
    }

    // ========================================================================
    // 2. THE VALIDATION ENGINE
    // Mathematically verifies if the user is allowed to proceed to checkout.
    // ========================================================================
    const validationMatrix = useMemo(() => {
        const selectedCount = manifest.length;
        
        if (selectedCount === 0) {
            return { isValid: false, reason: 'Please select at least one seat.' };
        }

        // Primary passenger MUST have a phone number for Dispatch/Mobile Money
        const primaryPassenger = manifest[0];
        const phone = primaryPassenger?.activePhone || '';
        
        // Basic East African phone validation (usually 9 or 10 digits after +256/0)
        if (phone.replace(/\D/g, '').length < 9) {
            return { isValid: false, reason: 'Primary contact requires a valid phone number.' };
        }

        return { isValid: true, reason: 'Ready for checkout' };
    }, [manifest]);

    // ========================================================================
    // 3. NATIVE FORMATTER
    // ========================================================================
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency', currency: currency, maximumFractionDigits: 0
        }).format(amount);
    };

    // Extract raw seat IDs for the ChassisGrid from the manifest objects
    const selectedSeatIds = manifest.map(p => p.seatId);

    // ========================================================================
    // 4. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="sv-chassis">
            
            {/* --- TOP NAV: THE ESCAPE HATCH --- */}
            <header className="sv-header-vault">
                <div className="sv-header-left">
                    <button className="ayabus-btn-ghost sv-back-btn" onClick={onBack}>
                        <ArrowLeft size={20} /> Back to Route
                    </button>
                    <div className="sv-route-context">
                        <span className="route-tag">Boarding: {route.origin}</span>
                        <span className="route-class">{route.class_name} Class</span>
                    </div>
                </div>
                
                {/* Desktop Ticket Counter */}
                <div className="sv-header-right hide-on-mobile">
                    <div className="sv-seat-counter">
                        <Armchair size={16} />
                        <span><strong>{manifest.length}</strong> Seat(s) Selected</span>
                    </div>
                </div>
            </header>

            {/* --- MAIN WORKSPACE GRID --- */}
            <main className="sv-main-grid">
                
                {/* LEFT COLUMN: The Physical Spatial Map (Bus Chassis) */}
                <div className="sv-spatial-column">
                    <div className="sv-column-header">
                        <h3>1. Select Seats</h3>
                        <p>Tap available seats to add them to your booking.</p>
                    </div>
                    
                    <div className="sv-chassis-wrapper">
                        {/* This connects to our world-class visual grid. 
                            If it's a 60-seater, it automatically enables internal scrolling 
                            so it never breaks the page layout.
                        */}
                        <ChassisGrid 
                            capacity={route.capacity || 60} 
                            layoutType={route.layout_type || '2x2'}
                            bookedSeats={bookedSeats}
                            selectedSeats={selectedSeatIds}
                            onToggleSeat={onToggleSeat}
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN: The Dynamic Passenger Manifest */}
                <div className="sv-data-column">
                    <div className="sv-column-header">
                        <h3>2. Passenger Details</h3>
                        <p>Tickets will be issued for these specific seats.</p>
                    </div>

                    <div className="sv-manifest-wrapper">
                        <PassengerInputs 
                            manifest={manifest}
                            onUpdatePassenger={onUpdatePassenger}
                        />
                    </div>

                    {/* Desktop Checkout Summary Box */}
                    <div className="sv-checkout-card hide-on-mobile">
                        <div className="checkout-breakdown">
                            <div className="breakdown-row">
                                <span>Ticket(s) Subtotal</span>
                                <span>{formatCurrency(route.price * manifest.length)}</span>
                            </div>
                            {/* Calculate total luggage surcharge (anything over STANDARD) */}
                            {manifest.filter(p => p.luggage === 'HEAVY').length > 0 && (
                                <div className="breakdown-row text-warning">
                                    <span>Heavy Luggage Fees</span>
                                    <span>Included in Total</span>
                                </div>
                            )}
                            <div className="breakdown-total">
                                <span>Total Price</span>
                                <strong>{formatCurrency(totalPrice)}</strong>
                            </div>
                        </div>

                        {!validationMatrix.isValid && manifest.length > 0 && (
                            <div className="validation-warning">
                                <Info size={14} /> {validationMatrix.reason}
                            </div>
                        )}

                        <button 
                            className="ayabus-btn sv-proceed-btn" 
                            onClick={onProceed}
                            disabled={!validationMatrix.isValid}
                        >
                            Proceed to Payment <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </main>

            {/* --- MOBILE STICKY CONVERSION DOCK --- */}
            <div className="sv-mobile-dock hide-on-desktop">
                {!validationMatrix.isValid && manifest.length > 0 && (
                    <div className="mobile-validation-bar">
                        <Info size={12} /> {validationMatrix.reason}
                    </div>
                )}
                
                <div className="dock-core">
                    <div className="dock-price-col">
                        <span className="dock-label">{manifest.length} Seat(s)</span>
                        <span className="dock-price">{formatCurrency(totalPrice)}</span>
                    </div>
                    <button 
                        className="ayabus-btn sv-proceed-btn" 
                        onClick={onProceed}
                        disabled={!validationMatrix.isValid}
                    >
                        Checkout <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* ========================================================================
                5. COMPONENT-SCOPED STYLES (African Physics)
                Strictly bounds to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .sv-chassis {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 1400px; /* Wider because of the split view */
                    margin: 0 auto;
                    padding-bottom: 120px; /* Heavy buffer for the mobile dock + validation bar */
                    background: var(--bg-canvas);
                    min-height: calc(100vh - var(--header-height));
                }

                .sv-error-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 50vh;
                    gap: 16px;
                    color: var(--status-error);
                }

                /* --- HEADER VAULT --- */
                .sv-header-vault {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px;
                    background: var(--bg-surface);
                    border-bottom: 1px solid var(--border-subtle);
                }
                .sv-header-left { display: flex; align-items: center; gap: 24px; }
                .sv-back-btn { gap: 8px; font-size: 14px; height: 40px; padding: 0 16px; }
                
                .sv-route-context { display: flex; align-items: center; gap: 12px; border-left: 2px solid var(--border-subtle); padding-left: 24px; }
                .route-tag { font-size: 14px; font-weight: 700; color: var(--text-main); }
                .route-class { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--brand-primary); background: color-mix(in srgb, var(--brand-primary) 10%, transparent); padding: 4px 10px; border-radius: var(--radius-full); }

                .sv-seat-counter { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-main); background: var(--bg-body); padding: 8px 16px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); }

                /* --- MAIN GRID PHYSICS --- */
                .sv-main-grid {
                    display: grid;
                    grid-template-columns: 5fr 6fr; /* Chassis slightly narrower than the form */
                    gap: 32px;
                    padding: 32px 24px;
                    align-items: start;
                }

                .sv-spatial-column, .sv-data-column {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .sv-column-header h3 { margin: 0 0 4px 0; font-size: 20px; font-weight: 800; color: var(--text-main); }
                .sv-column-header p { margin: 0; font-size: 14px; color: var(--text-muted); }

                /* Independant Scrolling on Desktop */
                .sv-chassis-wrapper {
                    position: sticky;
                    top: calc(var(--header-height) + 24px);
                    max-height: calc(100vh - var(--header-height) - 120px);
                }

                /* --- DESKTOP CHECKOUT CARD --- */
                .sv-checkout-card {
                    background: var(--bg-surface);
                    border: 2px solid var(--brand-primary); /* Emphasize this is the final step */
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    margin-top: 16px;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.05);
                }

                .checkout-breakdown { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
                .breakdown-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); font-weight: 500; }
                .breakdown-row.text-warning { color: #F59E0B; }
                .breakdown-total { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-subtle); padding-top: 16px; margin-top: 8px; font-size: 16px; color: var(--text-main); }
                .breakdown-total strong { font-size: 28px; font-weight: 900; color: var(--brand-primary); letter-spacing: -0.5px; }

                .validation-warning {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: color-mix(in srgb, #EF4444 10%, transparent);
                    color: #EF4444;
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .sv-proceed-btn {
                    width: 100%; height: 56px; font-size: 16px; font-weight: 800; justify-content: space-between; padding: 0 20px; background: var(--brand-primary); color: #FFF; border: none; border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;
                }
                .sv-proceed-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 30%, transparent); }
                .sv-proceed-btn:disabled { background: var(--border-subtle); color: var(--text-muted); cursor: not-allowed; }

                /* --- MOBILE DOCK --- */
                .sv-mobile-dock {
                    position: fixed;
                    bottom: 0; left: 0; right: 0;
                    background: var(--bg-surface);
                    border-top: 1px solid var(--border-subtle);
                    z-index: var(--z-dock, 100);
                    box-shadow: 0 -4px 24px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                }
                
                .mobile-validation-bar {
                    background: #EF4444;
                    color: #FFF;
                    font-size: 11px;
                    font-weight: 700;
                    text-align: center;
                    padding: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    letter-spacing: 0.5px;
                }

                .dock-core {
                    padding: 16px 24px calc(16px + env(safe-area-inset-bottom));
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                }

                .dock-price-col { display: flex; flex-direction: column; }
                .dock-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                .dock-price { font-size: 20px; font-weight: 900; color: var(--brand-primary); letter-spacing: -0.5px; }
                .sv-mobile-dock .sv-proceed-btn { width: auto; flex: 1; height: 48px; max-width: 200px; }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (min-width: 1025px) {
                    .hide-on-desktop { display: none !important; }
                }

                @media (max-width: 1024px) {
                    /* Flip grid to vertical stack */
                    .sv-main-grid {
                        grid-template-columns: 1fr;
                        padding: 24px 16px;
                    }
                    .hide-on-mobile { display: none !important; }
                    .sv-chassis-wrapper { position: relative; top: 0; max-height: none; }
                }

                @media (max-width: 640px) {
                    .sv-header-vault { flex-direction: column; align-items: flex-start; gap: 16px; padding: 16px; }
                    .sv-route-context { border-left: none; padding-left: 0; padding-top: 12px; border-top: 1px dashed var(--border-subtle); width: 100%; justify-content: space-between; }
                    .sv-main-grid { gap: 40px; } /* More space between bus layout and forms */
                    .dock-core { padding: 16px; }
                }
            `}</style>
        </div>
    );
};