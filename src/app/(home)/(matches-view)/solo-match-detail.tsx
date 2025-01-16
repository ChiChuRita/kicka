import { getSoloMatch } from "@kicka/actions";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@kicka/components/ui/avatar";
import { format } from "date-fns";
import { clsx } from "clsx";

interface SoloMatchDetailProps {
  matchID: string;
}

export default function SoloMatchDetail({ matchID }: SoloMatchDetailProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["solo-match", matchID],
    queryFn: () => getSoloMatch(matchID),
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-96 items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Match not found</p>
      </div>
    );
  }

  const winner = data.score0 > data.score1 ? data.player0 : data.player1;
  const isPlayer0Winner = data.score0 > data.score1;

  return (
    <div className="mx-auto max-w-4xl space-y-4 bg-background p-4 sm:p-8">
      <div className="bg-card p-4 sm:p-6 rounded-lg">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">
            Match Details
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {format(new Date(data.date), "PPp")}
          </p>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {/* Score Display */}
          <div className="flex items-center justify-center space-x-8 sm:space-x-20">
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <Avatar className={clsx(
                "h-14 w-14 sm:h-20 sm:w-20",
                data.draft && (data.accept0 ? "border-2 border-green-400" : "border-2 border-red-400")
              )}>
                <AvatarImage src={data.player0} />
                <AvatarFallback>{data.player0.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm sm:text-base font-medium text-card-foreground">
                {data.player0.username}
              </span>
              <span className="text-2xl sm:text-4xl font-bold text-card-foreground">
                {data.score0}
              </span>
              {data.rating0Change && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{Math.round(data.player0.solo?.rating ?? 0)}</span>
                  <span className={`flex items-center ${data.rating0Change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ({data.rating0Change > 0 ? '+' : ''}{Math.round(data.rating0Change)})
                  </span>
                </div>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-muted-foreground">VS</div>
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <Avatar className={clsx(
                "h-14 w-14 sm:h-20 sm:w-20",
                data.draft && (data.accept1 ? "border-2 border-green-400" : "border-2 border-red-400")
              )}>
                <AvatarImage src={data.player1.image} />
                <AvatarFallback>{data.player1.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm sm:text-base font-medium text-card-foreground">
                {data.player1.username}
              </span>
              <span className="text-2xl sm:text-4xl font-bold text-card-foreground">
                {data.score1}
              </span>
              {data.rating1Change && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{Math.round(data.player1.solo?.rating ?? 0)}</span>
                  <span className={`flex items-center ${data.rating1Change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ({data.rating1Change > 0 ? '+' : ''}{Math.round(data.rating1Change)})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Match Status */}
          <div className="rounded-lg bg-muted p-3 sm:p-4">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${data.draft ? 'text-yellow-500' : 'text-green-500'}`}>
                {data.draft ? 'Pending Confirmation' : 'Confirmed'}
              </span>
            </div>
            {data.draft && (
              <div className="mt-2 flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Acceptances</span>
                <div className="space-x-2">
                  <span className={data.accept0 ? 'text-green-500' : 'text-red-500'}>
                    {data.player0.username}
                  </span>
                  <span className={data.accept1 ? 'text-green-500' : 'text-red-500'}>
                    {data.player1.username}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
