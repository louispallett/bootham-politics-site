import { getIcon } from "@/app/auxiliary";
import { getDocumentsByPostId } from "@/lib/documents";
import { getPostById } from "@/lib/posts";
import { DocumentType, PostType } from "@/lib/types";

export default async function Post({ params }: { params: { id: string } }) {
  const { id } = await params;

  const data = await getPostById(id);
  const documents = await getDocumentsByPostId(id);
  return (
    <>
      <Article data={data} />
      {documents.length > 0 && <Documents documents={documents} />}
    </>
  );
}

type ArticleProps = {
  data: PostType;
};

function Article({ data }: ArticleProps) {
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

type DocumentsProps = {
  documents: DocumentType[];
};

function Documents({ documents }: DocumentsProps) {
  return (
    <div className="users-container border-none p-0! mt-5">
      <div className="rounded-b-none rounded-lg p-2.5">
        <h4>Documents</h4>
      </div>
      <div className="flex flex-col m-2.5 gap-2.5">
        {documents.map((document: DocumentType) => (
          <FileCard file={document} key={document._id} />
        ))}
      </div>
    </div>
  );
}

type FileCardProps = {
  file: DocumentType;
};

function FileCard({ file }: FileCardProps) {
  const icon = getIcon(file.mimeType);
  return (
    <div className="flex gap-2.5">
      <a className="flex-1" href={file.url} target="_blank">
        <div className="flex items-center gap-2.5">
          <img src={`/images/file-icons/${icon}.svg`} className="h-8" />
          <p>
            <b>{file.originalName}</b>
          </p>
        </div>
      </a>
    </div>
  );
}
