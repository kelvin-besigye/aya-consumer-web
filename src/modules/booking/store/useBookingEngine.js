/**
 * 🌍 AYABUS CONSUMER WEB (The Funnel Brain)
 * ------------------------------------------------------------------
 * Module: Booking
 * File: useBookingEngine.js
 * * DESCRIPTION:
 * The Master State Machine for the 4-Step Booking Funnel. 
 * Handles memory across route selection, seat clicking, passenger 
 * data entry, and final payment calculation.
 * * WORLD-CLASS ENGINEERING:
 * 1. ZUSTAND ENGINE: Zero unnecessary re-renders. Lightning fast.
 * 2. CRYPTO SESSION: Generates a unique `sessionId` on initialization 
 * to map the exact user journey for your analytics table.
 * 3. DYNAMIC MANIFEST: Automatically creates and destroys passenger 
 * input fields based on how many seats the user clicks.
 */

import { create } from 'zustand';

export const useBookingEngine = create((set, get) => ({
    // ========================================================================
    // 1. TELEMETRY & FUNNEL TRACKING
    // ========================================================================
    // Native browser crypto for unique session tracking without external libraries
    sessionId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    currentStep: 1, // 1: Search, 2: Detail, 3: SeatVault, 4: Checkout

    // ========================================================================
    // 2. SEARCH INTENT (From Homepage / Step 1)
    // ========================================================================
    searchQuery: {
        origin: '',
        destination: '',
        travelDate: '',
        passengers: 1
    },

    // ========================================================================
    // 3. THE SELECTED ASSET (Step 1 -> Step 2)
    // Holds the exact database row of the route they clicked.
    // ========================================================================
    selectedRoute: null, 
    /* Expected structure when populated:
      {
         id: 'uuid', busCompany: 'YY Coaches', class: 'VIP', price: 40000, 
         departureTime: '09:00:00', duration: '6h', parkLocation: 'Namayiba',
         amenities: ['AC', 'WiFi', 'Charging'], rating: 4.8
      }
    */

    // ========================================================================
    // 4. THE VAULT: SEATS & PASSENGER MANIFEST (Step 3)
    // ========================================================================
    selectedSeats: [], // Array of seat IDs, e.g., ['14A', '14B']
    
    // The Manifest aligns exactly with the Partner Portal requirements
    passengerManifest: [], 
    /*
      Expected structure:
      [{ seatId: '14A', passengerName: '', activePhone: '', altContact: '', luggage: 'STANDARD' }]
    */

    // ========================================================================
    // 5. THE FINANCIALS (Step 4)
    // ========================================================================
    paymentMethod: null, // 'MTN' | 'AIRTEL' | 'VISA' | 'PAYPAL'
    
    // Derived State: Calculates total in real-time based on seats + luggage upgrades
    getCalculatedTotal: () => {
        const route = get().selectedRoute;
        const seats = get().selectedSeats;
        const manifest = get().passengerManifest;
        
        if (!route || seats.length === 0) return 0;

        let baseTotal = route.price * seats.length;
        
        // Add luggage upsells (e.g., Heavy Luggage is +5000 UGX)
        const luggageFees = manifest.reduce((acc, passenger) => {
            return passenger.luggage === 'HEAVY' ? acc + 5000 : acc;
        }, 0);

        return baseTotal + luggageFees;
    },

    // ========================================================================
    // 6. ENGINE ACTIONS (The Functions that change the state)
    // ========================================================================

    // Move between funnel steps
    goToStep: (stepNumber) => set({ currentStep: stepNumber }),

    // Update search query from the Hero Search on homepage
    setSearchQuery: (key, value) => set((state) => ({
        searchQuery: { ...state.searchQuery, [key]: value }
    })),

    // Lock in the chosen bus route
    confirmRoute: (routeData) => set({ 
        selectedRoute: routeData,
        currentStep: 2 // Automatically push to detail view
    }),

    // Toggle a seat on the ChassisGrid. Automatically syncs the Passenger Manifest.
    toggleSeat: (seatId) => set((state) => {
        const isSelected = state.selectedSeats.includes(seatId);
        let newSeats;
        let newManifest;

        if (isSelected) {
            // Remove seat and its associated passenger manifest row
            newSeats = state.selectedSeats.filter(id => id !== seatId);
            newManifest = state.passengerManifest.filter(p => p.seatId !== seatId);
        } else {
            // Add seat and create a blank passenger manifest row
            newSeats = [...state.selectedSeats, seatId];
            newManifest = [...state.passengerManifest, {
                seatId: seatId,
                passengerName: '',
                activePhone: '',
                altContact: '',
                luggage: 'STANDARD' // Default to standard (free) luggage
            }];
        }

        return { selectedSeats: newSeats, passengerManifest: newManifest };
    }),

    // Update specific passenger details as they type in the form
    updatePassengerDetails: (seatId, field, value) => set((state) => ({
        passengerManifest: state.passengerManifest.map(passenger => 
            passenger.seatId === seatId 
                ? { ...passenger, [field]: value } 
                : passenger
        )
    })),

    setPaymentMethod: (method) => set({ paymentMethod: method }),

    // The Kill Switch: Wipes the engine clean after successful payment or user cancel
    resetEngine: () => set({
        currentStep: 1,
        selectedRoute: null,
        selectedSeats: [],
        passengerManifest: [],
        paymentMethod: null,
        sessionId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) // Generate new session
    })
}));