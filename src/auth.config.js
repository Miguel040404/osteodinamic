// import Google from "@auth/core/providers/google"
// import GitHub from '@auth/core/providers/github'
// import Spotify from '@auth/core/providers/spotify'
// import Gitlab from '@auth/core/providers/gitlab'
import Credentials from "@auth/core/providers/credentials"
import { getUserByPhone } from "@/lib/data"

const AuthConfig ={
    providers: [
        // Google,
        // GitHub,
        // Spotify,
        // Gitlab,
        Credentials({
            async authorize(credentials) {
                console.log('AUTHORIZE');
                return await getUserByPhone(credentials.phone)
            },
        }),
    ]
}

export default AuthConfig;