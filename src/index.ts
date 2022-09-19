import * as semver from '@snyk/maven-semver';

import type { MavenCoords, Packaging } from './types';

export const splitCoordinate = (coordinate: string): Partial<MavenCoords> => {
  // assume coords only in the forms:
  // "my.Org.Id:my-artifact-id:[?packaging]:version" or "my.Org.Id:my-artifact-id:version:[?packaging]"
  // which may be unnecessary (perhaps only the first form is needed?)
  // could split on colons and then do a switch regex check on each section until we determine
  // whats needed and discard the rest?
  const coordinateMatch = coordinate.match(
    /(?<groupId>[\w.-]+):(?<artifactId>[a-z0-9-]+):(?<versionOrPackaging1>[\w.-]+):*(?<versionOrPackaging2>[\w.-]+)*/,
  );

  // return empty object
  if (!coordinateMatch || !coordinateMatch.groups) return {};

  const coordinateGroups = coordinateMatch.groups;

  const mavenCoords: Partial<MavenCoords> = {};

  mavenCoords.groupId = coordinateGroups['groupId'];
  mavenCoords.artifactId = coordinateGroups['artifactId'];

  const versionRegex = new RegExp(
    /^(?!(jar|war|ear|rar|pom|maven-plugin|ejb))[\w.-]+$/,
  );
  const packagingRegex = new RegExp(/^(jar|war|ear|rar|pom|maven-plugin|ejb)$/);

  // the following blocks can be improved or the regex moved
  // back to the main regex check in coordinateMatch
  // if only one form of input is expected etc.
  // but it works as an initial draft
  if (coordinateGroups['versionOrPackaging1']) {
    if (versionRegex.test(coordinateGroups['versionOrPackaging1'])) {
      if (semver.valid(coordinateGroups['versionOrPackaging1'])) {
        // use the parsed version from semver.valid instead?
        // TODO: see note in tests
        mavenCoords.version = coordinateGroups['versionOrPackaging1'];
      }
    } else if (packagingRegex.test(coordinateGroups['versionOrPackaging1'])) {
      mavenCoords.packaging = coordinateGroups[
        'versionOrPackaging1'
      ] as Packaging;
    }
  }

  if (coordinateGroups['versionOrPackaging2']) {
    if (versionRegex.test(coordinateGroups['versionOrPackaging2'])) {
      if (semver.valid(coordinateGroups['versionOrPackaging2'])) {
        // use the parsed version from semver.valid instead?
        // TODO: see note in tests
        mavenCoords.version = coordinateGroups['versionOrPackaging2'];
      }
      mavenCoords.version = coordinateGroups['versionOrPackaging2'];
    } else if (packagingRegex.test(coordinateGroups['versionOrPackaging2'])) {
      mavenCoords.packaging = coordinateGroups[
        'versionOrPackaging2'
      ] as Packaging;
    }
  }

  return mavenCoords;
};
