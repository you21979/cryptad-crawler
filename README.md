cryptad-crawler
===============

https://cryptad.com であたらしい懸賞があったら自動的に応募する

requirement
-----------

redis 2.4.x or later
node.js 0.10.x

setup
-----

```
npm install
cp config.json.org config.json
```

edit config
-----------

input your address

- email address
- bitcoin address
- monacoin address

add crontab
-----------

```
0 */1 * * * root /path/to/cryptad-crawler/cmd.js
```

