# What deserves a test

Test, in this order:

1. **New behaviour** a user or caller can observe: a new endpoint, option,
   return value, or error.
2. **Changed conditions**: every branch the diff added or changed, including
   the error path.
3. **Edge cases the code handles on purpose**: empty input, zero, the limit,
   a missing optional field, a duplicate.
4. **The bug a fix fixes**: a regression test that fails on the old code.

Do not test:

- private helpers directly when the public function covers them;
- getters, setters, constants, logging, or framework wiring;
- behaviour of a library the code only calls.

A good test names the behaviour (`rejects an expired token`, not
`test_validate_2`), sets up only what that behaviour needs, and asserts on
the outcome rather than on how the code got there.
