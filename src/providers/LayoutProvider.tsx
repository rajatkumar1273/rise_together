"use client";
import React, { useState, useEffect, use } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button, Dropdown, Spin, message } from "antd";
import { getCurrentUserDataFromDB } from "@/actions/users";
import { usePathname, useRouter } from "next/navigation";

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [menuToShow, setMenuToShow] = useState<any>([]);
  const pathName = usePathname();
  const router = useRouter();

  const userMenu = [
    {
      name: "Dashboard",
      url: "/profile/dashboard",
    },
    {
      name: "Donations",
      url: "/profile/donations",
    },
  ];
  const adminMenu = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
    },
    {
      name: "Donations",
      url: "/admin/donations",
    },
    {
      name: "Campaigns",
      url: "/admin/campaigns",
    },
    {
      name: "Users",
      url: "/admin/users",
    },
  ];

  const getCurrentUser = async () => {
    try {
      const response = await getCurrentUserDataFromDB();

      if (response.error) {
        throw new Error(response.error);
      }

      setCurrentUser(response.data);

      if (response.data?.isAdmin) {
        setMenuToShow(adminMenu);
      } else {
        setMenuToShow(userMenu);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getHeader = () => {
    // if the route is /sign-in or /sign-up then don't show the header
    if (pathName.includes("/sign-in") || pathName.includes("/sign-up")) {
      return null;
    }

    return (
      <div className="p-3 bg-primary flex justify-between items-center">
        <h1
          className="font-semibold text-2xl text-white mx-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          RISE TOGETHER
        </h1>
        <div className="bg-white rounded py-2 px-3 flex items-center gap-5">
          <Dropdown
            menu={{
              items: menuToShow.map((menu: any) => ({
                key: menu.name,
                label: menu.name,
                onClick: () => router.push(menu.url),
              })),
            }}
          >
            <Button type="link" className="text-primary">
              {currentUser?.userName} <i className="fas fa-caret-down"></i>
            </Button>
          </Dropdown>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    );
  };

  const getContent = () => {
    // if the route is private, then render children only after getting current user
    const isPrivateRoute = pathName !== "/sign-in" && pathName !== "/sign-up";
    const isAdminRoute = pathName.includes("/admin");
    if (isPrivateRoute && !currentUser)
      return (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      );

    if (isPrivateRoute && currentUser && isAdminRoute && !currentUser.isAdmin) {
      return (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-semibold text-gray-500">
            You are not authorized to view this page
          </h1>
        </div>
      );
    }

    return <div className={`${isPrivateRoute ? "p-3" : ""}`}>{children}</div>;
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div>
      {getHeader()}
      {getContent()}
    </div>
  );
};

export default LayoutProvider;
