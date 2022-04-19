import { Readable, Stream } from "stream";
import tar from "tar";
import { fetch } from "undici";
import { promisify } from "util";

/**
 * Get templates list from https://github.com/oceanroleplay/discordx-templates
 *
 * @returns
 */
export async function GetTemplates(): Promise<
  { title: string; value: string }[]
> {
  const request = await fetch(
    "https://api.github.com/repos/oceanroleplay/discordx-templates/contents"
  );
  const response = (await request.json()) as Array<{
    name: string;
    path: string;
    type: string;
  }>;

  return response
    .filter((row) => row.type === "dir" && /^[0-9].+/.test(row.name))
    .map((row) => ({ title: row.name, value: row.path }));
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

  const request = await fetch(
    "https://codeload.github.com/oceanroleplay/discordx-templates/tar.gz/main"
  );
  const readableWebStream = request.body as AsyncIterable<unknown>;

  return pipeline(
    Readable.from(readableWebStream),
    tar.extract({ cwd: root, strip: 2 }, [`discordx-templates-main/${name}`])
  );
}
