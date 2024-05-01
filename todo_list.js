import Quill from 'quill/core';
import Delta from 'quill-delta';

const List = Quill.import('formats/list');
const ListItem = Quill.import('formats/list/item');
const Parchment = Quill.import('parchment');
const Module = Quill.import('core/module');

export class TaskListItem extends ListItem {
  constructor(value) {
    super(value);
    this.blotName = 'task-list-item';
    this.tagName = 'LI';
  }

  format(name, value) {
    if (name === 'task-list' && !value) {
      this.replaceWith(Parchment.create(this.statics.scope));
    } else {
      super.format(name, value);
    }
  }

  // when inserting a new list item, remove the 'checked' css class
  clone() {
    const clone = super.clone();
    clone.domNode.classList.remove('checked');
    return clone;
  }
}

export class TaskList extends List {
  constructor(value) {
    super(value);
    this.blotName = 'task-list';
    this.tagName = 'UL';
    this.className = 'task-list';
    this.defaultChild = 'task-list-item';
    this.allowedChildren = [TaskListItem];
  }

  static create(value) {
    return super.create('bullet');
  }

  static formats(domNode) {
    return 'bullet';
  }
}

export class TaskListModule extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill.container.addEventListener('click', (e) => {
      if (e.target.matches('ul.task-list > li')) {
        e.target.classList.toggle('checked');
        // dummy update so that quill detects a change
        this.quill.updateContents(new Delta().retain(1));
      }
    });
  }
}

Quill.register({
  'formats/task-list': TaskList,
  'formats/task-list-item': TaskListItem,
  'modules/task-list': TaskListModule
});

// Register icons using Unicode representation
const icons = Quill.import('ui/icons');
icons['task-list'] = String.fromCharCode(0x2610); // Unicode character for an empty checkbox
