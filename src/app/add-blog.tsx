import { createBlogPost } from '@/lib/client-queries';
import React from 'react';

type Props = {
  onPostCreated?: () => void;
  onCancel?: () => void;
};
export default function AddBlog(props: Props) {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBlogPost({ title, content });
      setMessage('Blog post created successfully!');
      setTitle('');
      setContent('');
      props.onPostCreated?.();
    } catch (err) {
      console.error('Error creating blog post:', err);
      setMessage('Failed to create blog post.');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setMessage(null);
    props.onCancel?.();
  };

  // Handle Esc key press
  React.useEffect(() => {
    titleRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Add New Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter your blog post title..."
            ref={titleRef}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Content:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical"
            placeholder="Write your blog post content here..."
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Create Post
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center font-medium ${
            message.includes('successfully')
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
