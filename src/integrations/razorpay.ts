import { CartItem } from "../types/product";
import { RazorpayResponse } from "../types/checkout";

const RAZORPAY_KEY_ID = "rzp_test_nYpePNPQxov9cz";
const API_BASE_URL = "http://localhost:5000";

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createOrder = async (amount: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const verifyPayment = async (paymentResponse: RazorpayResponse) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentResponse),
    });
    const data = await response.json();
    return data.verified;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

export const handlePayment = async (
  amount: number,
  cartItems: CartItem[],
  userDetails: any
) => {
  const res = await initializeRazorpay();
  if (!res) {
    alert("Razorpay SDK failed to load");
    return false;
  }

  try {
    // Create order on backend
    const order = await createOrder(amount);

    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "SimplStore",
        description: "Purchase from SimplStore",
        order_id: order.id, // Use the order ID from backend
        handler: async function (response: RazorpayResponse) {
          try {
            const verified = await verifyPayment(response);
            if (verified) {
              resolve(true);
            } else {
              reject(new Error("Payment verification failed"));
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            reject(error);
          }
        },
        prefill: {
          name: `${userDetails.firstName} ${userDetails.lastName}`,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            reject(new Error("Payment cancelled by user"));
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        reject(new Error("Payment failed"));
      });
      paymentObject.open();
    });
  } catch (error) {
    console.error("Payment failed:", error);
    throw error;
  }
};