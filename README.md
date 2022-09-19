# Maven Coordinates Check

## Extract Maven Coordinates from a String

Assume string input in the form `my.Org.Id:my-artifact-id:[?packaging]:version` or `my.Org.Id:my-artifact-id:version:[?packaging]`, and then extract coordinates according to the type:

```ts
{
  groupId: string;
  artifactId: string;
  version?: string;
  packaging?: Packaging;
}
```

## Research

### General Links

<https://books.sonatype.com/mvnex-book/reference/simple-project-sect-simple-core.html#:~:text=Maven%20coordinates>

- this link suggests coords in form `groupId:artifactId:packaging:version`
- I accounted for `groupId:artifactId:version:packaging` too but it may not be necessary

<https://maven.apache.org/ref/3.8.6/maven-core/artifact-handlers.html>

- this link mentions a classifier, which supposedly can be: sources, javadoc, client, tests and <https://maven.apache.org/pom.html#dependencies> suggests it is appended to artifact name just after version - will ignore this as not important for now.

<https://stackoverflow.com/questions/48858179/regex-pattern-to-parse-maven-coordinates>

- this link has for particular use case: `[groupId]:[artifactId]:[type]:[?optional_field]:[version]:[compile]` which I am ignoring for now as it seems custom

### Naming Conventions

<https://maven.apache.org/guides/mini/guide-naming-conventions.html> and <https://docs.oracle.com/javase/specs/jls/se6/html/packages.html#7.7>

- Group ID - single names not incorrect but now hard to get
- Reversed domain name, e.g. sun.com -> com.sun
- Most likely with '.' and letters/numbers

<https://maven.apache.org/maven-conventions.html#artifact-naming>

- Artifact ID naming is lowercase letters, digits, and hyphens only
- Also the artifact ID may or may not overlap the group ID.

### Packaging Types

<https://maven.apache.org/pom.html#packaging>

- packaging types: pom, jar, maven-plugin, ejb, war, ear, rar
