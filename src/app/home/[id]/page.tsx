import Post from "./Post";


export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Post id={id} />;
}
