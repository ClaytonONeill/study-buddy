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

// GET
export async function getUserCertifications() {
  const token = localStorage.getItem("token");
  console.log("token is: ", token);
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
  console.log("adding cert");
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
