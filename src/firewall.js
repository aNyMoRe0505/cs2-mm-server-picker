const sudo = require('sudo-prompt');

const ruleName = 'cs2-mm-server-picker';

const apply = (ipAddress) => {
  const targetIpList = ipAddress.join();
  sudo.exec(`netsh advfirewall firewall add rule name="${ruleName}" dir=out action=block remoteip=${targetIpList}`);
};

const reset = () => {
  sudo.exec(`netsh advfirewall firewall delete rule name="${ruleName}"`);
};

module.exports = {
  apply,
  reset,
};
