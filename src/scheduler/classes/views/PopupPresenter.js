"use strict";

import tplPopup from '../../tpl/popup.hbs';

import emitter from '../Emitter';

module.exports = class PopupPresenter {
  constructor(root) {
    this.els = {popup: root};
    this.els.popupContent = this.els.popup.getElementsByClassName('schedule-popup-content')[0];
    this.els.apply = this.els.popup.getElementsByClassName('btn-apply')[0];
  }

  render(schedule, days) {
    this.schedule = schedule;
    // console.log(schedule);
    this.els.popupContent.innerHTML = tplPopup({
      schedule: schedule,
      days: days
    });
    this.handleEvents();
    $(this.els.popup).modal();
  }

  handleEvents() {
    let buttons = this.els.popupContent.getElementsByClassName("btn");
    Array.prototype.forEach.call(buttons, button => {
      button.addEventListener("click", event => event.target.classList.contains("active") ? 
          event.target.classList.remove("active") :
          event.target.classList.add("active")
      );
    });

    this.els.apply.addEventListener("click", event => {
      emitter.emit("update-shedule-days", {
        schedule: this.schedule,
        days: this.getCheckedDays(),
      });
    });
  }

  getCheckedDays() {
    let checked = [];
    let items = this.els.popupContent.getElementsByClassName("calendar-item");
    Array.prototype.forEach.call(items, item => {
      if (item.classList.contains("active")) {
        checked.push(new Date(item.dataset.date));
      }
    });
    return checked;
  }

}

// Запили удалять чтобы можно было события
//  и чтобы не больше определенного количества можно выбрать