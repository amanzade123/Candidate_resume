const express = require('express');
const router = express.Router();
const { Project, Profile } = require('../models');
const { Op } = require('sequelize');

// GET /search?q=...
router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.status(400).json({ message: 'q param required' });

    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
      include: ['skills']
    });

    const profiles = await Profile.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { education: { [Op.like]: `%${q}%` } }
        ]
      }
    });

    res.json({ projects, profiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
