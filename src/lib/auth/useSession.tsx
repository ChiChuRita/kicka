import { getSession } from "@kicka/actions/auth";
import { useQuery } from "@tanstack/react-query";

export const useSession = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: () => getSession(),
  });
