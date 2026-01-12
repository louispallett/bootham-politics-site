import { getAllPosts } from "@/lib/posts";
import { PostPopulated } from "@/lib/types";
import Link from "next/link";

// FIXME: General responsive design for smaller screens (down to at least 340px):
//      - Margin (x) of containers, put these down to zero to give the articles maximum space.
//      - Wrap list of files in FileManager (wrapping file btn and delete btn with flex-col).
//      - Tags (open client side):
//        - Wrap these around using a grid wrap or flex wrap.
//        - Simplify the styling on smaller screens.

export default async function Home() {
  const posts = await getAllPosts();
  const publishedPosts = posts.filter((post) => post.published);

  return (
    <div>
      <WelcomeMessage />
      <div className="flex flex-col gap-2.5 flex-1">
        {publishedPosts.length > 0 ? (
          <>
            {publishedPosts.map((post: PostPopulated) => (
              <PostCard data={post} key={post._id} />
            ))}
          </>
        ) : (
          <div className="users-container">
            <h4>No Posts Yet</h4>
          </div>
        )}
      </div>
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

function PostCard({ data }: { data: PostPopulated }) {
  return (
    <Link href={"/home/" + data._id}>
      <div className="users-container border-none p-0!">
        <div className="rounded-b-none rounded-lg p-2.5">
          <h4>{data.title}</h4>
        </div>
        {data.bannerURL && (
          <img
            src={data.bannerURL}
            alt=""
            className="object-cover max-h-full min-w-full"
          />
        )}
        <p className="self-start italic px-2.5 py-3.5 sm:px-3 sm:py-4 dark:text-slate-100">
          {data.synopsis}
        </p>
        <div className="p-2.5 self-end">
          <div className="tag-wrapper">
            {data.tags.map((tag) => (
              <TagCard data={tag.name} key={tag.name} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function TagCard({ data }: { data: string }) {
  return (
    <div className="tag-container shadow-none!">
      <p>
        <b>{data}</b>
      </p>
    </div>
  );
}
