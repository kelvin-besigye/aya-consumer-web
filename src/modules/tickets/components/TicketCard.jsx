/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Digital Ticket Vault (Module 7/24)
 * File: src/modules/tickets/components/TicketCard.jsx
 * * DESCRIPTION:
 * The interactive list item for the Ticket Vault. It ingests the flattened 
 * 1D payload from `ticket.queries.js` and renders a highly scannable summary.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. TIME-SPACE GEOMETRY: Implements a custom CSS timeline (using borders 
 * and pseudo-elements) to physically connect the Origin and Destination, 
 * reducing cognitive load.
 * 2. TACTILE SURFACE: The entire chassis is an interactive trigger. It uses 
 * `color-mix()` on hover to create a subtle glow without requiring heavy JS animations.
 * 3. DEFENSIVE RENDERING: Uses native `Intl.DateTimeFormat` for ultra-fast, 
 * localized time parsing, with fallbacks for missing data to prevent UI crashes.
 */

import React from 'react';
import { 
    ChevronRight, 
    Clock, 
    MapPin, 
    ShieldCheck, 
    AlertCircle 
} from 'lucide-react';

export const TicketCard = ({ ticket, onClick }) => {
    // ========================================================================
    // TELEMETRY PARSERS
    // ========================================================================
    // Safely format the PostgreSQL timestamp into human-readable strings
    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        return new Intl.DateTimeFormat('en-UG', {
            hour: '2-digit', minute: '2-digit', hour12: true
        }).format(new Date(dateString));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        return new Intl.DateTimeFormat('en-UG', {
            weekday: 'short', month: 'short', day: 'numeric'
        }).format(new Date(dateString));
    };

    // ========================================================================
    // STATUS ENGINE
    // ========================================================================
    const getStatusConfig = (status) => {
        const normStatus = (status || 'UNKNOWN').toUpperCase();
        switch (normStatus) {
            case 'ACTIVE':
            case 'CONFIRMED':
                return { label: 'Upcoming', className: 'tc-badge-active', icon: <ShieldCheck size={14} /> };
            case 'CANCELLED':
                return { label: 'Cancelled', className: 'tc-badge-error', icon: <AlertCircle size={14} /> };
            case 'USED':
            case 'COMPLETED':
                return { label: 'Completed', className: 'tc-badge-muted', icon: <Clock size={14} /> };
            default:
                return { label: normStatus, className: 'tc-badge-muted', icon: null };
        }
    };

    const statusConfig = getStatusConfig(ticket.status);
    const isInactive = statusConfig.label !== 'Upcoming';

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div 
            className={`tc-chassis fade-in ${isInactive ? 'tc-inactive-state' : ''}`}
            onClick={() => onClick(ticket)}
            role="button"
            tabIndex={0}
            aria-label={`View boarding pass for ${ticket.origin} to ${ticket.destination}`}
        >
            <div className="tc-grid">
                
                {/* --- ZONE 1: OPERATOR IDENTITY --- */}
                <div className="tc-zone-operator">
                    <div className="tc-logo-vault">
                        <img 
                            src={ticket.partnerLogo} 
                            alt={`${ticket.partnerName} logo`} 
                            className="tc-partner-logo"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = '/assets/fallbacks/bus-placeholder.png';
                            }}
                        />
                    </div>
                    <div className="tc-operator-meta">
                        <span className="tc-partner-name">{ticket.partnerName || 'AyaBus Partner'}</span>
                        <span className="tc-bus-type">{ticket.busType || 'Standard Class'}</span>
                    </div>
                </div>

                {/* --- ZONE 2: TIME-SPACE TIMELINE --- */}
                <div className="tc-zone-route">
                    
                    <div className="tc-date-pill">
                        {formatDate(ticket.departureTime)}
                    </div>

                    <div className="tc-timeline">
                        {/* Origin Row */}
                        <div className="tc-timeline-row">
                            <div className="tc-time">{formatTime(ticket.departureTime)}</div>
                            <div className="tc-node tc-node-start"></div>
                            <div className="tc-location">
                                <span className="tc-city">{ticket.origin || 'Origin'}</span>
                                <span className="tc-point">{ticket.boardingPoint || 'Main Terminal'}</span>
                            </div>
                        </div>

                        {/* Destination Row */}
                        <div className="tc-timeline-row">
                            <div className="tc-time tc-time-arrival">{formatTime(ticket.arrivalTime)}</div>
                            <div className="tc-node tc-node-end"></div>
                            <div className="tc-location">
                                <span className="tc-city">{ticket.destination || 'Destination'}</span>
                                <span className="tc-point">{ticket.dropoffPoint || 'Main Terminal'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ZONE 3: SEAT & ACTION TRIGGER --- */}
                <div className="tc-zone-action">
                    <div className="tc-seat-vault">
                        <span className="tc-seat-label">Seat No.</span>
                        <span className="tc-seat-number">{ticket.seatNumber || 'TBD'}</span>
                    </div>

                    <div className="tc-action-footer">
                        <div className={`tc-status-badge ${statusConfig.className}`}>
                            {statusConfig.icon}
                            <span>{statusConfig.label}</span>
                        </div>
                        
                        <div className="tc-trigger-icon">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .tc-chassis {
                    width: 100%;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 20px 24px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }

                .tc-chassis:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.06);
                    border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--border-subtle));
                }

                /* Focus state for accessibility */
                .tc-chassis:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 20%, transparent);
                }

                /* Drop opacity for past/cancelled tickets */
                .tc-inactive-state {
                    opacity: 0.7;
                    filter: grayscale(40%);
                }
                .tc-inactive-state:hover {
                    opacity: 1;
                    filter: grayscale(0%);
                }

                /* --- GRID GEOMETRY --- */
                .tc-grid {
                    display: grid;
                    grid-template-columns: 1fr 2.5fr 1fr;
                    gap: 24px;
                    align-items: center;
                }

                /* --- ZONE 1: OPERATOR --- */
                .tc-zone-operator {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .tc-logo-vault {
                    width: 64px;
                    height: 48px;
                    background: var(--bg-body);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-sm);
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .tc-partner-logo {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }

                .tc-operator-meta {
                    display: flex;
                    flex-direction: column;
                }

                .tc-partner-name {
                    font-size: 15px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                }

                .tc-bus-type {
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* --- ZONE 2: TIMELINE --- */
                .tc-zone-route {
                    display: flex;
                    flex-direction: column;
                    border-left: 1px solid var(--border-subtle);
                    border-right: 1px solid var(--border-subtle);
                    padding: 0 24px;
                }

                .tc-date-pill {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--brand-primary);
                    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                    align-self: flex-start;
                    margin-bottom: 16px;
                }

                .tc-timeline {
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                /* The vertical connecting line */
                .tc-timeline::before {
                    content: '';
                    position: absolute;
                    left: 63px; /* Aligns exactly with the nodes */
                    top: 14px;
                    bottom: 14px;
                    width: 2px;
                    background: repeating-linear-gradient(
                        to bottom,
                        var(--border-subtle),
                        var(--border-subtle) 4px,
                        transparent 4px,
                        transparent 8px
                    );
                }

                .tc-timeline-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    min-height: 48px;
                }

                .tc-time {
                    width: 55px; /* Fixed width ensures perfect alignment */
                    font-size: 15px;
                    font-weight: 800;
                    color: var(--text-main);
                    padding-top: 2px;
                    text-align: right;
                }
                
                .tc-time-arrival { color: var(--text-muted); }

                .tc-node {
                    position: relative;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: var(--bg-surface);
                    border: 2px solid var(--text-muted);
                    margin-top: 6px;
                    z-index: 2;
                }

                .tc-node-start { border-color: var(--brand-primary); }
                .tc-node-end { border-color: var(--text-muted); }

                .tc-location {
                    display: flex;
                    flex-direction: column;
                }

                .tc-city {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .tc-point {
                    font-size: 13px;
                    color: var(--text-muted);
                    margin-top: 2px;
                }

                /* --- ZONE 3: SEAT & ACTION --- */
                .tc-zone-action {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    align-items: flex-end; /* Pin to the right on desktop */
                }

                .tc-seat-vault {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    text-align: right;
                }

                .tc-seat-label {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .tc-seat-number {
                    font-size: 32px;
                    font-weight: 900;
                    color: var(--text-main);
                    line-height: 1;
                    letter-spacing: -1px;
                    margin-top: 4px;
                }

                .tc-action-footer {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: auto;
                }

                /* --- STATUS BADGES --- */
                .tc-status-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: var(--radius-full);
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .tc-badge-active {
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    color: var(--brand-primary);
                }

                .tc-badge-error {
                    background: color-mix(in srgb, #EF4444 10%, transparent);
                    color: #EF4444;
                }

                .tc-badge-muted {
                    background: var(--bg-body);
                    color: var(--text-muted);
                    border: 1px solid var(--border-subtle);
                }

                .tc-trigger-icon {
                    color: var(--brand-primary);
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }

                .tc-chassis:hover .tc-trigger-icon {
                    transform: translateX(4px);
                    background: color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                /* --- ANIMATION --- */
                .fade-in { animation: fadeIn 0.4s ease forwards; }
                @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 900px) {
                    /* iPad/Tablet crush: Remove side borders from route */
                    .tc-zone-route {
                        border-left: none;
                        border-right: none;
                        padding: 0 16px;
                    }
                }

                @media (max-width: 600px) {
                    /* Mobile crush: Switch to a logical vertical stack */
                    .tc-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .tc-chassis { padding: 20px; }

                    .tc-zone-operator {
                        flex-direction: row;
                        align-items: center;
                        padding-bottom: 16px;
                        border-bottom: 1px solid var(--border-subtle);
                    }

                    .tc-zone-route {
                        padding: 0;
                        margin-bottom: 8px;
                    }

                    .tc-zone-action {
                        flex-direction: row-reverse;
                        align-items: center;
                        justify-content: space-between;
                        padding-top: 16px;
                        border-top: 1px dashed var(--border-subtle);
                    }

                    .tc-seat-vault { align-items: flex-start; text-align: left; }
                }
            `}</style>
        </div>
    );
};