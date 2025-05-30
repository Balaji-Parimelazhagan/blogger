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
      { id: 1, title: 'Welcome to Bloggr', content: `Welcome to Bloggr, your new home for sharing stories, ideas, and inspiration. At Bloggr, we believe everyone has a voice worth hearing. Whether you're a seasoned writer or just starting your blogging journey, our platform is designed to make publishing easy, enjoyable, and rewarding.

With Bloggr, you can create beautiful posts with our intuitive editor, connect with a vibrant community, and discover content that matters to you. Our platform supports rich media, so you can add images, videos, and more to bring your stories to life.

Join groups, follow your favorite authors, and participate in discussions on topics ranging from technology and travel to food and lifestyle. We prioritize your privacy and security, ensuring your data is protected and your experience is safe.

Ready to get started? Sign up, create your profile, and publish your first post today. Welcome to the Bloggr family—where your story begins!

Bloggr is more than just a blogging platform; it's a community of thinkers, creators, and dreamers. Dive in, explore, and let your voice be heard. Here, you can find inspiration, share your expertise, and connect with like-minded individuals from around the world. Our mission is to empower you to tell your story, your way. Whether you want to write about technology, travel, food, or personal growth, Bloggr gives you the tools and audience to make an impact.

We are constantly improving our platform based on your feedback. Expect new features, enhanced customization, and more ways to engage with your readers. Thank you for choosing Bloggr. We can't wait to see what you'll create!`, author_id: 1, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 2, title: 'Traveling in Japan', content: `Traveling in Japan is a mesmerizing experience that blends ancient tradition with cutting-edge modernity. From the neon-lit streets of Tokyo to the tranquil temples of Kyoto, every corner offers something unique.

Start your journey in Tokyo, where you can explore bustling districts like Shibuya and Akihabara, sample sushi at Tsukiji Market, and marvel at the cherry blossoms in Ueno Park. Take a bullet train to Kyoto to wander through bamboo forests, visit historic shrines, and enjoy a traditional tea ceremony.

Don't miss the hot springs (onsen) in Hakone, the snow-capped peaks of Hokkaido, or the tropical beaches of Okinawa. Japanese cuisine is a highlight—try ramen, okonomiyaki, takoyaki, and matcha desserts.

Respect local customs: bow when greeting, remove shoes indoors, and be mindful of quiet in public spaces. Japan's efficient public transport makes getting around easy, and the people are famously polite and helpful.

Whether you're a solo traveler or with family, Japan offers unforgettable adventures, breathtaking scenery, and a culture that will leave you inspired long after you return home. The country's blend of old and new, from ancient castles to futuristic skyscrapers, creates a travel experience unlike any other. Explore local markets, participate in festivals, and immerse yourself in the daily life of Japanese cities and villages. Each region has its own charm, from the snowy landscapes of Sapporo to the subtropical climate of Okinawa. Japan is a destination that will capture your heart and imagination.`, author_id: 1, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 3, title: 'JavaScript Tips', content: `JavaScript is a powerful language for web development, but mastering it requires more than just knowing the basics. Here are some essential tips to elevate your JS skills:

1. Use const and let instead of var for better scoping.
2. Embrace arrow functions for concise syntax, but remember their lexical this binding.
3. Take advantage of destructuring to extract values from objects and arrays.
4. Use template literals for readable string interpolation.
5. Handle asynchronous code with async/await for cleaner logic.
6. Always check for null/undefined before accessing properties.
7. Prefer array methods like map, filter, and reduce over for loops for data transformation.
8. Modularize your code using ES6 modules.
9. Write unit tests to catch bugs early.
10. Keep up with new ECMAScript features.

Example:

const greet = (name = 'Guest') => `Hello, ${name}!`;

By following these tips and practicing regularly, you'll write cleaner, more efficient, and more maintainable JavaScript code. Don't forget to leverage browser dev tools for debugging and performance profiling. Stay curious and keep experimenting with new libraries and frameworks. The JavaScript ecosystem evolves rapidly, so continuous learning is key to staying ahead.`, author_id: 2, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 4, title: 'React vs Vue', content: `React and Vue are two of the most popular JavaScript frameworks for building user interfaces. Both have strong communities and robust ecosystems, but they differ in philosophy and approach.

React, developed by Facebook, is a library focused on building UI components. It uses JSX, a syntax extension that lets you write HTML in JavaScript. React's virtual DOM and one-way data flow make it powerful for large applications.

Vue, created by Evan You, is a progressive framework that is easy to integrate and learn. Its template syntax is familiar to those with HTML experience, and its reactivity system is intuitive.

React excels in flexibility and scalability, while Vue shines in simplicity and approachability. Both support state management, routing, and server-side rendering.

Choosing between them depends on your project needs, team experience, and personal preference. Try building a small app with each to see which fits your workflow best! Consider the learning curve, community support, and available libraries. Both frameworks are excellent choices, and your decision may come down to which paradigm you prefer.`, author_id: 2, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 5, title: 'Best Pasta Recipes', content: `Pasta is a beloved staple of Italian cuisine, and there are countless ways to enjoy it. Here are some of the best pasta recipes to try at home:

1. Spaghetti Carbonara: Creamy, savory, and simple. Use eggs, pancetta, Parmesan, and black pepper.
2. Penne Arrabbiata: Spicy tomato sauce with garlic and chili flakes.
3. Fettuccine Alfredo: Rich and creamy with butter, cream, and Parmesan.
4. Lasagna: Layers of pasta, meat sauce, béchamel, and cheese.
5. Pesto Genovese: Fresh basil, pine nuts, garlic, olive oil, and Parmesan.

Tips: Always cook pasta al dente, salt your water generously, and use fresh ingredients for the best flavor. Pair your pasta with a glass of Italian wine and enjoy a taste of Italy at home!

Buon appetito! Pasta is more than just food—it's a celebration of culture and family. Experiment with different sauces, shapes, and ingredients to create your own signature dishes. Whether you're cooking for a crowd or a cozy dinner for two, pasta brings people together.`, author_id: 3, published: true, created_at: new Date(), updated_at: new Date() },
      { id: 6, title: 'Vegan Desserts', content: `Vegan desserts can be just as delicious and satisfying as their traditional counterparts. Here are some ideas to sweeten your day:

1. Chocolate Avocado Mousse: Creamy, rich, and dairy-free.
2. Banana Nice Cream: Frozen bananas blended into a creamy treat.
3. Vegan Brownies: Fudgy and decadent, made with flax eggs and coconut oil.
4. Chia Pudding: Healthy and customizable with fruits and nuts.
5. Lemon Coconut Energy Balls: No-bake, zesty, and perfect for snacking.

Tips: Use plant-based milks, natural sweeteners, and experiment with nut butters and seeds. Vegan baking is creative and fun—don't be afraid to try new combinations!

Enjoy guilt-free desserts that are kind to animals and the planet. Vegan desserts are perfect for sharing with friends and family, and they prove that you don't need animal products to create amazing treats. Try new recipes, explore global flavors, and make dessert a celebration of compassion and creativity.`, author_id: 3, published: true, created_at: new Date(), updated_at: new Date() },
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
