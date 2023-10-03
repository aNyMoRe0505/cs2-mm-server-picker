const sudo = require('sudo-prompt');

const ruleName = 'cs2-mm-server-picker';

const resetCommand = `netsh advfirewall firewall show rule name="${ruleName}" >nul && netsh advfirewall firewall delete rule name="${ruleName}"`;

const reset = () => {
  sudo.exec(resetCommand);
};

const apply = (ipAddress) => {
  const targetIpList = ipAddress.join();

  const applyCommand = `netsh advfirewall firewall add rule name="${ruleName}" dir=out action=block remoteip=${targetIpList}`;

  sudo.exec(`${resetCommand} && ${applyCommand} || ${applyCommand}`);
};

module.exports = {
  apply,
  reset,
};
