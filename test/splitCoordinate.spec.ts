import { splitCoordinate } from '../src';

// will get 'invalid' versions by using @snyk/maven-semver package with the way it is implemented in this repo
// because of https://github.com/snyk/maven-semver/blob/master/test/functions/valid.test.js#L14
// i.e. 'my.Org.id.v1:artifact-id-v1:blah' -> {groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', version: 'blah'}

describe('should NOT split coordinate strings and return an empty object', () => {
  it.each`
    input                                           | output
    ${''}                                           | ${{}}
    ${'my.Org.id.v1'}                               | ${{}}
    ${'my.Org.id.v1:artifact-id-v1'}                | ${{}}
    ${'my.Org.id.v1:artifact-id-v1:'}               | ${{}}
    ${'my.Org.id.v1:1.0.0-SNAPSHOT'}                | ${{}}
    ${'my.Org.id.v1:jar'}                           | ${{}}
    ${'artifact-id-v1:1.0.0-SNAPSHOT'}              | ${{}}
    ${'my.Org.id.v1:'}                              | ${{}}
    ${'my.Org.id.v1:Artifact-Id-v1:1.0.0-SNAPSHOT'} | ${{}}
    ${'my.Org.id.v1:artifact-id-v1::jar'}           | ${{}}
  `('function splitCoordinate $msg', ({ input, output }) => {
    expect(splitCoordinate(input)).toEqual(output);
  });
});

describe('should split coordinate strings and return a valid object', () => {
  it.each`
    input                                                   | output
    ${'my.Org.id.v1:artifact-id-v1:1.0.0-SNAPSHOT'}         | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', version: '1.0.0-SNAPSHOT' }}
    ${'my.Org.id.v1:artifact-id-v1:jar'}                    | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', packaging: 'jar' }}
    ${'my.Org.id.v1:artifact-id-v1:1.0.0-SNAPSHOT:jar'}     | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', packaging: 'jar', version: '1.0.0-SNAPSHOT' }}
    ${'my.Org.id.v1:artifact-id-v1:jar:1.0.0-SNAPSHOT'}     | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', packaging: 'jar', version: '1.0.0-SNAPSHOT' }}
    ${'my.Org.id.v1:artifact-id-v1:jar:1.0.0-SNAPSHOT:foo'} | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', packaging: 'jar', version: '1.0.0-SNAPSHOT' }}
    ${'my.Org.id.v1:artifact-id-v1:foo:jar'}                | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', packaging: 'jar', version: 'foo' }}
    ${'my.Org.id.v1:artifact-id-v1:jar:unknown'}            | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', packaging: 'jar', version: 'unknown' }}
    ${'my.Org.id.v1:artifact-id-v1:gzip:1.0.0-snapshot'}    | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', version: '1.0.0-snapshot' }}
    ${'my.Org.id.v1:artifact-id-v1:war:1.0.0-snapshot'}     | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', packaging: 'war', version: '1.0.0-snapshot' }}
    ${'my.Org.id.v1:artifact-id-v1:jars:1.0.0-snapshot'}    | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', version: '1.0.0-snapshot' }}
  `('function splitCoordinate $msg', ({ input, output }) => {
    expect(splitCoordinate(input)).toEqual(output);
  });
});

describe('edge cases that need looking at / code refactor / could be ok', () => {
  it.each`
    input                                        | output
    ${'my.Org.id.v1:artifact-id-v1:blah'}        | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', version: 'blah' }}
    ${'1.0.0:jar:something'}                     | ${{ groupId: '1.0.0', artifactId: 'jar', version: 'something' }}
    ${'1.0.0:1-0-0:1.0.0'}                       | ${{ groupId: '1.0.0', artifactId: '1-0-0', version: '1.0.0' }}
    ${'jar:jar:jar'}                             | ${{ groupId: 'jar', artifactId: 'jar', packaging: 'jar' }}
    ${'jar:jar:jar:jar'}                         | ${{ groupId: 'jar', artifactId: 'jar', packaging: 'jar' }}
    ${'my.Org.id.v1:artifact-id-v1:1.0.0:1.0.1'} | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', version: '1.0.1' }}
    ${'my.Org.id.v1:artifact-id-v1:jar:war'}     | ${{ groupId: 'my.Org.id.v1', artifactId: 'artifact-id-v1', packaging: 'war' }}
  `('function splitCoordinate $msg', ({ input, output }) => {
    expect(splitCoordinate(input)).toEqual(output);
  });
});
