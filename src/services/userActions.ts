// Interfaces
interface CertificationParams {
  title: string;
  uid: string;
  description: string;
  cert_level: string;
  earned_on: string;
  expires_on: string;
  ce_hours_required: number;
  ce_hours_completed: number;
}

interface UpdateCertificationParams {
  certification_id: number;
  earned_on: string;
  expires_on: string;
  ce_hours_required: number;
  ce_hours_completed: number;
}

// GET
export async function getUserProfileData() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const res = await fetch(
      "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/user",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to get user profile data ${res.statusText}`);
    }

    const userData = await res.json();
    return userData;
  } catch (error) {
    console.error("Error getting user profile data", error);
  }
}

// GET
export async function getUserCertifications() {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/certifications",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch certifications: ${res.statusText}`);
  }

  return res.json();
}

// POST
export async function addCertification(params: CertificationParams) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(
      "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/certifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding certification:", error);
    throw error;
  }
}

// PUT
export async function updateUserCertification({
  certification_id,
  earned_on,
  expires_on,
  ce_hours_required,
  ce_hours_completed,
}: UpdateCertificationParams) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/certifications",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
      body: JSON.stringify({
        user_cert_id: certification_id,
        earned_on,
        expires_on,
        ce_hours_required,
        ce_hours_completed,
      }),
    }
  );

  const data = await res.json();
  console.log("response data:", data);

  if (!res.ok) {
    throw new Error(`Failed to update certification: ${res.statusText}`);
  }

  return data;
}

// GET
export async function handleCertificationSearch(
  params: Record<string, string>
) {
  const searchParams = new URLSearchParams(params);

  const res = await fetch(
    `https://learn.microsoft.com/api/catalog/?${searchParams.toString()}`
  );

  if (!res.ok) {
    throw new Error("Failed to complete Microsoft Learn fetch");
  }

  const data = await res.json();
  return data;
}
