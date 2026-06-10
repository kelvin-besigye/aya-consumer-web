/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Digital Ticket Vault (Module 7/24)
 * File: src/modules/tickets/TicketsModule.jsx
 * * DESCRIPTION:
 * The apex routing shell for the Tickets ecosystem. Orchestrates authentication 
 * interception, data hydration, and global offline PDF generation.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. SECURE INTERCEPTOR: Strictly gates the entire module. If `isAuthenticated` 
 * is false, it instantly renders a contextual auth prompt without leaking any UI.
 * 2. GRACEFUL HYDRATION: Manages a strict 3-tier state machine (Loading -> Error -> Success) 
 * to guarantee the user is always informed of the network status.
 * 3. ENGINE BRIDGING: Wires the UI directly to the `ticketEngine`, translating 
 * the 1D vault data back into the precise format required for PDF generation.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, AlertTriangle, RefreshCcw, LogIn, ArrowRight, Loader2 } from 'lucide-react';

// LIVE WIRES: Global Brain & Services
import { useAuth } from '../../context/AuthContext';
import { ticketQueries } from './services/ticket.queries';
// Assuming the engine built in the Booking module is accessible here:
import { ticketEngine } from '../booking/services/ticket.engine'; 

// ATOMIC COMPONENTS: Built in Phase 2
import { TicketVault } from './components/TicketVault';

