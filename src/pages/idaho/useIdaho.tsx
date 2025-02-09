export const useIdaho = () => {
    const blogPosts = [
        {
          title: "Getting Started with React Development",
          excerpt: "Learn the fundamentals of React and start building modern web applications. We'll cover components, props, state, and more.",
          author: "Jane Smith",
          date: "2025-02-09",
          readTime: "5 min read",
          category: "Development",
          image: "src/assets/idaho-blog-icon.svg"
        },
        {
          title: "Modern JavaScript Features You Should Know",
          excerpt: "Explore the latest JavaScript features that will make your code cleaner and more efficient. From arrow functions to destructuring.",
          author: "John Doe",
          date: "2025-02-08",
          readTime: "8 min read",
          category: "JavaScript",
          image: "/api/placeholder/800/400"
        },
        {
          title: "CSS Grid Layout Made Simple",
          excerpt: "Master CSS Grid layout with practical examples and real-world use cases. Build responsive layouts with ease.",
          author: "Sarah Johnson",
          date: "2025-02-07",
          readTime: "6 min read",
          category: "CSS",
          image: "/api/placeholder/800/400"
        }
      ];

    return {
        blogPosts
    };
}