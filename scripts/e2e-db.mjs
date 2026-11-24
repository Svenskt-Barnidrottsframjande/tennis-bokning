#!/usr/bin/env node
// Throwaway Postgres for the Playwright suite — plain `docker run`, no Compose needed
// (Colima here ships the Docker CLI without the compose plugin).
//
//   node scripts/e2e-db.mjs up      → container running + healthy   (npm run db:start:e2e)
//   node scripts/e2e-db.mjs down    → remove container + its volume  (npm run db:stop:e2e)
//   node scripts/e2e-db.mjs status
//
// Connection string lives in .env.e2e. Port 54329 is deliberately unusual so it never
// collides with a local Postgres or the Supabase stacks of sibling projects (544xx–548xx).
import { spawnSync } from "node:child_process";

const NAME = "tennis-e2e-db";
const IMAGE = "postgres:17-alpine";
const PORT = 54329;

function docker(args, { quiet = false } = {}) {
  const result = spawnSync("docker", args, { encoding: "utf8" });
  if (result.error) {
    console.error("docker is not available — start Colima (`colima start`) and retry.");
    process.exit(1);
  }
  if (result.status !== 0 && !quiet) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  return result;
}

function state() {
  const r = docker(["inspect", "-f", "{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}", NAME], { quiet: true });
  if (r.status !== 0) return null;
  const [status, health] = r.stdout.trim().split(" ");
  return { status, health };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitHealthy() {
  for (let i = 0; i < 60; i++) {
    const s = state();
    if (s?.health === "healthy") return;
    if (s?.status === "exited") break;
    await sleep(1000);
  }
  console.error(`${NAME} did not become healthy — see \`docker logs ${NAME}\`.`);
  process.exit(1);
}

async function up() {
  const s = state();
  if (!s) {
    docker([
      "run", "-d", "--name", NAME,
      "-p", `127.0.0.1:${PORT}:5432`,
      "-e", "POSTGRES_USER=postgres",
      "-e", "POSTGRES_PASSWORD=postgres",
      "-e", "POSTGRES_DB=tennis",
      "--health-cmd", "pg_isready -U postgres -d tennis",
      "--health-interval", "2s",
      "--health-timeout", "2s",
      "--health-retries", "30",
      IMAGE,
    ]);
  } else if (s.status !== "running") {
    docker(["start", NAME]);
  }
  await waitHealthy();
  console.log(`${NAME} ready on 127.0.0.1:${PORT} (db "tennis", user/password postgres)`);
}

function down() {
  if (!state()) {
    console.log(`${NAME} is not running.`);
    return;
  }
  docker(["rm", "-f", "-v", NAME]);
  console.log(`${NAME} removed (volume wiped).`);
}

function status() {
  const s = state();
  console.log(s ? `${NAME}: ${s.status} (health: ${s.health})` : `${NAME}: not created`);
}

const command = process.argv[2];
if (command === "up") await up();
else if (command === "down") down();
else if (command === "status") status();
else {
  console.error("usage: node scripts/e2e-db.mjs <up|down|status>");
  process.exit(2);
}
