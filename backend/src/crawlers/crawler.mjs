import { workerData, parentPort } from "worker_threads";
import axios from "axios";
import * as cheerio from "cheerio";
import url from "url";
import { normalizeUrl } from "../utils/normalizeUrl.mjs";

async function crawlPage(websiteRecord, executionId, pageUrl) {
  try {
    const response = await axios.get(pageUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const title = $("title").text();
    const links = $("a");
    const outgoingLinksSet = new Set();
    const outgoingLinks = [];

    $(links).each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        const absoluteUrl = normalizeUrl(url.resolve(pageUrl, href));
        if (!outgoingLinksSet.has(absoluteUrl)) {
          const linkObject = {
            url: absoluteUrl,
            skipped: !new RegExp(websiteRecord.boundaryRegExp).test(
              absoluteUrl
            ),
          };
          outgoingLinks.push(linkObject);
          outgoingLinksSet.add(absoluteUrl);
        }
      }
    });

    const crawledData = {
      executionId: executionId,
      url: pageUrl,
      crawlTime: new Date(),
      title: title,
      outgoingLinks: outgoingLinks,
    };
    console.log(crawledData);
    parentPort.postMessage({ crawledData });
    return outgoingLinks
      .filter((link) => !link.skipped)
      .map((link) => link.url);
  } catch (error) {
    console.error(`Error fetching ${pageUrl}:`, error.message);
    return [];
  }
}

(async () => {
  const { websiteRecord, execution } = workerData;
  const visited = new Set();
  const toVisit = [normalizeUrl(websiteRecord.url)];

  while (toVisit.length > 0) {
    const currentUrl = toVisit.shift();

    if (visited.has(currentUrl)) {
      continue;
    }

    visited.add(currentUrl);

    const newLinks = await crawlPage(websiteRecord, execution.id, currentUrl);
    toVisit.push(
      ...newLinks.filter(
        (link) => !visited.has(link) && !toVisit.includes(link)
      )
    );
  }

  parentPort.postMessage({ status: "completed" });
})();
