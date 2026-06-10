/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Partner Support (Module 4/24)
 * File: src/modules/partner-support/components/PartnershipForm.jsx
 * * DESCRIPTION:
 * The B2B intake engine. Captures structural partnership proposals 
 * and routes them directly to executive management via the mutations layer.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. CONDITIONAL MORPHING: The 'Custom Category' input uses a CSS-driven 
 * slide-down animation to reveal itself only when necessary, keeping the 
 * cognitive load low for standard bus/hotel operators.
 * 2. ENTERPRISE VALIDATION: Employs strict client-side validation to 
 * ensure management only receives actionable, fully-fleshed out proposals.
 * 3. STATE ISOLATION: The form manages its own async network states 
 * without relying on heavy global state managers.
 */

import React, { useState } from 'react';
import { 
    Building2, User, Mail, Phone, Briefcase, 
    Settings2, FileText, Send, CheckCircle2, 
    AlertCircle, Loader2 
} from 'lucide-react';

// LIVE WIRES: The Constants and Mutations we built in Phase 1
import { PARTNERSHIP_CATEGORIES } from '../data/partner.constants';
import { partnerMutations } from '../services/partner.mutations';

export const PartnershipForm = () => {
    // ========================================================================
    // 1. STATE MACHINE
    // ========================================================================
    const [formData, setFormData] = useState({
        organization: '',
        contactName: '',
        email: '',
        phone: '',
        category: '',
        customCategory: '',
        details: ''
    });

    const [uiState, setUiState] = useState({
        status: 'IDLE', // 'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'
        errorMessage: '',
        referenceId: null
    });

    // ========================================================================
    // 2. KINETIC HANDLERS
    // ========================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Auto-clear errors when the user begins to correct their inputs
        if (uiState.status === 'ERROR') {
            setUiState(prev => ({ ...prev, status: 'IDLE', errorMessage: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- 1. Strict Validation Gates ---
        if (!formData.organization.trim() || !formData.contactName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.category) {
            setUiState({ status: 'ERROR', errorMessage: 'Please complete all required fields to submit your proposal.', referenceId: null });
            return;
        }

        if (formData.category === 'OTHER' && !formData.customCategory.trim()) {
            setUiState({ status: 'ERROR', errorMessage: 'Please specify the type of partnership you are proposing.', referenceId: null });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setUiState({ status: 'ERROR', errorMessage: 'Please enter a valid corporate email address.', referenceId: null });
            return;
        }

        // --- 2. Lock UI & Ignite Thrusters ---
        setUiState({ status: 'SUBMITTING', errorMessage: '', referenceId: null });

        // --- 3. Execute Network Request ---
        const response = await partnerMutations.submitProposal(formData);

        if (response.success) {
            setUiState({ status: 'SUCCESS', errorMessage: '', referenceId: response.referenceId });
            // Note: We retain formData in memory so if they click "Submit Another", they don't have to re-type everything.
        } else {
            setUiState({ status: 'ERROR', errorMessage: response.error, referenceId: null });
        }
    };

    // ========================================================================
    // 3. RENDER PAYLOAD: SUCCESS ARTIFACT (The Executive Receipt)
    // ========================================================================
    if (uiState.status === 'SUCCESS') {
        return (
            <div className="pf-chassis is-success fade-in-up">
                <div className="pf-success-icon-vault">
                    <CheckCircle2 size={48} className="text-brand" />
                </div>
                <h3 className="pf-success-title">Proposal Successfully Submitted</h3>
                <p className="pf-success-body">
                    Thank you, <strong>{formData.contactName}</strong>. Your strategic partnership proposal for <strong>{formData.organization}</strong> has been securely routed to the AyaBus Executive Management Team. We will review your details and respond to <strong>{formData.email}</strong> shortly.
                </p>
                <div className="pf-receipt-vault">
                    <span className="receipt-label">Official Reference Tracking ID</span>
                    <strong className="receipt-id">B2B-{uiState.referenceId?.slice(0, 8).toUpperCase() || 'PNDG-88'}</strong>
                </div>
                <button 
                    className="ayabus-btn-ghost mt-8"
                    onClick={() => {
                        setUiState({ status: 'IDLE', errorMessage: '', referenceId: null });
                        setFormData(prev => ({ ...prev, details: '', customCategory: '' })); // Clear the specific proposal but keep contact info
                    }}
                >
                    Submit Another Proposal
                </button>
            </div>
        );
    }

    // ========================================================================
    // 4. RENDER PAYLOAD: CORPORATE INTAKE FORM
    // ========================================================================
    return (
        <form className="pf-chassis" onSubmit={handleSubmit}>
            
            <div className="pf-header">
                <h3>Submit a Partnership Proposal</h3>
                <p>Complete the secure form below to initiate dialogue with our strategic team.</p>
            </div>

            {/* ERROR TELEMETRY */}
            {uiState.status === 'ERROR' && (
                <div className="pf-error-bar slide-down">
                    <AlertCircle size={18} />
                    <span>{uiState.errorMessage}</span>
                </div>
            )}

            <div className="pf-grid">
                
                {/* ORGANIZATION NAME */}
                <div className="pf-input-cell">
                    <label>Organization / Company Name <span className="req">*</span></label>
                    <div className="pf-input-wrapper">
                        <Building2 size={18} className="pf-icon" />
                        <input 
                            type="text" 
                            name="organization"
                            className="pf-input" 
                            placeholder="e.g. Skyline Transit Ltd."
                            value={formData.organization}
                            onChange={handleChange}
                            disabled={uiState.status === 'SUBMITTING'}
                        />
                    </div>
                </div>

                {/* CONTACT PERSON */}
                <div className="pf-input-cell">
                    <label>Primary Contact Person <span className="req">*</span></label>
                    <div className="pf-input-wrapper">
                        <User size={18} className="pf-icon" />
                        <input 
                            type="text" 
                            name="contactName"
                            className="pf-input" 
                            placeholder="e.g. Sarah Kuteesa"
                            value={formData.contactName}
                            onChange={handleChange}
                            disabled={uiState.status === 'SUBMITTING'}
                        />
                    </div>
                </div>

                {/* EMAIL ADDRESS */}
                <div className="pf-input-cell">
                    <label>Corporate Email <span className="req">*</span></label>
                    <div className="pf-input-wrapper">
                        <Mail size={18} className="pf-icon" />
                        <input 
                            type="email" 
                            name="email"
                            className="pf-input" 
                            placeholder="director@skylinetransit.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={uiState.status === 'SUBMITTING'}
                        />
                    </div>
                </div>

                {/* PHONE NUMBER */}
                <div className="pf-input-cell">
                    <label>Direct Phone Number <span className="req">*</span></label>
                    <div className="pf-input-wrapper">
                        <Phone size={18} className="pf-icon" />
                        <input 
                            type="tel" 
                            name="phone"
                            className="pf-input" 
                            placeholder="+256 700 000 000"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={uiState.status === 'SUBMITTING'}
                        />
                    </div>
                </div>

                {/* CATEGORY SELECTOR */}
                <div className="pf-input-cell full-width">
                    <label>Partnership Category <span className="req">*</span></label>
                    <div className="pf-input-wrapper">
                        <Briefcase size={18} className="pf-icon" />
                        <select 
                            name="category"
                            className="pf-input pf-select"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={uiState.status === 'SUBMITTING'}
                        >
                            <option value="" disabled>Select your core industry...</option>
                            {PARTNERSHIP_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* CONDITIONAL: CUSTOM CATEGORY (The Morphing Node) */}
                {formData.category === 'OTHER' && (
                    <div className="pf-input-cell full-width expand-down">
                        <label>Please specify your industry/proposal type <span className="req">*</span></label>
                        <div className="pf-input-wrapper">
                            <Settings2 size={18} className="pf-icon" />
                            <input 
                                type="text" 
                                name="customCategory"
                                className="pf-input pf-highlight-input" 
                                placeholder="e.g. Digital Payment Gateway Integration"
                                value={formData.customCategory}
                                onChange={handleChange}
                                disabled={uiState.status === 'SUBMITTING'}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {/* PROPOSAL DETAILS */}
                <div className="pf-input-cell full-width">
                    <label>Executive Summary / Proposal Details</label>
                    <div className="pf-input-wrapper align-top">
                        <FileText size={18} className="pf-icon mt-icon" />
                        <textarea 
                            name="details"
                            className="pf-textarea" 
                            placeholder="Provide a brief overview of your fleet size, technological capabilities, or the specific value proposition of partnering with AyaBus..."
                            value={formData.details}
                            onChange={handleChange}
                            rows={5}
                            disabled={uiState.status === 'SUBMITTING'}
                        ></textarea>
                    </div>
                </div>

            </div>

            <div className="pf-footer">
                <button 
                    type="submit" 
                    className="ayabus-btn pf-submit-btn"
                    disabled={uiState.status === 'SUBMITTING'}
                >
                    {uiState.status === 'SUBMITTING' ? (
                        <>
                            <Loader2 size={20} className="spin" />
                            <span>Encrypting & Routing to Management...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Formal Proposal</span>
                            <Send size={18} />
                        </>
                    )}
                </button>
            </div>

            {/* ========================================================================
                5. COMPONENT-SCOPED STYLES (African Physics)
            ======================================================================== */}
            <style>{`
                .pf-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 40px;
                    box-shadow: 0 12px 48px rgba(0,0,0,0.04);
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                    width: 100%;
                }

                .pf-chassis.is-success {
                    align-items: center;
                    text-align: center;
                    justify-content: center;
                    min-height: 500px;
                    padding: 64px 40px;
                }

                /* --- HEADER --- */
                .pf-header h3 { 
                    margin: 0 0 8px 0; 
                    font-size: 24px; 
                    font-weight: 800; 
                    color: var(--text-main); 
                    letter-spacing: -0.5px; 
                }
                .pf-header p { 
                    margin: 0; 
                    font-size: 15px; 
                    color: var(--text-muted); 
                }

                /* --- GRID PHYSICS --- */
                .pf-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .pf-input-cell { display: flex; flex-direction: column; gap: 8px; }
                .pf-input-cell.full-width { grid-column: 1 / -1; }
                
                .pf-input-cell label {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .req { color: #EF4444; margin-left: 2px; }

                /* --- NATIVE INPUT RE-SKINNING --- */
                .pf-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .pf-input-wrapper.align-top { align-items: flex-start; }

                .pf-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--brand-primary);
                    pointer-events: none;
                }
                .mt-icon { margin-top: 18px; }

                .pf-input, .pf-textarea, .pf-select {
                    width: 100%;
                    background: var(--bg-body);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 16px; /* 16px prevents iOS auto-zoom, crucial for enterprise forms */
                    font-weight: 500;
                    transition: all 0.2s var(--ease-main);
                }

                .pf-input, .pf-select {
                    height: 56px; /* Slightly taller than consumer forms for fat-finger safety */
                    padding: 0 16px 0 48px;
                }

                .pf-textarea {
                    padding: 18px 16px 18px 48px;
                    resize: vertical;
                    min-height: 140px;
                    font-family: inherit;
                    line-height: 1.5;
                }

                .pf-select {
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
                    background-repeat: no-repeat;
                    background-position: right 16px top 50%;
                    background-size: 12px auto;
                }

                .pf-input:focus, .pf-textarea:focus, .pf-select:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    background: var(--bg-surface);
                    box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .pf-highlight-input {
                    background: color-mix(in srgb, var(--brand-primary) 5%, var(--bg-surface));
                    border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--border-subtle));
                }

                .pf-input:disabled, .pf-textarea:disabled, .pf-select:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* --- ACTION MATRIX --- */
                .pf-footer {
                    margin-top: 8px;
                    border-top: 1px solid var(--border-subtle);
                    padding-top: 32px;
                }

                .pf-submit-btn {
                    width: 100%;
                    height: 60px;
                    font-size: 16px;
                    letter-spacing: 0.5px;
                    gap: 12px;
                    border-radius: var(--radius-md);
                }

                .pf-error-bar {
                    background: color-mix(in srgb, #EF4444 10%, var(--bg-surface));
                    color: #EF4444;
                    border: 1px solid color-mix(in srgb, #EF4444 40%, transparent);
                    padding: 16px;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                /* --- SUCCESS ARTIFACT --- */
                .pf-success-icon-vault {
                    width: 96px; height: 96px;
                    border-radius: 50%;
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 24px;
                }
                .text-brand { color: var(--brand-primary); }
                .pf-success-title { font-size: 28px; font-weight: 900; color: var(--text-main); margin: 0 0 16px 0; }
                .pf-success-body { font-size: 16px; color: var(--text-muted); line-height: 1.6; max-width: 500px; margin: 0 auto 32px auto; }
                .pf-success-body strong { color: var(--text-main); }
                
                .pf-receipt-vault {
                    background: var(--bg-body);
                    border: 2px dashed var(--border-subtle);
                    padding: 24px 48px;
                    border-radius: var(--radius-md);
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .receipt-label { font-size: 12px; text-transform: uppercase; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; }
                .receipt-id { font-size: 32px; font-weight: 900; color: var(--text-main); letter-spacing: 2px; font-family: monospace; }
                .mt-8 { margin-top: 32px; }

                /* --- ANIMATIONS --- */
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

                .expand-down { animation: expandDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; overflow: hidden; }
                @keyframes expandDown { 
                    from { opacity: 0; max-height: 0; transform: translateY(-10px); } 
                    to { opacity: 1; max-height: 100px; transform: translateY(0); } 
                }

                .fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 768px) {
                    .pf-chassis { padding: 32px 24px; }
                    .pf-grid { grid-template-columns: 1fr; gap: 20px; }
                    .pf-header h3 { font-size: 22px; }
                }

                @media (max-width: 480px) {
                    .pf-chassis { padding: 24px 16px; border-radius: 0; border-left: none; border-right: none; }
                    .pf-success-title { font-size: 24px; }
                    .pf-receipt-vault { padding: 16px 24px; }
                    .receipt-id { font-size: 24px; }
                }
            `}</style>
        </form>
    );
};