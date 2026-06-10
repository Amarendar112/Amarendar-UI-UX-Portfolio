const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
try {
  const result = execSync(`"${ffmpeg}" -i public/intro_video.mp4 -af "volumedetect" -vn -sn -dn -f null NUL 2>&1`, { encoding: 'utf-8' });
  console.log(result);
} catch (err) {
  console.log(err.message);
  if (err.stdout) console.log(err.stdout.toString());
}
