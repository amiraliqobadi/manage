import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Fryto from "./pages/fryto";
import FrytoPeyvandi from "./pages/frytoPeyvandi";
import Rostak from "./pages/rostak";
import Installments from "./pages/installments";
import CheckManager from "./pages/CheckManager";
import DayIncome from "./pages/DayIncome";
import CashFlowForm from "./pages/cashFlow";

const routes = [
    { path: "/", Component: Home },
    { path: "*", Component: NotFound },
    { path: "/fryto", Component: Fryto },
    { path: "/fryto/peyvandi", Component: FrytoPeyvandi },
    { path: "/rostak", Component: Rostak },
    { path: "/installments", Component: Installments },
    { path: "/CheckManager", Component: CheckManager },
    { path: "/DayIncome", Component: DayIncome },
    { path: "/CashFlowForm", Component: CashFlowForm },
];

export default routes;
