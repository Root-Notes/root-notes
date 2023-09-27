/// <reference types="vite-plugin-svgr/client" />

import { RouterProvider } from "react-router-dom";
import { appRouter } from "./util/router/routing";
import "./sass/index.scss";

export function App() {
    return <RouterProvider router={appRouter} />;
}
