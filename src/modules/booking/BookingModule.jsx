/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 5 - The Wrapper)
 * File: BookingModule.jsx
 *
 * v3 — Search Completion Callback
 * - Adds `onSearchComplete` prop so HomePage can reset its button
 *   spinner once routes land.
 * - Pre-fetch skeleton state on first mount with no params so the
 *   user sees an empty state rather than a flash of stale routes.
 * - Smooth fade-in transitions on each step change.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Map, Armchair, CreditCard, CheckCircle2 } from 'lucide-react';

import { bookingQueries } from './services/booking.queries';
import { Step1_SearchFeed } from './views/Step1_SearchFeed';
import { Step2_RouteDetail } from './views/Step2_RouteDetail';
import { Step3_SeatVault } from './views/Step3_SeatVault';
import { Step4_Checkout } from './views/Step4_Checkout';

if (typeof window !== 'undefined') {
  window.__ayabus = {
    testConnection: bookingQueries.testConnection,
    diagnoseRLS:    bookingQueries.diagnoseRLS,
  };
}

export const Booking = ({ initialSearchParams, onSearchComplete }) => {

  const [currentStep, setCurrentStep] = useState(1);

  const normaliseParams = (params) => {
    if (!params) return null;
    return {
      origin:      (params.origin || '').trim(),
      destination: (params.destination || '').trim(),
      date:        params.date || params.travelDate || new Date().toISOString().split('T')[0],
      passengers:  params.passengers || 1,
    };
  };

  const [searchParams, setSearchParams] = useState(
    normaliseParams(initialSearchParams) || {
      origin: '',
      destination: '',
      date: new Date().toISOString().split('T')[0],
      passengers: 1
    }
  );

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [manifest, setManifest] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Steps 2-4 (Detail, Seats, Checkout) render inside a full-screen overlay,
  // separate from the Step 1 results feed which stays on the homepage.
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Lock background scroll while the overlay is open, and let Escape
  // trigger the same close-confirmation flow as the X button.
  useEffect(() => {
    if (!isOverlayOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (showCloseConfirm) {
        setShowCloseConfirm(false);
        return;
      }
      const hasProgress = currentStep >= 2 && (manifest.length > 0 || currentStep >= 3);
      if (hasProgress) {
        setShowCloseConfirm(true);
      } else {
        setIsOverlayOpen(false);
        setCurrentStep(1);
        setSelectedRoute(null);
        setBookedSeats([]);
        setManifest([]);
        setTotalPrice(0);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOverlayOpen, showCloseConfirm, currentStep, manifest.length]);

  // Keep latest callback in a ref so useCallback(fetchRoutes, []) is stable
  // but we still call the freshest onSearchComplete when a fetch resolves.
  const onSearchCompleteRef = useRef(onSearchComplete);
  useEffect(() => { onSearchCompleteRef.current = onSearchComplete; }, [onSearchComplete]);

  // =========================================================================
  // HYDRATION ENGINE
  // =========================================================================
  const fetchRoutes = useCallback(async (params) => {
    if (!params?.origin || !params?.destination) {
      setAvailableRoutes([]);
      setIsLoadingRoutes(false);
      onSearchCompleteRef.current?.();
      return;
    }
    setIsLoadingRoutes(true);
    setSearchError(null);
    try {
      console.log('[BookingModule] Fetching routes for:', params);
      const response = await bookingQueries.searchAvailableRoutes(params);

      if (response.success) {
        setAvailableRoutes(response.data || []);
        console.log('[BookingModule] Routes returned:', (response.data || []).length);
        if ((response.data || []).length === 0) {
          console.warn(
            '[BookingModule] Zero routes returned. Possible causes:\n' +
            '  1. No routes in DB matching origin/destination (check spelling)\n' +
            '  2. Routes exist but no ACTIVE schedule for this date'
          );
        }
      } else {
        setAvailableRoutes([]);
        setSearchError(response.error || 'Unknown error');
        console.error('[BookingModule] Route Fetch Failed:', response.error);
      }
    } catch (err) {
      console.error('[BookingModule] fetchRoutes threw:', err);
      setAvailableRoutes([]);
      setSearchError(err.message);
    } finally {
      setIsLoadingRoutes(false);
      onSearchCompleteRef.current?.();
    }
  }, []);

  useEffect(() => {
    if (searchParams?.origin && searchParams?.destination) {
      fetchRoutes(searchParams);
    } else {
      setIsLoadingRoutes(false);
    }
  }, [searchParams, fetchRoutes]);

  // =========================================================================
  // STORE MUTATION ACTIONS
  // =========================================================================
  const handleToggleSeat = (seatId) => {
    setManifest(prev => {
      const exists = prev.find(p => p.seatId === seatId);
      const newManifest = exists
        ? prev.filter(p => p.seatId !== seatId)
        : [...prev, { seatId, passengerName: '', activePhone: '', altContact: '', luggage: 'STANDARD' }];
      recalculateTotal(newManifest, selectedRoute?.price);
      return newManifest;
    });
  };

  const handleUpdatePassenger = (seatId, field, value) => {
    setManifest(prev => {
      const newManifest = prev.map(p => p.seatId === seatId ? { ...p, [field]: value } : p);
      recalculateTotal(newManifest, selectedRoute?.price);
      return newManifest;
    });
  };

  const recalculateTotal = (currentManifest, basePrice = 0) => {
    let total = 0;
    currentManifest.forEach(p => {
      total += basePrice;
      if (p.luggage === 'HEAVY') total += 5000;
    });
    setTotalPrice(total);
  };

  // =========================================================================
  // FUNNEL NAVIGATION
  // =========================================================================
  const jumpToStep = (targetStep) => {
    if (targetStep === 1) {
      // Step 1 lives outside the overlay — going back to it means closing.
      closeOverlay();
      return;
    }
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
    }
  };

  const proceedToDetail = (route) => {
    setSelectedRoute(route);
    setBookedSeats(['4', '5', '12']);
    setManifest([]);
    setTotalPrice(0);
    setCurrentStep(2);
    setIsOverlayOpen(true);
  };

  const proceedToSeats    = () => { setCurrentStep(3); };
  const proceedToCheckout = () => { setCurrentStep(4); };

  // The X button: only nag with a confirmation if there's real progress to
  // lose (a route was picked, or seats/details were entered). A bare click
  // into Step 2 with nothing chosen yet can close immediately.
  const requestCloseOverlay = () => {
    const hasProgress = currentStep >= 2 && (manifest.length > 0 || currentStep >= 3);
    if (hasProgress) {
      setShowCloseConfirm(true);
    } else {
      closeOverlay();
    }
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setShowCloseConfirm(false);
    setCurrentStep(1);
    setSelectedRoute(null);
    setBookedSeats([]);
    setManifest([]);
    setTotalPrice(0);
  };

  const cancelCloseOverlay = () => setShowCloseConfirm(false);

  const handleModifySearch = (newParams) => {
    if (newParams) {
      setSearchParams(normaliseParams(newParams));
      setCurrentStep(1);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(1);
  };

  const handleCompleteBooking = async (ticketData) => {
    console.log('Booking Complete! Payload:', ticketData);
    const result = await bookingQueries.saveBooking(selectedRoute, manifest, ticketData, totalPrice);
    if (!result.success) {
      console.error('[BookingModule] Failed to persist booking:', result.error);
    }
  };

  // =========================================================================
  // PROGRESS STEPPER
  // =========================================================================
  const renderStepper = () => {
    const steps = [
      { id: 1, label: 'Search',   icon: Search   },
      { id: 2, label: 'Details',  icon: Map      },
      { id: 3, label: 'Seats',    icon: Armchair },
      { id: 4, label: 'Checkout', icon: CreditCard }
    ];

    return (
      <div className="bk-stepper-vault hide-on-mobile">
        <div className="bk-stepper-track">
          {steps.map((s, index) => {
            const Icon        = s.icon;
            const isActive    = currentStep === s.id;
            const isCompleted = currentStep > s.id;

            return (
              <React.Fragment key={s.id}>
                <div
                  className={`bk-step-node ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => jumpToStep(s.id)}
                >
                  <div className="step-icon-circle">
                    {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <span className="step-label">{s.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`bk-step-bridge ${isCompleted ? 'is-completed' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="bk-chassis">
      {/* Step 1 stays inline on the homepage — this never enters the overlay. */}
      <div className="bk-view-vault">
        <Step1_SearchFeed
          routes={availableRoutes}
          isLoading={isLoadingRoutes}
          searchParams={searchParams}
          onSelectRoute={proceedToDetail}
          onModifySearch={handleModifySearch}
        />
      </div>

      {/* Steps 2-4 render inside a full-screen overlay, separate from the
          crowded homepage, per product decision. */}
      {isOverlayOpen && (
        <div className="bk-overlay" role="dialog" aria-modal="true" aria-label="Complete your booking">
          <div className="bk-overlay-chrome">
            {currentStep < 5 && renderStepper()}
            <button
              type="button"
              className="bk-overlay-close"
              onClick={requestCloseOverlay}
              aria-label="Close booking"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="bk-overlay-body" key={currentStep}>
            {currentStep === 2 && (
              <Step2_RouteDetail
                route={selectedRoute}
                onBack={() => jumpToStep(1)}
                onProceed={proceedToSeats}
              />
            )}

            {currentStep === 3 && (
              <Step3_SeatVault
                route={selectedRoute}
                bookedSeats={bookedSeats}
                manifest={manifest}
                onToggleSeat={handleToggleSeat}
                onUpdatePassenger={handleUpdatePassenger}
                totalPrice={totalPrice}
                onBack={() => jumpToStep(2)}
                onProceed={proceedToCheckout}
              />
            )}

            {currentStep === 4 && (
              <Step4_Checkout
                route={selectedRoute}
                manifest={manifest}
                totalPrice={totalPrice}
                onBack={() => jumpToStep(3)}
                onCompleteBooking={handleCompleteBooking}
              />
            )}
          </div>

          {/* Close confirmation — only shown if there's real progress to lose. */}
          {showCloseConfirm && (
            <div className="bk-confirm-overlay" onClick={cancelCloseOverlay}>
              <div className="bk-confirm-card" onClick={(e) => e.stopPropagation()}>
                <h3>Quit this booking?</h3>
                <p>You'll lose your seat selection and any details you've entered so far.</p>
                <div className="bk-confirm-actions">
                  <button className="ayabus-btn-ghost" onClick={cancelCloseOverlay}>
                    Keep Booking
                  </button>
                  <button className="ayabus-btn bk-confirm-quit" onClick={closeOverlay}>
                    Quit Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .bk-chassis {
          width: 100%;
          min-height: calc(100vh - var(--header-height, 70px));
          background: var(--bg-canvas);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .bk-stepper-vault {
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          padding: 16px 24px;
          display: flex;
          justify-content: center;
          position: sticky;
          top: var(--header-height, 70px);
          z-index: 50;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .bk-stepper-track {
          display: flex;
          align-items: center;
          max-width: 800px;
          width: 100%;
          justify-content: space-between;
        }
        .bk-step-node {
          display: flex; align-items: center; gap: 12px;
          color: var(--text-muted); transition: all 0.3s; cursor: default;
        }
        .bk-step-node.is-completed { cursor: pointer; color: var(--text-main); }
        .bk-step-node.is-completed:hover { opacity: 0.8; }
        .bk-step-node.is-active { color: var(--brand-primary); }
        .step-icon-circle {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--bg-body); border: 2px solid var(--border-subtle);
          display: flex; align-items: center; justify-content: center; transition: all 0.3s;
        }
        .bk-step-node.is-completed .step-icon-circle {
          background: var(--text-main); border-color: var(--text-main); color: var(--bg-surface);
        }
        .bk-step-node.is-active .step-icon-circle {
          background: color-mix(in srgb, var(--brand-primary) 15%, transparent);
          border-color: var(--brand-primary); color: var(--brand-primary);
        }
        .step-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .bk-step-bridge {
          flex: 1; height: 2px; background: var(--border-subtle); margin: 0 16px; transition: all 0.3s;
        }
        .bk-step-bridge.is-completed { background: var(--text-main); }
        .bk-view-vault {
          flex: 1; width: 100%; display: flex; flex-direction: column;
          animation: viewFade 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes viewFade {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
        }

        /* ============================================================
           FULL-SCREEN BOOKING OVERLAY (Steps 2-4)
           ============================================================ */
        .bk-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: var(--bg-canvas);
          display: flex;
          flex-direction: column;
          animation: overlayFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .bk-overlay-chrome {
          position: relative;
          flex-shrink: 0;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
        }
        .bk-overlay-chrome .bk-stepper-vault {
          position: static; /* no longer sticking to a page header behind it */
          top: auto;
        }

        .bk-overlay-close {
          position: absolute;
          top: 16px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: var(--bg-body);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .bk-overlay-close:hover {
          background: var(--status-error, #EF4444);
          border-color: var(--status-error, #EF4444);
          color: #fff;
          transform: rotate(90deg);
        }

        .bk-overlay-body {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
          display: flex;
          flex-direction: column;
          animation: viewFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* ============================================================
           CLOSE CONFIRMATION DIALOG
           ============================================================ */
        .bk-confirm-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: overlayFadeIn 0.18s ease both;
        }
        .bk-confirm-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg, 16px);
          padding: 28px;
          max-width: 360px;
          width: 100%;
          box-shadow: 0 24px 60px rgba(0,0,0,0.25);
          text-align: center;
        }
        .bk-confirm-card h3 {
          margin: 0 0 12px 0;
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
        }
        .bk-confirm-card p {
          margin: 0 0 24px 0;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-muted);
        }
        .bk-confirm-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bk-confirm-quit {
          background: var(--status-error, #EF4444);
          border-color: var(--status-error, #EF4444);
        }

        @media (max-width: 600px) {
          .bk-overlay-close {
            top: 12px;
            right: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Booking;
