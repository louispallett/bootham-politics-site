export interface Post {
    _id: string,
    title: string,
    content: string,
    author: string,
    tags: string[],
    published: boolean,
    creationDate: Date
}