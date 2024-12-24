import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./components/header";
import { Toaster } from 'react-hot-toast';
const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const isAuth = Boolean(token);

    return (
        <>
            <Toaster />
            {isAuth && <Header />}

            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage setToken={setToken} />}
                />

                {routes.map(({ path, Component }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <ProtectedRoute
                                component={Component}
                                isAuth={isAuth}
                            />
                        }
                    />
                ))}

                <Route
                    path="*"
                    element={<Navigate to={isAuth ? "/" : "/login"} />}
                />
            </Routes>
        </>
    );
};

export default App;
