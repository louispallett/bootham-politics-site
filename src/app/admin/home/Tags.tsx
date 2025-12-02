import { TagType } from "@/lib/types";
import Link from "next/link";

type TagsProps = {
  allTags: TagType[];
  register: any;
  selectedTags?: TagType[];
};

export default function Tags({ allTags, register }: TagsProps) {
  return (
    <div className="tag-container">
      <div className="flex gap-1.5 items-center">
        <h4>Tags</h4>
        <p>
          <i>(optional)</i>
        </p>
      </div>
      <p className="my-1.5">
        Tags are optional and you can add or remove them at any time. Click{" "}
        <Link href="/admin/home/manage-tags" className="link">
          here
        </Link>{" "}
        to create a new tag
      </p>
      <div className="flex flex-wrap gap-5">
        {allTags.map((tag) => (
          <TagCard tag={tag} register={register} key={tag._id} />
        ))}
      </div>
    </div>
  );
}

function TagCard({ tag, register }: { tag: TagType; register: any }) {
  return (
    <div className="flex gap-1 flex-wrap justify-center items-center">
      <input
        type="checkbox"
        id={tag._id}
        name={tag._id}
        {...register(tag._id, {})}
      />
      <label htmlFor={tag._id}>{tag.name}</label>
    </div>
  );
}
