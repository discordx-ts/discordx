import type { IncomingHttpHeaders, IncomingMessage } from "http";
import { request, STATUS_CODES } from "http";
import { URL } from "url";

export enum RequestType {
  DELETE = "DELETE",
  GET = "GET",
  PATCH = "PATCH",
  POST = "POST",
}

export class HTTPError extends Error {
  public method: string;
  public statusCode: number;
  public headers: IncomingHttpHeaders;
  public path: string;

  get statusMessage(): string {
    return STATUS_CODES[this.statusCode] ?? "Unknown";
  }

  constructor(httpMessage: IncomingMessage, method: string, url: URL) {
    const statusCode = httpMessage.statusCode ?? 520;
    const errorMessage = STATUS_CODES[statusCode] ?? "Unknown";
    super(`${String(statusCode)} ${errorMessage}`);

    this.statusCode = statusCode;
    this.headers = httpMessage.headers;
    this.name = this.constructor.name;
    this.path = url.toString();
    this.method = method;
  }
}

export class HttpClient {
  constructor(
    public base: string,
    public password: string,
  ) {
    //
  }

  public async request<T = any>(
    method: RequestType,
    url: URL,
    data?: Buffer,
  ): Promise<T> {
    const message = await this.sendRequest(method, url, data);

    if (message.statusCode && ![200, 204].includes(message.statusCode)) {
      throw new HTTPError(message, method, url);
    }

    const responseData = await this.collectResponseData(message);
    return this.parseResponseData(responseData) as Promise<T>;
  }

  private sendRequest(
    method: RequestType,
    url: URL,
    data?: Buffer,
  ): Promise<IncomingMessage> {
    return new Promise<IncomingMessage>((resolve, reject) => {
      const req = request(
        {
          headers: {
            Accept: "application/json",
            Authorization: this.password,
            "Content-Type": "application/json",
          },
          hostname: url.hostname,
          method,
          path: url.pathname + url.search,
          port: url.port,
          protocol: url.protocol,
        },
        resolve,
      );

      req.on("error", reject);

      if (data) {
        req.write(data);
      }

      req.end();
    });
  }

  private collectResponseData(message: IncomingMessage): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      message.on("data", (chunk) => {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      });

      message.once("error", reject);
      message.once("end", () => {
        message.removeAllListeners();
        resolve(Buffer.concat(chunks));
      });
    });
  }

  private parseResponseData(data: Buffer) {
    if (data.length === 0) {
      return null;
    }

    try {
      return JSON.parse(data.toString());
    } catch {
      return data.toString();
    }
  }

  public url(input: string): URL {
    return new URL(input, this.base);
  }
}
