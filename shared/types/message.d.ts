export interface Message {
    id: number
    text: string
    userId: number
    dateCreation: string
}

export interface NewMessage {
    text: string
    userId: number
}