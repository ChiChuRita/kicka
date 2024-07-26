import { getDuoMatch } from "@kicka/actions";
import { useQuery } from "@tanstack/react-query";

interface DuoMatchDetailProps {
  matchID: string;
}

export default function DuoMatchDetail({ matchID }: DuoMatchDetailProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["solo-match", matchID],
    queryFn: () => getDuoMatch(matchID),
  });

  return (
    <div className="p-8">
      <span className="text-red-600">Work in progress!!</span>
      <h1>DuoMatchDetail</h1>
      This was the match ID:
      <p>{matchID}</p>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>{JSON.stringify(data, null, 4)}</span>
      )}
    </div>
  );
}
