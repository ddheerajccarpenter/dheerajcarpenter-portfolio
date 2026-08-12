import { getAllPosts } from "@/lib/data/public";
import { PostsManager } from "@/components/admin/posts-manager";

export const revalidate = 0;

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="p-6 md:p-8">
      <PostsManager initialPosts={posts} />
    </div>
  );
}
