"use client";
import React from "react";
import { Button } from "antd";
import { useRouter } from "next/navigation";

interface LinkButtonProps {
  title: string;
  path: string;
  type?: "primary" | "default";
}

const LinkButton = ({ title, path, type = "default" }: LinkButtonProps) => {
  const router = useRouter();
  return (
    <Button
      type={type}
      onClick={() => {
        router.push(path);
      }}
      className="w-max"
    >
      {title}
    </Button>
  );
};

export default LinkButton;
