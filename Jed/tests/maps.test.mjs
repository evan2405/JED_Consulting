import { test } from "node:test";
import assert from "node:assert/strict";
import { googleMapsEmbedUrl } from "../lib/maps.js";

test("map embeds accept only Google Maps embed URLs and can be removed safely", () => {
  const map =
    "https://www.google.com/maps/embed?pb=!1m3!3m2!1m1!4s1985553742015051706";
  assert.equal(googleMapsEmbedUrl(map), map);
  for (const value of [
    undefined,
    null,
    "",
    "javascript:alert(1)",
    "https://evil.example/maps/embed?pb=x",
    "https://www.google.com.evil.example/maps/embed?pb=x",
    "http://www.google.com/maps/embed?pb=x",
    "https://www.google.com/maps?pb=x",
    "https://www.google.com/maps/embed",
    "https://user@www.google.com/maps/embed?pb=x",
  ]) {
    assert.equal(googleMapsEmbedUrl(value), null);
  }
});
