/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 4 - Funnel Views)
 * File: Step1_SearchFeed.jsx
 *
 * v3 — Pure Presentation Component
 * - No more local fetch. All data comes from BookingModule via props.
 * - Single source of truth is now BookingModule.
 * - Cards animate in with a staggered reveal so the user actually
 *   "sees" the results arrive.
 * - Filter tabs and empty/skeleton states preserved.
 */

import React, { useState, useMemo } from 'react';
import { BusFront, ArrowRight, CalendarDays, RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react';

import { RouteCard } from '../components/RouteCard';

// ============================================================================
// THE FILTRATION CONSTANTS
// ============================================================================
const FILTER_TABS = ['All', 'Morning', 'Afternoon', 'Night', 'VIP', 'Standard'];

// ============================================================================
// SCANNING STATUS BANNER
// ============================================================================
const ScanningBanner = () => (
  <div className="sf-scanning-banner" role="status" aria-live="polite">
    <div className="sf-scanning-dots">
      <span /><span /><span />
    </div>
    <div className="sf-scanning-copy">
      <Sparkles size={16} className="text-primary" />
      <span>Scanning the network for available buses…</span>
    </div>
  </div>
);

export const Step1_SearchFeed = ({ searchParams, routes, isLoading, onSelectRoute, onModifySearch }) => {
    const [activeFilter, setActiveFilter] = useState('All');

    // ========================================================================
    // FILTRATION ENGINE
    // ========================================================================
    const filteredRoutes = useMemo(() => {
        if (activeFilter === 'All') return routes;

        return routes.filter(route => {
            const hour = parseInt(route.departureTime?.split(':')[0] || '0', 10);
            if (activeFilter === 'Morning') return hour >= 5 && hour < 12;
            if (activeFilter === 'Afternoon') return hour >= 12 && hour < 17;
            if (activeFilter === 'Night') return hour >= 17 || hour < 5;
            if (activeFilter === 'VIP') return route.busClass?.toLowerCase() === 'vip';
            if (activeFilter === 'Standard') return route.busClass?.toLowerCase() === 'standard';
            return true;
        });
    }, [routes, activeFilter]);

    // ========================================================================
    // RENDER VAULT
    // ========================================================================
    return (
        <div className="sf-chassis">
            {/* Header Strip */}
            <div className="sf-header-vault">
                <div className="sf-route-line">
                    <span className="city">{searchParams?.origin || 'Origin'}</span>
                    <ArrowRight size={20} className="sf-arrow text-subtle" />
                    <span className="city">{searchParams?.destination || 'Destination'}</span>
                </div>
                <div className="sf-meta-pills">
                    <div className="sf-pill">
                        <CalendarDays size={14} />
                        <span>{searchParams?.date || 'Select Date'}</span>
                    </div>
                </div>
                <button onClick={onModifySearch} className="ayabus-btn btn-outline sf-modify-btn">
                    <RefreshCw size={16} />
                    Modify Search
                </button>
            </div>

            {/* Scanning Banner — only visible during loading */}
            {isLoading && <ScanningBanner />}

            {/* Filtration Ribbon */}
            {!isLoading && routes.length > 0 && (
                <div className="sf-filters">
                    <SlidersHorizontal size={18} className="text-subtle" />
                    <div className="sf-tabs horizontal-scroll">
                        {FILTER_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={`sf-tab-btn ${activeFilter === tab ? 'is-active' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Feed Roster */}
            <div className="sf-feed-roster">
                {isLoading ? (
                    /* SKELETON LOADER */
                    <div className="sf-skeleton-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rc-skeleton-chassis pulse">
                                <div className="skel-header">
                                    <div className="skel-avatar"></div>
                                    <div className="skel-bar w-32"></div>
                                </div>
                                <div className="skel-timeline"></div>
                                <div className="skel-action"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredRoutes.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="sf-empty-vault fade-in">
                        <div className="empty-icon-ring">
                            <BusFront size={32} className="text-subtle" />
                        </div>
                        <h3>No buses found</h3>
                        <p className="text-subtle">
                            We couldn't find any trips for this route on the selected date.
                            Try choosing a different date or destination.
                        </p>
                        <button onClick={onModifySearch} className="ayabus-btn btn-primary mt-4">
                            Change Search
                        </button>
                    </div>
                ) : (
                    /* ROUTE CARDS with staggered reveal */
                    <div className="sf-route-grid">
                        {filteredRoutes.map((route, idx) => (
                            <div
                                key={route.scheduleId || route.routeId}
                                className="sf-card-stagger"
                                style={{ animationDelay: `${Math.min(idx, 8) * 60}ms` }}
                            >
                                <RouteCard
                                    route={route}
                                    onSelect={() => onSelectRoute(route)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CSS Encapsulation */}
            <style>{`
                .sf-chassis { display: flex; flex-direction: column; gap: 24px; padding: 16px 0; }

                /* ---------- Scanning Banner ---------- */
                .sf-scanning-banner {
                    display: flex; align-items: center; gap: 16px;
                    padding: 14px 20px;
                    background: linear-gradient(90deg,
                        color-mix(in srgb, var(--brand-primary) 8%, transparent),
                        color-mix(in srgb, var(--brand-primary) 3%, transparent));
                    border: 1px solid color-mix(in srgb, var(--brand-primary) 25%, transparent);
                    border-radius: var(--radius-lg);
                    animation: scanSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .sf-scanning-dots { display: flex; gap: 4px; }
                .sf-scanning-dots span {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--brand-primary);
                    animation: dotPulse 1.2s ease-in-out infinite;
                }
                .sf-scanning-dots span:nth-child(2) { animation-delay: 0.15s; }
                .sf-scanning-dots span:nth-child(3) { animation-delay: 0.30s; }
                .sf-scanning-copy {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 14px; font-weight: 600; color: var(--text-main);
                }
                @keyframes dotPulse {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                    40%           { transform: scale(1.0); opacity: 1; }
                }
                @keyframes scanSlide {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ---------- Header ---------- */
                .sf-header-vault {
                    display: flex; align-items: center; justify-content: space-between;
                    background: var(--bg-surface); padding: 16px 20px;
                    border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);
                    box-shadow: var(--shadow-sm);
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .sf-route-line { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 800; }
                .sf-arrow { color: var(--text-muted); }
                .sf-meta-pills { display: flex; gap: 12px; }
                .sf-pill {
                    display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600;
                    padding: 6px 12px; background: var(--bg-body); border-radius: 20px;
                    color: var(--text-main);
                }
                .sf-modify-btn { padding: 8px 16px; font-size: 14px; gap: 8px; }

                /* ---------- Filters ---------- */
                .sf-filters {
                    display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
                    animation-delay: 60ms;
                }
                .sf-tabs { display: flex; gap: 8px; }
                .sf-tab-btn {
                    padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-subtle);
                    background: transparent; color: var(--text-muted); font-weight: 600; font-size: 14px;
                    cursor: pointer; transition: all 0.2s; white-space: nowrap;
                }
                .sf-tab-btn:hover { background: var(--bg-surface); color: var(--text-main); }
                .sf-tab-btn.is-active {
                    background: var(--text-main); color: var(--bg-surface); border-color: var(--text-main);
                }

                /* ---------- Grid & Empty ---------- */
                .sf-feed-roster { min-height: 400px; }
                .sf-route-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
                .sf-skeleton-grid { display: flex; flex-direction: column; gap: 16px; }
                .sf-empty-vault {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    text-align: center; padding: 60px 20px; background: var(--bg-surface);
                    border-radius: var(--radius-lg); border: 1px dashed var(--border-strong);
                }
                .empty-icon-ring {
                    width: 64px; height: 64px; border-radius: 50%; background: var(--bg-body);
                    display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
                }
                .sf-empty-vault h3 { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
                .sf-empty-vault p { max-width: 400px; font-size: 15px; line-height: 1.5; }

                /* ---------- Staggered Card Reveal ---------- */
                .sf-card-stagger {
                    animation: cardRise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                @keyframes cardRise {
                    from { opacity: 0; transform: translateY(14px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0)   scale(1); }
                }

                /* ---------- Skeletons ---------- */
                .rc-skeleton-chassis {
                    display: grid; grid-template-columns: 250px 1fr 200px; gap: 24px;
                    background: var(--bg-surface); padding: 24px; border-radius: var(--radius-lg);
                    border: 1px solid var(--border-subtle); align-items: center;
                }
                .skel-header { display: flex; align-items: center; gap: 12px; }
                .skel-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--bg-body); }
                .skel-bar { height: 16px; border-radius: 4px; background: var(--bg-body); }
                .skel-bar.w-32 { width: 120px; }
                .skel-timeline { height: 40px; width: 100%; border-radius: 8px; background: var(--bg-body); }
                .skel-action { height: 80px; width: 100%; border-radius: 8px; background: var(--bg-body); }
                .pulse { animation: skelPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes skelPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

                /* ---------- Shared keyframes ---------- */
                @keyframes fadeInUp {
                    0%   { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                @media (max-width: 768px) {
                    .sf-header-vault { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .sf-modify-btn { width: 100%; justify-content: center; }
                    .rc-skeleton-chassis { grid-template-columns: 1fr; height: 240px; gap: 16px; }
                }
                @media (max-width: 480px) {
                    .sf-route-line .city { font-size: 18px; }
                }
            `}</style>
        </div>
    );
};
