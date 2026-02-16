import Post from "./Post";

<<<<<<< HEAD
export default async function Page({
=======
export const runtime = "nodejs";

export default async function Post({
>>>>>>> main
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Post id={id} />;
}
