export type BDWeekImage = {
  publicId: string;
  title: string;
  caption: string;
  aspect: "portrait" | "landscape" | "square";
};

const imageRoot = "";

const imageDetails = [
  [
    "image-01",
    "Opening night",
    "A bright beginning to a week of Bangladeshi culture.",
    "landscape",
  ],
  ["image-02", "Cultural showcase", "Students sharing stories, music, and movement.", "portrait"],
  ["image-03", "Bangla on stage", "A celebration made by the APU community.", "square"],
  ["image-04", "Together at APU", "Friends, families, and new connections.", "landscape"],
  ["image-05", "Traditional details", "Color and craft bringing the venue to life.", "portrait"],
  ["image-06", "An evening of music", "The room moves with the sound of Bangladesh.", "landscape"],
  ["image-07", "Shared table", "Food is one of the ways we feel at home.", "square"],
  ["image-08", "Behind the scenes", "The people and preparation behind the showcase.", "portrait"],
  ["image-09", "Community energy", "A full house and an unforgettable atmosphere.", "landscape"],
  [
    "image-010",
    "New memories",
    "A week that stays with us long after the lights go down.",
    "square",
  ],
  ["image-012", "The audience", "A shared experience across the APU community.", "landscape"],
  ["image-013", "The performers", "Talent, teamwork, and a stage full of life.", "portrait"],
  ["image-014", "Festival colors", "A visual celebration of home and heritage.", "square"],
] as const;

export const bdWeekImages: BDWeekImage[] = imageDetails.map(([name, title, caption, aspect]) => ({
  publicId: `${imageRoot}/${name}`,
  title,
  caption,
  aspect,
}));

export const bdWeekHeroImages = ["image-01", "image-012", "image-013", "image-014"];

export const bdWeekBackgroundImages = [
  "image-02",
  "image-03",
  "image-04",
  "image-05",
  "image-06",
  "image-07",
  "image-08",
  "image-09",
  "image-010",
];

export const bdWeekVideo = {
  id: "5i-hoTBakZg",
  title: "BD Week 2026 highlight film",
  embedUrl: "https://www.youtube.com/embed/5i-hoTBakZg?si=fKXOeKCiGNak7BBt",
};

export function cloudinaryImageUrl(publicId: string, width = 1400) {
  return `https://res.cloudinary.com/h0ie7lrb/image/upload/f_auto,q_auto,w_${width},c_limit/${publicId.replace(/^\/+/, "")}`;
}
