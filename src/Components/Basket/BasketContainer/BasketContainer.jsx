import React from "react";
import Navigator from "../../Main/Navigator/Navigator";
import BasketTable from "../BasketTable/BasketTable"
import './BasketContainer.css';

const BasketContainer = () => {
    return (
        <div className="BasketContainer">
            <Navigator />
            <BasketTable />
        </div>
    );
};

export default BasketContainer;
