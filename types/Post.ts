export interface PostHeading {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  image: string;
  order: number;
  questions: number[];
}

export interface PostContent {
  body: string;
}

export type Post = PostHeading & PostContent;
