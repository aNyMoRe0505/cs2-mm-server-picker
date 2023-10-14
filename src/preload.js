const { ipcRenderer } = require('electron');

ipcRenderer.on('updateTitle', (_, version) => {
  const headTitle = document.getElementById('head-title');
  const title = document.getElementById('title');
  headTitle.innerHTML = `CS2 MM Server Picker v${version}`;
  title.innerHTML = `CS2 MM Server Picker v${version}`;
});

ipcRenderer.on('bindLink', () => {
  const githubLink = document.getElementById('github');
  const bahamutLink = document.getElementById('bahamut');

  githubLink.addEventListener('click', () => {
    ipcRenderer.send('openLink', 'https://github.com/aNyMoRe0505/cs2-mm-server-picker');
  });

  bahamutLink.addEventListener('click', () => {
    ipcRenderer.send('openLink', 'https://forum.gamer.com.tw/C.php?bsn=1473&snA=33045');
  });
});

ipcRenderer.on('spinner', (_, isLoading) => {
  document.getElementById('loading').style.display = isLoading === true ? 'block' : 'none';
});

let targetBlockIp = [];

ipcRenderer.on('paintContent', (_, args) => {
  const [displaySvPop, allPopIpv4] = args;

  targetBlockIp = [...allPopIpv4];

  const handleUpdateBlockIp = (pop, isIn) => {
    if (isIn) {
      targetBlockIp = targetBlockIp.filter((blockIp) => !pop.ipv4.some((ipv4) => ipv4 === blockIp));
    } else {
      targetBlockIp = targetBlockIp.concat(pop.ipv4);
    }
  };

  const serverContainer = document.getElementById('serverContainer');

  const title = document.createElement('span');
  title.className = 'text';
  title.textContent = '選擇要遊玩的伺服器';
  serverContainer.appendChild(title);

  Object.keys(displaySvPop).forEach((pop) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'serverWrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.addEventListener('change', () => {
      handleUpdateBlockIp(displaySvPop[pop], checkbox.checked);
    });

    wrapper.appendChild(checkbox);

    const serverSpan = document.createElement('span');
    serverSpan.textContent = `${displaySvPop[pop].name}`;
    serverSpan.style.margin = '0 10px 0 0';

    const pingSpan = document.createElement('span');
    pingSpan.textContent = `ping: ${displaySvPop[pop].ping} ms`;

    wrapper.appendChild(serverSpan);
    wrapper.appendChild(pingSpan);

    const rePingBtn = document.createElement('button');
    rePingBtn.textContent = 'Update Ping';
    rePingBtn.className = 'updatePing';
    rePingBtn.addEventListener('click', async () => {
      rePingBtn.setAttribute('disabled', '');
      pingSpan.textContent = '讀取中 ...';

      const result = await ipcRenderer.invoke('updatePing', displaySvPop[pop].ipv4);
      pingSpan.textContent = `ping: ${result} ms`;
      rePingBtn.removeAttribute('disabled');
    });

    wrapper.appendChild(rePingBtn);

    serverContainer.appendChild(wrapper);
  });

  const actionContainer = document.getElementById('actionContainer');

  const applyBtn = document.createElement('button');
  applyBtn.className = 'actionBtn';
  applyBtn.textContent = '執行';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'actionBtn';
  resetBtn.textContent = '重置';

  applyBtn.addEventListener('click', () => {
    ipcRenderer.send('applyFirewallRule', targetBlockIp);
  });

  resetBtn.addEventListener('click', () => {
    ipcRenderer.send('resetFirewallRule');
  });

  actionContainer.appendChild(applyBtn);
  actionContainer.appendChild(resetBtn);
});
