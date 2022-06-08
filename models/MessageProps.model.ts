export interface MessageProps {
    id: number,
    idSender: number,
    idReceiver: number,
    content: string,
    sendAt: string,
    readAt: string
}