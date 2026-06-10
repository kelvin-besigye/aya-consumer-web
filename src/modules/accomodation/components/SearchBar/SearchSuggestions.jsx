import React, { useMemo } from 'react';

// Expansive, real-world dataset focused on the East African market
const EAST_AFRICAN_CITIES = [
  // Uganda (Prioritized)
    "Kampala, Uganda", "Entebbe, Uganda", "Jinja, Uganda", "Mbarara, Uganda", 
      "Gulu, Uganda", "Mbale, Uganda", "Fort Portal, Uganda", "Kasese, Uganda", 
        "Masaka, Uganda", "Arua, Uganda", "Lira, Uganda", "Kabale, Uganda", 
          "Soroti, Uganda", "Hoima, Uganda", "Mukono, Uganda", "Tororo, Uganda",
            // Kenya
              "Nairobi, Kenya", "Mombasa, Kenya", "Kisumu, Kenya", "Nakuru, Kenya", 
                "Eldoret, Kenya", "Malindi, Kenya", "Naivasha, Kenya",
                  // Tanzania
                    "Dar es Salaam, Tanzania", "Dodoma, Tanzania", "Arusha, Tanzania", 
                      "Mwanza, Tanzania", "Zanzibar City, Tanzania", "Moshi, Tanzania",
                        // Rwanda
                          "Kigali, Rwanda", "Musanze, Rwanda", "Gisenyi, Rwanda", "Butare, Rwanda",
                            // Burundi
                              "Bujumbura, Burundi", "Gitega, Burundi",
                                // South Sudan
                                  "Juba, South Sudan"
                                  ];

                                  const SearchSuggestions = ({ query, onSelect }) => {
                                    // Lightning-fast client-side filtering
                                      const suggestions = useMemo(() => {
                                          if (!query || query.length < 2) return []; // Require at least 2 chars to show list
                                              const lowerQuery = query.toLowerCase();
                                                  return EAST_AFRICAN_CITIES.filter(city => city.toLowerCase().includes(lowerQuery));
                                                    }, [query]);

                                                      if (!query || query.length < 2) return null;

                                                        return (
                                                            <div 
                                                                  className="ayabus-card ayabus-hide-scrollbar" 
                                                                        style={{ 
                                                                                position: 'absolute', 
                                                                                        top: 'calc(100% + 4px)', // Snaps just below the input
                                                                                                left: 0, 
                                                                                                        right: 0, 
                                                                                                                maxHeight: '250px', 
                                                                                                                        overflowY: 'auto', 
                                                                                                                                zIndex: 'var(--z-dropdown)', 
                                                                                                                                        padding: '8px 0',
                                                                                                                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                                                                                                                                                      }}
                                                                                                                                                          >
                                                                                                                                                                {suggestions.length > 0 ? (
                                                                                                                                                                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                                                                                                                                                                  {suggestions.map((city, index) => (
                                                                                                                                                                                              <li 
                                                                                                                                                                                                            key={index}
                                                                                                                                                                                                                          onClick={() => onSelect(city)}
                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                        padding: '12px 16px',
                                                                                                                                                                                                                                                                        cursor: 'pointer',
                                                                                                                                                                                                                                                                                        fontSize: '14px',
                                                                                                                                                                                                                                                                                                        color: 'var(--text-main)',
                                                                                                                                                                                                                                                                                                                        borderBottom: index === suggestions.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                                                                                                                                                                                                                                                                                                                                        transition: 'background-color var(--duration-fast)'
                                                                                                                                                                                                                                                                                                                                                      }}
                                                                                                                                                                                                                                                                                                                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                                                                                                                                                                                                                                                                                                                                                                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                                                                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                                                                                                                            {city}
                                                                                                                                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                                                                                                                                                  ))}
                                                                                                                                                                                                                                                                                                                                                                                                                                          </ul>
                                                                                                                                                                                                                                                                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                                                                                                                                                                                                                                                        // Non-blocking UX: Reassure the user they can still search even if it's not on the list
                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          Press "Search" to look for verified stays in <strong>"{query}"</strong>.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              };

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              export default SearchSuggestions;