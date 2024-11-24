import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import * as XLSX from "xlsx";
import "./OrderBuilder.css";

const OrderBuilder = () => {
  const toast = React.useRef(null);

  return (
    <div className="table-creation-container">
      <Toast ref={toast} />
      OrderBuilder
    </div>
  );
};

export default OrderBuilder;
