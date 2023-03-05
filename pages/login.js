import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Login() {
    const supabase = useSupabaseClient()

    return(
        <div className="w-scren h-screen flex flex-col justify-around">
            <div className="flex flex-row justify-around">
                <div className="border w-144 p-8">
                    <h1 className="font-black text-6xl">Login to OpenMed</h1>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        providers={['google']}
                    ></Auth>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    const supabase = createServerSupabaseClient(ctx)
    const {
      data: { session },
    } = await supabase.auth.getSession()
    
    if(session)
      return {
        redirect: {
          destination: '/',
          permanant: false
        },
      }

    return{
        props: {
            initialSession: session
        }
    }

}