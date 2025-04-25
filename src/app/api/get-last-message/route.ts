import { getLastMessage } from '@/helpers/get-last-message';

export async function POST(req: Request) {
  
  const body = await req.json();
  const { sessionId, friendId } = body;

  if (!sessionId || !friendId) {
    return new Response('Missing sessionId or friendId', { status: 400 });
  }

  try {
    const lastMessage = await getLastMessage(sessionId as string, friendId as string);
    console.log("lastMessage", lastMessage);
    return new Response(JSON.stringify({ lastMessage }), { status: 200 });

  } catch (error) {
    
    return new Response('Internal error ' + error, { status: 500 });
  }   

}
