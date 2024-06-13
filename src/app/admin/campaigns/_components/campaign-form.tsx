"use client";

import { addNewCampaign, editCampaign } from "@/actions/campaigns";
import { uploadImagesToFirebase } from "@/helpers/upload";
import { Button, Form, Input, Select, Switch, Upload, message } from "antd";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Environment", value: "environment" },
  { label: "Human Rights", value: "human-rights" },
  { label: "Animals", value: "animals" },
  { label: "Arts", value: "arts" },
  { label: "Community", value: "community" },
  { label: "Sports", value: "sports" },
  { label: "Technology", value: "technology" },
  { label: "Other", value: "other" },
];

interface Props {
  initialData?: any;
  isEditForm?: boolean;
}

function CampaignForm({ initialData, isEditForm = false }: Props) {
  const [loading = false, setLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState(initialData?.isActive || false);
  const [showDonorsInCampaign, setShowDonorsInCampaign] = useState(
    initialData?.showDonorsInCampaign || false
  );
  const [newlySelectedFiles = [], setNewlySelectedFiles] = useState<any[]>([]);

  const [existingImages, setExistingImages] = useState<any[]>(
    initialData?.images || []
  );

  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      values.isActive = isActive;
      values.showDonorsInCampaign = showDonorsInCampaign;

      const newlyUploadedImages = await uploadImagesToFirebase(
        newlySelectedFiles
      );

      values.images = [...existingImages, ...newlyUploadedImages];

      let response: any = null;

      if (isEditForm) {
        values._id = initialData._id;
        response = await editCampaign(values);
      } else {
        response = await addNewCampaign(values);
      }

      if (response.error) {
        throw new Error(response.error);
      }
      message.success(response.message);
      router.refresh();
      router.push("/admin/campaigns");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={(values) => {
        onFinish(values);
      }}
      initialValues={initialData}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-3">
          <Form.Item
            label="Campaign Name"
            name="name"
            rules={[{ required: true, message: "Please input a name" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="lg:col-span-3">
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input a description" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </div>

        <Form.Item
          name="organizer"
          label="Organizer"
          rules={[{ required: true, message: "Please input an organizer " }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="targetAmount"
          label="Target Amount"
          rules={[
            {
              required: true,
              message: "Please input a target amount for the campaign",
            },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select options={categories} />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: "Please select an end date" }]}
        >
          <Input type="date" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="flex gap-5">
          <span>Show Donors in Campaign</span>
          <Switch
            checked={showDonorsInCampaign}
            onChange={(checked) => setShowDonorsInCampaign(checked)}
          />
        </div>
        <div className="flex gap-5">
          <span>Active</span>
          <Switch
            checked={isActive}
            onChange={(checked) => setIsActive(checked)}
          />
        </div>
      </div>

      <Upload
        className="mt-5"
        beforeUpload={(file) => {
          setNewlySelectedFiles([...newlySelectedFiles, file]);
          return false;
        }}
        listType="picture-card"
        multiple
      >
        Upload Images
      </Upload>

      <div className="flex flex-wrap mt-5 gap-5">
        {existingImages.map((image, index) => (
          <div
            className="p-3 border rounded flex flex-col gap-2 border-dashed"
            key={index}
          >
            <img className="w-24 h-24 object-cover" src={image} alt=""></img>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => {
                setExistingImages(existingImages.filter((_, i) => i !== index));
              }}
            >
              Delete
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-5 mt-5">
        <Button
          onClick={() => {
            router.push("/admin/campaigns");
          }}
        >
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default CampaignForm;
