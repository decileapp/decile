export interface PostHeading {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  image: string;
  order: number;
}

export interface Post extends PostHeading {
  body: string;
}
