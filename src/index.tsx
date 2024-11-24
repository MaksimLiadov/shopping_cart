import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./app/store";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Main from "./Components/Main/Main";
import BasketContainer from "./Components/Basket/BasketContainer/BasketContainer";
import TableCreation from "./Components/TableCreation/TableCreation";
import OrderBuilder from "./Components/OrderBuilder/OrderBuilder";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <PrimeReactProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TableCreation />} />
            <Route path="/orderBuilder" element={<OrderBuilder />} />
            <Route path="/catalog" element={<Main />} />
            <Route path="/basket" element={<BasketContainer />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </PrimeReactProvider>
  </React.StrictMode>
);
