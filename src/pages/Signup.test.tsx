import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup"; // Adjust the import path as needed

// Mock the auth service
vi.mock("../services/auth", () => ({
  signup: vi.fn(),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { signup } from "../services/auth";
const mockedSignup = vi.mocked(signup);

// Helper component to wrap with router
const SignupWithRouter = ({ setUser }: { setUser: any }) => (
  <MemoryRouter>
    <Signup setUser={setUser} />
  </MemoryRouter>
);

describe("Signup", () => {
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields correctly", () => {
    render(<SignupWithRouter setUser={mockSetUser} />);

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

  it("renders form fields with correct placeholders", () => {
    render(<SignupWithRouter setUser={mockSetUser} />);

    expect(screen.getByPlaceholderText("Jane")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("yourusername")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("******************")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tell us about yourself!")
    ).toBeInTheDocument();
  });

  it("renders dropdown options correctly", () => {
    render(<SignupWithRouter setUser={mockSetUser} />);

    const industrySelect = screen.getByLabelText(/industry/i);
    const roleSelect = screen.getByLabelText(/role/i);

    expect(industrySelect).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();
    expect(screen.getByDisplayValue("Select Industry")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Select Role")).toBeInTheDocument();
  });

  it("does not show error message initially", () => {
    render(<SignupWithRouter setUser={mockSetUser} />);

    expect(screen.queryByText(/signup failed/i)).not.toBeInTheDocument();
  });

  it("shows submit button in default state", () => {
    render(<SignupWithRouter setUser={mockSetUser} />);

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass("bg-green-500");
    expect(submitButton).not.toBeDisabled();
  });

  it("updates input values when user types", () => {
    render(<SignupWithRouter setUser={mockSetUser} />);

    const firstNameInput = screen.getByLabelText(
      /first name/i
    ) as HTMLInputElement;
    const usernameInput = screen.getByLabelText(
      /username/i
    ) as HTMLInputElement;
    const bioTextarea = screen.getByLabelText(/bio/i) as HTMLTextAreaElement;

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(usernameInput, { target: { value: "johntest" } });
    fireEvent.change(bioTextarea, { target: { value: "I am a developer" } });

    expect(firstNameInput.value).toBe("John");
    expect(usernameInput.value).toBe("johntest");
    expect(bioTextarea.value).toBe("I am a developer");
  });

  it("updates select values when user selects options", () => {
    render(<SignupWithRouter setUser={mockSetUser} />);

    const industrySelect = screen.getByLabelText(
      /industry/i
    ) as HTMLSelectElement;
    const roleSelect = screen.getByLabelText(/role/i) as HTMLSelectElement;

    fireEvent.change(industrySelect, { target: { value: "Industry 2" } });
    fireEvent.change(roleSelect, { target: { value: "Role 1" } });

    expect(industrySelect.value).toBe("Industry 2");
    expect(roleSelect.value).toBe("Role 1");
  });

  it("shows loading state when form is submitted", async () => {
    mockedSignup.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<SignupWithRouter setUser={mockSetUser} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/industry/i), {
      target: { value: "Industry 1" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "Role 1" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check loading state
    expect(screen.getByText("Signing up...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveClass("bg-gray-400");

    await waitFor(() => {
      expect(mockedSignup).toHaveBeenCalled();
    });
  });

  it("calls signup service with correct data on form submission", async () => {
    mockedSignup.mockResolvedValue({ success: true });

    render(<SignupWithRouter setUser={mockSetUser} />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/industry/i), {
      target: { value: "Industry 2" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "Role 3" },
    });
    fireEvent.change(screen.getByLabelText(/bio/i), {
      target: { value: "Test bio" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockedSignup).toHaveBeenCalledWith(
        {
          first_name: "John",
          last_name: "Doe",
          username: "johndoe",
          password: "password123",
          industry: "Industry 2",
          user_role: "Role 3",
          bio: "Test bio",
        },
        mockSetUser
      );
    });
  });

  it("shows error message on signup failure", async () => {
    mockedSignup.mockRejectedValue(new Error("Signup failed"));

    render(<SignupWithRouter setUser={mockSetUser} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/industry/i), {
      target: { value: "Industry 1" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "Role 1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/signup failed. please try again/i)
      ).toBeInTheDocument();
    });

    // Check that error div has correct styling
    const errorDiv = screen.getByText(/signup failed. please try again/i);
    expect(errorDiv).toHaveClass(
      "bg-red-100",
      "border-red-400",
      "text-red-700"
    );
  });

  it("navigates to dashboard on successful signup", async () => {
    mockedSignup.mockResolvedValue({ success: true });

    render(<SignupWithRouter setUser={mockSetUser} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/industry/i), {
      target: { value: "Industry 1" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "Role 1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("resets form data on successful signup", async () => {
    mockedSignup.mockResolvedValue({ success: true });

    render(<SignupWithRouter setUser={mockSetUser} />);

    const firstNameInput = screen.getByLabelText(
      /first name/i
    ) as HTMLInputElement;
    const usernameInput = screen.getByLabelText(
      /username/i
    ) as HTMLInputElement;

    // Fill and submit form
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/industry/i), {
      target: { value: "Industry 1" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "Role 1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(firstNameInput.value).toBe("");
      expect(usernameInput.value).toBe("");
    });
  });

  it("clears error message when form is resubmitted", async () => {
    // First submission fails
    mockedSignup.mockRejectedValueOnce(new Error("Signup failed"));

    render(<SignupWithRouter setUser={mockSetUser} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/industry/i), {
      target: { value: "Industry 1" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "Role 1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/signup failed. please try again/i)
      ).toBeInTheDocument();
    });

    // Second submission succeeds
    mockedSignup.mockResolvedValue({ success: true });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Error should be cleared immediately on resubmission
    expect(
      screen.queryByText(/signup failed. please try again/i)
    ).not.toBeInTheDocument();
  });

  it("has required attributes on required fields", () => {
    render(<SignupWithRouter setUser={mockSetUser} />);

    expect(screen.getByLabelText(/first name/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/last name/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/username/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/industry/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/role/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/bio/i)).not.toHaveAttribute("required");
  });
});
