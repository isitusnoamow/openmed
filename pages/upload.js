import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState, useRef } from "react";
import { useRouter } from "next/router";

export default function upload(initialSession){
    const supabase = useSupabaseClient()
    const [imageUrl, setImageUrl] = useState(null)   
    const [uploading, setUploading] = useState(false)
    const titleRef = useRef()
    const symptomRef = useRef()
    const sourceRef = useRef()
    const router = useRouter()
    const session = initialSession
    function onSub(){
        if (uploading == false) {
            supabase.from('posts').insert({
                author: session.initialSession.user.id,
                authorName: session.initialSession.user.user_metadata.name,
                title: titleRef.current.value,
                symptoms: symptomRef.current.value,
                sources: sourceRef.current.value,
                photo: imageUrl
            }).then(response => {
                if(!response.error){
                    router.push('/')
                }else{
                    console.log(response)
                }
            })
        }
    }

    async function addPhoto(ev) {
        const file = ev.target.files[0]
        setUploading(true)
        const newName = Date.now() + file.name
        const result = await supabase
            .storage
            .from('photos')
            .upload(newName, file)
        if (result.data) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path;
            setImageUrl(url)
        } else {
            console.log(result)
            alert("failed please try again")
        }
        setUploading(false)
    }


    return(
        <div className="w-full h-full">
            <div className="w-scren h-screen flex flex-col justify-around">
                <div className="flex flex-row justify-around">
                    <div className="border w-144 p-8">
                        <h1 className="font-black text-6xl mb-8">Upload to OpenMed</h1>
                        <div className="text-white text-4xl">
                            <label>Title: </label>
                            <input className="bg-white text-black p-1 text-2xl my-2 rounded-md" ref={titleRef} required></input>
                            <div className="flex items-center">
                            <label>Symptoms: </label>
                            <textarea className="bg-white text-black p-1 text-2xl my-2 rounded-md" ref={symptomRef} required></textarea>
                            </div>
                            <div className="flex items-center">
                            <label>Sources: </label>
                            <textarea className="bg-white text-black p-1 text-2xl my-2 rounded-md" ref={sourceRef} required></textarea>
                            </div>
                            <label>Image:</label>
                            <input type="file" onChange={addPhoto} required></input>
                            <button className="my-2 bg-blue-700 p-4 rounded-full" onClick={() => onSub()}>Submit</button>
                        </div>
                    </div>
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
    
    if(!session)
      return {
        redirect: {
          destination: '/login',
          permanant: false
        },
      }

    return{
        props: {
            initialSession: session
        }
    }

}