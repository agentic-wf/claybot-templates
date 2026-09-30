# Severity

| | Meaning | Examples |
|---|---|---|
| **SEV1** | Users cannot do the main thing, or data is at risk. | Site down, checkout failing, error rate > 20%, data loss or leak. |
| **SEV2** | A feature is broken or badly degraded for many users. | p95 latency 5× normal, a region down, a queue backing up. |
| **SEV3** | Degraded for some users, or a risk that will grow. | One endpoint slow, disk at 85%, elevated retries. |
| **SEV4** | No user impact yet. | Staging alerts, a flapping check, a warning threshold. |

Lower the severity for non-production environments and for alerts that
recovered on their own within five minutes. Raise it when several services
alert at once.
