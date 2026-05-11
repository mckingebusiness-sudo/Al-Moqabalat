// Client-only PDF export helper using html2pdf.js
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  if (typeof window === "undefined") return;
  const mod = await import("html2pdf.js");
  const html2pdf = (mod as { default: (...args: unknown[]) => unknown }).default;
  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename.endsWith(".pdf") ? filename : `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };
  // @ts-expect-error - html2pdf chained API
  await html2pdf().set(opt).from(element).save();
}

export function downloadTextAsPdf(text: string, filename: string, dir: "ltr" | "rtl" = "ltr") {
  const wrapper = document.createElement("div");
  wrapper.dir = dir;
  wrapper.style.cssText = `
    background:#ffffff;color:#111;padding:32px;
    font-family:${dir === "rtl" ? "'Cairo','Tahoma',sans-serif" : "Georgia,serif"};
    font-size:13px;line-height:1.7;white-space:pre-wrap;width:794px;
  `;
  wrapper.textContent = text;
  document.body.appendChild(wrapper);
  return downloadElementAsPdf(wrapper, filename).finally(() => wrapper.remove());
}
