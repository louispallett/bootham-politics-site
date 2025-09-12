import { Types } from "mongoose"

export interface PostType {
    _id: string,
    title: string,
    bannerURL?: string,
    synopsis: string,
    content: string,
    author: Types.ObjectId | UserType,
    tags: Types.ObjectId[] | TagType[],
    published: boolean,
    creationDate: Date,
    creationDateFormatted: string,
}

export interface TagType {
    _id: string,
    name: string
}

export interface UserType {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    fullname: string
}