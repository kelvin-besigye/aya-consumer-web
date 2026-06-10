/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Identity & Authentication (Module 5/24)
 * File: src/context/AuthContext.jsx
 * * DESCRIPTION:
 * The global identity state manager. It securely interfaces with Supabase 
 * Auth to determine if a user is present, and fetches their telemetry.
 * * MODULE 6 UPGRADES (Account Dashboard Ready):
 * 1. OMNI-LISTENER: Now listens for 'USER_UPDATED' to instantly reflect 
 * verified email/phone changes across the entire app without page reloads.
 * 2. TELEMETRY EXPANSION: Now fetches `emergency_contact_name` and 
 * `emergency_contact_phone` to pre-fill the Account Dashboard.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import { Loader2 } from 'lucide-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // STATE MACHINE
    const [isBooting, setIsBooting] = useState(true); 
    const [user, setUser] = useState(null);
    const [passengerProfile, setPassengerProfile] = useState(null);

    // THE ENGINE: INITIALIZATION & LISTENER
    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (session?.user) {
                    if (mounted) setUser(session.user);
                    await fetchExtendedProfile(session.user.id, mounted);
                }
            } catch (err) {
                console.error('[AyaBus Auth] Boot Sequence Failed:', err.message);
            } finally {
                if (mounted) setIsBooting(false);
            }
        };

        initializeAuth();

        // UPGRADE 1: Added 'USER_UPDATED' to catch verified credential swaps
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                    if (mounted) setUser(session?.user || null);
                    if (session?.user) await fetchExtendedProfile(session.user.id, mounted);
                } else if (event === 'SIGNED_OUT') {
                    if (mounted) {
                        setUser(null);
                        setPassengerProfile(null);
                    }
                }
            }
        );

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    // UPGRADE 2: Expanded the select() query for Emergency Contacts & Phone
    const fetchExtendedProfile = async (userId, mounted) => {
        try {
            const { data, error } = await supabase
                .from('passengers')
                .select(`
                    id, 
                    first_name, 
                    last_name, 
                    phone,
                    emergency_contact_name, 
                    emergency_contact_phone, 
                    aya_miles_balance, 
                    wallet_balance, 
                    preferred_currency
                `)
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { 
                console.error('[AyaBus Auth] Profile Telemetry Error:', error.message);
                return;
            }

            if (mounted && data) {
                setPassengerProfile(data);
            }
        } catch (err) {
            console.error('[AyaBus Auth] Critical Telemetry Failure:', err);
        }
    };

    // EXPOSED METHODS
    const value = {
        user,                 
        passengerProfile,     
        isBooting,            
        isAuthenticated: !!user,
        refreshProfile: async () => {
            if (user?.id) await fetchExtendedProfile(user.id, true);
        }
    };

    // RENDER PAYLOAD (CSS-only loader to prevent flicker)
    if (isBooting) {
        return (
            <div className="auth-boot-chassis">
                <Loader2 size={40} className="auth-spin text-brand" />
                <style>{`
                    .auth-boot-chassis {
                        width: 100vw; height: 100vh; display: flex;
                        align-items: center; justify-content: center;
                        background: var(--bg-body);
                    }
                    .text-brand { color: var(--brand-primary); }
                    .auth-spin { animation: spin 1s linear infinite; }
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};