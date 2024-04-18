import React from "react";
import ReactDOM from "react-dom/client";
// @ts-expect-error not yet typed
import App from "./Carousel.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
