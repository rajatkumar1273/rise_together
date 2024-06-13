"use client";

import React, { useEffect } from "react";
import { Modal, Spin, message } from "antd";
import { getCampaignReportsById } from "@/actions/campaigns";
import DashboardCard from "@/components/dashboard-card";
import DonationTable from "@/components/donation-table";

interface Props {
  showCampaignReportsModal: boolean;
  setShowCampaignReportsModal: (show: boolean) => void;
  selectedCampaign: CampaignType | null;
}

function CampaignReportsModal({
  showCampaignReportsModal,
  setShowCampaignReportsModal,
  selectedCampaign,
}: Props) {
  const [data = [], setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getData = async () => {
    try {
      setLoading(true);
      const result = await getCampaignReportsById(selectedCampaign?._id!);
      if (result.error) {
        throw new Error(result.error);
      }
      console.log(result.data);
      setData(result.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      open={showCampaignReportsModal}
      onCancel={() => setShowCampaignReportsModal(false)}
      footer={null}
      width={800}
    >
      <div className="flex flex-col">
        <span className="font-semibold text-gray-500">Campaign: </span>
        <span className="text-lg font-semibold text-gray-800">
          {selectedCampaign?.name}
        </span>
      </div>

      <hr className="my-5" />

      <div className="flex justify-center">{loading && <Spin />}</div>

      {data && (
        <div>
          <div className="grid grid-cols-2 gap-5">
            <DashboardCard
              cardTitle="Total Donations"
              description="Total number of donations received for this campaign"
              value={data.donationsCount}
              onClickPath={""}
            />

            <DashboardCard
              cardTitle="Total Amount Raised"
              description="Total amount raised for this campaign"
              value={`₹${data.totalAmountRaised}`}
              onClickPath={""}
            />
          </div>

          <div className="mt-5">
            <h1 className="text-sm font-semibold text-primary">Donations</h1>
            <DonationTable
              fromCampaign={true}
              donations={data.donations}
              fromAdmin={true}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CampaignReportsModal;
