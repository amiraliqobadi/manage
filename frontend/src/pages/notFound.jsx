import { Link } from "react-router-dom";
import { useEffect } from "react";
export default function NotFound() {
    useEffect(() => {
        document.title = "Not Found";
    }, []);
    return (
        <div className="mt-24 flex items-center justify-center flex-col gap-5">
            <div className="font-bold text-5xl">404</div>
            <div className="text-red-400">Page Not Found</div>
            <Link
                className="text-red-400 bg-slate-300 rounded-full ps-2 pe-2"
                to="/"
            >
                home
            </Link>
        </div>
    );
}
