import { FlattenMaps } from "mongoose";
import { BlogPostDoc } from "@/models/blog-post";

export async function fetchBlogPosts(): Promise<FlattenMaps<BlogPostDoc>[]> {
  const response = await fetch('/api/blogs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching blog posts: ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(`API error: ${result.error}`);
  }

  return result.data as FlattenMaps<BlogPostDoc>[];
}

export async function createBlogPost(data: {
  title: string;
  content: string;
  authorId?: string;
  tags?: string[];
  published?: boolean;
}): Promise<FlattenMaps<BlogPostDoc>> {
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error creating blog post: ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(`API error: ${result.error}`);
  }

  return result.data as FlattenMaps<BlogPostDoc>;
}