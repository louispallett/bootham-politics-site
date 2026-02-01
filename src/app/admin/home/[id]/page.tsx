import { getPostById } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";
import ManageDocuments from "../ManageDocuments";
import FormWrapper from "./FormWrapper";

export const runtime = "nodejs";

export default async function UpdatePost({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const data = await getPostById(id);
  const allTags = await getAllTags();

  // NextJS throws warning if we don't convert _id to simple string:
  if (data) {
    for (let tag of data.tags) {
      tag._id = tag._id.toString();
    }
  }

  return (
    <>
      <div className="users-container">
        <FormWrapper
          postData={JSON.parse(JSON.stringify(data))}
          allTags={JSON.parse(JSON.stringify(allTags))}
        />
      </div>
      <ManageDocuments postId={id} />
    </>
  );
}
