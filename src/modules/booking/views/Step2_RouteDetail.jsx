/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 4 - Funnel Views)
 * File: Step2_RouteDetail.jsx
 * * DESCRIPTION:
 * The immersive inspection view. Displays the physical reality of the bus 
 * (Gallery), the geographical reality of the park (Map), and the legal 
 * reality of the ticket (Policies).
 * * WORLD-CLASS ENGINEERING:
 * 1. ASYNC DEGRADATION: The core text data renders instantly from Step 1's 
 * payload. Only the heavy extended details (Images, Policies) wait on a DB fetch.
 * 2. THE CONVERSION DOCK: On mobile screens, the primary Call-To-Action locks 
 * to the bottom of the screen (`position: fixed`) ensuring the user never 
 * has to scroll to find the "Select Seats" button.
 * 3. SPATIAL HIERARCHY: Uses an asymmetric CSS Grid (2fr / 1fr) on desktop 
 * to guide the eye naturally from visuals -> details -> action.
 */

import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Clock, MapPin, Star, ShieldAlert, 
    Briefcase, AlertCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';

// LIVE WIRES: Services & Atomic Components
import { bookingQueries } from '../services/booking.queries';
import { BusImageGallery } from '../components/BusImageGallery';
import { MapboxDirections } from '../components/MapboxDirections';

