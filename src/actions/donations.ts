"use server";

import { connectToDatabase } from "@/db/config";
import { getCurrentUserDataFromDB } from "./users";
import CampaignModel from "@/models/campaign-model";
import DonationModel from "@/models/donation-model";
import { message } from "antd";
import { revalidatePath } from "next/cache";

connectToDatabase();

export const addNewDonation = async (reqBody: any) => {
  try {
    const mongoUser = await getCurrentUserDataFromDB();
    reqBody.user = mongoUser?.data?._id;

    const newDonation = new DonationModel(reqBody);
    await newDonation.save();

    // update collected amount in campaign
    const campaign = (await CampaignModel.findById(reqBody.campaign)) as any;
    campaign.collectedAmount += reqBody.amount;
    await campaign.save();

    revalidatePath(`/campaigns/${campaign._id}`);
    revalidatePath(`/profile/donations`);

    return {
      success: true,
      message: "Donation added successfully",
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getDonationsByCampaignId = async (campaignId: string) => {
  try {
    const donations = await DonationModel.find({
      campaign: campaignId,
    }).populate("user");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(donations)),
    };
  } catch (error: any) {
    return { error: error.message };
  }
};
