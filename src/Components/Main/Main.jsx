import React from "react";
import ProductsTable from "./ProductsTableComponent/ProductsTable"
import Navigator from "./Navigator/Navigator";
import './Main.css';

const Main = () => {
  return (
    <div className="MainContainer">
      <Navigator />
      <ProductsTable />
    </div>
  );
};

export default Main;
