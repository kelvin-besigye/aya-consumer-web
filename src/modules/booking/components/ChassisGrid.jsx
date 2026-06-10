/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 3 - UI Components)
 * File: ChassisGrid.jsx
 * * DESCRIPTION:
 * The interactive digital twin of the bus. Converts raw database capacity 
 * and layout strings ('2x2', '2x1') into a clickable, physical representation.
 * * WORLD-CLASS ENGINEERING:
 * 1. MEMOIZED PHYSICS: The grid math only calculates once per bus load, 
 * preventing UI stutter when a user rapidly clicks multiple seats.
 * 2. PAN & ZOOM VAULT: Wrapped in an `overflow: auto` chassis viewport. 
 * On a tiny Android screen, the user can scroll around the bus without 
 * accidentally swiping back a page.
 * 3. RHD STANDARD: Driver is anchored to the right (Uganda standard), 
 * establishing immediate spatial orientation for the passenger.
 */

import React, { useMemo } from 'react';
import { CircleDot, X } from 'lucide-react';

// ========================================================================
// 1. ENGINE: THE CHASSIS MATHEMATICS
// Translates capacity and layout type into a 2D array grid.
// ========================================================================
const generateBusChassis = (capacity = 60, layoutType = '2x2') => {
    let leftSide = 2;
    let rightSide = 2;

    // Adapt to VIP or Executive layouts based on DB config
    if (layoutType === '2x1') { leftSide = 2; rightSide = 1; }
    if (layoutType === '1x2') { leftSide = 1; rightSide = 2; }
    if (layoutType === '1x1') { leftSide = 1; rightSide = 1; }

    const rows = [];
    let currentSeatNumber = 1;

    while (currentSeatNumber <= capacity) {
        const row = [];
        
        // Left Column(s)
        for (let l = 0; l < leftSide; l++) {
            if (currentSeatNumber <= capacity) {
                row.push(currentSeatNumber.toString());
                currentSeatNumber++;
            } else {
                row.push(null);
            }
        }
        
        // The Walkway Aisle
        row.push('AISLE');
        
        // Right Column(s)
        for (let r = 0; r < rightSide; r++) {
            if (currentSeatNumber <= capacity) {
                row.push(currentSeatNumber.toString());
                currentSeatNumber++;
            } else {
                row.push(null);
            }
        }
        
        rows.push(row);
    }

    return rows;
};

// ========================================================================
// 2. COMPONENT: INDIVIDUAL SEAT NODE
// ========================================================================
const SeatNode = ({ seatId, isBooked, isSelected, onToggle }) => {
    if (!seatId || seatId === 'AISLE') {
        return <div className={`cg-seat-node ${seatId === 'AISLE' ? 'is-aisle' : 'is-empty'}`} />;
    }

    // Determine visual state classes based on props
    let stateClass = 'is-available';
    if (isBooked) stateClass = 'is-booked';
    else if (isSelected) stateClass = 'is-selected';

    return (
        <button
            type="button"
            className={`cg-seat-node ${stateClass}`}
            onClick={() => {
                // Prevent interaction if someone already bought this seat
                if (!isBooked) onToggle(seatId);
            }}
            disabled={isBooked}
            aria-pressed={isSelected}
            aria-label={`Seat ${seatId} ${isBooked ? 'Unavailable' : 'Available'}`}
        >
            {isBooked ? <X size={16} strokeWidth={3} /> : seatId}
        </button>
    );
};

