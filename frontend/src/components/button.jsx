export default function Button({ name }) {
    return (
        <button className="bg-slate-300 py-2 px-2 rounded-full text-blue-400 font-medium transition duration-200 hover:shadow-lg hover:shadow-[#00C9FF]/50">
            {name}
        </button>
    );
}
