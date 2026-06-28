import React, { useMemo } from 'react';
import { CircleDot, X, Accessibility } from 'lucide-react';

/**
 * CHASSIS GRID (Consumer Web — Booking Funnel)
 * ------------------------------------------------------------------
 * Ported to the PROVEN v2 buildChassisRows algorithm — identical to
 * Admin's ChassisCanvas.jsx and Partner's SeatMatrix.jsx.
 *
 * Same source of truth. The seat labels rendered here are the exact
 * same labels that:
 *   - Admin designed in the wizard
 *   - Partner dispatch sees in their seat matrix
 *   - Consumer selects and books
 *
 * v2 fields read: driver_position, entrance_side, entrance_row,
 *                 bench_position, conductor_count, has_invalid_seat
 */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * THE PROVEN ALGORITHM (v2) — IDENTICAL to Admin/Partner.
 * Keep these three implementations in lockstep when tweaking the grammar.
 */
export function buildChassisRows(layout) {
  const {
    total_rows        = 11,
    cols_left         = 2,
    cols_right        = 3,
    has_rear_bench    = true,
    bench_position    = 'MIDDLE',
    driver_position   = 'RIGHT',
    entrance_side     = 'NONE',
    entrance_row      = 1,
    front_rows        = [],
    conductor_count   = 0,
    conductor_side    = 'LEFT',
    has_invalid_seat  = false,
    invalid_seat_side = 'LEFT',
  } = layout || {};

  const rows = [];
  let rowNumber = 1;
  let conductorCounter = 0;

  const isEntranceRow = (r) => entrance_side !== 'NONE' && r === entrance_row;
  const isDriverRow   = (r) => r === 1;

  for (const row of front_rows) {
    const leftArr  = Array.isArray(row.left)  ? row.left  : [];
    const rightArr = Array.isArray(row.right) ? row.right : [];

    const labelSlot = (slot) => {
      if (slot.type === 'SEAT') {
        const arr = slot === leftArr.find(s => s === slot) ? leftArr : rightArr;
        const letterIdx = arr.slice(0, arr.indexOf(slot)).filter(s => s.type === 'SEAT').length;
        return { type: 'SEAT', label: `${rowNumber}${ALPHABET[letterIdx] || '?'}`, bookable: true };
      }
      if (slot.type === 'CONDUCTOR') {
        conductorCounter++;
        return { type: 'CONDUCTOR', label: `SS${conductorCounter}`, bookable: false };
      }
      if (slot.type === 'DRIVER')  return { type: 'DRIVER',  label: null, bookable: false };
      if (slot.type === 'ENTRY')   return { type: 'ENTRY',   label: 'E',  bookable: false };
      if (slot.type === 'INVALID') return { type: 'INVALID', label: '1X', bookable: false };
      return { type: 'UNKNOWN', label: '?', bookable: false };
    };

    rows.push({
      left:    leftArr.map(labelSlot),
      middle:  [{ type: 'AISLE', label: null, bookable: false }],
      right:   rightArr.map(labelSlot),
      isFrontRow: true, isBench: false, isDriverRow: true, isEntranceRow: false,
    });
    rowNumber++;
  }

  const startRow = front_rows.length > 0 ? front_rows.length + 1 : 1;
  const totalToRender = Math.max(startRow - 1, total_rows);

  for (let r = startRow; r <= totalToRender; r++) {
    const isLast = r === totalToRender;
    const isBench = isLast && has_rear_bench;
    const isDriverR   = isDriverRow(r);
    const isEntranceR = isEntranceRow(r);
    const isCollision = isDriverR && isEntranceR;

    const left = [];
    const right = [];
    const middle = [];

    // LEFT
    if (isCollision && entrance_side === 'LEFT') left.push({ type: 'DRIVER', label: null, bookable: false });
    else if (isCollision && entrance_side !== 'LEFT') left.push({ type: 'ENTRY', label: 'E', bookable: false });
    else if (isDriverR && driver_position === 'LEFT') left.push({ type: 'DRIVER', label: null, bookable: false });
    else if (isEntranceR && entrance_side === 'LEFT') left.push({ type: 'ENTRY', label: 'E', bookable: false });
    else if (r === 1 && front_rows.length === 0) {
      if (conductor_side === 'LEFT' && conductor_count > 0) {
        for (let i = 0; i < Math.min(conductor_count, cols_left); i++) {
          left.push({ type: 'CONDUCTOR', label: `SS${++conductorCounter}`, bookable: false });
        }
      }
      if (has_invalid_seat && invalid_seat_side === 'LEFT' && left.length < cols_left) {
        left.push({ type: 'INVALID', label: '1X', bookable: false });
      }
      let letterIdx = left.filter(s => s.type === 'SEAT').length;
      while (left.length < cols_left) {
        left.push({ type: 'SEAT', label: `${rowNumber}${ALPHABET[letterIdx] || '?'}`, bookable: true });
        letterIdx++;
      }
    } else {
      for (let c = 0; c < cols_left; c++) {
        left.push({ type: 'SEAT', label: `${rowNumber}${ALPHABET[c] || '?'}`, bookable: true });
      }
    }

    // RIGHT
    if (isCollision && entrance_side === 'RIGHT') right.push({ type: 'DRIVER', label: null, bookable: false });
    else if (isCollision && entrance_side !== 'RIGHT') right.push({ type: 'ENTRY', label: 'E', bookable: false });
    else if (isDriverR && driver_position === 'RIGHT') right.push({ type: 'DRIVER', label: null, bookable: false });
    else if (isEntranceR && entrance_side === 'RIGHT') right.push({ type: 'ENTRY', label: 'E', bookable: false });
    else if (r === 1 && front_rows.length === 0) {
      if (conductor_side === 'RIGHT' && conductor_count > 0) {
        for (let i = 0; i < Math.min(conductor_count, cols_right); i++) {
          right.push({ type: 'CONDUCTOR', label: `SS${++conductorCounter}`, bookable: false });
        }
      }
      if (has_invalid_seat && invalid_seat_side === 'RIGHT' && right.length < cols_right) {
        right.push({ type: 'INVALID', label: '1X', bookable: false });
      }
      let letterIdx = right.filter(s => s.type === 'SEAT').length;
      while (right.length < cols_right) {
        right.push({ type: 'SEAT', label: `${rowNumber}${ALPHABET[letterIdx] || '?'}`, bookable: true });
        letterIdx++;
      }
    } else {
      for (let c = 0; c < cols_right; c++) {
        right.push({ type: 'SEAT', label: `${rowNumber}${ALPHABET[c] || '?'}`, bookable: true });
      }
    }

    // MIDDLE
    if (isBench && bench_position === 'MIDDLE') {
      middle.push({ type: 'REAR_MIDDLE', label: 'M', bookable: true });
    } else if (isBench && bench_position === 'RIGHT') {
      right.length = 0;
      right.push({ type: 'REAR_MIDDLE', label: 'M', bookable: true });
      middle.push({ type: 'AISLE', label: null, bookable: false });
    } else {
      middle.push({ type: 'AISLE', label: null, bookable: false });
    }

    rows.push({
      left, middle, right,
      isFrontRow: r === 1 && front_rows.length === 0,
      isBench, isDriverRow: isDriverR, isEntranceRow: isEntranceR,
      rowNumber,
    });
    rowNumber++;
  }

  return rows;
}

