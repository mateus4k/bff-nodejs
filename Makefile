# Instale o json-server na versão 0.
# npm i -g json-server@^0

posts:
	json-server external_apis/posts.json -p 3001 --middlewares ./external_apis/random-delay.js
comments:
	json-server external_apis/comments.json -p 3002 --delay 500
users:
	json-server external_apis/users.json -p 3003 --middlewares ./external_apis/random-delay.js
