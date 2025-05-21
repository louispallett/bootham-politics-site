export default function UpdatePublish({ published }: { published: boolean }) {
    return (
        <button className="submit">
            { published ? (
                <>Unpublish</>
            ) : (
                <>Publish</>
            )}
        </button>
    )
}