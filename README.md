# CS2 Match-Making Server Picker

選自己想要玩的伺服器

![387530020_284946924406815_7496436808605818704_n](https://github.com/aNyMoRe0505/cs2-mm-server-picker/assets/9814815/2a1ca9fc-9458-4dae-8f8f-39b63934c23e)

## 下載

[v1.0.4](https://github.com/aNyMoRe0505/cs2-mm-server-picker/releases/tag/v1.0.4)

點選 cs2-mm-server-picker-1.0.4.Setup.exe

## 必要條件

只支援 windows 系統, 然後要啟動防火牆

## 使用方式

下載的時候應該會被認為是不被信用的應用程式, 懶得處理, 原始碼在這個 repo 可以看到, 如果不放心的話還是用 VPN 吧.

安裝完成後就直接選擇要玩的伺服器, 並按下`執行`. 因為會對防火牆新增規則, 所以每次執行都會要求權限

執行完後就可以打開遊戲了, 可以用 steam 內嵌介面確認是否有連到預期的伺服器, 理論上設定一次後就不用再設定了

如果瀏覽其他網站或遊戲遇到問題時可以按下`重置`去刪除規則

或者你也可以自己去 防火牆 -> 進階設定 -> 輸出規則 找到 `cs2-mm-server-picker` 自己刪除

![384203356_666495162117778_5574239424213259502_n](https://github.com/aNyMoRe0505/cs2-mm-server-picker/assets/9814815/704c781e-346c-43ea-a92d-b530dfd8cbc2)

`Update Ping` 可以刷新 ping 的數值, 可以多刷幾次, 我自己的情況是香港會上上下下非常不穩, `執行`成功後再次更新沒有選的伺服器, ping 會是 `NaN`, 因為防火牆擋住 ip 了, 這樣代表成功了

### 一些重點

- 要`執行`後再開啟遊戲才會生效
- `Update Ping` 可以更新 ping 的數值, `執行`成功後再次更新沒有選的伺服器, ping 會是 `NaN`, 因為防火牆擋住 ip 了, 這樣代表成功了





