// src/components/InstallmentForm.js
import React, { useState } from "react";
import axios from "axios";

const InstallmentForm = ({ onInstallmentCreated }) => {
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://193.151.140.110:8080/installments",
                {
                    amount: parseInt(amount),
                    frequency: parseInt(frequency),
                    start_date: startDate,
                    end_date: endDate,
                }
            );
            onInstallmentCreated(response.data);
            setAmount("");
            setFrequency("");
            setStartDate("");
            setEndDate("");
        } catch (error) {
            console.error("Error creating installment:", error);
        }
    };

    return (
        <form
            className="flex gap-5 flex-col"
            onSubmit={handleSubmit}
            style={{ marginBottom: "20px" }}
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
                placeholder="Frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
            />
            <input
                type="datetime-local"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
            <input
                type="datetime-local"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
            />
            <button className="text-green-500" type="submit">
                Create Installment
            </button>
        </form>
    );
};

export default InstallmentForm;
