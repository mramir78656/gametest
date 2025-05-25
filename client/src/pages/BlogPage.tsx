import { useState } from 'react';
import { Helmet } from 'react-helmet';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "How Game-Based Learning Improves Math Skills",
      date: "May 15, 2023",
      author: "Dr. Emily Johnson",
      excerpt: "Research shows that game-based learning can significantly improve mathematical understanding and retention. This article explores the cognitive benefits of educational games in math education.",
      category: "research",
      readTime: "6 min",
      image: "https://placehold.co/600x400/e2f0fb/1a365d?text=Math+Games"
    },
    {
      id: 2,
      title: "5 Educational Games That Make Reading Fun",
      date: "May 8, 2023",
      author: "Michael Williams",
      excerpt: "Discover five engaging games that transform reading from a chore into an adventure. These games help children develop phonics, comprehension, and vocabulary skills while having fun.",
      category: "teaching-tips",
      readTime: "4 min",
      image: "https://placehold.co/600x400/f0e6fa/4a1d96?text=Reading+Games"
    },
    {
      id: 3,
      title: "Supporting Remote Learning Through Educational Games",
      date: "April 30, 2023",
      author: "Sarah Parker, M.Ed.",
      excerpt: "As remote and hybrid learning models continue to evolve, educational games offer a powerful tool for engagement and assessment. Learn how to implement effective game-based strategies in virtual classrooms.",
      category: "remote-learning",
      readTime: "7 min",
      image: "https://placehold.co/600x400/e6f7ef/047857?text=Remote+Learning"
    },
    {
      id: 4,
      title: "The Role of Feedback in Educational Gaming",
      date: "April 22, 2023",
      author: "Dr. Robert Chen",
      excerpt: "Immediate feedback is one of the most powerful aspects of educational games. This article examines how different types of feedback mechanisms support learning and motivation.",
      category: "research",
      readTime: "8 min",
      image: "https://placehold.co/600x400/fef3c7/92400e?text=Learning+Feedback"
    },
    {
      id: 5,
      title: "Creating an Inclusive Game-Based Classroom",
      date: "April 15, 2023",
      author: "Jessica Martinez",
      excerpt: "Educational games should be accessible to all learners. Discover strategies for creating an inclusive environment where every student can benefit from game-based learning.",
      category: "teaching-tips",
      readTime: "5 min",
      image: "https://placehold.co/600x400/fee2e2/991b1b?text=Inclusive+Education"
    },
    {
      id: 6,
      title: "Balancing Screen Time: A Parent's Guide",
      date: "April 8, 2023",
      author: "David Wilson",
      excerpt: "As digital learning becomes more prevalent, parents often wonder about appropriate screen time. This guide offers practical advice for balancing educational technology with other activities.",
      category: "parents",
      readTime: "6 min",
      image: "https://placehold.co/600x400/e0f2fe/0369a1?text=Screen+Time"
    },
    {
      id: 7,
      title: "The Future of Educational Gaming: AI and Adaptive Learning",
      date: "March 30, 2023",
      author: "Dr. Priya Sharma",
      excerpt: "Artificial intelligence is revolutionizing educational games by creating truly personalized learning experiences. Explore the cutting-edge developments in adaptive educational technology.",
      category: "technology",
      readTime: "9 min",
      image: "https://placehold.co/600x400/f3e8ff/6b21a8?text=AI+Learning"
    },
    {
      id: 8,
      title: "Assessing Learning Through Game Performance",
      date: "March 23, 2023",
      author: "Thomas Brooks, Ed.D.",
      excerpt: "Game-based assessment offers new ways to measure student understanding. Learn how to interpret game performance data and use it to inform instructional decisions.",
      category: "teaching-tips",
      readTime: "7 min",
      image: "https://placehold.co/600x400/fef9c3/a16207?text=Game+Assessment"
    },
    {
      id: 9,
      title: "Collaborative vs. Competitive Games in the Classroom",
      date: "March 15, 2023",
      author: "Olivia Garcia",
      excerpt: "Both collaborative and competitive games have a place in education. This article examines when to use each approach and how to maximize their educational benefits.",
      category: "teaching-tips",
      readTime: "5 min",
      image: "https://placehold.co/600x400/dcfce7/166534?text=Game+Dynamics"
    },
    {
      id: 10,
      title: "How Parents Can Support Learning Through Games at Home",
      date: "March 8, 2023",
      author: "Amanda Johnson",
      excerpt: "Educational games aren't just for the classroom. Discover how parents can extend learning at home through thoughtful game selection and participation.",
      category: "parents",
      readTime: "4 min",
      image: "https://placehold.co/600x400/ffedd5/9a3412?text=Home+Learning"
    }
  ];
  
  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'research', name: 'Research & Studies' },
    { id: 'teaching-tips', name: 'Teaching Tips' },
    { id: 'remote-learning', name: 'Remote Learning' },
    { id: 'technology', name: 'Technology Trends' },
    { id: 'parents', name: 'For Parents' }
  ];
  
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Educational Gaming Blog | Tips, Research & Trends</title>
        <meta name="description" content="Explore articles about educational gaming, learning strategies, and the latest research on game-based education for PreK-6 students." />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-3 text-primary">Educational Gaming Blog</h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Insights, research, and practical tips on using educational games to enhance learning for PreK-6 students.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === category.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-primary rounded-full capitalize">
                    {post.category.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">{post.readTime} read</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-grade3 hover:text-primary transition">
                  <a href={`/blog/${post.id}`}>{post.title}</a>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <span className="text-sm font-medium text-gray-700">{post.author}</span>
                </div>
                <div className="mt-4">
                  <a 
                    href={`/blog/${post.id}`}
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Subscribe to Our Newsletter</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Stay updated with the latest research, teaching strategies, and educational game recommendations.
          </p>
          <form className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 rounded-l-md border-y border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;