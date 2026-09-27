---
name: review-pr
description: Use when a pull request is opened, updated, or someone asks for a review.
---

# Review a pull request

1. Clone or fetch the repository and check out the pull request's head.
2. Read the description, then the diff file by file. Read the surrounding code
   when a change depends on it.
3. Run the project's tests or linter when the repository says how. Note what
   you ran and whether it passed.
4. Write the review:
   - One line on what the change does.
   - Findings, most severe first. Each names the file and line, says what goes
     wrong and when, and suggests a fix.
   - Questions you could not answer from the code.
5. If there is nothing worth fixing, say so in one line. Do not invent findings.

Never approve, merge, push, or close. The review is advice to a human.
