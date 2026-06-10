/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AYABUS HOMEPAGE - World-Class Bus Booking Platform
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * v3 — Animated Search Experience
 * - Search button shows a spinner + "Searching..." while the query runs.
 * - Brief 250ms delay before auto-scrolling so the user sees the spinner.
 * - Smooth scroll positions the booking section right under the header.
 * - Sends `onSearchComplete` to BookingModule so we can reset the
 *   spinner state the moment routes land.
 */

import React, { useState, useEffect, useRef, useCallback, createContext, useContext, Suspense, lazy } from 'react';

// =============================================================================
// MODULE IMPORTS - All 24 modules structured for the AyaBus experience
// =============================================================================

import AccomodationModule from '../modules/accomodation/AccomodationModule';
import AppAdvertModule from '../modules/app-advert/AppAdvertModule';
import AwardsModule from '../modules/awards/AwardsModule';
import BigFooterModule from '../modules/big-footer/BigFooterModule';
import BookingModule from '../modules/booking/BookingModule';
import BusPartnersModule from '../modules/bus-partners/BusPartnersModule';
import CustomerSupportModule from '../modules/customer-support/CustomerSupportModule';
import FaqModule from '../modules/faq/FaqModule';
import NewsLetterModule from '../modules/news-letter/NewsLetterModule';
import NumbersModule from '../modules/numbers/NumbersModule';
import PartnerSupportModule from '../modules/partner-support/PartnerSupportModule';
import PopularRoutes from '../modules/popular-routes/PopularRoutes';
import RatingsModule from '../modules/ratings/RatingsModule';
import ReviewsModule from '../modules/reviews/ReviewsModule';

import { AccountsModule } from '../modules/accounts/AccountsModule';
import { AyaMilesModule } from '../modules/aya-miles/AyaMilesModule';
import { CancellationModule } from '../modules/cancellation/CancellationModule';
import { FlashBookingModule } from '../modules/flash-booking/FlashBookingModule';
import { MarketingModule } from '../modules/marketing/MarketingModule';
import { ParkFinderModule } from '../modules/park-finder/ParkFinderModule';
import { ParkPickUpModule } from '../modules/park-pick-up/ParkPickUpModule';
import { SettingsModule } from '../modules/settings/SettingsModule';
import { SignUpModule } from '../modules/sign-up/SignUpModule';
import { TicketsModule } from '../modules/tickets/TicketsModule';

// =============================================================================
// CONTEXT & STATE MANAGEMENT
// =============================================================================

export const ThemeContext = React.createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: 'light'
});

export const useTheme = () => useContext(ThemeContext);

export const NavigationContext = React.createContext({
  isMobileMenuOpen: false,
  activeModal: null,
  openModal: (modalName) => {},
  closeModal: () => {}
});

export const useNavigation = () => useContext(NavigationContext);

export const UserContext = React.createContext({
  user: null,
  isAuthenticated: false,
  login: (userData) => {},
  logout: () => {}
});

export const useUser = () => useContext(UserContext);

export const BookingContext = React.createContext({
  currentBooking: null,
  searchCriteria: { origin: '', destination: '', date: new Date(), passengers: 1 },
  setSearchCriteria: (criteria) => {},
  clearBooking: () => {}
});

export const useBooking = () => useContext(BookingContext);

// =============================================================================
// HEADER COMPONENT
// =============================================================================

