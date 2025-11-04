# Performance Testing Guide

This guide explains how to test the performance optimizations implemented in this project.

## Table of Contents

1. [WebSocket Performance Testing](#websocket-performance-testing)
2. [Database Query Testing](#database-query-testing)
3. [CRT Effects Performance](#crt-effects-performance)
4. [Cross-Browser Testing](#cross-browser-testing)
5. [End-to-End Performance Testing](#end-to-end-performance-testing)

---

## WebSocket Performance Testing

### Automated Load Testing

We've implemented automated WebSocket load tests to verify connection stability, message throughput, and latency.

#### Run Light Test (Quick Check)
```bash
npm run test:perf:websocket:light
```
- 10 concurrent connections
- 5 messages per client
- Good for quick smoke testing

#### Run Standard Test
```bash
npm run test:perf:websocket
```
- 50 concurrent connections
- 10 messages per client
- Recommended for regular testing

#### Run Heavy Load Test
```bash
npm run test:perf:websocket:heavy
```
- 100 concurrent connections
- 20 messages per client
- Stress test for production readiness

#### Custom Configuration

Set environment variables for custom testing:

```bash
CONNECTIONS=200 MESSAGES=50 INTERVAL=500 npm run test:perf:websocket
```

**Parameters:**
- `CONNECTIONS`: Number of concurrent client connections
- `MESSAGES`: Messages each client will send
- `INTERVAL`: Delay between messages in milliseconds
- `SOCKET_URL`: Server URL (default: http://localhost:3001)

#### Expected Results

**Good Performance:**
- ✅ Average latency: <50ms
- ✅ P95 latency: <100ms
- ✅ Connection success rate: >95%
- ✅ Message delivery rate: >95%

**Acceptable Performance:**
- ⚠️ Average latency: 50-100ms
- ⚠️ P95 latency: 100-200ms
- ⚠️ Connection success rate: 90-95%

**Needs Optimization:**
- ❌ Average latency: >100ms
- ❌ P95 latency: >200ms
- ❌ Connection success rate: <90%

### Manual WebSocket Testing

#### Using Browser DevTools

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Monitor WebSocket frames
5. Check ping/pong messages (should be ~15 seconds apart)

#### Using wscat (CLI tool)

Install wscat:
```bash
npm install -g wscat
```

Connect to server:
```bash
wscat -c ws://localhost:3001
```

---

## Database Query Testing

### Enable Query Logging

Edit `database/db.cjs` to enable verbose mode:

```javascript
const db = new Database(dbPath, {
  verbose: console.log  // Logs all SQL queries
});
```

### Test Index Performance

Run `EXPLAIN QUERY PLAN` in SQLite to verify indexes are being used:

```bash
sqlite3 data/kanban.db
```

```sql
-- Test chat message query (should use idx_chat_messages_timestamp)
EXPLAIN QUERY PLAN
SELECT id, user, message, user_color, timestamp
FROM chat_messages
ORDER BY timestamp DESC
LIMIT 50;

-- Expected output should include: "USING INDEX idx_chat_messages_timestamp"
```

### Verify Migrations

Check that performance indexes were created:

```sql
-- List all indexes
SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index';

-- Should include:
-- idx_chat_messages_timestamp
-- idx_user_colors_user
-- idx_chat_messages_session
```

### Benchmark Queries

Create a test script to measure query performance:

```javascript
const dbManager = require('./database/db.cjs');

console.time('getRecentMessages');
const messages = await dbManager.db.all(
  'SELECT * FROM chat_messages ORDER BY timestamp DESC LIMIT 50'
);
console.timeEnd('getRecentMessages');
// Should be <10ms with indexes
```

### Verify Color Cache

Check logs for cache hits:

```bash
# Start server and watch logs
npm run dev:server

# Look for:
# "Preloaded N user colors into cache"
# Cache hits should not query database
```

---

## CRT Effects Performance

### Browser DevTools Performance Panel

#### Chrome/Edge DevTools

1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record (●)
4. Interact with the app for 10 seconds
5. Stop recording
6. Analyze results:
   - **FPS**: Should be ≥60 FPS (look for green bars)
   - **Frame rendering time**: Should be <16ms (60 FPS)
   - **Layout shifts**: Should be minimal (green CLS score)

#### Firefox DevTools

1. Open DevTools (F12)
2. Go to Performance tab
3. Start recording
4. Use the app with CRT effects enabled
5. Stop and analyze:
   - Look for long tasks (>50ms)
   - Check for layout thrashing
   - Verify GPU acceleration (compositing)

#### Safari Web Inspector

1. Open Web Inspector (⌘⌥I)
2. Go to Timelines tab
3. Record page activity
4. Check:
   - Rendering time
   - Paint frequency
   - Composite layers

### FPS Counter

Enable FPS counter in Chrome:

1. DevTools → ⋮ (menu) → More tools → Rendering
2. Check "Frame Rendering Stats"
3. FPS counter appears in top-right corner
4. Target: 60 FPS

### Reduced Motion Testing

Test accessibility feature:

**macOS:**
```
System Preferences → Accessibility → Display → Reduce motion
```

**Windows:**
```
Settings → Ease of Access → Display → Show animations
```

**Browser Override (Chrome):**
```
DevTools → ⋮ → More tools → Rendering → Emulate CSS media feature prefers-reduced-motion
```

Verify that animations are disabled when reduced motion is enabled.

### Performance Comparison

Test CRT effects at different intensity levels:

1. **Low Intensity**: Should achieve 60 FPS on all devices
2. **Medium Intensity**: Should achieve 60 FPS on modern devices
3. **High Intensity**: May drop to 45-50 FPS on older devices

Use the browser detection utility:

```javascript
import { getBrowserInfo, getOptimalCRTIntensity } from './utils/browserDetection';

const info = getBrowserInfo();
console.log('Optimal intensity:', getOptimalCRTIntensity(info));
```

---

## Cross-Browser Testing

### Supported Browsers

Test on the following browsers (latest 2 versions):

- ✅ Chrome (v120+)
- ✅ Firefox (v120+)
- ✅ Safari (v17+)
- ✅ Edge (v120+)

### Manual Testing Checklist

#### Visual Rendering
- [ ] CRT effects render correctly
- [ ] Scanlines are visible and animated
- [ ] Text glow/phosphor effect works
- [ ] Vignette overlay appears
- [ ] No visual glitches or artifacts

#### WebSocket Functionality
- [ ] Chat messages send/receive correctly
- [ ] Connection status updates properly
- [ ] Reconnection works after disconnect
- [ ] No console errors related to WebSocket

#### Performance
- [ ] Page loads in <2 seconds
- [ ] Animations run smoothly (≥30 FPS)
- [ ] No significant lag during typing
- [ ] Scrolling is smooth

#### Accessibility
- [ ] Reduced motion preference is respected
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility (basic)

### BrowserStack Testing (Optional)

For comprehensive testing across devices:

1. Sign up for BrowserStack (free tier available)
2. Test on:
   - Desktop: Chrome, Firefox, Safari, Edge
   - Mobile: iOS Safari, Android Chrome
3. Run through manual checklist on each platform

### Feature Detection Script

Run the browser capability check:

```javascript
import { logBrowserCapabilities } from './utils/browserDetection';

logBrowserCapabilities();
```

Expected output:
```
Browser Capabilities
  Browser: chrome
  Mobile: false
  Backdrop Filter Support: true
  WebGL Support: true
  Prefers Reduced Motion: false
  Device Pixel Ratio: 2
  Optimal CRT Intensity: medium
```

### Known Browser Differences

**Safari:**
- CSS filter performance is slower than Chrome
- Recommended intensity: medium (not high)
- Backdrop-filter requires `-webkit-` prefix

**Firefox:**
- `backdrop-filter` requires flag in versions <103
- Generally good performance with animations

**Mobile Browsers:**
- Automatically downgrade to low intensity
- Touch events work correctly
- Performance varies by device

---

## End-to-End Performance Testing

### Load Testing Workflow

1. **Baseline Test** (before changes)
   ```bash
   npm run test:perf:websocket:light
   ```
   Record metrics for comparison

2. **Deploy Changes**
   - Apply optimizations
   - Restart server

3. **Retest**
   ```bash
   npm run test:perf:websocket:light
   ```
   Compare with baseline

4. **Stress Test**
   ```bash
   npm run test:perf:websocket:heavy
   ```
   Verify system handles load

### Lighthouse Audit

Run Google Lighthouse for comprehensive metrics:

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
4. Run audit
5. Target scores:
   - Performance: ≥80
   - Accessibility: ≥90
   - Best Practices: ≥90

### Core Web Vitals

Monitor these metrics:

- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms
- **CLS (Cumulative Layout Shift)**: <0.1

### Production Monitoring

Set up monitoring for production:

1. **Application Performance Monitoring (APM)**
   - NewRelic, DataDog, or similar
   - Track WebSocket connections
   - Monitor database query times

2. **Real User Monitoring (RUM)**
   - Track actual user performance
   - Identify slow devices/browsers
   - Monitor error rates

3. **Server Metrics**
   - CPU usage
   - Memory usage
   - Network throughput
   - Active connections

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Acceptable | Needs Work |
|--------|--------|------------|------------|
| WebSocket Latency (avg) | <50ms | 50-100ms | >100ms |
| WebSocket Latency (P95) | <100ms | 100-200ms | >200ms |
| Database Query Time | <5ms | 5-10ms | >10ms |
| CRT Effects FPS | 60 FPS | 45-60 FPS | <45 FPS |
| Page Load Time | <2s | 2-3s | >3s |
| Connection Success Rate | >99% | 95-99% | <95% |

### Regression Testing

Run performance tests before each deployment:

```bash
# Quick smoke test
npm run test:perf:websocket:light

# If passing, run full test
npm run test:perf:websocket
```

Set up CI/CD to run these automatically on pull requests.

---

## Troubleshooting

### WebSocket Tests Failing

**Problem:** High latency or connection failures

**Solutions:**
1. Check server is running (`npm run dev:server`)
2. Verify no firewall blocking connections
3. Reduce concurrent connections
4. Check server logs for errors

### Database Queries Slow

**Problem:** Queries taking >10ms

**Solutions:**
1. Verify indexes were created (check migrations)
2. Run `VACUUM` on database
3. Check for N+1 query patterns
4. Verify color cache is working

### Low FPS on CRT Effects

**Problem:** Frame rate below 30 FPS

**Solutions:**
1. Reduce CRT effect intensity
2. Check GPU acceleration is enabled
3. Test on different browser
4. Verify `will-change` and `transform: translateZ(0)` are applied
5. Enable reduced motion mode

### Cross-Browser Issues

**Problem:** Features not working in specific browser

**Solutions:**
1. Check browser console for errors
2. Verify feature detection is working
3. Test with fallbacks enabled
4. Update browser to latest version

---

## Next Steps

After completing performance testing:

1. ✅ Document baseline metrics
2. ✅ Set up monitoring in production
3. ✅ Create performance budget
4. ✅ Schedule regular performance audits
5. ✅ Set up automated regression testing

---

## Additional Resources

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [Socket.IO Performance Tips](https://socket.io/docs/v4/performance-tuning/)
- [SQLite Performance](https://www.sqlite.org/speed.html)
- [CSS Animation Performance](https://web.dev/animations-guide/)
