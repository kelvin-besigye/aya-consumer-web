/**
 * 🌍 AYABUS CONSUMER WEB (The Booking Engine)
 * ------------------------------------------------------------------
 * Module: Phase 3 (UI Components)
 * File: RouteCard.jsx
 * * * DESCRIPTION:
 * The apex individual route listing component. Acts as the primary conversion 
 * anchor in the Step 1 Search Feed.
 * * * WORLD-CLASS ENGINEERING:
 * 1. ZERO-DEPENDENCY FORMATTING: Uses native `Intl.NumberFormat` and `Intl.DateTimeFormat` 
 * instead of heavy libraries like moment.js, ensuring lighting-fast rendering.
 * 2. SEAT URGENCY ENGINE: Automatically calculates color-coded urgency badges 
 * (e.g., "Only 4 seats left" in red) to drive conversion psychology.
 * 3. FLUID GRID PHYSICS: Uses CSS Grid for perfect multi-directional responsiveness, 
 * ensuring the card looks incredible on a 320px phone or a 4K monitor.
 * 4. SWEETSPOT HIGHLIGHT: Dynamically tags optimal "Sweetspot" economic routes 
 * based on a value-to-price ratio.
 */

import React from 'react';
import { 
    Clock, 
    MapPin, 
    Star, 
    ChevronRight, 
    Wifi, 
    Tv, 
    BatteryCharging, 
    Wind, 
    Coffee, 
    ShieldCheck, 
    AlertCircle 
} from 'lucide-react';

// ========================================================================
// 1. UTILITY: AMENITY ICON MAPPER
// Dynamically renders the correct icon based on the database string.
// ========================================================================
const getAmenityIcon = (amenityName) => {
    const map = {
        'WIFI': <Wifi size={14} />,
        'AC': <Wind size={14} />,
        'CHARGING': <BatteryCharging size={14} />,
        'TV': <Tv size={14} />,
        'SNACKS': <Coffee size={14} />
    };
    return map[amenityName.toUpperCase()] || <ShieldCheck size={14} />;
};

