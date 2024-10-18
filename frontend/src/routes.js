import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Fryto from "./pages/fryto";
import FrytoPeyvandi from "./pages/frytoPeyvandi";
import Rostak from "./pages/rostak";
const routes = [
    { path: "/", Component: Home },
    { path: "*", Component: NotFound },
    { path: "/fryto", Component: Fryto },
    { path: "/fryto/peyvandi", Component: FrytoPeyvandi },
    { path: "/rostak", Component: Rostak },
];

export default routes;
