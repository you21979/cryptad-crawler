cryptad-crawler
===============

https://cryptad.com であたらしい懸賞があったら自動的に応募する
広告バナーのシステムを使うときにサイト運営者は毎回手動で入札しないといけないので
これは大変だなと思い作った。

requirement
-----------

- redis 2.4.x or later
- node.js 0.10.x

setup
-----

```
npm install
cp config.json.org config.json
```

edit config.json
----------------

input your address

- email address
- bitcoin address
- monacoin address

add crontab
-----------

```
0 */1 * * * root /path/to/cryptad-crawler/cmd.js
```

License
-------
MIT License

donate
------

bitcoin:1GLnWVBpadWnHpxf8KpXTQdwMdHAWtzNEw  
monacoin:MCEp2NWSFc352uaDc6nQYv45qUChnKRsKK  


