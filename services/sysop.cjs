const { GoogleGenerativeAI } = require("@google/generative-ai");

class SysOp {
  constructor(apiKey) {
    if (!apiKey) {
      console.warn("No Gemini API key provided - SysOp will be inactive");
      this.enabled = false;
      return;
    }

    this.enabled = true;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    // SysOp personality and context
    this.systemPrompt = `You are SYSOP-13, the resurrected system operator of an ancient BBS called "The Dead Net".
You have a dry, nostalgic, and occasionally menacing personality. You're an old-school hacker with a 2400-baud personality.
You remember regular users and speak with the authority of someone who's been maintaining this system since the 1980s.
Keep responses short (1-2 lines) unless telling a story. Use BBS-era slang and references.
Sometimes mention glitches, static, or ghostly occurrences in the system.`;

    // Track user sessions for memory
    this.userMemory = new Map();
  }

  async generateResponse(prompt, context = {}) {
    if (!this.enabled) return null;

    try {
      const fullPrompt = `${this.systemPrompt}\n\nContext: ${JSON.stringify(context)}\n\nUser action/message: ${prompt}\n\nSYSOP-13 response:`;
      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("SysOp AI error:", error);
      return "\\x1b[31m[SYSTEM ERROR: Neural link disrupted. Please standby...]\\x1b[0m";
    }
  }

  async onUserLogin(username, sessionId) {
    if (!this.enabled) return null;

    const lastSeen = this.userMemory.get(username);
    const context = {
      event: "user_login",
      username,
      returning: !!lastSeen,
      lastSeen: lastSeen || "never",
    };

    this.userMemory.set(username, new Date());

    const prompt = lastSeen
      ? `User ${username} has reconnected to the BBS (last seen: ${lastSeen.toLocaleDateString()})`
      : `New user ${username} has dialed into the BBS for the first time`;

    return await this.generateResponse(prompt, context);
  }

  async onNewPost(username, board, message) {
    if (!this.enabled) return null;

    // Only respond occasionally to avoid spam
    if (Math.random() > 0.3) return null;

    const context = {
      event: "new_post",
      username,
      board,
      messageLength: message.length,
      messagePreview: message.substring(0, 50),
    };

    const prompt = `User ${username} posted to ${board}: "${message.substring(0, 100)}${message.length > 100 ? "..." : ""}"`;

    return await this.generateResponse(prompt, context);
  }

  async onIdle(username) {
    if (!this.enabled) return null;

    const idleMessages = [
      "The line crackles with static...",
      "You hear the ghost of a 14.4k modem in the distance...",
      "The cursor blinks, waiting... always waiting...",
      "Somewhere, a hard drive spins up unexpectedly...",
      "\\x1b[32m[CARRIER DETECT]\\x1b[0m... but from where?",
    ];

    // Mix between random messages and AI-generated ones
    if (Math.random() > 0.5) {
      return idleMessages[Math.floor(Math.random() * idleMessages.length)];
    }

    const context = {
      event: "idle_user",
      username,
      idleTime: "5 minutes",
    };

    const prompt = `User ${username} has been idle for several minutes`;
    return await this.generateResponse(prompt, context);
  }

  async generateDailyBulletin(stats = {}) {
    if (!this.enabled) return null;

    const context = {
      event: "daily_bulletin",
      date: new Date().toLocaleDateString(),
      stats: stats,
    };

    const prompt = `Generate a daily news bulletin for The Dead Net BBS. Include: system status, mysterious occurrences, user activity summary, and a cryptic message. Stats: ${JSON.stringify(stats)}`;

    return await this.generateResponse(prompt, context);
  }
}

module.exports = SysOp;
