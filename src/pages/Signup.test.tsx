import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Signup from "./Signup";

// Mock the auth service
vi.mock("../services/auth", () => ({
  signup: vi.fn(),
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

import { signup } from "../services/auth";

describe("Signup Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignup = () => {
    return render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  };

  it("renders all form fields", () => {
    renderSignup();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    renderSignup();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const bioInput = screen.getByLabelText(/bio/i);

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(usernameInput, "johndoe");
    await user.type(bioInput, "Test bio");

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
    expect(usernameInput).toHaveValue("johndoe");
    expect(bioInput).toHaveValue("Test bio");
  });

  it("updates select fields when user selects options", async () => {
    renderSignup();

    const industrySelect = screen.getByLabelText(/industry/i);
    const roleSelect = screen.getByLabelText(/role/i);

    await user.selectOptions(industrySelect, "Industry 1");
    await user.selectOptions(roleSelect, "Role 2");

    expect(industrySelect).toHaveValue("Industry 1");
    expect(roleSelect).toHaveValue("Role 2");
  });

  it("submits form with correct data when all fields are filled", async () => {
    const mockSignup = vi.mocked(signup);
    mockSignup.mockResolvedValueOnce({ success: true });

    renderSignup();

    // Fill out the form
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/username/i), "johndoe");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.selectOptions(screen.getByLabelText(/industry/i), "Industry 1");
    await user.selectOptions(screen.getByLabelText(/role/i), "Role 1");
    await user.type(screen.getByLabelText(/bio/i), "Test bio");

    // Submit form
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Verify signup was called with correct data
    expect(mockSignup).toHaveBeenCalledWith({
      first_name: "John",
      last_name: "Doe",
      username: "johndoe",
      password: "password123",
      industry: "Industry 1",
      user_role: "Role 1",
      bio: "Test bio",
    });
  });

  it("shows loading state during form submission", async () => {
    const mockSignup = vi.mocked(signup);
    // Mock a delayed response
    mockSignup.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100)
        )
    );

    renderSignup();

    // Fill required fields
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/username/i), "johndoe");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.selectOptions(screen.getByLabelText(/industry/i), "Industry 1");
    await user.selectOptions(screen.getByLabelText(/role/i), "Role 1");

    // Submit form
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Check loading state
    expect(
      screen.getByRole("button", { name: /signing up.../i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /signing up.../i })
    ).toBeDisabled();

    // Wait for form to complete
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /sign up/i })
      ).toBeInTheDocument();
    });
  });

  it("displays error message when signup fails", async () => {
    const mockSignup = vi.mocked(signup);
    mockSignup.mockRejectedValueOnce(new Error("Signup failed"));

    renderSignup();

    // Fill required fields
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/username/i), "johndoe");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.selectOptions(screen.getByLabelText(/industry/i), "Industry 1");
    await user.selectOptions(screen.getByLabelText(/role/i), "Role 1");

    // Submit form
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText(/signup failed. please try again./i)
      ).toBeInTheDocument();
    });
  });

  it("navigates to dashboard on successful signup", async () => {
    const mockSignup = vi.mocked(signup);
    mockSignup.mockResolvedValueOnce({ success: true });

    renderSignup();

    // Fill required fields
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/username/i), "johndoe");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.selectOptions(screen.getByLabelText(/industry/i), "Industry 1");
    await user.selectOptions(screen.getByLabelText(/role/i), "Role 1");

    // Submit form
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("resets form after successful signup", async () => {
    const mockSignup = vi.mocked(signup);
    mockSignup.mockResolvedValueOnce({ success: true });

    renderSignup();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const usernameInput = screen.getByLabelText(/username/i);

    // Fill form
    await user.type(firstNameInput, "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(usernameInput, "johndoe");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.selectOptions(screen.getByLabelText(/industry/i), "Industry 1");
    await user.selectOptions(screen.getByLabelText(/role/i), "Role 1");

    // Submit form
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Wait for form to reset
    await waitFor(() => {
      expect(firstNameInput).toHaveValue("");
      expect(usernameInput).toHaveValue("");
    });
  });

  it("prevents form submission when required fields are empty", async () => {
    renderSignup();

    // Try to submit without filling fields
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Verify signup was not called
    expect(signup).not.toHaveBeenCalled();
  });
});
