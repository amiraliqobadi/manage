import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
    Chart,
    LinearScale,
    CategoryScale,
    BarElement, 
    Tooltip,
    Legend,
} from "chart.js";

Chart.register(
    LinearScale,
    CategoryScale,
    BarElement,
    Tooltip,
    Legend
);

const CategoryChart = () => {
    const [chartData, setChartData] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        const shops = ["fryto", "rostak", "fryto peyvandi"];
        setLoading(true);
        setError(null);

        try {
            const promises = shops.map((shop) =>
                axios.get(
                    `http://193.151.140.110:8080/cards/categories?shop=${shop}&start_date=${startDate}&end_date=${endDate}`
                )
            );
            const responses = await Promise.all(promises);

            const allCategories = new Set();
            const shopData = {};

            responses.forEach((response, index) => {
                const shopName = shops[index];
                const categories = response.data.categories;

                if (Array.isArray(categories)) {
                    categories.forEach((item) => {
                        allCategories.add(item.category);
                        if (!shopData[item.category]) {
                            shopData[item.category] = {
                                [shopName]: item.total_amount || 0,
                            };
                        } else {
                            shopData[item.category][shopName] =
                                item.total_amount || 0;
                        }
                    });
                } else {
                    console.error(
                        `Unexpected data format for categories from ${shopName}:`,
                        response.data
                    );
                }
            });

            const labels = Array.from(allCategories).sort();

            const datasets = shops.map((shop, shopIndex) => {
                const amounts = labels.map((label) => {
                    return shopData[label] &&
                        shopData[label][shop] !== undefined
                        ? shopData[label][shop]
                        : 0;
                });

                return {
                    label: shop,
                    data: amounts,
                    backgroundColor: `rgba(${
                        (shopIndex + 1) * 75
                    }, 192, 192, 0.6)`,
                    borderColor: `rgba(${(shopIndex + 1) * 75}, 192, 192, 1)`,
                    borderWidth: 1,
                };
            });

            setChartData({ labels, datasets });
        } catch (error) {
            console.error("Error fetching category data:", error);
            setError("Failed to load category data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    return (
        <div className="w-full flex flex-col items-center">
            <h2>Category Amount Chart (Bar Chart)</h2>
            <div className="flex flex-col">
                <div>
                    <label htmlFor="startdate">start date</label>
                    <input
                        id="startdate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="enddate">end date</label>
                    <input
                        id="enddate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button
                    className="bg-slate-500 text-white rounded-full"
                    onClick={fetchData}
                >
                    Filter
                </button>
            </div>
            {loading ? (
                <p>Loading chart...</p>
            ) : error ? (
                <p>{error}</p>
            ) : chartData ? (
                <Bar
                    className="w-full h-full"
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: "Categories",
                                },
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Amounts",
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: "top",
                            },
                            tooltip: {
                                enabled: true,
                            },
                        },
                    }}
                />
            ) : (
                <p>No data available for the selected date range.</p>
            )}
        </div>
    );
};

export default CategoryChart;
