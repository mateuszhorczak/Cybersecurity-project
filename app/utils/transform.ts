interface InputMessageType {
  id: number
  userId: number
  text: string
  loggedUser: number
}

interface OutputMessageType {
  id: string
  parts: {
    type: string
    text: string
  }[]
  metadata: { userId: number }
}

export function transformMessageArray<T extends InputMessageType>(
  array: T[] | undefined | null,
): (T & OutputMessageType)[] {
  if (!array) return []

  return array.map(item => ({
    ...item,
    id: item.id.toString(),
    role: 'user',
    side: item.loggedUser === item.userId ? 'right' : 'left',
    parts: [{
      type: 'text',
      text: item.text,
    }],
    metadata: {
      userId: item.userId,
    }
  }))
}