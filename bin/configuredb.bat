

echo "Configuring database: loginpage"

dropdb  -U node_user loginpage
createdb  -U node_user loginpage
psql  -U node_user loginpage -f "C:\Users\Gaming 15\Desktop\dd\db\user.sql"


echo "loginpage configured"