export interface Project {
  id: string;
  title: string;
  role: string;
  software: string;
  description: string;
  highlights: string[];
  localVideo: string;
  fallbackVideo: string;
  tags: string[];
}

export const showreelData = {
  title: "Rinku Dhakad Cinematic Showreel 2026",
  localVideo: "/videos/showreel.mp4",
  fallbackVideo: "https://assets.mixkit.co/videos/preview/mixkit-cinematic-video-of-a-mysterious-planet-41710-large.mp4"
};

export const projectsData: Project[] = [
  {
    id: "project-1",
    title: "High-Energy Short-Form Video",
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
    localVideo: "/videos/project1.mp4",
    fallbackVideo: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-neon-lights-42283-large.mp4",
    tags: ["Short Form", "DaVinci Resolve", "Color Grading", "Beat Sync"]
  },
  {
    id: "project-2",
    title: "Long Form Storytelling",
    role: "Video Editor",
    software: "DaVinci Resolve",
    description: "A long-form storytelling project that demonstrates advanced pacing, scene transition flow, custom motion graphics elements, and polished audio layering to create a captivating documentary/narrative structure.",
    highlights: [
      "Narrative arc & story pacing flow",
      "Multi-layered sound design & ambiance",
      "Custom explanatory motion graphics",
      "Clean minimalistic typography layout",
      "Professional scene-to-scene grading consistency",
      "Advanced pacing adjustments for retention"
    ],
    localVideo: "/videos/project2.mp4",
    fallbackVideo: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-writer-typing-on-a-typewriter-40078-large.mp4",
    tags: ["Long Form", "Documentary", "Storytelling", "Sound Design"]
  },
  {
    id: "project-3",
    title: "The Prime Classes Commercial Campaign",
    role: "Video Editor",
    software: "DaVinci Resolve",
    description: "Commercial promotional advertisement created to showcase academic excellence, highlight campus advantages, and attract students. Combines energetic pacing with professional corporate branding guidelines.",
    highlights: [
      "Commercial marketing structure",
      "Brand-aligned color theme grading",
      "Polished audio-visual transitions",
      "Informational slide animations",
      "Call-to-action typography animations",
      "Engaging sound effects & score mixing"
    ],
    localVideo: "/videos/project3.mp4",
    fallbackVideo: "https://assets.mixkit.co/videos/preview/mixkit-woman-studying-with-headphones-40093-large.mp4",
    tags: ["Commercial", "Promo", "Brand Content", "Motion Graphics"]
  },
  {
    id: "project-4",
    title: "Fusion Cinematic Intro",
    role: "Motion Graphics Artist",
    software: "DaVinci Resolve Fusion",
    description: "A premium cinematic title intro sequence inspired by the high-impact visual storytelling style of the film Monkey Man. Implemented using advanced node-based visual compositing, motion tracking, and particle simulation in Fusion.",
    highlights: [
      "Node-based Fusion visual effects compositing",
      "Advanced 3D title text positioning & extrusion",
      "High-energy particle effects & glitch transitions",
      "Dynamic speed ramping & motion blur effects",
      "Stylized cinematic color grading profiles",
      "Custom sound effects and atmospheric syncing"
    ],
    localVideo: "/videos/project4.mp4",
    fallbackVideo: "https://assets.mixkit.co/videos/preview/mixkit-colorful-laser-lights-background-43093-large.mp4",
    tags: ["VFX", "Fusion Compositing", "Title Intro", "3D Text"]
  }
];
