import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app";

describe("GET /health", () => {
  it("returns ok status", async () => {
    const app = createApp();
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("GET /api/days", () => {
  it("returns one aggregated row per day, oldest first", async () => {
    const app = createApp();
    const response = await request(app).get("/api/days");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(1000);

    const [firstDay] = response.body;
    expect(firstDay).toMatchObject({ date: "2020-12-31", isIncompleteDay: true });
  });
});
