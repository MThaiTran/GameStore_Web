const Library = require('../models/Library');

async function getLibrary(req, res) {
  try {
    const library = await Library.getLibraryByUserId(req.params.userId);
    if (!library) return res.status(404).json({ message: 'Library not found' });
    res.json(library);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getItems(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const result = await Library.getLibraryItemsByUserId(req.params.userId, page, limit);

    res.json({
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
      totalRecords: result.total,
      data: result.data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addItem(req, res) {
  try {
    await Library.addLibraryItem(req.params.userId, req.body.GameID);
    res.status(201).json({ message: 'Game added to library' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeItem(req, res) {
  try {
    await Library.removeLibraryItem(req.params.userId, req.params.gameId);
    res.json({ message: 'Game removed from library' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getLibrary,
  getItems,
  addItem,
  removeItem
};
