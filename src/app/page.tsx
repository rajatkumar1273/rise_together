import { handleNewUserRegistration } from "@/actions/users";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import CampaignCard from "@/components/campaign-card";
import Filters from "@/components/filters";

connectToDatabase();

export default async function Home({ searchParams }: { searchParams: any }) {
  // console.log("searchParams", searchParams);

  await handleNewUserRegistration();

  let filters: any = {
    isActive: true,
  };
  if (searchParams.category) {
    filters.category = searchParams.category;
  }

  if (searchParams.organizer) {
    filters.organizer = {
      $regex: searchParams.organizer,
      $options: "i",
    };
  }

  const campaigns: CampaignType[] = (await CampaignModel.find(filters).sort({
    createdAt: -1,
  })) as any;

  return (
    <div>
      <Filters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
        {campaigns.map((campaign) => (
          <CampaignCard
            campaign={JSON.parse(JSON.stringify(campaign))}
            key={campaign._id}
          />
        ))}
      </div>
    </div>
  );
}
