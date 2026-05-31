// Client-only PDF/text extractor.
// Uses pdfjs-dist legacy build (no worker) to keep things simple in the browser.

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  let text = "";
  if (name.endsWith(".txt") || file.type.startsWith("text/")) {
    text = await file.text();
  } else if (name.endsWith(".pdf") || file.type === "application/pdf") {
    text = await extractPdfText(file);
  } else {
    try {
      text = await file.text();
    } catch {
      throw new Error("UNSUPPORTED_FILE");
    }
  }

  // Guard: scanned PDFs (image-based) extract no/very little text.
  if (!text || text.trim().length < 30) {
    throw new Error("PDF_TOO_SHORT");
  }
  return text;
}

async function extractPdfText(file: File): Promise<string> {
  // Lazy import to avoid pulling pdfjs into the initial bundle.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // Disable the worker; do everything on main thread (fine for single CV).
  pdfjs.GlobalWorkerOptions.workerSrc = "";

  const buf = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buf),
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
