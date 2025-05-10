import { useState , createContext, useEffect } from 'react';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        email: "",
        name: ""
    },
    setAuth: () => {},
});

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: "",
            name: ""
        }
    });

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (token && user) {
            setAuth({
                isAuthenticated: true,
                user: user
            });
        }
    }, []);

    return (
      <AuthContext.Provider value={{
        auth, setAuth
      }}>
        {props.children}
      </AuthContext.Provider>
    );
  }