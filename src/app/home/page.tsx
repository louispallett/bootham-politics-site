import Posts from "./Posts";

export const runtime = "nodejs";

export default async function Home() {
  return (
    <div>
      <WelcomeMessage />
      <Posts />
    </div>
  );
}

function WelcomeMessage() {
  return (
    <div className="users-container my-8">
      <p className="text-center mb-2.5">
        <b>Welcome to the Bootham Politics Site</b>
      </p>
      <p>
        This site brings together useful articles, news stories and PDFs to
        support your A-Level Politics studies. Everything is tagged by topic, so
        you can easily find material linked to the specification, current
        debates and exam themes. Use the feed to keep up to date with UK and
        global politics, deepen your understanding of key ideas, and build
        real-world examples for essays and discussion. Check back regularly, new
        content is added as politics unfolds.
      </p>
    </div>
  );
}
