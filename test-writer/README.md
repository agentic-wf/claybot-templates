# Test writer

Reads each pull request, finds the behaviour it adds or changes that no test
exercises, and writes those tests in the repository's own framework and
style. It runs them, checks that each one fails when the behaviour it guards
is broken, then pushes a `tests/pr-<number>` branch and opens a pull request
into the original one. It never touches the code under test.

**Needs:** a `GITHUB_TOKEN` secret that can push branches and open pull
requests, and the repository's webhook pointed at the agent (Pull requests,
Issue comments). The sandbox needs the project's toolchain; say which in the
first chat if it is not obvious from the repository.
