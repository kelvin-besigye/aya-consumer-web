/**
 * AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel — Step 3
 * File: Step3_SeatVault.jsx
 *
 * v2 Chassis Grammar updates:
 *  1. layout_config pass-through to ChassisGrid is verified and explicit.
 *  2. Orientation context bar — shows driver side + entrance row from
 *     route.layout_config so passengers know which side to board from.
 *  3. Mobile dock correctly anchors above safe-area-inset-bottom and
 *     never clips the proceed button on tall buses (entrance at row 7+).
 *  4. Validation gate unchanged — requires seat + primary phone.
 */

import React, { useMemo } from 'react';
import { ArrowLeft, Armchair, ChevronRight, ShieldAlert, Info, DoorOpen, Navigation } from 'lucide-react';

import { ChassisGrid } from '../components/ChassisGrid';
import { PassengerInputs } from '../components/PassengerInputs';

// ── Tiny orientation pill (consumer-facing, friendly wording) ─────────────────
const OrientPill = ({ icon: Icon, children, color = '#1E40AF' }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 11, fontWeight: 700,
    color: color,
    background: `${color}12`,
    border: `1px solid ${color}28`,
    padding: '4px 12px', borderRadius: 20,
    whiteSpace: 'nowrap',
  }}>
    {Icon && <Icon size={12} />}
    {children}
  </span>
);

