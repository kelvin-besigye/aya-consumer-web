import { useState, useEffect, useRef } from 'react';

export const useCountUp = (endValue, duration = 2000) => {
  const [count, setCount] = useState(0);
    const elementRef = useRef(null);
      const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                  ([entry]) => {
                          if (entry.isIntersecting) {
                                    setIsVisible(true);
                                              observer.disconnect(); // Only animate once
                                                      }
                                                            },
                                                                  { threshold: 0.5 } // Trigger when 50% of the element is visible
                                                                      );

                                                                          if (elementRef.current) observer.observe(elementRef.current);
                                                                              return () => observer.disconnect();
                                                                                }, []);

                                                                                  useEffect(() => {
                                                                                      if (!isVisible || endValue === 0) return;

                                                                                          let startTime = null;
                                                                                              const animate = (currentTime) => {
                                                                                                    if (!startTime) startTime = currentTime;
                                                                                                          const progress = Math.min((currentTime - startTime) / duration, 1);
                                                                                                                
                                                                                                                      // Ease-out cubic formula for a natural slowing down effect at the end
                                                                                                                            const easeOut = 1 - Math.pow(1 - progress, 3);
                                                                                                                                  
                                                                                                                                        setCount(Math.floor(easeOut * endValue));

                                                                                                                                              if (progress < 1) {
                                                                                                                                                      requestAnimationFrame(animate);
                                                                                                                                                            } else {
                                                                                                                                                                    setCount(endValue);
                                                                                                                                                                          }
                                                                                                                                                                              };

                                                                                                                                                                                  requestAnimationFrame(animate);
                                                                                                                                                                                    }, [isVisible, endValue, duration]);

                                                                                                                                                                                      return { count, elementRef };
                                                                                                                                                                                      };
                                                                                                                                                                                      