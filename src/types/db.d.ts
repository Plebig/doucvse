
interface User {
    name: string,
    email: string,
    image: string,
    id: string,
    role: string
}

interface Chat {
    id: string
    messages: Message[]
}

interface Message {
    id: string
    senderId: string
    receiverId: string
    text: string
    timeStamp: number
    type: string
}


interface hasFriendRequest {
    id: string
    senderId: string
    receiverId: string
}

interface Lesson {
    id: string;
    teacherId: string;
    studentId: string;
    dateOfLesson: number;
    dateOfPurchase: number;
    subject: string;
    timeSlot: string;
    hourlyRate: number;
    sessionLength: number;
  }

interface emailInfo {
    to: string
    subject: string
    text: string
    html: string
}