export interface MavenCoords {
  groupId: string;
  artifactId: string;
  version: string;
  packaging: Packaging;
}

export type Packaging =
  | 'jar'
  | 'war'
  | 'ear'
  | 'rar'
  | 'pom'
  | 'maven-plugin'
  | 'ejb';
