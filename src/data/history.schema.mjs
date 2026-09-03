import { z } from "zod";
import {
  publicAssetPath,
  absoluteUrl,
  yearSchema,
  dateLabelSchema,
} from "./primitives.schema.mjs";

const monthValues = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

const dateLabelValue = (dateLabel) => {
  const [month, year] = dateLabel.split(" ");
  return new Date(Number(year), monthValues[month] - 1);
};

export const recentEditionSchema = z.object({
  year: yearSchema,
  banner: publicAssetPath,
  url: absoluteUrl,
  alt: z.string().min(1),
  dateLabel: dateLabelSchema,
});

export const earlierEditionSchema = z.object({
  year: yearSchema,
  banner: publicAssetPath,
  url: absoluteUrl,
  alt: z.string().min(1),
  description: z.string().min(1),
});

export const historySchema = z
  .object({
    recentEditions: z.array(recentEditionSchema).min(1).max(3),
    earlierEditions: z.array(earlierEditionSchema).min(1),
  })
  .superRefine((history, ctx) => {
    const seenYears = new Set();
    const seenDateLabels = new Set();

    for (const [groupName, editions] of [
      ["recentEditions", history.recentEditions],
      ["earlierEditions", history.earlierEditions],
    ]) {
      for (let i = 0; i < editions.length; i++) {
        const { year } = editions[i];

        if (seenYears.has(year)) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate year ${year} found in ${groupName}`,
            path: [groupName, i, "year"],
          });
        } else {
          seenYears.add(year);
        }

        if (i > 0 && editions[i].year >= editions[i - 1].year) {
          ctx.addIssue({
            code: "custom",
            message: `Newest edition year ${editions[i].year} should be less than previous edition year ${editions[i - 1].year} in ${groupName}`,
            path: [groupName, i, "year"],
          });
        }
      }
    }

    for (let i = 0; i < history.recentEditions.length; i++) {
      const { year, dateLabel } = history.recentEditions[i];
      const labelYear = Number(dateLabel.split(" ")[1]);

      if (year !== labelYear) {
        ctx.addIssue({
          code: "custom",
          message: `Year ${year} does not match year in date label ${dateLabel} in recentEditions`,
          path: ["recentEditions", i, "dateLabel"],
        });
      }

      if (seenDateLabels.has(dateLabel)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate date label ${dateLabel} found in recentEditions`,
          path: ["recentEditions", i, "dateLabel"],
        });
      } else {
        seenDateLabels.add(dateLabel);
      }

      if (i > 0) {
        const currentDate = dateLabelValue(dateLabel);
        const previousDate = dateLabelValue(
          history.recentEditions[i - 1].dateLabel,
        );
        if (currentDate >= previousDate) {
          ctx.addIssue({
            code: "custom",
            message: `Date label ${dateLabel} should be less than previous date label ${history.recentEditions[i - 1].dateLabel} in recentEditions`,
            path: ["recentEditions", i, "dateLabel"],
          });
        }
      }
    }
  });
