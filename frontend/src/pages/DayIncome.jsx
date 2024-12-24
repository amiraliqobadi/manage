import React, { useEffect, useState } from "react";
import axios from "axios";

const DayIncomes = () => {
    const [dayIncomes, setDayIncomes] = useState([]);
    const [amount, setAmount] = useState(40);
    const [date, setDate] = useState(""); // New state for date input
    const [error, setError] = useState(null);

    const fetchDayIncomes = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/day_incomes/"
            );
            setDayIncomes(response.data);
        } catch (err) {
            console.error("Error fetching day incomes:", err);
            setError("Failed to load day incomes.");
        }
    };

    useEffect(() => {
        fetchDayIncomes();
    }, []);

    const handleDayIncomeCreated = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/day_incomes/",
                {
                    amount: Number(amount), // Ensure amount is sent as a number
                    date, // Ensure date is sent
                }
            );
            setDayIncomes((prev) => [...prev, response.data]);
            setAmount(40); // Reset amount
            setDate(""); // Reset date
        } catch (err) {
            console.error("Error creating day income:", err);
        }
    };

    const handleDayIncomeDeleted = async (id) => {
        console.log("Deleting day income with id:", id);
        if (!id) {
            console.error("Invalid id:", id);
            return;
        }
        try {
            await axios.delete(`http://193.151.140.110:8080/day_incomes/${id}`);
            setDayIncomes((prev) =>
                prev.filter((dayIncome) => dayIncome.id !== id)
            );
        } catch (err) {
            console.error("Error deleting day income:", err);
            setError("Failed to delete day income.");
        }
    };

    return (
        <div className="flex items-center justify-center flex-col gap-5">
            {error && <div className="text-red-500">{error}</div>}
            <div className="gap-5 bg-blue-200 card-form-container w-min flex justify-center items-center flex-col p-2 border-black rounded-lg">
                <h1>Manage Day Incomes</h1>
                <form
                    onSubmit={handleDayIncomeCreated}
                    className="flex flex-col gap-2"
                >
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="border rounded p-2"
                        required
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded p-2"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Add Day Income
                    </button>
                </form>
            </div>
            <div className="gap-5 card-form-container w-fit flex justify-center items-center flex-col p-2 border-black rounded-lg">
                <h2>Day Incomes</h2>
                <ul>
                    {dayIncomes.length > 0 ? (
                        dayIncomes.map((dayIncome) => (
                            <li
                                key={dayIncome.id}
                                className="flex justify-between items-center"
                            >
                                <span>
                                    {new Date(dayIncome.date).toLocaleString()}:
                                    ${dayIncome.amount}
                                </span>
                                <button
                                    onClick={() =>
                                        handleDayIncomeDeleted(dayIncome.id)
                                    }
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Delete
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>No day incomes available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DayIncomes;
