export interface PostType {
    _id: string,
    title: string,
    content: string,
    author: UserType,
    tags: TagType[],
    published: boolean,
    creationDate: Date,
    creationDateFormatted: string
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