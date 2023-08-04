import { h } from "vue";
import { DecoratorNode, createCommand } from "lexical";
import TaskDecoratorComponent from "./TaskDecoratorComponent.vue";

const NODE_TYPE = "task";

export class TaskNode extends DecoratorNode {
  __id;
  __description;
  __checked = false;
  __dueDate;

  static getType() {
    return NODE_TYPE;
  }

  static clone(node) {
    return new TaskNode(
      {
        id: node.__id,
        description: node.__description,
        checked: node.__checked,
        dueDate: node.__dueDate,
      },
      node.__key
    );
  }

  constructor({ id, description, checked, dueDate }, key) {
    super(key);
    this.__id = id;
    this.__description = description;
    this.__checked = checked;
    this.__dueDate = dueDate;
  }

  createDOM(config) {
    return document.createElement("div");
  }

  updateDOM() {
    return false;
  }

  static importJSON(serializedNode) {
    const { id } = serializedNode;
    const node = new this({
      id,
    });
    return node;
  }

  exportJSON() {
    return {
      type: NODE_TYPE,
      id: this.getID(),
    };
  }

  getID() {
    const self = this.getLatest();
    return self.__id;
  }

  getDescription() {
    const self = this.getLatest();
    return self.__description;
  }

  setDescription(description) {
    const self = this.getWritable();
    self.__description = description;
  }

  getChecked() {
    const self = this.getLatest();
    return self.__checked;
  }

  setChecked(checked) {
    const self = this.getWritable();
    self.__checked = checked;
  }

  getDueDate() {
    const self = this.getLatest();
    return self.__dueDate;
  }

  setDueDate(dueDate) {
    const self = this.getWritable();
    self.__dueDate = dueDate;
  }

  decorate(lexicalEditor) {
    return h("div", { key: this.__key }, [
      h(TaskDecoratorComponent, {
        id: this.__id,
        nodeKey: this.__key,
        editor: lexicalEditor,
        description: this.__description,
        checked: this.__checked,
        dueDate: this.__dueDate,
      }),
    ]);
  }

  isInline() {
    return true;
  }
}

export function $createTaskNode(data) {
  return new TaskNode(data);
}

export function $isTaskNode(node) {
  return node instanceof TaskNode;
}

export const INSERT_TASK_COMMAND = createCommand();
export const CREATE_TASK_COMMAND = createCommand();
export const DELETE_TASK_COMMAND = createCommand();
