import { getAllPosts } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";
import Posts from "./Posts";

// FIXME: Fix filter function (need to add tags into an array in order to select multiple, or make it into a drop down to select just one.)
// TODO: Apply sort functionality
// FIXME: General responsive design for smaller screens (down to at least 340px):
//      - Margin (x) of containers, put these down to zero to give the articles maximum space.
//      - Set title in HEADER to be hidden on smallest screens (but keep logo)
//      - Fix logo on /home screen.
//      - Wrap list of files in FileManager (wrapping file btn and delete btn with flex-col).
//      - Tags (open client side):
//        - Wrap these around using a grid wrap or flex wrap.
//        - Simplify the styling on smaller screens.

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
