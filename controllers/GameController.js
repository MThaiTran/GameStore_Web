const Game = require('../models/Game');

async function getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await Game.getGameWithPagination(page, limit);
    res.json({ page, limit, totalPages: Math.ceil(result.total / limit), totalRecords: result.total, data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const item = await Game.getGameById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Game not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    await Game.createGame(req.body);
    res.status(201).json({ message: 'Game created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    await Game.updateGame(req.params.id, req.body);
    res.json({ message: 'Game updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await Game.deleteGame(req.params.id);
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
