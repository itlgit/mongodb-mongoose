import mongoose from 'mongoose';

// Attributes required to create a new BlogPost
export interface BlogPostAttrs {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
  published?: boolean;
  createdAt: Date;
}

// A BlogPost document (what's returned from MongoDB)
export interface BlogPostDoc extends mongoose.Document {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// The Model with a custom `build` helper for type-safe construction
export interface BlogPostModel extends mongoose.Model<BlogPostDoc> {
  build(attrs: BlogPostAttrs): BlogPostDoc;
}

const blogPostSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add a static `build` to enforce attributes at compile time
blogPostSchema.statics.build = (attrs: BlogPostAttrs) => {
  return new BlogPost(attrs);
};

const BlogPost =
  (mongoose.models?.BlogPost as BlogPostModel) ||
  mongoose.model<BlogPostDoc, BlogPostModel>('BlogPost', blogPostSchema);

export { BlogPost };

export default BlogPost;
