"use strict";

import SchedulerModel from './models/SchedulerModel.js';
import SchedulerPresenter from './views/SchedulerPresenter.js';

import emitter from './Emitter';
import Calendar from './Calendar';


module.exports = class Scheduler {

  constructor(root, config) {
    this.model = new SchedulerModel(config);
    this.view = new SchedulerPresenter(root, {
      days: this.model.days,
      intervals: this.model.intervals,
      items: this.model.items,
      schedules: this.model.schedules,
    });
    this.view.filter(this.model.filterByItemIds());
    this.view.turnAnimationOn();

    this.calendar = new Calendar({
      popup: this.view.els.popup,
      list: this.view.els.list
    }, {
      options: this.model.options
    });
    
    this.handleEvents();
  }

  handleEvents() {
    emitter.on('filter-items', val => {
      let filterData = this.model.filterByItemIds(val == '' ? undefined : val);
      this.view.filter(filterData);
    });

    emitter.on('click-schedule', data => {
      let schedule = this.model.findSchedule(data.dayId, data.intervalId);
      this.calendar.popup(schedule);
    });

  }
}