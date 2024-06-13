import { Spin } from "antd";
import React from "react";

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen fixed inset-0">
      <div className="h-10 w-10 border-4 border-primary border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Loading;
