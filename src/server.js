/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const ping = require('ping');

const displaySvPop = {
  hkg: {
    name: 'Hong Kong',
  },
  tyo: {
    name: 'Tokyo North (Japan)',
  },
  tyo1: {
    name: 'Tokyo South (Japan)',
  },
  sgp: {
    name: 'Singapore',
  },
  seo: {
    name: 'Korea',
  },
};

const allPopIpv4 = [];

const updateCS2ServerList = async () => {
  const rawResult = await fetch('https://api.steampowered.com/ISteamApps/GetSDRConfig/v1?appid=730').then((r) => r.json());

  for (const pop of Object.keys(rawResult.pops)) {
    if (rawResult.pops[pop].relays && rawResult.pops[pop].relays.length) {
      const popIpv4 = rawResult.pops[pop].relays.map((relay) => relay.ipv4);
      allPopIpv4.push(...popIpv4);

      if (displaySvPop[pop]) {
        displaySvPop[pop].ipv4 = popIpv4;
        let popPingSum = 0;
        for (const ipv4 of popIpv4) {
          const { max } = await ping.promise.probe(ipv4);
          popPingSum += Number(max);
        }
        displaySvPop[pop].ping = Math.round(popPingSum / popIpv4.length);
      }
    }
  }
};

module.exports = { updateCS2ServerList, displaySvPop, allPopIpv4 };
