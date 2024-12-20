import { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
const CreateCard = () => {
    const [description, setDescription] = useState("");
    const [shop, setShop] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState(0);
    const [images, setImages] = useState([]);
    const notify = () => toast('created');
    const handleFileChange = (event) => {
        setImages(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("description", description);
        formData.append("shop", shop);
        formData.append("category", category);
        formData.append("amount", amount);
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            const response = await axios.post(
                "http://193.151.140.110:8080/cards/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Card created:", response.data);
            setDescription("");
            setShop("");
            setCategory("");
            setAmount(0);
            setImages([]);
            notify();
        } catch (error) {
            if (error.response) {
                console.error("Error creating card:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error:", error.message);
            }
        }
    };

    return (
        <div className="flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="gap-5 bg-blue-200 card-form-container w-min flex justify-center items-center flex-col p-2 border-black rounded-lg"
            >
                <input
                    className="rounded-full pl-3"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Card Description"
                    required
                />
                <select
                    value={shop}
                    required
                    onChange={(e) => setShop(e.target.value)}
                >
                    <option value="">Select Shop</option>
                    <option value="fryto">fryto</option>
                    <option value="rostak">rostak</option>
                    <option value="fryto peyvandi">fryto 2</option>
                </select>
                <select
                    value={category}
                    required
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select category</option>
                    <option value="Ard">Ard</option>
                    <option value="Chiken">Chiken</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Construction">Construction</option>
                    <option value="Drink">Drink</option>
                    <option value="Energy">Energy</option>
                    <option value="Markrting">Markrting</option>
                    <option value="Mushroom">Mushroom</option>
                    <option value="Oil">Oil</option>
                    <option value="Other">Other</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Potato">Potato</option>
                    <option value="Rent">Rent</option>
                    <option value="Row Material">Row Material</option>
                    <option value="Salary">Salary</option>
                    <option value="Sous">Sous</option>
                    <option value="Spice">Spice</option>
                    <option value="Store Rent">Store Rent</option>
                    <option value="Tools">Tools</option>
                    <option value="Transcription">Transcription</option>
                    <option value="Installment">Installment</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Pizza Protein">pizzaProtein</option>
                    <option value="Pizza Ard">Pizza Ard</option>
                    <option value="Profit">Profit</option>
                    <option value="R&D">R&D</option>
                    <option value="Store Food">Store Food</option>
                    <option value="Store Rent">Store Rent</option>
                    <option value="Tax">Tax</option>
                    <option value="Transportation">Transportation</option>
                </select>

                <label htmlFor="amount">Enter Amount:</label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    required
                    className="rounded-full px-2"
                />

                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                />

                <button
                    className="inline-block bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
                    type="submit"
                >
                    Create Card
                </button>
            </form>
        </div>
    );
};

export default CreateCard;
