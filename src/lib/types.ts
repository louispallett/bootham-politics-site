import { Types } from "mongoose";

export interface PostType {
  _id: string;
  title: string;
  bannerURL?: string;
  cloudinaryId?: string;
  bannerCaption?: string;
  synopsis: string;
  content: string;
  author: Types.ObjectId | UserType;
  tags: Types.ObjectId[] | TagType[];
  published: boolean;
  creationDate: Date;
  creationDateFormatted: string;
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
