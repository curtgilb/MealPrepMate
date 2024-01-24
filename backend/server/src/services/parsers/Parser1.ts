abstract class Parser {
  // 1. Extract the data from the file and turn into an object where data properties are the keys and the values are the data.
  // 2. Convert that into a ParsedType object.
  // 3. Validate the ParsedType Object
  abstract parse<ParsedType>(inputFile: string): ParsedType;
}
