"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_USERNAME = "OKI";
const VALID_PASSWORD = "oki2031";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check session storage on mount
        const authStatus = sessionStorage.getItem("isAuthenticated");
        setIsAuthenticated(authStatus === "true");
        setIsLoading(false);
    }, []);

    const login = (username: string, password: string): boolean => {
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem("isAuthenticated", "true");
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("isAuthenticated");
    };

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
