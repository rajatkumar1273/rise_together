import PageTitle from "@/components/page-title";
import React from "react";
import CampaignForm from "../_components/campaign-form";

const NewCampaignPage = () => {
  return (
    <div>
      <PageTitle title="New Campaign" />
      <CampaignForm />
    </div>
  );
};

export default NewCampaignPage;
