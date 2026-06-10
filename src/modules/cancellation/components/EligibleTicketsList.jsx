/**
 * 🌍 AYABUS CONSUMER WEB (The Friction Engine)
 * ------------------------------------------------------------------
 * Module: Cancellations (Module 10/24)
 * File: src/modules/cancellations/components/EligibleTicketsList.jsx
 * * DESCRIPTION:
 * The interactive feed of upcoming, cancellable journeys. It acts as 
 * the selection engine, allowing the user to pick exactly which ticket 
 * they want to subject to the Refund Calculator.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-GHOST SELECTIONS: If a user selects a ticket, the UI visually 
 * locks onto it using `var(--brand-primary)` borders to prevent accidental 
 * cancellation of the wrong itinerary.
 * 2. GRACEFUL DEGRADATION: Includes a high-fidelity 'Empty State' that 
 * explicitly tells the user why older or completed tickets are missing.
 * 3. STRICT CSS COMPLIANCE: Fully inherits dark/light mode properties 
 * from `index.css` without relying on inline color hacks.
 */

import React from 'react';
import { 
    Ticket, 
    MapPin, 
    Clock, 
    Calendar, 
    AlertCircle,
    ChevronRight,
    BusFront
} from 'lucide-react';

export const EligibleTicketsList = ({ 
    tickets = [], 
    selectedTicketId, 
    onSelectTicket, 
    isLoading 
}) => {

    // ========================================================================
    // 1. RENDER PAYLOAD: SKELETON BOOT STATE
    // ========================================================================
    if (isLoading) {
        return (
            <div className="etl-chassis">
                <div className="etl-header">
                    <h2>Eligible Journeys</h2>
                    <p>Fetching active itineraries...</p>
                </div>
                <div className="etl-feed">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="etl-skeleton-card pulse-glow" />
                    ))}
                </div>
            </div>
        );
    }

    // ========================================================================
    // 2. RENDER PAYLOAD: EMPTY STATE (Failsafe)
    // ========================================================================
    if (!tickets || tickets.length === 0) {
        return (
            <div className="etl-chassis">
                <div className="etl-header">
                    <h2>Eligible Journeys</h2>
                    <p>Select a ticket to view cancellation options.</p>
                </div>
                
                <div className="etl-empty-state">
                    <div className="etl-empty-icon-box">
                        <Ticket size={32} className="etl-empty-icon" />
                    </div>
                    <h4>No active tickets found</h4>
                    <p>You currently have no upcoming trips. Note: Tickets that have already departed, been scanned, or are already cancelled cannot be modified.</p>
                </div>
            </div>
        );
    }

    // ========================================================================
    // 3. RENDER PAYLOAD: THE ACTIVE FEED
    // ========================================================================
    return (
        <div className="etl-chassis">
            <div className="etl-header">
                <h2>Eligible Journeys</h2>
                <p>Select a ticket below to calculate your estimated refund.</p>
            </div>

            <div className="etl-feed">
                {tickets.map((ticket, index) => {
                    const isSelected = selectedTicketId === ticket.id;
                    const routes = ticket.routes || {};
                    const schedule = ticket.schedules || {};
                    const partner = ticket.partners || {};

                    return (
                        <div 
                            key={ticket.id}
                            className={`etl-card ${isSelected ? 'etl-card-selected' : ''} slide-up`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                            onClick={() => onSelectTicket(ticket)}
                        >
                            {/* TOP ROW: Company & Status */}
                            <div className="etl-card-header">
                                <div className="etl-company">
                                    <BusFront size={16} className="etl-company-icon" />
                                    <span>{partner.company_name || 'AyaBus Partner'}</span>
                                </div>
                                <span className="etl-seat-badge">Seat {ticket.seat_number}</span>
                            </div>

                            {/* MIDDLE ROW: The Routing Matrix */}
                            <div className="etl-route-matrix">
                                <div className="etl-route-node">
                                    <span className="etl-city">{routes.origin_city || 'Origin'}</span>
                                </div>
                                <div className="etl-route-connector">
                                    <div className="etl-line"></div>
                                    <ChevronRight size={16} className="etl-chevron" />
                                </div>
                                <div className="etl-route-node">
                                    <span className="etl-city">{routes.destination_city || 'Destination'}</span>
                                </div>
                            </div>

                            {/* BOTTOM ROW: Temporal Data */}
                            <div className="etl-temporal-row">
                                <div className="etl-time-pill">
                                    <Calendar size={14} />
                                    <span>{schedule.travel_date || 'Date N/A'}</span>
                                </div>
                                <div className="etl-time-pill">
                                    <Clock size={14} />
                                    <span>{schedule.departure_time || 'Time N/A'}</span>
                                </div>
                            </div>

                            {/* SELECTION INDICATOR (Only visible when clicked) */}
                            {isSelected && (
                                <div className="etl-selection-ring">
                                    <div className="etl-selection-dot" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Warning Banner */}
            <div className="etl-warning-banner">
                <AlertCircle size={14} className="etl-warning-icon" />
                <span>Cancelling a ticket is permanent. Seats are immediately released.</span>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for Light/Dark mode respect.
            ======================================================================== */}
            <style>{`
                .etl-chassis {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                }

                /* --- HEADER --- */
                .etl-header {
                    margin-bottom: 24px;
                }

                .etl-header h2 {
                    margin: 0 0 8px 0;
                    font-size: 20px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .etl-header p {
                    margin: 0;
                    font-size: 14px;
                    color: var(--text-muted);
                }

                /* --- THE FEED --- */
                .etl-feed {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    /* Ensures the list can scroll independently if it gets too long */
                    overflow-y: auto;
                    padding-right: 8px; /* Room for scrollbar */
                }

                /* --- THE TICKET CARD --- */
                .etl-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 20px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    /* Subtle hover lift to indicate interactability */
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .etl-card:hover {
                    border-color: color-mix(in srgb, var(--brand-primary) 50%, transparent);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
                }

                /* THE SELECTION STATE (Crucial for UX) */
                .etl-card-selected {
                    border-color: var(--brand-primary);
                    background: color-mix(in srgb, var(--brand-primary) 4%, transparent);
                    box-shadow: 0 0 0 1px var(--brand-primary);
                }

                /* --- CARD INTERNALS --- */
                .etl-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .etl-company {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 800;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .etl-company-icon { color: var(--text-muted); }

                .etl-seat-badge {
                    background: var(--bg-body);
                    border: 1px solid var(--border-subtle);
                    padding: 4px 10px;
                    border-radius: var(--radius-sm);
                    font-size: 12px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                /* The Route Display */
                .etl-route-matrix {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .etl-route-node {
                    flex: 1;
                }

                .etl-route-node:last-child {
                    text-align: right;
                }

                .etl-city {
                    font-size: 18px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .etl-route-connector {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 16px;
                    position: relative;
                }

                .etl-line {
                    width: 100%;
                    height: 2px;
                    background: repeating-linear-gradient(90deg, var(--border-subtle) 0, var(--border-subtle) 4px, transparent 4px, transparent 8px);
                }

                .etl-chevron {
                    position: absolute;
                    background: var(--bg-surface);
                    color: var(--text-muted);
                    padding: 0 4px;
                }

                .etl-card-selected .etl-chevron {
                    background: color-mix(in srgb, var(--brand-primary) 4%, transparent);
                    color: var(--brand-primary);
                }

                /* The Time Row */
                .etl-temporal-row {
                    display: flex;
                    gap: 12px;
                }

                .etl-time-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-muted);
                    background: var(--bg-body);
                    padding: 6px 12px;
                    border-radius: var(--radius-full);
                }

                /* The Radio Selection UI */
                .etl-selection-ring {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* Fades in when selected */
                    animation: fadeIn 0.2s ease-out;
                }

                .etl-selection-dot {
                    width: 10px;
                    height: 10px;
                    background: var(--brand-primary);
                    border-radius: 50%;
                }

                /* --- EMPTY & BOOT STATES --- */
                .etl-empty-state {
                    background: var(--bg-surface);
                    border: 1px dashed var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 48px 24px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .etl-empty-icon-box {
                    width: 64px;
                    height: 64px;
                    background: var(--bg-body);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                }

                .etl-empty-icon { color: var(--text-muted); }
                .etl-empty-state h4 { margin: 0 0 8px 0; color: var(--text-main); font-size: 16px; font-weight: 800; }
                .etl-empty-state p { margin: 0; color: var(--text-muted); font-size: 14px; max-width: 320px; line-height: 1.6; }

                .etl-skeleton-card {
                    height: 160px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                }

                /* --- SUPPLEMENTARY --- */
                .etl-warning-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    margin-top: 24px;
                    padding: 16px;
                    background: color-mix(in srgb, var(--status-warning) 10%, transparent);
                    border-radius: var(--radius-md);
                    color: var(--status-warning);
                    font-size: 13px;
                    font-weight: 600;
                    line-height: 1.5;
                }

                .etl-warning-icon { flex-shrink: 0; margin-top: 2px; }

                /* --- ANIMATIONS --- */
                .slide-up { animation: etlSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @keyframes etlSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};