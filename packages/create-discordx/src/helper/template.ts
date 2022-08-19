import axios from "axios";
import { Readable, Stream } from "stream";
import tar from "tar";
import { promisify } from "util";

/**
 * Get templates list from https://github.com/discordx-ts/templates
 *
 * @returns
 */
export async function GetTemplates(): Promise<
  { title: string; value: string }[]
> {
  const response = await axios
    .get<{ name: string; path: string; type: string }[]>(
      "https://api.github.com/repos/discordx-ts/templates/contents"
    )
    .then((res) =>
      res.data
        .filter((row) => row.type === "dir" && /^[0-9].+/.test(row.name))
        .map((row) => ({ title: row.name, value: row.path }))
    )
    .catch(() => []);

  return response;
}

/**
 * Check if the template exists on GitHub
 *
 * @param name template name
 * @returns
 */
export async function IsTemplateExist(name: string): Promise<boolean> {
  const response = await axios
    .get(
      `https://api.github.com/repos/discordx-ts/templates/contents/${name}?ref=main`
    )
    .then(() => true)
    .catch(() => false);

  return response;
}

/**
 * Download and extract template
 *
 * @param root project path
 * @param name project name
 * @returns
 */
export async function DownloadAndExtractTemplate(
  root: string,
  name: string
): Promise<void> {
  const pipeline = promisify(Stream.pipeline);

  const request = await axios({
    responseType: "stream",
    url: "https://codeload.github.com/discordx-ts/templates/tar.gz/main",
  });

  return pipeline(
    Readable.from(request.data),
    tar.extract({ cwd: root, strip: 2 }, [`templates-main/${name}`])
  );
}
