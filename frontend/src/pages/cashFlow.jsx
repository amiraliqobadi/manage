import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CashFlowForm = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [cashFlow, setCashFlow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://193.151.140.110:8080/cash-flow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            setCashFlow(data);

            // Prepare data for the line chart
            const labels = [startDate, endDate];
            const inflows = [data.inflows];
            const outflows = [data.outflows];
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "Inflows",
                        data: inflows,
                        borderColor: "#4CAF50",
                        fill: false,
                    },
                    {
                        label: "Outflows",
                        data: outflows,
                        borderColor: "#FF6347",
                        fill: false,
                    },
                ],
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="startDate"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="endDate"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            End Date
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-green-600 disabled:bg-gray-400"
                    >
                        {loading ? "Loading..." : "Calculate Cash Flow"}
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 mt-4 text-center">{error}</p>
                )}

                {cashFlow && (
                    <div className="mt-6 text-center">
                        <p className="text-xl font-semibold">
                            Inflows: {cashFlow.inflows}
                        </p>
                        <p className="text-xl font-semibold">
                            Outflows: {cashFlow.outflows}
                        </p>
                        <p className="text-xl font-semibold">
                            Net Cash Flow: {cashFlow.net_cash_flow}
                        </p>
                    </div>
                )}

                {chartData && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-center mb-4">
                            Cash Flow Overview
                        </h3>
                        <Line data={chartData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashFlowForm;
