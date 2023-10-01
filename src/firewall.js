/* eslint-disable max-len */
const sudo = require('sudo-prompt');

const ruleName = 'cs2-mm-server-picker';

const apply = (ipAddress) => {
  sudo.exec(`netsh advfirewall firewall add rule name="${ruleName}" dir=out action=block remoteip=${ipAddress}`);
};

const reset = () => {
  sudo.exec(`netsh advfirewall firewall delete rule name="${ruleName}"`);
};

module.exports = {
  apply,
  reset,
};
