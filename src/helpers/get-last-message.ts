import { chatHrefConstructor } from "@/lib/utils";
import { fetchRedis } from "./redis";

export async function getLastMessage(sessionId: string, friendId: string) {
  const chatId = chatHrefConstructor(sessionId, friendId);
  try {
    const lastMessageRaw: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const lastMessages = lastMessageRaw.map((message) => JSON.parse(message));
    const reversedMessages = lastMessages.reverse();
    const lastMessage = reversedMessages.find(
      (message) => message.senderId === friendId
    );
    if (lastMessage.type === "offer") {
      return "Nabídka konzultace";
    }
    return {"text" :lastMessage.text, "timeStamp" : lastMessage.timeStamp };
  } catch {
    return "";
  }
}
