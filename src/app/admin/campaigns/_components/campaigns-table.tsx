"use client";
import { Button, Table, message } from "antd";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCampaign } from "@/actions/campaigns";
import CampaignReportsModal from "./campaign-report-modal";

interface Props {
  campaigns: CampaignType[];
  pagination?: any;
}

const CampaignsTable = ({ campaigns, pagination = true }: Props) => {
  const router = useRouter();
  const [loading = false, setLoading] = useState<boolean>(false);
  const [selectedCampaign = null, setSelectedCampaign] =
    useState<CampaignType | null>(null);
  const [showReportModal = false, setShowReportModal] =
    useState<boolean>(false);

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const result = await deleteCampaign(id);

      if (result.error) {
        throw new Error(result.error);
      }

      message.success("Campaign deleted successfully");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render(category: string) {
        return <span>{category.toUpperCase()}</span>;
      },
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
    },
    {
      title: "Target Amount",
      dataIndex: "targetAmount",
      key: "targetAmount",
      render(targetAmount: number) {
        return <span>₹ {targetAmount}</span>;
      },
    },
    {
      title: "Collected Amount",
      dataIndex: "collectedAmount",
      key: "collectedAmount",
      render(collectedAmount: number) {
        return <span>₹ {collectedAmount}</span>;
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Action",
      key: "action",
      render(record: CampaignType) {
        return (
          <div className="flex gap-5 justify-center items-center">
            <Button
              onClick={() => {
                setSelectedCampaign(record);
                setShowReportModal(true);
              }}
              size="small"
            >
              Report
            </Button>
            <Button
              onClick={() =>
                router.push(`/admin/campaigns/edit-campaign/${record._id}`)
              }
              size="large"
              icon={<i className="ri-edit-line"></i>}
            />
            <Button
              size="large"
              onClick={() => onDelete(record._id)}
              icon={<i className="ri-delete-bin-6-line"></i>}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={campaigns}
        loading={loading}
        rowKey="_id"
        pagination={pagination === undefined ? true : pagination}
        scroll={{ x: true }}
      />

      {showReportModal && (
        <CampaignReportsModal
          showCampaignReportsModal={showReportModal}
          setShowCampaignReportsModal={setShowReportModal}
          selectedCampaign={selectedCampaign}
        />
      )}
    </div>
  );
};

export default CampaignsTable;
