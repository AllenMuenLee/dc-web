import Image from 'next/image';

const introParagraph = "I’m Allen, a first-year Electrical and Computer Engineering student at the University of Toronto with interests in robotics, AI, and creative problem-solving. I enjoy combining engineering with music and teamwork to create meaningful projects.";

const activities = [
  { name: "VEX Robotics Competition", description: "Captain and coder; led team to tournament finals, managed robot design, coding, and strategy. Finalist in VEX Taiwan Open, VEX Virtual Skills Challenge, and National Problem Solving Contest" },
  { name: "School Quintet & Orchestra", description: "Cellist and violinist with chamber and orchestral performance experience" },
  { name: "Young Turing Project --- Engage", description: "Co-developed an AI-powered English learning web app; earned 2nd place in competition" },
  { name: "Young Turing Project –-- CIA", description: "Co-developed a cybersecurity web app integrating Identity Governance & Administration (IGA) with AI for safer digital identity management" },
  { name: "Photon Fury", description: "Published a 2D shooting game on itch.io" },
  { name: "Tic-Tac-Duel", description: "Designed a strategy card game expanding tic-tac-toe mechanics" }
];

const contacts = [
    { type: 'instagram', handle: 'this_is_allen_lee' },
    { type: 'email', handle: 'leopardmuenlee@gmail.com' }
];

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20,9,13.28,14.34a2,2,0,0,1-2.56,0L4,9"></path>
    <path d="M19,4H5A2,2,0,0,0,3,6V18a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V6A2,2,0,0,0,19,4Z"></path>
  </svg>
);

const IntroSection = () => {
  return (
    <section id="about-me" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Profile Info */}
          <div className="md:col-span-1 text-center md:text-left">
            <Image
              src="/imgs/profile.jpg"
              alt="A picture of Allen"
              width={250}
              height={200}
              className="rounded-full mx-auto md:mx-0 mb-6 shadow-lg"
            />
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {introParagraph}
            </p>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Me</h2>
            <div className="flex justify-center md:justify-start space-x-4">
              {contacts.map((contact, index) => (
                <div key={index}>
                  {contact.type === 'email' ? (
                    <a href={`mailto:${contact.handle}`} aria-label="Email Allen" className="text-gray-600 hover:text-blue-600 p-2 rounded-full transition-colors duration-200">
                      <EmailIcon className="w-8 h-8" />
                    </a>
                  ) : (
                    <a href={`https://instagram.com/${contact.handle}`} target="_blank" rel="noopener noreferrer" aria-label="Allen's Instagram" className="text-gray-600 hover:text-pink-600 p-2 rounded-full transition-colors duration-200">
                      <InstagramIcon className="w-8 h-8" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute h-full border-l-2 border-gray-300 top-0 left-4"></div>
              {activities.map((activity, index) => (
                <div key={index} className="mb-8 pl-12 relative">
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full z-10 top-1" style={{ left: '1rem', transform: 'translateX(-50%)' }}></div>
                  <div className="p-4 rounded-lg shadow-md bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default IntroSection;
