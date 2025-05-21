import User from "@/models/User";
import Tag from "@/models/Tag";
import Post from "@/models/Post";
import { connectToDB } from "./db";
import { PostType } from "./types";

export async function getAllPosts() {
    try {
        await connectToDB();
    
        const posts = await Post.find()
            .populate(
            {
                path: "author", select: "firstName lastName -_id", model: User
            })
            .populate({ path: "tags", select: "name -_id", model: Tag})
            .sort("-creationDate").lean();
        return posts;
    } catch (err: any) {
        console.error("Error fetching posts:", err);
        throw new Error(err.message || "Server failed to fetch posts");
    }
}

export async function getPostById(id: string): Promise<PostType> {
    await connectToDB();

    const post = await Post.findById(id)
        .populate(
        {
            path: "author", select: "firstName lastName -_id", model: User
        })
        .populate({ path: "tags", select: "name", model: Tag})
        .lean();
    return post;
}

export async function getPostsWithTag(tagId: string): Promise<PostType[]> {
	const posts: PostType[] = await Post.find({ tags: { $in: [tagId] } });
	return posts;
}

//? IMPORTANT - using .populate() with TypeScript
// 
// With our schemas in Mongoose, we can usually reference an ObjectId in a property like this: 
// 	author: { type: mongoose.Types.Schema, ref: "User" }
// This allows us to use populate() later on to ask mongoose to fetch the data stored in the user
// with the _id stored here, so we can easily access it. This is really simple in JS and Express.
//
// However, when using TypeScript, the compiler demands that the type be defined. We can define a type in 
// our types.ts file like so:
//
//      import { Types } from "mongoose"
//
// 	export interface PostType {
//    	    _id: string,
//	    title: string,
//    	    content: string,
//    	    author: Types.ObjectId | UserType,
//          tags: Types.ObjectId[] | TagType[],
//          published: boolean,
//          creationDate: Date,
//          creationDateFormatted: string
//      }
//
// And then when we fetch this, we can do something like:
//
//         const posts = await Post.find()
//            .populate(
//            {
//                path: "author", select: "firstName lastName -_id"
//            })
//            .populate({ path: "tags", select: "name -_id" })
//
// Right?
//
// Well, not quite - we face an issue here! TypeScript expects an explicit UserType (and TagType) here, but it instead gets a 
// mongoose 'ref' to 'User', which it doesn't recognise. Fixing this is actually very simple, but it can be difficult to 
// find an answer - the fix is to simply define models in your populate method:
//
// import User from "@/models/User";
// import Tag from "@/models/Tag";
//
//        const posts = await Post.find()
//            .populate(
//            {
//                path: "author", select: "firstName lastName -_id", model: User
//            })
//            .populate({ path: "tags", select: "name -_id", model: Tag })
//
// That's it!
// See this discussion here: https://stackoverflow.com/questions/26818071/mongoose-schema-hasnt-been-registered-for-model
// (solution in link above by user3616725)
//! You DO NOT need to insert the author and tag values as anything other than plain strings (representing documents _ids).