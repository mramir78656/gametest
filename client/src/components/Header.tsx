import { useState } from "react";
import { Link } from "wouter";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGradeMenuOpen, setIsGradeMenuOpen] = useState(false);
  const { user, login, logout } = useUser();

  // Grade categories
  const grades = [
    { name: "Pre-Nursery", slug: "pre-nursery" },
    { name: "Nursery", slug: "nursery" },
    { name: "KG", slug: "kg" },
    { name: "Grade 1", slug: "grade-1" },
    { name: "Grade 2", slug: "grade-2" },
    { name: "Grade 3", slug: "grade-3" },
    { name: "Grade 4", slug: "grade-4" },
    { name: "Grade 5", slug: "grade-5" }
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-game font-bold">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-game text-dark">EduFun <span className="text-primary">Games</span></h1>
                <p className="text-xs text-gray-500">Learning through play!</p>
              </div>
            </div>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">Home</div>
            </Link>
            
            {/* Grade Dropdown */}
            <div className="relative group">
              <div 
                className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer flex items-center"
                onClick={() => setIsGradeMenuOpen(!isGradeMenuOpen)}
              >
                Games by Grade
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Grade Dropdown Menu - Desktop */}
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20 transform origin-top scale-0 group-hover:scale-100 transition duration-150 ease-in-out">
                <div className="py-2 grid grid-cols-1 gap-1">
                  {grades.map((grade) => (
                    <Link key={grade.slug} href={`/grade/${grade.slug}`}>
                      <div className="px-4 py-2 text-dark hover:bg-primary hover:text-white transition cursor-pointer">
                        {grade.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link href="/about">
              <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">About</div>
            </Link>
            <Link href="/parents">
              <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">Parents</div>
            </Link>
            <Link href="/teachers">
              <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">Teachers</div>
            </Link>
          </nav>
          
          {/* User Login */}
          <div className="flex items-center space-x-3">
            {!user ? (
              <>
                <button 
                  className="hidden md:block bg-secondary hover:bg-opacity-80 text-white font-heading font-bold py-2 px-4 rounded-full transition"
                  onClick={() => login({ id: 1, username: "demo_user", displayName: "Demo User" })}
                >
                  Sign Up Free
                </button>
                <button 
                  className="bg-primary hover:bg-opacity-80 text-white font-heading font-bold py-2 px-4 rounded-full transition"
                  onClick={() => login({ id: 1, username: "demo_user", displayName: "Demo User" })}
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                <span className="hidden md:block font-heading">Hi, {user.displayName || user.username}!</span>
                <button 
                  className="bg-primary hover:bg-opacity-80 text-white font-heading font-bold py-2 px-4 rounded-full transition"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}
            <button 
              className="md:hidden text-2xl text-dark"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link href="/">
                <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">Home</div>
              </Link>
              
              {/* Grade dropdown - Mobile */}
              <div>
                <div 
                  className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer flex items-center justify-between"
                  onClick={() => setIsGradeMenuOpen(!isGradeMenuOpen)}
                >
                  <span>Games by Grade</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${isGradeMenuOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {isGradeMenuOpen && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100">
                    {grades.map((grade) => (
                      <Link key={grade.slug} href={`/grade/${grade.slug}`}>
                        <div className="font-heading text-dark hover:text-primary transition cursor-pointer">
                          {grade.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link href="/about">
                <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">About</div>
              </Link>
              <Link href="/parents">
                <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">Parents</div>
              </Link>
              <Link href="/teachers">
                <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">Teachers</div>
              </Link>
              {!user && (
                <button 
                  className="bg-secondary hover:bg-opacity-80 text-white font-heading font-bold py-2 px-4 rounded-full transition w-full mt-4"
                  onClick={() => login({ id: 1, username: "demo_user", displayName: "Demo User" })}
                >
                  Sign Up Free
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
      
      {/* Grade Navigation Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex justify-between items-center overflow-x-auto">
            {grades.map((grade) => (
              <Link key={grade.slug} href={`/grade/${grade.slug}`}>
                <div className="py-3 px-4 text-white font-medium hover:bg-primary-dark transition cursor-pointer whitespace-nowrap">
                  {grade.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
