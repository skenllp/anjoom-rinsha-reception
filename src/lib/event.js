import { invitation } from '../data/invitation';

const pad = (n) => String(n).padStart(2, '0');

export const hasEventTime = () => Boolean(invitation.event.time);

/** Epoch ms of the countdown target in IST. Without a configured time → start of the day (00:00 IST). */
export function getTargetMs() {
  const { date, time, utcOffset } = invitation.event;
  const h = time ? time.hour : 0;
  const m = time ? time.minute : 0;
  const iso = `${date.year}-${pad(date.month)}-${pad(date.day)}T${pad(h)}:${pad(m)}:00${utcOffset}`;
  return new Date(iso).getTime();
}

export function diffParts(targetMs, nowMs = Date.now()) {
  const total = Math.max(0, targetMs - nowMs);
  const s = Math.floor(total / 1000);
  return {
    done: total === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/* ---------- Venue links (configurable, never invented) ---------- */

const venueQuery = () => {
  const v = invitation.venue;
  const clean = v.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  return `${clean}, ${v.locality}, ${v.region}`;
};

export const getLocationUrl = () =>
  invitation.venue.mapUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueQuery())}`;

export const getDirectionsUrl = () =>
  invitation.venue.directionsUrl ||
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueQuery())}`;

/* ---------- Calendar ---------- */

function startParts() {
  const { date, time } = invitation.event;
  return { y: date.year, mo: date.month, d: date.day, h: time.hour, mi: time.minute };
}

function localStamp(offsetMin = 0) {
  const { y, mo, d, h, mi } = startParts();
  // Plain arithmetic in UTC fields so the output is the wall-clock time in IST regardless of device zone.
  const dt = new Date(Date.UTC(y, mo - 1, d, h, mi + offsetMin));
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(
    dt.getUTCMinutes()
  )}00`;
}

const eventTitle = () => `${invitation.event.title} – ${invitation.couple.groom.name} & ${invitation.couple.bride.name}`;
const eventLocation = () => venueQuery();

export function googleCalendarUrl() {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(),
    dates: `${localStamp()}/${localStamp(invitation.event.durationMinutes)}`,
    ctz: invitation.event.timezone,
    location: eventLocation(),
    details: 'With the blessings of Allah and our families, we joyfully invite you to celebrate with us.',
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function downloadIcs() {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Anjoom & Rinsha//Reception//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:reception-${localStamp()}@wedding-invitation`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;TZID=${invitation.event.timezone}:${localStamp()}`,
    `DTEND;TZID=${invitation.event.timezone}:${localStamp(invitation.event.durationMinutes)}`,
    `SUMMARY:${eventTitle().replace(/[,;]/g, '\\$&')}`,
    `LOCATION:${eventLocation().replace(/[,;]/g, '\\$&')}`,
    'DESCRIPTION:With the blessings of Allah and our families\\, we joyfully invite you to celebrate with us.',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'anjoom-rinsha-reception.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ---------- Sharing ---------- */

export async function shareInvitation() {
  const url = window.location.origin + '/';
  const title = `${invitation.couple.groom.name} & ${invitation.couple.bride.name} | Wedding Reception`;
  const text = `You are warmly invited to the wedding reception of ${invitation.couple.groom.name} & ${invitation.couple.bride.name} on ${invitation.event.displayDate.replace(
    /\b(\w)(\w*)/g,
    (_, a, b) => a + b.toLowerCase()
  )} at Khayaal Palace, Mankada.`;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (err) {
      if (err && err.name === 'AbortError') return 'cancelled';
      // fall through to WhatsApp
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener,noreferrer');
  return 'whatsapp';
}
