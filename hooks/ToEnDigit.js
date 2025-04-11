export default function toEnDigit(s) {
  return s.replace(
    /[\u0660-\u0669\u06f0-\u06f9]/g, // Detect all Persian/Arabic Digit in range of their Unicode with a global RegEx character set
    function (a) {
      return a.charCodeAt(0) & 0xf;
    } // Remove the Unicode base(2) range that not match
  );
}
