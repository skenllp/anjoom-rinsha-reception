/**
 * SINGLE SOURCE OF TRUTH for the invitation.
 * Edit this file (and .env) — no other file needs touching for routine changes.
 */
export const invitation = {
  couple: {
    groom: {
      name: 'Anjoom Irshad',
      parents: 'Irshad PT & Febitha Irshad',
      grandparents: ['Aboobacker Haji & Late Sainaba', 'Beeran Kari & Mariyam'],
    },
    bride: {
      name: 'Rinsha Pulikkal',
      parents: 'Abdurazakh & Failusath',
      grandparents: ['Late Kunchimmu Haji & Late Fathimakutty Hajjumma'],
    },
  },

  event: {
    title: 'Wedding Reception',
    // Numeric date only. The weekday is deliberately NOT shown (28 Dec 2026 is a Monday;
    // the reference artwork says Saturday — confirm with the family before adding it).
    date: { year: 2026, month: 12, day: 28 },
    displayDate: '28 DECEMBER 2026',

    // ⏰ Reception time (24-hour clock, India Standard Time).
    time: { hour: 17, minute: 30 }, // 5:30 PM
    durationMinutes: 180,
    timezone: 'Asia/Kolkata', // IST, fixed UTC+05:30 (India has no daylight saving)
    utcOffset: '+05:30',
  },

  venue: {
    name: 'KHAYAAL PALACE',
    locality: 'Mankada',
    region: 'Kerala',
    // 📍 Paste the verified Google Maps share link here (e.g. https://maps.app.goo.gl/xxxx).
    // While empty, the buttons open a Google Maps *search* for the venue name — no invented coordinates.
    mapUrl: '',
    // Optional dedicated directions link. If empty it is derived from the venue name.
    directionsUrl: '',
  },

  hosts: 'PT GROUP & FAMILY',
  bestWishes: 'Anshif Irshad & Haseem Irshad',

  texts: {
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    invite:
      'With the blessings of Allah and our beloved families, we joyfully invite you to celebrate the',
    receptionOf: 'RECEPTION OF',
    complimentsLabel: 'With Best Compliments From',
    closingQuote: 'Your presence is our greatest blessing.',
    wishesHeading: 'Leave Your Blessings',
    wishesSub: 'Your love, prayers and blessings mean the world to us.',
  },

  media: {
    introVideo: '/video/intro.mp4',
    introPoster: '/images/intro-poster.jpg',
    tourVideo: '/video/venue-tour.mp4',
    tourPoster: '/images/venue-poster.webp',
    venuePhoto: '/images/venue.webp',
    music: '/audio.mp3',
  },

  // Wishes persistence — see README for the 2-minute Supabase setup.
  wishes: {
    supabaseUrl: (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, ''),
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    table: 'wishes',
    maxName: 60,
    maxMessage: 400,
  },
};

export const coupleTitle = `${invitation.couple.groom.name} & ${invitation.couple.bride.name}`;
