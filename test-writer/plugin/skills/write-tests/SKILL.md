---
name: write-tests
description: Write the missing tests for a pull request, run them, and open a pull request with only the tests. Use when a pull request changes behaviour without tests, or when someone asks for tests.
---

# Write the missing tests

The turn starts with a line naming the pull request, like
`GitHub pull request acme/app#42 https://github.com/acme/app/pull/42`.

## 1. Decide whether to act

Stop with one line saying why if the pull request is closed, a draft, from a
bot, or changes only docs, config, lockfiles or generated code — unless a
comment asked you directly.

## 2. Check out the change

```
git clone --filter=blob:none https://x-access-token:$GITHUB_TOKEN@github.com/<owner>/<repo>.git
cd <repo> && git fetch origin pull/<number>/head:pr && git checkout pr
git diff --merge-base origin/<base>...pr
```

Reuse an existing clone and fetch instead.

## 3. Learn how this repository tests

Find the framework, where tests live, how they are named, and the command
that runs them (CONTRIBUTING.md, the Makefile, package.json, CI workflows).
Read two or three existing tests near the changed code and copy their style.
Run the existing suite for the touched package once, so you know it passes
before you start.

## 4. List what is untested

For each changed function or branch, ask: which behaviour did this add or
change, and does any test exercise it? Use `references/what-to-test.md` to
decide what is worth a test. Write the list down; it is the comment's core.

## 5. Write and prove each test

For each item: write the test, run it, and make it pass against the pull
request's code. Then break the behaviour on purpose (invert the condition,
return early) and confirm the test fails; restore the code. A test that
passes either way tests nothing — rewrite or drop it.

## 6. Publish

Commit only test files to a branch `tests/pr-<number>` off the pull
request's head, push it, and open a pull request into the pull request's
branch titled `Tests for #<number>`, listing each test and what it guards.

## 7. Reply

```
Added <n> tests in #<new pr>:
- `<test name>` — <the behaviour it guards>

Not covered: <anything you could not test, and why>
```

With nothing missing: `The behaviour this changes is already covered by <tests>.`
