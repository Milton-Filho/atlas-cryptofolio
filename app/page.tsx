import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";

// Force dynamic rendering for this route since we use Clerk auth
export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const user = await currentUser();

    if (user) {
      redirect("/dashboard");
    }
  } catch (error) {
    // Ignore error during build/static generation if keys are missing
    console.error("Auth check failed (likely build time):", error);
  }

  return (
    <LandingPage />
  );
}
