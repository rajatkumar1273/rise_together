"use client";
import { Button, Input, Select } from "antd";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "", label: "All" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "environment", label: "Environment" },
  { value: "animals", label: "Animals" },
  { value: "human-rights", label: "Human Rights" },
  { value: "arts", label: "Arts" },
  { value: "sports", label: "Sports" },
  { value: "community", label: "Community" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category = "", setCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [organizer = "", setOrganizer] = useState<string>(
    searchParams.get("organizer") || ""
  );

  return (
    <div className="flex flex-wrap gap-5 my-5 items-end">
      <div className="flex flex-col w-96">
        <span className="text-sm font-semibold text-gray-500 my-2">
          Select Category
        </span>
        <Select
          value={category}
          options={options}
          onChange={(value) => setCategory(value)}
        />
      </div>

      <div className="flex flex-col w-96">
        <span className="text-sm font-semibold text-gray-500 my-2">
          Search by Organizer
        </span>
        <Input
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          placeholder="Search by organizer"
        />
      </div>

      <Button
        onClick={() => {
          router.push(`/`);
          setCategory("");
          setOrganizer("");
        }}
      >
        Reset Filters
      </Button>

      <Button
        type="primary"
        onClick={() => {
          router.push(`/?category=${category}&organizer=${organizer}`);
        }}
      >
        Apply Filters
      </Button>
    </div>
  );
}

export default Filters;
