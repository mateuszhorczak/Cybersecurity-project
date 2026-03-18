import {
  useCreateMessage,
  useDeleteMessage,
  useUpdateMessage,
} from '~/mutations/messages'

import { messageById, messagesList } from '~/queries/messages'

export const useMessageStore = defineStore('messageStore', () => {
  const selectedMessageId = ref()

  const { data: messages, refresh: fetchMessages } = useQuery(messagesList)
  const { data: singleMessage, refresh: fetchMessageById } = useQuery(() =>
    messageById({
      messageId: selectedMessageId.value,
    }),
  )

  const { create: createMessage } = useCreateMessage()
  const { update: updateMessage } = useUpdateMessage()
  const { remove: deleteMessage } = useDeleteMessage()

  return {
    messages,
    singleMessage,
    selectedMessageId,
    createMessage,
    updateMessage,
    deleteMessage,
    fetchMessages,
    fetchMessageById,
  }
})
