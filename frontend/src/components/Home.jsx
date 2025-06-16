import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Authenticate.jsx";
import { ArrowRight, CheckCircle, Users, Calendar, Bell, TrendingUp } from "lucide-react";
import logo from "../assets/logo.png"; // correct "assets" spelling

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {}, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed w-full backdrop-blur-md bg-black/70 z-50 px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />

            <span className="font-bold text-xl">TaskFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-300 text-sm">
            <a href="#features" className="hover:text-emerald-400 transition">Features</a>
            <a href="#testimonials" className="hover:text-emerald-400 transition">Testimonials</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm hover:text-emerald-400 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 rounded-full font-medium transition-colors"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={navigate("/login")}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-full font-medium transition-colors"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 mb-4">
                Productivity reimagined
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Task Flow</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 leading-relaxed">
                When you're on the go, let the tasks flow. Streamline your productivity and achieve more with less effort.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Get Started <ArrowRight size={16} />
              </button>
              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full font-medium transition-all duration-200 backdrop-blur"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-xl opacity-20"></div>
            <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="h-full flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-gray-800 rounded-xl p-4">
                  <div className="h-6 w-1/3 bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {[
              ["12K+", "Active Users", <Users size={24} />],
              ["95%", "Task Completion Rate", <CheckCircle size={24} />],
              ["48+", "Companies Using Us", <TrendingUp size={24} />]
            ].map(([num, label, icon], idx) => (
              <div key={idx} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="flex justify-center mb-3 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">{num}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              What You Can Do
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Streamline your workflow with these powerful features
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              ["Stay Organized", "Manage and categorize your tasks effortlessly with custom tags and smart folders.", <CheckCircle size={24} className="text-emerald-400" />],
              ["Smart Reminders", "Get alerted before deadlines with customizable notifications across all your devices.", <Bell size={24} className="text-emerald-400" />],
              ["Collaborate Seamlessly", "Assign tasks, set priorities, and track your team with real-time updates.", <Users size={24} className="text-emerald-400" />],
              ["Track Progress", "See what's been done and what's next with beautiful, insightful charts and analytics.", <TrendingUp size={24} className="text-emerald-400" />]
            ].map(([title, desc, icon], idx) => (
              <div key={idx} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-emerald-500/30 transition-all duration-300 h-full flex flex-col">
                  <div className="mb-4">{icon}</div>
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">{title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["Alex M.", "CTO, TechStart", "TaskFlow helped our remote team stay on track, even across time zones. The interface is intuitive and the analytics are game-changing."],
              ["Maria L.", "Project Manager", "We've tried many task management tools, but TaskFlow has the perfect balance of simplicity and power. My team's productivity increased by 35%."],
              ["Jayden K.", "Freelance Designer", "As someone who juggles multiple clients, TaskFlow has been a lifesaver. I can organize by project and never miss a deadline."]
            ].map(([name, position, quote], index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-emerald-500/30 transition-all duration-300 h-full flex flex-col">
                  <div className="mb-4">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.667 16H5.33366C5.33366 10.8 9.33366 6.66667 14.667 6.66667V9.33333C11.067 9.33333 8.00033 12.4 8.00033 16H10.667V22.6667H4.00033V16H10.667ZM24.0003 16H18.667C18.667 10.8 22.667 6.66667 28.0003 6.66667V9.33333C24.4003 9.33333 21.3337 12.4 21.3337 16H24.0003V22.6667H17.3337V16H24.0003Z" fill="url(#paint0_linear)" />
                      <defs>
                        <linearGradient id="paint0_linear" x1="4.00033" y1="6.66667" x2="28.0003" y2="22.6667" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#10B981" />
                          <stop offset="1" stopColor="#0D9488" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{quote}"</p>
                  <div className="mt-auto flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold">
                      {name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">{name}</p>
                      <p className="text-emerald-400 text-xs">{position}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Logos */}
<section className="px-6 py-16 overflow-hidden">
  <div className="text-center mb-10">
    <h2 className="text-2xl font-bold text-gray-300">Trusted by teams at:</h2>
  </div>
  <div className="max-w-7xl mx-auto relative">
    <div className="absolute left-0 right-0 h-full bg-gradient-to-r from-black via-transparent to-black z-10"></div>
    <div className="flex animate-slide whitespace-nowrap gap-8 py-4">
      {Array(2).fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {[
            "Vookst Enegy",
            "Franklin Koots",
            "Koohill International Schools",
            "Ed-Bryn Projects"
          ].map((brand, i) => (
            <div
              key={`${index}-${i}`}
              className="w-60 h-16 rounded-xl border border-gray-800 flex items-center justify-center mx-4 px-4 bg-gray-900"
            >
              <span className="text-gray-300 font-semibold text-m ">{brand}</span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  </div>
</section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about TaskFlow
            </p>
          </div>
          <div className="space-y-8">
            {[
              ["Is TaskFlow free to use?", "Yes, we offer a generous free tier with all the essential features you need to get started. For teams and advanced features, we have affordable premium plans."],
              ["Can I use it with my team?", "Absolutely! TaskFlow is built for collaboration. You can easily assign tasks, share updates, and track progress together in real-time."],
              ["Do you support mobile devices?", "Yes, TaskFlow is fully responsive and works beautifully on all devices. We also have dedicated iOS and Android apps for on-the-go productivity."]
            ].map(([q, a], i) => (
              <div key={i} className="group">
                <div className="relative p-6 rounded-xl backdrop-blur-md bg-gray-800/30 border border-gray-700 group-hover:border-emerald-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">{q}</h3>
                  <p className="mt-2 text-gray-400 text-sm leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">Still have questions?</p>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to boost your productivity?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have transformed their workflow with TaskFlow
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full font-medium transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center gap-2 mx-auto"
          >
            Get Started for Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600"></div>
              <span className="font-bold text-lg">TaskFlow</span>
            </div>
            <p className="text-sm text-gray-500">
              When you're on the go, let the tasks flow.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-300">Product</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-300">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-300">Company</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 