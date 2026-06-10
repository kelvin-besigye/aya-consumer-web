/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 3 - UI Components)
 * File: DigitalTicketCard.jsx
 * * DESCRIPTION:
 * The final output artifact (Step 4). An airline-style digital boarding 
 * pass optimized for physical optical scanners in harsh sunlight.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. SCANNER-SAFE QR: Forces a pure white background behind the QR code 
 * regardless of the global Dark/Light mode theme.
 * 2. GEOMETRIC TEAR-LINE: Uses CSS pseudo-elements to punch physical-looking 
 * holes in the card border, increasing the perceived value of the digital asset.
 * 3. OFFLINE ASSURANCE: Visually confirms to the user that the ticket 
 * is already cached for offline viewing at the park.
 */

import React, { useState } from 'react';
import { 
    CheckCircle2, Download, Share2, MapPin, 
    Clock, BusFront, ShieldCheck, Sun, Info 
} from 'lucide-react';

export const DigitalTicketCard = ({ 
    ticketData, 
    qrCodeUrl, 
    onDownloadPdf, 
    onShare 
}) => {
    const [isBrightnessHintDismissed, setBrightnessHintDismissed] = useState(false);

    // ========================================================================
    // 1. FAILSAFE: EMPTY DATA
    // ========================================================================
    if (!ticketData) {
        return (
            <div className="dtc-error-state">
                <Info size={24} />
                <p>Boarding pass data unavailable. Please refresh your wallet.</p>
            </div>
        );
    }

    const {
        pnrCode = 'AYA-XXXX',
        ticketId = 'TKT-0000',
        passengerName = 'Passenger',
        seats = [],
        origin = 'Origin',
        destination = 'Destination',
        departureDate = 'YYYY-MM-DD',
        departureTime = '--:--',
        boardingPark = 'Main Terminal',
        operatorName = 'AyaBus Partner',
        busClass = 'Standard',
        isCached = true
    } = ticketData;

    // ========================================================================
    // 2. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="dtc-chassis">
            
            {/* --- SUCCESS BANNER --- */}
            <div className="dtc-success-banner fade-in">
                <CheckCircle2 size={24} className="text-success" />
                <div className="banner-text">
                    <h2>Booking Confirmed</h2>
                    <p>Your seats are secured. Have a safe journey.</p>
                </div>
            </div>

            {/* --- THE PHYSICAL TICKET ARTIFACT --- */}
            <div className="dtc-ticket-vault slide-up">
                
                {/* 1. Ticket Header */}
                <div className="ticket-header">
                    <div className="operator-badge">
                        <BusFront size={16} />
                        <span>{operatorName}</span>
                    </div>
                    <div className="pnr-badge">
                        <span>PNR</span>
                        <strong>{pnrCode}</strong>
                    </div>
                </div>

                {/* 2. Route Matrix */}
                <div className="ticket-route-matrix">
                    <div className="route-node">
                        <span className="route-label">FROM</span>
                        <span className="route-city">{origin}</span>
                    </div>
                    <div className="route-bridge">
                        <div className="bridge-line"></div>
                        <BusFront size={16} className="bridge-icon" />
                    </div>
                    <div className="route-node text-right">
                        <span className="route-label">TO</span>
                        <span className="route-city">{destination}</span>
                    </div>
                </div>

                {/* 3. Time & Location Matrix */}
                <div className="ticket-info-grid">
                    <div className="info-block">
                        <span className="info-label">DATE & TIME</span>
                        <span className="info-value text-highlight">
                            {departureDate} • {departureTime}
                        </span>
                    </div>
                    <div className="info-block">
                        <span className="info-label">BOARDING STAGE</span>
                        <span className="info-value">
                            <MapPin size={12} className="inline-icon" /> {boardingPark}
                        </span>
                    </div>
                </div>

                {/* --- THE TEAR LINE (Perforated Edge) --- */}
                <div className="ticket-perforation">
                    <div className="hole left"></div>
                    <div className="dash-line"></div>
                    <div className="hole right"></div>
                </div>

                {/* 4. Passenger & QR Matrix (The Bottom Stub) */}
                <div className="ticket-stub">
                    <div className="stub-details">
                        <div className="info-block">
                            <span className="info-label">PASSENGER</span>
                            <span className="info-value">{passengerName.toUpperCase()}</span>
                        </div>
                        <div className="info-block">
                            <span className="info-label">CLASS</span>
                            <span className="info-value">{busClass.toUpperCase()}</span>
                        </div>
                        <div className="info-block seat-highlight">
                            <span className="info-label">SEAT(S)</span>
                            <span className="info-value massive">{seats.join(', ')}</span>
                        </div>
                    </div>

                    <div className="stub-qr-zone">
                        {/* QR Code must be absolute contrast for physical scanners */}
                        <div className="qr-contrast-box">
                            {qrCodeUrl ? (
                                <img src={qrCodeUrl} alt="Boarding QR Code" className="qr-image" />
                            ) : (
                                <div className="qr-placeholder">QR PENDING</div>
                            )}
                        </div>
                        <span className="qr-id-text">TID: {ticketId}</span>
                    </div>
                </div>
            </div>

            {/* --- BRIGHTNESS HINT --- */}
            {!isBrightnessHintDismissed && (
                <div className="dtc-brightness-hint bounce-in">
                    <Sun size={18} className="hint-icon" />
                    <span>Turn up your screen brightness when scanning at the park.</span>
                    <button className="hint-dismiss" onClick={() => setBrightnessHintDismissed(true)}>Got it</button>
                </div>
            )}

            {/* --- ACTION BAR --- */}
            <div className="dtc-action-bar slide-up-delayed">
                <button className="dtc-btn dtc-btn-primary" onClick={onDownloadPdf}>
                    <Download size={18} />
                    Download PDF
                </button>
                <button className="dtc-btn dtc-btn-secondary" onClick={onShare}>
                    <Share2 size={18} />
                    Share Ticket
                </button>
            </div>

            {/* --- TRUST FOOTER --- */}
            <div className="dtc-footer-trust">
                {isCached && (
                    <div className="trust-pill">
                        <ShieldCheck size={14} className="text-success" />
                        <span>Saved for Offline Access</span>
                    </div>
                )}
            </div>

            {/* ========================================================================
                3. COMPONENT-SCOPED STYLES (African Physics)
            ======================================================================== */}
            <style>{`
                .dtc-chassis {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: 100%;
                    max-width: 500px; /* Keep ticket looking like a ticket on large screens */
                    margin: 0 auto;
                }

                .dtc-error-state {
                    background: var(--bg-surface);
                    border: 1px solid var(--status-error);
                    color: var(--status-error);
                    padding: 24px;
                    border-radius: var(--radius-md);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                /* --- SUCCESS BANNER --- */
                .dtc-success-banner {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: color-mix(in srgb, #10B981 10%, transparent);
                    border: 1px solid color-mix(in srgb, #10B981 30%, transparent);
                    padding: 16px 20px;
                    border-radius: var(--radius-lg);
                }
                .text-success { color: #10B981; }
                .banner-text h2 { margin: 0; font-size: 18px; color: var(--text-main); font-weight: 800; }
                .banner-text p { margin: 0; font-size: 13px; color: var(--text-muted); }

                /* --- TICKET VAULT (The Artifact) --- */
                .dtc-ticket-vault {
                    background: var(--bg-surface);
                    border-radius: var(--radius-xl);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.08);
                    overflow: hidden;
                    border: 1px solid var(--border-subtle);
                    position: relative;
                }

                /* HEADER */
                .ticket-header {
                    background: var(--brand-primary);
                    color: #FFF;
                    padding: 16px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .operator-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                }
                .pnr-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .pnr-badge span { font-size: 10px; opacity: 0.8; font-weight: 600; letter-spacing: 1px; }
                .pnr-badge strong { font-size: 16px; font-weight: 900; letter-spacing: 1px; }

                /* ROUTE MATRIX */
                .ticket-route-matrix {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 32px 24px 24px 24px;
                }
                .route-node { display: flex; flex-direction: column; width: 35%; }
                .route-node.text-right { text-align: right; }
                .route-label { font-size: 11px; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
                .route-city { font-size: 24px; color: var(--text-main); font-weight: 900; letter-spacing: -0.5px; }
                
                .route-bridge {
                    flex: 1;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 16px;
                }
                .bridge-line {
                    position: absolute;
                    width: calc(100% - 32px);
                    height: 2px;
                    background: repeating-linear-gradient(to right, var(--border-subtle) 0, var(--border-subtle) 6px, transparent 6px, transparent 12px);
                }
                .bridge-icon {
                    background: var(--bg-surface);
                    color: var(--brand-primary);
                    padding: 0 8px;
                    z-index: 2;
                }

                /* INFO GRID */
                .ticket-info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                    padding: 0 24px 24px 24px;
                }
                .info-block { display: flex; flex-direction: column; gap: 4px; }
                .info-label { font-size: 10px; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; }
                .info-value { font-size: 14px; color: var(--text-main); font-weight: 700; display: flex; align-items: center; gap: 6px; }
                .text-highlight { color: var(--brand-primary); font-size: 16px; font-weight: 900; }
                .inline-icon { color: var(--text-muted); }

                /* THE PERFORATION (Geometric Tear Line) */
                .ticket-perforation {
                    position: relative;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    background: var(--bg-surface);
                }
                .hole {
                    width: 24px;
                    height: 24px;
                    background: var(--bg-body); /* Must match page background to look like a hole */
                    border-radius: 50%;
                    position: absolute;
                    z-index: 2;
                    border: 1px solid var(--border-subtle);
                }
                .hole.left { left: -13px; border-left: none; }
                .hole.right { right: -13px; border-right: none; }
                .dash-line {
                    width: 100%;
                    height: 0;
                    border-top: 2px dashed var(--border-subtle);
                    margin: 0 24px;
                }

                /* TICKET STUB (Bottom Section) */
                .ticket-stub {
                    display: flex;
                    justify-content: space-between;
                    padding: 24px;
                    background: color-mix(in srgb, var(--bg-surface) 95%, var(--text-main));
                }
                .stub-details {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    flex: 1;
                }
                .seat-highlight .massive { font-size: 28px; color: var(--brand-primary); letter-spacing: -1px; line-height: 1; }

                .stub-qr-zone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                /* QR Box must be absolute white for scanners */
                .qr-contrast-box {
                    width: 120px;
                    height: 120px;
                    background: #FFFFFF;
                    padding: 8px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border: 1px solid #E2E8F0;
                }
                .qr-image { width: 100%; height: 100%; object-fit: contain; }
                .qr-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #94A3B8; border: 1px dashed #CBD5E1; }
                .qr-id-text { font-size: 10px; color: var(--text-muted); font-family: monospace; font-weight: 600; letter-spacing: 1px; }

                /* --- BRIGHTNESS HINT --- */
                .dtc-brightness-hint {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: color-mix(in srgb, #F59E0B 15%, transparent);
                    border: 1px solid color-mix(in srgb, #F59E0B 30%, transparent);
                    color: #D97706;
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 13px;
                    font-weight: 600;
                }
                .hint-icon { flex-shrink: 0; }
                .dtc-brightness-hint span { flex: 1; }
                .hint-dismiss { background: transparent; border: none; color: inherit; font-weight: 800; text-transform: uppercase; font-size: 11px; cursor: pointer; text-decoration: underline; }

                /* --- ACTION BAR --- */
                .dtc-action-bar {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .dtc-btn {
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border-radius: var(--radius-md);
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .dtc-btn-primary { background: var(--brand-primary); color: #FFF; box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-primary) 30%, transparent); }
                .dtc-btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
                .dtc-btn-secondary { background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-subtle); }
                .dtc-btn-secondary:hover { background: var(--bg-body); border-color: var(--text-muted); }

                /* --- FOOTER --- */
                .dtc-footer-trust { display: flex; justify-content: center; margin-top: 8px; }
                .trust-pill { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--text-muted); }

                /* --- ANIMATIONS --- */
                .fade-in { animation: fadeIn 0.4s ease-out; }
                .slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                .slide-up-delayed { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
                .bounce-in { animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.26, 1.55) 0.5s both; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 480px) {
                    .ticket-route-matrix { padding: 24px 20px 20px 20px; }
                    .route-city { font-size: 20px; }
                    .ticket-stub { flex-direction: column; gap: 24px; text-align: center; }
                    .stub-details { align-items: center; }
                    .dtc-action-bar { grid-template-columns: 1fr; } /* Stack buttons on tiny screens */
                }
            `}</style>
        </div>
    );
};