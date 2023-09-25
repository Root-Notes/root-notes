import { createHashRouter } from "react-router-dom";
import { Layout } from "../views/layout/Layout";
import { HomePage } from "../views/home/HomePage";

export const appRouter = createHashRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/home",
                element: <HomePage />,
            },
        ],
    },
]);
