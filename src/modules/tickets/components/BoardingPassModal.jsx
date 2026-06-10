/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Digital Ticket Vault (Module 7/24)
 * File: src/modules/tickets/components/BoardingPassModal.jsx
 * * DESCRIPTION:
 * The aviation-grade boarding pass overlay. Renders the flattened 
 * ticket payload into a high-fidelity, optically scannable digital asset.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. OPTIC-SAFE QR ENGINE: Uses `react-qr-code` wrapped in a forced-white 
 * chassis to guarantee 100% scan success rates on hardware scanners, 
 * completely bypassing dark-mode contrast issues.
 * 2. TACTILE GEOMETRY: Implements a CSS-driven "perforated tear line" 
 * to separate human-readable data from machine-readable data.
 * 3. OFFLINE HOOKS: Wires a dedicated "Download PDF" hook ready to 
 * connect with `ticket.engine.js` for zero-byte offline vaulting.
 */

import React, { useEffect } from 'react';
import QRCode from 'react-qr-code';
import { 
    X, Download, MapPin, Clock, 
    ShieldCheck, AlertCircle, Info, BusFront
} from 'lucide-react';

export const BoardingPassModal = ({ 
    isOpen, 
    onClose, 
    ticket, 
    onDownloadPdf // The hook to trigger ticket.engine.js
}) => {
    // ========================================================================
    // 1. HARDWARE SCROLL LOCK (Failsafe)
    // Prevents the background UI from scrolling while the modal is open
    // ========================================================================
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !ticket) return null;

    // ========================================================================
    // 2. TELEMETRY PARSERS
    // ========================================================================
    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        return new Intl.DateTimeFormat('en-UG', {
            hour: '2-digit', minute: '2-digit', hour12: true
        }).format(new Date(dateString));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        return new Intl.DateTimeFormat('en-UG', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }).format(new Date(dateString));
    };

    // Calculate duration safely
    const calculateDuration = (start, end) => {
        if (!start || !end) return '-- hr -- min';
        const diff = new Date(end) - new Date(start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
    };

    // ========================================================================
    // 3. SECURITY PAYLOAD GENERATOR
    // The exact string the conductor's scanner will read.
    // ========================================================================
    const qrPayload = JSON.stringify({
        pnr: ticket.reference,
        id: ticket.id,
        seat: ticket.seatNumber,
        status: ticket.status
    });

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="bpm-backdrop fade-in">
            {/* Click outside to close */}
            <div className="bpm-overlay" onClick={onClose} />

            <div className="bpm-chassis slide-up" role="dialog" aria-modal="true">
                
                {/* --- HEADER CONTROLS --- */}
                <div className="bpm-control-bar">
                    <span className="bpm-brand-text">AyaBus Boarding Pass</span>
                    <button className="bpm-close-btn" onClick={onClose} aria-label="Close ticket">
                        <X size={24} />
                    </button>
                </div>

                <div className="bpm-ticket-body">
                    
                    {/* --- ZONE 1: OPERATOR & STATUS --- */}
                    <div className="bpm-section bpm-header">
                        <div className="bpm-operator-vault">
                            <img 
                                src={ticket.partnerLogo} 
                                alt={`${ticket.partnerName} logo`} 
                                className="bpm-operator-logo"
                                onError={(e) => { e.target.src = '/assets/fallbacks/bus-placeholder.png'; }}
                            />
                            <div>
                                <h3 className="bpm-operator-name">{ticket.partnerName}</h3>
                                <span className="bpm-operator-class">{ticket.busType || 'Standard Class'}</span>
                            </div>
                        </div>
                        <div className="bpm-pnr-vault">
                            <span className="bpm-micro-label">PNR / REFERENCE</span>
                            <span className="bpm-pnr-code">{ticket.reference}</span>
                        </div>
                    </div>

                    {/* --- ZONE 2: TIME-SPACE GEOMETRY --- */}
                    <div className="bpm-section bpm-route-matrix">
                        <div className="bpm-date-banner">
                            <Clock size={16} />
                            {formatDate(ticket.departureTime)}
                        </div>

                        <div className="bpm-route-flex">
                            <div className="bpm-node-box">
                                <span className="bpm-city">{ticket.origin}</span>
                                <span className="bpm-time">{formatTime(ticket.departureTime)}</span>
                                <span className="bpm-point">{ticket.boardingPoint}</span>
                            </div>

                            <div className="bpm-duration-line">
                                <div className="bpm-bus-icon"><BusFront size={16} /></div>
                                <span className="bpm-duration-text">{calculateDuration(ticket.departureTime, ticket.arrivalTime)}</span>
                            </div>

                            <div className="bpm-node-box bpm-node-end">
                                <span className="bpm-city">{ticket.destination}</span>
                                <span className="bpm-time">{formatTime(ticket.arrivalTime)}</span>
                                <span className="bpm-point">{ticket.dropoffPoint}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- ZONE 3: PASSENGER TELEMETRY --- */}
                    <div className="bpm-section bpm-telemetry-grid">
                        <div className="bpm-data-block">
                            <span className="bpm-micro-label">SEAT</span>
                            <span className="bpm-macro-data">{ticket.seatNumber || 'TBD'}</span>
                        </div>
                        <div className="bpm-data-block">
                            <span className="bpm-micro-label">BUS REG NO.</span>
                            <span className="bpm-macro-data">{ticket.registration || 'Pending'}</span>
                        </div>
                        <div className="bpm-data-block">
                            <span className="bpm-micro-label">AMOUNT</span>
                            <span className="bpm-macro-data">UGX {ticket.amountPaid?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="bpm-data-block">
                            <span className="bpm-micro-label">STATUS</span>
                            <span className={`bpm-status-badge ${ticket.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                                {ticket.status === 'ACTIVE' ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                                {ticket.status}
                            </span>
                        </div>
                    </div>

                    {/* --- THE TEAR LINE (African Physics) --- */}
                    <div className="bpm-tear-line"></div>

                    {/* --- ZONE 4: OPTIC PAYLOAD (QR CODE) --- */}
                    <div className="bpm-section bpm-qr-vault">
                        <span className="bpm-qr-instruction">Present this QR code to the conductor</span>
                        <div className="bpm-qr-chassis">
                            <QRCode 
                                value={qrPayload} 
                                size={180} 
                                level="H" /* High Error Correction for cracked screens */
                                fgColor="#000000" 
                                bgColor="#FFFFFF" 
                            />
                        </div>
                        <p className="bpm-terms">
                            <Info size={14} />
                            Cancellation allowed up to 12 hours before departure. Subject to Operator T&Cs.
                        </p>
                    </div>

                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="bpm-footer-actions">
                    <button className="ayabus-btn bpm-download-btn" onClick={() => onDownloadPdf(ticket)}>
                        <Download size={18} />
                        Download Offline PDF
                    </button>
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                /* --- INFRASTRUCTURE --- */
                .bpm-backdrop {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    z-index: var(--z-modal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }

                .bpm-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }

                .bpm-chassis {
                    position: relative;
                    width: 100%;
                    max-width: 420px; /* Perfect boarding pass width */
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    z-index: calc(var(--z-modal) + 1);
                }

                /* --- CONTROLS --- */
                .bpm-control-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 16px;
                }

                .bpm-brand-text {
                    font-size: 14px;
                    font-weight: 800;
                    color: #FFFFFF;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .bpm-close-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: #FFFFFF;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .bpm-close-btn:hover { background: rgba(255, 255, 255, 0.2); }

                /* --- TICKET BODY --- */
                .bpm-ticket-body {
                    background: var(--bg-surface);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                }

                .bpm-section {
                    padding: 24px;
                }

                .bpm-micro-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: block;
                    margin-bottom: 4px;
                }

                /* --- HEADER (Operator) --- */
                .bpm-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
                    border-bottom: 1px solid var(--border-subtle);
                }

                .bpm-operator-vault {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .bpm-operator-logo {
                    width: 48px;
                    height: 48px;
                    object-fit: contain;
                    background: var(--bg-body);
                    border-radius: var(--radius-sm);
                    padding: 4px;
                }

                .bpm-operator-name { margin: 0; font-size: 16px; font-weight: 800; color: var(--text-main); }
                .bpm-operator-class { font-size: 13px; color: var(--text-muted); font-weight: 600; }

                .bpm-pnr-vault { text-align: right; }
                .bpm-pnr-code { font-size: 18px; font-weight: 900; color: var(--brand-primary); letter-spacing: 1px; }

                /* --- ROUTE MATRIX --- */
                .bpm-date-banner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-main);
                    background: var(--bg-body);
                    padding: 8px 16px;
                    border-radius: var(--radius-md);
                    margin-bottom: 24px;
                }

                .bpm-route-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                }

                .bpm-node-box {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .bpm-node-end { text-align: right; }

                .bpm-city { font-size: 24px; font-weight: 900; color: var(--text-main); letter-spacing: -0.5px; }
                .bpm-time { font-size: 18px; font-weight: 700; color: var(--brand-primary); margin: 4px 0; }
                .bpm-point { font-size: 12px; color: var(--text-muted); font-weight: 600; }

                .bpm-duration-line {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100px;
                }

                .bpm-duration-line::before {
                    content: '';
                    position: absolute;
                    top: 12px;
                    width: 100%;
                    height: 2px;
                    background: repeating-linear-gradient(to right, var(--border-subtle), var(--border-subtle) 4px, transparent 4px, transparent 8px);
                    z-index: 1;
                }

                .bpm-bus-icon {
                    position: relative;
                    z-index: 2;
                    background: var(--bg-surface);
                    color: var(--text-muted);
                    padding: 0 8px;
                }

                .bpm-duration-text {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin-top: 12px;
                }

                /* --- TELEMETRY GRID --- */
                .bpm-telemetry-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    background: var(--bg-body);
                }

                .bpm-macro-data {
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .bpm-status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    font-weight: 800;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                }
                .badge-active { background: color-mix(in srgb, var(--brand-primary) 15%, transparent); color: var(--brand-primary); }
                .badge-inactive { background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-muted); }

                /* --- TEAR LINE --- */
                .bpm-tear-line {
                    position: relative;
                    height: 2px;
                    background: repeating-linear-gradient(to right, var(--border-subtle), var(--border-subtle) 8px, transparent 8px, transparent 16px);
                    margin: 0 16px;
                }

                /* The physical holes punched in the sides */
                .bpm-tear-line::before, .bpm-tear-line::after {
                    content: '';
                    position: absolute;
                    top: -12px;
                    width: 24px;
                    height: 24px;
                    background: #000000; /* Assuming the backdrop shadow color to look like a hole */
                    border-radius: 50%;
                }
                .bpm-tear-line::before { left: -28px; }
                .bpm-tear-line::after { right: -28px; }

                /* --- QR VAULT --- */
                .bpm-qr-vault {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding-top: 32px;
                    padding-bottom: 32px;
                }

                .bpm-qr-instruction {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-bottom: 16px;
                }

                .bpm-qr-chassis {
                    background: #FFFFFF !important; /* CRITICAL: Force pure white for optical scanners */
                    padding: 16px;
                    border-radius: var(--radius-lg);
                    border: 2px solid color-mix(in srgb, var(--brand-primary) 20%, transparent);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.05);
                }

                .bpm-terms {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 11px;
                    color: var(--text-muted);
                    margin-top: 24px;
                    max-width: 280px;
                }

                /* --- ACTIONS --- */
                .bpm-footer-actions {
                    margin-top: 16px;
                }

                .bpm-download-btn {
                    width: 100%;
                    height: 56px;
                    font-size: 16px;
                    gap: 12px;
                    border-radius: var(--radius-xl);
                    box-shadow: 0 12px 32px color-mix(in srgb, var(--brand-primary) 25%, transparent);
                }

                /* --- ANIMATIONS --- */
                .fade-in { animation: fadeIn 0.3s ease forwards; }
                .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes slideUp { 0% { opacity: 0; transform: translateY(40px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }

                /* --- RESPONSIVE --- */
                @media (max-width: 480px) {
                    .bpm-chassis { max-width: 100%; max-height: calc(100vh - 48px); }
                    .bpm-city { font-size: 20px; }
                    .bpm-duration-line { width: 70px; }
                    .bpm-tear-line::before { left: -28px; } /* Ensures the hole stays on the edge */
                }
            `}</style>
        </div>
    );
};