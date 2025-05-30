'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash passwords for each user
    const plainPasswords = ['password123', 'password123', 'password123'];
    const hashes = await Promise.all(plainPasswords.map(pw => bcrypt.hash(pw, 10)));
    const users = [
      { id: 1, name: 'Alice Smith', email: 'alice@example.com', password: hashes[0], avatar_url: null, bio: 'Writer & traveler', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'Bob Lee', email: 'bob@example.com', password: hashes[1], avatar_url: null, bio: 'Tech enthusiast', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'Carol Jones', email: 'carol@example.com', password: hashes[2], avatar_url: null, bio: 'Food blogger', created_at: new Date(), updated_at: new Date() },
    ];
    await queryInterface.bulkInsert('users', users);

    // Posts
    const posts = [
      { id: 1, title: 'Welcome to Bloggr', content: 'This is the first post!', author_id: 1, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 2, title: 'Traveling in Japan', content: 'Japan is amazing...', author_id: 1, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 3, title: 'JavaScript Tips', content: 'Let me share some JS tips...', author_id: 2, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 4, title: 'React vs Vue', content: 'A comparison of React and Vue...', author_id: 2, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 5, title: 'Best Pasta Recipes', content: 'Try these pasta recipes...', author_id: 3, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 6, title: 'Vegan Desserts', content: 'Delicious vegan desserts...', author_id: 3, published: true, created_at: new Date(), updated_at: new Date() },
    ];
    await queryInterface.bulkInsert('blog_posts', posts);

    // Comments (2 per post, from different users)
    const comments = [
      // Post 1
      { id: 1, content: 'Great start!', post_id: 1, author_id: 2, created_at: new Date() },
      { id: 2, content: 'Looking forward to more.', post_id: 1, author_id: 3, created_at: new Date() },
      // Post 2
      { id: 3, content: 'Japan is on my list!', post_id: 2, author_id: 2, created_at: new Date() },
      { id: 4, content: 'Nice travel tips.', post_id: 2, author_id: 3, created_at: new Date() },
      // Post 3
      { id: 5, content: 'JS tips are always welcome.', post_id: 3, author_id: 1, created_at: new Date() },
      { id: 6, content: 'Thanks for sharing!', post_id: 3, author_id: 3, created_at: new Date() },
      // Post 4
      { id: 7, content: 'I prefer React.', post_id: 4, author_id: 1, created_at: new Date() },
      { id: 8, content: 'Vue is great too!', post_id: 4, author_id: 3, created_at: new Date() },
      // Post 5
      { id: 9, content: 'Yum, pasta!', post_id: 5, author_id: 1, created_at: new Date() },
      { id: 10, content: 'Can\'t wait to try.', post_id: 5, author_id: 2, created_at: new Date() },
      // Post 6
      { id: 11, content: 'Vegan desserts rock!', post_id: 6, author_id: 1, created_at: new Date() },
      { id: 12, content: 'More please!', post_id: 6, author_id: 2, created_at: new Date() },
    ];
    await queryInterface.bulkInsert('comments', comments);

    // Related Posts (link post 1 <-> 2, 3 <-> 4, 5 <-> 6)
    const related = [
      { post_id: 1, related_post_id: 2 },
      { post_id: 2, related_post_id: 1 },
      { post_id: 3, related_post_id: 4 },
      { post_id: 4, related_post_id: 3 },
      { post_id: 5, related_post_id: 6 },
      { post_id: 6, related_post_id: 5 },
    ];
    await queryInterface.bulkInsert('related_posts', related);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('related_posts', null, {});
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('blog_posts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
