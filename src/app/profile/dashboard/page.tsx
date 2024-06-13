import React from "react";
import DashboardCard from "@/components/dashboard-card";
import PageTitle from "@/components/page-title";
import { connectToDatabase } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import DonationModel from "@/models/donation-model";
import DonationTable from "@/components/donation-table";
import { getCurrentUserDataFromDB } from "@/actions/users";
import mongoose from "mongoose";

connectToDatabase();

async function Dashboard() {
  const mongoUser = await getCurrentUserDataFromDB();
  const userId = new mongoose.Types.ObjectId(mongoUser.data._id);
  let [donationsCount, totalAmountRaised] = await Promise.all([
    DonationModel.countDocuments({
      user: mongoUser.data._id,
    }),
    DonationModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          totalAmountRaised: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  totalAmountRaised = totalAmountRaised[0]?.totalAmountRaised || 0;

  const recentDonations = await DonationModel.find({
    user: mongoUser.data._id,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("campaign");

  return (
    <div>
      <PageTitle title="Dashboard" />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardCard
            cardTitle="Total Donations"
            description="Total number of donations for all campaigns"
            value={donationsCount.toString()}
            onClickPath="/admin/donations"
          />

          <DashboardCard
            cardTitle="Amount Donated"
            description="Total amount donated for all campaigns till date"
            value={`₹${totalAmountRaised}`}
            onClickPath=""
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Recent Donations</h2>
        <DonationTable
          donations={JSON.parse(JSON.stringify(recentDonations))}
          fromAdmin={false}
        />
      </div>
    </div>
  );
}

export default Dashboard;
