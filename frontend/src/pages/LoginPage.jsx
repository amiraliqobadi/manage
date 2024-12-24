import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await axios.post(
                "http://193.151.140.110:8080/auth/access-token",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            setToken(response.data.access_token);
            navigate("/");
        } catch (error) {
            setError(
                "Login failed. Please check your credentials and try again."
            );
            console.error("Login failed:", error);
        }
    };

    return (
        <section className="grid min-h-screen place-items-center bg-emerald-500 p-16">
            <div className="w-72 rounded-md bg-emerald-300 p-4 pt-0 shadow-lg">
                <header className="flex h-16 items-center justify-between font-bold text-emerald-950">
                    <span>Login</span>
                </header>
                <form className="grid gap-3" onSubmit={handleSubmit}>
                    <input
                        className="h-10 rounded-sm bg-emerald-100/50 px-2 text-emerald-950 placeholder:text-emerald-600/80 focus:outline-none focus:ring focus:ring-emerald-400"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="h-10 rounded-sm bg-emerald-100/50 px-2 text-emerald-950 placeholder:text-emerald-600/80 focus:outline-none focus:ring focus:ring-emerald-400"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <div className="text-red-500">{error}</div>}
                    <button
                        className="flex h-10 items-center justify-between rounded-sm bg-emerald-700 px-2 text-emerald-100 transition-colors duration-300 hover:bg-emerald-800 focus:outline-none focus:ring focus:ring-emerald-400"
                        type="submit"
                    >
                        <span>Sign In</span>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default LoginPage;
