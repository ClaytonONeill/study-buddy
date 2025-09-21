export async function getInProgressCertifications() {
  const res = await fetch(
    "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/certifications"
  );
}

export async function addCertification() {}
