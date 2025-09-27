import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header"; // Adjust the import path as needed

// Mock the useSignout hook
vi.mock("../services/auth", () => ({
  useSignout: vi.fn(),
}));

// Import the mocked hook for type safety
import { useSignout } from "../services/auth";
const mockedUseSignout = vi.mocked(useSignout);

describe("Header", () => {
  const mockSetUser = vi.fn();
  const mockSignout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseSignout.mockReturnValue(mockSignout);
  });

  it("renders the logo/brand correctly", () => {
    render(<Header user={null} setUser={mockSetUser} />);

    expect(screen.getByText("S.B")).toBeInTheDocument();
  });

  it("does not show user info when user is null", () => {
    render(<Header user={null} setUser={mockSetUser} />);

    expect(screen.queryByText(/Hello/)).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
  });

  it("shows user greeting and sign out button when user is provided", () => {
    const testUser = { username: "testuser" };

    render(<Header user={testUser} setUser={mockSetUser} />);

    expect(screen.getByText("Hello testuser")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("calls signout function when sign out button is clicked", () => {
    const testUser = { username: "johndoe" };

    render(<Header user={testUser} setUser={mockSetUser} />);

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    expect(mockSignout).toHaveBeenCalledTimes(1);
  });

  it("passes setUser to useSignout hook", () => {
    render(<Header user={null} setUser={mockSetUser} />);

    expect(mockedUseSignout).toHaveBeenCalledWith(mockSetUser);
  });
});
