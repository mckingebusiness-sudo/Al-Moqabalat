// Client-only PDF/text extractor.
// Uses pdfjs-dist legacy build (no worker) to keep things simple in the browser.

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt") || file.type.startsWith("text/")) {
    return await file.text();
  }

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    return await extractPdfText(file);
  }

  // Fallback: try to read as text
  try {
    return await file.text();
  } catch {
    throw new Error("UNSUPPORTED_FILE");
  }
}

async function extractPdfText(file: File): Promise<string> {
  // Lazy import to avoid pulling pdfjs into the initial bundle.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // Disable the worker; do everything on main thread (fine for single CV).
  // @ts-expect-error - GlobalWorkerOptions exists at runtime
  pdfjs.GlobalWorkerOptions.workerSrc = "";

  const buf = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: buf,
    disableWorker: true,
    isEvalSupported: false,
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((it: unknown) => {
        const item = it as { str?: string };
        return item.str ?? "";
      })
      .join(" ");
    pages.push(text);
  }
  return pages.join("\n\n").replace(/[ \t]+/g, " ").trim();
}
