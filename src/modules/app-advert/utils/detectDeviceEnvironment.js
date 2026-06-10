// Determines the user's current platform to optimize the CTA layout.
export const detectOS = () => {
  if (typeof window === 'undefined') return 'desktop';
    
      const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            return 'android';
              }
                if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                    return 'ios';
                      }
                        return 'desktop'; // Default for Windows, macOS, Linux, etc.
                        };
                        