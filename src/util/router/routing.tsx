import { createHashRouter } from "react-router-dom";
import { Layout } from "../../views/layout/Layout";
import { HomePage } from "../../views/home/HomePage";
import { InternalProviders } from "./providers";

export const appRouter = createHashRouter([
    {
        path: "/",
        element: <InternalProviders />,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [],
            },
            {
                path: "/home",
                element: <HomePage />,
            },
        ],
    },
]);
