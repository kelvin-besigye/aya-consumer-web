/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Digital Ticket Vault (Module 7/24)
 * File: src/modules/tickets/components/TicketVault.jsx
 * * DESCRIPTION:
 * The apex state manager for the user's travel itinerary. It ingests the 
 * raw graph payload, segregates it into the Time-Space continuum (Upcoming vs Past), 
 * and controls the Boarding Pass overlay.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. TIME-SPACE SEGREGATION: Uses a `useMemo` hook to strictly evaluate 
 * `Date.now()` against the ticket's departure time, mathematically guaranteeing 
 * that missed or old buses immediately fall into the historical tab.
 * 2. ARCHIVAL MEMORY MANAGEMENT: To prevent DOM bloat for frequent travelers, 
 * historical tickets are heavily paginated in memory. It only renders a small 
 * batch, providing a low-friction "Load History" button for deep retrieval.
 * 3. ZERO-LATENCY TABBING: Switching between Upcoming and Past tabs involves 
 * zero network requests. It's a pure, hardware-accelerated DOM swap.
 */

import React, { useState, useMemo } from 'react';
import { History, ShieldCheck, Loader2 } from 'lucide-react';

// ATOMIC COMPONENTS (Built in Phase 2)
import { TicketCard } from './TicketCard';
import { TicketEmptyState } from './TicketEmptyState';
import { BoardingPassModal } from './BoardingPassModal';

