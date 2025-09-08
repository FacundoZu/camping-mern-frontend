import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Global } from "../helpers/Global";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = async () => {
        try {
            const request = await fetch(Global.url + 'user/profile', {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (request.status === 400) {
                setAuth(null);
                return;
            }

            const data = await request.json()

            if (data.status == 'success') {
                setAuth(data.user);
            }
        } catch (error) {
            console.error("Error al autenticar al usuario: ", error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