export const Step2_RouteDetail = ({ 
    route, 
    onBack, 
    onProceed,
    currency = 'UGX'
}) => {
    // ========================================================================
    // 1. STATE & TELEMETRY
    // ========================================================================
    const [extendedDetails, setExtendedDetails] = useState({
        gallery: [],
        cancellationPolicy: null,
        baggageAllowance: null
    });
    const [isLoadingDetails, setIsLoadingDetails] = useState(true);

    // ========================================================================
    // 2. THE ASYNC HYDRATION ENGINE
    // Fetches the heavy assets (images/policies) while keeping the UI interactive.
    // ========================================================================
    useEffect(() => {
        let isMounted = true;

        const hydrateRouteDetails = async () => {
            if (!route?.id) return;
            setIsLoadingDetails(true);

            // Calls the highly optimized query we built in File 2
            const response = await bookingQueries.fetchRouteDetails(route.id);
            
            if (isMounted && response.success) {
                setExtendedDetails({
                    gallery: response.data.gallery || [],
                    cancellationPolicy: response.data.cancellationPolicy || 'Standard 24-hour cancellation policy applies.',
                    baggageAllowance: response.data.baggageAllowance || '1 standard bag + 1 personal item included.'
                });
            }
            if (isMounted) setIsLoadingDetails(false);
        };

        hydrateRouteDetails();
        
        // Scroll to top when this view mounts for a fresh feeling
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return () => { isMounted = false; };
    }, [route]);

    // ========================================================================
    // 3. FAILSAFE & FORMATTERS
    // ========================================================================
    if (!route) return null;

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
    // 4. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="rd-chassis">
            
            {/* --- TOP NAV: THE ESCAPE HATCH & BRANDING --- */}
            <header className="rd-header-vault">
                <button className="ayabus-btn-ghost rd-back-btn" onClick={onBack}>
                    <ArrowLeft size={20} /> Back to Search
                </button>
                <div className="rd-operator-badge">
                    <img src={route.partner_logo || '/assets/fallbacks/bus-placeholder.png'} alt="Operator Logo" className="operator-logo" />
                    <div>
                        <h2 className="operator-name">{route.partner_name}</h2>
                        <div className="rating-pill">
                            <Star size={12} fill="currentColor" /> {route.partner_rating?.toFixed(1) || '5.0'}
                        </div>
                    </div>
                </div>
            </header>

            {/* --- HERO: THE VISUAL ANCHOR (Images) --- */}
            <section className="rd-hero-vault">
                {isLoadingDetails ? (
                    <div className="rd-gallery-skeleton pulse">
                        <div className="skel-icon"><BusFront size={48} className="text-muted" /></div>
                        <span>Loading interior visuals...</span>
                    </div>
                ) : (
                    <BusImageGallery images={extendedDetails.gallery} altTag={`${route.partner_name} ${route.class_name}`} />
                )}
            </section>

            {/* --- CORE CONTENT GRID --- */}
            <main className="rd-main-grid">
                
                {/* LEFT COLUMN: Data & Policies */}
                <div className="rd-data-column">
                    
                    {/* The Journey Timeline */}
                    <div className="rd-card">
                        <h3 className="rd-card-title">Journey Summary</h3>
                        <div className="rd-timeline-matrix">
                            <div className="timeline-node">
                                <div className="node-time">{formatTime(route.departure_time)}</div>
                                <div className="node-details">
                                    <span className="city">{route.origin}</span>
                                    <span className="park">{route.origin_park}</span>
                                </div>
                            </div>
                            
                            <div className="timeline-connector">
                                <div className="connector-line"></div>
                                <div className="connector-duration"><Clock size={12} /> {route.duration}</div>
                            </div>

                            <div className="timeline-node">
                                <div className="node-time">{formatTime(route.arrival_time)}</div>
                                <div className="node-details">
                                    <span className="city">{route.destination}</span>
                                    <span className="park">{route.destination_park}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities Matrix */}
                    {route.amenities && route.amenities.length > 0 && (
                        <div className="rd-card">
                            <h3 className="rd-card-title">Onboard Amenities</h3>
                            <div className="rd-amenities-grid">
                                {route.amenities.map((amenity, idx) => (
                                    <div key={idx} className="amenity-item">
                                        <CheckCircle2 size={16} className="text-success" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Policies (Baggage & Cancellation) */}
                    <div className="rd-card rd-policies-vault">
                        <h3 className="rd-card-title">Travel Policies</h3>
                        
                        <div className="policy-block">
                            <div className="policy-icon"><Briefcase size={20} /></div>
                            <div className="policy-text">
                                <h4>Baggage Allowance</h4>
                                {isLoadingDetails ? <div className="skel-text pulse w-3/4"></div> : <p>{extendedDetails.baggageAllowance}</p>}
                            </div>
                        </div>

                        <div className="policy-block mt-4">
                            <div className="policy-icon text-warning"><ShieldAlert size={20} /></div>
                            <div className="policy-text">
                                <h4>Cancellation & Refunds</h4>
                                {isLoadingDetails ? <div className="skel-text pulse w-full"></div> : <p>{extendedDetails.cancellationPolicy}</p>}
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Map & Action */}
                <div className="rd-action-column">
                    
                    {/* Boarding Location Map */}
                    <div className="rd-card map-card">
                        <h3 className="rd-card-title">Boarding Stage</h3>
                        {/* Passes data to the Mapbox component built in Phase 3 */}
                        <MapboxDirections 
                            parkName={route.origin_park}
                            address={`${route.origin}, Uganda`} // Extendable based on DB fields
                            lat={route.gps_lat} 
                            lng={route.gps_lng} 
                        />
                    </div>

                    {/* Desktop Checkout Summary Box */}
                    <div className="rd-card summary-card hide-on-mobile">
                        <div className="summary-price-row">
                            <span>Price per seat</span>
                            <span className="massive-price">{formatCurrency(route.price)}</span>
                        </div>
                        <div className="summary-class-row">
                            <span>Class</span>
                            <strong>{route.class_name}</strong>
                        </div>
                        <button className="ayabus-btn rd-proceed-btn" onClick={onProceed}>
                            Select Seats <ChevronRight size={20} />
                        </button>
                        <p className="summary-guarantee">
                            <ShieldAlert size={12} /> Instant refunds via Mobile Money
                        </p>
                    </div>

                </div>
            </main>

            {/* --- MOBILE STICKY CONVERSION DOCK --- */}
            <div className="rd-mobile-dock hide-on-desktop">
                <div className="dock-price-col">
                    <span className="dock-label">Price per seat</span>
                    <span className="dock-price">{formatCurrency(route.price)}</span>
                </div>
                <button className="ayabus-btn rd-proceed-btn" onClick={onProceed}>
                    Select Seats <ChevronRight size={20} />
                </button>
            </div>

            {/* ========================================================================
                5. COMPONENT-SCOPED STYLES (African Physics)
            ======================================================================== */}
            <style>{`
                .rd-chassis {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding-bottom: 100px; /* Buffer for mobile sticky dock */
                    background: var(--bg-canvas);
                    min-height: calc(100vh - var(--header-height));
                }

                /* --- HEADER VAULT --- */
                .rd-header-vault {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px;
                    background: var(--bg-surface);
                    border-bottom: 1px solid var(--border-subtle);
                }

                .rd-back-btn {
                    gap: 8px;
                    font-size: 14px;
                    padding: 0 16px;
                    height: 40px;
                }

                .rd-operator-badge {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-align: right;
                }
                .operator-logo { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border-subtle); object-fit: contain; background: var(--bg-body); }
                .operator-name { margin: 0; font-size: 16px; font-weight: 800; color: var(--text-main); }
                .rating-pill { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: #F59E0B; background: rgba(245, 158, 11, 0.1); padding: 2px 8px; border-radius: var(--radius-full); margin-top: 4px; justify-content: flex-end; }

                /* --- HERO VAULT --- */
                .rd-hero-vault {
                    padding: 24px;
                }
                .rd-gallery-skeleton {
                    width: 100%;
                    aspect-ratio: 16/9;
                    background: var(--bg-surface);
                    border-radius: var(--radius-xl);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    color: var(--text-muted);
                    border: 1px solid var(--border-subtle);
                }
                .skel-icon { opacity: 0.3; }

                /* --- MAIN GRID --- */
                .rd-main-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 24px;
                    padding: 0 24px;
                    align-items: start;
                }

                .rd-data-column, .rd-action-column {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                /* STANDARD CARD PHYSICS */
                .rd-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }
                .rd-card-title {
                    margin: 0 0 20px 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: var(--text-main);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* TIMELINE MATRIX */
                .rd-timeline-matrix {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .timeline-node {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                }
                .node-time { font-size: 16px; font-weight: 800; color: var(--brand-primary); min-width: 70px; padding-top: 2px; }
                .node-details { display: flex; flex-direction: column; }
                .node-details .city { font-size: 18px; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px; }
                .node-details .park { font-size: 13px; color: var(--text-muted); font-weight: 500; }
                
                .timeline-connector {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px 0 12px 34px; /* Align with nodes */
                }
                .connector-line { width: 2px; height: 30px; background: repeating-linear-gradient(to bottom, var(--border-subtle) 0, var(--border-subtle) 4px, transparent 4px, transparent 8px); }
                .connector-duration { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--text-muted); background: var(--bg-body); padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); }

                /* AMENITIES */
                .rd-amenities-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 16px;
                }
                .amenity-item { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--text-main); }
                .text-success { color: #10B981; }

                /* POLICIES */
                .policy-block { display: flex; align-items: flex-start; gap: 16px; }
                .policy-icon { width: 40px; height: 40px; border-radius: 50%; background: var(--bg-body); display: flex; align-items: center; justify-content: center; color: var(--text-main); flex-shrink: 0; }
                .policy-icon.text-warning { color: #F59E0B; }
                .policy-text h4 { margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: var(--text-main); }
                .policy-text p { margin: 0; font-size: 14px; color: var(--text-muted); line-height: 1.5; }
                .skel-text { height: 14px; background: var(--bg-body); border-radius: 4px; margin-top: 4px; }
                .mt-4 { margin-top: 24px; }

                /* MAP OVERRIDES */
                .map-card { padding: 0; overflow: hidden; border: 1px solid var(--border-subtle); }
                .map-card .rd-card-title { padding: 20px 20px 0 20px; margin-bottom: 16px; }

                /* SUMMARY CARD (Desktop) */
                .summary-card {
                    background: var(--bg-body); /* Slight offset from surface */
                    border: 2px solid var(--border-subtle);
                    position: sticky;
                    top: calc(var(--header-height) + 24px); /* Sticks as user scrolls policies */
                }
                .summary-price-row { display: flex; flex-direction: column; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 16px; margin-bottom: 16px; }
                .summary-price-row span { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                .massive-price { font-size: 32px !important; font-weight: 900 !important; color: var(--brand-primary) !important; letter-spacing: -1px !important; margin-top: 4px; }
                
                .summary-class-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 15px; color: var(--text-main); }
                
                .rd-proceed-btn {
                    width: 100%; height: 56px; font-size: 16px; font-weight: 800; justify-content: space-between; padding: 0 20px; background: var(--brand-primary); color: #FFF; border: none; border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;
                }
                .rd-proceed-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 30%, transparent); }
                
                .summary-guarantee { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11px; color: var(--text-muted); margin: 16px 0 0 0; font-weight: 600; text-transform: uppercase; }

                /* --- MOBILE DOCK --- */
                .rd-mobile-dock {
                    position: fixed;
                    bottom: 0; left: 0; right: 0;
                    background: var(--bg-surface);
                    border-top: 1px solid var(--border-subtle);
                    padding: 16px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    z-index: var(--z-dock, 100);
                    box-shadow: 0 -4px 24px rgba(0,0,0,0.05);
                    /* Safe Area support for newer iPhones without home buttons */
                    padding-bottom: calc(16px + env(safe-area-inset-bottom));
                }
                .dock-price-col { display: flex; flex-direction: column; }
                .dock-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                .dock-price { font-size: 20px; font-weight: 900; color: var(--brand-primary); letter-spacing: -0.5px; }
                .rd-mobile-dock .rd-proceed-btn { width: auto; flex: 1; height: 48px; max-width: 200px; }

                .pulse { animation: skelPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes skelPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (min-width: 1025px) {
                    .hide-on-desktop { display: none !important; }
                }
                
                @media (max-width: 1024px) {
                    .rd-main-grid { grid-template-columns: 1fr; }
                    .hide-on-mobile { display: none !important; }
                    .summary-card { position: static; }
                    /* On tablet, swap map to be above policies for better visual flow */
                    .rd-action-column { grid-row: 1; }
                    .rd-data-column { grid-row: 2; }
                }

                @media (max-width: 640px) {
                    .rd-header-vault { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .rd-operator-badge { width: 100%; justify-content: flex-start; text-align: left; }
                    .rating-pill { justify-content: flex-start; }
                    .rd-hero-vault { padding: 16px; }
                    .rd-main-grid { padding: 0 16px; gap: 16px; }
                    .rd-mobile-dock { padding: 16px; }
                }
            `}</style>
        </div>
    );
};