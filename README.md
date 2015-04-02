#Minecraft web manager
##Installation
  ```javascript
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
  ```javascript
  #./start.sh
  ```
  run
  ```javascript
  #node ./bin/www
  ```
  supervisor
  ```javascript
  #npm install supervisor -g
  #supervisor
  ```
##welcome
