const Card = ({ description, img, category, onDelete, createDate, amount }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg flex flex-col items-center p-4">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                    Description: {description}
                </div>
                <p className="text-gray-700 text-base">Category: {category}</p>
                <p className="text-gray-700 text-base">
                    Create Date: {new Date(createDate).toLocaleString()}
                </p>
                <p className="text-gray-700 text-base">Amount: {amount}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
                {img &&
                    img.map((image, index) => (
                        <img
                            key={index}
                            src={`http://193.151.140.110:8080/${img[0].image_url}`}
                            alt={`img-${index}`}
                            className="w-full"
                        />
                    ))}
            </div>
            <button
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Delete
            </button>
        </div>
    );
};

export default Card;
