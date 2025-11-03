# Vibe Kanban BBS - Command Quick Reference

## 📋 Command Cheat Sheet

| Command | Usage | Description |
|---------|-------|-------------|
| `HELP` | `HELP [command]` | Show all commands or help for specific command |
| `JOIN` | `JOIN <board_id>` | Join a discussion board |
| `LIST` | `LIST [boards\|posts]` | List boards or posts in current board |
| `POST` | `POST <title> [message]` | Create a new post |
| `CLEAR` | `CLEAR` | Clear terminal screen |
| `WHOAMI` | `WHOAMI` | Show user information |
| `EXIT` | `EXIT` | Leave current board |

## 🔑 Command Aliases

- `?` → `HELP`
- `COMMANDS` → `HELP`
- `QUIT` → `EXIT`

## 💡 Quick Examples

### Getting Started
```
> HELP                           # Show all commands
> LIST boards                    # See available boards
> JOIN general                   # Join a board
```

### Viewing Content
```
> LIST posts                     # View posts in current board
> LIST                           # Defaults to LIST boards
```

### Creating Posts
```
> POST "Hello World"                              # Post with title only
> POST "Bug Report" "Found an issue"              # Post with message
> POST "Feature Request" "Add dark mode please"   # Multi-word arguments
```

### Getting Help
```
> HELP                           # General help
> HELP JOIN                      # Help for JOIN command
> ?                              # Alias for HELP
```

## 📝 Syntax Rules

### Quoted Arguments
Use quotes for multi-word arguments:
```
✓ POST "Hello World"
✗ POST Hello World               # Treats "Hello" as title, "World" as message
```

### Case Insensitive
Commands work in any case:
```
> help
> HELP
> HeLp                           # All work the same
```

### Arguments
- Board IDs: Alphanumeric, hyphens, underscores
- Titles: Max 200 characters
- Messages: Max 10,000 characters

## 🎨 Output Colors

- **Green** - Success messages, prompts
- **Red** - Error messages
- **Cyan** - Informational messages
- **Yellow** - Warnings, headers
- **White** - Normal text

## ⚡ Pro Tips

1. **Use Tab Completion**: Type partial command + tab (future feature)
2. **Command History**: Arrow up/down to navigate history
3. **Quick Help**: Use `?` instead of typing `HELP`
4. **Board Context**: Prompt shows current board: `[general] >`
5. **Quotes**: Always use quotes for multi-word titles/messages

## 🚫 Common Errors

### "You must join a board first"
→ Use `JOIN <board_id>` before using `LIST posts` or `POST`

### "Invalid board ID"
→ Board IDs must be alphanumeric with hyphens/underscores only

### "Title too long"
→ Keep titles under 200 characters

### "Rate limit exceeded"
→ Wait 10 seconds before sending more commands (max 20/10s)

## 🔗 Workflow Examples

### Basic Workflow
```
1. LIST boards          # Find boards
2. JOIN general         # Join a board
3. LIST posts           # View posts
4. POST "Title" "Msg"   # Create post
```

### Quick Post
```
1. JOIN general         # Join board
2. POST "Quick note"    # Post immediately
```

### Browse Multiple Boards
```
1. LIST boards          # See all boards
2. JOIN general         # Join first board
3. LIST posts           # View posts
4. EXIT                 # Leave board
5. JOIN announcements   # Join another board
```

## 📱 Prompt Indicators

```
>                       # No active board
[general] >             # Active board: general
[dev-chat] >            # Active board: dev-chat
```

## 🎯 Keyboard Shortcuts

- **Enter** - Execute command
- **↑/↓ Arrows** - Navigate command history
- **Ctrl+C** - Cancel input (if supported)
- **Ctrl+L** - Clear screen (same as CLEAR)

## 📞 Need Help?

1. Type `HELP` for command list
2. Type `HELP <command>` for detailed help
3. Check `docs/COMMAND_SYSTEM.md` for full documentation
4. Contact admin if issues persist

## 🎨 ASCII Art Tips

Commands use authentic BBS-style ASCII art:
- Box borders: ╔═══╗ ║ └───┘
- Separators: ──────────────
- Tables: │ ┼ ─

## ⚙️ System Limits

- **Commands**: 20 per 10 seconds
- **Title**: 200 characters max
- **Message**: 10,000 characters max
- **Command Input**: 1,000 characters max
- **Board ID**: 50 characters max

---

**Welcome to Vibe Kanban BBS!** 🎮

For full documentation, see: `docs/COMMAND_SYSTEM.md`
