// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

import { getAllPosts } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";
import Posts from "./Posts";

export default async function Home() {
	const posts = await getAllPosts();
	const tags = await getAllTags();

	const publishedPosts = posts.filter(post => post.published);

  return (
	<div>
		<p className="my-8">Welcome to Bootham School politics site. This site is...</p>
		<Posts 
			posts={JSON.parse(JSON.stringify(publishedPosts))}
			tags={JSON.parse(JSON.stringify(tags))}
		/>
	</div>
	);
}