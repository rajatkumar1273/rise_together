"use client";

import React from "react";
import { ConfigProvider } from "antd";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#074173",
            borderRadius: 2,
          },
          components: {
            Button: {
              controlHeight: 40,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              controlOutline: "none",
              colorBorder: "#074173",
              borderColorDisabled: "#d9d9d9",
            },
            Input: {
              controlHeight: 40,
              activeBorderColor: "#074173",
              hoverBorderColor: "#074173",
              activeShadow: "0 0 0 2px rgba(7, 65, 115, 0.2)",
            },
            Select: {
              controlHeight: 40,
              controlOutline: "none",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </div>
  );
};

export default ThemeProvider;
