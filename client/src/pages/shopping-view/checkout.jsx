import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getOrCreateGuestId } from "@/lib/utils";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [transactionId, setTransactionId] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const effectiveUserId = user?.id || getOrCreateGuestId();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handlePlaceOrder() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }

    // For JazzCash / Easypaisa require transaction ID
    if (paymentMethod !== "cash-on-delivery") {
      if (!transactionId || transactionId.trim().length < 6) {
        toast({
          title: "Please enter a valid transaction ID.",
          description:
            "After sending payment to +92 300 3395535, paste the JazzCash / Easypaisa transaction ID here.",
          variant: "destructive",
        });
        return;
      }
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: effectiveUserId,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod:
        paymentMethod === "jazzcash"
          ? "JazzCash"
          : paymentMethod === "easypaisa"
          ? "EasyPaisa"
          : "Cash on Delivery",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: paymentMethod === "cash-on-delivery" ? "" : transactionId,
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "sangam");
      if (data?.payload?.success) {
        setIsPaymemntStart(false);
        setTransactionId("");
        navigate("/shop/payment-success");
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">Rs {totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <p className="font-semibold">Payment Method</p>
            <div className="grid gap-2 text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="jazzcash"
                  checked={paymentMethod === "jazzcash"}
                  onChange={() => setPaymentMethod("jazzcash")}
                  className="h-4 w-4 accent-black"
                />
                <span>JazzCash</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="easypaisa"
                  checked={paymentMethod === "easypaisa"}
                  onChange={() => setPaymentMethod("easypaisa")}
                  className="h-4 w-4 accent-black"
                />
                <span>EasyPaisa</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash-on-delivery"
                  checked={paymentMethod === "cash-on-delivery"}
                  onChange={() => setPaymentMethod("cash-on-delivery")}
                  className="h-4 w-4 accent-black"
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
            {(paymentMethod === "jazzcash" || paymentMethod === "easypaisa") && (
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-xs text-muted-foreground">
                  Send payment to <span className="font-semibold text-foreground">+92 300 3395535</span> via
                  {" "}
                  {paymentMethod === "jazzcash" ? "JazzCash" : "Easypaisa"}, then enter the transaction ID below.
                </p>
                <input
                  type="text"
                  placeholder="Enter transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            )}
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handlePlaceOrder} className="w-full">
              {isPaymentStart ? "Placing your order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
