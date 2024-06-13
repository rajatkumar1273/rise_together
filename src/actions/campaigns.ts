"use server";

import { getCurrentUserDataFromDB } from "./users";
import { connectToDatabase } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import DonationModel from "@/models/donation-model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

connectToDatabase();

export const addNewCampaign = async (reqBody: any) => {
  try {
    const currentUser = await getCurrentUserDataFromDB();
    reqBody.createdBy = currentUser.data._id;
    const campaign = new CampaignModel(reqBody);
    await campaign.save();
    revalidatePath("/admin/campaigns");
    return {
      message: "Campaign added successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const editCampaign = async (reqBody: any) => {
  try {
    await CampaignModel.findOneAndUpdate(
      { _id: reqBody._id },
      { $set: reqBody }
    );

    revalidatePath(`/admin/campaigns/edit-campaign/${reqBody._id}`);

    return {
      message: "Campaign updated successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const deleteCampaign = async (id: string) => {
  try {
    await CampaignModel.findByIdAndDelete(id);
    revalidatePath("/admin/campaigns");

    return {
      message: "Campaign deleted successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getCampaignReportsById = async (id: string) => {
  try {
    const campaignIdInObjectFormat = new mongoose.Types.ObjectId(id);
    let [donationsCount, totalAmountRaised, donations] = await Promise.all([
      DonationModel.countDocuments({ campaign: id }),
      DonationModel.aggregate([
        {
          $match: {
            campaign: campaignIdInObjectFormat,
          },
        },
        {
          $group: {
            _id: null,
            totalAmountRaised: { $sum: "$amount" },
          },
        },
      ]),
      DonationModel.find({ campaign: id })
        .populate("user")
        .populate("campaign")
        .sort({ createdAt: -1 }),
    ]);

    totalAmountRaised = totalAmountRaised[0]?.totalAmountRaised || 0;

    return {
      data: {
        donationsCount,
        totalAmountRaised,
        donations: JSON.parse(JSON.stringify(donations)),
      },
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
