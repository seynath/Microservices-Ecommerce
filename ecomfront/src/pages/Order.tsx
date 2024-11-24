import React, { useEffect } from "react";
import { Table } from "antd";
import { Button } from "flowbite-react";
import type { TableColumnsType, TableProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "@/features/orderSlice";
import { text } from "stream/consumers";

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

// Define the columns for the product table
export default function Order() {
  const dispatch = useDispatch();
  const user = useSelector(
    (state: { user: { user: object } }) => state.user.user
  );

  const order = useSelector(
    (state: { order: { order: object } }) => state.order.order
  );
  useEffect(() => {
    dispatch(getAllOrders());
  }, []);

  const columns: TableColumnsType<ProductType> = [
    // Product id
    // {
    //   title: 'ID',
    //   dataIndex: 'key',
    //   sorter: (a, b) => a.key.localeCompare(b.key),
    // },
    {
      title: "OrderId",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      // render: (image: string) => (
      //   <img
      //     src={image}
      //     alt="product"
      //     style={{ width: "50px", height: "50px", objectFit: "cover" }}
      //   />
      // ),
    },

    {
      title: "Name",
      dataIndex: "first_name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      sorter: (a, b) => a.basePrice - b.basePrice,
      render: (price: number) => `$${price}`,
    },
    {
      title: "Order Items",
      dataIndex: "",
      render: (text, record) => {
        console.log(record);
        return (
          <ul>
            {record?.order_items.map((order_item, index) => (
              <li key={index}>
                <div className="flex">

                <img src={order_item.image} width={50} height={50} />{order_item.product_name} - {order_item.quantity}
                </div>
              </li>
            ))}
          </ul>
        );}
      // render:  order_items => {
      //   console.log(order_items)
      //   return (
      //     <ul>
      //       {order_items.map((order_item, index) => (
      //         <li key={index}>
      //           {order_item.product_id} - {order_item.quantity}
      //         </li>
      //       ))}
      //     </ul>
      //   );
      // }
      // sorter: (a, b) => a.stock_quantity - b.stock_quantity,

    },
    // {
    //   title: "Variants",
    //   dataIndex: "variants",
    //   render: (
    //     variants: Array<{
    //       size: string;
    //       color: string;
    //       price: number;
    //       stock_quantity: number;
    //     }>
    //   ) => (
    //     <ul>
    //       {variants.map((variant, index) => (
    //         <li key={index}>
    //           {variant.size} - {variant.color}: ${variant.price} (
    //           {variant.stock_quantity} units)
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
    // create edit button
    {
      title: "Action",
      dataIndex: "",
      render: (text, record) => (
        // console.log(record),
        <div className="flex">
          <Button className="w-20" onClick={() => {}}>
            Edit
          </Button>
          <Button
            className="w-20"
            gradientDuoTone="pinkToOrange"
            onClick={() => {}}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  // dummy data


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
        dataSource={order}
        onChange={onChange}
        rowKey="key"
      />
    </>
  );
}
