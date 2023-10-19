export const generateDefaultAvatar = (firstName, lastName) => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  // This creates a simple SVG with the initials in the center.
  // You can customize the size, colors, font, etc. as needed.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="22.5" fill="#CCCCCC" />
    <text x="25" y="28" font-family="Arial" font-size="20" fill="white" text-anchor="middle">${initials}</text>
  </svg>`;

  // Convert the SVG to a base64 data URL.
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64"
  )}`;
  return dataUrl;
};
