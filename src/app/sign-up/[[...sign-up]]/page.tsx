import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-primary h-screen flex justify-center items-center">
      <SignUp />
    </div>
  );
}
