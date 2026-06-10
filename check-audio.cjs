const ffprobe = require('ffprobe-static');
const { execSync } = require('child_process');
try {
  const result = execSync(`"${ffprobe.path}" -v error -show_streams -select_streams a public/intro_video.mp4`);
  console.log('--- FFPROBE OUTPUT ---');
  console.log(result.toString());
  console.log('----------------------');
} catch (err) {
  console.error('Error running ffprobe:', err.message);
}
