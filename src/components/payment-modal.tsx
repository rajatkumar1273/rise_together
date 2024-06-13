import React, { useState } from "react";
import {
  AddressElement,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, message } from "antd";
import { addNewDonation } from "@/actions/donations";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  campaign: CampaignType;
  amount: number;
  messageText: string;
  onSuccess: (donationAmount: number) => void;
}

function PaymentModal({
  campaign,
  amount,
  messageText,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();
      // Handle payment here

      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      const result = await stripe.confirmPayment({
        // Elements instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile/donations`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        message.error(result.error.message);
      } else {
        message.success("Payment successful");
        // Your customer will be redirected to your return_url. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the return_url.

        const donationPayLoad = {
          campaign: campaign._id,
          amount,
          message: messageText,
          paymentId: result.paymentIntent?.id,
        };

        await addNewDonation(donationPayLoad);
        message.success("Donation added successfully");
        onSuccess(amount); // Call the onSuccess callback
        router.push("/profile/donations");
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement />
      <AddressElement
        options={{
          allowedCountries: ["IN"],
          mode: "shipping",
        }}
      />
      <div className="flex gap-5 justify-end mt-5">
        <Button>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Donate
        </Button>
      </div>
    </form>
  );
}

export default PaymentModal;
