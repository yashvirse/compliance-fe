// export const getSubdomain = () => {
//   const host = window.location.hostname; // e.g., annatrang.localhost
//   const parts = host.split(".");

//   // If it's something like annatrang.localhost
//   if (parts.length > 1 && parts[parts.length - 1] === "localhost") {
//     return parts[0]; // 'annatrang'
//   }

//   // For production domain like annatrang.example.com
//   if (parts.length > 2) {
//     return parts[0]; // 'annatrang'
//   }

//   return null; // No subdomain
// };
export const getSubdomain = () => {
  return "tcs";
};
