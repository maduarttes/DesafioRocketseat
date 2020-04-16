const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoriesID (req, res, next){
  const {id} = req.params;

  if( !isUuid(id)){
    return res.status(400).json({error: ' Invalid Repositorie ID '})
  }
  return next();
}

app.use('/repositories/:id', validateRepositoriesID);

app.get("/repositories", (request, response) => {
 
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url , techs} = request.body;

  const repositorie = {
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0
  };

  repositories.push(repositorie)
  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url , techs} = request.body;

  const repositorieIndex = repositories.findIndex(repositorie =>
      repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found !'})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
   
  const repositorieIndex = repositories.findIndex(repositorie => 
     repositorie.id === id
     );

  if (repositorieIndex >= 0) {
    repositories.splice(repositorieIndex, 1);
  }else {
    return response.status(400).json({ error: 'Repositories does not exists.' })
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie =>
    repositorie.id === id);

    if (repositorieIndex < 0) {
      return response.status(400).json({ error: 'Repositorie not found !'})
    }

    repositories[repositorieIndex].likes +=1;

    return response.json(repositories[repositorieIndex]);

    
});


module.exports = app;
