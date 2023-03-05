import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { BsSearch } from "react-icons/bs"
import Link from "next/link"
import { useRef, useEffect } from "react"
import { MdUpload } from "react-icons/md"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"

export default function Home({initialSession}){
  const supabase = useSupabaseClient()
  const session = initialSession
  const searchRef = useRef()
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  function signOut() {
    supabase.auth.signOut()
    router.push("/")
  }

  function onSearch(){
    if(searchRef && searchRef.current){
        router.push({
            'pathname': '/results',
            'query': { q: searchRef.current.value}
        })
    }
  }

  function fetchPosts(){
    supabase.from('posts')
      .select('id, title, symptoms, sources, photo, created_at, author')
      .order('created_at', {ascending: false})
      .then(result => {
        console.log(result)
      })
  }

  return(
    <>
    
      <div className="flex justify-between items-center border-white p-4 border-b-2">
        <Link href="/" className="text-4xl font-extrabold">OpenMed</Link>
        <form className="flex-grow px-8 flex items-center justify-between" onSubmit={() => onSearch()}>
          <input type="search" className="border-black border-2 p-2 rounded-full bg-white flex-grow mx-2 text-black" placeholder="Search OpenMed" ref={searchRef}/>
          <button type="submit" className="border-black border-2 p-3 rounded-full bg-blue-700 cursor-pointer"><BsSearch /></button>
        </form>
        <div className="flex items-center">
          {!session ?
            <>
              <Link href="/login" className="bg-blue-700 rounded-full p-2 text-white font-semibold cursor-pointer">Sign in</Link>
            </>
            :
            <>
              <h1 className="text-2xl mx-2">{initialSession["user"]["user_metadata"]["name"]}</h1>
              <Link href="/upload" className="mx-2 text-2xl bg-blue-700 p-2 rounded-full cursor-pointer">
                <MdUpload />
              </Link>
              <button onClick={() => signOut()} className="mx-2 bg-blue-700 p-2 rounded-full cursor-pointer">Sign Out</button>
            </>
          }
        </div>
      </div>

      <div className="w-full mx-auto bg-none bg-primary">
        <div className="w-144 mx-auto p-8">
          <h1 className="text-5xl font-bold">New Posts</h1>
        </div>
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
      }
  }

}