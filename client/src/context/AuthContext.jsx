import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API_BASE = 'http://localhost:4001/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedToken);
        }
        setLoading(false);
    }, []);

    // Save auth state to localStorage
    const saveAuthState = useCallback((userData, token, refreshToken) => {
        if (userData && token) {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            setUser(userData);
            setAccessToken(token);
        }
    }, []);

    // Clear auth state
    const clearAuthState = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setAccessToken(null);
    }, []);

    // Signup function
    const signup = useCallback(async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            saveAuthState(data.user, data.accessToken, data.refreshToken);
            return { success: true, user: data.user };
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [saveAuthState]);

    // Login function
    const login = useCallback(async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            saveAuthState(data.user, data.accessToken, data.refreshToken);
            return { success: true, user: data.user };
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [saveAuthState]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await fetch(`${API_BASE}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });
            }
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            clearAuthState();
        }
    }, [clearAuthState]);

    // Refresh token function
    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            clearAuthState();
            return false;
        }

        try {
            const response = await fetch(`${API_BASE}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            saveAuthState(data.user, data.accessToken, data.refreshToken);
            return true;
        } catch (err) {
            console.error('Refresh token error:', err);
            clearAuthState();
            return false;
        }
    }, [saveAuthState, clearAuthState]);

    const value = {
        user,
        accessToken,
        loading,
        error,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
        refreshAccessToken,
        clearError: () => setError(null),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
