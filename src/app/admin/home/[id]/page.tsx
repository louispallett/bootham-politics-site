import { getPostById } from "@/lib/posts"

export default async function UpdatePost({ params }: { params: { id: string }}) {
    const data = await getPostById(params.id);

    return (
        <div className="users-container flex flex-col gap-2.5">
            { data ? (
                <>
                    <input type="text" defaultValue={data.title} className="form-input text-lg font-bold" />
                    <textarea defaultValue={data.content} className="form-input" ></textarea>
                </>
            ) : (
                <p>Waiting...</p>
            )}
        </div>
    )
}