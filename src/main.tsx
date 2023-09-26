import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/code-highlight/styles.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as langEn from "./lang/app/en.json";
import * as langEnCommon from "./lang/common/en.json";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                ...langEn,
                ...langEnCommon,
            },
        },
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
        escapeValue: false,
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");
