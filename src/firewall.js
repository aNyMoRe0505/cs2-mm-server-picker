const sudo = require('sudo-prompt');

const ruleName = 'cs2-mm-server-picker';

const reset = () => {
  // not exist => do nothing
  // exist => reset
  sudo.exec(`netsh advfirewall firewall delete rule name="${ruleName}"`);
};

const apply = (ipAddress) => {
  // reset();
  const targetIpList = ipAddress.join();
  sudo.exec(`netsh advfirewall firewall add rule name="${ruleName}" dir=out action=block remoteip=${targetIpList}`);
};

module.exports = {
  apply,
  reset,
};
