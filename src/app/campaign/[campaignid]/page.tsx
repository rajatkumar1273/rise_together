import React from "react";
import CampaignModel from "@/models/campaign-model";
import { connectToDatabase } from "@/db/config";
import LinkButton from "@/components/link-button";
import DonationCard from "@/components/donation-card";
import DonationModel from "@/models/donation-model";

connectToDatabase();

interface SingleCampaignPageProps {
  params: {
    campaignid: string;
  };
}

async function SingleCampaignPage({ params }: SingleCampaignPageProps) {
  const campaign: CampaignType = (await CampaignModel.findById(
    params.campaignid
  )) as any;

  const recentDonations = await DonationModel.find({
    campaign: params.campaignid,
  })
    .populate("user", "userName")
    .sort({ createdAt: -1 })
    .limit(5);

  const getProperty = (key: string, value: any) => {
    if (!value) {
      return null;
    }

    return (
      <div className="flex flex-col justify-between">
        <span className="font-bold text-gray-800">{key}</span>
        <span className="text-gray-600">{value}</span>
      </div>
    );
  };

  const formatDescription = (description: string) => {
    return description.split("\n").map((line, index) => (
      <p key={index} className="text-gray-600 mb-2">
        {line}
      </p>
    ));
  };

  return (
    campaign && (
      <div className="flex flex-col">
        <LinkButton path="/" title="Back to all campaigns" />
        <h1 className="text-3xl font-bold text-center">{campaign.name}</h1>

        <div className="grid md:grid-cols-3 gap-7 grid-cols-1">
          <div className="col-span-2 flex flex-col gap-7">
            <div className="flex gap-5">
              {campaign.images.map((image) => (
                <img
                  src={image}
                  className="h-60 w-80 object-cover rounded"
                  key={image}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {getProperty("Organizer", campaign.organizer)}
              {getProperty("Start Date", campaign.startDate)}
              {getProperty("End Date", campaign.endDate)}
              {getProperty("Target Amount", `₹ ${campaign.targetAmount}`)}
              {getProperty("Collected Amount", `₹ ${campaign.collectedAmount}`)}
            </div>

            <div>
              <h2 className="text-xl font-bold">Description</h2>
              {formatDescription(campaign.description)}
            </div>
          </div>
          <div className="col-span-1">
            <DonationCard
              donations={JSON.parse(JSON.stringify(recentDonations))}
              campaign={JSON.parse(JSON.stringify(campaign))}
            />
          </div>
        </div>
      </div>
    )
  );
}

export default SingleCampaignPage;
