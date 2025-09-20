import { ref } from "vue"

const isOpen = ref(false)
const title = ref("")
const content = ref("")
const actions = ref([])

export function useModal() {
  const openModal = (modalTitle, modalContent, modalActions = []) => {
    title.value = modalTitle
    content.value = modalContent
    actions.value = modalActions
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
    title.value = ""
    content.value = ""
    actions.value = []
  }

  return {
    isOpen,
    title,
    content,
    actions,
    openModal,
    closeModal,
  }
}
