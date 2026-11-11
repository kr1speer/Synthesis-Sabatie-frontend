import { resolve } from "path";

import { generateApi } from "swagger-typescript-api";

const SWAGGER_URL =
  process.env.SABATIER_OPENAPI_URL ?? "http://127.0.0.1:8000/openapi.json";

// Кодогенерацией закрыт только домен «Материал» — это его семь методов.
// Домен «Инженер-технолог» (регистрация, вход, выход) пишется вручную
// обычным axios, как требует методичка, поэтому его пути из спецификации
// выбрасываются и в сгенерированный клиент не попадают.
const GENERATED_PATH_PREFIX = "/api/sabatier_materials";

function routeNameFromOperationId(operationId) {
  const handlerName = operationId.split("_api_")[0];

  return handlerName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

const response = await fetch(SWAGGER_URL);

if (!response.ok) {
  throw new Error(`Спецификация недоступна: ${SWAGGER_URL} — ${response.status}`);
}

const swagger = await response.json();

swagger.paths = Object.fromEntries(
  Object.entries(swagger.paths).filter(([path]) =>
    path.startsWith(GENERATED_PATH_PREFIX),
  ),
);

const methodCount = Object.values(swagger.paths).reduce(
  (count, pathItem) => count + Object.keys(pathItem).length,
  0,
);

console.log(`Генерируется методов домена «Материал»: ${methodCount}`);

await generateApi({
  fileName: "Api.ts",
  output: resolve(process.cwd(), "./src/api"),
  spec: swagger,
  httpClientType: "axios",
  moduleNameIndex: 1,
  unwrapResponseData: false,
  singleHttpClient: false,
  hooks: {
    onFormatRouteName: (routeInfo) => routeNameFromOperationId(routeInfo.operationId),
  },
});
