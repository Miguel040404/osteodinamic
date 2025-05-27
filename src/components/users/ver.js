import { UserIcon } from "lucide-react";


function UserVer({ user }) {
    return (
        <div>
            <div className="grid md:grid-cols-[80px_auto]">
                {/* {user.image
                    ? <img src={user.image} alt="Imagen de usuario" width={64} />
                    : <UserIcon className="size-16" />
                } */}
                <img src={user.image || '/images/avatar-80.png'} alt="Imagen de usuario" width={192} />

                <div>
                    <h1 className="text-xl">{user.name}</h1>
                    <p className="text-xs text-gray-500">email: {user.email}</p>
                </div>
            </div>

            <p className="font-bold my-4">Post realizados</p>
            <p className="flex flex-col gap-1">
                {user.posts
                    ?.sort((a, b) => a.slug.localeCompare(b.slug))
                    .map(post =>
                        <span key={post.id} className="">
                            {post.title}
                        </span>
                    )}
            </p>
        </div>
    );
}

export default UserVer;