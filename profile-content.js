/*
 * PROFILE CONTENT
 * ----------------
 * This is the main file to edit when updating the profile.
 *
 * Keep presentation/behavior out of this file:
 * - Change text, links, skills, roles, projects, etc. here.
 * - app.js handles commands, rendering, typing animation, and window behavior.
 */

const PROFILE = {
  identity: {
    name: 'Siddharth',
    handle: 'siddharth-maurya',
    workstation: 'sid@workstation',
    title: 'Lead Software Engineer',
    location: 'Bangalore, India',
    organization: 'Samsung Research',
    focus: 'Trust, systems & identity',
    shellVersion: 'public-profile/2.0',
    availability: 'available for interesting systems work',
    description:
      'Lead software engineer and computer science researcher focused on seamless mobile experiences, blockchain protocols, distributed systems and digital identity.',
    profile:
      'I work at the intersection of people-facing products and hard systems problems: mobile communications, verifiable credentials, content authenticity, and decentralized compute. My work turns ambitious protocols into experiences people can actually use.',
    resumeUrl: 'https://daemonsloth.github.io/files/resume.pdf?v=2.1',
    linkedinUrl: 'https://linkedin.com/in/sidmaurya',
    githubUrl: 'https://github.com/daemonsloth',
    photo: {
      src: 'profile-photo.jpg',
      alt: 'Portrait of Siddharth'
    }
  },

  ui: {
    siteTitle: 'sid@workstation',
    metaDescription: 'Public profile for Siddharth Maurya, systems engineer and researcher.',
    brandMark: '$',
    eyebrow: 'Profile navigator',
    terminalPath: '~/public-profile',
    commandPromptPlaceholder: " type 'help' for help :P",
    availableMessage: 'up for interesting projects',
    sleepTitle: 'sid@workstation is sleeping',
    sleepSubtitle: 'click to restore session',
    aboutEducationTag: 'IIT Bombay',
    bachelorEducationTag: 'IIIT Kottayam'
  },

  files: [
    { file: 'home.md', page: 'home' },
    { file: 'about.md', page: 'about' },
    { file: 'experience.log', page: 'experience' },
    { file: 'research.md', page: 'research' },
    { file: 'projects.log', page: 'projects' },
    { file: 'skills.md', page: 'skills' },
    { file: 'education.log', page: 'education' }
  ],

  about: {
    currentFocus: {
      title: 'Seamless mobile experiences',
      description:
        'Enabling low-cost, low-latency international transactions by integrating stablecoin protocols into a mobile wallet platform.'
    },
    researchLens: {
      title: 'Decentralized systems at scale',
      description:
        'Designing efficient blockchain protocols and interoperable infrastructure with real-world constraints.'
    }
  },

  experience: [
    {
      date: 'MAR 2025 — PRESENT',
      location: 'BANGALORE, INDIA',
      role: 'Lead Software Engineer',
      organization: 'SAMSUNG R&D INSTITUTE',
      bullets: [
        'Led Device-to-Device integration for Private Share, delivering 2× faster transfers and less cloud dependency.',
        'Built the Push Interceptor module for seamless Private Share D2D workflows in Quick Share application.',
        'Led Aadhaar Verifiable Credentials and C2PA content-authenticity proofs of concept for Samsung products.',
        'Designed mGrid, a decentralized mobile compute framework for atomic off-chain task sharing and on-chain settlement.'
      ]
    },
    {
      date: 'AUG 2023 — FEB 2025',
      location: 'BANGALORE, INDIA',
      role: 'Senior Software Engineer',
      organization: 'SAMSUNG R&D INSTITUTE',
      bullets: [
        'Integrated a cross-platform C++ Private Share SDK into an iOS application.',
        'Automated the Private Share AAR build and Quick Share integration pipeline.',
        'Designed Regenesis, reducing distributed ledger size by 99.7%.',
        'Improved synthetic-data generation pipeline throughput by 50× with parallel image processing.'
      ]
    }
  ],

  research: [
    {
      label: 'IEEE ICDCS 2025',
      title: 'Tombolo',
      description:
        'A decentralized interconnected blockchain ecosystem using cross-chain payment channels.'
    },
    {
      label: 'IEEE/ACM UCC 2024',
      title: 'Scalable Regenesis',
      description:
        'Towards shrinking blockchain with on-chain state - reducing ledger size by 99.7%.'
    },
    {
      label: 'Patent · US20240378600A1',
      title: 'Cross-chain payment channels',
      description:
        'Methods and systems for formation and termination of payment channels between distinct ledgers.'
    },
    {
      label: 'Patent · IN202441048672',
      title: 'Secure ledger shrinking',
      description:
        'Method and system for securely shrinking blockchain with on-chain state storage.'
    }
  ],

  projects: [
    {
      label: 'Ethereum tooling',
      title: 'ChainPuff',
      description:
        'Load and performance analysis for Ethereum and Ethereum-based nodes, reporting latency and throughput metrics.',
      link: 'https://github.com/daemonsloth/chainpuff',
      linkText: 'source'
    },
    {
      label: 'IITB community',
      title: 'Delagram',
      description:
        'A social platform for the IIT Bombay community to share memories and spark conversations.',
      link: 'https://github.com/daemonsloth/project-delagram',
      linkText: 'source'
    },
    {
      label: 'Computer vision',
      title: 'Motion Controller',
      description:
        'A low-cost controller built from a pen and plastic ball, tracked using color segmentation.',
      link: 'https://github.com/daemonsloth/motion-controller',
      linkText: 'source'
    },
    {
      label: 'JavaScript library',
      title: 'mini-ANN.js',
      description:
        'A lightweight neural-network library with multilayer models, backpropagation, and genetic algorithms.',
      link: 'https://github.com/daemonsloth/mini-ANN-js',
      linkText: 'source'
    },
    {
      label: 'Creative coding',
      title: 'Rangoli Maker',
      description:
        'Turns freehand doodles into rangoli-inspired generative art.',
      link: 'https://daemonsloth.github.io/rangoli-maker/',
      linkText: 'run project'
    },
    {
      label: 'p5.js game',
      title: 'Escape Jump',
      description:
        'A survival game about jumping clear of randomly closing pipes.',
      link: 'https://daemonsloth.github.io/escape-jump/',
      linkText: 'run project'
    },
    {
      label: 'Machine learning',
      title: 'Neuroevolution on Escape Jump',
      description:
        'Evolving neural networks to learn and play Escape Jump autonomously.',
      link: 'https://github.com/daemonsloth/NE-escape-jump',
      linkText: 'source'
    },
    {
      label: 'Learning tool',
      title: 'Visualisations Blog',
      description:
        'Interactive visualizations for data structures and algorithms, including stacks and search.',
      link: 'https://daemonsloth.github.io/visualisations-blog/',
      linkText: 'explore'
    },
    {
      label: 'p5.js game',
      title: 'flappyball',
      description:
        'A Flappy Bird-inspired game built with the p5.js graphics library.',
      link: 'https://daemonsloth.github.io/liveTest/flappyball-p5js/',
      linkText: 'run project'
    },
    {
      label: 'Web application',
      title: 'Attendance Management',
      description:
        'An attendance application backed by Google Firebase Cloud Firestore.',
      link: 'https://github.com/iiitkottayam/attendance-firebase',
      linkText: 'source'
    },
    {
      label: 'C++ / SDL2',
      title: 'Pong Game',
      description:
        'A two-player recreation of the classic Pong arcade game.',
      link: 'https://github.com/daemonsloth/pong-game-sdl2',
      linkText: 'source'
    }
  ],

  skills: [
    'Android Development',
    'Distributed Systems',
    'Blockchain Protocols',
    'Digital Identity',
    'C++',
    'C',
    'JavaScript',
    'Kotlin',
    'Swift',
    'Python',
    'Java'
  ],

  recognition: [
    {
      title: 'GATE CS 2021',
      description: 'All India Rank 42 among 100,000+ candidates'
    },
    {
      title: 'IIT Bombay 2023',
      description: 'Dr. George B Fernandes Award for Excellence in Research'
    },
    {
      title: 'Samsung R&D 2025',
      description: 'Spot Award for D2D Integration for Private Share'
    }
  ],

  education: [
    {
      date: 'JUL 2023',
      location: 'MUMBAI, INDIA',
      institution: 'IIT Bombay',
      degree: 'MTECH IN COMPUTER SCIENCE · CGPA 9.53 / 10.0',
      description:
        'Advanced study in computer science, culminating in award-winning research in blockchain-based distributed systems.'
    },
    {
      date: 'MAY 2020',
      location: 'KOTTAYAM, INDIA',
      institution: 'IIIT Kottayam',
      degree: 'BTECH IN COMPUTER SCIENCE · CGPA 8.89 / 10.0',
      description:
        'Computer science foundations with an emphasis on systems thinking and applied engineering.'
    }
  ]
};
