interface CampaignType {
  _id: string;
  name: string;
  organizer: string;
  description: string;
  images: string[];
  targetAmount: number;
  collectedAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  showDonorsInCampaign: boolean;
  createdBy: UserType;
}

interface UserType {
  _id: string;
  userName: string;
  email: string;
  profilePic: string;
  isActive: boolean;
  isAdmin: boolean;
  clerkUserId: string;
}

interface DonationType {
  _id: string;
  amount: number;
  paymentId: string;
  campaign: CampaignType;
  user: UserType;
  message: string;
}
