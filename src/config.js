// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   audio:    the song, muxed into --clip and --encode. It isn't in git: put your copy at this path.
// Death Grips, "Guillotine (It goes Yah)": 75.86 BPM, first downbeat at 0.166 s, vocals end at bar 69 (218.47 s).
const PROJECT = { duration: 222, bpm: 75.86, offset: .166, audio: 'assets/guillotine.mp3' };
