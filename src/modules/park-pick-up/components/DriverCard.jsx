/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Park Pick-Up (Module 13/24)
 * File: src/modules/park-pick-up/components/DriverCard.jsx
 * * DESCRIPTION:
 * The highly tactile, trusted profile card for last-mile logistics partners.
 * Displays critical safety telemetry (license plates) and features 
 * one-tap WhatsApp integration for frictionless negotiation.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ONE-TAP WHATSAPP: Dynamically generates a URL-encoded WhatsApp deep-link 
 * pre-filled with context (passenger arrival park & driver name).
 * 2. VISUAL SAFETY CUES: Styles the vehicle registration number as a physical 
 * license plate, actively training the passenger to verify before boarding.
 * 3. GRACEFUL FALLBACKS: Includes a mathematically centered avatar fallback 
 * if the driver hasn't uploaded a portrait to the Supabase storage bucket yet.
 */

import React from 'react';
import { 
    ShieldCheck, 
    MessageCircle, 
    Phone, 
    Car, 
    MapPin, 
    Languages, 
    User
} from 'lucide-react';

export const DriverCard = ({ driver }) => {
    // Failsafe: Do not render if the database row is completely empty
    if (!driver) return null;

    // ========================================================================
    // 1. DATA NORMALIZATION
    // ========================================================================
    const {
        service_name,
        driver_name,
        phone_number,
        vehicle_type,
        registration_number,
        base_park,
        languages,
        portrait_url,
        is_verified
    } = driver;

    // Safely parse the JSONB languages array whether it comes as a string or actual array
    let parsedLanguages = [];
    try {
        parsedLanguages = Array.isArray(languages) ? languages : JSON.parse(languages || '[]');
    } catch (e) {
        parsedLanguages = [];
    }

    // ========================================================================
    // 2. THE DIRECT-CONNECT ENGINE
    // ========================================================================
    // Clean the phone number (remove spaces) to ensure API compatibility
    const cleanPhone = phone_number.replace(/\s+/g, '');
    
    // URL-encode the pre-filled message so the browser can pass it to the WhatsApp app natively
    const prefilledMessage = encodeURIComponent(
        `Hello ${driver_name}, I am an AyaBus passenger arriving at ${base_park}. Are you available for a pick-up?`
    );
    
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${prefilledMessage}`;
    const directCallLink = `tel:${cleanPhone}`;

    // ========================================================================
    // 3. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="dc-chassis">
            
            {/* --- TOP: IDENTITY & TRUST --- */}
            <div className="dc-header">
                <div className="dc-avatar-vault">
                    {portrait_url ? (
                        <img src={portrait_url} alt={driver_name} className="dc-avatar-img" loading="lazy" />
                    ) : (
                        <div className="dc-avatar-fallback">
                            <User size={24} />
                        </div>
                    )}
                    {/* The Blue Tick (Absolute positioned over the avatar) */}
                    {is_verified && (
                        <div className="dc-verified-badge" title="AyaBus Verified Partner">
                            <ShieldCheck size={14} />
                        </div>
                    )}
                </div>

                <div className="dc-identity">
                    <h3 className="dc-driver-name">
                        {driver_name}
                    </h3>
                    <p className="dc-service-name">{service_name}</p>
                </div>
            </div>

            {/* --- MIDDLE: SAFETY TELEMETRY --- */}
            <div className="dc-body">
                
                <div className="dc-telemetry-row">
                    <MapPin size={16} className="dc-icon-muted" />
                    <span className="dc-telemetry-text">{base_park}</span>
                </div>

                <div className="dc-telemetry-row">
                    <Car size={16} className="dc-icon-muted" />
                    <span className="dc-telemetry-text">{vehicle_type}</span>
                    {/* The Physical License Plate UX */}
                    <span className="dc-license-plate">{registration_number}</span>
                </div>

                {parsedLanguages.length > 0 && (
                    <div className="dc-telemetry-row dc-lang-row">
                        <Languages size={16} className="dc-icon-muted" />
                        <div className="dc-lang-tags">
                            {parsedLanguages.map((lang, idx) => (
                                <span key={idx} className="dc-lang-pill">{lang}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- BOTTOM: KINETIC ACTIONS --- */}
            <div className="dc-footer">
                <a 
                    href={directCallLink} 
                    className="ayabus-btn-ghost dc-action-btn dc-call-btn"
                    aria-label={`Call ${driver_name}`}
                >
                    <Phone size={18} />
                    <span>Call</span>
                </a>
                
                <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ayabus-btn dc-action-btn dc-wa-btn"
                    aria-label={`WhatsApp ${driver_name}`}
                >
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                </a>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .dc-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    /* Subtle depth */
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
                }

                .dc-chassis:hover {
                    border-color: var(--brand-primary);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
                }

                /* --- HEADER & IDENTITY --- */
                .dc-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-subtle);
                    background: color-mix(in srgb, var(--bg-surface) 95%, var(--border-subtle));
                }

                .dc-avatar-vault {
                    position: relative;
                    width: 56px;
                    height: 56px;
                    flex-shrink: 0;
                }

                .dc-avatar-img, .dc-avatar-fallback {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid var(--bg-surface);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .dc-avatar-fallback {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-input);
                    color: var(--text-muted);
                }

                .dc-verified-badge {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 22px;
                    height: 22px;
                    background: #10B981; /* High-trust universal green */
                    color: #FFFFFF;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid var(--bg-surface);
                }

                .dc-identity {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .dc-driver-name {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                }

                .dc-service-name {
                    margin: 0;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                /* --- BODY & TELEMETRY --- */
                .dc-body {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    flex-grow: 1; /* Pushes footer down evenly in grids */
                }

                .dc-telemetry-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .dc-icon-muted {
                    color: var(--text-muted);
                    flex-shrink: 0;
                }

                .dc-telemetry-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                /* The Physical License Plate UX */
                .dc-license-plate {
                    margin-left: auto; /* Pushes it to the far right */
                    background: #FBBF24; /* Universal plate yellow */
                    color: #000000;
                    font-family: 'Courier New', Courier, monospace; /* Hardcoded monospace for plate aesthetic */
                    font-weight: 900;
                    font-size: 12px;
                    letter-spacing: 1px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    border: 1px solid rgba(0,0,0,0.2);
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.5); /* Metallic edge illusion */
                }

                /* Dark Mode Override for Plate (Keep it high contrast) */
                [data-theme="dark"] .dc-license-plate {
                    background: #111111; /* Many modern private plates are black/white */
                    color: #FFFFFF;
                    border: 1px solid #333;
                }

                .dc-lang-row {
                    align-items: flex-start;
                }

                .dc-lang-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .dc-lang-pill {
                    font-size: 11px;
                    font-weight: 700;
                    padding: 2px 8px;
                    background: var(--bg-input);
                    color: var(--text-muted);
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-subtle);
                    text-transform: uppercase;
                }

                /* --- FOOTER & ACTIONS --- */
                .dc-footer {
                    display: flex;
                    gap: 12px;
                    padding: 20px 24px;
                    border-top: 1px solid var(--border-subtle);
                    background: var(--bg-surface);
                }

                .dc-action-btn {
                    flex: 1;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 14px;
                    text-decoration: none; /* Strip native link styling */
                    border-radius: var(--radius-md);
                }

                /* WhatsApp specific override (Universal trust color) */
                .dc-wa-btn {
                    background: #25D366;
                    color: #FFFFFF;
                    border: none;
                }
                
                .dc-wa-btn:hover {
                    background: #1DA851;
                    color: #FFFFFF;
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 480px) {
                    .dc-header { padding: 16px; }
                    .dc-body { padding: 16px; }
                    .dc-footer { padding: 16px; gap: 8px; }
                    
                    /* Make the WhatsApp button take priority on tiny screens */
                    .dc-call-btn { flex: 0.5; }
                    .dc-wa-btn { flex: 1.5; }
                }
            `}</style>
        </div>
    );
};