# docs/BLOGGR_PRD.md

## Introduction

### Project Vision
Create a modern, user-friendly blogging platform that empowers individuals to write, share, and explore high-quality content across various topics. Bloggr aims to provide a minimalistic, distraction-free writing experience paired with an elegant reading interface.

### Goals
- Enable users to easily write, save, and publish blog posts.
- Allow readers to explore, read, and engage with content through comments and related posts.
- Foster a community of writers and readers with intuitive navigation and clean design.

### Overview
Bloggr is a web-based platform with three core interfaces:
1. **Landing Page** – Showcases featured and recent blogs with imagery and summaries.
2. **Blog Post View** – Full blog view with author details, comments, and related posts.
3. **Create Post Page** – Simple, clean interface for drafting and publishing posts.

---

## Target Audience

### Personas

#### 🧑‍💻 Independent Writers
- Wants: A simple and professional-looking platform to publish articles.
- Goals: Reach audiences, share ideas, build a portfolio.
- Frustrations: Overcomplicated CMS platforms, cluttered interfaces.

#### 📖 Casual Readers
- Wants: Discover insightful, well-written content.
- Goals: Explore content by topic, read comfortably on any device.
- Frustrations: Overwhelming layouts, poor readability, irrelevant recommendations.

#### 🧑‍🏫 Educators & Thought Leaders
- Wants: Share knowledge in an impactful way.
- Goals: Engage audiences with meaningful commentary and related content.
- Frustrations: Lack of customization or intellectual credibility cues.

---

## Core Features

### 1. Landing Page
- Featured and recent posts displayed with title, image, excerpt, and CTA ("Read More").
- Horizontal layout for hero post; vertical cards for other posts.
- Navigation: Home, Our Story, Membership, Write, Sign In.

### 2. Blog Post View
- Post title, author info, publication outlet, hero image.
- Rich text content area.
- Comments section with name, avatar, and time of comment.
- Sidebar with related posts (category, title, author).

### 3. Create Blog Page
- Input fields: Title, Content (textarea).
- Buttons: Save Draft, Publish.
- Profile menu with avatar, access to notifications and post creation.

---

## User Stories / Flows

### As a writer:
- I want to create a blog post using a simple editor so that I can publish content quickly.
- I want to save drafts so I can revisit and finish my work later.

### As a reader:
- I want to browse the homepage to find interesting articles.
- I want to read full blog posts with clean typography and visuals.
- I want to comment on posts to engage in discussion.

### As a returning user:
- I want to access my posts and drafts through my profile.
- I want to receive notifications about interactions (e.g., comments).

---

## Business Rules

- Only authenticated users can create, save, or publish blog posts.
- Drafts are private and only visible to the author.
- Published posts are publicly accessible.
- Commenting is allowed by logged-in users only.
- Posts must have a title and body to be published.

---

## Data Models / Entities (High-Level)

### User
- id
- name
- email
- avatar_url
- bio

### BlogPost
- id
- title
- content
- author_id
- published (bool)
- created_at
- updated_at

### Comment
- id
- post_id
- author_id
- content
- created_at

### RelatedPost (Algorithmic or Manual)
- post_id
- related_post_id

---

## Non-Functional Requirements

- **Performance**: Pages must load in <1s on modern broadband.
- **Scalability**: Backend should support thousands of concurrent readers and writers.
- **Security**: Input validation, CSRF protection, secure authentication.
- **Usability**: Editor should auto-save drafts and be responsive.
- **Accessibility**: WCAG AA compliance, keyboard navigation, alt text for images.

---

## Success Metrics (Optional)

- Time to publish (from draft to post).
- Monthly active users (writers and readers).
- Engagement: Comments per post, time on post page.
- Retention: % of users returning within 30 days.

---

## Future Considerations (Optional)

- Rich media support (images, embeds, video).
- Tags and categories for better content discovery.
- Custom domains and writer profiles.
- Analytics dashboard for writers.
- Membership/subscription system for monetization.

