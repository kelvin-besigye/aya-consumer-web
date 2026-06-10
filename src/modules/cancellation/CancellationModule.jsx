/**
 * 🌍 AYABUS CONSUMER WEB (The Friction Engine)
 * ------------------------------------------------------------------
 * Module: Cancellations (Module 10/24)
 * File: src/modules/cancellations/CancellationModule.jsx
 * * DESCRIPTION:
 * The Master Orchestrator. It manages the layout, handles the guest-lookup 
 * state machine (bypassing Auth), and securely routes data between the 
 * Selection List, the Physics Calculator, and the Action Firewall.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-AUTH ARCHITECTURE: Completely decoupled from `AuthContext`. Uses 
 * a dual-key lookup (Ticket Hash + Phone Number) to securely fetch itineraries 
 * for any guest user without requiring an account.
 * 2. ASYMMETRIC GRID: Uses CSS Grid to pin the Ticket Feed on the left while 
 * the Refund Preview sticks to the right on desktop, stacking flawlessly on mobile.
 * 3. THE KINETIC PIPELINE: Passes the selected ticket into the `penaltyCalculator` 
 * and pipes the result directly into the `RefundPreviewCard` and `ActionFirewallModal` 
 * in real-time.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, 
    Ticket, 
    Phone, 
    AlertCircle, 
    CheckCircle2, 
    ShieldCheck,
    ArrowRight
} from 'lucide-react';

// ========================================================================
// LIVE WIRES & ORGANS
// ========================================================================
import { supabase } from '../../lib/supabase'; // Direct access for the Guest Lookup
import { cancelService } from './services/cancel.service';
import { penaltyCalculator } from './utils/penalty.calculator';

import { EligibleTicketsList } from './components/EligibleTicketsList';
import { RefundPreviewCard } from './components/RefundPreviewCard';
import { ActionFirewallModal } from './components/ActionFirewallModal';

export const CancellationModule = () => {
    // ========================================================================
    // 1. STATE MACHINE
    // ========================================================================
    // A. Guest Lookup State
    const [lookupRef, setLookupRef] = useState('');
    const [lookupPhone, setLookupPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // B. Core Data State
    const [activeTickets, setActiveTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [previewData, setPreviewData] = useState(null);

    // C. Execution State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    // ========================================================================
    // 2. THE GUEST LOOKUP ENGINE (Auth Bypass)
    // ========================================================================
    const handleGuestSearch = async (e) => {
        e.preventDefault();
        if (!lookupRef || !lookupPhone) {
            setSearchError("Please enter both your Ticket Reference and Phone Number.");
            return;
        }

        setIsSearching(true);
        setSearchError(null);
        setSuccessMessage(null);

        try {
            // Direct relational graph fetch mimicking the authorized service, 
            // but filtered strictly by the user's provided credentials.
            const today = new Date().toISOString().split('T')[0];
            
            const { data, error } = await supabase
                .from('tickets')
                .select(`
                    *,
                    routes ( origin_city, destination_city ),
                    partners ( company_name, logo_url ),
                    schedules ( travel_date, departure_time, id )
                `)
                .eq('ticket_hash', lookupRef.trim().toUpperCase())
                .eq('passenger_phone', lookupPhone.trim())
                .eq('status', 'ACTIVE')
                .gte('travel_date', today)
                .single(); // We only expect one exact match

            if (error || !data) {
                throw new Error("No active, upcoming ticket found with those details. Please check your reference number.");
            }

            // Push the single found ticket into the array so the List component can render it
            setActiveTickets([data]);
            handleSelectTicket(data); // Auto-select since it's the only one

        } catch (error) {
            console.error("[AyaBus Guest Lookup Failed]:", error);
            setSearchError(error.message || "Failed to locate ticket.");
            setActiveTickets([]);
            setSelectedTicket(null);
            setPreviewData(null);
        } finally {
            setIsSearching(false);
        }
    };

    // ========================================================================
    // 3. THE PHYSICS PIPELINE
    // ========================================================================
    const handleSelectTicket = useCallback((ticket) => {
        setSelectedTicket(ticket);
        setSuccessMessage(null);
        
        // Feed the raw ticket into the math engine to get the exact UGX breakdown
        const calculation = penaltyCalculator.calculatePreview(ticket);
        setPreviewData(calculation);
    }, []);

    // ========================================================================
    // 4. THE DESTRUCTIVE EXECUTION
    // ========================================================================
    const executeCancellation = async () => {
        if (!selectedTicket || !previewData?.isEligible) return;

        setIsProcessing(true);

        const scheduleId = selectedTicket.schedules?.id;
        
        // Call the secure service we built in Phase 1
        const response = await cancelService.executeCancellation(selectedTicket.id, scheduleId, 1);

        if (response.success) {
            // Remove the cancelled ticket from the active view
            setActiveTickets(prev => prev.filter(t => t.id !== selectedTicket.id));
            setSelectedTicket(null);
            setPreviewData(null);
            setIsModalOpen(false);
            setSuccessMessage(`Cancellation successful. Your estimated refund of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'UGX' }).format(previewData.estimatedRefund)} is being processed.`);
        } else {
            setSearchError(response.error || "A system error occurred while cancelling. Please contact support.");
            setIsModalOpen(false);
        }

        setIsProcessing(false);
    };

    // ========================================================================
    // 5. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="ayabus-viewport cm-viewport">
            <div className="ayabus-scroll-area cm-scroll-chassis">
                
                {/* --- PAGE HEADER --- */}
                <div className="cm-page-header">
                    <h1 className="cm-page-title">Manage Booking</h1>
                    <p className="cm-page-subtitle">View your itinerary or cancel an upcoming journey.</p>
                </div>

                {/* --- SUCCESS TOAST (Post-Cancellation) --- */}
                {successMessage && (
                    <div className="cm-success-banner slide-up">
                        <CheckCircle2 size={20} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* --- THE MASTER GRID --- */}
                <div className="cm-master-grid">
                    
                    {/* LEFT DOMAIN: Triage & Lookup */}
                    <div className="cm-triage-zone">
                        
                        {/* Guest Lookup Form (Always visible if no tickets are loaded) */}
                        {activeTickets.length === 0 && (
                            <form onSubmit={handleGuestSearch} className="cm-lookup-form">
                                <div className="cm-lookup-header">
                                    <Search size={20} className="cm-brand-icon" />
                                    <h2>Find Your Ticket</h2>
                                </div>
                                <p className="cm-lookup-desc">Enter your details exactly as they appear on your booking receipt to access cancellation options.</p>
                                
                                {searchError && (
                                    <div className="cm-error-box">
                                        <AlertCircle size={16} />
                                        <span>{searchError}</span>
                                    </div>
                                )}

                                <div className="cm-input-group">
                                    <label>Ticket Reference (PNR)</label>
                                    <div className="cm-input-wrapper">
                                        <Ticket size={18} className="cm-input-icon" />
                                        <input 
                                            type="text" 
                                            placeholder="e.g. AYA-9X2B" 
                                            value={lookupRef}
                                            onChange={(e) => setLookupRef(e.target.value.toUpperCase())}
                                            className="cm-input"
                                            disabled={isSearching}
                                        />
                                    </div>
                                </div>

                                <div className="cm-input-group">
                                    <label>Phone Number</label>
                                    <div className="cm-input-wrapper">
                                        <Phone size={18} className="cm-input-icon" />
                                        <input 
                                            type="tel" 
                                            placeholder="e.g. 0770123456" 
                                            value={lookupPhone}
                                            onChange={(e) => setLookupPhone(e.target.value)}
                                            className="cm-input"
                                            disabled={isSearching}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="ayabus-btn cm-search-btn" disabled={isSearching || !lookupRef || !lookupPhone}>
                                    {isSearching ? 'Searching Database...' : 'Locate Booking'}
                                </button>
                            </form>
                        )}

                        {/* Active Tickets Feed (Visible once a ticket is found) */}
                        {activeTickets.length > 0 && (
                            <>
                                <EligibleTicketsList 
                                    tickets={activeTickets}
                                    selectedTicketId={selectedTicket?.id}
                                    onSelectTicket={handleSelectTicket}
                                    isLoading={false}
                                />
                                {/* Quick action to search another ticket */}
                                <button 
                                    className="ayabus-btn-ghost cm-reset-btn"
                                    onClick={() => { setActiveTickets([]); setSelectedTicket(null); setPreviewData(null); setLookupRef(''); }}
                                >
                                    <Search size={16} /> Look up a different ticket
                                </button>
                            </>
                        )}
                    </div>

                    {/* RIGHT DOMAIN: Financial Engine & Execution (Sticky) */}
                    <div className="cm-execution-zone">
                        <div className="cm-sticky-container">
                            
                            <RefundPreviewCard 
                                previewData={previewData}
                                isLoading={false}
                            />

                            {/* The Hardware Trigger */}
                            {selectedTicket && previewData && (
                                <div className="cm-action-chassis slide-up">
                                    <button 
                                        className="cm-trigger-btn"
                                        onClick={() => setIsModalOpen(true)}
                                        disabled={!previewData.isEligible}
                                    >
                                        <ShieldCheck size={20} />
                                        <span>Proceed to Cancellation</span>
                                        <ArrowRight size={18} className="cm-btn-arrow" />
                                    </button>
                                    <p className="cm-trigger-disclaimer">
                                        You will have a chance to review the final details before confirming.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* THE ACTION FIREWALL (Mounts over the entire screen) */}
                <ActionFirewallModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={executeCancellation}
                    ticket={selectedTicket}
                    previewData={previewData}
                    isProcessing={isProcessing}
                />

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                /* --- CHASSIS --- */
                .cm-viewport {
                    background: var(--bg-body);
                    display: flex;
                    flex-direction: column;
                }

                .cm-scroll-chassis {
                    padding: 32px 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }

                /* --- HEADER --- */
                .cm-page-header { margin-bottom: 32px; }
                .cm-page-title { margin: 0 0 8px 0; font-size: 32px; font-weight: 900; color: var(--text-main); letter-spacing: -0.5px; }
                .cm-page-subtitle { margin: 0; font-size: 16px; color: var(--text-muted); }

                /* --- ALERTS --- */
                .cm-success-banner {
                    display: flex; align-items: center; gap: 12px;
                    background: color-mix(in srgb, #10B981 10%, transparent);
                    border: 1px solid #10B981; color: #10B981;
                    padding: 16px 20px; border-radius: var(--radius-lg);
                    margin-bottom: 32px; font-weight: 700; font-size: 15px;
                }

                .cm-error-box {
                    display: flex; align-items: flex-start; gap: 8px;
                    background: color-mix(in srgb, #EF4444 10%, transparent);
                    color: #EF4444; padding: 12px 16px; border-radius: var(--radius-md);
                    font-size: 13px; font-weight: 600; margin-bottom: 20px; line-height: 1.5;
                }

                /* --- MASTER GRID --- */
                .cm-master-grid {
                    display: grid; grid-template-columns: 1fr 440px; gap: 40px; align-items: start;
                }

                /* --- GUEST LOOKUP FORM --- */
                .cm-lookup-form {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 32px;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.03);
                }

                .cm-lookup-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
                .cm-brand-icon { color: var(--brand-primary); }
                .cm-lookup-header h2 { margin: 0; font-size: 20px; font-weight: 800; color: var(--text-main); }
                .cm-lookup-desc { margin: 0 0 24px 0; color: var(--text-muted); font-size: 14px; line-height: 1.6; }

                .cm-input-group { margin-bottom: 20px; }
                .cm-input-group label { display: block; font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
                
                .cm-input-wrapper { position: relative; display: flex; align-items: center; }
                .cm-input-icon { position: absolute; left: 16px; color: var(--text-muted); }
                .cm-input { 
                    width: 100%; height: 52px; padding: 0 16px 0 44px;
                    background: var(--bg-input); border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md); color: var(--text-main);
                    font-size: 16px; font-weight: 600; font-family: monospace; transition: all 0.2s;
                }
                .cm-input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 10%, transparent); }
                
                .cm-search-btn { width: 100%; height: 52px; font-size: 16px; margin-top: 12px; }
                .cm-reset-btn { width: 100%; margin-top: 24px; gap: 8px; }

                /* --- EXECUTION ZONE --- */
                .cm-sticky-container { position: sticky; top: 24px; display: flex; flex-direction: column; gap: 24px; }

                .cm-action-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    display: flex; flex-direction: column; align-items: center;
                }

                .cm-trigger-btn {
                    width: 100%; height: 56px; border: none; border-radius: var(--radius-md);
                    background: color-mix(in srgb, #EF4444 10%, transparent);
                    color: #EF4444; font-size: 16px; font-weight: 800; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    transition: all 0.2s; position: relative; overflow: hidden;
                }
                .cm-trigger-btn:hover:not(:disabled) { background: #EF4444; color: #FFF; }
                .cm-trigger-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                
                .cm-btn-arrow { transition: transform 0.2s; }
                .cm-trigger-btn:hover:not(:disabled) .cm-btn-arrow { transform: translateX(4px); }

                .cm-trigger-disclaimer { margin: 16px 0 0 0; font-size: 12px; color: var(--text-muted); text-align: center; line-height: 1.5; font-weight: 600; }

                /* --- ANIMATIONS --- */
                .slide-up { animation: cmSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @keyframes cmSlideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 992px) {
                    .cm-scroll-chassis { padding: 24px 16px; }
                    .cm-master-grid { grid-template-columns: 1fr; gap: 32px; }
                    .cm-sticky-container { position: relative; top: 0; }
                }
            `}</style>
        </div>
    );
};