// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

import { getAllPosts } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";
import Body from "./Body";

export default async function App() {
	const posts = await getAllPosts();
	const tags = await getAllTags();

	const publishedPosts = posts.filter(post => post.published);

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
			<Body 
				posts={JSON.parse(JSON.stringify(publishedPosts))}
				tags={JSON.parse(JSON.stringify(tags))}
			/>
		</div>
	);
}

function Intro() {
	return (
		<p className="my-8">Welcome to Bootham School politics site. This site is...</p>
	)
}