"use server";

import { connectToDatabase } from "@/db/config";
import { currentUser } from "@clerk/nextjs/server";
import UserModel from "@/models/user-model";

connectToDatabase();

export const handleNewUserRegistration = async () => {
  // handle new user registration here

  try {
    const loggedInUserData = await currentUser();

    // check if the user already exists in the database
    // if it exists then return the user data
    const existingUser = await UserModel.findOne({
      clerkUserId: loggedInUserData?.id,
    });
    if (existingUser) {
      return existingUser;
    }

    // create a new user in the database
    let userName = loggedInUserData?.username; // if the login is done via github

    if (!userName) {
      userName = loggedInUserData?.firstName + " " + loggedInUserData?.lastName; // if the login is done via email
      userName = userName?.replace("null", "");
    }

    const newUser = new UserModel({
      clerkUserId: loggedInUserData?.id,
      userName: userName,
      email: loggedInUserData?.emailAddresses[0]?.emailAddress,
      profilePic: loggedInUserData?.imageUrl,
    });

    await newUser.save();
    return newUser;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getCurrentUserDataFromDB = async () => {
  try {
    const loggedInUserData = await currentUser();
    const mongoUser = await UserModel.findOne({
      clerkUserId: loggedInUserData?.id,
    });

    return {
      data: JSON.parse(JSON.stringify(mongoUser)),
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
