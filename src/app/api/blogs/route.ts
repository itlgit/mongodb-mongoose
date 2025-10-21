import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import BlogPost from '@/models/blog-post';

// GET /api/blogs - return list of blog posts
export async function GET(_req: NextRequest) {
  try {
    await connectToDatabase();
    const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: posts });
  } catch (err: any) {
    console.error('GET /api/blogs error', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - create a new blog post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.title || !body?.content) {
      return NextResponse.json(
        { success: false, error: 'title and content are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const post = BlogPost.build
      ? BlogPost.build({
          id: ''+Math.random(),
          title: String(body.title),
          content: String(body.content),
          authorId: String(body.authorId),
          tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
          published: Boolean(body.published),
          createdAt: new Date(),
        })
      : new BlogPost({
          title: String(body.title),
          content: String(body.content),
          authorId: String(body.authorId),
          tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
          published: Boolean(body.published),
        });

    await post.save();

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/blogs error', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Mongoose requires a Node.js runtime (not Edge). Use 'nodejs' for this route.
export const runtime = 'nodejs';
