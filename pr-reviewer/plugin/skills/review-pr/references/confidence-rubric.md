# Confidence rubric

Score each candidate issue on this scale. Re-read the code for each one.

| Score | Meaning |
|---|---|
| 0 | Not confident. A false positive that fails light scrutiny, or a problem that was already there before this pull request. |
| 25 | Somewhat confident. Might be real, might not; you could not verify it. A style point no rule file asks for. |
| 50 | Moderately confident. Verified real, but a nitpick or rare in practice, and minor next to the rest of the change. |
| 75 | Highly confident. Double-checked and very likely to be hit in practice; the change as written is insufficient; or a rule file names it directly. |
| 100 | Certain. Double-checked, confirmed, and it will happen often. The evidence is in the code. |

Only issues at **80 or above** go in the comment.

For an issue flagged under a rule file, confirm the file really says it, and
quote it. A rule you remember from elsewhere does not count.
