// Proxy configuration for the Angular development server

const baseUrl = process.env.data_portal_base_url;
const basicAuth = process.env.data_portal_basic_auth;
const checkCert = !process.env.data_portal_ignore_cert;

// filter out standard headers
function filterHeaders(headers) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    // show only custom headers
    if (!/x-/.test(key)) return acc;
    acc[key] = value;
    return acc;
  }, {});
}

// log headers
function logHeaders(headers) {
  const out = [];
  for (const [key, value] of Object.entries(headers)) {
    out.push(`${key}: ${value}`);
  }
  console.log(out.join('\n'));
}

// configure proxy
function configure(proxy) {
  proxy.on('proxyReq', (proxyReq, req, res) => {
    console.log('\n', '==>', req.method, req.url);
    logHeaders(filterHeaders(proxyReq.getHeaders()));
  });
  proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log('\n', '<==', req.method, req.url);
    console.log('Status:', proxyRes.statusCode, proxyRes.statusMessage);
    logHeaders(filterHeaders(proxyRes.headers));
  });
}

let target = baseUrl || 'http://127.0.0.1';
if (!target.endswith('/')) target += '/';
const useProxy = !target.startsWith('http://127.');

const config = {};

if (useProxy) {
  console.log('Configuring proxy server...');
  config['/api'] = {
    target,
    changeOrigin: true,
    secure: checkCert,
    auth: basicAuth,
    logLevel: 'debug',
    configure,
  };
}

export default config;
