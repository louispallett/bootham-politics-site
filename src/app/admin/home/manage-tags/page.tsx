import { getAllTags } from "@/lib/tags";
import CreateTagForm from "./CreateTagForm";
import AllTags from "./AllTags";

export const runtime = "nodejs";

export default async function Tags() {
  const tags = await getAllTags();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col lg:grid grid-cols-2 gap-2.5">
        <CreateTagForm />
        <AllTags tags={tags} />
      </div>
    </div>
  );
}
