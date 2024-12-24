import { useState, useEffect } from "react";
import Card from "../components/Card.jsx";
import Filter from "../components/Filter";
import CSVDownload from "../components/CsvDownload.jsx";
export default function FrytoPeyvandi() {
    const [cards, setCards] = useState([]);
    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    useEffect(() => {
        document.title = "Fryto Peyvandi";
    }, []);
    const fetchCards = async () => {
        try {
            let query = `http://193.151.140.110:8080/cards?shop=fryto%20peyvandi`;

            if (category) {
                query += `&category=${encodeURIComponent(category)}`;
            }
            if (startDate) {
                query += `&start_date=${encodeURIComponent(startDate)}`;
            }
            if (endDate) {
                query += `&end_date=${encodeURIComponent(endDate)}`;
            }

            const response = await fetch(query);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            setCards(data);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    useEffect(() => {
        fetchCards();
    }, [category, startDate, endDate]);

    const handleDelete = async (cardId) => {
        try {
            await fetch(`http://localhost:8080/cards/${cardId}`, {
                method: "DELETE",
            });
            setCards(cards.filter((card) => card.id !== cardId));
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };

    return (
        <div className="flex items-center justify-center flex-col">
            <Filter
                category={category}
                setCategory={setCategory}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                fetchCards={fetchCards}
            />
            <CSVDownload data={cards} />
            <div className="flex gap-6 flex-wrap">
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <Card
                            key={card.id}
                            description={card.description}
                            createDate={card.created_at}
                            img={card.images}
                            category={card.category}
                            amount={card.amount}
                            onDelete={() => handleDelete(card.id)}
                        />
                    ))
                ) : (
                    <p>is loading.</p>
                )}
            </div>
        </div>
    );
}
