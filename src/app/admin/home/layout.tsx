export default function UsersLayout({
    children
} : {
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="users-container">
                <h4>Admin Controls</h4>
            </div>
            <main>{children}</main>
        </div>
    )
}