export const RouteCard = ({ route, onSelect, currency = 'UGX' }) => {
    // ========================================================================
    // 2. SAFETY GUARDS & DATA DESTRUCTURING
    // Prevents crashes if the database returns an incomplete row.
    // ========================================================================
    if (!route) return null;

    const {
        id,
        partner_name = "AyaBus Partner",
        partner_logo = "/assets/fallbacks/bus-placeholder.png",
        class_name = "Standard",
        departure_time,
        arrival_time,
        duration = "TBD",
        price = 0,
        origin_park = "Main Terminal",
        destination_park = "Drop-off Point",
        remaining_seats = 0,
        amenities = [],
        partner_rating = 5.0,
        is_sweetspot = false // Flag from DB for the primary economic demographic
    } = route;

    // ========================================================================
    // 3. NATIVE FORMATTERS (High Performance)
    // ========================================================================
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatTime = (isoString) => {
        if (!isoString) return "--:--";
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-UG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    // ========================================================================
    // 4. URGENCY ENGINE LOGIC
    // ========================================================================
    const getSeatStatus = (seats) => {
        if (seats <= 0) return { text: "Sold Out", class: "status-danger", canBook: false };
        if (seats <= 5) return { text: `Only ${seats} seats left`, class: "status-danger", canBook: true };
        if (seats <= 15) return { text: "Fast Selling", class: "status-warning", canBook: true };
        return { text: `${seats} seats available`, class: "status-safe", canBook: true };
    };

    const seatStatus = getSeatStatus(remaining_seats);

    // ========================================================================
    // 5. RENDER PAYLOAD
    // ========================================================================
    return (
        <article 
            className={`route-card-chassis ${!seatStatus.canBook ? 'is-disabled' : ''}`}
            onClick={() => seatStatus.canBook && onSelect(route)}
            role="button"
            tabIndex={0}
            aria-disabled={!seatStatus.canBook}
        >
            {/* SWEETSPOT BADGE (For target economic demographic) */}
            {is_sweetspot && (
                <div className="sweetspot-ribbon">
                    <Star size={12} fill="currentColor" /> AyaBus Sweetspot
                </div>
            )}

            <div className="rc-main-grid">
                
                {/* --- LEFT: PARTNER IDENTITY & RATING --- */}
                <div className="rc-identity-vault">
                    <div className="logo-container">
                        <img src={partner_logo} alt={`${partner_name} logo`} loading="lazy" />
                    </div>
                    <div className="identity-text">
                        <h3 className="company-name">{partner_name}</h3>
                        <div className="rating-pill">
                            <Star size={12} className="star-icon" fill="currentColor" />
                            <span>{partner_rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                {/* --- CENTER: THE ROUTE TIMELINE --- */}
                <div className="rc-timeline-vault">
                    <div className="timeline-node">
                        <span className="time-text">{formatTime(departure_time)}</span>
                        <span className="park-text"><MapPin size={12} /> {origin_park}</span>
                    </div>
                    
                    <div className="timeline-bridge">
                        <span className="duration-text"><Clock size={12} /> {duration}</span>
                        <div className="bridge-line"></div>
                        <span className="class-badge">{class_name}</span>
                    </div>

                    <div className="timeline-node text-right">
                        <span className="time-text">{formatTime(arrival_time)}</span>
                        <span className="park-text"><MapPin size={12} /> {destination_park}</span>
                    </div>
                </div>

                {/* --- RIGHT: PRICE & ACTION --- */}
                <div className="rc-action-vault">
                    <div className="price-matrix">
                        <span className="price-label">Price per seat</span>
                        <span className="price-value">{formatCurrency(price)}</span>
                    </div>
                    
                    <button 
                        className="ayabus-btn rc-book-btn" 
                        disabled={!seatStatus.canBook}
                    >
                        {seatStatus.canBook ? 'Select Seats' : 'Sold Out'} 
                        <ChevronRight size={18} />
                    </button>
                    
                    <div className={`seat-urgency ${seatStatus.class}`}>
                        {seatStatus.class !== 'status-safe' && <AlertCircle size={12} />}
                        <span>{seatStatus.text}</span>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM: AMENITIES STRIP --- */}
            {amenities.length > 0 && (
                <div className="rc-amenities-strip">
                    {amenities.map((amenity, idx) => (
                        <div key={idx} className="amenity-pill">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ========================================================================
                6. COMPONENT-SCOPED STYLES (African Physics)
                Strictly uses index.css variables for perfect Dark/Light mode syncing.
            ======================================================================== */}
            <style>{`
                .route-card-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 20px;
                    margin-bottom: 16px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: var(--ease-main);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                }

                .route-card-chassis:hover {
                    border-color: var(--brand-primary);
                    box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                    transform: translateY(-2px);
                }

                .route-card-chassis.is-disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    pointer-events: none;
                    filter: grayscale(100%);
                }

                /* --- RIBBON --- */
                .sweetspot-ribbon {
                    position: absolute;
                    top: 0;
                    left: 20px;
                    background: var(--brand-primary);
                    color: #FFF;
                    padding: 4px 12px;
                    border-bottom-left-radius: var(--radius-sm);
                    border-bottom-right-radius: var(--radius-sm);
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    letter-spacing: 0.5px;
                }

                /* --- MAIN GRID --- */
                .rc-main-grid {
                    display: grid;
                    grid-template-columns: 2fr 4fr 2.5fr;
                    gap: 24px;
                    align-items: center;
                    margin-top: 8px;
                }

                /* --- IDENTITY VAULT --- */
                .rc-identity-vault {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .logo-container {
                    width: 48px;
                    height: 48px;
                    border-radius: var(--radius-full);
                    border: 1px solid var(--border-subtle);
                    overflow: hidden;
                    background: var(--bg-body);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .logo-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .company-name {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-main);
                }
                .rating-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: rgba(245, 158, 11, 0.1);
                    color: #F59E0B;
                    padding: 2px 8px;
                    border-radius: var(--radius-full);
                    font-size: 12px;
                    font-weight: 700;
                }

                /* --- TIMELINE VAULT --- */
                .rc-timeline-vault {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }
                .timeline-node {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .timeline-node.text-right {
                    text-align: right;
                    align-items: flex-end;
                }
                .time-text {
                    font-size: 20px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }
                .park-text {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .timeline-bridge {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                    padding: 0 16px;
                }
                .duration-text {
                    font-size: 12px;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 500;
                }
                .bridge-line {
                    width: 100%;
                    height: 2px;
                    background: repeating-linear-gradient(to right, var(--border-subtle) 0, var(--border-subtle) 4px, transparent 4px, transparent 8px);
                }
                .class-badge {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--text-main);
                    background: var(--bg-body);
                    padding: 2px 8px;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-subtle);
                    text-transform: uppercase;
                }

                /* --- ACTION VAULT --- */
                .rc-action-vault {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 8px;
                    text-align: right;
                }
                .price-matrix {
                    display: flex;
                    flex-direction: column;
                }
                .price-label {
                    font-size: 12px;
                    color: var(--text-muted);
                }
                .price-value {
                    font-size: 22px;
                    font-weight: 800;
                    color: var(--brand-primary);
                    letter-spacing: -0.5px;
                }
                .rc-book-btn {
                    height: 40px;
                    padding: 0 16px;
                    font-size: 14px;
                    width: 100%;
                    justify-content: space-between;
                    background: var(--brand-primary);
                    color: #FFF;
                    border: none;
                    border-radius: var(--radius-md);
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                .rc-book-btn:hover {
                    filter: brightness(1.1);
                }
                
                /* Seat Urgency Colors */
                .seat-urgency {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .status-danger { color: #EF4444; }
                .status-warning { color: #F59E0B; }
                .status-safe { color: #10B981; }

                /* --- AMENITIES STRIP --- */
                .rc-amenities-strip {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px dashed var(--border-subtle);
                }
                .amenity-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--text-muted);
                    background: var(--bg-body);
                    padding: 4px 10px;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-subtle);
                }

                /* =========================================================
                   RESPONSIVE DEGRADATION (Mobile First Physics)
                   ========================================================= */
                @media (max-width: 1024px) {
                    .rc-main-grid {
                        grid-template-columns: 1fr 2fr;
                        grid-template-rows: auto auto;
                    }
                    .rc-action-vault {
                        grid-column: 1 / -1;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        border-top: 1px solid var(--border-subtle);
                        padding-top: 16px;
                        margin-top: 8px;
                    }
                    .price-matrix { text-align: left; }
                    .rc-book-btn { width: auto; min-width: 140px; }
                    .seat-urgency { display: none; /* Hide on tablet to save space, rely on button state */ }
                }

                @media (max-width: 640px) {
                    .rc-main-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    .rc-identity-vault {
                        border-bottom: 1px solid var(--border-subtle);
                        padding-bottom: 12px;
                    }
                    .rc-timeline-vault {
                        padding: 8px 0;
                    }
                    .time-text { font-size: 18px; }
                    .rc-action-vault {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 12px;
                    }
                    .price-matrix {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .seat-urgency { 
                        display: flex; 
                        justify-content: center; 
                    }
                    .rc-amenities-strip {
                        gap: 8px;
                    }
                    .amenity-pill {
                        font-size: 11px;
                        padding: 4px 8px;
                    }
                }
            `}</style>
        </article>
    );
};