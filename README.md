# QuietPulse Heartbeat GitHub Action

[![GitHub Actions](https://github.com/vadyak/quietpulse-actions/actions/workflows/test.yml/badge.svg)](https://github.com/vadyak/quietpulse-actions/actions)

Send heartbeat pings to [QuietPulse](https://quietpulse.xyz) to monitor your GitHub Actions cron jobs and scheduled tasks. Get instant Telegram/Email alerts when a scheduled workflow fails or is missed.

## Usage

Add this step at the **end** of your scheduled job:

```yaml
- name: Send heartbeat to QuietPulse
  uses: vadyak/quietpulse-actions/heartbeat@v1
  with:
    endpoint_token: ${{ secrets.QUIETPULSE_TOKEN }}
    grace_period_minutes: 5
    timeout_seconds: 10
```

## Setup

### 1. Create a job in QuietPulse

- Sign up at [quietpulse.xyz](https://quietpulse.xyz)
- Create a new job → copy the **Ping URL**: `https://quietpulse.xyz/ping/abc123...`
- The token is the last segment (`abc123...`)
- Store it as a GitHub secret `QUIETPULSE_TOKEN`

### 2. Add the heartbeat step

Use `if: success()` to only ping on successful job completion.

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `endpoint_token` | ✅ | — | QuietPulse endpoint token |
| `grace_period_minutes` | ❌ | `5` | Grace period before marking as missed |
| `timeout_seconds` | ❌ | `10` | HTTP request timeout |

## Outputs

| Output | Description |
|--------|-------------|
| `status` | `success`, `failed`, or `error` |
| `http_status` | HTTP response code |
| `message` | Result message |

## Examples

### Node.js Deployment
```yaml
name: Deploy
on:
  schedule:
    - cron: '0 2 * * *'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: npm run deploy
      - name: Heartbeat
        if: success()
        uses: vadyak/quietpulse-actions/heartbeat@v1
        with:
          endpoint_token: ${{ secrets.QUIETPULSE_DEPLOY_TOKEN }}
```

### Python Script
```yaml
- name: Run data pipeline
  run: python pipeline.py
- name: Notify QuietPulse
  if: success()
  uses: vadyak/quietpulse-actions/heartbeat@v1
  with:
    endpoint_token: ${{ secrets.QUIETPULSE_PIPELINE_TOKEN }}
```

## Best Practices

- **Only ping on success** (`if: success()`) — missing ping indicates failure
- **Match interval** to cron schedule in QuietPulse job settings
- **Use separate tokens** for different workflows
- **Set appropriate grace period** (20-30% of interval for short jobs)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `404 Not Found` | Check token, create job in QuietPulse |
| `403 Forbidden` | Token invalid, regenerate |
| `429 Too Many Requests` | Rate limit, upgrade plan |
| Workflow not triggering | Validate cron syntax |

## License

MIT
