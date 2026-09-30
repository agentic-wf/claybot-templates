# Uptime watcher

Give it a list of URLs (`UPTIME_URLS`, optionally with text each body must
contain). Every 15 minutes it checks them, keeps a history in the
workspace, and reports only changes: a URL going down (after two failed
checks, so one blip is not an alert), getting slow, or recovering, with how
long it was out. Ask it "status?" at any time.

**Needs:** `UPTIME_URLS`. Connect a chat tool after Create to get reports there.
