import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { removeAllProduct } from '../../../features/slices/basketSlice'
import BasketTableActions from './BasketTableActions/BasketTableActions'
import "./BasketTable.css";

const BasketTable = () => {
    const basketData = useSelector((state) => state.basket.basketItems);
    let total = (basketData.reduce((acc, item) => acc + item.productPrice * item.amount, 0)).toFixed(2);

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleRemoveAllProduct = () => {
        dispatch(removeAllProduct());
        navigate('/', { replace: true });
    };

    const Purchase = () => {
        let PurchaseJSON = {
            basketData: basketData,
            total: total
        }
        console.log("PurchaseJSON " + JSON.stringify(PurchaseJSON));
        dispatch(removeAllProduct());
        navigate('/', { replace: true });
    };

    return (
        <div className="basket-table-container">
            <div className="basket-table">
                <DataTable className="table" value={basketData} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="productName" header="Наименование"></Column>
                    <Column field="productPrice" header="Цена"></Column>
                    <Column field="amount" header="Количество"></Column>
                    <Column header="Стоимость" body={(rowData) => (
                        <BasketTableActions rowData={rowData} />
                    )}></Column>
                </DataTable>
                <div className="total-container">
                    <span className="total">
                        <span>
                            Итого:
                        </span>
                        <span>
                            {total}
                        </span>
                    </span>
                </div>
            </div>
            <div className="purchase-confirmation-buttons">
                <Button onClick={Purchase} label="Берем!" />
                <Button onClick={handleRemoveAllProduct} label="Пожалуй, откажусь" />
            </div>
        </div >
    );
};

export default BasketTable;
