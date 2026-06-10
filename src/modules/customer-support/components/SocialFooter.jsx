/**
 * 🌍 AYABUS CONSUMER WEB: SocialFooter
 * Optimized for robustness against dependency resolution errors.
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { SUPPORT_TELEMETRY } from '../data/support.constants';

// ========================================================================
// 1. ROBUST ICON RESOLVER ENGINE
// Uses a safe lookup against the Lucide namespace to prevent crashes 
// when specific icon exports are missing.
// ========================================================================
const resolveIcon = (iconName) => {
    // List of reliable icons in your current version
    const iconMap = {
        'Twitter': LucideIcons.Twitter,
        'Facebook': LucideIcons.Facebook,
        'Instagram': LucideIcons.Instagram,
        'Video': LucideIcons.Video,
    };

    const SelectedIcon = iconMap[iconName] || LucideIcons.ExternalLink;
    return SelectedIcon;
};

export const SocialFooter = () => {
    const socials = SUPPORT_TELEMETRY?.socials || [];

    if (!socials.length) return null;

    return (
        <section className="sf-chassis">
            <div className="sf-header">
                <h3>Connect With Us</h3>
                <p>Follow our official channels for updates and rapid community support.</p>
            </div>

            <div className="sf-grid">
                {socials.map((network, index) => {
                    const IconComponent = resolveIcon(network.icon);

                    return (
                        <a 
                            key={index}
                            href={network.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sf-card"
                            aria-label={`Follow us on ${network.platform}`}
                        >
                            <div className="sf-icon-vault">
                                <IconComponent size={24} strokeWidth={1.5} />
                            </div>
                            <div className="sf-meta">
                                <span className="platform-name">{network.platform}</span>
                                <span className="platform-handle">{network.handle}</span>
                            </div>
                            <div className="sf-outbound-indicator">
                                <LucideIcons.ExternalLink size={14} />
                            </div>
                        </a>
                    );
                })}
            </div>

            <style>{`
                .sf-chassis { width: 100%; padding-top: 24px; border-top: 1px dashed var(--border-subtle); display: flex; flex-direction: column; gap: 24px; }
                .sf-header h3 { margin: 0 0 4px 0; font-size: 18px; font-weight: 800; color: var(--text-main); }
                .sf-header p { margin: 0; font-size: 14px; color: var(--text-muted); }
                .sf-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
                .sf-card { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); text-decoration: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
                .sf-card:hover { border-color: var(--brand-primary); background: var(--bg-body); transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.04); }
                .sf-icon-vault { width: 48px; height: 48px; border-radius: 50%; background: var(--bg-body); color: var(--text-main); display: flex; align-items: center; justify-content: center; }
                .sf-card:hover .sf-icon-vault { background: var(--brand-primary); color: #FFFFFF; }
                .sf-meta { display: flex; flex-direction: column; gap: 2px; flex: 1; }
                .platform-name { font-size: 15px; font-weight: 800; color: var(--text-main); }
                .platform-handle { font-size: 13px; font-weight: 600; color: var(--text-muted); }
                .sf-outbound-indicator { opacity: 0.3; transition: all 0.3s ease; }
                .sf-card:hover .sf-outbound-indicator { opacity: 1; transform: translateX(2px) translateY(-2px); }
            `}</style>
        </section>
    );
};