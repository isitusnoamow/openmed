import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function Home({initialSession, initialUser}){
  const session = initialSession
  const user = initialUser
  console.log(user)
  return(
    <>
      <div className="">

      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  return{
      props: {
          initialSession: session,
          initialUser: session["user"]["user_metadata"]
      }
  }

}