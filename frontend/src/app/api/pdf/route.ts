import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  let browser;
  try {
    const { url, cookies, selector } = await req.json();

    if (!url || !selector) {
      return NextResponse.json(
        { error: "URL and selector are required" },
        { status: 400 },
      );
    }

    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    
    // Set viewport: a high resolution ensures smooth chart rendering
    await page.setViewport({ width: 1440, height: 1080 });

    // Pass session cookies so Puppeteer can see the authenticated content
    if (cookies && typeof cookies === "string") {
      const parsedCookies = cookies.split(";").map((c) => {
        const parts = c.split("=");
        const name = parts[0].trim();
        const value = parts.slice(1).join("=").trim();
        return { name, value, url };
      });
      await page.setCookie(...parsedCookies);
    }

    // Navigate to the target page and wait for it to be stable
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Targeted Rendering: Isolate the report element and strip away the "web" UI
    await page.evaluate((targetSelector) => {
      const element = document.querySelector(targetSelector) as HTMLElement;
      if (!element) return;

      // Ensure html and body can expand
      document.documentElement.style.height = "auto";
      document.documentElement.style.overflow = "visible";
      document.body.style.height = "auto";
      document.body.style.overflow = "visible";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.background = "white";

      // 1. Force the targeted element to be visible and prominent
      element.style.display = "block";
      element.style.padding = "20px !important"; // Slight padding for PDF readability
      element.style.margin = "0 !important";
      element.style.maxWidth = "none !important";
      element.style.width = "100% !important";
      element.style.height = "auto !important";
      element.style.overflow = "visible !important";
      element.style.border = "none !important";
      element.style.boxShadow = "none !important";
      element.style.background = "white !important";

      // 2. Transverse up and hide all siblings of the element and its parents
      let current: HTMLElement | null = element;
      while (current && current !== document.body) {
        const parent: HTMLElement | null = current.parentElement;
        if (parent) {
          // Ensure parent doesn't restrict height or overflow
          parent.style.height = "auto";
          parent.style.overflow = "visible";
          parent.style.minHeight = "0";
          parent.style.padding = "0";
          parent.style.margin = "0";

          Array.from(parent.children).forEach((child) => {
            if (child !== current) {
              (child as HTMLElement).style.display = "none";
            }
          });
        }
        current = parent;
      }

      // 3. Robustly hide common global UI elements that might be outside the main tree
      const selectorsToHide = [
        "header", "nav", "aside", "footer", "button", 
        ".no-print", "[role='button']", "#filter-dropdown"
      ];
      selectorsToHide.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          (el as HTMLElement).style.display = "none";
        });
      });
    }, selector);

    // Emulate screen to ensure colors (oklch) and layout match the UI exactly
    await page.emulateMediaType("screen");

    // Wait for the re-rendering and recharts animations to fully settle
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
      displayHeaderFooter: false,
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Pawa_HR_Report.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("[PDF API] Generation failed:", error);
    if (browser) await browser.close();
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 },
    );
  }
}
