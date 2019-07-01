const R = require('ramda')
const { expect, test } = require('@oclif/test')
const sinon = require('sinon')

const reader = require('../../src/utils/file-reader')
const Command = require('../../src/base')

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
      'hosts': ['example.com'],
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

const failureExample = {
  'services': [{ 'id': '1' }],
  'routes': [],
  'plugins': [],
  'consumers': [],
  'certificates': [],
  'snis': []
}

const invalidSchemaResponse = {
  'message': 'schema violation (host: required field missing)',
  'name': 'schema violation',
  'fields': {
    'host': 'required field missing'
  },
  'code': 2
}

const stubbedConfig = {
  'substitutions': {
    'environment_variables': {
      'enabled': true,
      'white_list': ['SERVER_PROTOCOL', 'SERVER_HOST', 'SERVER_PORT']
    }
  }
}

const clonedExample = R.clone(example)
clonedExample.routes[0].hosts = ['${SERVER_HOST}']

const axiosResponse = (data, status) => {
  return {
    data: data,
    status: status
  }
}

const axiosFailureResponse = (data, status) => {
  return {
    response: {
      data: data,
      status: status
    }
  }
}

const sandbox = sinon.createSandbox()

describe('load', () => {
  afterEach(() => {
    sandbox.restore()
  })

  test
    .stub(reader, 'read', (f) => { return JSON.stringify(example) })
    .nock('http://localhost:8001', api => api
      .post('/services', example.services[0])
      .reply(201, axiosResponse(example.services[0], 201))
      .post('/routes', example.routes[0])
      .reply(201, axiosResponse(example.routes[0], 201))
      .post('/plugins', example.plugins[0])
      .reply(201, axiosResponse(example.plugins[0], 201))
      .post('/consumers', example.consumers[0])
      .reply(201, axiosResponse(example.consumers[0], 201))
      .post('/certificates', example.certificates[0])
      .reply(201, axiosResponse(example.certificates[0], 201))
      .post('/snis', example.snis[0])
      .reply(201, axiosResponse(example.snis[0], 201))
    )
    .stdout()
    .command(['load'])
    .it('runs load successfully', (ctx) => {
      expect(ctx.stdout).to.contain('All loaded. You\'re ready to go!')
    })

  test
    .stub(reader, 'read', (f) => { return JSON.stringify(failureExample) })
    .nock('http://localhost:8001', api => api
      .post('/services', failureExample.services[0])
      .reply((url, body) => {
        return [400, axiosFailureResponse(invalidSchemaResponse, 400)]
      })
    )
    .stdout()
    .command(['load'])
    .it('runs load with only services and invalid schema', (ctx) => {
      expect(ctx.stdout).to.contain('All loaded. You\'re ready to go!')
    })

  test
    .env({ SERVER_HOST: 'example.com' })
    .stub(reader, 'read', (f) => { return JSON.stringify(clonedExample) })
    .do(() => {
      sandbox.stub(Command.prototype, 'cmdConfig').value(stubbedConfig)
    })
    .nock('http://localhost:8001', api => api
      .post('/services', example.services[0])
      .reply(201, axiosResponse(example.services[0], 201))
      .post('/routes', example.routes[0])
      .reply(201, axiosResponse(example.routes[0], 201))
      .post('/plugins', example.plugins[0])
      .reply(201, axiosResponse(example.plugins[0], 201))
      .post('/consumers', example.consumers[0])
      .reply(201, axiosResponse(example.consumers[0], 201))
      .post('/certificates', example.certificates[0])
      .reply(201, axiosResponse(example.certificates[0], 201))
      .post('/snis', example.snis[0])
      .reply(201, axiosResponse(example.snis[0], 201))
    )
    .stdout()
    .command(['load'])
    .it('runs load with env var substitution successfully', (ctx) => {
      expect(process.env.SERVER_HOST).to.equal('example.com')
      expect(ctx.stdout).to.contain('All loaded. You\'re ready to go!')
    })
})