export const Step3_SeatVault = ({
  route,
  bookedSeats    = [],
  manifest       = [],
  onToggleSeat,
  onUpdatePassenger,
  totalPrice     = 0,
  onBack,
  onProceed,
  currency       = 'UGX',
}) => {

  // ── Failsafe ──────────────────────────────────────────────────────────────
  if (!route) {
    return (
      <div className="sv-error-state">
        <ShieldAlert size={32} />
        <p>Route context lost. Please return to search.</p>
        <button onClick={onBack} className="ayabus-btn">Go Back</button>
      </div>
    );
  }

  // ── Layout config — this is the v2 source of truth ───────────────────────
  // Falls back to empty object; ChassisGrid's buildChassisRows handles defaults.
  const layoutConfig = route.layout_config || {};

  // ── Orientation context (friendly for passengers) ─────────────────────────
  const driverSide    = layoutConfig.driver_position || 'RIGHT';
  const entranceSide  = layoutConfig.entrance_side   || 'NONE';
  const entranceRow   = layoutConfig.entrance_row    ?? null;
  const hasEntrance   = entranceSide !== 'NONE';

  // Human-friendly boarding side label
  const boardingSide = hasEntrance
    ? `${entranceSide === 'LEFT' ? 'Left' : 'Right'} side, Row ${entranceRow}`
    : null;

  // ── Validation engine ─────────────────────────────────────────────────────
  const validationMatrix = useMemo(() => {
    if (manifest.length === 0) {
      return { isValid: false, reason: 'Please select at least one seat.' };
    }
    const phone = manifest[0]?.activePhone || '';
    if (phone.replace(/\D/g, '').length < 9) {
      return { isValid: false, reason: 'Primary contact requires a valid phone number.' };
    }
    return { isValid: true, reason: 'Ready for checkout' };
  }, [manifest]);

  // ── Currency formatter ────────────────────────────────────────────────────
  const fmt = (amount) =>
    new Intl.NumberFormat('en-UG', {
      style: 'currency', currency, maximumFractionDigits: 0,
    }).format(amount);

  const selectedSeatIds = manifest.map(p => p.seatId);

  // ── Luggage surcharge calculation ─────────────────────────────────────────
  const heavyCount    = manifest.filter(p => p.luggage === 'HEAVY').length;
  const luggageSurcharge = heavyCount * 5000; // UGX 5k per heavy bag

  return (
    <div className="sv-chassis">

      {/* ── TOP HEADER ── */}
      <header className="sv-header-vault">
        <div className="sv-header-left">
          <button className="ayabus-btn-ghost sv-back-btn" onClick={onBack}>
            <ArrowLeft size={20} /> Back to Route
          </button>
          <div className="sv-route-context">
            <span className="route-tag">From: {route.origin}</span>
            <span className="route-class">{route.class_name} Class</span>
          </div>
        </div>

        {/* Desktop seat counter */}
        <div className="sv-header-right hide-on-mobile">
          <div className="sv-seat-counter">
            <Armchair size={16} />
            <span><strong>{manifest.length}</strong> Seat(s) Selected</span>
          </div>
        </div>
      </header>

      {/* ── ORIENTATION CONTEXT BAR (v2 addition) ── */}
      {(hasEntrance || true) && (
        <div className="sv-orientation-bar">
          <Info size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
            Bus orientation:
          </span>
          <OrientPill icon={Navigation} color="#1E40AF">
            Driver on {driverSide === 'RIGHT' ? 'right' : 'left'}
          </OrientPill>
          {boardingSide && (
            <OrientPill icon={DoorOpen} color="#16A34A">
              Board from {boardingSide}
            </OrientPill>
          )}
        </div>
      )}

      {/* ── MAIN WORKSPACE ── */}
      <main className="sv-main-grid">

        {/* LEFT — Chassis */}
        <div className="sv-spatial-column">
          <div className="sv-column-header">
            <h3>1. Select Your Seats</h3>
            <p>Tap an available seat to add it to your booking.</p>
          </div>

          <div className="sv-chassis-wrapper">
            {/*
              CRITICAL v2 PASS-THROUGH:
              layoutConfig is route.layout_config (full v2 object).
              buildChassisRows inside ChassisGrid reads:
                driver_position, entrance_side, entrance_row,
                bench_position, conductor_count, has_invalid_seat
              — all from this single prop. No translation needed.
            */}
            <ChassisGrid
              capacity={route.capacity || 45}
              layoutConfig={layoutConfig}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeatIds}
              onToggleSeat={onToggleSeat}
            />
          </div>
        </div>

        {/* RIGHT — Passenger details + checkout */}
        <div className="sv-data-column">
          <div className="sv-column-header">
            <h3>2. Passenger Details</h3>
            <p>Tickets will be issued for these specific seats.</p>
          </div>

          <div className="sv-manifest-wrapper">
            <PassengerInputs
              manifest={manifest}
              onUpdatePassenger={onUpdatePassenger}
            />
          </div>

          {/* Desktop checkout card */}
          <div className="sv-checkout-card hide-on-mobile">
            <div className="checkout-breakdown">
              <div className="breakdown-row">
                <span>Ticket(s) Subtotal</span>
                <span>{fmt(route.price * manifest.length)}</span>
              </div>
              {heavyCount > 0 && (
                <div className="breakdown-row text-warning">
                  <span>Heavy Luggage ({heavyCount}×)</span>
                  <span>+ {fmt(luggageSurcharge)}</span>
                </div>
              )}
            </div>
            <div className="breakdown-total">
              <span>Total</span>
              <strong>{fmt(totalPrice)}</strong>
            </div>

            {!validationMatrix.isValid && (
              <div className="validation-warning">
                <Info size={14} />
                {validationMatrix.reason}
              </div>
            )}

            <button
              className="sv-proceed-btn"
              onClick={onProceed}
              disabled={!validationMatrix.isValid}
            >
              <span>Proceed to Payment</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* ── MOBILE DOCK ── */}
      <div className="sv-mobile-dock hide-on-desktop">
        {!validationMatrix.isValid && (
          <div className="mobile-validation-bar">
            <Info size={12} />
            {validationMatrix.reason}
          </div>
        )}
        <div className="dock-core">
          <div className="dock-price-col">
            <span className="dock-label">{manifest.length} seat(s)</span>
            <span className="dock-price">{fmt(totalPrice)}</span>
          </div>
          <button
            className="sv-proceed-btn"
            onClick={onProceed}
            disabled={!validationMatrix.isValid}
          >
            <span>Pay Now</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── STYLES ── */}
      <style>{`
        /* ── LAYOUT ── */
        .sv-chassis {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          /* 
            Bottom padding accounts for:
              - mobile dock height (~90px)
              - safe-area-inset-bottom (notch phones)
              - extra buffer so last passenger row isn't clipped
          */
          padding-bottom: calc(140px + env(safe-area-inset-bottom));
          background: var(--bg-canvas);
          min-height: calc(100vh - var(--header-height, 64px));
        }

        .sv-error-state {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          height: 50vh; gap: 16px; color: var(--status-error);
        }

        /* ── HEADER ── */
        .sv-header-vault {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 24px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky; top: 0; z-index: 30;
        }
        .sv-header-left { display: flex; align-items: center; gap: 24px; }
        .sv-back-btn { gap: 8px; font-size: 14px; height: 40px; padding: 0 16px; display: flex; align-items: center; }

        .sv-route-context {
          display: flex; align-items: center; gap: 12px;
          border-left: 2px solid var(--border-subtle);
          padding-left: 24px;
        }
        .route-tag { font-size: 14px; font-weight: 700; color: var(--text-main); }
        .route-class {
          font-size: 11px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 1px; color: var(--brand-primary);
          background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
          padding: 4px 10px; border-radius: var(--radius-full, 9999px);
        }

        .sv-seat-counter {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; color: var(--text-main);
          background: var(--bg-body); padding: 8px 16px;
          border-radius: var(--radius-full, 9999px);
          border: 1px solid var(--border-subtle);
        }

        /* ── ORIENTATION BAR (v2) ── */
        .sv-orientation-bar {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          padding: 10px 24px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
        }

        /* ── MAIN GRID ── */
        .sv-main-grid {
          display: grid;
          grid-template-columns: 5fr 6fr;
          gap: 32px;
          padding: 32px 24px;
          align-items: start;
        }

        .sv-spatial-column, .sv-data-column {
          display: flex; flex-direction: column; gap: 20px;
        }

        .sv-column-header h3 { margin: 0 0 4px; font-size: 20px; font-weight: 800; color: var(--text-main); }
        .sv-column-header p  { margin: 0; font-size: 14px; color: var(--text-muted); }

        /*
          Sticky chassis — stays in view as the passenger manifest scrolls.
          max-height guards against very tall buses (many rows) overflowing
          the viewport; the ChassisGrid itself has internal overflow:auto.
        */
        .sv-chassis-wrapper {
          position: sticky;
          top: calc(var(--header-height, 64px) + 52px); /* header + orientation bar */
          max-height: calc(100vh - var(--header-height, 64px) - 52px - 40px);
          overflow-y: auto;
        }

        /* ── CHECKOUT CARD ── */
        .sv-checkout-card {
          background: var(--bg-surface);
          border: 2px solid var(--brand-primary);
          border-radius: var(--radius-lg, 12px);
          padding: 24px;
          margin-top: 16px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.05);
        }

        .checkout-breakdown { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .breakdown-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); font-weight: 500; }
        .breakdown-row.text-warning { color: #F59E0B; }
        .breakdown-total {
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px dashed var(--border-subtle); padding-top: 16px;
          margin-top: 8px; font-size: 16px; color: var(--text-main);
        }
        .breakdown-total strong { font-size: 28px; font-weight: 900; color: var(--brand-primary); letter-spacing: -0.5px; }

        .validation-warning {
          display: flex; align-items: center; gap: 8px;
          background: color-mix(in srgb, #EF4444 10%, transparent);
          color: #EF4444; padding: 12px 16px; border-radius: var(--radius-md, 8px);
          font-size: 13px; font-weight: 600; margin-bottom: 16px;
        }

        /* ── PROCEED BUTTON ── */
        .sv-proceed-btn {
          width: 100%; height: 56px; font-size: 16px; font-weight: 800;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          background: var(--brand-primary); color: #fff;
          border: none; border-radius: var(--radius-md, 8px);
          cursor: pointer; transition: all 0.2s;
        }
        .sv-proceed-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 30%, transparent);
        }
        .sv-proceed-btn:active:not(:disabled) { transform: translateY(0); }
        .sv-proceed-btn:disabled {
          background: var(--border-subtle); color: var(--text-muted); cursor: not-allowed;
          transform: none; box-shadow: none;
        }

        /* ── MOBILE DOCK ── */
        .sv-mobile-dock {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          z-index: 100;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.06);
          display: flex; flex-direction: column;
        }

        .mobile-validation-bar {
          background: #EF4444; color: #fff;
          font-size: 11px; font-weight: 700; text-align: center;
          padding: 7px; letter-spacing: 0.5px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }

        .dock-core {
          padding: 14px 20px calc(14px + env(safe-area-inset-bottom));
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }

        .dock-price-col { display: flex; flex-direction: column; }
        .dock-label { font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .dock-price { font-size: 22px; font-weight: 900; color: var(--brand-primary); letter-spacing: -0.5px; }

        .sv-mobile-dock .sv-proceed-btn {
          width: auto; flex: 1; height: 50px;
          max-width: 210px; font-size: 14px;
        }

        /* ── RESPONSIVE ── */
        @media (min-width: 1025px) {
          .hide-on-desktop { display: none !important; }
        }

        @media (max-width: 1024px) {
          .sv-main-grid {
            grid-template-columns: 1fr;
            padding: 24px 16px;
          }
          .hide-on-mobile { display: none !important; }
          .sv-chassis-wrapper {
            position: relative;
            top: 0;
            max-height: none;
            overflow-y: visible;
          }
        }

        @media (max-width: 640px) {
          .sv-header-vault {
            flex-direction: column; align-items: flex-start;
            gap: 12px; padding: 16px;
          }
          .sv-route-context {
            border-left: none; padding-left: 0;
            padding-top: 10px; border-top: 1px dashed var(--border-subtle);
            width: 100%; justify-content: space-between;
          }
          .sv-orientation-bar { padding: 8px 16px; gap: 8px; }
          .sv-main-grid { gap: 36px; }
          .dock-core { padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); }
        }
      `}</style>
    </div>
  );
};
