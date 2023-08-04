import { h } from "vue";
import { DecoratorNode, createCommand } from "lexical";
import MilestoneDecoratorComponent from "./MilestoneDecoratorComponent.vue";

const NODE_TYPE = "milestone";

export class MilestoneNode extends DecoratorNode {
  __id;
  __description;

  static getType() {
    return NODE_TYPE;
  }

  static clone(node) {
    return new MilestoneNode(
      { id: node.__id, description: node.__description },
      node.__key
    );
  }

  constructor({ id, description }, key) {
    super(key);
    this.__id = id;
    this.__description = description;
  }

  createDOM(config) {
    const div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.verticalAlign = "middle";
    return div;
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

  decorate(editor) {
    return h("div", { key: this.getKey() }, [
      h(MilestoneDecoratorComponent, {
        id: this.getID(),
        description: this.getDescription(),
        nodeKey: this.getKey(),
        editor,
      }),
    ]);
  }

  isInline() {
    return true;
  }
}

export function $createMilestoneNode(data) {
  return new MilestoneNode(data);
}

export function $isMilestoneNode(node) {
  return node instanceof MilestoneNode;
}

export const INSERT_MILESTONE_COMMAND = createCommand();
export const DELETE_MILESTONE_COMMAND = createCommand();