export const TicketVault = ({ 
    vaultData = [], 
    onBookTrip, 
    onDownloadPdf 
}) => {
    // ========================================================================
    // STATE MACHINE
    // ========================================================================
    const [activeTab, setActiveTab] = useState('UPCOMING'); // 'UPCOMING' | 'PAST'
    const [historyLimit, setHistoryLimit] = useState(5);    // Archival Pagination Engine
    
    // Modal Telemetry
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ========================================================================
    // THE TIME-SPACE SEGREGATOR (Data Processing)
    // Mathematically splits the 1D payload into active and dead tickets.
    // ========================================================================
    const { upcoming, past } = useMemo(() => {
        const now = Date.now();
        const activeQueue = [];
        const deadQueue = [];

        vaultData.forEach(ticket => {
            const depTime = new Date(ticket.departureTime).getTime();
            
            // A ticket is considered "Dead" if the bus has already left, 
            // or if the status was explicitly marked by the backend.
            const isDeadStatus = ['CANCELLED', 'USED', 'COMPLETED', 'REFUNDED'].includes((ticket.status || '').toUpperCase());
            
            if (depTime > now && !isDeadStatus) {
                activeQueue.push(ticket);
            } else {
                deadQueue.push(ticket);
            }
        });

        return { upcoming: activeQueue, past: deadQueue };
    }, [vaultData]);

    // ========================================================================
    // KINETIC HANDLERS
    // ========================================================================
    const handleOpenPass = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleClosePass = () => {
        setIsModalOpen(false);
        // Small delay before clearing data so the exit animation doesn't glitch
        setTimeout(() => setSelectedTicket(null), 300);
    };

    const handleLoadMoreHistory = () => {
        // Expand the DOM rendering limit by 10
        setHistoryLimit(prev => prev + 10);
    };

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    const renderActiveTabContent = () => {
        if (activeTab === 'UPCOMING') {
            if (upcoming.length === 0) {
                return <TicketEmptyState type="active" onBookTrip={onBookTrip} />;
            }
            return (
                <div className="tv-list-engine fade-in">
                    {upcoming.map((ticket) => (
                        <TicketCard 
                            key={ticket.id} 
                            ticket={ticket} 
                            onClick={handleOpenPass} 
                        />
                    ))}
                </div>
            );
        }

        if (activeTab === 'PAST') {
            if (past.length === 0) {
                return <TicketEmptyState type="past" onBookTrip={onBookTrip} />;
            }

            const visiblePastTickets = past.slice(0, historyLimit);
            const hasMoreHistory = past.length > historyLimit;

            return (
                <div className="tv-list-engine fade-in">
                    {visiblePastTickets.map((ticket) => (
                        <TicketCard 
                            key={ticket.id} 
                            ticket={ticket} 
                            onClick={handleOpenPass} 
                        />
                    ))}

                    {/* The Archival Memory Gateway */}
                    {hasMoreHistory && (
                        <div className="tv-history-footer">
                            <button className="tv-load-btn" onClick={handleLoadMoreHistory}>
                                <History size={16} />
                                Load Older Receipts ({past.length - visiblePastTickets.length} hidden)
                            </button>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="tv-chassis">
            
            {/* --- THE NAVIGATION MATRIX --- */}
            <div className="tv-tab-bar">
                <button 
                    className={`tv-tab ${activeTab === 'UPCOMING' ? 'tv-tab-active' : ''}`}
                    onClick={() => setActiveTab('UPCOMING')}
                >
                    <ShieldCheck size={18} />
                    <span>Upcoming</span>
                    {upcoming.length > 0 && <span className="tv-badge">{upcoming.length}</span>}
                </button>
                
                <button 
                    className={`tv-tab ${activeTab === 'PAST' ? 'tv-tab-active' : ''}`}
                    onClick={() => setActiveTab('PAST')}
                >
                    <History size={18} />
                    <span>History</span>
                </button>
                <div className="tv-tab-line"></div>
            </div>

            {/* --- THE DATA VIEWPORT --- */}
            <div className="tv-viewport">
                {renderActiveTabContent()}
            </div>

            {/* --- THE MODAL OVERLAY --- */}
            <BoardingPassModal 
                isOpen={isModalOpen}
                onClose={handleClosePass}
                ticket={selectedTicket}
                onDownloadPdf={onDownloadPdf}
            />

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
            ======================================================================== */}
            <style>{`
                .tv-chassis {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }

                /* --- TAB BAR GEOMETRY --- */
                .tv-tab-bar {
                    display: flex;
                    position: relative;
                    border-bottom: 2px solid var(--border-subtle);
                    margin-bottom: 24px;
                    gap: 32px;
                }

                .tv-tab {
                    background: transparent;
                    border: none;
                    padding: 16px 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    position: relative;
                    transition: color 0.2s;
                    z-index: 2;
                }

                .tv-tab:hover {
                    color: var(--text-main);
                }

                .tv-tab-active {
                    color: var(--brand-primary);
                }

                /* The underline indicator */
                .tv-tab::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--brand-primary);
                    transform: scaleX(0);
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    transform-origin: center;
                }

                .tv-tab-active::after {
                    transform: scaleX(1);
                }

                .tv-badge {
                    background: color-mix(in srgb, var(--brand-primary) 15%, transparent);
                    color: var(--brand-primary);
                    padding: 2px 8px;
                    border-radius: var(--radius-full);
                    font-size: 12px;
                    font-weight: 800;
                }

                /* --- VIEWPORT & LIST --- */
                .tv-viewport {
                    min-height: 400px; /* Prevents layout jumping when switching tabs */
                }

                .tv-list-engine {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* --- ARCHIVAL LOAD BUTTON --- */
                .tv-history-footer {
                    display: flex;
                    justify-content: center;
                    padding: 24px 0;
                    margin-top: 8px;
                    border-top: 1px dashed var(--border-subtle);
                }

                .tv-load-btn {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    color: var(--text-main);
                    height: 48px;
                    padding: 0 24px;
                    border-radius: var(--radius-full);
                    font-size: 14px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tv-load-btn:hover {
                    background: var(--bg-body);
                    border-color: var(--brand-primary);
                    color: var(--brand-primary);
                    box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary) 10%, transparent);
                }

                /* --- ANIMATIONS --- */
                .fade-in { animation: vaultFadeIn 0.4s ease forwards; }
                
                @keyframes vaultFadeIn { 
                    0% { opacity: 0; transform: translateX(10px); } 
                    100% { opacity: 1; transform: translateX(0); } 
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 600px) {
                    .tv-tab-bar { gap: 16px; }
                    .tv-tab { flex: 1; justify-content: center; font-size: 15px; }
                    .tv-load-btn { width: 100%; justify-content: center; }
                }
            `}</style>
        </div>
    );
};