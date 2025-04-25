
import Subjects from "@/components/ui/Subjects";
import {z} from "zod"

export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timeStamp: z.number(),
  type: z.string()
})

export const offerValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  teacherId: z.string(),
  date: z.number(),
  timeSlot: z.string(),
  sessionLength: z.number(),
  hourlyCost: z.number(),
  timeStamp: z.number(),
  subject: z.string(),
  type: z.string(),
  isPaid: z.boolean()
})

export const chatMessageValidator = z.union([messageValidator, offerValidator]);
export type ChatMessage = z.infer<typeof chatMessageValidator>;

export const messageArrayValidator = z.array(messageValidator)
export type Message = z.infer<typeof messageValidator>

export type Offer = z.infer<typeof offerValidator>