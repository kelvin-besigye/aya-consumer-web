/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Customer Support (Module 3/24)
 * File: src/modules/customer-support/components/DirectMessageForm.jsx
 * * DESCRIPTION:
 * The primary digital intake form. Captures user inquiries and injects 
 * them directly into the Admin OmniInbox as trackable SLA tickets.
 * * WORLD-CLASS ENGINEERING:
 * 1. STATE ISOLATION: Manages complex asynchronous loading, success, 
 * and error states locally without polluting the global router.
 * 2. SPATIAL AWARENESS: Uses floating inline icons within the input 
 * fields to preserve vertical screen real estate on mobile devices.
 * 3. THE TICKET ARTIFACT: Upon success, morphs into a receipt view 
 * giving the user a psychological anchor (the Ticket ID).
 */

import React, { useState } from 'react';
import { 
    Send, User, Mail, MessageSquare, 
    AlertCircle, CheckCircle2, Loader2, Tag 
} from 'lucide-react';

// LIVE WIRE: The Mutation Service built in Phase 1
import { supportMutations } from '../services/support.mutations';

export const DirectMessageForm = () => {
    // ========================================================================
    // 1. STATE MACHINE
    // ========================================================================
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'INQUIRY',
        message: ''
    });

    const [uiState, setUiState] = useState({
        status: 'IDLE', // 'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'
        errorMessage: '',
        ticketId: null
    });

    // ========================================================================
    // 2. KINETIC HANDLERS
    // ========================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors immediately when the user starts correcting them
        if (uiState.status === 'ERROR') {
            setUiState(prev => ({ ...prev, status: 'IDLE', errorMessage: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Strict Validation Gate
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setUiState({ status: 'ERROR', errorMessage: 'Please complete all required fields.', ticketId: null });
            return;
        }

        // Basic Email Regex for client-side sanity check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setUiState({ status: 'ERROR', errorMessage: 'Please enter a valid email address so we can reply.', ticketId: null });
            return;
        }

        // 2. Lock UI & Initiate Network Request
        setUiState({ status: 'SUBMITTING', errorMessage: '', ticketId: null });

        // 3. Fire Thrusters
        const response = await supportMutations.submitDirectMessage(formData);

        if (response.success) {
            setUiState({ status: 'SUCCESS', errorMessage: '', ticketId: response.ticketId });
            // Optional: Clear form data here if you want them to be able to submit another instantly
        } else {
            setUiState({ status: 'ERROR', errorMessage: response.error, ticketId: null });
        }
    };

    // ========================================================================
    // 3. RENDER PAYLOAD: SUCCESS ARTIFACT
    // ========================================================================
    if (uiState.status === 'SUCCESS') {
        return (
            <div className="dmf-chassis is-success fade-in-up">
                <div className="success-icon-vault">
                    <CheckCircle2 size={48} className="text-success" />
                </div>
                <h3>Message Received</h3>
                <p className="success-body">
                    Your request has been securely routed to our dispatch centre. We will respond to <strong>{formData.email}</strong> shortly.
                </p>
                <div className="ticket-receipt">
                    <span className="receipt-label">Reference ID</span>
                    <strong className="receipt-id">#{uiState.ticketId}</strong>
                </div>
                <button 
                    className="ayabus-btn-ghost mt-6"
                    onClick={() => setUiState({ status: 'IDLE', errorMessage: '', ticketId: null })}
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    // ========================================================================
    // 4. RENDER PAYLOAD: INTERACTIVE FORM
    // ========================================================================
    return (
        <form className="dmf-chassis" onSubmit={handleSubmit}>
            
            <div className="dmf-header">
                <h3>Send a Direct Message</h3>
                <p>Trackable support. Requires an email address.</p>
            </div>

            {/* ERROR TOAST */}
            {uiState.status === 'ERROR' && (
                <div className="dmf-error-toast slide-down">
                    <AlertCircle size={16} />
                    <span>{uiState.errorMessage}</span>
                </div>
            )}

            <div className="dmf-grid">
                
                {/* NAME FIELD */}
                <div className="dmf-input-group">
                    <label>Full Name</label>
                    <div className="dmf-input-wrapper">
                        <User size={18} className="dmf-icon" />
                        <input 
                            type="text" 
                            name="name"
                            className="dmf-input" 
                            placeholder="e.g. Kato Paul"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={uiState.status === 'SUBMITTING'}
                        />
                    </div>
                </div>

                {/* EMAIL FIELD */}
                <div className="dmf-input-group">
                    <label>Email Address</label>
                    <div className="dmf-input-wrapper">
                        <Mail size={18} className="dmf-icon" />
                        <input 
                            type="email" 
                            name="email"
                            className="dmf-input" 
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={uiState.status === 'SUBMITTING'}
                        />
                    </div>
                </div>

                {/* CATEGORY FIELD (For Admin Routing) */}
                <div className="dmf-input-group full-width">
                    <label>How can we help?</label>
                    <div className="dmf-input-wrapper">
                        <Tag size={18} className="dmf-icon" />
                        <select 
                            name="category"
                            className="dmf-input dmf-select"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={uiState.status === 'SUBMITTING'}
                        >
                            <option value="INQUIRY">General Inquiry & Booking</option>
                            <option value="LOST_ITEM">Lost & Found Baggage</option>
                            <option value="REFUND">Refunds & Cancellations</option>
                            <option value="COMPLAINT">Feedback & Complaints</option>
                        </select>
                    </div>
                </div>

                {/* MESSAGE FIELD */}
                <div className="dmf-input-group full-width">
                    <label>Message Details</label>
                    <div className="dmf-input-wrapper align-top">
                        <MessageSquare size={18} className="dmf-icon mt-icon" />
                        <textarea 
                            name="message"
                            className="dmf-textarea" 
                            placeholder="Please provide your PNR/Ticket number if applicable..."
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            disabled={uiState.status === 'SUBMITTING'}
                        ></textarea>
                    </div>
                </div>

            </div>

            <div className="dmf-footer">
                <button 
                    type="submit" 
                    className="ayabus-btn dmf-submit-btn"
                    disabled={uiState.status === 'SUBMITTING'}
                >
                    {uiState.status === 'SUBMITTING' ? (
                        <>
                            <Loader2 size={20} className="spin" />
                            <span>Routing to Admin...</span>
                        </>
                    ) : (
                        <>
                            <span>Secure Send</span>
                            <Send size={18} />
                        </>
                    )}
                </button>
            </div>

            {/* ========================================================================
                5. COMPONENT-SCOPED STYLES
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .dmf-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 32px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.03);
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    position: relative;
                    overflow: hidden;
                }

                .dmf-chassis.is-success {
                    align-items: center;
                    text-align: center;
                    justify-content: center;
                    min-height: 400px;
                    padding: 48px 32px;
                }

                /* --- HEADER --- */
                .dmf-header h3 { margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px; }
                .dmf-header p { margin: 0; font-size: 14px; color: var(--text-muted); }

                /* --- GRID PHYSICS --- */
                .dmf-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .dmf-input-group { display: flex; flex-direction: column; gap: 8px; }
                .dmf-input-group.full-width { grid-column: 1 / -1; }
                
                .dmf-input-group label {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* --- NATIVE INPUT RE-SKINNING --- */
                .dmf-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .dmf-input-wrapper.align-top { align-items: flex-start; }

                .dmf-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--brand-primary);
                    pointer-events: none;
                }
                .mt-icon { margin-top: 16px; }

                .dmf-input, .dmf-textarea, .dmf-select {
                    width: 100%;
                    background: var(--bg-body);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 15px;
                    font-weight: 500;
                    transition: all 0.2s var(--ease-main);
                }

                .dmf-input, .dmf-select {
                    height: 52px;
                    padding: 0 16px 0 44px;
                }

                .dmf-textarea {
                    padding: 16px 16px 16px 44px;
                    resize: vertical;
                    min-height: 120px;
                    font-family: inherit;
                }

                .dmf-select {
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
                    background-repeat: no-repeat;
                    background-position: right 16px top 50%;
                    background-size: 10px auto;
                }

                .dmf-input:focus, .dmf-textarea:focus, .dmf-select:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    background: var(--bg-surface);
                    box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .dmf-input:disabled, .dmf-textarea:disabled, .dmf-select:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* --- ACTION MATRIX --- */
                .dmf-footer {
                    margin-top: 8px;
                    border-top: 1px solid var(--border-subtle);
                    padding-top: 24px;
                }

                .dmf-submit-btn {
                    width: 100%;
                    height: 56px;
                    font-size: 16px;
                    gap: 12px;
                    border-radius: var(--radius-md);
                }

                .dmf-error-toast {
                    background: color-mix(in srgb, #EF4444 10%, transparent);
                    color: #EF4444;
                    border: 1px solid color-mix(in srgb, #EF4444 30%, transparent);
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* --- SUCCESS ARTIFACT --- */
                .success-icon-vault {
                    width: 80px; height: 80px;
                    border-radius: 50%;
                    background: color-mix(in srgb, #10B981 10%, transparent);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 24px;
                }
                .text-success { color: #10B981; }
                .success-body { font-size: 15px; color: var(--text-muted); line-height: 1.6; max-width: 400px; margin: 8px auto 24px auto; }
                .success-body strong { color: var(--text-main); }
                
                .ticket-receipt {
                    background: var(--bg-body);
                    border: 1px dashed var(--border-subtle);
                    padding: 16px 32px;
                    border-radius: var(--radius-md);
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .receipt-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; }
                .receipt-id { font-size: 24px; font-weight: 900; color: var(--brand-primary); letter-spacing: 1px; font-family: monospace; }
                .mt-6 { margin-top: 24px; }

                /* --- ANIMATIONS --- */
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

                .fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 640px) {
                    .dmf-chassis { padding: 24px 16px; }
                    .dmf-grid { grid-template-columns: 1fr; }
                    .dmf-header h3 { font-size: 20px; }
                }
            `}</style>
        </form>
    );
};