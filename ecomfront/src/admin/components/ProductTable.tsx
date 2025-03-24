import React from "react";
import { Table } from "antd";
import { Button } from "flowbite-react";
import type { TableColumnsType, TableProps } from "antd";

// Define the data type for the product
interface ProductType {
  key: string;
  name: string;
  basePrice: number;
  stock_quantity: number;
  categoryId: string;
  image: string;
  variants: Array<{
    size: string;
    color: string;
    price: number;
    stock_quantity: number;
  }>;
}

interface LoginSetState {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginState {
  openModal: boolean;
}
interface EditSetState {
  setEditProduct: React.Dispatch<React.SetStateAction<boolean>>;
}

interface EditState {
  editProduct: boolean;
}

interface EditProduct {
  handleEditProduct: (id: string) => void;
}
interface DeleteProduct {
  handleDeleteProduct: (id: string) => void;
}

// Define the columns for the product table
const ProductTable: React.FC<{
  products: ProductType[];
  setOpenModal: LoginSetState;
  openModal: LoginState;
  setEditProduct: EditSetState;
  editProduct: EditState;
  handleEditProduct: EditProduct;
  handleDeleteProduct: DeleteProduct;
}> = ({
  products,
  setOpenModal,
  openModal,
  setEditProduct,
  editProduct,
  handleEditProduct,
  handleDeleteProduct,
}) => {
  const columns: TableColumnsType<ProductType> = [
    // Product id
    // {
    //   title: 'ID',
    //   dataIndex: 'key',
    //   sorter: (a, b) => a.key.localeCompare(b.key),
    // },
    {
      title: "Image",
      dataIndex: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="product"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      ),
    },

    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      sorter: (a, b) => a.basePrice - b.basePrice,
      render: (price: number) => `$${price}`,
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      sorter: (a, b) => a.stock_quantity - b.stock_quantity,
    },
    {
      title: "Variants",
      dataIndex: "variants",
      render: (
        variants: Array<{
          size: string;
          color: string;
          price: number;
          stock_quantity: number;
        }>
      ) => (
        <ul>
          {variants.map((variant, index) => (
            <li key={index} className="border-b-2 border-gray-200 py-2">
              <div className="flex-col ">
                {variant.attributes.map((attribute, index) => (
                  <div className="flex space-x-2">
                    <div key={index}>
                      {attribute.key}
                      </div>:
                      <b>
                    <div>{attribute.value}</div>
                      </b>
                  </div>
                ))}
              </div>
              ${variant.price} (
              {variant.stock_quantity} units)
            </li>
          ))}
        </ul>
      ),
    },
    // create edit button
    {
      title: "Action",
      dataIndex: "",
      render: (text, record) => (
        // console.log(record),
        <div className="flex-col space-y-2">
          <Button
            className="w-20"
            onClick={() => {
              setOpenModal(!openModal);
              setEditProduct(record.key);
              handleEditProduct(record.key);
            }}
          >
            Edit
          </Button>
          <Button
            className="w-20"
            gradientDuoTone="pinkToOrange"
            onClick={() => {
              handleDeleteProduct(record.key);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const onChange: TableProps<ProductType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <Table<ProductType>
        columns={columns}
        dataSource={products}
        onChange={onChange}
        rowKey="key"
      />
    </>
  );
};

export default ProductTable;
