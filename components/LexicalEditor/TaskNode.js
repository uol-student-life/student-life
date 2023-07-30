import { h } from "vue";
import { DecoratorNode, createCommand } from "lexical";
import TaskDecoratorComponent from "./TaskDecoratorComponent.vue";

const NODE_TYPE = "task";

export class TaskNode extends DecoratorNode {
  __id;

  static getType() {
    return NODE_TYPE;
  }

  static clone(node) {
    return new TaskNode({ id: node.__id }, node.__key);
  }

  constructor({ id }, key) {
    super(key);
    this.__id = id;
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

  decorate() {
    return h("div", { key: this.getKey() }, [
      h(TaskDecoratorComponent, { id: this.getID() }),
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
