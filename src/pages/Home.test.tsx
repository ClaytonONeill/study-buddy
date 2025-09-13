import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./Home";

// Mock the auth service
vi.mock("../services/auth", () => ({
  login: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { login } from "../services/auth";

describe("Home Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHome = () => {
    return render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  };

  it("renders welcome message and form elements", () => {
    renderHome();

    expect(screen.getByText(/welcome to study buddy!/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/not a member\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /sign up here/i })
    ).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    renderHome();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("clears error when user starts typing", async () => {
    const mockLogin = vi.mocked(login);
    mockLogin.mockRejectedValueOnce(new Error("Login failed"));

    renderHome();

    // Trigger an error first
    await user.type(screen.getByLabelText(/username/i), "test");
    await user.type(screen.getByLabelText(/password/i), "pass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/invalid username or password/i)
      ).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(screen.getByLabelText(/username/i), "u");

    expect(
      screen.queryByText(/invalid username or password/i)
    ).not.toBeInTheDocument();
  });

  describe("Form Validation", () => {
    it("shows error when username is too short", async () => {
      renderHome();

      await user.type(screen.getByLabelText(/username/i), "ab");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      expect(
        screen.getByText(/username must be at least 3 characters/i)
      ).toBeInTheDocument();
      expect(login).not.toHaveBeenCalled();
    });

    it("trims whitespace from username", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockResolvedValueOnce({ success: true });

      renderHome();

      await user.type(screen.getByLabelText(/username/i), "  testuser  ");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  describe("Login Flow", () => {
    it("submits form with correct data when valid", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockResolvedValueOnce({ success: true });

      renderHome();

      await user.type(screen.getByLabelText(/username/i), "testuser");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });

    it("shows loading state during submission", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 100)
          )
      );

      renderHome();

      await user.type(screen.getByLabelText(/username/i), "testuser");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      // Check loading state
      expect(
        screen.getByRole("button", { name: /signing in.../i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /signing in.../i })
      ).toBeDisabled();

      // Wait for completion
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /sign in/i })
        ).toBeInTheDocument();
      });
    });

    it("navigates to dashboard on successful login", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockResolvedValueOnce({ success: true });

      renderHome();

      await user.type(screen.getByLabelText(/username/i), "testuser");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("clears form on successful login", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockResolvedValueOnce({ success: true });

      renderHome();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(usernameInput).toHaveValue("");
        expect(passwordInput).toHaveValue("");
      });
    });
  });

  describe("Error Handling", () => {
    it("shows error message on login failure", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockRejectedValueOnce(new Error("Login failed"));

      renderHome();

      await user.type(screen.getByLabelText(/username/i), "testuser");
      await user.type(screen.getByLabelText(/password/i), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/invalid username or password. please try again./i)
        ).toBeInTheDocument();
      });
    });

    it("clears password field on failed login", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockRejectedValueOnce(new Error("Login failed"));

      renderHome();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "wrongpassword");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(usernameInput).toHaveValue("testuser"); // Username preserved
        expect(passwordInput).toHaveValue(""); // Password cleared
      });
    });

    it("increments attempt count on failed login", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockRejectedValue(new Error("Login failed"));

      renderHome();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      // Make multiple failed attempts
      for (let i = 0; i < 3; i++) {
        await user.clear(usernameInput);
        await user.clear(passwordInput);
        await user.type(usernameInput, "testuser");
        await user.type(passwordInput, "wrongpassword");
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(/invalid username or password/i)
          ).toBeInTheDocument();
        });
      }

      expect(mockLogin).toHaveBeenCalledTimes(3);
    });
  });

  describe("Rate Limiting", () => {
    it("shows rate limit warning after max attempts", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockRejectedValue(new Error("Login failed"));

      renderHome();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      // Make 5 failed attempts to trigger rate limit
      for (let i = 0; i < 5; i++) {
        await user.clear(usernameInput);
        await user.clear(passwordInput);
        await user.type(usernameInput, "testuser");
        await user.type(passwordInput, "wrongpassword");
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(/invalid username or password/i)
          ).toBeInTheDocument();
        });
      }

      // Should show rate limit warning
      expect(
        screen.getByText(
          /account temporarily locked due to multiple failed attempts/i
        )
      ).toBeInTheDocument();
    });

    it("disables form when rate limited", async () => {
      const mockLogin = vi.mocked(login);
      mockLogin.mockRejectedValue(new Error("Login failed"));

      renderHome();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      // Trigger rate limit
      for (let i = 0; i < 5; i++) {
        await user.clear(usernameInput);
        await user.clear(passwordInput);
        await user.type(usernameInput, "testuser");
        await user.type(passwordInput, "wrongpassword");
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(/invalid username or password/i)
          ).toBeInTheDocument();
        });
      }

      // Form should be disabled
      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Navigation", () => {
    it("has working link to signup page", () => {
      renderHome();

      const signupLink = screen.getByRole("link", { name: /sign up here/i });
      expect(signupLink).toHaveAttribute("href", "/signup");
    });
  });
});
