import { Types } from "mongoose";

export interface PostType {
  _id: string;
  title: string;
  bannerURL?: string;
  cloudinaryId?: string;
  bannerCaption?: string;
  synopsis: string;
  content: string;
  author: Types.ObjectId;
  tags: Types.ObjectId[];
  published: boolean;
  creationDate: Date;
  creationDateFormatted: string;
}

export interface PostPopulated extends Omit<PostType, "author" | "tags"> {
  author: Pick<UserType, "firstName" | "lastName">;
  tags: Pick<TagType, "name" | "_id">[];
}

export interface TagType {
  _id: string;
  name: string;
}

export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  fullname: string;
}

export interface DocumentType {
  _id: string;
  postId: Types.ObjectId | PostType;
  uploader: Types.ObjectId | UserType;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  s3Bucket: string;
  createdAt: Date;
  url?: string;
}

export interface HttpError {
  status: number;
  message: string;
}
