"use strict";

import CalendarModel from "./models/CalendarModel";
import PopupPresenter from "./views/PopupPresenter";
import ListPresenter from "./views/ListPresenter";

import emitter from './Emitter';

module.exports = class Calendar {

  constructor(viewData, options) {
    this.model = new CalendarModel(options);
    this.view = {
      popup: new PopupPresenter(viewData.popup),
      list: new ListPresenter(viewData.list),
    }
    this.handleEvents();

    this.view.list.render(this.model.items);
  }

  popup(schedule) {
    let days = this.model.getDays(schedule);
    this.view.popup.render(schedule, days);
  }

  handleEvents() {
    emitter.on("update-shedule-days", data => {
      this.model.setScheduleDays(data.schedule, data.days);
      this.view.list.render(this.model.items);
      emitter.emit("list-changed", this.model.items);
    });

    emitter.on("remove-schedule-day", data => {
      let scheduleHash = data.scheduleHash;
      let dateToRemove = data.date;
      this.model.removeScheduleDay(scheduleHash, dateToRemove);
      this.view.list.render(this.model.items);
      emitter.emit("list-changed", this.model.items);
    });

    emitter.on("list-save", () => {
      this.model.save();
    })
 }

}
