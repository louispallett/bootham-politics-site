'use client'

import { PostType, TagType } from "@/lib/types"
import { useState } from "react"

type BodyProps = {
    posts:PostType[],
    tags:TagType[]
}

export default function Body({ posts, tags }:BodyProps) {
    const allPosts = posts;
    const [statePosts, setStatePosts] = useState<PostType[] | null>(posts);
    const [currentFilter, setCurrentFilter] = useState<string | null>(null);

    const handleStatePostChange = (filter:string) => {
        if (currentFilter === filter) {
            setStatePosts(allPosts);
            setCurrentFilter(null);
        } else {
            const filteredPosts = allPosts.filter(x => 
                x.tags.some(tag => tag.name === filter)
            );
            setStatePosts(filteredPosts);
            setCurrentFilter(filter);
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-2.5">
            <div className="flex md:flex-col gap-2.5">
                <FilterPanel 
                    tags={tags} 
                    handleStatePostChange={handleStatePostChange} 
                    currentFilter={currentFilter}
                />
                <SortPanel />
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
            { statePosts?.map(post => (
                <PostCard data={post} key={post._id} />
            ))}
            </div>
        </div>
    )
}

type FilterPanelProps = {
    tags:TagType[],
    handleStatePostChange: (filter:string) => void,
    currentFilter:string | null
}

function FilterPanel({ tags, handleStatePostChange, currentFilter }:FilterPanelProps) {
	return (
		<div className="users-container self-start">
            <h4>Filter</h4>
            <p><b>By tag</b></p>
            <div className="bg-slate-50 rounded-md border-slate-600 border-2 text-black">
                { tags.map(tag => (
                    <TagFilter 
                        name={tag.name} id={tag._id} key={tag._id} 
                        handleStatePostChange={handleStatePostChange} 
                        currentFilter={currentFilter}
                    />
                ))}
            </div>
		</div>
	)
}

type TagFilterProps = {
    name:string,
    id:string,
    handleStatePostChange: (filter:string) => void,
    currentFilter:string | null
}

function TagFilter({ name, id, handleStatePostChange, currentFilter}:TagFilterProps) {
	return (
		<div 
            className={`hover:bg-slate-400 px-4.5 py-1.5 hover:cursor-pointer ${
                currentFilter === name ? "bg-slate-400" : ""}`}
            onClick={() => handleStatePostChange(name)}
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
