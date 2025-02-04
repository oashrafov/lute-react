export const keys = {
  user: ["userLanguages"],
  predefined: ["predefinedLanguages"],

  defined: (id) => ["definedLanguage", id],

  definedFormSettings: (id) => ["definedLanguageFormSettings", id],
  predefinedFormSettings: (name) => ["predefinedLanguageFormSettings", name],

  parsers: ["languageParsers"],
  samples: (langName) => ["sampleStories", langName],
};
