const sharp = require('sharp');
const path = require('path');

const out = 'c:/Users/ottod/source/repos/PWRLFT/public';

function makeSvg(size) {
  const p = size;
  const bgRadius = Math.round(p * 0.22);
  const cx = p / 2;
  const skullY = p * 0.31;
  const skullR = p * 0.205;
  const jawW = skullR * 1.32;
  const jawH = skullR * 0.58;
  const eyeR = skullR * 0.13;
  const noseW = skullR * 0.2;
  const noseH = skullR * 0.22;
  const barY = p * 0.72;
  const barLen = p * 0.6;
  const barThick = p * 0.052;
  const plateR1 = p * 0.072;
  const plateR2 = p * 0.054;
  const plateR3 = p * 0.038;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${p}" height="${p}" viewBox="0 0 ${p} ${p}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#11100f"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#d1d5db"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${p}" height="${p}" rx="${bgRadius}" fill="url(#bg)"/>

  <g transform="translate(${cx}, ${barY})">
    <g transform="rotate(-32)">
      <rect x="${-barLen / 2}" y="${-barThick / 2}" width="${barLen}" height="${barThick}" rx="${barThick / 2}" fill="url(#bar)"/>
      <circle cx="${-barLen / 2 + plateR1 * 1.1}" cy="0" r="${plateR1}" fill="url(#accent)"/>
      <circle cx="${-barLen / 2 + plateR1 * 2.2}" cy="0" r="${plateR2}" fill="url(#accent)"/>
      <circle cx="${-barLen / 2 + plateR1 * 3.1}" cy="0" r="${plateR3}" fill="url(#accent)"/>
      <circle cx="${barLen / 2 - plateR1 * 1.1}" cy="0" r="${plateR1}" fill="url(#accent)"/>
      <circle cx="${barLen / 2 - plateR1 * 2.2}" cy="0" r="${plateR2}" fill="url(#accent)"/>
      <circle cx="${barLen / 2 - plateR1 * 3.1}" cy="0" r="${plateR3}" fill="url(#accent)"/>
    </g>

    <g transform="rotate(32)">
      <rect x="${-barLen / 2}" y="${-barThick / 2}" width="${barLen}" height="${barThick}" rx="${barThick / 2}" fill="url(#bar)"/>
      <circle cx="${-barLen / 2 + plateR1 * 1.1}" cy="0" r="${plateR1}" fill="url(#accent)"/>
      <circle cx="${-barLen / 2 + plateR1 * 2.2}" cy="0" r="${plateR2}" fill="url(#accent)"/>
      <circle cx="${-barLen / 2 + plateR1 * 3.1}" cy="0" r="${plateR3}" fill="url(#accent)"/>
      <circle cx="${barLen / 2 - plateR1 * 1.1}" cy="0" r="${plateR1}" fill="url(#accent)"/>
      <circle cx="${barLen / 2 - plateR1 * 2.2}" cy="0" r="${plateR2}" fill="url(#accent)"/>
      <circle cx="${barLen / 2 - plateR1 * 3.1}" cy="0" r="${plateR3}" fill="url(#accent)"/>
    </g>
  </g>

  <g transform="translate(${cx}, ${skullY})">
    <circle cx="0" cy="0" r="${skullR}" fill="#f8fafc" stroke="#050505" stroke-width="${p * 0.01}"/>
    <rect x="${-jawW / 2}" y="${skullR * 0.56}" width="${jawW}" height="${jawH}" rx="${jawH * 0.26}" fill="#f8fafc" stroke="#050505" stroke-width="${p * 0.01}"/>
    <path d="M ${-skullR * 0.55} ${-skullR * 0.03} L ${-skullR * 0.24} ${-skullR * 0.19} L ${-skullR * 0.02} ${-skullR * 0.02} L ${-skullR * 0.27} ${skullR * 0.17} Z" fill="#050505"/>
    <path d="M ${skullR * 0.55} ${-skullR * 0.03} L ${skullR * 0.24} ${-skullR * 0.19} L ${skullR * 0.02} ${-skullR * 0.02} L ${skullR * 0.27} ${skullR * 0.17} Z" fill="#050505"/>
    <path d="M 0 ${skullR * 0.06} L ${noseW / 2} ${skullR * 0.06 + noseH} L ${-noseW / 2} ${skullR * 0.06 + noseH} Z" fill="#050505"/>
    <rect x="${-jawW * 0.39}" y="${skullR * 0.69}" width="${jawW * 0.78}" height="${jawH * 0.41}" rx="${p * 0.006}" fill="#050505" opacity="0.95"/>
    <rect x="${-jawW * 0.31}" y="${skullR * 0.73}" width="${jawW * 0.62}" height="${jawH * 0.18}" rx="${p * 0.005}" fill="#f8fafc" opacity="0.9"/>
  </g>
</svg>`;
}

const jobs = [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['icon-maskable-192.png', 192],
  ['icon-maskable-512.png', 512]
];

(async () => {
  for (const [name, size] of jobs) {
    const svg = makeSvg(size);
    const target = path.join(out, name);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(target);
  }
  console.log('Skull + crossed barbells icons generated');
})();