// ========================================================================
// 3. MAIN COMPONENT: CHASSIS GRID
// ========================================================================
export const ChassisGrid = ({ 
    capacity = 60, 
    layoutType = '2x2', 
    bookedSeats = [],   // Array of strings, e.g., ['1', '4', '12']
    selectedSeats = [], // Array of strings from Zustand store
    onToggleSeat        // Function from Zustand store
}) => {
    
    // Memoize the heavy math so it doesn't recalculate on every seat click
    const chassisGrid = useMemo(
        () => generateBusChassis(capacity, layoutType), 
        [capacity, layoutType]
    );

    return (
        <div className="chassis-grid-container">
            
            {/* --- TOP: THE INTELLIGENCE LEGEND --- */}
            <div className="cg-legend">
                <div className="cg-legend-item">
                    <div className="cg-legend-box is-available"></div>
                    <span>Available</span>
                </div>
                <div className="cg-legend-item">
                    <div className="cg-legend-box is-selected"></div>
                    <span>Your Selection</span>
                </div>
                <div className="cg-legend-item">
                    <div className="cg-legend-box is-booked"><X size={10} strokeWidth={4} /></div>
                    <span>Booked</span>
                </div>
            </div>

            {/* --- MIDDLE: THE PHYSICAL VAULT (Scrollable on Mobile) --- */}
            <div className="cg-viewport ayabus-hide-scrollbar">
                <div className="cg-bus-body">
                    
                    {/* The Front Cabin (Uganda RHD Orientation) */}
                    <div className="cg-cabin-front">
                        <div className="cg-windshield" />
                        <div className="cg-door-zone">ENTRY</div>
                        <div className="cg-driver-zone">
                            <CircleDot size={20} className="cg-driver-wheel" />
                            <span>DRIVER</span>
                        </div>
                    </div>

                    {/* The Passenger Cabin */}
                    <div className="cg-cabin-seating">
                        {chassisGrid.map((row, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="cg-seating-row">
                                {row.map((seatId, colIndex) => (
                                    <SeatNode 
                                        key={`seat-${rowIndex}-${colIndex}`}
                                        seatId={seatId}
                                        isBooked={bookedSeats.includes(seatId)}
                                        isSelected={selectedSeats.includes(seatId)}
                                        onToggle={onToggleSeat}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* The Rear Cabin */}
                    <div className="cg-cabin-rear"></div>
                </div>
            </div>

            {/* ========================================================================
                4. STYLESHEET (African Physics & Sovereign Identity)
                Strictly bound to index.css variables.
            ======================================================================== */}
            <style>{`
                .chassis-grid-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                }

                /* --- THE LEGEND --- */
                .cg-legend {
                    display: flex;
                    justify-content: center;
                    gap: 24px;
                    padding: 16px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    flex-wrap: wrap;
                }
                .cg-legend-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-main);
                }
                .cg-legend-box {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                    border: 2px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* --- THE VIEWPORT --- */
                .cg-viewport {
                    width: 100%;
                    max-height: 600px;
                    overflow: auto; /* The Magic: allows panning on mobile */
                    background: var(--bg-canvas);
                    border-radius: var(--radius-xl);
                    border: 1px solid var(--border-subtle);
                    padding: 40px 16px;
                    display: flex;
                    justify-content: center;
                    box-shadow: inset 0 0 40px rgba(0,0,0,0.02);
                }

                /* --- THE BUS BODY --- */
                .cg-bus-body {
                    background: var(--bg-surface);
                    border: 3px solid var(--border-subtle);
                    border-radius: 60px 60px 20px 20px; /* Aerodynamic front */
                    padding: 24px;
                    width: fit-content;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                /* --- FRONT CABIN --- */
                .cg-cabin-front {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding: 16px 8px 32px 8px;
                    border-bottom: 2px dashed var(--border-subtle);
                    position: relative;
                }
                .cg-windshield {
                    position: absolute;
                    top: -12px; left: 15%; right: 15%;
                    height: 12px;
                    background: var(--border-subtle);
                    border-radius: 0 0 16px 16px;
                    opacity: 0.5;
                }
                .cg-door-zone {
                    font-size: 10px;
                    font-weight: 900;
                    color: var(--status-success);
                    border-left: 4px solid var(--status-success);
                    padding-left: 8px;
                    letter-spacing: 1px;
                }
                .cg-driver-zone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    color: var(--text-muted);
                    font-size: 10px;
                    font-weight: 800;
                }
                .cg-driver-wheel {
                    color: var(--border-subtle);
                }

                /* --- SEATING CABIN --- */
                .cg-cabin-seating {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .cg-seating-row {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                /* --- THE SEAT NODES --- */
                .cg-seat-node {
                    width: 48px;
                    height: 48px;
                    border-radius: 8px;
                    border: 2px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 800;
                    transition: all 0.2s var(--ease-main);
                    position: relative;
                    /* Give it a slight 3D pop */
                    box-shadow: 0 4px 0 0 transparent;
                }
                
                .cg-seat-node.is-aisle {
                    width: 36px;
                    border: none;
                    background: transparent;
                }
                
                .cg-seat-node.is-empty {
                    border: none;
                    background: transparent;
                    pointer-events: none;
                }

                /* STATE: AVAILABLE */
                .cg-seat-node.is-available, .cg-legend-box.is-available {
                    background: var(--bg-input);
                    border-color: var(--border-subtle);
                    color: var(--text-main);
                    cursor: pointer;
                }
                .cg-seat-node.is-available:hover {
                    border-color: var(--brand-primary);
                    color: var(--brand-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 0 0 color-mix(in srgb, var(--brand-primary) 20%, transparent);
                }
                .cg-seat-node.is-available:active {
                    transform: translateY(2px);
                    box-shadow: 0 0 0 0 transparent;
                }

                /* STATE: SELECTED (BY CURRENT USER) */
                .cg-seat-node.is-selected, .cg-legend-box.is-selected {
                    background: var(--brand-primary);
                    border-color: var(--brand-primary);
                    color: var(--text-inverse);
                    cursor: pointer;
                    transform: translateY(2px);
                }

                /* STATE: BOOKED (UNAVAILABLE) */
                .cg-seat-node.is-booked, .cg-legend-box.is-booked {
                    background: var(--bg-surface);
                    border-color: var(--border-subtle);
                    color: var(--status-error);
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* --- REAR CABIN --- */
                .cg-cabin-rear {
                    height: 24px;
                    border-top: 2px solid var(--border-subtle);
                    margin-top: 8px;
                }
            `}</style>
        </div>
    );
};