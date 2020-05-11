const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repo);

  response.status(200).json({ repo });
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIdx = repositories.findIndex(repo => repo.id === id);

  if (repoIdx < 0) {
    response.status(400).json({ error: "Repository not found." });
  }

  const likes = repositories[repoIdx].likes;

  const repo = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repoIdx] = repo;

  response.status(200).json(repo);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIdx = repositories.findIndex(repo => repo.id === id);

  if (repoIdx < 0) {
    response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repoIdx, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIdx = repositories.findIndex(repo => repo.id === id);

  if (repoIdx < 0) {
    response.status(400).json({ error: "Repository not found." });
  }

  repositories[repoIdx].likes = repositories[repoIdx].likes + 1;

  response.status(200).json({
    likes: repositories[repoIdx].likes
  });
});

module.exports = app;
