"use strict";

import tplList from '../../tpl/listMain.hbs';
import tplBlock from '../../tpl/listBlock.hbs';
import tplItem from '../../tpl/listItem.hbs';

import emitter from '../Emitter';

module.exports = class ListPresenter {
  constructor(root) {
    root.innerHTML = tplList();

    this.els = {
      root: root,
      list: root.getElementsByClassName('list-block-wrapper')[0],
      ctrls: root.getElementsByClassName('list-ctrls')[0],
      btnSave: root.getElementsByClassName('btn-save')[0],
    };

    this.els.blocks = new Map();
    this.handleEvents();
  }

  handleEvents() {
    emitter.on("list-changed", data => {
      this.els.ctrls.classList.remove('hidden');
    });
    emitter.on("list-saved", data => {
      this.els.ctrls.classList.remove('hidden');
    });

    this.els.btnSave.addEventListener("click", event => {
      emitter.emit("list-save");
    });
  }

  render(data) {
    this.data = data;

    const dataSchedules = data.keys();
    for (let scheduleHash of dataSchedules) {
      // debugger;
      if (!this.els.blocks.has(scheduleHash)) {
        this.createBlock(scheduleHash);
      }
    }

    const blockSchedules = this.els.blocks.keys();
    for (let scheduleHash of blockSchedules) {
      // this.updateBlock(this.els.blocks.get(scheduleHash))
      this.updateBlock(scheduleHash);
    }
  }

  createBlock(scheduleHash) {
    let schedule = this.data.get(scheduleHash).schedule;

    let element = document.createElement("div");
    element.innerHTML = tplBlock(schedule);
    // element.innerHTML = tplItem(schedule);

    this.els.blocks.set(scheduleHash, {
      schedule: schedule,
      element: element,
      content: element.getElementsByClassName("list-block-content")[0],
      items: new Map()
    });
    this.els.list.appendChild(element);
  }

  updateBlock(scheduleHash) {
    if (!this.data.has(scheduleHash)) {
      this.hideBlock(scheduleHash);
    } else {
      let actualItems = this.data.get(scheduleHash).days; // array

      if (actualItems.length) {
        this.showBlock(scheduleHash);
      } else {
        this.hideBlock(scheduleHash);
      }

      actualItems.forEach(actualItem => {
        if (!this.els.blocks.get(scheduleHash).items.has(actualItem)) {
          this.createItem(scheduleHash, actualItem);
        }
      });

      let existedItems = this.els.blocks.get(scheduleHash).items.keys();
      for (let existedItem of existedItems) {
        this.updateItem(scheduleHash, existedItem);
      }
    }
  }

  updateItem(scheduleHash, item) {
    if (!this.els.blocks.has(scheduleHash)) {
      return;
    }
    if (!this.els.blocks.get(scheduleHash).items.has(item)) {
      return;
    }
    if (!this.data.has(scheduleHash)) {
      return;
    }
    if (this.data.get(scheduleHash).days.indexOf(item) === -1) {
      this.hideItem(scheduleHash, item);
    } else {
      this.showItem(scheduleHash, item);
    }
  }


  hideBlock(scheduleHash) {
    if (!this.els.blocks.has(scheduleHash)) {
      return;
    }
    this.els.blocks.get(scheduleHash).element.classList.add('hidden');
  }

  showBlock(scheduleHash) {
    if (!this.els.blocks.has(scheduleHash)) {
      return;
    }
    this.els.blocks.get(scheduleHash).element.classList.remove('hidden');
  }


  createItem(scheduleHash, item) {
    let element = document.createElement("div");
    // debugger;
    element.innerHTML = tplItem({
      date: item
    });

    let btnRemove = element.getElementsByClassName("remove-list-item")[0];
    btnRemove.addEventListener("click", event => {
      emitter.emit("remove-schedule-day", {
        date: item,
        scheduleHash: scheduleHash
      });
    });

    this.els.blocks.get(scheduleHash).content.appendChild(element);
    this.els.blocks.get(scheduleHash).items.set(item, element);
  }

  hideItem(scheduleHash, item) {
    if (!this.els.blocks.has(scheduleHash)) {
      return;
    }
    if (!this.els.blocks.get(scheduleHash).items.has(item)) {
      return;
    }
    this.els.blocks.get(scheduleHash).items.get(item).classList.add('hidden');
  }

  showItem(scheduleHash, item) {
    if (!this.els.blocks.has(scheduleHash)) {
      return;
    }
    if (!this.els.blocks.get(scheduleHash).items.has(item)) {
      return;
    }
    this.els.blocks.get(scheduleHash).items.get(item).classList.remove('hidden');
  }

}