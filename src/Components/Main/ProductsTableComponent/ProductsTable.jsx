import React from "react";
import { useSelector } from "react-redux";
import ProductTableActions from "./ProductTableActions/ProductTableActions"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "./ProductsTable.css";

const ProductsTable = () => {
    const catalogData = useSelector((state) => state.catalog.catalogData);

    return (
        <div className="catalogDataTableContainer">
            <DataTable className="catalogDataTable" value={catalogData} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Наименование"></Column>
                <Column field="price" header="Цена"></Column>
                <Column header="Действия" body={(rowData) => (
                    <ProductTableActions product={rowData} />
                )}></Column>
            </DataTable>
        </div >
    );
};

export default ProductsTable;
