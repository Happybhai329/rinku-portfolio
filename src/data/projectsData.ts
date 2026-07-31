export interface Project {
  id: string;
  title: string;
  role: string;
  software: string;
  description: string;
  highlights: string[];
  youtubeId: string;
  youtubeUrl: string;
  aspectRatio: "16:9" | "9:16";
  tags: string[];
}

export const showreelData = {
  title: "The Prime Classes | A Cinematic Documentary Edit",
  youtubeId: "AwC5Hm5W1yw",
  youtubeUrl: "https://www.youtube.com/watch?v=AwC5Hm5W1yw",
  description: "Master showcase featuring DaVinci Resolve color grading, narrative pacing, commercial storytelling, and custom Fusion motion graphics."
};

export const featuredProjects: Project[] = [
  {
    id: "project-1",
    title: "High-Energy Short-Form Video Edit",
    role: "Video Editor",
    software: "DaVinci Resolve",
    description: "A highly engaging and fast-paced short-form video designed for maximum retention and instant impact. Crafted using advanced speed ramps, audio synchronization, and snappy visual text styles.",
    highlights: [
      "Fast-paced editing & pacing control",
      "Dynamic speed ramping curves",
      "Precise beat syncing & sound cues",
      "Snappy motion typography design",
      "Premium cinematic color grading look",
      "High viewer retention hook strategy"
    ],
    youtubeId: "0JkSClYUG0E",
    youtubeUrl: "https://youtube.com/shorts/0JkSClYUG0E",
    aspectRatio: "9:16",
    tags: ["Short Form", "DaVinci Resolve", "Color Grading", "Beat Sync"]
  },
  {
    id: "project-2",
    title: "Long Form Editing Project",
    role: "Video Editor",
    software: "DaVinci Resolve",
    description: "A long-form storytelling project demonstrating editing, pacing, motion graphics, typography, and cinematic grading. Includes structured narrative pacing and multi-track audio mixing.",
    highlights: [
      "Narrative arc & story pacing flow",
      "Multi-layered sound design & ambiance",
      "Custom explanatory motion graphics",
      "Clean minimalistic typography layout",
      "Professional scene-to-scene grading consistency",
      "Advanced pacing adjustments for retention"
    ],
    youtubeId: "71uBJQa42Vk",
    youtubeUrl: "https://youtu.be/71uBJQa42Vk",
    aspectRatio: "16:9",
    tags: ["Long Form", "Editing Skool", "Storytelling", "Sound Design"]
  },
  {
    id: "project-3",
    title: "The Prime Classes Promotional Campaign",
    role: "Video Editor",
    software: "DaVinci Resolve",
    description: "Commercial promotional advertisement created to showcase academic excellence, highlight campus advantages, and attract students. High-converting commercial structure.",
    highlights: [
      "Commercial marketing structure",
      "Brand-aligned color theme grading",
      "Polished audio-visual transitions",
      "Informational slide animations",
      "Call-to-action typography animations",
      "Engaging sound effects & score mixing"
    ],
    youtubeId: "ksmo7DfEv0E",
    youtubeUrl: "https://youtu.be/ksmo7DfEv0E",
    aspectRatio: "16:9",
    tags: ["Commercial", "Promo", "Brand Content", "Motion Graphics"]
  },
  {
    id: "project-4",
    title: "Fusion Cinematic Intro (Monkey Man Style)",
    role: "Motion Graphics Artist",
    software: "DaVinci Resolve Fusion",
    description: "A cinematic intro inspired by the high-impact visual storytelling style of Monkey Man and Anime hooks. Implemented using advanced node-based visual compositing, motion tracking, and particle simulation in Fusion.",
    highlights: [
      "Node-based Fusion visual effects compositing",
      "Advanced 3D title text positioning & extrusion",
      "High-energy particle effects & glitch transitions",
      "Dynamic speed ramping & motion blur effects",
      "Stylized cinematic color grading profiles",
      "Custom sound effects and atmospheric syncing"
    ],
    youtubeId: "2U-7eelNLzI",
    youtubeUrl: "https://youtu.be/2U-7eelNLzI",
    aspectRatio: "16:9",
    tags: ["VFX", "Fusion Compositing", "Anime Style", "Title Intro"]
  }
];

export const shortsGallery: Project[] = [
  {
    id: "short-1",
    title: "High-Energy Short Form Edit",
    role: "Video Editor",
    software: "DaVinci Resolve",
    description: "Short-form retention hook edit featuring snappy text, speed ramps, and beat syncing.",
    highlights: ["Retention Hook", "Beat Syncing", "Speed Ramps"],
    youtubeId: "0JkSClYUG0E",
    youtubeUrl: "https://youtube.com/shorts/0JkSClYUG0E",
    aspectRatio: "9:16",
    tags: ["Reel", "Short Form", "DaVinci Resolve"]
  },
  {
    id: "short-2",
    title: "SaaS-Style Motion Graphics (Bali Travel Reel)",
    role: "Motion Graphics Artist",
    software: "Fusion / DaVinci Resolve",
    description: "Dynamic SaaS kinetic typography and motion graphic animation applied to a travel reel.",
    highlights: ["Kinetic Typography", "SaaS Style", "Travel Motion"],
    youtubeId: "C2G40tXB7yI",
    youtubeUrl: "https://youtube.com/shorts/C2G40tXB7yI",
    aspectRatio: "9:16",
    tags: ["Motion Design", "SaaS", "Reel"]
  },
  {
    id: "short-3",
    title: "Editing Skool Masterclass Short",
    role: "Video Editor",
    software: "DaVinci Resolve",
    description: "Behind the scenes workflow breakdown of editing technique from Editing Skool.",
    highlights: ["Workflow Breakdown", "Masterclass", "Fast Cuts"],
    youtubeId: "6Mi9gk50lAk",
    youtubeUrl: "https://youtube.com/shorts/6Mi9gk50lAk",
    aspectRatio: "9:16",
    tags: ["Shorts", "Editing Skool", "Tutorial"]
  },
  {
    id: "short-4",
    title: "Billie Hawkins - The Edit You Can't Skip",
    role: "Video Editor",
    software: "DaVinci Resolve",
    description: "High-retention cinematic short edit crafted to keep audiences hooked from frame 1.",
    highlights: ["Zero Drop-off", "Color Grade", "Sound Polish"],
    youtubeId: "FWtxnNIJGmk",
    youtubeUrl: "https://youtube.com/shorts/FWtxnNIJGmk",
    aspectRatio: "9:16",
    tags: ["Cinematic", "Short", "Retention"]
  }
];
