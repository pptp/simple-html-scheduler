"use strict";

import emitter from '../Emitter';

module.exports = class CalendarModel {
  constructor(config) {
    this.config = config;
    this.items = new Map();
    this.changed = false;
  }

  getAvailableCount() {
    // return 
  }

  hashSchedule(schedule) {
    return JSON.stringify({
      day: schedule.day.id,
      interval: schedule.interval.id,
      item: schedule.item.id,
    });
  }

  setScheduleDays(schedule, days) {
    this.changed = true;
    this.items.set(this.hashSchedule(schedule), {
      schedule: schedule,
      days: days
    });
  }

  removeScheduleDay(scheduleHash, date) {
    if (!this.items.has(scheduleHash)) {
      return;
    }
    let data = this.items.get(scheduleHash);
    data.days = data.days.filter(day => day.toDateString() != date.toDateString());

    this.items.set(scheduleHash, data); 
  }

  getChoosedDays(schedule) {
    let hashSchedule = this.hashSchedule(schedule);
    if (!this.items.has(hashSchedule)) {
      return [];
    }
    return this.items.get(hashSchedule).days;
  }

  // object: {day, isActive}
  getDays(schedule) {
    let allDays = this.getAvailableDays(schedule);
    let choosedDays = this.getChoosedDays(schedule);

    return allDays.map(day => {
      let isActive = !!choosedDays.find(choosedDay => choosedDay.toDateString() == day.date.toDateString());

      return {
        date: day.date,
        isActive: isActive
      }
    });
  }


  getAvailableDays(schedule) {
    let days = [];
    let getNormalDay = date => date.getDay() ? date.getDay() - 1 : 6;

    let date = new Date();

    let id = 0;
    for (let i = 0; i < this.options.calendarInterval; i++) {
      if (schedule.day.id == getNormalDay(date)) {
        days.push({id: id++, date: date});
      }

      let newDate = new Date();
      newDate.setDate(date.getDate() + 1);
      date = newDate;
    }

    return days;
  }

  get options() {
    return this.config.options;
  }


  save() {
    let form = new FormData();

    
    let scheduleHashes = this.items.keys();
    for (let scheduleHash of scheduleHashes) {
      let item = this.items.get(scheduleHash);
      let schedule = item.schedule;
      for (let day of item.days) {
        form.append('interval[]', schedule.interval.id);
        form.append('item[]', schedule.item.id);
        form.append('day[]', day.toDateString());
      }
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.config.options.saveUrl);
    xhr.send(form);
    xhr.onreadystatechange = function() { // (3)
      if (xhr.readyState != 4) return;

      emitter.emit("list-saved");
    }
  }

}