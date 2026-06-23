import PhotographyClient from "./photography-client";

export const metadata = { title: "Photography — Arun Baburaj" };

const photos = [
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963841/IMG_4430_ykc7eh.heic", loc: "Paris, France", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963840/IMG_5271_inc2jg.heic", loc: "Montmartre, Paris", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963839/IMG_5506_obeji0.heic", loc: "Eiffel Tower, Paris", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963839/IMG_5419_tjcvau.heic", loc: "Jardin des Tuileries, Paris", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963841/IMG_4714_r6ltis.heic", loc: "Notre-Dame Cathedral, Paris", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963840/IMG_4804_qv8n6j.heic", loc: "Paris, France", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963839/IMG_5361_jpxu89.heic", loc: "Paris, France", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963839/IMG_5192_rahvfy.heic", loc: "Paris, France", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765963839/IMG_5145_fiiz2o.heic", loc: "Arc de Triomphe, Paris", date: "March 2025" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954649/IMG_0846_t8d23u.heic", loc: "Tokyo, Japan", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954652/IMG_0482_svs8vc.heic", loc: "Tokyo, Japan", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954651/IMG_1002_szjm3u.heic", loc: "Osaka, Japan", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954651/IMG_0493_wpmeil.heic", loc: "Kabukicho, Shinjuku", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954650/IMG_1012_rwnger.heic", loc: "Osaka, Japan", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954650/IMG_1022_hamz6c.heic", loc: "Osaka, Japan", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954648/IMG_1880_ae5ler.heic", loc: "Asakusa, Tokyo", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954648/IMG_1093_uhazzm.heic", loc: "Osaka Castle, Osaka", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954648/IMG_1593_iy262h.heic", loc: "Kinkaku-ji, Kyoto", date: "Sep 2024" },
  { url: "https://res.cloudinary.com/dp67k01qy/image/upload/f_auto,q_auto/v1765954648/IMG_1286_oiapzo.heic", loc: "Kyoto, Japan", date: "Sep 2024" },
];

export default function PhotographyPage() {
  return <PhotographyClient photos={photos} />;
}
