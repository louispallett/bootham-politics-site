// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

import { getAllPosts } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";
import Posts from "./Posts";

export default async function Home() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const publishedPosts = posts.filter((post) => post.published);

  return (
    <div>
      <WelcomeMessage />
      <Posts
        posts={JSON.parse(JSON.stringify(publishedPosts))}
        tags={JSON.parse(JSON.stringify(tags))}
      />
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
