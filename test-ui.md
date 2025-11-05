# BBS UI Testing Guide

## Server is running on http://localhost:3001

### Test Flow:

1. **Login Screen**
   - Should see "THE DEAD NET" title
   - Should see "Where old connections never truly die..." subtitle
   - Should have bulletin board showing latest posts
   - Enter handle (username) field

2. **Modem Dial-In**
   - After login, should see modem dial-in animation
   - ASCII art logo
   - Handshake sounds (visual representation)
   - Progress bar
   - "CONNECT 56000" message

3. **Main Interface**
   - Terminal-style interface with CRT effects
   - Mode selector (DIALIN, BOARDS, RETRO, CUSTOM, XTERM)
   - CRT effects toggle
   - Chat panel on the right

4. **Test Commands** (in terminal mode):
   - `HELP` - Show available commands
   - `LIST boards` - List all message boards
   - `JOIN general` - Join a board
   - `POST "Test Post" "This is a test message"` - Create a post
   - `NEWS` - View SYSOP-13 bulletins
   - `WHOAMI` - Show current user info

5. **Chat System**
   - Real-time chat should work in the right panel
   - Messages should appear with user colors
   - Type messages and press Enter to send

## Quick Command Test:
```bash
# In another terminal, test the API:
curl http://localhost:3001/api/boards | jq
```

Open http://localhost:3001 in your browser to test!