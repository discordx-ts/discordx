import type { MethodDecoratorEx } from "@discordx/internal";

import { RequestType } from "../../index.js";
import { MetadataStorage } from "../../logic/metadata.js";
import { DRequest } from "../classes/DRequest.js";

function RequestMethod(method: RequestType, path?: string | RegExp) {
  return function <T>(target: Record<string, T>, key: string) {
    MetadataStorage.instance.addRequest(
      DRequest.create({
        name: key,
        path: path ?? `/${key}`,
        type: method,
      }).decorate(target.constructor, key, target[key])
    );
  };
}

export function Get(path?: string | RegExp): MethodDecoratorEx {
  return RequestMethod(RequestType.Get, path);
}

export function Post(path?: string | RegExp): MethodDecoratorEx {
  return RequestMethod(RequestType.Post, path);
}

export function All(path?: string | RegExp): MethodDecoratorEx {
  return RequestMethod(RequestType.All, path);
}

export function Delete(path?: string | RegExp): MethodDecoratorEx {
  return RequestMethod(RequestType.Delete, path);
}

export function Head(path?: string | RegExp): MethodDecoratorEx {
  return RequestMethod(RequestType.Head, path);
}

export function Link(path?: string | RegExp): MethodDecoratorEx {
  return RequestMethod(RequestType.Link, path);
}

export function Unlink(path?: string | RegExp): MethodDecoratorEx {
  return RequestMethod(RequestType.Unlink, path);
}

export function Options(path?: string | RegExp): MethodDecoratorEx {
  return RequestMethod(RequestType.Options, path);
}