const Header = ({ onMenuToggle, isMobileMenuOpen, onGoHome }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (modalName) => {
    setActiveModal(modalName);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  return (
    <>
      <header
        className={`ayabus-header ${isScrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--header-height)',
          background: isDarkMode ? 'var(--bg-surface)' : 'var(--bg-canvas)',
          borderBottom: `1px solid ${isDarkMode ? 'var(--border-subtle)' : 'var(--border-subtle)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          zIndex: 'var(--z-header)',
          transition: 'all var(--duration-fast) var(--ease-main)',
          boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <div
          className="header-brand"
          title="Return to Home"
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div
            className="logo"
            style={{
              background: 'var(--brand-primary)',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h19.6"/><path d="M18 18h2a1 1 0 0 0 1-1v-6H3v6a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M9 18h6"/><path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/>
            </svg>
          </div>
          <div className="brand-text">
            <h1 style={{
              fontSize: '24px', fontWeight: '900',
              color: 'var(--brand-primary)', margin: 0, letterSpacing: '-0.5px'
            }}>
              AyaBus
            </h1>
            <span style={{
              fontSize: '11px', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '2px'
            }}>
              Your seat is waiting
            </span>
          </div>
        </div>

        <nav className="desktop-nav" style={{ display: 'flex', gap: '8px' }}>
          <button className="ayabus-btn ayabus-btn-ghost" onClick={() => openModal('flashBooking')}
            style={{ fontSize: '13px', height: '40px', padding: '0 16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Quick Search
          </button>
          <button className="ayabus-btn ayabus-btn-ghost" onClick={() => openModal('parkFinder')}
            style={{ fontSize: '13px', height: '40px', padding: '0 16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Park Finder
          </button>
          <button className="ayabus-btn ayabus-btn-ghost" onClick={() => openModal('partnerSupport')}
            style={{ fontSize: '13px', height: '40px', padding: '0 16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            Partner With Us
          </button>
        </nav>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="ayabus-btn ayabus-btn-ghost" onClick={() => openModal('customerSupport')}
            style={{ height: '40px', padding: '0 12px' }} aria-label="Customer Support">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="hide-mobile" style={{ fontSize: '13px' }}>Support</span>
          </button>

          <button onClick={toggleTheme} className="theme-toggle ayabus-btn ayabus-btn-ghost"
            style={{ width: '40px', height: '40px', padding: 0, borderRadius: 'var(--radius-full)' }}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode' }>
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button className="ayabus-btn ayabus-btn-primary" onClick={() => openModal('signUp')}
            style={{ height: '40px', padding: '0 20px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Sign In
          </button>

          <button className="hamburger-menu ayabus-btn ayabus-btn-ghost" onClick={onMenuToggle}
            style={{ width: '40px', height: '40px', padding: 0 }} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {activeModal === 'signUp' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SignUpModule onClose={closeModal} />
          </div>
        </div>
      )}
      {activeModal === 'customerSupport' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CustomerSupportModule onClose={closeModal} />
          </div>
        </div>
      )}
      {activeModal === 'flashBooking' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FlashBookingModule
              onClose={closeModal}
              onInitiateSearch={(params) => {
                closeModal();
                window.dispatchEvent(new CustomEvent('ayabus:search', { detail: params }));
              }}
            />
          </div>
        </div>
      )}
      {activeModal === 'partnerSupport' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <PartnerSupportModule onClose={closeModal} />
          </div>
        </div>
      )}
      {activeModal === 'parkFinder' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ParkFinderModule onClose={closeModal} />
          </div>
        </div>
      )}

      <style>{`
        .ayabus-header.scrolled {
          backdrop-filter: blur(20px);
          background: ${isDarkMode ? 'rgba(0, 26, 77, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        }
        .hamburger-menu { display: flex !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hide-mobile { display: none; }
        }
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;
          background: ${isDarkMode ? 'var(--bg-surface)' : 'var(--bg-canvas)'};
          border-radius: var(--radius-xl);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </>
  );
};

// =============================================================================
// MOBILE MENU COMPONENT (unchanged structure)
// =============================================================================

const MobileMenu = ({ isOpen, onClose, onMenuItemClick }) => {
  const { isDarkMode } = useTheme();

  const menuItems = [
    { label: 'My Account', icon: 'user', module: 'accounts' },
    { label: 'My Tickets', icon: 'ticket', module: 'tickets' },
    { label: 'AyaMiles', icon: 'star', module: 'ayaMiles' },
    { label: 'Cancel Booking', icon: 'x-circle', module: 'cancellation' },
    { label: 'Settings', icon: 'settings', module: 'settings' },
    { label: 'Help & Support', icon: 'help', module: 'customerSupport' }
  ];

  const handleMenuItemClick = (module) => {
    onMenuItemClick(module);
    onClose();
  };

  const getIcon = (iconName) => {
    const icons = {
      user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
      ticket: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></>,
      star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
      'x-circle': <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
      settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
      help: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>
    };
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {icons[iconName]}
      </svg>
    );
  };

  return (
    <>
      <div
        className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 199,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all var(--duration-smooth) var(--ease-main)'
        }}
      />
      <nav
        className={`mobile-menu ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '320px', maxWidth: '85vw',
          background: isDarkMode ? 'var(--bg-surface)' : 'var(--bg-canvas)',
          zIndex: 200,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--duration-smooth) var(--ease-main)',
          display: 'flex', flexDirection: 'column',
          boxShadow: isOpen ? '-10px 0 30px rgba(0, 0, 0, 0.2)' : 'none'
        }}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${isDarkMode ? 'var(--border-subtle)' : 'var(--border-subtle)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Menu</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-main)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuItemClick(item.module)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 24px', background: 'transparent', border: 'none',
                cursor: 'pointer', color: 'var(--text-main)',
                fontSize: '15px', fontWeight: '500', textAlign: 'left',
                transition: 'background var(--duration-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: 'var(--brand-primary)' }}>{getIcon(item.icon)}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{
          padding: '20px 24px',
          borderTop: `1px solid ${isDarkMode ? 'var(--border-subtle)' : 'var(--border-subtle)'}`,
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AyaBus v2.0.0</span>
        </div>
      </nav>
    </>
  );
};

// =============================================================================
// HERO SECTION — with spinner-aware search button
// =============================================================================

const HeroSection = ({ isDarkMode, onSearch, isSearching }) => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  });

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (isSearching) return; // ignore double-clicks

    const origin      = (searchData.origin || '').trim();
    const destination = (searchData.destination || '').trim();

    if (!origin || !destination || !searchData.date) {
      alert('Please fill in your departure city, destination, and travel date.');
      return;
    }

    const searchPayload = {
      origin,
      destination,
      date: searchData.date,
      passengers: searchData.passengers
    };

    if (typeof onSearch === 'function') {
      onSearch(searchPayload);
    }
  };

  return (
    <section
      className="hero-section"
      style={{
        minHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '120px 32px 80px',
        background: isDarkMode
          ? 'linear-gradient(135deg, var(--bg-canvas) 0%, var(--bg-surface) 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? 'rgba(255, 215, 0, 0.05)' : 'rgba(0, 51, 160, 0.05)'} 1px, transparent 0)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <div style={{
        textAlign: 'center', maxWidth: '800px', marginBottom: '48px',
        position: 'relative', zIndex: 1
      }}>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: '900',
          color: 'var(--text-main)', lineHeight: 1.1,
          marginBottom: '20px', letterSpacing: '-2px'
        }}>
          Your seat is waiting
          <span style={{ color: 'var(--brand-primary)', display: 'block' }}>
            Secure it now
          </span>
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-muted)',
          maxWidth: '600px', margin: '0 auto', lineHeight: 1.6
        }}>
          Book your bus journey across Africa with comfort, reliability, and unbeatable prices. Join over 400,000 happy travelers.
        </p>
      </div>

      <div
        className="ayabus-card"
        style={{
          maxWidth: '1000px', width: '100%', padding: '32px',
          position: 'relative', zIndex: 1,
          background: isDarkMode ? 'rgba(0, 26, 77, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px', marginBottom: '20px'
          }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                From
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <input
                  type="text"
                  className="ayabus-input"
                  placeholder="Departing from"
                  value={searchData.origin}
                  disabled={isSearching}
                  onChange={(e) => setSearchData({...searchData, origin: e.target.value})}
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                To
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <input
                  type="text"
                  className="ayabus-input"
                  placeholder="Going to"
                  value={searchData.destination}
                  disabled={isSearching}
                  onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                On Date
              </label>
              <input
                type="date"
                className="ayabus-input"
                value={searchData.date}
                disabled={isSearching}
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Passengers
              </label>
              <select
                className="ayabus-input"
                value={searchData.passengers}
                disabled={isSearching}
                onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value, 10)})}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSearch}
            disabled={isSearching}
            className="ayabus-btn ayabus-btn-primary search-submit"
            style={{
              width: '100%',
              height: '56px',
              fontSize: '16px',
              opacity: isSearching ? 0.85 : 1,
              cursor: isSearching ? 'wait' : 'pointer',
            }}
          >
            {isSearching ? (
              <>
                <svg className="search-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 40" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Search Buses
              </>
            )}
          </button>
        </form>
      </div>

      <div style={{
        display: 'flex', gap: '48px', marginTop: '48px', flexWrap: 'wrap',
        justifyContent: 'center', position: 'relative', zIndex: 1
      }}>
        {[
          { value: '400K+', label: 'Customers' },
          { value: '420+', label: 'Buses' },
          { value: '115+', label: 'Routes' },
          { value: '7M+', label: 'Tickets Sold' }
        ].map((stat, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: '900', color: 'var(--brand-primary)'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '14px', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .search-submit { transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; }
        .search-submit:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .search-submit:disabled { transform: none; }
        .search-spinner { animation: spin 0.85s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

// =============================================================================
// MAIN HOMEPAGE COMPONENT
// =============================================================================

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);
  const [bookingSearchParams, setBookingSearchParams] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const bookingSectionRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ayabus-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const handleGlobalSearchRef = useRef(null);

  // Listen for search events from FlashBookingModule modal
  useEffect(() => {
    const handleFlashSearch = (e) => handleGlobalSearchRef.current?.(e.detail);
    window.addEventListener('ayabus:search', handleFlashSearch);
    return () => window.removeEventListener('ayabus:search', handleFlashSearch);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('ayabus-theme', !isDarkMode ? 'dark' : 'light');
  };

  const openModal = (modalName) => {
    setActiveModal(modalName);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  const handleMenuItemClick = (module) => {
    openModal(module);
  };

  // Callback fired by BookingModule when its query resolves
  const handleSearchComplete = useCallback(() => {
    setIsSearching(false);
  }, []);

  // The animated transition: state update → 250ms delay → smooth scroll
  // → user lands on booking section showing skeletons → results fade in
  const handleGlobalSearch = (params) => {
    setIsSearching(true);
    setBookingSearchParams({ ...params });

    setTimeout(() => {
      if (bookingSectionRef.current) {
        bookingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 250);

    // Safety net: if onSearchComplete never fires (e.g. network error not caught),
    // reset the spinner after 10s so the button never stays stuck.
    setTimeout(() => {
      setIsSearching(false);
    }, 10000);
  };

  // Keep ref in sync so the flash search listener always calls the latest version
  handleGlobalSearchRef.current = handleGlobalSearch;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme: isDarkMode ? 'dark' : 'light' }}>
      <UserContext.Provider value={{ user, isAuthenticated: !!user, login: setUser, logout: () => setUser(null) }}>
        <NavigationContext.Provider value={{ isMobileMenuOpen, activeModal, openModal, closeModal }}>

          <BookingContext.Provider value={{
              currentBooking: null,
              searchCriteria: bookingSearchParams || { origin: '', destination: '', date: new Date().toISOString().split('T')[0], passengers: 1 },
              setSearchCriteria: handleGlobalSearch,
              clearBooking: () => setBookingSearchParams(null)
          }}>

            <div className="ayabus-viewport">
              <Header
                onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isMobileMenuOpen={isMobileMenuOpen}
                onGoHome={() => {
                  setBookingSearchParams(null);
                  setIsSearching(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onMenuItemClick={handleMenuItemClick}
              />

              {activeModal === 'accounts' && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <AccountsModule onClose={closeModal} />
                  </div>
                </div>
              )}
              {activeModal === 'tickets' && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <TicketsModule onClose={closeModal} />
                  </div>
                </div>
              )}
              {activeModal === 'ayaMiles' && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <AyaMilesModule onClose={closeModal} />
                  </div>
                </div>
              )}
              {activeModal === 'cancellation' && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <CancellationModule onClose={closeModal} />
                  </div>
                </div>
              )}
              {activeModal === 'settings' && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <SettingsModule onClose={closeModal} />
                  </div>
                </div>
              )}

              <main className="ayabus-scroll-area" style={{ paddingTop: '0' }}>

                <HeroSection
                  isDarkMode={isDarkMode}
                  onSearch={handleGlobalSearch}
                  isSearching={isSearching}
                />

                <section ref={bookingSectionRef} style={{ marginTop: '48px' }}>
                  <BookingModule
                    initialSearchParams={bookingSearchParams}
                    key={bookingSearchParams ? JSON.stringify(bookingSearchParams) : 'default'}
                    onSearchComplete={handleSearchComplete}
                  />
                </section>

                <section style={{ marginTop: '48px' }}><MarketingModule /></section>
                <section style={{ marginTop: '48px' }}><ParkPickUpModule /></section>
                <section style={{ marginTop: '48px' }}><AccomodationModule /></section>
                <section style={{ marginTop: '48px' }}><NewsLetterModule /></section>
                <section style={{ marginTop: '48px' }}><AppAdvertModule /></section>
                <section style={{ marginTop: '48px' }}><NumbersModule /></section>
                <section style={{ marginTop: '48px' }}><AwardsModule /></section>
                <section style={{ marginTop: '48px' }}><BusPartnersModule /></section>
                <section style={{ marginTop: '48px' }}><PopularRoutes /></section>
                <section style={{ marginTop: '48px' }}><RatingsModule /></section>
                <section style={{ marginTop: '48px' }}><ReviewsModule /></section>
                <section style={{ marginTop: '48px' }}><FaqModule /></section>
                <section style={{ marginTop: '48px' }}><BigFooterModule /></section>

              </main>

              <GlobalStyles isDarkMode={isDarkMode} />
            </div>

          </BookingContext.Provider>
        </NavigationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

// =============================================================================
// GLOBAL STYLES COMPONENT
// =============================================================================

const GlobalStyles = ({ isDarkMode }) => (
  <style>{`
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { overflow-x: hidden; }
    h1, h2, h3, h4, h5, h6 { word-wrap: break-word; }

    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .grid-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }

    .flex-center { display: flex; align-items: center; justify-content: center; }
    .flex-between { display: flex; align-items: center; justify-content: space-between; }
    .flex-column { display: flex; flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }

    .gap-sm { gap: 8px; } .gap-md { gap: 16px; } .gap-lg { gap: 24px; } .gap-xl { gap: 32px; }
    .mt-sm { margin-top: 8px; } .mt-md { margin-top: 16px; } .mt-lg { margin-top: 24px; } .mt-xl { margin-top: 48px; }
    .mb-sm { margin-bottom: 8px; } .mb-md { margin-bottom: 16px; } .mb-lg { margin-bottom: 24px; } .mb-xl { margin-bottom: 48px; }
    .p-sm { padding: 8px; } .p-md { padding: 16px; } .p-lg { padding: 24px; } .p-xl { padding: 48px; }

    .text-center { text-align: center; } .text-left { text-align: left; } .text-right { text-align: right; }
    .text-sm { font-size: 12px; } .text-md { font-size: 14px; } .text-lg { font-size: 18px; } .text-xl { font-size: 24px; }
    .text-muted { color: var(--text-muted); } .text-primary { color: var(--brand-primary); }
    .font-bold { font-weight: 700; } .font-bolder { font-weight: 900; }

    .border-round { border-radius: var(--radius-md); } .border-round-lg { border-radius: var(--radius-lg); } .border-round-full { border-radius: var(--radius-full); }

    .shadow-sm { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
    .shadow-md { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); }
    .shadow-lg { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-surface); }
    ::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--brand-primary); }

    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @media (min-width: 1400px) { .ayabus-scroll-area { padding: 48px; } }
    @media (min-width: 1024px) and (max-width: 1399px) {
      .ayabus-scroll-area { padding: 32px; }
      .grid-4 { grid-template-columns: repeat(3, 1fr); }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .ayabus-scroll-area { padding: 24px; }
      .grid-2, .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
      .hide-tablet { display: none !important; }
    }
    @media (max-width: 767px) {
      .ayabus-scroll-area { padding: 16px; }
      .grid-2, .grid-3, .grid-4, .grid-auto { grid-template-columns: 1fr; }
      .hide-mobile { display: none !important; }
      .text-xl-mobile { font-size: 20px !important; }
      .p-xl { padding: 24px; }
    }
    @media (max-width: 480px) {
      .ayabus-scroll-area { padding: 12px; }
      .ayabus-card { padding: 16px; }
      .ayabus-btn { height: 44px; font-size: 12px; }
    }

    @media print {
      .no-print { display: none !important; }
      body { background: white; color: black; }
      .ayabus-viewport { height: auto; overflow: visible; }
      .ayabus-scroll-area { overflow: visible; padding: 20px; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    :focus-visible { outline: 2px solid var(--brand-primary); outline-offset: 2px; }

    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
    }

    .skeleton {
      background: linear-gradient(90deg,
        ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 25%,
        ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 50%,
        ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-md);
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    @media (hover: none) and (pointer: coarse) {
      .ayabus-btn:hover { transform: none; }
      .ayabus-btn:active { transform: scale(0.98); }
      button, a, input, select { min-height: 44px; }
    }

    .horizontal-scroll {
      overflow-x: auto; overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      padding-bottom: 16px;
    }
    .horizontal-scroll::-webkit-scrollbar { height: 6px; }
    .horizontal-scroll-inner { display: flex; gap: 16px; min-width: min-content; }
  `}</style>
);

export default HomePage;
