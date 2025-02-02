import  { useEffect, useState, useRef } from "react";
import { Table } from "antd";
import { Button } from "flowbite-react";
import type { TableColumnsType, TableProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "@/features/orderSlice";
// import { text } from "stream/consumers";
import { Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { Rate } from 'antd';
import { Input } from 'antd';
import { createReview } from "@/features/reviewSlice";
const { TextArea } = Input;




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
  const [openModal, setOpenModal] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [rateItem, setRateItem] = useState({
    ProductId: "",
    UserId: "",
    OrderId: "",
    Rating: 0,
    ReviewText: "",
  });
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
      title: "Order Total",
      dataIndex: "total_price",
      sorter: (a, b) => a.basePrice - b.basePrice,
      render: (price: number) => `$${price}`,
    },
    {
      title: "Order Status",
      dataIndex: "status",
      sorter: (a, b) => a.basePrice - b.basePrice,
      render: (price: number) => `${price}`,
    },
    {
      title: "Order Items",
      dataIndex: "",
      render: (text, record) => {
        console.log(record);
        return (
          <ul className="">
            {record?.order_items.map((order_item, index) => (
              <li key={index} className="flex justify-between my-3 ">
                <div className="flex flex-col">
                  <div className="flex">
                    <img src={order_item.image} width={50} height={50} />
                    <div>{order_item.product_name}</div>
                  </div>

                  <div>
                    <div className="flex flex-col">
                      <div>Quantity: {order_item.quantity}</div>
                      <div>Price: ${order_item.price}</div>
                      <div className="flex gap-3">
                        {order_item.attributes &&
                          order_item.attributes.map((attr) => (
                            <div>
                              {attr.key}: {attr.value}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    className="w-20"
                    // onClick={() => {console.log( record, order_item.product_id)}}
                    onClick={() => {
                      setOpenModal(true);
                      setRateItem({
                        ProductId: order_item.product_id,
                        UserId: record.user_id,
                        OrderId: record.id,
                        Rating: 0,
                        ReviewText: "",
                      });
                    }}
                  >
                    Rate
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        );
      },
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

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log(rateItem);
    // dispatch(addReview(rateItem));
    dispatch(createReview(rateItem));


  };

  return (
    <>
      <Table<ProductType>
        columns={columns}
        dataSource={order}
        onChange={onChange}
        rowKey="key"
      />
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Rate
            </h3>
            <div>
             
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <Rate value={rateItem.Rating} onChange={(value) => setRateItem({ ...rateItem, Rating: value })} />
              {/* <TextInput id="email" ref={emailInputRef} placeholder="name@company.com" required /> */}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextArea rows={4} placeholder="Write a Review" value={rateItem.ReviewText} onChange={(e) => setRateItem({...rateItem, ReviewText: e.target.value})}/>

              {/* <TextInput id="password" type="password" required /> */}
            </div>
    
            <div className="w-full">
              <Button onClick={handleSubmitReview}>Submit Review</Button>
            </div>

          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
