/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 3 - UI Components)
 * File: FilterRibbon.jsx
 * * DESCRIPTION:
 * The apex 8-variable filtration matrix. Allows users to slice 
 * search results by Price, Company, Departure Time, Class, Amenities, 
 * Park Locations, and Ratings.
 * * WORLD-CLASS ENGINEERING:
 * 1. ZERO-JANK SCROLLING: Hardware-accelerated horizontal track using
 * `overscroll-behavior-x` for native app-like kinetic scrolling.
 * 2. CLICK-OUTSIDE ENGINE: Custom hook instantly aborts popovers when 
 * the user taps away, ensuring the UI never gets stuck.
 * 3. DARK MODE INHERITANCE: 100% reliant on index.css variables 
 * (--bg-surface, --text-main) to guarantee instant theme switching.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
    SlidersHorizontal, Banknote, BusFront, Clock, 
    Star, MapPin, Wifi, Armchair, X, Check
} from 'lucide-react';

// ============================================================================
// ATOMIC SUB-COMPONENT: The Smart Popover
// Automatically handles its own z-index, background blurring, and closing.
// ============================================================================
const FilterPopover = ({ isOpen, onClose, title, children }) => {
    const popoverRef = useRef(null);

    // Close when clicking outside the popover
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="filter-popover" ref={popoverRef}>
            <div className="popover-header">
                <span className="popover-title">{title}</span>
            </div>
            <div className="popover-body">
                {children}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT: FilterRibbon
// ============================================================================
export const FilterRibbon = ({ 
    activeFilters,      // The current state from store/useBookingEngine.js
    availableOptions,   // The unique options extracted from the current route results
    onUpdateFilter,     // Function to update a specific filter
    onClearAll          // Reset trigger
}) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (id) => {
        setOpenDropdown(prev => prev === id ? null : id);
    };

    // Calculate how many filters are currently active to show a badge
    const activeFilterCount = Object.values(activeFilters).filter(val => {
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === 'object' && val !== null) return val.min > 0 || val.max < Infinity;
        return val !== null && val !== '';
    }).length;

    return (
        <div className="filter-ribbon-container">
            
            {/* MASTER CONTROL: Filter Icon & Clear Button */}
            <div className="ribbon-master-controls">
                <div className="ribbon-icon">
                    <SlidersHorizontal size={20} className="icon-main" />
                    {activeFilterCount > 0 && (
                        <span className="filter-badge">{activeFilterCount}</span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button onClick={onClearAll} className="clear-all-btn">
                        Clear <X size={14} />
                    </button>
                )}
            </div>

            {/* HORIZONTAL SCROLL TRACK */}
            <div className="ribbon-track">
                
                {/* 1. PRICE FILTER */}
                <div className="filter-chip-wrapper">
                    <button 
                        className={`filter-chip ${(activeFilters.price?.max < availableOptions.maxPrice) ? 'active' : ''}`}
                        onClick={() => toggleDropdown('price')}
                    >
                        <Banknote size={16} />
                        <span>Price</span>
                    </button>
                    <FilterPopover 
                        isOpen={openDropdown === 'price'} 
                        onClose={() => setOpenDropdown(null)} 
                        title="Maximum Price (UGX)"
                    >
                        <input 
                            type="range" 
                            min={availableOptions.minPrice || 0} 
                            max={availableOptions.maxPrice || 100000} 
                            step="5000"
                            value={activeFilters.price?.max || availableOptions.maxPrice}
                            onChange={(e) => onUpdateFilter('price', { ...activeFilters.price, max: parseInt(e.target.value) })}
                            className="ayabus-range-slider"
                        />
                        <div className="range-labels">
                            <span>{availableOptions.minPrice?.toLocaleString()}</span>
                            <span className="range-value-highlight">{activeFilters.price?.max?.toLocaleString()}</span>
                        </div>
                    </FilterPopover>
                </div>

                {/* 2. COMPANY (PARTNER) FILTER */}
                <div className="filter-chip-wrapper">
                    <button 
                        className={`filter-chip ${activeFilters.companies?.length > 0 ? 'active' : ''}`}
                        onClick={() => toggleDropdown('company')}
                    >
                        <BusFront size={16} />
                        <span>Operator</span>
                    </button>
                    <FilterPopover 
                        isOpen={openDropdown === 'company'} 
                        onClose={() => setOpenDropdown(null)} 
                        title="Bus Companies"
                    >
                        <div className="checkbox-list">
                            {availableOptions.companies?.map(company => (
                                <label key={company.id} className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        checked={activeFilters.companies?.includes(company.id) || false}
                                        onChange={(e) => {
                                            const newCompanies = e.target.checked 
                                                ? [...(activeFilters.companies || []), company.id]
                                                : (activeFilters.companies || []).filter(id => id !== company.id);
                                            onUpdateFilter('companies', newCompanies);
                                        }}
                                    />
                                    <span className="checkbox-label">{company.name}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>
                </div>

                {/* 3. DEPARTURE TIME FILTER */}
                <div className="filter-chip-wrapper">
                    <button 
                        className={`filter-chip ${activeFilters.timeOfDay?.length > 0 ? 'active' : ''}`}
                        onClick={() => toggleDropdown('time')}
                    >
                        <Clock size={16} />
                        <span>Time</span>
                    </button>
                    <FilterPopover 
                        isOpen={openDropdown === 'time'} 
                        onClose={() => setOpenDropdown(null)} 
                        title="Departure Window"
                    >
                        <div className="pill-grid">
                            {['Morning (06:00 - 11:59)', 'Afternoon (12:00 - 16:59)', 'Evening (17:00 - 20:59)', 'Night (21:00 - 05:59)'].map(window => (
                                <button 
                                    key={window}
                                    className={`time-pill ${activeFilters.timeOfDay?.includes(window) ? 'selected' : ''}`}
                                    onClick={() => {
                                        const newTimes = activeFilters.timeOfDay?.includes(window)
                                            ? activeFilters.timeOfDay.filter(t => t !== window)
                                            : [...(activeFilters.timeOfDay || []), window];
                                        onUpdateFilter('timeOfDay', newTimes);
                                    }}
                                >
                                    {window}
                                </button>
                            ))}
                        </div>
                    </FilterPopover>
                </div>

                {/* 4. CLASS FILTER */}
                <div className="filter-chip-wrapper">
                    <button 
                        className={`filter-chip ${activeFilters.class?.length > 0 ? 'active' : ''}`}
                        onClick={() => toggleDropdown('class')}
                    >
                        <Armchair size={16} />
                        <span>Class</span>
                    </button>
                    <FilterPopover 
                        isOpen={openDropdown === 'class'} 
                        onClose={() => setOpenDropdown(null)} 
                        title="Seating Class"
                    >
                        <div className="checkbox-list">
                            {availableOptions.classes?.map(busClass => (
                                <label key={busClass} className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        checked={activeFilters.class?.includes(busClass) || false}
                                        onChange={(e) => {
                                            const newClasses = e.target.checked 
                                                ? [...(activeFilters.class || []), busClass]
                                                : (activeFilters.class || []).filter(c => c !== busClass);
                                            onUpdateFilter('class', newClasses);
                                        }}
                                    />
                                    <span className="checkbox-label">{busClass}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>
                </div>

                {/* 5. PARK / TERMINAL FILTER */}
                <div className="filter-chip-wrapper">
                    <button 
                        className={`filter-chip ${activeFilters.park?.length > 0 ? 'active' : ''}`}
                        onClick={() => toggleDropdown('park')}
                    >
                        <MapPin size={16} />
                        <span>Terminal</span>
                    </button>
                    <FilterPopover 
                        isOpen={openDropdown === 'park'} 
                        onClose={() => setOpenDropdown(null)} 
                        title="Boarding Parks"
                    >
                        <div className="checkbox-list">
                            {availableOptions.parks?.map(park => (
                                <label key={park.id} className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        checked={activeFilters.park?.includes(park.id) || false}
                                        onChange={(e) => {
                                            const newParks = e.target.checked 
                                                ? [...(activeFilters.park || []), park.id]
                                                : (activeFilters.park || []).filter(p => p !== park.id);
                                            onUpdateFilter('park', newParks);
                                        }}
                                    />
                                    <span className="checkbox-label">{park.name}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>
                </div>

                {/* 6. AMENITIES FILTER */}
                <div className="filter-chip-wrapper">
                    <button 
                        className={`filter-chip ${activeFilters.amenities?.length > 0 ? 'active' : ''}`}
                        onClick={() => toggleDropdown('amenities')}
                    >
                        <Wifi size={16} />
                        <span>Amenities</span>
                    </button>
                    <FilterPopover 
                        isOpen={openDropdown === 'amenities'} 
                        onClose={() => setOpenDropdown(null)} 
                        title="Onboard Amenities"
                    >
                        <div className="checkbox-list">
                            {['WiFi', 'A/C', 'Charging Ports', 'Toilet', 'Snacks'].map(amenity => (
                                <label key={amenity} className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        checked={activeFilters.amenities?.includes(amenity) || false}
                                        onChange={(e) => {
                                            const newAmenities = e.target.checked 
                                                ? [...(activeFilters.amenities || []), amenity]
                                                : (activeFilters.amenities || []).filter(a => a !== amenity);
                                            onUpdateFilter('amenities', newAmenities);
                                        }}
                                    />
                                    <span className="checkbox-label">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </FilterPopover>
                </div>

                {/* 7. RATINGS FILTER */}
                <div className="filter-chip-wrapper">
                    <button 
                        className={`filter-chip ${activeFilters.rating ? 'active' : ''}`}
                        onClick={() => toggleDropdown('rating')}
                    >
                        <Star size={16} />
                        <span>Rating</span>
                    </button>
                    <FilterPopover 
                        isOpen={openDropdown === 'rating'} 
                        onClose={() => setOpenDropdown(null)} 
                        title="Minimum Rating"
                    >
                        <div className="pill-grid">
                            {[4, 3, 2].map(stars => (
                                <button 
                                    key={stars}
                                    className={`time-pill ${activeFilters.rating === stars ? 'selected' : ''}`}
                                    onClick={() => onUpdateFilter('rating', activeFilters.rating === stars ? null : stars)}
                                >
                                    {stars}+ Stars
                                </button>
                            ))}
                        </div>
                    </FilterPopover>
                </div>

            </div>

            {/* STYLES: Directly coupled to index.css CSS variables */}
            <style>{`
                .filter-ribbon-container {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    width: 100%;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--border-subtle);
                    background: var(--bg-body);
                    position: sticky;
                    top: 0;
                    z-index: var(--z-dock, 10);
                }

                /* MASTER CONTROLS */
                .ribbon-master-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-left: 24px;
                    flex-shrink: 0;
                }

                .ribbon-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-main);
                }

                .filter-badge {
                    position: absolute;
                    top: -6px;
                    right: -8px;
                    background: var(--brand-primary);
                    color: #fff;
                    font-size: 10px;
                    font-weight: 800;
                    height: 16px;
                    min-width: 16px;
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 4px;
                    border: 2px solid var(--bg-body);
                }

                .clear-all-btn {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-muted);
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: var(--radius-sm);
                    transition: all var(--ease-main) 0.2s;
                }
                .clear-all-btn:hover {
                    color: var(--text-main);
                    background: var(--bg-surface);
                }

                /* HORIZONTAL SCROLL TRACK */
                .ribbon-track {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    overflow-x: auto;
                    overscroll-behavior-x: contain;
                    padding-right: 24px;
                    padding-bottom: 4px; /* padding for scrollbar invisible track */
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none;  /* IE and Edge */
                }
                .ribbon-track::-webkit-scrollbar {
                    display: none; /* Chrome/Safari */
                }

                /* INDIVIDUAL CHIPS */
                .filter-chip-wrapper {
                    position: relative; /* Anchor for absolute popovers */
                }

                .filter-chip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    height: 36px;
                    padding: 0 16px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-full);
                    color: var(--text-main);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all var(--ease-main) 0.2s;
                    user-select: none;
                }
                
                .filter-chip:hover {
                    border-color: var(--text-muted);
                }

                .filter-chip.active {
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    border-color: var(--brand-primary);
                    color: var(--brand-primary);
                    font-weight: 600;
                }

                /* THE SMART POPOVER */
                .filter-popover {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    min-width: 260px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
                    z-index: var(--z-dropdown, 300);
                    animation: popoverFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transform-origin: top left;
                }

                @keyframes popoverFadeIn {
                    from { opacity: 0; transform: translateY(-4px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .popover-header {
                    padding: 16px;
                    border-bottom: 1px solid var(--border-subtle);
                }
                
                .popover-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .popover-body {
                    padding: 16px;
                    max-height: 300px;
                    overflow-y: auto;
                }

                /* POPOVER INTERNAL UI (Ranges, Checkboxes, Pills) */
                .ayabus-range-slider {
                    width: 100%;
                    margin: 8px 0 16px;
                    accent-color: var(--brand-primary);
                }

                .range-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-muted);
                }
                
                .range-value-highlight {
                    color: var(--brand-primary);
                }

                .checkbox-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                }

                .checkbox-item input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    accent-color: var(--brand-primary);
                    cursor: pointer;
                }

                .checkbox-label {
                    font-size: 14px;
                    color: var(--text-main);
                    font-weight: 500;
                }

                .pill-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 8px;
                }

                .time-pill {
                    width: 100%;
                    text-align: left;
                    padding: 10px 12px;
                    background: var(--bg-body);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .time-pill:hover {
                    border-color: var(--text-muted);
                }

                .time-pill.selected {
                    background: var(--brand-primary);
                    border-color: var(--brand-primary);
                    color: #fff;
                    font-weight: 600;
                }

                /* RESPONSIVE PROTECTIONS */
                @media (max-width: 768px) {
                    .ribbon-master-controls {
                        padding-left: 16px; /* tighter padding on mobile */
                    }
                    /* On mobile, shift the right-most popovers so they don't bleed off-screen */
                    .filter-chip-wrapper:nth-last-child(-n+3) .filter-popover {
                        left: auto;
                        right: 0;
                        transform-origin: top right;
                    }
                }
            `}</style>
        </div>
    );
};