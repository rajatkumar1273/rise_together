"use client";

import { Table } from "antd";
import dayjs from "dayjs";
import React from "react";

interface DonationTableProps {
  donations: DonationType[];
  fromAdmin: boolean;
  pagination?: any;
  fromCampaign?: boolean;
}

function DonationTable({
  donations,
  fromAdmin = false,
  pagination,
  fromCampaign = false,
}: DonationTableProps) {
  let columns: any[] = [
    {
      title: "Campaign",
      dataIndex: "campaign",
      key: "campaign",
      render: (campaign: CampaignType) => {
        return <span>{campaign.name}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => {
        return <span>₹ {amount}</span>;
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message: string) => {
        return <span>{message}</span>;
      },
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Date) => {
        return <span>{dayjs(createdAt).format("MMMM DD, YYYY hh:mm A")}</span>;
      },
    },
  ];

  if (fromAdmin) {
    // add user column after campaign column
    columns.splice(1, 0, {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: UserType) => {
        return <span>{user.userName}</span>;
      },
    });
  }

  if (fromCampaign) {
    // remove campaign column
    columns = columns.filter((column) => column.key !== "campaign");
  }

  return (
    <div>
      <Table
        dataSource={donations}
        columns={columns}
        pagination={pagination}
        scroll={{ x: true }}
      />
    </div>
  );
}

export default DonationTable;
