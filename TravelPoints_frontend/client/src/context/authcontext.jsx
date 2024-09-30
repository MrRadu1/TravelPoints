import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [user, setUser] = useState(localStorage.getItem('user'));

    useEffect(() => {
        const changeToken = () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const user = jwtDecode(token);
                setRole(user.role);
                setUser(user);
                localStorage.setItem('role', user.role);
                localStorage.setItem('token', token);
                localStorage.setItem('user', user);
            } else {
                delete axios.defaults.headers.common['Authorization'];
                setRole(null);
                setUser(null);
                localStorage.removeItem('role');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        };
        changeToken();
    }, [token]); 

    return (
        <AuthContext.Provider value={{ token, setToken, role, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);