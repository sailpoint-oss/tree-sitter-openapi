; OpenAPI JSON highlights

; OpenAPI / Swagger / Arazzo top-level and semantic keys as keyword
; OpenAPI 3.0, 3.1, 3.2, Swagger 2.0, and Arazzo 1.0.x
(pair
  key: (string) @keyword
  (#any-of? @keyword
    "\"openapi\"" "\"info\"" "\"servers\"" "\"paths\"" "\"webhooks\"" "\"components\""
    "\"arazzo\"" "\"sourceDescriptions\"" "\"workflows\""
    "\"security\"" "\"tags\"" "\"externalDocs\"" "\"jsonSchemaDialect\""
    "\"swagger\"" "\"host\"" "\"basePath\"" "\"schemes\"" "\"consumes\"" "\"produces\""
    "\"definitions\"" "\"parameters\"" "\"responses\"" "\"securityDefinitions\""))

(pair
  key: (string) @keyword
  (#any-of? @keyword "\"get\"" "\"put\"" "\"post\"" "\"delete\"" "\"patch\"" "\"options\"" "\"head\"" "\"trace\""))

(pair
  key: (string) @keyword
  (#eq? @keyword "\"$ref\""))

; Schema / JSON Schema structural keys (fragment files)
(pair
  key: (string) @keyword
  (#any-of? @keyword
    "\"type\"" "\"properties\"" "\"required\"" "\"items\"" "\"schema\""
    "\"allOf\"" "\"oneOf\"" "\"anyOf\"" "\"not\""
    "\"additionalProperties\"" "\"discriminator\""))

; Operation, parameter, response, media-type keys (fragment files)
(pair
  key: (string) @keyword
  (#any-of? @keyword
    "\"operationId\"" "\"requestBody\"" "\"callbacks\""
    "\"content\"" "\"headers\"" "\"links\"" "\"encoding\""
    "\"workflowId\"" "\"stepId\"" "\"operationPath\""
    "\"successCriteria\"" "\"onSuccess\"" "\"onFailure\""
    "\"successActions\"" "\"failureActions\""
    "\"criteria\"" "\"reference\"" "\"value\""
    "\"name\"" "\"in\""))

(pair
  key: (string) @property.definition
  (#any-of? @property.definition "\"description\"" "\"summary\"" "\"title\""))

(pair
  key: (string) @property
  (#match? @property "\"x-"))

; Value/constraint keys (fragment files)
(pair
  key: (string) @property.definition
  (#any-of? @property.definition
    "\"format\"" "\"default\"" "\"example\"" "\"examples\"" "\"enum\""
    "\"nullable\"" "\"readOnly\"" "\"writeOnly\"" "\"deprecated\""
    "\"pattern\"" "\"minimum\"" "\"maximum\"" "\"minLength\"" "\"maxLength\""
    "\"minItems\"" "\"maxItems\"" "\"exclusiveMinimum\"" "\"exclusiveMaximum\""
    "\"retryAfter\"" "\"retryLimit\"" "\"contentType\"" "\"payload\""
    "\"target\"" "\"dependsOn\"" "\"inputs\"" "\"outputs\""))

; Generic pair keys
(pair
  key: (_) @property)

(string) @string
(number) @number

[
  (null)
  (true)
  (false)
] @constant.builtin

(escape_sequence) @escape
(comment) @comment
