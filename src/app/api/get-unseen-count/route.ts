import { fetchRedis } from "@/helpers/redis";

export async function POST(req: Request) {
  try {
    const unseenChatMessagesDict: {[friendId: string]: number} = {};
    const { sessionId }: { sessionId: string } = await req.json();
    const unseenChatMessagesRaw = await fetchRedis(
      "hGetAll",
      `user:${sessionId}:unseenMessages`
    ) as string[];
    for(let i = 0; i < unseenChatMessagesRaw.length - 1; i+=2 ){
      const friendId = unseenChatMessagesRaw[i];
      const unseenCount = parseInt(unseenChatMessagesRaw[i + 1]);
      unseenChatMessagesDict[friendId] = unseenCount;
    }
    return new Response(JSON.stringify(unseenChatMessagesDict ), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching unseen messages:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
