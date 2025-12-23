import { getPostById } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";
import ManageDocuments from "../ManageDocuments";
import FormWrapper from "./FormWrapper";

export default async function UpdatePost({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const data = await getPostById(id);
  const allTags = await getAllTags();

  // NextJS throws warning if we don't convert _id to simple string:
  for (let tag of data.tags) {
    tag._id = tag._id.toString();
  }

  const fullName = data.author
    ? data.author.firstName + " " + data.author.lastName
    : "Unknown Author";

  return (
    <>
      <div className="users-container flex flex-col gap-2.5">
        <PostInfo published={data.published} author={fullName} />
        <FormWrapper
          postData={JSON.parse(JSON.stringify(data))}
          allTags={JSON.parse(JSON.stringify(allTags))}
        />
      </div>
      <ManageDocuments postId={id} />
    </>
  );
}

function PostInfo({
  published,
  author,
}: {
  published: boolean;
  author: string;
}) {
  return (
    <>
      <div className="flex justify-between gap-2.5">
        <h3>Update Post</h3>
        {published ? (
          <div className="success">Published</div>
        ) : (
          <div className="danger">Not Published</div>
        )}
      </div>
      <p className="text-right">
        Created by <b>{author}</b>
      </p>
    </>
  );
}
