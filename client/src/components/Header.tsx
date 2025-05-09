import { useState } from "react";
import { Link } from "wouter";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, login, logout } = useUser();

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
            <Link href="/grade/prek">
              <div className="font-heading font-bold text-dark hover:text-primary transition cursor-pointer">Games</div>
            </Link>
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
                <a className="font-heading font-bold text-dark hover:text-primary transition">Home</a>
              </Link>
              <Link href="/grade/prek">
                <a className="font-heading font-bold text-dark hover:text-primary transition">Games</a>
              </Link>
              <Link href="/about">
                <a className="font-heading font-bold text-dark hover:text-primary transition">About</a>
              </Link>
              <Link href="/parents">
                <a className="font-heading font-bold text-dark hover:text-primary transition">Parents</a>
              </Link>
              <Link href="/teachers">
                <a className="font-heading font-bold text-dark hover:text-primary transition">Teachers</a>
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
    </header>
  );
};

export default Header;
