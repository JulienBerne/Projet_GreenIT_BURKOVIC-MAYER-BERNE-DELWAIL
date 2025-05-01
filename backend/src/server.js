import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/users/', async (req, res) => {
  const { name } = req.query;
  
  try {
    if (name) {
      const users = await prisma.user.findMany({
        where: {
          name: name,
        },
      });

      if (users.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(users); 
    } else {
      const users = await prisma.user.findMany();
      res.json(users);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});


app.get('/posts/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { name: true }, // Include author's name
        },
      },
      orderBy: { id: 'desc' }, // Show newest posts first
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});



app.get('/users/:id', async (req, res) => {
  try{
  const userById = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if(userById){
    res.json(userById)
  }else{
    res.status(404).json({error: "User not found"})
  }
  }catch(e){
    console.error(e)
    res.status(500).json({error:"Server crashed"})
  }
})


app.get('/post/:id', async (req, res) => {
  const postById = await prisma.post.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if(postById){
    res.json(postById)
  }else{
    res.status(404).json({error: "User not found"})
  }
})


app.post('/users/create', async (req, res) => {
  try{
  const name = req.body.name
  const user = await prisma.user.create({
    data:{
      name: name,
    },
  })

  res.json(user);
  }catch(e){
    console.error(e)
    res.status(500).json({error: "Serveur crashed"})
  }
})


app.post('/posts/create', async (req, res) => {
  const { title, content, userName } = req.body;

  // Validate inputs
  if (!title || !userName) {
    return res.status(400).json({ error: "Title and userName are required" });
  }

  try {
    // Find the user by name
    const user = await prisma.user.findUnique({
      where: { name: userName },
    });

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Create the post with the user's ID
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
      include: {
        author: { select: { name: true } }, // Include author name in response
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/items/', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server crashed" });
  }
});



app.get('/items/random', async (req, res) => {
  try {
    const items = await prisma.item.findMany();

    const randomItems = items
      .sort(() => 0.5 - Math.random()) 
      .slice(0, 2);

    res.json(randomItems);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.post('/items/create', async (req, res) => {
  try {
    const { name, value, img } = req.body;

    const item = await prisma.item.create({
      data: {
        name,
        value: parseInt(value),
        img,
      },
    });

    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.get('/scores/', async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      orderBy: { value: 'desc' }, // Order by score in descending order
      include: {
        user: {
          select: { name: true }, // Include only the name of the user
        },
      },
    });

    const formattedScores = scores.map(score => ({
      value: score.value,
      name: score.user.name,
    }));

    res.json(formattedScores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard scores' });
  }
});

app.get('/scores/:id', async (req, res) => {
  try {
    const scoreById = await prisma.score.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (scoreById) {
      res.json(scoreById);
    } else {
      res.status(404).json({ error: "Score not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.post('/scores/create', async (req, res) => {
  try {
    const { value, userId } = req.body;

    const score = await prisma.score.create({
      data: {
        value: parseInt(value),
        userId: parseInt(userId),
      },
    });

    res.json(score);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server crashed" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/users/:id/scores', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userScores = await prisma.score.findMany({
      where: {
        userId: userId,
      },
    });

    if (userScores.length > 0) {
      res.json(userScores);
    } else {
      res.status(404).json({ error: "No scores found for this user." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

export { app };
