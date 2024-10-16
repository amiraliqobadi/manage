import CreateCard from "../components/CreateCard";
import CategoryChart from "../components/CategotyChart";
export default function Home() {
    return (
        <div className="flex justify-center items-center flex-col">
            <CreateCard />
            <CategoryChart />
        </div>
    );
}
