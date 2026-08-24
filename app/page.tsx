import { Spread } from "@/components/Spread";
import { TwoLives } from "@/components/TwoLives";
import { Doors } from "@/components/Doors";
import { getCanonStats } from "@/lib/canon-stats";

/*
  A server component so the Canon's live counts are fetched on the server and
  handed down. The credentials never reach the browser, and the figure is
  already in the HTML rather than arriving after a client round trip.
*/
export default async function HomePage() {
  const stats = await getCanonStats();

  return (
    <main id="main">
      <Spread counts={stats} />
      <TwoLives />
      <Doors />
    </main>
  );
}
