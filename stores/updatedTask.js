import { reactive } from "vue";

export const updatedTask = reactive({
  id: null,
  checked: false,
  description: "",
  dueDate: null,
});
