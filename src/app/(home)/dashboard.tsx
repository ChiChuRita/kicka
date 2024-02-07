import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import Hero from "./hero";
import Play from "./(game)/play";
import { getAllOtherUsers } from "@kicka/actions";

export default async function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-5">
      <Hero />
      <Play />
    </div>
  );
}
