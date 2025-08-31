const express = require('express');
const router = express.Router();
const { Profile, Project, Skill, Work } = require('../models');
const requireBasicAuth = require('../middleware/auth');
const writeLimiter = require('../middleware/rateLimiter')

async function ensureSkillInstances(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return [];
  const skillInstances = [];
  for (const s of skills) {
    const name = typeof s === 'string' ? s : (s && (s.name || s));
    if (!name) continue;
    const [skill] = await Skill.findOrCreate({ where: { name }, defaults: { name } });
    skillInstances.push(skill);
  }
  return skillInstances;
}

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      include: [
        { model: Project, as: 'projects', include: ['skills'] },
        { model: Work, as: 'work' },
        { model: Skill, as: 'skills' }
      ]
    });
    if (!profile) return res.status(404).json({ message: 'No profile found.' });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/',requireBasicAuth, writeLimiter, async (req, res) => {
  try {
    const { name, email, education, github, linkedin, portfolio, skills } = req.body;
    const profile = await Profile.create({ name, email, education, github, linkedin, portfolio });

    if (Array.isArray(skills) && skills.length) {
      const skillInstances = await ensureSkillInstances(skills);
      if (skillInstances.length) await profile.setSkills(skillInstances);
    }

    const created = await Profile.findByPk(profile.id, {
      include: [
        { model: Project, as: 'projects', include: ['skills'] },
        { model: Work, as: 'work' },
        { model: Skill, as: 'skills' }
      ]
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/',requireBasicAuth, writeLimiter, async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: 'No profile to update.' });

    const updatable = ['name', 'email', 'education', 'github', 'linkedin', 'portfolio'];
    const toUpdate = {};
    updatable.forEach(k => { if (req.body[k] !== undefined) toUpdate[k] = req.body[k]; });

    if (Object.keys(toUpdate).length) await profile.update(toUpdate);

    if (req.body.skills !== undefined) {
      const skillInstances = await ensureSkillInstances(req.body.skills);
      await profile.setSkills(skillInstances); // replace existing
    }

    const updated = await Profile.findByPk(profile.id, {
      include: [
        { model: Project, as: 'projects', include: ['skills'] },
        { model: Work, as: 'work' },
        { model: Skill, as: 'skills' }
      ]
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
