"use strict";

module.exports = function(date) {
  return date.toLocaleString("ru", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}