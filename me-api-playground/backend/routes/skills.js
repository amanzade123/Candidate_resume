const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '10', 10);
    const sql = `
      SELECT s.id, s.name, COUNT(ps.ProjectId) AS count
      FROM Skills s
      LEFT JOIN ProjectSkills ps ON s.id = ps.SkillId
      GROUP BY s.id, s.name
      ORDER BY count DESC
      LIMIT :limit
    `;
    const rows = await sequelize.query(sql, { replacements: { limit }, type: QueryTypes.SELECT });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
