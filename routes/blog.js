const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/all-students');
});

router.get('/all-students', async function (req, res) {
  const query = `
    SELECT details.* FROM details ;
  `;
  const [posts] = await db.query(query);
  res.render('posts-list', { posts: posts });
});

router.get('/new', async function (req, res) {
  const [authors] = await db.query('SELECT * FROM details');
  res.render('create-post', { authors: authors });
});

router.post('/all-students', async function (req, res) {
  const data = [
    req.body.roll,
    req.body.name,
    req.body.cgpa
    // req.body.author,
  ];
  await db.query(
    'INSERT INTO details (roll, name, cgpa) VALUES (?)',
    [data]
  );
  res.redirect('/all-students');
});

router.get('/all-students/:id', async function (req, res) {
  const query = `
    SELECT details.* FROM details;
  `;

  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render('404');
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  res.render('post-detail', { post: postData });
});

router.get('/all-students/:id/edit', async function (req, res) {
  const query = `
    SELECT * FROM details WHERE id = ?
  `;
  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render('404');
  }

  res.render('update-post', { post: posts[0] });
});

router.post('/all-students/:id/edit', async function (req, res) {
  const query = `
    UPDATE details SET roll = ?, name = ?, cgpa = ?
    WHERE id = ?
  `;

  await db.query(query, [
    req.body.roll,
    req.body.name,
    req.body.cgpa,
    req.params.id,
  ]);

  res.redirect('/all-students');
});

router.post('/all-students/:id/delete', async function (req, res) {
  await db.query('DELETE FROM details WHERE id = ?', [req.params.id]);
  res.redirect('/all-students');
});

module.exports = router;
