import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Update this assertion based on what actually renders in your app
    // You might need to look for different text
    expect(document.body).toBeTruthy(); // Simple test that it renders
  });
});
