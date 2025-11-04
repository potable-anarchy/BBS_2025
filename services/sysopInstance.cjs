const SysOp = require('./sysop.cjs');

// Create a singleton instance of SysOp
const sysop = new SysOp(process.env.GEMINI_API_KEY);

module.exports = sysop;