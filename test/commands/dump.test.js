const fs = require('fs')

const { expect, test } = require('@oclif/test')

const sinon = require('sinon')

const example = {
  'services': [
    {
      'host': 'mockbin.org',
      'created_at': 1519130509,
      'connect_timeout': 60000,
      'id': '92956672-f5ea-4e9a-b096-667bf55bc40c',
      'protocol': 'http',
      'name': 'example-service',
      'read_timeout': 60000,
      'port': 80,
      'path': null,
      'updated_at': 1519130509,
      'retries': 5,
      'write_timeout': 60000
    }
  ],
  'routes': [
    {
      'id': '51e77dc2-8f3e-4afa-9d0e-0e3bbbcfd515',
      'created_at': 1422386534,
      'updated_at': 1422386534,
      'name': 'my-route',
      'protocols': ['http', 'https'],
      'methods': ['GET', 'POST'],
      'hosts': ['example.com', 'foo.test'],
      'paths': ['/foo', '/bar'],
      'https_redirect_status_code': 426,
      'regex_priority': 0,
      'strip_path': true,
      'preserve_host': false,
      'tags': ['user-level', 'low-priority'],
      'service': { 'id': 'fc73f2af-890d-4f9b-8363-af8945001f7f' }
    }
  ],
  'plugins': [
    {
      'id': 'ec1a1f6f-2aa4-4e58-93ff-b56368f19b27',
      'name': 'rate-limiting',
      'created_at': 1422386534,
      'route': null,
      'service': null,
      'consumer': null,
      'config': { 'hour': 500, 'minute': 20 },
      'run_on': 'first',
      'protocols': ['http', 'https'],
      'enabled': true,
      'tags': ['user-level', 'low-priority']
    }
  ],
  'upstreams': [
    {
      'id': '91020192-062d-416f-a275-9addeeaffaf2',
      'created_at': 1422386534,
      'name': 'my-upstream',
      'hash_on': 'none',
      'hash_fallback': 'none',
      'hash_on_cookie_path': '/',
      'slots': 10000,
      'healthchecks': {
        'active': {
          'https_verify_certificate': true,
          'unhealthy': {
            'http_statuses': [429, 404, 500, 501, 502, 503, 504, 505],
            'tcp_failures': 0,
            'timeouts': 0,
            'http_failures': 0,
            'interval': 0
          },
          'http_path': '/',
          'timeout': 1,
          'healthy': {
            'http_statuses': [200, 302],
            'interval': 0,
            'successes': 0
          },
          'https_sni': 'example.com',
          'concurrency': 10,
          'type': 'http'
        },
        'passive': {
          'unhealthy': {
            'http_failures': 0,
            'http_statuses': [429, 500, 503],
            'tcp_failures': 0,
            'timeouts': 0
          },
          'type': 'http',
          'healthy': {
            'successes': 0,
            'http_statuses': [200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308]
          }
        }
      },
      'tags': ['user-level', 'low-priority']
    }
  ],
  'consumers': [
    {
      'id': '127dfc88-ed57-45bf-b77a-a9d3a152ad31',
      'created_at': 1422386534,
      'username': 'my-username',
      'custom_id': 'my-custom-id',
      'tags': ['user-level', 'low-priority']
    }
  ],
  'certificates': [
    {
      'id': 'ce44eef5-41ed-47f6-baab-f725cecf98c7',
      'created_at': 1422386534,
      'cert': '-----BEGIN CERTIFICATE-----...',
      'key': '-----BEGIN RSA PRIVATE KEY-----...',
      'tags': ['user-level', 'low-priority']
    }
  ],
  'snis': [
    {
      'id': '7fca84d6-7d37-4a74-a7b0-93e576089a41',
      'name': 'my-sni',
      'created_at': 1422386534,
      'tags': ['user-level', 'low-priority'],
      'certificate': { 'id': 'd044b7d4-3dc2-4bbc-8e9f-6b7a69416df6' }
    }
  ]
}

const axiosResponse = (data, status) => {
  return {
    data: data,
    status: status
  }
}

const stubbedCreateWriteStream = {
  write: sinon.stub()
}

describe('dump', () => {
  test
    .stub(fs, 'createWriteStream', sinon.stub().returns(stubbedCreateWriteStream))
    .nock('http://localhost:8001', api => api
      .get('/plugins')
      .reply(200, axiosResponse(example.plugins, 200))
      .get('/consumers')
      .reply(200, axiosResponse(example.consumers, 200))
      .get('/services')
      .reply(200, axiosResponse(example.services, 200))
      .get('/routes')
      .reply(200, axiosResponse(example.routes, 200))
      .get('/upstreams')
      .reply(200, axiosResponse(example.upstreams, 200))
      .get('/certificates')
      .reply(200, axiosResponse(example.certificates, 200))
      .get('/snis')
      .reply(200, axiosResponse(example.snis, 200))
    )
    .command(['dump'])
    .it('runs dump successfully', (ctx) => {
      expect(fs.createWriteStream.called).to.equal(true)
      expect(stubbedCreateWriteStream.write.called).to.equal(true)
    })
})
