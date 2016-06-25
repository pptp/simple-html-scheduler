let configData = {};

function Config(input) {
  if (typeof(input) === 'object') {
    configData = input;
  }

  if (typeof(input) === 'string') {
    let result = null;
    let inputX = input.split('.');

    return inputX.reduce((result, current) => {
      if (current === undefined) {
        return undefined;
      }
      return result[current];
    }, configData);
  }
}

Config.data = configData;

module.exports = Config;