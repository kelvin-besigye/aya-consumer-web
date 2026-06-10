/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Flash Booking (Module 2/24)
 * File: src/modules/flash-booking/FlashBookingModule.jsx
 *
 * FIXES IN THIS VERSION:
 * 1. AUTOFILL: Fetches real city names from the DB via bookingQueries.fetchAllCities()
 *    Falls back to REGIONAL_HUBS static list if DB fetch fails.
 * 2. BETTER UI: Cleaner, more usable layout — especially on mobile.
 * 3. KEY FIX: Sends { date } not { travelDate } so BookingModule receives it correctly.
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, CalendarDays, Search, Users, MapPin, Navigation, X } from 'lucide-react';
import { bookingQueries } from '../booking/services/booking.queries';
import { REGIONAL_HUBS } from './data/regional-hubs';

export const FlashBookingModule = ({ onInitiateSearch }) => {

    const [origin, setOrigin]           = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate]               = useState('');
    const [passengers, setPassengers]   = useState(1);

    // Autocomplete state
    const [cities, setCities]               = useState([]);
    const [originSuggestions, setOriginSuggestions]           = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [originFocused, setOriginFocused]           = useState(false);
    const [destinationFocused, setDestinationFocused] = useState(false);

    const originRef      = useRef(null);
    const destinationRef = useRef(null);

    // Load cities from DB on mount, fall back to REGIONAL_HUBS
    useEffect(() => {
        const loadCities = async () => {
            const result = await bookingQueries.fetchAllCities();
            if (result.success && result.data.length > 0) {
                setCities(result.data);
            } else {
                // Fallback to static hub list
                setCities(REGIONAL_HUBS.map(h => h.name));
            }
        };
        loadCities();
    }, []);

    // Filter suggestions as user types
    const getSuggestions = (input) => {
        if (!input || input.length < 1) return [];
        const lower = input.toLowerCase();
        return cities
            .filter(c => c.toLowerCase().includes(lower))
            .slice(0, 6);
    };

    const handleOriginChange = (val) => {
        setOrigin(val);
        setOriginSuggestions(getSuggestions(val));
    };

    const handleDestinationChange = (val) => {
        setDestination(val);
        setDestinationSuggestions(getSuggestions(val));
    };

    const handleRouteSwap = (e) => {
        e.preventDefault();
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!origin || !destination || !date) {
            alert('Please fill in departure city, destination, and travel date.');
            return;
        }
        if (typeof onInitiateSearch === 'function') {
            onInitiateSearch({ origin, destination, date, passengers });
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fb-shell">
            <form onSubmit={handleSubmit} className="fb-form" autoComplete="off">

                {/* ROW 1: FROM / SWAP / TO */}
                <div className="fb-locations">

                    {/* FROM */}
                    <div className="fb-field" ref={originRef}>
                        <label className="fb-label">
                            <MapPin size={13} />
                            From
                        </label>
                        <div className="fb-input-wrap">
                            <input
                                className="fb-input"
                                type="text"
                                placeholder="Departure city"
                                value={origin}
                                onChange={e => handleOriginChange(e.target.value)}
                                onFocus={() => { setOriginFocused(true); setOriginSuggestions(getSuggestions(origin)); }}
                                onBlur={() => setTimeout(() => setOriginFocused(false), 150)}
                            />
                            {origin && (
                                <button type="button" className="fb-clear" onClick={() => { setOrigin(''); setOriginSuggestions([]); }}>
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        {originFocused && originSuggestions.length > 0 && (
                            <ul className="fb-suggestions">
                                {originSuggestions.map(city => (
                                    <li key={city} onMouseDown={() => { setOrigin(city); setOriginSuggestions([]); }}>
                                        <MapPin size={12} />
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* SWAP BUTTON */}
                    <button type="button" className="fb-swap" onClick={handleRouteSwap} aria-label="Swap">
                        <ArrowRightLeft size={15} />
                    </button>

                    {/* TO */}
                    <div className="fb-field" ref={destinationRef}>
                        <label className="fb-label">
                            <Navigation size={13} />
                            To
                        </label>
                        <div className="fb-input-wrap">
                            <input
                                className="fb-input"
                                type="text"
                                placeholder="Destination city"
                                value={destination}
                                onChange={e => handleDestinationChange(e.target.value)}
                                onFocus={() => { setDestinationFocused(true); setDestinationSuggestions(getSuggestions(destination)); }}
                                onBlur={() => setTimeout(() => setDestinationFocused(false), 150)}
                            />
                            {destination && (
                                <button type="button" className="fb-clear" onClick={() => { setDestination(''); setDestinationSuggestions([]); }}>
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        {destinationFocused && destinationSuggestions.length > 0 && (
                            <ul className="fb-suggestions">
                                {destinationSuggestions.map(city => (
                                    <li key={city} onMouseDown={() => { setDestination(city); setDestinationSuggestions([]); }}>
                                        <Navigation size={12} />
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* ROW 2: DATE / PASSENGERS / BUTTON */}
                <div className="fb-meta">

                    <div className="fb-field">
                        <label className="fb-label">
                            <CalendarDays size={13} />
                            Date
                        </label>
                        <input
                            className="fb-input"
                            type="date"
                            min={today}
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fb-field fb-field--narrow">
                        <label className="fb-label">
                            <Users size={13} />
                            Passengers
                        </label>
                        <select
                            className="fb-input fb-select"
                            value={passengers}
                            onChange={e => setPassengers(Number(e.target.value))}
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="fb-submit">
                        <Search size={18} strokeWidth={2.5} />
                        <span>Search Buses</span>
                    </button>

                </div>

            </form>

            <style>{`
                .fb-shell {
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                }

                .fb-form {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 20px 24px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.10);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* --- ROW 1: LOCATIONS --- */
                .fb-locations {
                    display: grid;
                    grid-template-columns: 1fr 44px 1fr;
                    align-items: end;
                    gap: 8px;
                }

                /* --- ROW 2: META --- */
                .fb-meta {
                    display: grid;
                    grid-template-columns: 1fr 0.7fr auto;
                    align-items: end;
                    gap: 12px;
                }

                /* --- FIELD --- */
                .fb-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    position: relative;
                }

                .fb-field--narrow { max-width: 180px; }

                .fb-label {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                }

                .fb-label svg { color: var(--brand-primary); }

                .fb-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .fb-input {
                    width: 100%;
                    height: 48px;
                    background: var(--bg-body);
                    border: 1.5px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 0 36px 0 14px;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-main);
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }

                .fb-input:focus {
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 12%, transparent);
                }

                /* date & select don't need extra right padding */
                input[type="date"].fb-input,
                .fb-select { padding-right: 14px; }

                .fb-select {
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    background-size: 14px;
                    padding-right: 32px !important;
                }

                .fb-clear {
                    position: absolute;
                    right: 10px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-muted);
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    border-radius: 50%;
                }

                .fb-clear:hover { color: var(--text-main); background: var(--bg-hover); }

                /* --- SWAP BUTTON --- */
                .fb-swap {
                    width: 44px;
                    height: 48px;
                    border-radius: var(--radius-lg);
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    border: 1.5px solid color-mix(in srgb, var(--brand-primary) 25%, transparent);
                    color: var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    align-self: end;
                    transition: all 0.25s;
                    flex-shrink: 0;
                }

                .fb-swap:hover {
                    background: var(--brand-primary);
                    color: white;
                    transform: rotate(180deg);
                }

                /* --- SUGGESTIONS DROPDOWN --- */
                .fb-suggestions {
                    position: absolute;
                    top: calc(100% + 4px);
                    left: 0;
                    right: 0;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                    z-index: 999;
                    margin: 0;
                    padding: 4px;
                    list-style: none;
                    max-height: 220px;
                    overflow-y: auto;
                }

                .fb-suggestions li {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-main);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: background 0.15s;
                }

                .fb-suggestions li:hover {
                    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
                    color: var(--brand-primary);
                }

                .fb-suggestions li svg { color: var(--brand-primary); flex-shrink: 0; }

                /* --- SUBMIT BUTTON --- */
                .fb-submit {
                    height: 48px;
                    background: var(--brand-primary);
                    color: white;
                    border: none;
                    border-radius: var(--radius-lg);
                    padding: 0 28px;
                    font-size: 15px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.25s;
                    font-family: inherit;
                }

                .fb-submit:hover {
                    background: var(--brand-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-primary) 35%, transparent);
                }

                .fb-submit:active { transform: translateY(0); }

                /* ===================== RESPONSIVE ===================== */
                @media (max-width: 900px) {
                    .fb-locations {
                        grid-template-columns: 1fr 40px 1fr;
                    }
                    .fb-meta {
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: auto auto;
                    }
                    .fb-field--narrow { max-width: 100%; }
                    .fb-submit {
                        grid-column: 1 / -1;
                        width: 100%;
                        height: 52px;
                    }
                }

                @media (max-width: 600px) {
                    .fb-form { padding: 16px; gap: 12px; }
                    .fb-locations {
                        grid-template-columns: 1fr;
                        grid-template-rows: auto auto auto;
                    }
                    .fb-swap {
                        width: 100%;
                        height: 36px;
                        transform: rotate(90deg);
                    }
                    .fb-swap:hover { transform: rotate(270deg); }
                    .fb-meta {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};
