import PageTitle from "@/components/page-title";
import React from "react";
import { connectToDatabase } from "@/db/config";
import DonationModel from "@/models/donation-model";
import { getCurrentUserDataFromDB } from "@/actions/users";
import DonationTable from "@/components/donation-table";

connectToDatabase();

const DonationsPage = async () => {
  const mongoUser = await getCurrentUserDataFromDB();
  const donations = await DonationModel.find({
    user: mongoUser.data._id,
  })
    .populate("campaign")
    .populate("user")
    .sort({ createdAt: -1 });

  return (
    <div>
      <PageTitle title="Donations" />
      <DonationTable
        donations={JSON.parse(JSON.stringify(donations))}
        fromAdmin={false}
      />
    </div>
  );
};

export default DonationsPage;
