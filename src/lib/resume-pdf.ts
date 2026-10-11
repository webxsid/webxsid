import path from "node:path";
import PDFDocument from "pdfkit";
import { resume } from "../data/resume";

/**
 * Renders /resume.pdf at build time. One A4 column, real text, embedded
 * TrueType fonts, standard headings and no tables, icons or images, so ATS
 * parsers read it in order. Dates share a row with their title, which still
 * extracts in reading order.
 */

const FONT_DIR = path.resolve(process.cwd(), "assets/fonts");
const REGULAR = path.join(FONT_DIR, "Geist-400.ttf");
const MEDIUM = path.join(FONT_DIR, "Geist-500.ttf");

const INK = "#1b1b1a";
const MUTED = "#5d5d5a";

const MM = 72 / 25.4;
const MARGIN_X = 15 * MM;
const MARGIN_Y = 13 * MM;
const BODY = 9.6;
const LEADING = 2.6;
const BULLET_INDENT = 11;

export function renderResumePdf(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN_Y, bottom: MARGIN_Y, left: MARGIN_X, right: MARGIN_X },
      font: REGULAR,
      info: {
        Title: `${resume.name} — Résumé`,
        Author: resume.name,
        Subject: resume.headline,
        Keywords: "backend, infrastructure, developer tooling, TypeScript, NestJS, AWS, Go",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const width = doc.page.width - MARGIN_X * 2;

    const regular = (size = BODY, color = INK) =>
      doc.font(REGULAR).fontSize(size).fillColor(color);
    const medium = (size = BODY, color = INK) =>
      doc.font(MEDIUM).fontSize(size).fillColor(color);

    /** Left text with a right-aligned date on the same row. */
    const row = (left: string, rightText: string, leftFont: "regular" | "medium", size = BODY) => {
      const y = doc.y;
      (leftFont === "medium" ? medium : regular)(size, INK);
      doc.text(left, MARGIN_X, y, { width: width - 120, lineGap: LEADING });
      const after = doc.y;
      regular(size, MUTED);
      doc.text(rightText, MARGIN_X, y, { width, align: "right", lineBreak: false });
      doc.y = after;
    };

    const heading = (label: string) => {
      doc.moveDown(0.9);
      medium(10.4, INK).text(label, MARGIN_X, doc.y, { width });
      doc.moveDown(0.25);
    };

    const bullet = (text: string) => {
      const y = doc.y;
      regular(BODY, MUTED).text("•", MARGIN_X, y, { lineBreak: false });
      regular(BODY, INK).text(text, MARGIN_X + BULLET_INDENT, y, {
        width: width - BULLET_INDENT,
        lineGap: LEADING,
      });
      doc.moveDown(0.12);
    };

    // Header: name, real title plus domains, contact written out.
    medium(21, INK).text(resume.name, MARGIN_X, MARGIN_Y, { width });
    regular(10.4, MUTED).text(resume.headline, MARGIN_X, doc.y + 1, { width });
    doc.moveDown(0.45);

    const contactY = doc.y;
    let x = MARGIN_X;
    resume.contact.forEach((item, index) => {
      regular(BODY, INK);
      const textWidth = doc.widthOfString(item.text);
      doc.text(item.text, x, contactY, {
        lineBreak: false,
        link: item.href,
        underline: false,
      });
      x += textWidth;
      if (index < resume.contact.length - 1) {
        regular(BODY, MUTED);
        const sep = "   ·   ";
        doc.text(sep, x, contactY, { lineBreak: false });
        x += doc.widthOfString(sep);
      }
    });
    doc.y = contactY + BODY + 4;

    heading("Experience");
    resume.experience.forEach((entry, index) => {
      if (index > 0) doc.moveDown(0.55);
      medium(10.4, INK).text(
        entry.context ? `${entry.company}, ${entry.context}` : entry.company,
        MARGIN_X,
        doc.y,
        { width },
      );
      entry.roles.forEach((role) =>
        row(role.location ? `${role.title}, ${role.location}` : role.title, role.period, "regular"),
      );
      doc.moveDown(0.25);
      entry.bullets.forEach(bullet);
    });

    heading("Projects");
    resume.projects.forEach((project) => {
      row(`${project.name}, ${project.context}`, project.link ?? "", "medium", 10.4);
      doc.moveDown(0.25);
      project.bullets.forEach(bullet);
    });

    heading("Skills");
    resume.skills.forEach((group) => {
      const y = doc.y;
      medium(BODY, INK).text(`${group.label}:`, MARGIN_X, y, { continued: true, lineGap: LEADING });
      regular(BODY, INK).text(` ${group.items.join(", ")}`, { width, lineGap: LEADING });
      doc.moveDown(0.08);
    });

    if (resume.education.length > 0) {
      heading("Education");
      resume.education.forEach((item) =>
        row(
          `${item.degree}, ${item.school}`,
          [item.detail, item.period].filter(Boolean).join("   ·   "),
          "regular",
        ),
      );
    }

    doc.end();
  });
}
