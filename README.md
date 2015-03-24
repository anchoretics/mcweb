#Minecraft web manager
##Installation
  ```js
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
  ```js
  #./start.sh
  ```
  or
  ```js
  #node ./bin/www
  #or
  #npm install supervisor -g
  #supervisor
  ```
