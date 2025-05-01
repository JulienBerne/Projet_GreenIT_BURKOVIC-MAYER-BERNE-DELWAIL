#### To run backend do
1. open a bash terminal and do `cd backend` 
2. run `npm install express`
3. create a file named .env in the backend folder
4. paste `DATABASE_URL="file:./dev.db"`in this file
5. run `npx prisma generate`
3. run `node src/server.js`

You can see your api in url `http://localhost:3000/`

#### To run frontend do
1. open a powershell terminal and do `cd frontend`
2. run `npm install`
3. run `npm run dev`

You can see your server in url `http://localhost:5173/`


Our website is a game of Higher and Lower, where the goal
is to guess if the image on the right is of Higher values
or Lower than the image on the left. The theme that we 
choose for this game is Minecraft. 
Users can also show their score on the leaderboards by 
giving a name. They also can post comments of the game 
on the Forum page.