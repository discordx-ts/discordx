/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
export type RoutePlannerStatus =
  | RotatingIpPlanner
  | NanoIpPlanner
  | RotatingNanoIpPlanner;

export enum RoutePlannerClass {
  NanoIp = "NanoIpRoutePlanner",
  RotatingIp = "RotatingIpRoutePlanner",
  RotatingNanoIp = "RotatingNanoIpRoutePlanner",
}

export interface FailingAddress {
  address: string;
  failingTime: string;
  failingTimestamp: number;
}

export interface IpBlock {
  size: string;
  type: string;
}

export interface BasePlannerDetails {
  failingAddresses: FailingAddress[];
  ipBlock: IpBlock;
}

export interface RotatingIpDetails extends BasePlannerDetails {
  currentAddress: string;
  ipIndex: string;
  rotateIndex: string;
}

export interface RotatingIpPlanner {
  class: RoutePlannerClass.RotatingIp;
  details: RotatingIpDetails;
}

export interface NanoIpDetails extends BasePlannerDetails {
  currentAddressIndex: number;
}

export interface NanoIpPlanner {
  class: RoutePlannerClass.NanoIp;
  details: NanoIpDetails;
}

export interface RotatingNanoIpDetails extends BasePlannerDetails {
  blockIndex: string;
  currentAddressIndex: number;
}

export interface RotatingNanoIpPlanner {
  class: RoutePlannerClass.RotatingNanoIp;
  details: RotatingNanoIpDetails;
}
