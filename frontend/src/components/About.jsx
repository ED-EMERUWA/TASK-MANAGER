import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Award, Clock, Heart, MapPin, Mail, Phone, GitHub, Linkedin, Twitter } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const teamMember = {
    name: "Alex Johnson",
    role: "Developer & Founder",
    bio: "Full-stack developer with 8+ years of experience building productivity tools. Created TaskFlow to solve the organizational challenges I faced while working remotely.",
    image: "/api/placeholder/400/400",
    socials: {
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://twitter.com/alexjohnson"
    }
  };

  const milestones = [
    {
      year: "2023",
      title: "TaskFlow Launch",
      description: "After months of development, TaskFlow was released to the public."
    },
    {
      year: "2023",
      title: "First 1,000 Users",
      description: "Reached our first major user milestone within 3 months of launch."
    },
    {
      year: "2024",
      title: "Mobile Apps Released",
      description: "Expanded to iOS and Android with native mobile applications."
    },
    {
      year: "2024",
      title: "Enterprise Features",
      description: "Added team collaboration tools and enterprise-grade security."
    }
  ];

  const values = [
    {
      icon: <Users size={24} />,
      title: "User-Centered",
      description: "Everything we build starts with user needs and feedback."
    },
    {
      icon: <Award size={24} />,
      title: "Quality First",
      description: "We believe in doing things right, not just doing them quickly."
    },
    {
      icon: <Clock size={24} />,
      title: "Respect Time",
      description: "We value your time and build tools that help you make the most of it."
    },
    {
      icon: <Heart size={24} />,
      title: "Passion-Driven",
      description: "TaskFlow is built with love and maintained with dedication."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navbar placeholder - use the same as in Home component */}
      <nav className="fixed w-full backdrop-blur-md bg-black/70 z-50 px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600"></div>
            <span className="font-bold text-xl">TaskFlow</span>
          </div>
          {/* Navigation links - same as home page */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
            Our Story
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            TaskFlow started as a personal project to solve my own productivity challenges.
            It has since evolved into a powerful tool used by individuals and teams worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-20"></div>
              <div className="relative overflow-hidden rounded-xl border border-gray-700 h-80">
                <img 
                  src="/api/placeholder/600/480" 
                  alt="TaskFlow mission" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                Our Mission
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                TaskFlow was born from a simple idea: productivity tools should work for you, not the other way around. 
                I wanted to create something that was powerful enough for complex projects but simple enough for daily use.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Today, our mission remains the same - to help people organize their work and life efficiently, 
                reduce stress, and create more time for what truly matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-12 text-center">
            Meet the Creator
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative w-64 h-64">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur opacity-40"></div>
              <div className="relative overflow-hidden rounded-full border-2 border-emerald-500/30 w-full h-full">
                <img 
                  src={teamMember.image} 
                  alt={teamMember.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="max-w-md text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">{teamMember.name}</h3>
              <p className="text-emerald-400 mb-4">{teamMember.role}</p>
              <p className="text-gray-300 mb-6">{teamMember.bio}</p>
              <div className="flex justify-center md:justify-start gap-4">
                <a href={teamMember.socials.github} className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <GitHub size={20} />
                </a>
                <a href={teamMember.socials.linkedin} className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href={teamMember.socials.twitter} className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative p-6 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-all duration-300 h-full flex flex-col items-center text-center">
                  <div className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-12 text-center">
            Our Journey
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-700 transform md:translate-x-0"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transform -translate-x-1/2 md:-translate-x-4 flex items-center justify-center z-10">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    </div>
                    
                    {/* Content */}
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                      <div className="p-5 rounded-lg backdrop-blur-md bg-gray-800/30 border border-gray-700 hover:border-emerald-500/30 transition-all duration-300">
                        <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{milestone.title}</h3>
                        <p className="text-gray-300 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Join the Journey */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-600/5"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're constantly evolving and improving. Your feedback shapes our roadmap.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full font-medium transition-all duration-200"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full font-medium transition-all duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer placeholder - use the same as in Home component */}
      <footer className="px-6 py-12 border-t border-gray-800 bg-black">
        {/* Footer content - same as home page */}
      </footer>
    </div>
  );
};

export default About;