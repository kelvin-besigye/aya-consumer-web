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
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const proceedToDetail = (route) => {
    setSelectedRoute(route);
    setBookedSeats(['4', '5', '12']);
    setManifest([]);
    setTotalPrice(0);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const proceedToSeats    = () => { setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const proceedToCheckout = () => { setCurrentStep(4); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleModifySearch = (newParams) => {
    if (newParams) {
      setSearchParams(normaliseParams(newParams));
      setCurrentStep(1);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(1);
  };

  const handleCompleteBooking = (ticketData) => {
    console.log('Booking Complete! Payload:', ticketData);
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
      {currentStep < 5 && renderStepper()}

      <div className="bk-view-vault" key={currentStep}>
        {currentStep === 1 && (
          <Step1_SearchFeed
            routes={availableRoutes}
            isLoading={isLoadingRoutes}
            searchParams={searchParams}
            onSelectRoute={proceedToDetail}
            onModifySearch={handleModifySearch}
          />
        )}

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
      `}</style>
    </div>
  );
};

export default Booking;
