export default function UsersLayout({
    children
} : {
    children: React.ReactNode;
}) {
    return (
        <div className="users-container">
            <main>{children}</main>
        </div>
    )
}