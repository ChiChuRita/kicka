import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const Protect = async (children: React.ReactNode) => {
  const session = await getServerSession();

  if (!session) redirect("/api/auth/signin");
  return <>{children}</>;
};
