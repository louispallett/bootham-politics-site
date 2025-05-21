// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

import { getAllPosts } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";
import { PostType, TagType } from "@/lib/types";

export default async function App() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const publishedPosts = posts.filter(post => post.published);
  console.log(publishedPosts);

  return (
    <div>
      <div className="flex justify-center items-center my-8 mt-16">
        <img src="/images/big-ben.svg" alt="" className="h-24"/>
        <div className="flex flex-col">
          <h1>Bootham School</h1>
          <h3 className="text-right">Politics Department</h3>
        </div>
      </div>
      <Intro />
      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="flex md:flex-col gap-2.5">
          <FilterPanel tags={tags} />
          <SortPanel />
        </div>
        <div className="flex flex-col gap-2.5 flex-1">
          { publishedPosts.map(post => (
            <PostCard data={post} key={post._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Intro() {
  return (
    <p className="my-8">Welcome to Bootham School politics site. This site is...</p>
  )
}

function FilterPanel({ tags }: { tags: TagType[] }) {
  return (
    <div className="users-container self-start">
      <h4>Filter</h4>
      <p><b>By tag</b></p>
      <div className="bg-slate-50 rounded-md border-slate-600 border-2 text-black">
        { tags.map(tag => (
          <TagFilter name={tag.name} id={tag._id} key={tag._id}/>
        ))}
      </div>
    </div>
  )
}

function TagFilter({ name, id }: { name:string, id:string }) {
  return (
    <div className="hover:bg-slate-200 rounded-md px-4.5 py-1.5 hover:cursor-pointer!"
    
    >
      {name}
    </div>
  )
}

function SortPanel() {
  return (
    <div className="users-container self-start">
      <h4>Sort</h4>
      <p><b>By creation date</b></p>
      <div className="flex gap-2.5">
        <input type="radio" id="ascending" name="sort" />
        <label htmlFor="ascending">Ascending</label>
      </div>
      <div className="flex gap-2.5">
        <input type="radio" id="descending" name="sort" defaultChecked />
        <label htmlFor="descending">Descending</label>
      </div>
    </div>
  )
}

function PostCard({ data }: { data: PostType }) {
  return (
    <div className="users-container flex flex-col gap-2.5">
      <h4>{data.title}</h4>
      <p>{data.content}</p>
      <div className="self-end">
        <div className="flex gap-2.5">
          { data.tags.map(tag => (
            <TagCard data={tag.name} key={tag.name} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TagCard({ data }: { data:string }) {
  return (
    <div className="tag-container shadow-none!">
      <p><b>{data}</b></p>
    </div>
  )
}
