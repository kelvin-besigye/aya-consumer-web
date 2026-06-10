/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Settings (Module 11/24)
 * File: src/modules/settings/utils/theme.manager.js
 * * DESCRIPTION:
 * The pure-JavaScript visual physics engine. It intercepts the device's 
 * native OS theme preferences (iOS/Android/Windows) and applies them instantly 
 * to the DOM before React even finishes booting.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-FLICKER BOOT: Operates entirely outside the React render cycle. 
 * Manipulates `document.documentElement` directly for 0ms latency.
 * 2. OS-LEVEL TELEMETRY: Uses `window.matchMedia` to listen for hardware-level 
 * theme shifts (e.g., when the user's iPhone automatically goes dark at sunset).
 * 3. PUBLISH/SUBSCRIBE PATTERN: Allows React components to securely hook into 
 * theme changes without causing global context re-renders.
 */

// ========================================================================
// 1. CONSTANTS & DOMAINS
// ========================================================================
const THEME_STORAGE_KEY = 'ayabus_theme_preference';
const DOM_ATTRIBUTE = 'data-theme';

export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
};

// ========================================================================
// 2. THE SINGLETON STATE ENGINE
// ========================================================================
class ThemeManagerEngine {
    constructor() {
        this.currentPreference = THEMES.SYSTEM;
        this.activeTheme = THEMES.LIGHT;
        this.subscribers = new Set();
        
        // Bind the OS listener context to the class
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
    }

    // ========================================================================
    // 3. CORE PHYSICS
    // ========================================================================
    
    /**
     * Boot sequence. Call this ONCE in main.jsx before React.createRoot
     */
    init() {
        // 1. Retrieve saved preference or default to SYSTEM
        this.currentPreference = localStorage.getItem(THEME_STORAGE_KEY) || THEMES.SYSTEM;
        
        // 2. Calculate actual physical theme (Light/Dark)
        this.activeTheme = this._calculatePhysicalTheme(this.currentPreference);
        
        // 3. Inject into the HTML DOM immediately for index.css to catch
        this._injectTheme(this.activeTheme);
        
        // 4. Attach OS-level hardware listeners
        this._attachHardwareListener();
    }

    /**
     * The Public Mutator. Called when the user taps a button in the Settings UI.
     */
    setTheme(preference) {
        if (!Object.values(THEMES).includes(preference)) return;

        // Save the logic preference (Light/Dark/System)
        this.currentPreference = preference;
        localStorage.setItem(THEME_STORAGE_KEY, preference);

        // Calculate the physical manifestation
        const newPhysicalTheme = this._calculatePhysicalTheme(preference);
        this.activeTheme = newPhysicalTheme;

        // Apply to CSS
        this._injectTheme(newPhysicalTheme);

        // Broadcast to any React components that need to know (like a toggle switch UI)
        this._notifySubscribers();
    }

    // ========================================================================
    // 4. THE HARDWARE INTERCEPTORS (Private Subroutines)
    // ========================================================================

    /**
     * Determines whether the screen should physically emit Light or Dark pixels.
     */
    _calculatePhysicalTheme(preference) {
        if (preference === THEMES.SYSTEM) {
            // Read directly from the OS GPU/Display settings
            const isOSDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return isOSDark ? THEMES.DARK : THEMES.LIGHT;
        }
        // If hardcoded to Light or Dark, respect the user's explicit command
        return preference;
    }

    /**
     * The raw DOM injector. Zero React latency.
     */
    _injectTheme(themeToApply) {
        const root = document.documentElement;
        
        // Failsafe: Remove existing to prevent artifacting
        root.classList.remove(THEMES.LIGHT, THEMES.DARK);
        root.removeAttribute(DOM_ATTRIBUTE);
        
        // Apply strictly to the index.css spec
        root.setAttribute(DOM_ATTRIBUTE, themeToApply);
        root.classList.add(themeToApply); // Added as class fallback for older browsers
        
        // Update the Android status bar / Safari iOS notch color dynamically
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content', 
                themeToApply === THEMES.DARK ? '#121212' : '#FFFFFF' // Matches standard index.css body backgrounds
            );
        }
    }

    /**
     * Listens for the exact moment the phone switches to dark mode natively.
     */
    _attachHardwareListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Modern API mapping with fallback for older iOS devices
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', this.handleSystemThemeChange);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(this.handleSystemThemeChange);
            }
        }
    }

    /**
     * Fires when the OS changes theme. Only updates UI if the user is in 'System' mode.
     */
    handleSystemThemeChange(event) {
        if (this.currentPreference === THEMES.SYSTEM) {
            const newOSTheme = event.matches ? THEMES.DARK : THEMES.LIGHT;
            this.activeTheme = newOSTheme;
            this._injectTheme(newOSTheme);
            this._notifySubscribers();
        }
    }

    // ========================================================================
    // 5. REACT BRIDGE (Pub/Sub)
    // ========================================================================
    
    subscribe(callback) {
        this.subscribers.add(callback);
        // Return unsubscribe function to prevent memory leaks in React useEffect
        return () => this.subscribers.delete(callback);
    }

    _notifySubscribers() {
        this.subscribers.forEach(callback => callback({
            preference: this.currentPreference,
            activeTheme: this.activeTheme
        }));
    }

    // Utility getters for components
    getPreference() { return this.currentPreference; }
    getActiveTheme() { return this.activeTheme; }
}

// Export as a persistent Singleton
export const themeManager = new ThemeManagerEngine();