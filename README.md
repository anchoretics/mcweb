#Minecraft web manager
##Installation
  ```sh
  #npm install
  ```
##configure
  #vim config.json
  ```json
  {
  	"dburl": "mongodb://minecraft:123456@localhost/minecraft",
  	"dbuser": "",
  	"dbpwd": "",
  	"env": "debug"
  }
  ```
##Usage
  test
  ```sh
  #./start.sh
  ```
  run
  ```sh
  #node ./bin/www
  ```
  supervisor
  ```sh
  #npm install supervisor -g
  #supervisor
  ```
##Minecraft Mods
  * MO' BENDS 更多弯曲动作
  * Randomite-Mod 多彩石头 随机掉落各种矿石
  * littleMaidMobX 女仆mod http://www.mcbbs.net/thread-367058-1-4.html
##Minecraft Plugins
  * PlotMe 地皮插件 http://www.mcbbs.net/thread-236421-1-1.html