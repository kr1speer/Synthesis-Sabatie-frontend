import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { networkInterfaces } from "os";
import { resolve } from "path";

import mkcert from "mkcert";

const CERT_DIR = resolve(process.cwd(), "cert");
const CA_KEY = resolve(CERT_DIR, "ca.key");
const CA_CERT = resolve(CERT_DIR, "ca.crt");
const SERVER_KEY = resolve(CERT_DIR, "cert.key");
const SERVER_CERT = resolve(CERT_DIR, "cert.crt");

function localIpAddresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((address) => address && address.family === "IPv4" && !address.internal)
    .map((address) => address.address);
}

mkdirSync(CERT_DIR, { recursive: true });

let ca;
if (existsSync(CA_KEY) && existsSync(CA_CERT)) {
  ca = { key: readFileSync(CA_KEY, "utf8"), cert: readFileSync(CA_CERT, "utf8") };
  console.log("Центр сертификации уже есть: cert/ca.crt");
} else {
  ca = await mkcert.createCA({
    organization: "Sabatier Dev CA",
    countryCode: "RU",
    state: "Moscow",
    locality: "Moscow",
    validity: 365,
  });
  writeFileSync(CA_KEY, ca.key);
  writeFileSync(CA_CERT, ca.cert);
  console.log("Создан центр сертификации: cert/ca.crt");
}

const domains = ["localhost", "127.0.0.1", ...localIpAddresses()];
const serverCert = await mkcert.createCert({ ca, domains, validity: 365 });
writeFileSync(SERVER_KEY, serverCert.key);
writeFileSync(SERVER_CERT, serverCert.cert);

console.log(`Сертификат сервера cert/cert.crt выпущен для: ${domains.join(", ")}`);
