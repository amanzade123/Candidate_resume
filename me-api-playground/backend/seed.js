const { sequelize, Profile, Skill, Project, Work } = require('./models');

async function seed() {
  await sequelize.sync({ force: true }); // reset DB for seed

  const myProfile = {
    name: "Aman Zade",
    email: "bt22csd004@iiitn.ac.in",
    education: "B.Tech in Computer Science and Engineering(Data Science) at IIIT Nagpur (2022-2026)",
    github: "https://github.com/amanzade123/Projects",
    linkedin: "https://www.linkedin.com/in/aman-zade-b4808a275",
    portfolio: "https://yourportfolio.example"
  };
  const skills = [
    { name: "python", proficiency: 90 },
    { name: "javascript", proficiency: 85 },
    { name: "react", proficiency: 80 },
    { name: "sql", proficiency: 75 }
  ];

  const projects = [
    {
      title: "AI-NIDS: Network Intrusion Detection",
      description: "ML-based NIDS using RandomForest and XGBoost.",
      links: { github: "https://github.com/yourusername/AI-NIDS" },
      skills: ["python", "pyspark"]
    },
    {
      title: "Lane & Pothole Detection WebApp",
      description: "Used YOLOv8 and OpenCV for lane and pothole detection.",
      links: { demo: "https://your-deployment.example" },
      skills: ["python", "pytorch", "opencv"]
    }
  ];

  const work = [
    { company: 'Company A', role: 'Software Intern', startDate: '2023-06-01', endDate: '2023-08-31', description: 'Worked on backend microservices.' }
  ];
  // =====================================================

  const profile = await Profile.create(myProfile);
  const createdSkills = [];
  for (const s of skills) {
    const [skill] = await Skill.findOrCreate({ where: { name: s.name }, defaults: s });
    createdSkills.push(skill);
  }
  await profile.addSkills(createdSkills);

  for (const p of projects) {
    const project = await Project.create({ title: p.title, description: p.description, links: p.links, profileId: profile.id });
    const skillInstances = [];
    for (const sname of p.skills) {
      const [s] = await Skill.findOrCreate({ where: { name: sname }, defaults: { name: sname }});
      skillInstances.push(s);
    }
    await project.addSkills(skillInstances);
  }

  for (const w of work) {
    await Work.create(Object.assign({}, w, { profileId: profile.id }));
  }

  console.log('Seed complete.');
  await sequelize.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
