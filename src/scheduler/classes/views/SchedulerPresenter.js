"use strict";

import tplScheduler from '../../tpl/scheduler.hbs';
import tplItem from '../../tpl/item.hbs';
import tplPopup from '../../tpl/popup.hbs';

import emitter from '../Emitter';
import config from '../Config';

// console.log(emitter);
// debugger;

// require("../styles/scheduler.less");


module.exports = class SchedulerPresenter {

  constructor(root, data) {
    this.root = root;
    this.els = {};

    this.intervals = data.intervals;

    this.render(data.days, data.intervals, data.items);

    // console.log('intervals:', this.intervals);
    // console.log('els:', this.els);
    // console.log('schedules:', data.schedules);

    this.renderSchedules(data.schedules);
    this.handleEvents();
  }

  turnAnimationOn() {
    this.els.scheduler.classList.add('animate');
  }

  render(days, intervals, items) {
    this.els.scheduler = document.createElement('div');
    this.els.scheduler.innerHTML = tplScheduler({
      days: days,
      intervals: intervals,
      items: items
    });
    this.root.appendChild(this.els.scheduler);

    this.updateEls();
  }

  getIntervalIdOfSchedule(schedule) {
    let startMins = schedule.startMins;
    for (let interval of this.intervals) {
      let mins = +interval.startMins;
      if (mins <= startMins && (mins + config('schedule.interval')) > startMins) {
        return interval.id;
      }
    }
  }

  getPositionOfSchedule(schedule) {
    let intervalId = this.getIntervalIdOfSchedule(schedule);
    return {
      intervalId: +intervalId,
      length: schedule.duration * this.mpp,
      offset: (schedule.min - intervalId) * this.mpp,
    }
  }

  renderSchedules(schedules) {
    schedules.forEach(schedule => {
      let pos = this.getPositionOfSchedule(schedule);
      let element = this.renderSchedule(schedule);

      element.style.height = pos.length + 'px';
      element.style.top = pos.offset + 'px';

      this.els.ceils[+schedule.day.id][pos.intervalId].ceil
        .getElementsByClassName("interval-content")[0]
        .appendChild(element);
      this.els.ceils[+schedule.day.id][pos.intervalId].schedule = element;

      /*
      if (this.els.ceils[schedule.day.id] && this.els.ceils[schedule.day.id][schedule.interval.id]) {
        this.els.ceils[schedule.day.id][schedule.interval.id].ceil
            .getElementsByClassName("interval-content")[0]
            .appendChild(element);
        this.els.ceils[schedule.day.id][schedule.interval.id].schedule = element;
      }
      */
    });
  }

  renderSchedule(schedule) {
    // debugger;
    let element = document.createElement("div");
    element.classList.add("schedule-item");
    element.dataset.startMins = schedule.startMins;
    element.innerHTML = tplItem(schedule);
    if (schedule.item.color) {
      element.style.backgroundColor = schedule.item.color;
    }
    return element;
  }

  set intervalHeight(val) {
    // console.log("Set intervalHeight:", val);
    this._intervalHeight = +val;
    this.mpp = this.intervalHeight / (+config('schedule.interval'));
  }
  get intervalHeight() {

    return this._intervalHeight;
  }
  
  updateEls() {
    this.els.week = this.els.scheduler.getElementsByClassName('week')[0];
    this.els.filter = this.els.scheduler.getElementsByClassName('filter-select')[0];
    this.els.sidebar = this.els.scheduler.getElementsByClassName('sidebar')[0];
    this.els.popup = this.els.scheduler.getElementsByClassName('schedule-popup')[0];
    this.els.list = this.els.scheduler.getElementsByClassName('schedule-list')[0];
    // this.els.popupContent = this.els.scheduler.getElementsByClassName('schedule-popup-content')[0];

    this.els.intervals = {};
    this.els.ceils = {};
    this.els.days = {};

    let days = this.els.week.getElementsByClassName('day');
    Array.prototype.forEach.call(days, day => {
      let dayId = day.dataset.day;
      this.els.days[dayId] = day;
      this.els.ceils[dayId] = {};
      let intervals = day.getElementsByClassName('interval');
      Array.prototype.forEach.call(intervals, interval => {
        if (!this.intervalHeight) {
          this.intervalHeight = $(interval).height();
        }

        let intervalId = interval.dataset.interval;
        if (!this.els.intervals[intervalId]) {
          this.els.intervals[intervalId] = [];
        }
        this.els.intervals[intervalId].push(interval);
        this.els.ceils[dayId][intervalId] = {
          ceil: interval
        };
      });
    });

    let sidebarIntervals = this.els.sidebar.getElementsByClassName('interval');
    Array.prototype.forEach.call(sidebarIntervals, interval => {
      let intervalId = interval.dataset.interval;
      this.els.intervals[intervalId].push(interval);
    });
  }


  handleEvents() {
    this.els.filter.addEventListener("change", event => emitter.emit('filter-items', event.target.value));

    for (let dayId in this.els.ceils) {
      for (let intervalId in this.els.ceils[dayId]) {
        let ceil = this.els.ceils[dayId][intervalId];
        if (!ceil || !ceil.schedule) {
          continue;
        }

        ceil.schedule.addEventListener("click", event => emitter.emit('click-schedule', {
          dayId: +dayId,
          startMins: +ceil.schedule.dataset.startMins
        }));
        // let visible = !!schedules.find(schedule => schedule.day.id == dayId && schedule.interval.id == intervalId);
        // this.toggleSchedule(dayId, intervalId, visible);
      }
    }
  }


  filter(data) {
    if (config('schedule.hideUnusedIntervals')) {
      this.filterIntervals(data.intervalIds);
    }
    this.filterCeils(data.schedules);
  }

  filterIntervals(intervalIds) {
    // debugger;
    for (let intervalId in this.els.intervals) {
      this.toggleInterval(intervalId, intervalIds.indexOf(+intervalId) !== -1);
    }
  }

  filterCeils(schedules) {
    // debugger;
    for (let dayId in this.els.ceils) {
      for (let intervalId in this.els.ceils[dayId]) {
        let visible = !!schedules.find(schedule => 
            +schedule.day.id == +dayId && 
            this.getIntervalIdOfSchedule(schedule) == intervalId
          );
        this.toggleSchedule(dayId, intervalId, visible);
      }
    }
  }

  toggleSchedule(dayId, intervalId, visible) {
    let ceil = this.els.ceils[dayId][intervalId];
    if (ceil.schedule) {
      visible ?
        ceil.schedule.classList.remove('hidden') :
        ceil.schedule.classList.add('hidden');
    }
  }
  
  toggleInterval(id, visible) {
    let intervals = this.els.intervals[id];
    if (intervals) {
      intervals.forEach(interval => visible ?
          interval.classList.remove('hidden') :
          interval.classList.add('hidden'));
    }
  }

  /*
  generatePopup() {

  }

  openPopup(schedule, calendar) {
    this.els.popupContent.innerHTML = tplPopup({
      schedule: schedule,
      calendar: calendar
    });

    
    
    $(this.els.popup).modal();
    
    // let popup = this.generatePopup();
    // debugger;
    // this.els.popup.appendChild(popup);
  }
  */
}