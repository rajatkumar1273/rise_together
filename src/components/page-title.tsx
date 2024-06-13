import React from "react";

const PageTitle = ({ title }: { title: string }) => {
  return <h1 className="text-2xl font-bold text-primary">{title}</h1>;
};

export default PageTitle;
