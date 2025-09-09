import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Header from "./Header";

// Define the User type for testing
interface User {
  username: string;
}

describe("Header Component", () => {
  const user = userEvent.setup();

  describe("Rendering", () => {
    it("renders the logo/brand correctly", () => {
      render(<Header user={null} />);

      expect(screen.getByText("S.B")).toBeInTheDocument();

      // Test that the logo has the expected styling classes
      const logo = screen.getByText("S.B");
      expect(logo).toHaveClass(
        "bg-gradient-to-r",
        "from-blue-600",
        "to-purple-600",
        "text-white",
        "font-bold"
      );
    });

    it("renders header with correct structure", () => {
      render(<Header user={null} />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(
        "bg-white",
        "shadow-sm",
        "border-b",
        "border-gray-200"
      );
    });
  });

  describe("When user is null (logged out)", () => {
    it("does not show user greeting", () => {
      render(<Header user={null} />);

      expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
    });

    it("does not show sign out button", () => {
      render(<Header user={null} />);

      expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
    });

    it("only shows the logo when no user", () => {
      render(<Header user={null} />);

      expect(screen.getByText("S.B")).toBeInTheDocument();
      expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("When user is provided (logged in)", () => {
    const mockUser: User = { username: "johndoe" };

    it("displays user greeting with username", () => {
      render(<Header user={mockUser} />);

      expect(screen.getByText("Hello johndoe")).toBeInTheDocument();
    });

    it("shows sign out button", () => {
      render(<Header user={mockUser} />);

      const signOutButton = screen.getByRole("button", { name: /sign out/i });
      expect(signOutButton).toBeInTheDocument();
    });

    it("displays both logo and user info", () => {
      render(<Header user={mockUser} />);

      expect(screen.getByText("S.B")).toBeInTheDocument();
      expect(screen.getByText("Hello johndoe")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign out/i })
      ).toBeInTheDocument();
    });

    it("applies correct styling to user greeting", () => {
      render(<Header user={mockUser} />);

      const greeting = screen.getByText("Hello johndoe");
      expect(greeting).toHaveClass("text-gray-700", "text-sm", "font-medium");
    });

    it("applies correct styling to sign out button", () => {
      render(<Header user={mockUser} />);

      const signOutButton = screen.getByRole("button", { name: /sign out/i });
      expect(signOutButton).toHaveClass(
        "text-gray-500",
        "hover:text-gray-700",
        "text-sm"
      );
    });
  });

  describe("Different usernames", () => {
    it("handles username with spaces", () => {
      const userWithSpaces: User = { username: "John Doe" };
      render(<Header user={userWithSpaces} />);

      expect(screen.getByText("Hello John Doe")).toBeInTheDocument();
    });

    it("handles long username", () => {
      const userWithLongName: User = {
        username: "verylongusernamethatmightcausewrapping",
      };
      render(<Header user={userWithLongName} />);

      expect(
        screen.getByText("Hello verylongusernamethatmightcausewrapping")
      ).toBeInTheDocument();
    });

    it("handles username with special characters", () => {
      const userWithSpecialChars: User = { username: "user@123" };
      render(<Header user={userWithSpecialChars} />);

      expect(screen.getByText("Hello user@123")).toBeInTheDocument();
    });
  });

  describe("User interactions", () => {
    it("sign out button can be clicked (even though it does nothing yet)", async () => {
      const mockUser: User = { username: "johndoe" };
      render(<Header user={mockUser} />);

      const signOutButton = screen.getByRole("button", { name: /sign out/i });

      // Test that the button is clickable (no errors thrown)
      await user.click(signOutButton);

      // Since there's no actual onClick handler, we just verify the click doesn't break anything
      expect(signOutButton).toBeInTheDocument();
    });

    it("sign out button shows hover state styling", () => {
      const mockUser: User = { username: "johndoe" };
      render(<Header user={mockUser} />);

      const signOutButton = screen.getByRole("button", { name: /sign out/i });
      expect(signOutButton).toHaveClass("hover:text-gray-700");
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic header element", () => {
      render(<Header user={null} />);

      const header = screen.getByRole("banner");
      expect(header.tagName).toBe("HEADER");
    });

    it("sign out button is accessible when user is logged in", () => {
      const mockUser: User = { username: "johndoe" };
      render(<Header user={mockUser} />);

      const signOutButton = screen.getByRole("button", { name: /sign out/i });
      expect(signOutButton).toBeInTheDocument();
      expect(signOutButton.tagName).toBe("BUTTON");
    });

    it("user greeting is readable by screen readers", () => {
      const mockUser: User = { username: "johndoe" };
      render(<Header user={mockUser} />);

      // The greeting should be accessible as text content
      expect(screen.getByText("Hello johndoe")).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("maintains responsive layout classes", () => {
      render(<Header user={null} />);

      // Test responsive container classes
      const container = screen.getByText("S.B").closest('[class*="max-w-7xl"]');
      expect(container).toHaveClass(
        "max-w-7xl",
        "mx-auto",
        "px-4",
        "sm:px-6",
        "lg:px-8"
      );
    });

    it("maintains flex layout structure", () => {
      const mockUser: User = { username: "johndoe" };
      render(<Header user={mockUser} />);

      // The flex container with justify-between should exist
      const flexContainer = screen
        .getByText("S.B")
        .closest('[class*="flex justify-between"]');
      expect(flexContainer).toHaveClass(
        "flex",
        "justify-between",
        "items-center",
        "h-16"
      );
    });
  });

  describe("Edge cases", () => {
    it("handles switching from null to user", () => {
      const { rerender } = render(<Header user={null} />);

      // Initially no user info
      expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();

      // Add user
      const mockUser: User = { username: "johndoe" };
      rerender(<Header user={mockUser} />);

      // Now user info should appear
      expect(screen.getByText("Hello johndoe")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign out/i })
      ).toBeInTheDocument();
    });

    it("handles switching from user back to null", () => {
      const mockUser: User = { username: "johndoe" };
      const { rerender } = render(<Header user={mockUser} />);

      // Initially has user info
      expect(screen.getByText("Hello johndoe")).toBeInTheDocument();

      // Remove user
      rerender(<Header user={null} />);

      // User info should be gone
      expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("handles username changes", () => {
      const user1: User = { username: "johndoe" };
      const { rerender } = render(<Header user={user1} />);

      expect(screen.getByText("Hello johndoe")).toBeInTheDocument();

      // Change username
      const user2: User = { username: "janedoe" };
      rerender(<Header user={user2} />);

      expect(screen.queryByText("Hello johndoe")).not.toBeInTheDocument();
      expect(screen.getByText("Hello janedoe")).toBeInTheDocument();
    });
  });
});
