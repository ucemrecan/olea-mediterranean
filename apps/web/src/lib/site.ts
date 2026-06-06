/** Static site-wide content for the fictional Olea restaurant. */

export const SITE = {
  name: "Olea",
  tagline: "Modern Mediterranean",
  description:
    "A coastal table where the olive tree, the sea, and the sun meet — modern Mediterranean cooking in the heart of the city.",
};

export const CONTACT = {
  phone: "+34 931 234 567",
  email: "hello@olea.example",
  address: {
    line1: "14 Carrer de la Marina",
    line2: "08005 Barcelona, Spain",
  },
};

export const HOURS: { days: string; time: string }[] = [
  { days: "Mon – Thu", time: "12:00 – 23:00" },
  { days: "Fri – Sat", time: "12:00 – 00:30" },
  { days: "Sunday", time: "12:00 – 22:00" },
];
