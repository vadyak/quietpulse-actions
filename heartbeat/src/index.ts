import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';

async function run() {
  try {
    // Get inputs
    const endpointToken = core.getInput('endpoint_token', { required: true });
    const gracePeriodMinutes = parseInt(core.getInput('grace_period_minutes', { required: false }) || '5', 10);
    const timeoutSeconds = parseInt(core.getInput('timeout_seconds', { required: false }) || '10', 10);

    // Build URL
    const baseUrl = process.env.QUIETPULSE_API_URL || 'https://quietpulse.xyz';
    const url = `${baseUrl}/ping/${endpointToken}`;

    core.info(`Pinging QuietPulse endpoint: ${url}`);
    core.info(`Grace period: ${gracePeriodMinutes} minutes, timeout: ${timeoutSeconds}s`);

    // Make request
    const response = await axios.post(url, {}, {
      timeout: timeoutSeconds * 1000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'QuietPulse-GitHub-Action/1.0',
      },
    });

    if (response.status === 200) {
      core.info('✅ Heartbeat sent successfully');
      core.setOutput('status', 'success');
      core.setOutput('message', 'Ping delivered to QuietPulse');
      core.setOutput('http_status', response.status);
      process.exit(0);
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      core.setFailed(`❌ QuietPulse ping failed: ${error.response.status} ${error.response.statusText}`);
      core.setOutput('status', 'failed');
      core.setOutput('http_status', error.response.status);
      core.setOutput('error', error.response.data);
    } else {
      core.setFailed(`❌ QuietPulse ping error: ${error.message}`);
      core.setOutput('status', 'error');
      core.setOutput('error', error.message);
    }
    process.exit(1);
  }
}

run();