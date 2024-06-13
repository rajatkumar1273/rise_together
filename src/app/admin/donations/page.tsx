import React from "react";
import DonationTable from "@/components/donation-table";
import PageTitle from "@/components/page-title";
import { connectToDatabase } from "@/db/config";
import DonationModel from "@/models/donation-model";

connectToDatabase();

const DonationsPage = async () => {
  const donations = await DonationModel.find({})
    .populate("campaign")
    .populate("user")
    .sort({ createdAt: -1 });

  return (
    <div>
      <PageTitle title="Donations" />
      <DonationTable
        donations={JSON.parse(JSON.stringify(donations))}
        fromAdmin={true}
      />
    </div>
  );
};

export default DonationsPage;
