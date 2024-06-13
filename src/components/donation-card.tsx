"use client";
import { getStripeClientSecret } from "@/actions/payments";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Input, Modal, Progress } from "antd";
import React, { useState } from "react";
import PaymentModal from "./payment-modal";
import { getDonationsByCampaignId } from "@/actions/donations";
import { message as antdMessage } from "antd";

interface DonationCardProps {
  campaign: CampaignType;
  donations?: DonationType[];
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function DonationCard({ campaign, donations = [] }: DonationCardProps) {
  const [allDonations = [], setAllDonations] = useState<DonationType[]>([]);
  const [showAllDonations, setShowAllDonations] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [message, setMessage] = useState("");
  const [collectedAmount, setCollectedAmount] = useState<number>(
    campaign.collectedAmount
  );

  const collectedPercentage = Math.round(
    (collectedAmount / campaign.targetAmount) * 100
  );

  const getClientSecret = async () => {
    try {
      setLoading(true);
      const response = await getStripeClientSecret({ amount });

      if (response.error) {
        throw new Error(response.error);
      }

      setClientSecret(response.clientSecret);
      setShowPaymentModal(true);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSuccess = (donationAmount: number) => {
    setCollectedAmount((prevAmount) => prevAmount + donationAmount);
    setShowPaymentModal(false);
    setClientSecret("");
  };

  const getRecentDonations = () => {
    if (donations?.length === 0) {
      return (
        <span className="text-gray-600 text-sm">
          No donations yet. Be the first one to donate to this campaign.
        </span>
      );
    }

    return donations?.map((donation) => (
      <div className="p-2 rounded-sm bg-gray-100 flex flex-col">
        <span className="text-gray-600 text-sm font-semibold">
          {donation.user.userName} donated ₹{donation.amount}
        </span>
        <span className="text-gray-500 text-xs">{donation.message}</span>
      </div>
    ));
  };

  const getAllDonations = async () => {
    try {
      const response: any = await getDonationsByCampaignId(campaign._id);

      if (response.error) {
        throw new Error(response.error);
      }

      setAllDonations(response.data);
    } catch (error: any) {
      antdMessage.error(error.message);
    }
  };

  return (
    <div className="border border-solid rounded border-gray-300 p-5">
      <span className="block text-xl text-primary font-semibold">
        ₹ {collectedAmount} raised of ₹ {campaign.targetAmount}
      </span>
      <Progress className="mt-2 mb-2" percent={collectedPercentage} />

      {campaign.showDonorsInCampaign && (
        <>
          <div className="flex flex-col my-4">
            <h2 className="text-xl font-bold">Recent Donations</h2>
            {getRecentDonations()}
          </div>

          {donations?.length > 0 && (
            <span
              className="text-gray-600 text-sm font-semibold cursor-pointer underline mt-5"
              onClick={() => {
                setShowAllDonations(true);
                getAllDonations();
              }}
            >
              View all donations
            </span>
          )}
        </>
      )}

      <hr className="my-10" />

      <div className="flex flex-col gap-5 mt-5">
        <Input
          placeholder="Enter amount"
          type="number"
          onChange={(e) => setAmount(parseInt(e.target.value))}
          value={amount}
        />

        <Input.TextArea
          placeholder="Leave a message (optional)"
          rows={4}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        ></Input.TextArea>

        <Button
          type="primary"
          block
          disabled={!amount}
          onClick={getClientSecret}
          loading={loading}
        >
          Donate
        </Button>
      </div>

      {showPaymentModal && clientSecret && (
        <Modal
          open={showPaymentModal}
          onCancel={() => {
            setShowPaymentModal(false);
            setClientSecret("");
          }}
          width={600}
          footer={null}
          title="Donate to campaign"
        >
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentModal
              messageText={message}
              campaign={campaign}
              amount={amount || 0}
              onSuccess={handleDonationSuccess}
            />
          </Elements>
        </Modal>
      )}

      {showAllDonations && (
        <Modal
          open={showAllDonations}
          onCancel={() => {
            setShowAllDonations(false);
          }}
          width={600}
          footer={null}
          title="All donations for this campaign"
        >
          <div className="flex flex-col gap-5 my-5">
            {allDonations.map((donation) => (
              <div className="p-2 rounded-sm bg-gray-100 flex flex-col">
                <span className="text-gray-600 text-sm font-semibold">
                  {donation.user.userName} donated ₹{donation.amount}
                </span>
                <span className="text-gray-500 text-xs">
                  {donation.message}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DonationCard;
