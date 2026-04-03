import { google } from "googleapis";
import Gallery, { type Work } from "./_components/Gallery";

async function getWorks(): Promise<Work[]> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!email || !privateKey || !folderId || folderId === "your_folder_id_here") {
    return [
      { id: 1, title: "Project One",   src: "https://placehold.co/1920x1080/111111/eeeeee" },
      { id: 2, title: "Project Two",   src: "https://placehold.co/1920x1080/222222/eeeeee" },
      { id: 3, title: "Project Three", src: "https://placehold.co/1920x1080/333333/eeeeee" },
    ];
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id, name)",
    orderBy: "name",
    pageSize: 10,
  });

  const files = res.data.files ?? [];

  return files.map((file, index) => ({
    id: index + 1,
    title: (file.name ?? "Untitled")
      .replace(/\.[^/.]+$/, "")         // strip extension
      .replace(/[-_]/g, " ")            // hyphens/underscores → spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()), // Title Case
    src: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`,
  }));
}

export default async function Home() {
  const works = await getWorks();
  return <Gallery works={works} />;
}
