import React, { useState, useEffect } from "react";
import axios from "axios";

const CheckManager = () => {
    const [checks, setChecks] = useState([]);
    const [amount, setAmount] = useState("");
    const [checkNumber, setCheckNumber] = useState("");
    const [bank, setBank] = useState("");
    const [date, setDate] = useState(""); // Add state for date

    useEffect(() => {
        fetchChecks();
    }, []);

    const fetchChecks = async () => {
        const response = await axios.get("http://localhost:8080/checks/");
        setChecks(response.data);
    };

    const createCheck = async (e) => {
        e.preventDefault();
        const newCheck = {
            amount: parseInt(amount),
            check_number: parseInt(checkNumber),
            bank,
            date, // Include the date in the newCheck object
        };
        console.log(newCheck);
        try {
            await axios.post("http://193.151.140.110:8080/checks/", newCheck);
            setAmount("");
            setCheckNumber("");
            setBank("");
            setDate(""); // Reset the date input
            fetchChecks();
        } catch (error) {
            console.error("Error creating check:", error.response.data);
        }
    };

    const deleteCheck = async (id) => {
        try {
            const response = await axios.delete(
                `http://193.151.140.110:8080/checks/${id}`
            );
            console.log("Deleted check:", response.data);
            fetchChecks();
        } catch (error) {
            console.error("Error deleting check:", error.response.data);
        }
    };

    return (
        <>
            <div className=" rounded-md bg-slate-600 flex justify-center flex-col items-center gap-5 w-full p-5">
                <h1 className="text-white">Check Manager</h1>
                <form
                    className="flex justify-center flex-col items-center gap-5 rounded-md"
                    onSubmit={createCheck}
                >
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Check Number"
                        value={checkNumber}
                        onChange={(e) => setCheckNumber(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Bank"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        required
                    />
                    <input
                        type="date" // Add a date input
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button type="submit" className="text-green-600">
                        Create Check
                    </button>
                </form>
            </div>
            <div>
                <ul className="flex flex-col gap-2">
                    {checks.map((check) => (
                        <li
                            className="flex flex-col border-black gap-3"
                            key={check.id}
                        >
                            <div
                                className="flex flex-col border-black gap-3 w-min p-3 m-2 bg-blue-400 rounded-md"
                                key={check.id}
                            >
                                <div>{`Check Number: ${check.check_number}`}</div>
                                <div>{`Amount: ${check.amount}`}</div>
                                <div>{`Bank: ${check.bank}`}</div>
                                <div>{`Date: ${new Date(
                                    check.date
                                ).toLocaleString()}`}</div>
                                <button
                                    className="text-red-500"
                                    onClick={() => deleteCheck(check.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default CheckManager;
