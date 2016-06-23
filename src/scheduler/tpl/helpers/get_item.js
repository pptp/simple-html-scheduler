"use strict";

let handlebarsRuntime = require("handlebars/runtime");
import render from '../item.hbs';


module.exports = function(items, schedule, dayId, intervalId) {
  let scheduleItem = schedule.find(item => item.day == dayId && item.interval == intervalId);
  if (!scheduleItem) {
    return '';
  }

  let item = items.find(item => item.id == scheduleItem.item);
  if (!item) {
    return '';
  }

  let result = render({
    item: item,
    schedule: scheduleItem
  });
  return new handlebarsRuntime.SafeString(result);
}