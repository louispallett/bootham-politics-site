import { getPostById } from "@/lib/posts";

export default async function Post({ params }: { params: { id: string } }) {
  const { id } = await params;

  const data = await getPostById(id);

  return (
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
      {data.bannerCaption && (
        <p className="text-right px-2.5">
          <i>{data.bannerCaption}</i>
        </p>
      )}
      <div className="article sm:px-3 sm:py-4">
        <div className="article-synopsis-wrapper">
          <p className="italic dark:text-slate-100">{data.synopsis}</p>
          <p className="article-author">
            {data.author.firstName} {data.author.lastName}
          </p>
        </div>
        <div
          className="article-inner dark:text-slate-100"
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>
        <div className="self-end">
          <div className="flex gap-2.5">
            {data.tags.map((tag) => (
              <TagCard data={tag.name} key={tag.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
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

function Documents() {}

function Images() {}
