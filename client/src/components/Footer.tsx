import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-game font-bold">E</span>
              </div>
              <div>
                <h2 className="text-xl font-game text-white">EduFun <span className="text-primary">Games</span></h2>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Educational games that make learning fun for PreK through 6th grade students.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-primary transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-primary transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-primary transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-primary transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/grade/prek">
                  <a className="text-gray-400 hover:text-primary transition">Games by Grade</a>
                </Link>
              </li>
              <li>
                <Link href="/subjects">
                  <a className="text-gray-400 hover:text-primary transition">Games by Subject</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-primary transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-400 hover:text-primary transition">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-primary transition">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For parents */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">For Parents</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/parents/getting-started">
                  <a className="text-gray-400 hover:text-primary transition">Getting Started</a>
                </Link>
              </li>
              <li>
                <Link href="/parents/premium">
                  <a className="text-gray-400 hover:text-primary transition">Premium Subscription</a>
                </Link>
              </li>
              <li>
                <Link href="/parents/progress">
                  <a className="text-gray-400 hover:text-primary transition">Progress Tracking</a>
                </Link>
              </li>
              <li>
                <Link href="/parents/safety">
                  <a className="text-gray-400 hover:text-primary transition">Safety & Privacy</a>
                </Link>
              </li>
              <li>
                <Link href="/parents/faq">
                  <a className="text-gray-400 hover:text-primary transition">FAQs</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For teachers */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">For Teachers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/teachers/classroom-tools">
                  <a className="text-gray-400 hover:text-primary transition">Classroom Tools</a>
                </Link>
              </li>
              <li>
                <Link href="/teachers/lesson-plans">
                  <a className="text-gray-400 hover:text-primary transition">Lesson Plans</a>
                </Link>
              </li>
              <li>
                <Link href="/teachers/school-subscriptions">
                  <a className="text-gray-400 hover:text-primary transition">School Subscriptions</a>
                </Link>
              </li>
              <li>
                <Link href="/teachers/remote-learning">
                  <a className="text-gray-400 hover:text-primary transition">Remote Learning</a>
                </Link>
              </li>
              <li>
                <Link href="/teachers/resources">
                  <a className="text-gray-400 hover:text-primary transition">Teacher Resources</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} EduFun Games. All rights reserved.</p>
          <div className="flex space-x-4 text-sm">
            <Link href="/terms">
              <a className="text-gray-500 hover:text-primary transition">Terms of Service</a>
            </Link>
            <Link href="/privacy">
              <a className="text-gray-500 hover:text-primary transition">Privacy Policy</a>
            </Link>
            <Link href="/cookies">
              <a className="text-gray-500 hover:text-primary transition">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
