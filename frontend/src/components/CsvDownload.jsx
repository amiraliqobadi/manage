const CSVDownload = ({ data }) => {
    const downloadCSV = () => {
        const csvRows = [];
        const headers = [
            "ID",
            "Description",
            "Created At",
            "Category",
            "Amount",
        ];
        csvRows.push(headers.join(","));

        for (const card of data) {
            const row = [
                card.id,
                card.description,
                card.created_at,
                card.category,
                card.amount,
            ];
            csvRows.push(row.join(","));
        }

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", "cards.csv");
        a.click();
        URL.revokeObjectURL(url); 
    };

    return (
        <button
            onClick={downloadCSV}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded-full"
        >
            Download CSV
        </button>
    );
};

export default CSVDownload;
