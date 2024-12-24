// src/components/InstallmentList.js
import React from "react";
import axios from "axios";

const InstallmentList = ({ installments, onInstallmentDeleted }) => {
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://193.151.140.110:8080/installments/${id}`);
            onInstallmentDeleted(id);
        } catch (error) {
            console.error("Error deleting installment:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {installments.map((installment) => (
                <div key={installment.id} style={cardStyle}>
                    <h3>Installment #{installment.id}</h3>
                    <p>Amount: {installment.amount}</p>
                    <p>Frequency: {installment.frequency}</p>
                    <p>
                        Start Date:{" "}
                        {new Date(installment.start_date).toLocaleString()}
                    </p>
                    <p>
                        End Date:{" "}
                        {new Date(installment.end_date).toLocaleString()}
                    </p>
                    <button
                        className="text-red-600"
                        onClick={() => handleDelete(installment.id)}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    width: "200px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

export default InstallmentList;
