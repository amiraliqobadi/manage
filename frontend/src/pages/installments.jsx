// src/pages/installments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import InstallmentForm from "../components/CreateInstallments";
import InstallmentList from "../components/InstallmentList";

const Installments = () => {
    const [installments, setInstallments] = useState([]);

    const fetchInstallments = async () => {
        try {
            const response = await axios.get(
                "http://193.151.140.110:8080/installments"
            );
            setInstallments(response.data);
        } catch (error) {
            console.error("Error fetching installments:", error);
        }
    };

    useEffect(() => {
        fetchInstallments();
    }, []);

    const handleInstallmentCreated = (newInstallment) => {
        setInstallments((prev) => [...prev, newInstallment]);
    };

    const handleInstallmentDeleted = (id) => {
        setInstallments((prev) =>
            prev.filter((installment) => installment.id !== id)
        );
    };

    return (
        <div className="flex items-center justify-center flex-col gap-5">
            <div className="gap-5 bg-blue-200 card-form-container w-min flex justify-center items-center flex-col p-2 border-black rounded-lg">
                <h1>Manage Installments</h1>
                <InstallmentForm
                    className="rounded-full pl-3 flex justify-center items-center text-gray-800 gap-5"
                    onInstallmentCreated={handleInstallmentCreated}
                />
            </div>
            <div className="gap-5 card-form-container w-fit flex justify-center items-center flex-col p-2 border-black rounded-lg">
                <InstallmentList
                    className="rounded-full pl-3 flex justify-center items-center text-gray-800 gap-5"
                    installments={installments}
                    onInstallmentDeleted={handleInstallmentDeleted}
                />
            </div>
        </div>
    );
};

export default Installments;
