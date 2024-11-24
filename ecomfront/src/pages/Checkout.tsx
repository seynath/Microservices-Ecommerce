import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {  Modal } from "flowbite-react";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link , useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { emptyCart, getCart } from "@/features/cartSlice";
import { createOrder } from "@/features/orderSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(5);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [availableNotSufficientProducts, setAvailableNotSufficientProducts] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    dispatch(getCart());
  }, []);

  const cart = useSelector((state) => state?.cart?.cart) || { items: [] }; // Defaulting to empty items array
  const user = useSelector((state) => state?.user?.user) || {};
  const orderStatus = useSelector((state) => state?.order?.singleOrder);
  const cartStatus = useSelector((state) => state?.cart?.isSuccess);

  const [orderDetails, setOrderDetails] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "", // Added email field
    shipping_address: {
      address: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      phone: "",
    },
    billing_address: {
      address: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      phone: "",
    },
    payment_method: "",
    order_items: [],
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvc: "",
  });

  console.log(cart)
  useEffect(() => {
    const updatedorder_items = cart?.items?.map((item) => ({
      product_id: item.productId,
      product_name: item.name,
      attributes: item.attributes,
      image: item.image,
      total_price: item.price * item.quantity,
      variant_id: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }));
    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      user_id: user?.id,
      order_items: updatedorder_items,
    }));

    calculateTotals();
  }, [cart]);

  const calculateTotals = () => {
    let subtotal = 0;
    cart?.items?.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    setSubtotal(subtotal);
    setTotal(subtotal + shipping);
  };

  // const handlePlaceOrder = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Order Details", orderDetails);
  //   console.log("Card Details", cardDetails);

  //   dispatch(createOrder(orderDetails)).unwrap().then((response)=>{
  //     console.log("Order placed successfully", response)
  //   })

  //   // API call to place order
  // };
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

  
    // Copy shipping address to billing address if sameAsShipping is true
    let updatedOrderDetails = { ...orderDetails };
    if (sameAsShipping) {
      updatedOrderDetails = {
        ...orderDetails,
        billing_address: { ...orderDetails.shipping_address }, // Copy shipping to billing
      };
    }
  
    console.log("Order Details", updatedOrderDetails); // Updated order details to include billing
    console.log("Card Details", cardDetails);
  
    // Dispatch the order with updatedOrderDetails instead of orderDetails
    dispatch(createOrder(updatedOrderDetails))
      .unwrap()
      .then((response) => {
        console.log("Order placed successfully", response);
        // dispatch(emptyCart()).unwrap()
        // .then((response)=>{
        //   console.log(response)
        //   if(cartStatus){
        //     setLoading(false);

        //     console.log("orderOKKKK")
        //     // navigate(`/order`); // Redirect to order success page
        //   }
        // })



        // if (orderStatus) {

        //   // Redirect to order success page
        //   // history.push(`/order/${response.data.id}`);
        // }
      }).catch((error) => {
        console.log("Order failed", error);
        if(error.detail.product_ids.length > 0 && error.detail.message === "Products not available"){
          console.log("wertyuiop")
          // Display error message for unavailable products with Drawer UI
          error.detail.product_ids.forEach((productId) => {
          setAvailableNotSufficientProducts((prevProducts) => [...prevProducts, productId]);
          })
          // switch (error)
          setOpenModal(true);
          setLoading(false);
        } else if(error.detail.product_ids.length > 0 && error.detail.message === "Products not available for sufficient quantity"){

           console.log("qwertyuiop")
        }else if(error.detail.product_ids.length > 0 && error.detail.message === "All products not available"){
 console.log("qwertyuiop")
        }
      }
      );

    // dispatch(createOrder(updatedOrderDetails) as Promise<any>)
    // .then((response: any) => {
    //   console.log("Order placed successfully", response);
    //   console.log(order);
    //   if (order) {
    //     setLoading(false);
    //     dispatch(emptyCart() as Promise<any>)
    //       .then((response) => {
    //         console.log(response)
    //         console.log(cartStatus)
    //         if (cartStatus) {
    //           navigate(`/order`); // Redirect to order success page
    //         }
    //       });

    //     // Redirect to order success page
    //     // history.push(`/order/${response.data.id}`);
    //   }
    // })
    // .catch((error: any) => {
    //   console.log("Order failed", error);
    //   setLoading(false);
    // });
      // setLoading(false);

  };
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    addressType: "shipping_address" | "billing_address" = "shipping_address"
  ) => {
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [addressType]: {
        ...prevDetails[addressType],
        [field]: e.target.value,
      },
    }));
  };

  return (
    <>      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
    <Modal.Header>These Products Doesn't Have Suffesient Quantity</Modal.Header>
    <Modal.Body>
      <div className="space-y-6">
        {availableNotSufficientProducts && availableNotSufficientProducts.map((product, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>
              <img
                src={product.image}
                width={30}
                height={30}
                className="rounded-xl"
              />
            </span>
            <span>
              {product.product_name} 
            </span>
            <div>
              {
                product.attributes && product.attributes.map((attr) => (
                  <span className="block text-gray-500">{attr.key}: {attr.value}</span>
                ))
              }

            </div>
            <div>
              <span>Available Quantity: </span>
              <span><strong>{product.availableQuantity}</strong></span>
            </div>
            <span>${(product.price).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={() => setOpenModal(false)}>I accept</Button>
      <Button color="gray" onClick={() => setOpenModal(false)}>
        Decline
      </Button>
    </Modal.Footer>
  </Modal>
      <form onSubmit={handlePlaceOrder}>
        <main className="container  my-8 grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:gap-12">
          <section className="col-span-2 space-y-8">
          <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>

            <div>
              <h2 className="text-lg font-semibold">Shipping Details</h2>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="John"
                      value={orderDetails.first_name}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          first_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      value={orderDetails.last_name}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          last_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email" // Use email input type
                    placeholder="johndoe@example.com"
                    value={orderDetails.email}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_address">Address</Label>
                  <Textarea
                    id="shipping_address"
                    placeholder="123 Main St"
                    rows={2}
                    value={orderDetails.shipping_address.address}
                    onChange={(e) =>
                      handleInputChange(e, "address", "shipping_address")
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCity">City</Label>
                    <Input
                      id="shippingCity"
                      placeholder="New York"
                      value={orderDetails.shipping_address.city}
                      onChange={(e) =>
                        handleInputChange(e, "city", "shipping_address")
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingState">State</Label>
                    <Input
                      id="shippingState"
                      placeholder="NY"
                      value={orderDetails.shipping_address.state}
                      onChange={(e) =>
                        handleInputChange(e, "state", "shipping_address")
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingZip">Zip Code</Label>
                    <Input
                      id="shippingZip"
                      placeholder="10001"
                      value={orderDetails.shipping_address.zip}
                      onChange={(e) =>
                        handleInputChange(e, "zip", "shipping_address")
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingPhone">Phone</Label>
                    <Input
                      id="shippingPhone"
                      placeholder="+1 (555) 555-5555"
                      value={orderDetails.shipping_address.phone}
                      onChange={(e) =>
                        handleInputChange(e, "phone", "shipping_address")
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCountry">Country</Label>
                    <Input
                      id="shippingCountry"
                      placeholder="USA"
                      value={orderDetails.shipping_address.country}
                      onChange={(e) =>
                        handleInputChange(e, "country", "shipping_address")
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div>
              <h2 className="text-lg font-semibold">Billing Details</h2>
              <div className="mt-2 space-y-2">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                />
                <label htmlFor="sameAsShipping" className="ml-2">
                  Same as shipping address
                </label>
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingfirst_name">First Name</Label>
                    <Input
                      id="billingfirst_name"
                      placeholder="John"
                      value={
                        sameAsShipping
                          ? orderDetails.first_name
                          : orderDetails.billing_address.first_name
                      }
                      onChange={(e) =>
                        handleInputChange(e, "first_name", "billing_address")
                      }
                      disabled={sameAsShipping}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billinglast_name">Last Name</Label>
                    <Input
                      id="billinglast_name"
                      placeholder="Doe"
                      value={
                        sameAsShipping
                          ? orderDetails.last_name
                          : orderDetails.billing_address.last_name
                      }
                      onChange={(e) =>
                        handleInputChange(e, "last_name", "billing_address")
                      }
                      disabled={sameAsShipping}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_address">Address</Label>
                  <Textarea
                    id="billing_address"
                    placeholder="123 Main St"
                    rows={2}
                    value={
                      sameAsShipping
                        ? orderDetails.shipping_address.address
                        : orderDetails.billing_address.address
                    }
                    onChange={(e) =>
                      handleInputChange(e, "address", "billing_address")
                    }
                    disabled={sameAsShipping}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingCity">City</Label>
                    <Input
                      id="billingCity"
                      placeholder="New York"
                      value={
                        sameAsShipping
                          ? orderDetails.shipping_address.city
                          : orderDetails.billing_address.city
                      }
                      onChange={(e) =>
                        handleInputChange(e, "city", "billing_address")
                      }
                      disabled={sameAsShipping}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingState">State</Label>
                    <Input
                      id="billingState"
                      placeholder="NY"
                      value={
                        sameAsShipping
                          ? orderDetails.shipping_address.state
                          : orderDetails.billing_address.state
                      }
                      onChange={(e) =>
                        handleInputChange(e, "state", "billing_address")
                      }
                      disabled={sameAsShipping}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingZip">Zip Code</Label>
                    <Input
                      id="billingZip"
                      placeholder="10001"
                      value={
                        sameAsShipping
                          ? orderDetails.shipping_address.zip
                          : orderDetails.billing_address.zip
                      }
                      onChange={(e) =>
                        handleInputChange(e, "zip", "billing_address")
                      }
                      disabled={sameAsShipping}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingPhone">Phone</Label>
                    <Input
                      id="billingPhone"
                      placeholder="+1 (555) 555-5555"
                      value={
                        sameAsShipping
                          ? orderDetails.shipping_address.phone
                          : orderDetails.billing_address.phone
                      }
                      onChange={(e) =>
                        handleInputChange(e, "phone", "billing_address")
                      }
                      disabled={sameAsShipping}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingCountry">Country</Label>
                    <Input
                      id="billingCountry"
                      placeholder="USA"
                      value={
                        sameAsShipping
                          ? orderDetails.shipping_address.country
                          : orderDetails.billing_address.country
                      }
                      onChange={(e) =>
                        handleInputChange(e, "country", "billing_address")
                      }
                      disabled={sameAsShipping}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="mt-4 space-y-4">
                <RadioGroup
                  defaultValue="card"
                  onValueChange={(value) =>
                    setOrderDetails({ ...orderDetails, payment_method: value })
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-100 bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:peer-data-[state=checked]:border-gray-50 dark:[&:has([data-state=checked])]:border-gray-50"
                    >
                      <CreditCardIcon className="mb-3 h-6 w-6" />
                      <span>Credit Card</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="paypal"
                      id="paypal"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="paypal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-100 bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:peer-data-[state=checked]:border-gray-50 dark:[&:has([data-state=checked])]:border-gray-50"
                    >
                      <WalletCardsIcon className="mb-3 h-6 w-6" />
                      <span>PayPal</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="apple"
                      id="apple"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="apple"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-100 bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:peer-data-[state=checked]:border-gray-50 dark:[&:has([data-state=checked])]:border-gray-50"
                    >
                      <DollarSignIcon className="mb-3 h-6 w-6" />
                      <span>Digital Wallet</span>
                    </Label>
                  </div>
                </RadioGroup>
                {/* Credit Card Details */}
                {orderDetails.payment_method === "card" && (
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4111 1111 1111 1111"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiration">Expiration</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select>
                            <SelectTrigger id="expiration-month">
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={`${i + 1}`.padStart(2, "0")}
                                >
                                  {(i + 1).toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger id="expiration-year">
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from(
                                { length: 10 },
                                (_, i) => new Date().getFullYear() + i
                              ).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={cardDetails.cvc}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvc: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
          <section className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="mt-4 space-y-4">
                {cart && cart?.items?.length > 0 ? (
                  cart.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>
                        <img
                          src={item.image}
                          width={30}
                          height={30}
                          className="rounded-xl"
                        />
                      </span>
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <div>No Items in the Cart</div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coupon">Promo Code</Label>
                  <div className="flex">
                    <Input id="coupon" placeholder="Enter promo code" />
                    <Button className="ml-2">Apply</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {loading ? (
                    //  <l-ring  color="coral"></l-ring>
                    <div className="flex justify-center">

                    <l-reuleaux
                      size="37"
                      stroke="5"
                      stroke-length="0.15"
                      bg-opacity="0.1"
                      speed="1.2"
                      color="black"
                      ></l-reuleaux>
                      </div>
                  ) : (
              <Button size="lg" type="submit" className="w-full">
                Place Order
              </Button>
                   
                  )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By placing your order, you agree to our{" "}
                <Link to="#" className="underline" prefetch={false}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="underline" prefetch={false}>
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </section>
        </main>
      </form>

    </>
  );
}

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function WalletCardsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
      <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" />
    </svg>
  );
}




// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Link } from 'react-router-dom'
// import { useEffect, useState } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import { getCart } from "@/features/cartSlice"


// export default function Component() {
//   const dispatch = useDispatch();
//   const [subtotal, setSubtotal] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [shipping, setShipping] = useState(5);

// useEffect(() => {
//     dispatch(getCart());
//   }, []);

//   const cart = useSelector((state) => state?.cart?.cart) || { items: [] }; // Defaulting to empty items array
//   const user = useSelector((state) => state?.user?.user) || {};

//   const [orderDetails, setOrderDetails] = useState({
//     userId:"",
//     first_name: "",
//     last_name: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     zip: "",
//     phone: "",
//     payment_method: "",
//     order_items: []
//   })

//   const [cardDetails, setCardDetails] = useState({
//     cardNumber: "",
//     expirationMonth: "",
//     expirationYear: "",
//     cvc: "",
//   })

//   // cart item has image,color,size,productId,variantId,name,price,quantity,totalPrice
//   // const [order_items, setorder_items] = useState([

//   // ])

//   useEffect(() =>{
//     const updatedorder_items =  cart?.items?.map((item) => ({
//       productId: item.productId,
//       productName: item.name,
//       color: item.color,
//       size: item.size,
//       image: item.image,
//       totalPrice: item.price * item.quantity,
//       variantId: item.variantId,
//       quantity: item.quantity,
//       price: item.price,
//     }));
//     setOrderDetails((prevOrderDetails) => ({
//       ...prevOrderDetails,
//       userId: user?.id,
//     }));
  
//     console.log("Updated Order Items", updatedorder_items)
//     setOrderDetails((prevOrderDetails) => ({
//       ...prevOrderDetails,
//       order_items: updatedorder_items
//     }));
//     calculateTotals();

//     console.log("cart items", cart.items)
//   }, [cart])

//   const calculateTotals = () => {
//     let subtotal = 0;
//     cart?.items?.forEach(item => {
//       subtotal += item.price * item.quantity;
//     });
//     setSubtotal(subtotal);
//     setTotal(subtotal + shipping);
//   };
  

//   const handlePlaceOrder =  (e) => {
//     e.preventDefault();
//     console.log("Order Details", orderDetails)
//     console.log("Card Details", cardDetails)

//     // API call to place order

//   }



//   return (
//     <>
  
//         <form onSubmit={handlePlaceOrder}>

//       <main className="container mx-auto my-8 grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:gap-12">
//         <section className="col-span-2 space-y-8">
//           <div>
//             <h2 className="text-lg font-semibold">Shipping Details</h2>
//             <form className="mt-4 space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="first_name">First Name</Label>
//                   <Input id="first_name" placeholder="John" 
//                   value={orderDetails.first_name}
//                   onChange={(e) => setOrderDetails({...orderDetails, first_name: e.target.value})}
//                   required={true}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="last_name">Last Name</Label>
//                   <Input id="last_name" placeholder="Doe" 
//                   value={orderDetails.last_name}
//                   onChange={(e) => setOrderDetails({...orderDetails, last_name: e.target.value})}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="address">Address</Label>
//                 <Textarea id="address" placeholder="123 Main St" rows={2}
//                 value={orderDetails.address}
//                 onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="city">City</Label>
//                   <Input id="city" placeholder="New York"
//                   value={orderDetails.city}
//                   onChange={(e) => setOrderDetails({...orderDetails, city: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="state">State</Label>
//                   <Input id="state" placeholder="NY"
//                   value={orderDetails.state}
//                   onChange={(e) => setOrderDetails({...orderDetails, state: e.target.value})}
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="zip">Zip Code</Label>
//                   <Input id="zip" placeholder="10001"
//                   value={orderDetails.zip}
//                   onChange={(e) => setOrderDetails({...orderDetails, zip: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone</Label>
//                   <Input id="phone" placeholder="+1 (555) 555-5555"
//                   value={orderDetails.phone}
//                   onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})}
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="country">Country</Label>
//                   <Input id="country" placeholder="USA"
//                   value={orderDetails.country}
//                   onChange={(e) => setOrderDetails({...orderDetails, country: e.target.value})}
//                   />
//                 </div>
          
//               </div>
//             </form>
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">Payment Method</h2>
//             <div className="mt-4 space-y-4">
//               <RadioGroup defaultValue="card" onValueChange={(value) => setOrderDetails({...orderDetails, payment_method: value})} className="grid grid-cols-3 gap-4">
//                 <div>
//                   <RadioGroupItem value="card" id="card" className="peer sr-only" />
//                   <Label
//                     htmlFor="card"
//                     className="flex flex-col items-center justify-between rounded-md border-2 border-gray-100 bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:peer-data-[state=checked]:border-gray-50 dark:[&:has([data-state=checked])]:border-gray-50"
//                   >
//                     <CreditCardIcon className="mb-3 h-6 w-6" />
//                     <span>Credit Card</span>
//                   </Label>
//                 </div>
//                 <div>
//                   <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
//                   <Label
//                     htmlFor="paypal"
//                     className="flex flex-col items-center justify-between rounded-md border-2 border-gray-100 bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:peer-data-[state=checked]:border-gray-50 dark:[&:has([data-state=checked])]:border-gray-50"
//                   >
//                     <WalletCardsIcon className="mb-3 h-6 w-6" />
//                     <span>PayPal</span>
//                   </Label>
//                 </div>
//                 <div>
//                   <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
//                   <Label
//                     htmlFor="apple"
//                     className="flex flex-col items-center justify-between rounded-md border-2 border-gray-100 bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:peer-data-[state=checked]:border-gray-50 dark:[&:has([data-state=checked])]:border-gray-50"
//                   >
//                     <DollarSignIcon className="mb-3 h-6 w-6" />
//                     <span>Digital Wallet</span>
//                   </Label>
//                 </div>
//               </RadioGroup>
//               <div className="grid gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="cardNumber">Card Number</Label>
//                   <Input id="cardNumber" placeholder="4111 1111 1111 1111" 
//                   value={cardDetails.cardNumber}
//                   onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="expiration">Expiration</Label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <Select>
//                         <SelectTrigger id="expiration-month">
//                           <SelectValue placeholder="MM" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="01">01</SelectItem>
//                           <SelectItem value="02">02</SelectItem>
//                           <SelectItem value="03">03</SelectItem>
//                           <SelectItem value="04">04</SelectItem>
//                           <SelectItem value="05">05</SelectItem>
//                           <SelectItem value="06">06</SelectItem>
//                           <SelectItem value="07">07</SelectItem>
//                           <SelectItem value="08">08</SelectItem>
//                           <SelectItem value="09">09</SelectItem>
//                           <SelectItem value="10">10</SelectItem>
//                           <SelectItem value="11">11</SelectItem>
//                           <SelectItem value="12">12</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <Select>
//                         <SelectTrigger id="expiration-year">
//                           <SelectValue placeholder="YYYY" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="2023">2023</SelectItem>
//                           <SelectItem value="2024">2024</SelectItem>
//                           <SelectItem value="2025">2025</SelectItem>
//                           <SelectItem value="2026">2026</SelectItem>
//                           <SelectItem value="2027">2027</SelectItem>
//                           <SelectItem value="2028">2028</SelectItem>
//                           <SelectItem value="2029">2029</SelectItem>
//                           <SelectItem value="2030">2030</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="cvc">CVC</Label>
//                     <Input id="cvc" placeholder="123"
//                     value={cardDetails.cvc}
//                     onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="space-y-8">
//           <div>
//             <h2 className="text-lg font-semibold">Order Summary</h2>
//             <div className="mt-4 space-y-4">
//             {cart &&
//             cart?.items?.length > 0 ?(
//             cart.items.map((item, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <span><img src={item.image} width={30} height={30} className="rounded-xl"/></span>
//                   <span>{item.name} (x{item.quantity})</span>
//                   <span>${(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))) : (<div>No Items in the Cart</div>)
//             }
//               <Separator />
//               <div className="flex items-center justify-between">
//                 <span>Subtotal</span>
//                 <span>${ subtotal }</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span>Shipping</span>
//                 <span>$5.00</span>
//               </div>
//               <Separator />
//               <div className="flex items-center justify-between font-semibold">
//                 <span>Total</span>
//                 <span>${total}</span>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="coupon">Promo Code</Label>
//                 <div className="flex">
//                   <Input id="coupon" placeholder="Enter promo code" />
//                   <Button className="ml-2">Apply</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="space-y-4">
//             <Button size="lg" type="submit" className="w-full" onClick={handlePlaceOrder}>
//               Place Order
//             </Button>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               By placing your order, you agree to our{" "}
//               <Link to="#" className="underline" prefetch={false}>
//                 Terms of Service
//               </Link>
//               and{" "}
//               <Link to="#" className="underline" prefetch={false}>
//                 Privacy Policy
//               </Link>
//               .
//             </p>
//           </div>
//         </section>
//       </main>
//       </form>

//     </>
//   )
// }

// function CreditCardIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect width="20" height="14" x="2" y="5" rx="2" />
//       <line x1="2" x2="22" y1="10" y2="10" />
//     </svg>
//   )
// }


// function DollarSignIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <line x1="12" x2="12" y1="2" y2="22" />
//       <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//     </svg>
//   )
// }


// function MountainIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
//     </svg>
//   )
// }


// function WalletCardsIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect width="18" height="18" x="3" y="3" rx="2" />
//       <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
//       <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" />
//     </svg>
//   )
// }


// function XIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   )
// }