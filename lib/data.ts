import { Post, Comment, PostCategory } from "@/types/blog";

const VALID_CATEGORIES: PostCategory[] = [
  "technology",
  "design",
  "business",
  "lifestyle",
  "tutorial",
  "opinion",
  "news",
];

export function isValidCategory(cat: string): cat is PostCategory {
  return VALID_CATEGORIES.includes(cat as PostCategory);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateSlug(title: string, existingPosts: Post[]): string {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const existingSlugs = existingPosts.map((p) => p.slug);
  if (!existingSlugs.includes(slug)) return slug;
  let counter = 2;
  while (existingSlugs.includes(`${slug}-${counter}`)) {
    counter++;
  }
  return `${slug}-${counter}`;
}

export function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();
const threeDaysAgo = new Date(Date.now() - 259200000).toISOString();
const fourDaysAgo = new Date(Date.now() - 345600000).toISOString();
const fiveDaysAgo = new Date(Date.now() - 432000000).toISOString();

let posts: Post[] = [
  {
    id: "post-1",
    title: "Getting Started with Next.js 14 App Router",
    slug: "getting-started-with-nextjs-14-app-router",
    excerpt: "Learn how to build modern web applications using the new Next.js 14 App Router with server and client components.",
    content: "# Getting Started with Next.js 14 App Router\n\nNext.js 14 introduces a powerful new App Router that fundamentally changes how we build React applications. In this comprehensive guide, we will explore the key concepts and patterns you need to know.\n\n## Server Components\n\nServer Components are the default in the App Router. They render on the server and send HTML to the client, reducing the JavaScript bundle size.\n\n```tsx\nexport default async function Page() {\n  const data = await fetchData();\n  return <div>{data.title}</div>;\n}\n```\n\n## Client Components\n\nWhen you need interactivity, use the `'use client'` directive at the top of your file.\n\n```tsx\n'use client';\nimport { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}\n```\n\n## Layouts\n\nLayouts wrap pages and preserve state across navigations. They are perfect for shared UI like navigation bars and sidebars.\n\n## Loading and Error States\n\nThe App Router provides built-in support for loading and error states through special files like `loading.tsx` and `error.tsx`.\n\n## Data Fetching\n\nWith Server Components, you can fetch data directly in your components without useEffect or external libraries. This simplifies data loading and improves performance significantly.",
    category: "technology",
    tags: ["nextjs", "react", "typescript"],
    status: "published",
    authorId: "author-1",
    readingTimeMinutes: 1,
    viewCount: 245,
    publishedAt: twoDaysAgo,
    createdAt: threeDaysAgo,
    updatedAt: twoDaysAgo,
  },
  {
    id: "post-2",
    title: "Design Systems That Scale",
    slug: "design-systems-that-scale",
    excerpt: "A practical guide to building and maintaining design systems that grow with your team and product.",
    content: "# Design Systems That Scale\n\nBuilding a design system is one thing. Making it scale across teams, products, and platforms is another challenge entirely.\n\n## Why Design Systems Matter\n\nDesign systems provide a single source of truth for design decisions. They ensure consistency, speed up development, and improve collaboration between designers and developers.\n\n## Core Principles\n\n1. **Consistency** - Every component should look and behave the same way everywhere\n2. **Composability** - Components should be built to work together\n3. **Accessibility** - Every component must meet WCAG standards\n4. **Documentation** - Every component needs clear usage guidelines\n\n## Token Architecture\n\nDesign tokens are the foundation of any scalable design system. They represent the smallest design decisions like colors, spacing, and typography.\n\n## Component Hierarchy\n\nOrganize your components into three tiers: atoms, molecules, and organisms. This hierarchy makes it easier to understand the relationships between components and ensures proper composition patterns.",
    category: "design",
    tags: ["design-systems", "ui", "components"],
    status: "published",
    authorId: "author-2",
    readingTimeMinutes: 1,
    viewCount: 189,
    publishedAt: yesterday,
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
  },
  {
    id: "post-3",
    title: "TypeScript Best Practices for 2024",
    slug: "typescript-best-practices-2024",
    excerpt: "Essential TypeScript patterns and practices every developer should follow in their projects.",
    content: "# TypeScript Best Practices for 2024\n\nTypeScript has become the standard for building large-scale JavaScript applications. Here are the best practices you should follow in 2024.\n\n## Strict Mode\n\nAlways enable strict mode in your tsconfig.json. This catches more errors at compile time and makes your code more robust.\n\n## Avoid `any`\n\nThe `any` type defeats the purpose of TypeScript. Use `unknown` instead when you truly do not know the type, then narrow it down with type guards.\n\n## Use Discriminated Unions\n\nDiscriminated unions are one of TypeScript's most powerful features for modeling state.\n\n```typescript\ntype Result<T> = { success: true; data: T } | { success: false; error: string };\n```\n\n## Prefer Interfaces for Objects\n\nUse interfaces for object shapes and type aliases for unions, primitives, and utility types.\n\n## Generic Constraints\n\nUse generic constraints to make your generic functions safer and more predictable. Always constrain generics to the narrowest type that works for your use case.\n\n## Utility Types\n\nMaster the built-in utility types like Partial, Required, Pick, Omit, and Record. They reduce boilerplate and improve readability.",
    category: "tutorial",
    tags: ["typescript", "javascript", "best-practices"],
    status: "published",
    authorId: "author-1",
    readingTimeMinutes: 1,
    viewCount: 312,
    publishedAt: threeDaysAgo,
    createdAt: fourDaysAgo,
    updatedAt: threeDaysAgo,
  },
  {
    id: "post-4",
    title: "The Future of Remote Work in Tech",
    slug: "future-of-remote-work-in-tech",
    excerpt: "Exploring how remote work is reshaping the technology industry and what it means for developers.",
    content: "# The Future of Remote Work in Tech\n\nRemote work has transformed the tech industry. What started as a temporary measure has become a permanent shift in how we work.\n\n## The Current Landscape\n\nMost tech companies now offer some form of remote or hybrid work. This has opened up opportunities for developers worldwide and changed the dynamics of team collaboration.\n\n## Benefits\n\n- Flexibility in work hours and location\n- No commute time\n- Access to global talent pool\n- Better work-life balance\n\n## Challenges\n\n- Communication across time zones\n- Building team culture remotely\n- Maintaining work-life boundaries\n- Collaboration on complex problems\n\n## Tools and Practices\n\nSuccessful remote teams rely on asynchronous communication, clear documentation, and regular video check-ins. Tools like Slack, Notion, and GitHub have become essential infrastructure for remote work.",
    category: "opinion",
    tags: ["remote-work", "career", "tech-industry"],
    status: "published",
    authorId: "author-2",
    readingTimeMinutes: 1,
    viewCount: 156,
    publishedAt: fourDaysAgo,
    createdAt: fiveDaysAgo,
    updatedAt: fourDaysAgo,
  },
  {
    id: "post-5",
    title: "Building a Startup MVP",
    slug: "building-a-startup-mvp",
    excerpt: "A step-by-step guide to building your minimum viable product and getting to market quickly.",
    content: "# Building a Startup MVP\n\nThe key to a successful startup is getting to market quickly with a minimum viable product that solves a real problem.\n\n## What is an MVP?\n\nAn MVP is the simplest version of your product that delivers value to users. It is not a prototype or a proof of concept. It is a real product that real people can use.\n\n## Steps to Build Your MVP\n\n1. Identify the core problem you are solving\n2. Define the minimum feature set\n3. Choose the right technology stack\n4. Build and ship quickly\n5. Gather feedback and iterate\n\n## Common Mistakes\n\n- Building too many features\n- Perfectionism before launch\n- Ignoring user feedback\n- Not validating the market first\n\n## Technology Choices\n\nFor most web-based MVPs, choose proven technologies that let you move fast. Next.js with a simple database is an excellent choice for most products.",
    category: "business",
    tags: ["startup", "mvp", "entrepreneurship"],
    status: "draft",
    authorId: "author-1",
    readingTimeMinutes: 1,
    viewCount: 0,
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: "post-6",
    title: "Mindful Productivity for Developers",
    slug: "mindful-productivity-for-developers",
    excerpt: "How to stay productive without burning out, with practical tips for software developers.",
    content: "# Mindful Productivity for Developers\n\nProductivity is not about working more hours. It is about working smarter and maintaining sustainable energy levels throughout your career.\n\n## The Pomodoro Technique\n\nWork in focused 25-minute intervals followed by 5-minute breaks. After four intervals, take a longer 15 to 30 minute break.\n\n## Deep Work\n\nSchedule blocks of uninterrupted time for complex coding tasks. Turn off notifications and close unnecessary tabs.\n\n## Energy Management\n\n- Tackle the hardest problems when your energy is highest\n- Save routine tasks for low-energy periods\n- Take real breaks away from screens\n- Exercise regularly\n\n## Avoiding Burnout\n\nBurnout is a real risk in the tech industry. Set clear boundaries between work and personal time. Learn to say no to projects that do not align with your goals.",
    category: "lifestyle",
    tags: ["productivity", "wellness", "developer-life"],
    status: "published",
    authorId: "author-2",
    readingTimeMinutes: 1,
    viewCount: 98,
    publishedAt: fiveDaysAgo,
    createdAt: fiveDaysAgo,
    updatedAt: fiveDaysAgo,
  },
];

let comments: Comment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    authorName: "Alex Turner",
    authorEmail: "alex@example.com",
    content: "Great introduction to the App Router! The code examples are very clear and helpful.",
    approved: true,
    createdAt: yesterday,
  },
  {
    id: "comment-2",
    postId: "post-1",
    authorName: "Maria Garcia",
    authorEmail: "maria@example.com",
    content: "Can you write a follow-up about middleware and route handlers? That would be very useful.",
    approved: true,
    createdAt: now,
  },
  {
    id: "comment-3",
    postId: "post-2",
    authorName: "David Kim",
    authorEmail: "david@example.com",
    content: "This is exactly what our team needed. We are starting to build our design system next sprint.",
    approved: true,
    createdAt: yesterday,
  },
  {
    id: "comment-4",
    postId: "post-3",
    authorName: "Lisa Park",
    authorEmail: "lisa@example.com",
    content: "The section on discriminated unions is excellent. I have been using them everywhere since reading this.",
    approved: true,
    createdAt: twoDaysAgo,
  },
  {
    id: "comment-5",
    postId: "post-1",
    authorName: "Tom Baker",
    authorEmail: "tom@example.com",
    content: "I think server components are overrated. SPAs are still the way to go for most apps.",
    approved: false,
    createdAt: now,
  },
  {
    id: "comment-6",
    postId: "post-4",
    authorName: "Emily Ross",
    authorEmail: "emily@example.com",
    content: "Remote work has been a game changer for me. I moved to a smaller city and my quality of life improved dramatically.",
    approved: true,
    createdAt: threeDaysAgo,
  },
  {
    id: "comment-7",
    postId: "post-2",
    authorName: "Spam Bot",
    authorEmail: "spam@fake.com",
    content: "Check out this amazing deal on design tools at totally-not-spam-dot-com for great prices.",
    approved: false,
    createdAt: now,
  },
  {
    id: "comment-8",
    postId: "post-3",
    authorName: "Jake Chen",
    authorEmail: "jake@example.com",
    content: "Would love to see a comparison between TypeScript and other typed languages for web development.",
    approved: false,
    createdAt: yesterday,
  },
];

export function getPosts(): Post[] {
  return [...posts];
}

export function getPostById(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function addPost(post: Post): void {
  posts.push(post);
}

export function updatePost(id: string, updates: Partial<Post>): Post | undefined {
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  posts[index] = { ...posts[index], ...updates };
  return posts[index];
}

export function deletePost(id: string): boolean {
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  posts.splice(index, 1);
  comments = comments.filter((c) => c.postId !== id);
  return true;
}

export function getComments(): Comment[] {
  return [...comments];
}

export function getCommentById(id: string): Comment | undefined {
  return comments.find((c) => c.id === id);
}

export function addComment(comment: Comment): void {
  comments.push(comment);
}

export function updateComment(id: string, updates: Partial<Comment>): Comment | undefined {
  const index = comments.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  comments[index] = { ...comments[index], ...updates };
  return comments[index];
}

export function deleteComment(id: string): boolean {
  const index = comments.findIndex((c) => c.id === id);
  if (index === -1) return false;
  comments.splice(index, 1);
  return true;
}
