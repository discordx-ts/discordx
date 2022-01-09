import { DReqeuest } from "../classes/DRequest.js";
import { MetadataStorage } from "../../logic/metadata.js";
import { MethodDecoratorEx } from "@discordx/internal";
import { RequestType } from "../../index.js";

function RequestMethod(method: RequestType, path: string | RegExp) {
  return function <T>(target: Record<string, T>, key: string) {
    MetadataStorage.instance.addRequest(
      DReqeuest.create({
        name: key,
        path: path,
        type: method,
      }).decorate(target.constructor, key, target[key])
    );
  };
}

export function Get(path: string | RegExp): MethodDecoratorEx {
  return RequestMethod("GET", path);
}

export function Post(path: string | RegExp): MethodDecoratorEx {
  return RequestMethod("POST", path);
}

export function All(path: string | RegExp): MethodDecoratorEx {
  return RequestMethod("ALL", path);
}

export function Delete(path: string | RegExp): MethodDecoratorEx {
  return RequestMethod("DELETE", path);
}

export function Head(path: string | RegExp): MethodDecoratorEx {
  return RequestMethod("HEAD", path);
}

export function Link(path: string | RegExp): MethodDecoratorEx {
  return RequestMethod("LINK", path);
}

export function Unlink(path: string | RegExp): MethodDecoratorEx {
  return RequestMethod("UNLINK", path);
}

export function Options(path: string | RegExp): MethodDecoratorEx {
  return RequestMethod("OPTIONS", path);
}
