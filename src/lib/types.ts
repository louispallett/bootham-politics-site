export interface PostType {
    _id: string,
    title: string,
    content: string,
    author: string,
    tags: string[],
    published: boolean,
    creationDate: Date
}

export interface TagType {
    _id: string,
    name: string
}