"use strict";

import config from '../Config';
import {pad, minToTime, timeToMin} from '../utils';

module.exports = class SchedulerModel {

  constructor(config) {
    this.config = config;
    this.subscribes = [];
  }

  findDay(id) {
    return this.config.days.find(i => i.id == id);
  }
  // findInterval(id) {
  //   return this.config.intervals.find(i => i.id == id);
  // }
  findItem(id) {
    return this.config.items.find(i => i.id == id);
  }
  findSchedule(dayId, startMins) {
    return this.schedules.find(i => i.day.id == dayId && i.startMins == startMins);
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

    let intervals = this.intervals;
    let filter = intervals.filter(interval => {
      for (let schedule of schedules) {
        if (interval.endMins > schedule.startMins && interval.endMins < schedule.endMins) {
          return true;
        }
        if (interval.startMins >= schedule.startMins && interval.startMins <= schedule.endMins) {
          return true;
        }
      }
      return false;
    });
    return filter.map(interval => interval.id)
    // let intervalIds = [];
    // schedules.forEach(schedule => intervalIds.push(schedule.interval.id));
    // return intervalIds;
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

  /*
   * Высчитываем интервалы так, чтобы они охватывали все расписания
  */
  get intervals() {
    let minTime = 1440, maxTime = 0;
    let intervalDuration = config('schedule.interval');

    this.config.schedules.forEach(schedule => {
      let scheduleStart = timeToMin(schedule.time);
      let scheduleEnd = (+scheduleStart) + (+schedule.duration);

      if (scheduleStart < minTime) {
        minTime = scheduleStart;
      }
      if (scheduleEnd > maxTime) {
        maxTime = scheduleEnd;
      }
    });

    let result = [];
    for (let intervalStart = 0; intervalStart < 1440; intervalStart += intervalDuration) {
      if (intervalStart + intervalDuration > minTime && intervalStart < maxTime) {
        result.push({
          start: minToTime(intervalStart),
          end: minToTime(intervalStart + intervalDuration),
          id: +intervalStart,
          startMins: +intervalStart,
          endMins: intervalStart + intervalDuration
        });
      }
    }
    return result;
  }

  get items() {
    return this.config.items;
  }
  get schedules() {
    return this.config.schedules.map(schedule => {
      let newSchedule = {};
      for (let key in schedule) {
        newSchedule[key] = schedule[key];
      }

      newSchedule.duration = +schedule.duration;
      // newSchedule.mins = timeToMin(schedule.time);

      newSchedule.startMins = timeToMin(schedule.time);
      newSchedule.endMins = timeToMin(schedule.time) + (+schedule.duration);
      
      newSchedule.timeEnd = minToTime(newSchedule.endMins);

      newSchedule.day = this.findDay(schedule.day);
      // newSchedule.interval = this.findInterval(schedule.interval);
      newSchedule.item = this.findItem(schedule.item);

      return newSchedule;
    });
  }
  get options() {
    return this.config.options;
  }

}