// ── SEAT NODE ──
const SeatNode = ({ slot, isBooked, isSelected, onToggle }) => {
  if (!slot.bookable) {
    if (slot.type === 'AISLE') return <div className="cg-seat-node is-aisle" />;
    if (slot.type === 'DRIVER') {
      return (
        <div className="cg-seat-node is-nonbookable" title="Driver">
          <CircleDot size={18} />
        </div>
      );
    }
    if (slot.type === 'CONDUCTOR') {
      return (
        <div className="cg-seat-node is-nonbookable" title={`Conductor ${slot.label}`}>
          <span style={{ fontSize: '10px', fontWeight: 800 }}>{slot.label}</span>
        </div>
      );
    }
    if (slot.type === 'ENTRY') {
      return (
        <div className="cg-seat-node is-entry" title="Entry/Door">
          <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.5px', color: 'var(--status-success, #22C55E)' }}>E</span>
        </div>
      );
    }
    if (slot.type === 'INVALID') {
      return (
        <div className="cg-seat-node is-nonbookable" title="Invalid / Wheelchair">
          <Accessibility size={14} />
        </div>
      );
    }
    return <div className="cg-seat-node is-empty" />;
  }

  const label = slot.label;
  const isM = label === 'M' || slot.type === 'REAR_MIDDLE';

  let stateClass = 'is-available';
  if (isBooked)      stateClass = 'is-booked';
  else if (isSelected) stateClass = 'is-selected';

  return (
    <button
      type="button"
      className={`cg-seat-node ${stateClass} ${isM ? 'is-rear-bench' : ''}`}
      onClick={() => { if (!isBooked) onToggle(label); }}
      disabled={isBooked}
      aria-pressed={isSelected}
      aria-label={`Seat ${label} ${isBooked ? 'Unavailable' : 'Available'}`}
    >
      {isBooked ? <X size={16} strokeWidth={3} /> : label}
    </button>
  );
};

// ── MAIN ──
export const ChassisGrid = ({
  capacity = 45,
  layoutConfig = {},
  bookedSeats = [],
  selectedSeats = [],
  onToggleSeat,
}) => {
  const chassisRows = useMemo(
    () => buildChassisRows(layoutConfig),
    [layoutConfig]
  );

  const colsLeft  = layoutConfig.cols_left  ?? 2;
  const colsRight = layoutConfig.cols_right ?? 2;

  const gridTemplate =
    `${'1fr '.repeat(colsLeft)}clamp(20px,8%,40px) ${'1fr '.repeat(colsRight)}`.trim();

  const bookedSet   = new Set(bookedSeats);
  const selectedSet = new Set(selectedSeats);

  return (
    <div className="chassis-grid-container">

      {/* LEGEND */}
      <div className="cg-legend">
        <div className="cg-legend-item">
          <div className="cg-legend-box is-available" />
          <span>Available</span>
        </div>
        <div className="cg-legend-item">
          <div className="cg-legend-box is-selected" />
          <span>Your Selection</span>
        </div>
        <div className="cg-legend-item">
          <div className="cg-legend-box is-booked"><X size={10} strokeWidth={4} /></div>
          <span>Booked</span>
        </div>
      </div>

      {/* VIEWPORT */}
      <div className="cg-viewport ayabus-hide-scrollbar">
        <div className="cg-bus-body">
          <div className="cg-cabin-seating">
            {chassisRows.map((row, rowIdx) => {
              const allSlots = [...row.left, ...row.middle, ...row.right];
              return (
                <div
                  key={`row-${rowIdx}`}
                  className="cg-seating-row"
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  {allSlots.map((slot, si) => (
                    <SeatNode
                      key={si}
                      slot={slot}
                      isBooked={slot.bookable && bookedSet.has(slot.label)}
                      isSelected={slot.bookable && selectedSet.has(slot.label)}
                      onToggle={onToggleSeat}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="cg-cabin-rear" />
        </div>
      </div>

      <style>{`
        .chassis-grid-container { display: flex; flex-direction: column; gap: 20px; width: 100%; }

        .cg-legend { display: flex; flex-wrap: wrap; gap: 16px; padding: 12px 16px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md, 8px); }
        .cg-legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-main); }
        .cg-legend-box { width: 20px; height: 20px; border-radius: 4px; border: 2px solid; display: flex; align-items: center; justify-content: center; }

        .cg-viewport { width: 100%; max-height: 600px; overflow: auto; background: var(--bg-canvas); border-radius: var(--radius-xl, 16px); border: 1px solid var(--border-subtle); padding: 40px 16px; display: flex; justify-content: center; box-shadow: inset 0 0 40px rgba(0,0,0,0.02); }

        .cg-bus-body { background: var(--bg-surface); border: 3px solid var(--border-subtle); border-radius: 60px 60px 20px 20px; padding: 24px; width: fit-content; max-width: min(100%, 420px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 32px; }

        .cg-cabin-seating { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .cg-seating-row { display: grid; gap: 8px; align-items: center; width: 100%; container-type: inline-size; }

        .cg-seat-node { width: 100%; aspect-ratio: 1 / 1; max-height: 48px; border-radius: 8px; border: 2px solid; display: flex; align-items: center; justify-content: center; font-size: clamp(11px, 3.2cqw, 16px); font-weight: 800; transition: all 0.2s ease; position: relative; box-shadow: 0 4px 0 0 transparent; }
        .cg-seat-node.is-aisle { border: none; background: transparent; }
        .cg-seat-node.is-empty { border: none; background: transparent; pointer-events: none; }
        .cg-seat-node.is-nonbookable { background: var(--bg-input); border-color: var(--text-main); color: var(--text-main); cursor: default; opacity: 0.7; }
        .cg-seat-node.is-entry { background: rgba(34,197,94,0.07); border-color: var(--status-success, #22C55E); border-left-width: 4px; cursor: default; }

        .cg-seat-node.is-available, .cg-legend-box.is-available { background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main); cursor: pointer; }
        .cg-seat-node.is-available:hover { border-color: var(--brand-primary); color: var(--brand-primary); transform: translateY(-2px); box-shadow: 0 4px 0 0 color-mix(in srgb, var(--brand-primary) 20%, transparent); }
        .cg-seat-node.is-available:active { transform: translateY(2px); box-shadow: 0 0 0 0 transparent; }
        .cg-seat-node.is-selected, .cg-legend-box.is-selected { background: var(--brand-primary); border-color: var(--brand-primary); color: var(--text-inverse, #fff); cursor: pointer; transform: translateY(2px); }
        .cg-seat-node.is-booked, .cg-legend-box.is-booked { background: var(--bg-surface); border-color: var(--border-subtle); color: var(--status-error); opacity: 0.6; cursor: not-allowed; }
        .cg-seat-node.is-rear-bench.is-available { background: color-mix(in srgb, var(--status-warning, #F59E0B) 18%, var(--bg-input)); border-color: var(--status-warning, #F59E0B); color: var(--text-main); }
        .cg-seat-node.is-rear-bench.is-available:hover { border-color: var(--status-warning, #F59E0B); color: var(--status-warning, #F59E0B); }

        .cg-cabin-rear { height: 24px; border-top: 2px solid var(--border-subtle); margin-top: 8px; }
      `}</style>
    </div>
  );
};

export default ChassisGrid;