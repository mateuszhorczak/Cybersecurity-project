export interface NewMessage {
  text: string
  userId: number
}

export interface MessagePermission {
  userId: number
  messageId: number
}

export interface Message extends NewMessage {
  id: number
  dateCreation: string
  messagePermissions: MessagePermission[]
}

export interface EditMessagePayload {
  id: Message['id']
  userId: Message['userId']
  text: Message['text']
}
