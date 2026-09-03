/**
 * Professional Web Audio Tone Synthesizer & Natural Speech Engine
 * SIH 2026 Sovereign Cyber Defense Layer
 */

// Synthesize pleasant acoustic sound chimes for instant citizen comprehension
export function playAcousticAlert(type = 'safe') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'threat') {
      // Urgent double warning pulse (Alert Siren)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Second pulse
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(987.77, now + 0.22);
      osc2.frequency.exponentialRampToValueAtTime(493.88, now + 0.4);
      gain2.gain.setValueAtTime(0.25, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.42);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.42);
    } else if (type === 'caution') {
      // Mellow warning double note
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(440.00, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // Reassuring Sovereign Harmony Chime (D5 to A5 major chord)
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    console.debug("Audio synthesis skipped:", e);
  }
}

// Find the most natural human-like voice available in the client browser
export function selectBestVoice(lang = 'hi') {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === 'hi') {
    // 1. Look for native Hindi voices (Google हिन्दी, Lekha, Rishi, Swara, Madhur, etc.)
    const hiVoice = voices.find(v => 
      v.lang.startsWith('hi') || 
      v.name.includes('Hindi') || 
      v.name.includes('Lekha') || 
      v.name.includes('Swara') || 
      v.name.includes('Madhur') ||
      v.name.includes('हिन्दी')
    );
    if (hiVoice) return hiVoice;

    // 2. Look for Indian English voice fallback
    const inVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India') || v.name.includes('Rishi') || v.name.includes('Veena'));
    if (inVoice) return inVoice;
  } else {
    // English: Look for high quality natural voices (Google, Samantha, Siri, Daniel, Karen, Victoria)
    const naturalEnVoice = voices.find(v => 
      v.lang.startsWith('en') && (
        v.name.includes('Natural') || 
        v.name.includes('Google') || 
        v.name.includes('Samantha') || 
        v.name.includes('Siri') ||
        v.name.includes('Daniel') ||
        v.name.includes('Rishi')
      )
    );
    if (naturalEnVoice) return naturalEnVoice;

    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) return enVoice;
  }

  return voices[0] || null;
}
