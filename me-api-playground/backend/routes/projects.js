const express = require('express');
const router = express.Router();
const { Project, Skill, Profile } = require('../models');
const { Op } = require('sequelize');
const requireBasicAuth = require('../middleware/auth');
const writeLimiter = require('../middleware/rateLimiter');

function parseLinksString(s) {
  if (!s) return null;
  s = s.trim();
  try {
    const parsed = JSON.parse(s);
    if (typeof parsed === 'object') return parsed;
  } catch (e) { /* not JSON */ }

  const parts = s.split(',').map(p => p.trim()).filter(Boolean);
  const obj = {};
  parts.forEach(part => {
    const [k, ...rest] = part.split('=');
    if (!k) return;
    obj[k.trim()] = rest.join('=').trim();
  });
  return Object.keys(obj).length ? obj : null;
}

router.get('/', async (req, res) => {
  try {
    const { skill, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (skill) {
      const projects = await Project.findAll({
        include: [{
          model: Skill,
          as: 'skills',
          where: { name: { [Op.like]: `%${skill}%` } },
          attributes: ['id','name'],
          through: { attributes: [] }
        }],
        offset, limit: parseInt(limit)
      });
      return res.json(projects);
    }

    const projects = await Project.findAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: Skill, as: 'skills', attributes: ['id','name'], through: { attributes: [] } }]
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Skill, as: 'skills', attributes: ['id','name'], through: { attributes: [] } }]
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /projects  -> create a project (body: title, description, links, skills[], profileId)
router.post('/', requireBasicAuth, writeLimiter, async (req, res) => {
  try {
    const { title, description, links, skills = [], profileId } = req.body;
    if (!title) return res.status(400).json({ message: 'title required' });

    const finalLinks = typeof links === 'string' ? parseLinksString(links) : (links || null);

    const project = await Project.create({ title, description, links: finalLinks, profileId: profileId || null });

    if (Array.isArray(skills) && skills.length) {
      const skillInstances = [];
      for (const s of skills) {
        const name = typeof s === 'string' ? s : (s.name || '');
        if (!name) continue;
        const [skill] = await Skill.findOrCreate({ where: { name }, defaults: { name } });
        skillInstances.push(skill);
      }
      await project.setSkills(skillInstances);
    }

   
    const created = await Project.findByPk(project.id, {
      include: [{ model: Skill, as: 'skills', attributes: ['id','name'], through: { attributes: [] } }]
    });

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /projects/:id  -> update project fields and skills
router.put('/:id', requireBasicAuth, writeLimiter, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, links, skills, profileId } = req.body;
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const finalLinks = typeof links === 'string' ? parseLinksString(links) : (links || null);

    await project.update({
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(finalLinks !== undefined ? { links: finalLinks } : {}),
      ...(profileId !== undefined ? { profileId } : {})
    });

    if (Array.isArray(skills)) {
      const skillInstances = [];
      for (const s of skills) {
        const name = typeof s === 'string' ? s : (s.name || '');
        if (!name) continue;
        const [skill] = await Skill.findOrCreate({ where: { name }, defaults: { name } });
        skillInstances.push(skill);
      }
      await project.setSkills(skillInstances);
    }

    const updated = await Project.findByPk(id, {
      include: [{ model: Skill, as: 'skills', attributes: ['id','name'], through: { attributes: [] } }]
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
