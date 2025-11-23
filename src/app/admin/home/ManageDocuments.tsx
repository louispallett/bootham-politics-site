import { getDocumentsByPostId } from "@/lib/documents";
import FileUploader from "./FileUploader";
import FileManager from "./FileManager";

type ManageDocumentsProps = {
  postId: string;
};

export default async function ManageDocuments({
  postId,
}: ManageDocumentsProps) {
  const postDocuments = await getDocumentsByPostId(postId);

  return (
    <>
      <FileManager postDocuments={JSON.parse(JSON.stringify(postDocuments))} />
      <FileUploader postId={postId} />
    </>
  );
}
