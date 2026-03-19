# QuietPulse GitHub Actions

Reusable GitHub Actions for monitoring cron jobs and scheduled tasks with [QuietPulse](https://quietpulse.xyz).

## Actions

### 📍 Heartbeat Monitor

Sends heartbeat pings to QuietPulse to monitor your scheduled tasks. Get Telegram/Email alerts when a cron job fails or is missed.

```yaml
- uses: vadyak/quietpulse-actions/heartbeat@v1
  with:
    endpoint_token: ${{ secrets.QUIETPULSE_TOKEN }}
```

[See documentation →](./heartbeat/README.md)

---

### 🚧 More Coming Soon

- `telegram-notify` — Send custom notifications to Telegram
- `slack-alert` — Post to Slack channels
- `metrics-collector` — Gather and report job metrics

---

## Contributing

Feel free to open issues and PRs. This repository is maintained by [@vadyak](https://github.com/vadyak).

## License

MIT
