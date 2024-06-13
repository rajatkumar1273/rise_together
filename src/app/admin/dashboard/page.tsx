import DashboardCard from "@/components/dashboard-card";
import PageTitle from "@/components/page-title";
import React from "react";
import { connectToDatabase } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import DonationModel from "@/models/donation-model";
import CampaignsTable from "../campaigns/_components/campaigns-table";
import DonationTable from "@/components/donation-table";

connectToDatabase();

async function DashboardPage() {
  let [campaignsCount, donationsCount, totalAmountRaised] = await Promise.all([
    CampaignModel.countDocuments(),
    DonationModel.countDocuments(),
    DonationModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmountRaised: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  totalAmountRaised = totalAmountRaised[0]?.totalAmountRaised || 0;

  const [recentCampaigns, recentDonations] = await Promise.all([
    CampaignModel.find().sort({ createdAt: -1 }).limit(5),
    DonationModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user")
      .populate("campaign"),
  ]);

  return (
    <div>
      <PageTitle title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          cardTitle="Total Campaigns"
          description="Total number of campaigns including active and inactive"
          value={campaignsCount.toString()}
          onClickPath="/admin/campaigns"
        />

        <DashboardCard
          cardTitle="Total Donations"
          description="Total number of donations received for all campaigns"
          value={donationsCount.toString()}
          onClickPath="/admin/donations"
        />

        <DashboardCard
          cardTitle="Amount Raised"
          description="Total amount raised for all campaigns till date including active and inactive"
          value={`₹${totalAmountRaised}`}
          onClickPath=""
        />
      </div>

      <div className="mt-10">
        <h1 className="text-xl font-semibold text-gray-700">
          Recent Campaigns
        </h1>
        <CampaignsTable
          campaigns={JSON.parse(JSON.stringify(recentCampaigns))}
          pagination={false}
        />
      </div>

      <div className="mt-10">
        <h1 className="text-xl font-semibold text-gray-700">
          Recent Donations
        </h1>
        <DonationTable
          donations={JSON.parse(JSON.stringify(recentDonations))}
          fromAdmin
          pagination={false}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
