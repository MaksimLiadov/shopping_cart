import React from "react";
import { useSelector } from "react-redux";
import ProductTableActions from "./ProductTableActions/ProductTableActions"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "./ProductsTable.css";

const ProductsTable = () => {
    const catalogData = useSelector((state) => state.catalog.catalogData);
    const columns = Object.keys(catalogData[0] || {}).map((key) => ({
        field: key,
        header: key.charAt(0).toUpperCase() + key.slice(1), // Делаем первую букву заглавной
      }));
    
      return (
        <DataTable className="catalogDataTable" value={catalogData} tableStyle={{ minWidth: '50rem' }}>
          {columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
          <Column header="Действия" body={(rowData) => (
            <ProductTableActions product={rowData} />
          )}></Column>
        </DataTable>
      );
};

export default ProductsTable;
