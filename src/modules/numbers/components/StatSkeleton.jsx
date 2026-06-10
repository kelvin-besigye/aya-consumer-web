import React from 'react';

const StatSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
      <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--border-subtle)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ width: '80px', height: '36px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ width: '100px', height: '14px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }}></div>
                </div>
                );

                export default StatSkeleton;
                