export const DEMO_REPO_URL = "https://github.com/axios/axios";

export const DEMO_FILE_TREE = `axios/axios
├── lib/
│   ├── axios.js
│   ├── core/
│   │   ├── Axios.js
│   │   ├── AxiosError.js
│   │   ├── dispatchRequest.js
│   │   └── settle.js
│   ├── adapters/
│   │   ├── http.js
│   │   └── xhr.js
│   ├── helpers/
│   │   ├── buildURL.js
│   │   ├── mergeConfig.js
│   │   └── normalizeHeaderName.js
│   └── defaults/
│       └── index.js
├── test/
│   ├── unit/
│   └── specs/
├── package.json
├── tsconfig.json
├── rollup.config.js
└── CHANGELOG.md`;

export const DEMO_README = `# axios

[![npm version](https://img.shields.io/npm/v/axios.svg)](https://www.npmjs.com/package/axios)
[![Build Status](https://img.shields.io/github/actions/workflow/status/axios/axios/ci.yml)](https://github.com/axios/axios/actions)
[![Coverage](https://img.shields.io/coveralls/mzabriskie/axios.svg)](https://coveralls.io/r/mzabriskie/axios)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Promise-based HTTP client for the browser and Node.js with an elegant API and automatic JSON handling.

## Features

- Make XMLHttpRequests from the browser and HTTP requests from Node.js
- Supports the Promise API
- Intercept request and response
- Transform request and response data
- Cancel requests
- Automatic JSON data serialization/deserialization
- Client-side protection against XSRF

## Prerequisites

- Node.js >= 14.0 or any modern browser
- npm or yarn

## Installation

\`\`\`bash
npm install axios
\`\`\`

Or with yarn:

\`\`\`bash
yarn add axios
\`\`\`

## Usage

### GET request

\`\`\`js
import axios from 'axios';

const response = await axios.get('https://api.example.com/users/1');
console.log(response.data);
\`\`\`

### POST request

\`\`\`js
const user = await axios.post('https://api.example.com/users', {
  name: 'Alice',
  email: 'alice@example.com'
});
\`\`\`

### Request configuration

\`\`\`js
const response = await axios({
  method: 'put',
  url: 'https://api.example.com/users/1',
  data: { name: 'Bob' },
  headers: { Authorization: 'Bearer token123' },
  timeout: 5000,
});
\`\`\`

## API

### axios.get(url[, config])
### axios.post(url[, data[, config]])
### axios.put(url[, data[, config]])
### axios.delete(url[, config])

All methods return a Promise that resolves to a response object with:

| Property | Type | Description |
|----------|------|-------------|
| \`data\` | any | Response body (parsed JSON automatically) |
| \`status\` | number | HTTP status code |
| \`headers\` | object | Response headers |
| \`config\` | object | The config used for the request |

## Configuration

### Interceptors

\`\`\`js
axios.interceptors.request.use(config => {
  config.headers.Authorization = \`Bearer \${getToken()}\`;
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) logout();
    return Promise.reject(error);
  }
);
\`\`\`

### Default config

\`\`\`js
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.timeout = 10000;
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch: \`git checkout -b feature/my-feature\`
3. Run tests: \`npm test\`
4. Commit your changes: \`git commit -m 'Add my feature'\`
5. Push to the branch: \`git push origin feature/my-feature\`
6. Open a Pull Request

## License

[MIT](LICENSE)`;
