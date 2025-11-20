import { getAllTags } from "@/lib/tags";
import CreatePostForm from "./CreatePostForm";

export default async function CreatePost() {
  const tags = await getAllTags();

  return (
    <>
      <div className="users-container">
        <h3 className="my-2.5">Create Post</h3>
        <Instructions />
        <CreatePostForm tags={tags} />
      </div>
      <FileInfo />
    </>
  );
}

function FileInfo() {
  return (
    <div className="standard-container file-uploader">
      <h4>Uploading Files</h4>
      <p>You can only upload files once you have created the post above.</p>
    </div>
  );
}

function Instructions() {
  return (
    <div className="pb-2.5">
      <p>
        To create a new post, complete the form elements below and click
        'Create'. This will then create a draft post, where you can continue
        editing and upload files
      </p>
      <p>
        The article will not publish on the home page until you select 'Publish'
        on the next page.
      </p>
    </div>
  );
}
