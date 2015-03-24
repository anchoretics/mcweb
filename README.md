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
  run
  ```js
  #node ./bin/www
  ```
  supervisor
  ```js
  #npm install supervisor -g
  #supervisor
  ```
