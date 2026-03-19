# QuietPulse Heartbeat GitHub Action

Send heartbeat pings to [QuietPulse](https://quietpulse.xyz) to monitor your GitHub Actions cron jobs and scheduled tasks.

## Usage

Add this step to any scheduled job in your workflow:

```yaml
name: Nightly Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Every day at 2 AM

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Backup database
        run: |
          # Your backup commands here
          pg_dump ...

      - name: Send heartbeat to QuietPulse
        uses: vadyak/quietpulse-actions@v1
        with:
          endpoint_token: ${{ secrets.QUIETPULSE_ENDPOINT_TOKEN }}
```

## Setup

### 1. Create a QuietPulse account
- Go to [quietpulse.xyz](https://quietpulse.xyz) and sign up
- Create a new job (heartbeat endpoint)
- Copy the **Ping URL** (it ends with a unique token)

### 2. Add token to GitHub Secrets
In your repository settings:
- Go to **Settings → Secrets and variables → Actions**
- Create a new secret named `QUIETPULSE_ENDPOINT_TOKEN`
- Paste the token part of the URL (the last segment after `/ping/`)

Example Ping URL:
```
https://quietpulse.xyz/ping/abc123def456...
```
Secret value: `abc123def456...`

### 3. Configure alert notifications
In QuietPulse dashboard, enable **Telegram** or **Email** notifications for this job to receive alerts when the heartbeat is missed.

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `endpoint_token` | ✅ Yes | — | QuietPulse endpoint token (from job settings) |
| `grace_period_minutes` | ❌ No | `5` | Grace period before marking as missed |
| `timeout_seconds` | ❌ No | `10` | HTTP request timeout in seconds |

## Outputs

| Output | Description |
|--------|-------------|
| `status` | Result status: `success`, `failed`, or `error` |
| `http_status` | HTTP response status code |
| `message` | Success message or error details |

## Examples

### Basic usage
```yaml
- uses: vadyak/quietpulse-actions@v1
  with:
    endpoint_token: ${{ secrets.QUIETPULSE_TOKEN }}
```

### With custom grace period
```yaml
- uses: vadyak/quietpulse-actions@v1
  with:
    endpoint_token: ${{ secrets.QUIETPULSE_TOKEN }}
    grace_period_minutes: 10
```

### With timeout and step outputs
```yaml
- name: Heartbeat
  id: heartbeat
  uses: vadyak/quietpulse-actions@v1
  with:
    endpoint_token: ${{ secrets.QUIETPULSE_TOKEN }}

- name: Check result
  run: |
    if ${{ steps.heartbeat.outputs.status != 'success' }}; then
      echo "Heartbeat failed!"
      exit 1
    fi
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Endpoint not found` | Check that the token is correct and the job exists in QuietPulse |
| `403 Forbidden` | Token expired or invalid — generate a new one |
| `429 Too Many Requests` | You've exceeded the rate limit (upgrade plan) |
| Action times out | Increase `timeout_seconds` input (default 10s) |

## License

MIT
