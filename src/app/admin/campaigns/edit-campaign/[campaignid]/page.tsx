export const dynamic = "force-dynamic";

import PageTitle from "@/components/page-title";
import React from "react";
import CampaignForm from "../../_components/campaign-form";
import { connectToDatabase } from "@/db/config";
import CampaignModel from "@/models/campaign-model";

connectToDatabase();

interface Props {
  params: {
    campaignid: string;
  };
}

async function EditCampaignPage({ params }: Props) {
  const campaign = await CampaignModel.findById(params.campaignid);

  return (
    <div>
      <PageTitle title="Edit Campaign" />
      {campaign && (
        <CampaignForm
          isEditForm={true}
          initialData={JSON.parse(JSON.stringify(campaign))}
        />
      )}
    </div>
  );
}

export default EditCampaignPage;
