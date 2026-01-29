import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  date: string;
  categories: string[];
}

const POSTS_PER_PAGE = 8;

// Sample blog data
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Latest Fashion Trends for 2024",
    slug: "fashion-trends-2024",
    excerpt: "Discover the hottest fashion trends that will dominate 2024.",
    content: "Full content here...",
    image: "https://picsum.photos/600/400?random=301",
    author: "Fashion Editor",
    date: "Jan 15, 2024",
    categories: ["Fashion", "Trends"]
  },
  {
    id: "2",
    title: "Sustainable Fashion Guide",
    slug: "sustainable-fashion-guide",
    excerpt: "Learn how to build a sustainable wardrobe.",
    content: "Full content here...",
    image: "https://picsum.photos/600/400?random=302",
    author: "Style Expert",
    date: "Jan 10, 2024",
    categories: ["Sustainability", "Fashion"]
  },
  {
    id: "3",
    title: "Summer Collection 2024",
    slug: "summer-collection-2024",
    excerpt: "Explore our vibrant summer collection with breezy fabrics and bold colors.",
    content: "Full content here...",
    image: "https://picsum.photos/600/400?random=303",
    author: "Fashion Designer",
    date: "Jan 8, 2024",
    categories: ["Collections", "Summer"]
  },
  {
    id: "4",
    title: "Accessorizing Tips & Tricks",
    slug: "accessorizing-tips-tricks",
    excerpt: "Master the art of accessorizing with our expert guide.",
    content: "Full content here...",
    image: "https://picsum.photos/600/400?random=304",
    author: "Style Consultant",
    date: "Jan 5, 2024",
    categories: ["Accessories", "Tips"]
  },
  {
    id: "5",
    title: "Men's Fashion Essentials",
    slug: "mens-fashion-essentials",
    excerpt: "Building the perfect wardrobe with essential pieces for men.",
    content: "Full content here...",
    image: "https://picsum.photos/600/400?random=305",
    author: "Men's Fashion Editor",
    date: "Jan 3, 2024",
    categories: ["Men's Fashion", "Essentials"]
  },
  {
    id: "6",
    title: "Women's Office Wear Guide",
    slug: "womens-office-wear-guide",
    excerpt: "Professional and stylish office wear options for modern women.",
    content: "Full content here...",
    image: "https://picsum.photos/600/400?random=306",
    author: "Career Fashion Expert",
    date: "Dec 28, 2023",
    categories: ["Women's Fashion", "Office Wear"]
  },
  {
    id: "7",
    title: "Street Style Inspiration",
    slug: "street-style-inspiration",
    excerpt: "Get inspired by the latest street style trends from around the world.",
    content: "Full content here...",
    image: "https://picsum.photos/600/400?random=307",
    author: "Street Style Blogger",
    date: "Dec 25, 2023",
    categories: ["Street Style", "Inspiration"]
  },
  {
    id: "8",
    title: "Seasonal Color Trends",
    slug: "seasonal-color-trends",
    excerpt: "Discover the perfect color palette for every season.",
    content: "Full content here...",
    image: "https://picsum.photos/600/400?random=308",
    author: "Color Expert",
    date: "Dec 20, 2023",
    categories: ["Colors", "Seasonal"]
  }
];

const blogCategories = [
  { name: "Fashion", count: 12 },
  { name: "Trends", count: 8 },
  { name: "Sustainability", count: 5 },
  { name: "Collections", count: 6 },
  { name: "Accessories", count: 4 },
  { name: "Men's Fashion", count: 7 },
  { name: "Women's Fashion", count: 9 },
  { name: "Street Style", count: 3 },
  { name: "Colors", count: 4 },
  { name: "Seasonal", count: 5 }
];

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const posts = blogPosts as BlogPost[];

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const handleCategoryClick = (category: string) => {
    console.log("Filter by category:", category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-gray-600">
            Stay updated with the latest fashion, lifestyle, and design trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div 
                    onClick={() => handlePostClick(post.slug)}
                    className="h-48 cursor-pointer overflow-hidden"
                  >
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span>By <strong>{post.author}</strong></span>
                      <span>{post.date}</span>
                    </div>

                    <h3 
                      onClick={() => handlePostClick(post.slug)}
                      className="text-xl font-bold mb-3 cursor-pointer hover:text-blue-600"
                    >
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePostClick(post.slug)}
                      className="text-blue-600 font-medium hover:text-blue-800"
                    >
                      CONTINUE READING
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  PREVIOUS
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded ${
                      page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">CATEGORIES</h3>
              <ul className="space-y-2">
                {blogCategories.map((cat) => (
                  <li key={cat.name}>
                    <button
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex justify-between w-full text-left hover:text-blue-600"
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-500">({cat.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">RECENT POSTS</h3>
              <ul className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <li key={post.id}>
                    <button
                      onClick={() => handlePostClick(post.slug)}
                      className="text-left hover:text-blue-600 block"
                    >
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.date}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
