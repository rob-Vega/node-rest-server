const { response, request } = require("express");

const usersGet = (req = request, res = response) => {
  const { q, name, apiKey } = req.query;

  res.json({ msg: "get API - controller", q, name, apiKey });
};

const usersPost = (req = request, res = response) => {
  const { name, age } = req.body;
  res.status(400).json({ msg: "post API - controller", name, age });
};

const usersPut = (req = request, res = response) => {
  const id = req.params.id;
  res.status(400).json({ msg: "put API - controller", id });
};

const usersPatch = (req, res = response) => {
  res.status(201).json({ msg: "patch API - controller" });
};

const usersDelete = (req, res = response) => {
  res.json({ msg: "delete API - controller" });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
