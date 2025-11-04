const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');

async function postDailyBulletin() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const systemPrompt = `You are SYSOP-13, the haunted system operator of The Dead Net BBS.
Generate a daily news bulletin in the style of an old BBS system announcement.
Include: system status updates, mysterious occurrences, user activity summary, and cryptic warnings.
Use ASCII art sparingly. Keep it under 500 characters. Be ominous and nostalgic.
Reference the date and time in BBS format (e.g., "11/04/2025 03:00:00 UTC").`;

  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0];
  
  const prompt = `Generate a daily bulletin for ${dateStr} at ${timeStr} UTC. 
Include references to: system memory fragmentation, ghost users, carrier signals from nowhere, 
and warnings about the old protocols awakening. Make it feel like a haunted BBS from 1989.`;

  try {
    // Generate bulletin with Gemini
    const result = await model.generateContent(`${systemPrompt}\n\n${prompt}`);
    const bulletin = result.response.text();
    
    console.log('Generated bulletin:', bulletin);
    
    // Post to the BBS
    const response = await fetch(`${process.env.BBS_API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret': process.env.BBS_API_SECRET
      },
      body: JSON.stringify({
        board: 'general', // or 'announcements' if you have that board
        user: 'SYSOP-13',
        message: `[DAILY SYSTEM BULLETIN - ${dateStr}]\n\n${bulletin}\n\n[END TRANSMISSION]`
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to post bulletin: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Bulletin posted successfully:', data);
    
  } catch (error) {
    console.error('Error posting daily bulletin:', error);
    process.exit(1);
  }
}

postDailyBulletin();