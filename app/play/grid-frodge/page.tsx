export const metadata = {
  title: "GridFrodge – Play",
  description:
    "A real-time multiplayer grid game. Claim cells, build streaks, drop bombs.",
};

export default function GridFrodgePage() {
  return (
    <main className="w-full h-screen bg-[#07080c] flex flex-col">
      <iframe
        src="https://gridforgefrontend-production.up.railway.app/"
        className="w-full flex-1 border-0"
        allow="fullscreen"
        title="GridFrodge"
      />
    </main>
  );
}
