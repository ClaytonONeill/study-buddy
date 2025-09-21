// export async function getInProgressCertifications() {
//   const res = await fetch(
//     "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/certifications"
//   );
// }

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

export async function addCertification() {}
