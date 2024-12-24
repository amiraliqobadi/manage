import { Link, useLocation } from "react-router-dom";
import Button from "./button";
import axios from "axios";
import { useState } from "react";

export default function Header() {
    const [mobile, setMobile] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8080/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            localStorage.removeItem("token");
            window.location.reload();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="flex justify-between">
            <div className="hidden lg:flex"></div>
            {/* Burger menu for mobile */}
            <div onClick={() => setMobile(true)} className="lg:hidden">
                <button className="navbar-burger flex items-center text-blue-600 p-3">
                    <svg
                        className="block h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Mobile menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                    </svg>
                </button>
            </div>
            {/* Desktop navigation */}
            <nav className="hidden lg:flex justify-center align-middle gap-10 bg-slate-300 w-fit rounded-full p-2 m-5">
                <div className="cursor-pointer flex justify-start align-middle gap-3 font-light">
                    <div className="flex pl-2 pr-2 gap-1 cursor-pointer">
                        <div
                            className={`flex gap-1 pr-2 pl-2 rounded-full ${
                                location.pathname === "/fryto"
                                    ? "text-blue-400"
                                    : "text-red-400"
                            }`}
                        >
                            <Link
                                className="rounded-full ps-2 pe-2"
                                to="/fryto"
                            >
                                Fryto
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-1 pr-2 pl-2 rounded-full">
                        <div
                            className={`flex gap-1 pr-2 pl-2 rounded-full ${
                                location.pathname === "/fryto/peyvandi"
                                    ? "text-blue-400"
                                    : "text-red-400"
                            }`}
                        >
                            <Link
                                className="rounded-full ps-2 pe-2"
                                to="/fryto/peyvandi"
                            >
                                Fryto 2
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-1 pr-2 pl-2 rounded-full">
                        <div
                            className={`flex gap-1 pr-2 pl-2 rounded-full ${
                                location.pathname === "/installments"
                                    ? "text-blue-400"
                                    : "text-red-400"
                            }`}
                        >
                            <Link
                                className="rounded-full ps-2 pe-2"
                                to="/installments"
                            >
                                installments
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-1 pr-2 pl-2 rounded-full">
                        <div
                            className={`flex gap-1 pr-2 pl-2 rounded-full ${
                                location.pathname === "/CheckManager"
                                    ? "text-blue-400"
                                    : "text-red-400"
                            }`}
                        >
                            <Link
                                className="rounded-full ps-2 pe-2"
                                to="/CheckManager"
                            >
                                CheckManager
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-1 pr-2 pl-2 rounded-full">
                        <div
                            className={`flex gap-1 pr-2 pl-2 rounded-full ${
                                location.pathname === "/DayIncome"
                                    ? "text-blue-400"
                                    : "text-red-400"
                            }`}
                        >
                            <Link
                                className="rounded-full ps-2 pe-2"
                                to="/DayIncome"
                            >
                                DayIncome
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-1 pr-2 pl-2 rounded-full">
                        <div
                            className={`flex gap-1 pr-2 pl-2 rounded-full ${
                                location.pathname === "/rostak"
                                    ? "text-blue-400"
                                    : "text-red-400"
                            }`}
                        >
                            <Link
                                className="rounded-full ps-2 pe-2"
                                to="/rostak"
                            >
                                Rostak
                            </Link>
                        </div>
                    </div>
                    <div
                        className={`flex gap-1 pr-2 pl-2 rounded-full ${
                            location.pathname === "/"
                                ? "text-blue-400"
                                : "text-red-400"
                        }`}
                    >
                        <Link className="rounded-full ps-2 pe-2" to="/">
                            Home
                        </Link>
                    </div>
                    <div
                        className={`flex gap-1 pr-2 pl-2 rounded-full ${
                            location.pathname === "/CashFlowForm"
                                ? "text-blue-400"
                                : "text-red-400"
                        }`}
                    >
                        <Link
                            className="rounded-full ps-2 pe-2"
                            to="/CashFlowForm"
                        >
                            Cash Flow
                        </Link>
                    </div>
                </div>
            </nav>
            <div onClick={handleLogout} className="py-3 px-1">
                <Button name="Log out" />
            </div>

            {/* Mobile menu */}
            {mobile && (
                <div className="navbar-menu z-50">
                    <div
                        className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"
                        onClick={() => setMobile(false)}
                    ></div>
                    <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto bg-gray-400 rounded-b-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 z-50">
                        <ul>
                            <li className="mb-1">
                                <Link
                                    className="block p-4 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    to="/fryto"
                                    onClick={() => setMobile(false)}
                                >
                                    Fryto
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link
                                    className="block p-4 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    to="/DayIncome"
                                    onClick={() => setMobile(false)}
                                >
                                    Day Income
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link
                                    className="block p-4 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    to="/CashFlowForm"
                                    onClick={() => setMobile(false)}
                                >
                                    Cash Flow
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link
                                    className="block p-4 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    to="/installments"
                                    onClick={() => setMobile(false)}
                                >
                                    installments
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link
                                    className="block p-4 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    to="/CheckManager"
                                    onClick={() => setMobile(false)}
                                >
                                    checks
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link
                                    className="block p-4 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    to="/fryto/peyvandi"
                                    onClick={() => setMobile(false)}
                                >
                                    Fryto 2
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link
                                    className="block p-4 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    to="/rostak"
                                    onClick={() => setMobile(false)}
                                >
                                    Rostak
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link
                                    className="block p-4 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                                    to="/"
                                    onClick={() => setMobile(false)}
                                >
                                    Home
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}