export const TicketsModule = () => {
    // ========================================================================
    // 1. GLOBAL CONTEXT
    // ========================================================================
    const { user, isAuthenticated, isBooting } = useAuth();

    // ========================================================================
    // 2. STATE MACHINE
    // ========================================================================
    const [vaultData, setVaultData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ========================================================================
    // 3. THE HYDRATION ENGINE
    // ========================================================================
    const fetchVault = useCallback(async () => {
        // Safety check: Don't fetch if no user ID exists
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        const response = await ticketQueries.fetchUserVault(user.id);

        if (response.success) {
            setVaultData(response.data);
        } else {
            setError(response.error);
        }

        setIsLoading(false);
    }, [user?.id]);

    // Trigger fetch on mount or when user ID changes
    useEffect(() => {
        if (isAuthenticated && !isBooting) {
            fetchVault();
        }
    }, [isAuthenticated, isBooting, fetchVault]);

    // ========================================================================
    // 4. KINETIC HANDLERS
    // ========================================================================
    const handleBookTrip = () => {
        // African Physics router push - adaptable to React Router / Next.js
        window.location.href = '/'; 
    };

    const handleNavigateToAuth = () => {
        window.location.href = '/sign-up?redirect=/tickets';
    };

    const handleDownloadPdf = async (ticket) => {
        try {
            // Translate the flattened Ticket object into the exact shape the Engine expects
            const enginePayload = {
                ticketId: ticket.id,
                pnrCode: ticket.reference,
                departureTime: ticket.departureTime,
                arrivalTime: ticket.arrivalTime,
                origin: ticket.origin,
                destination: ticket.destination,
                boardingPoint: ticket.boardingPoint,
                dropoffPoint: ticket.dropoffPoint,
                seatNumber: ticket.seatNumber,
                passengerName: user?.user_metadata?.first_name || 'Passenger',
                amount: ticket.amountPaid,
                partnerName: ticket.partnerName,
                partnerLogo: ticket.partnerLogo,
                busClass: ticket.busType,
                registrationNo: ticket.registration
            };

            // The exact string the conductor's scanner will read
            const qrPayload = JSON.stringify({
                pnr: ticket.reference,
                id: ticket.id,
                seat: ticket.seatNumber,
                status: ticket.status
            });

            // Fire the offline generation engine
            await ticketEngine.issueTicket(enginePayload, qrPayload);
            
        } catch (err) {
            console.error("[TicketsModule] PDF Compilation Failed:", err);
            alert("Unable to generate PDF. Please check your device storage and try again.");
        }
    };

    // ========================================================================
    // 5. RENDER BRANCHES (The Interceptors)
    // ========================================================================
    
    // BRANCH A: Global Auth is still booting up
    if (isBooting) {
        return (
            <div className="tm-viewport tm-center-matrix">
                <Loader2 size={48} className="tm-spinner" />
            </div>
        );
    }

    // BRANCH B: The Guest Interceptor
    if (!isAuthenticated) {
        return (
            <div className="tm-viewport tm-center-matrix fade-in">
                <div className="tm-interceptor-chassis">
                    <div className="tm-icon-vault">
                        <Ticket size={48} className="tm-primary-icon" />
                    </div>
                    <h2 className="tm-title">Secure Ticket Vault</h2>
                    <p className="tm-subtitle">Please sign in to access your digital boarding passes, track past journeys, and manage cancellations.</p>
                    <button className="ayabus-btn tm-action-btn" onClick={handleNavigateToAuth}>
                        <LogIn size={18} />
                        <span>Sign In / Register</span>
                    </button>
                </div>
            </div>
        );
    }

    // ========================================================================
    // 6. RENDER PAYLOAD (The Sovereign Dashboard)
    // ========================================================================
    return (
        <div className="tm-viewport fade-in">
            <div className="tm-scroll-container">
                <div className="tm-dashboard-chassis">
                    
                    {/* --- MASTER HEADER --- */}
                    <div className="tm-header-vault">
                        <div className="tm-header-titles">
                            <div className="tm-icon-badge">
                                <Ticket size={28} />
                            </div>
                            <div>
                                <h1 className="tm-title">My Tickets</h1>
                                <p className="tm-subtitle">Your digital boarding passes and travel history.</p>
                            </div>
                        </div>
                    </div>

                    {/* --- DYNAMIC VIEWPORT --- */}
                    <div className="tm-content-matrix">
                        {isLoading ? (
                            // Loading State
                            <div className="tm-center-matrix py-extra">
                                <Loader2 size={40} className="tm-spinner" />
                                <span className="tm-loading-text">Syncing Secure Vault...</span>
                            </div>
                        ) : error ? (
                            // Error State
                            <div className="tm-center-matrix py-extra tm-error-state fade-in">
                                <AlertTriangle size={48} className="tm-error-icon" />
                                <h3>Connection Failed</h3>
                                <p>{error}</p>
                                <button className="ayabus-btn-ghost" onClick={fetchVault}>
                                    <RefreshCcw size={16} /> Retry Connection
                                </button>
                            </div>
                        ) : (
                            // Success State (The Vault)
                            <TicketVault 
                                vaultData={vaultData}
                                onBookTrip={handleBookTrip}
                                onDownloadPdf={handleDownloadPdf}
                            />
                        )}
                    </div>

                </div>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for instantaneous theming.
            ======================================================================== */}
            <style>{`
                /* --- INFRASTRUCTURE --- */
                .tm-viewport {
                    width: 100%;
                    height: 100%;
                    min-height: calc(100vh - var(--header-height));
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-body);
                    overflow: hidden; /* Lock window scroll, handle internally */
                }

                .tm-scroll-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 40px 24px;
                    -webkit-overflow-scrolling: touch; /* iOS momentum scrolling */
                }

                .tm-dashboard-chassis {
                    width: 100%;
                    max-width: 1000px; /* Tighter width for tickets to maintain reading geometry */
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                /* --- MATRIX UTILITIES --- */
                .tm-center-matrix {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    height: 100%;
                    width: 100%;
                }
                .py-extra { padding: 64px 0; }

                /* --- HEADER --- */
                .tm-header-vault {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-bottom: 24px;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .tm-header-titles {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .tm-icon-badge {
                    width: 56px;
                    height: 56px;
                    border-radius: var(--radius-lg);
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    color: var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .tm-title {
                    margin: 0 0 4px 0;
                    font-size: 28px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .tm-subtitle {
                    margin: 0;
                    font-size: 15px;
                    color: var(--text-muted);
                }

                /* --- INTERCEPTOR (GUEST VIEW) --- */
                .tm-interceptor-chassis {
                    max-width: 400px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    padding: 32px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    box-shadow: 0 24px 48px rgba(0,0,0,0.05);
                }

                .tm-icon-vault {
                    width: 80px; height: 80px;
                    border-radius: 50%;
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 8px;
                }

                .tm-primary-icon { color: var(--brand-primary); }
                .tm-action-btn { width: 100%; height: 56px; font-size: 16px; margin-top: 16px; gap: 12px; }

                /* --- STATES --- */
                .tm-spinner {
                    color: var(--brand-primary);
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }

                .tm-loading-text {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-muted);
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .tm-error-state { gap: 12px; }
                .tm-error-icon { color: #EF4444; margin-bottom: 8px; }
                .tm-error-state h3 { margin: 0; font-size: 20px; color: var(--text-main); }
                .tm-error-state p { margin: 0 0 16px 0; color: var(--text-muted); font-size: 15px; }

                /* --- ANIMATIONS --- */
                .fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 600px) {
                    .tm-scroll-container { padding: 24px 16px; }
                    .tm-header-titles { gap: 16px; }
                    .tm-icon-badge { width: 48px; height: 48px; }
                    .tm-title { font-size: 24px; }
                    .tm-interceptor-chassis { padding: 24px 16px; border: none; box-shadow: none; background: transparent; }
                }
            `}</style>
        </div>
    );
};

export default TicketsModule;