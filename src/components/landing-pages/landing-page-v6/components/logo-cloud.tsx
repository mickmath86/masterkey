import { Beacon } from './logos/beacon'
import { Hulu } from './logos/hulu'
import { Stripe } from './logos/stripe'
import { Supabase } from './logos/supabase'
import { VercelFull } from './logos/vercel'
import { Spotify } from './logos/spotify'

export const LogoCloud = () => {
    return (
        <div className="mx-auto mt-44 max-w-sm">
            <div>
                <p className="text-foreground mx-auto w-fit max-w-56 text-balance text-sm">Trusted by fast-growing companies around the world</p>
            </div>
            <div className="**:fill-foreground mt-4 grid grid-cols-2 items-center justify-center *:h-16 sm:grid-cols-3">
                <div className="flex h-full items-center justify-center px-2">
                    <Hulu
                        height={16}
                        width="auto"
                    />
                </div>
                <div className="flex items-center justify-center px-2">
                    <Spotify
                        height={22}
                        width="auto"
                    />
                </div>
                <div className="flex items-center justify-center px-2">
                    <Stripe
                        height={20}
                        width="auto"
                    />
                </div>

                <div className="flex items-center justify-center px-2">
                    <Beacon
                        height={16}
                        width="auto"
                    />
                </div>

                <div className="flex items-center justify-center px-2">
                    <VercelFull
                        height={16}
                        width="auto"
                    />
                </div>
                <div className="flex items-center justify-center px-2">
                    <Supabase
                        height={20}
                        width="auto"
                    />
                </div>
            </div>
        </div>
    )
}