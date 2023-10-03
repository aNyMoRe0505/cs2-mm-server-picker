/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

const { dialog } = require('@electron/remote');
const { ipcRenderer } = require('electron');
const ping = require('ping');
const { apply, reset } = require('./firewall');

ipcRenderer.on('spinner', (_, isLoading) => {
  document.getElementById('loading').style.display = isLoading === true ? 'block' : 'none';
});

let targetBlockIp = [];

ipcRenderer.on('paintServer', (_, args) => {
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
      let popPingSum = 0;
      for (const ipv4 of displaySvPop[pop].ipv4) {
        const { max } = await ping.promise.probe(ipv4);
        popPingSum += Number(max);
      }
      const result = Math.round(popPingSum / displaySvPop[pop].ipv4.length);
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
    apply(targetBlockIp);
    dialog.showMessageBoxSync({
      type: 'info',
      message: '執行完畢, 想確認是否成功可以到防火牆 -> 進階設定 -> 輸出規則 查看是否有 cs2-mm-server-picker',
    });
  });

  resetBtn.addEventListener('click', () => {
    reset();
    dialog.showMessageBoxSync({
      type: 'info',
      message: '重置完畢, 想確認是否重置成功可以到防火牆 -> 進階設定 -> 輸出規則 查詢',
    });
  });

  actionContainer.appendChild(applyBtn);
  actionContainer.appendChild(resetBtn);
});
