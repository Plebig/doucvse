import { fetchRedis } from "@/helpers/redis"

export async function POST(req: Request){
  const body = await req.json()
  const {email} = await JSON.parse(body)

  const userEmailExist = await fetchRedis('get', `user:email:${email}`)

  try {

    if(userEmailExist){
      // prihlasit se
      
      return new Response('OK')
    }
    else{
      return new Response("Error unexpecte when logging in", {status: 400})
    }
  } catch
  {

  }




}