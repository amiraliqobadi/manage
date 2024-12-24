const Filter = ({
    category,
    setCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchCards,
}) => {
    return (
        <div className="mb-4 flex flex-col">
            <div>
                <label htmlFor="category">Category: </label>
                <input
                    id="category"
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-category mr-2 mb-2"
                />
            </div>

            <div>
                <label htmlFor="startDate">Start Date: </label>
                <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-date mr-2"
                />
            </div>
            <div>
                <label htmlFor="endDate">End Date: </label>
                <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-date mr-2"
                />
            </div>
            <button
                onClick={fetchCards}
                className="filter-button bg-gray-500 text-white px-4 py-2 rounded-full"
            >
                Filter
            </button>
        </div>
    );
};

export default Filter;
