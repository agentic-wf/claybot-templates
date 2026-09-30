# Common root causes

- **Missing value**: null/undefined/None from an optional field, an empty
  query result, or a failed lookup that was not checked.
- **Wrong assumption about input**: format, type, size, encoding, timezone.
- **Contract change**: a caller or a dependency changed what it sends or returns.
- **State race**: two requests or goroutines touching the same record.
- **Resource**: timeout, connection pool exhausted, out of memory, rate limit.
- **Config**: missing env var, wrong feature flag, secret rotated.
- **Data**: a record that violates what the code expects (legacy rows, bad import).

Name the class, then the specific instance. "Missing value" alone is not a
root cause; "`order.coupon` is null for orders created before the coupons
migration" is.
