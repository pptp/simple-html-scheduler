"use strict";

module.exports = class SchedulerModel {

  constructor(config) {
    this.config = config;
    this.subscribes = [];
  }

  findDay(id) {
    return this.config.days.find(i => i.id == id);
  }
  findInterval(id) {
    return this.config.intervals.find(i => i.id == id);
  }
  findItem(id) {
    return this.config.items.find(i => i.id == id);
  }
  findSchedule(dayId, intervalId) {
    return this.schedules.find(i => i.day.id == dayId && i.interval.id == intervalId);
  }


  getSchedulesByItemIds(itemIds) {
    if (itemIds.length === undefined) {
      itemIds = [itemIds];
    }
    return this.schedules.filter(schedule => itemIds.indexOf(schedule.item.id) !== -1);
  }
  getIntervalIdsBySchedules(schedules) {
    if (schedules.length === undefined) {
      schedules = [schedules];
    }
    let intervalIds = [];
    schedules.forEach(schedule => intervalIds.push(schedule.interval.id));
    return intervalIds;
  }

  filterByItemIds(itemIds = this.getItemIds()) {
    let schedules = this.getSchedulesByItemIds(itemIds);
    return {
      intervalIds: this.getIntervalIdsBySchedules(schedules),
      schedules: schedules
    }
  }


  getItemIds(items = this.config.items) {
    return items.map(item => item.id)
  }


  get days() {
    return this.config.days;
  }
  get intervals() {
    return this.config.intervals;
  }
  get items() {
    return this.config.items;
  }
  get schedules() {
    return this.config.schedules.map(schedule => {
      let newSchedule = {};

      newSchedule.day = this.findDay(schedule.day);
      newSchedule.interval = this.findInterval(schedule.interval);
      newSchedule.item = this.findItem(schedule.item);

      return newSchedule;
    });
  }
  get options() {
    return this.config.options;
  }

}