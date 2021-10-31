export type RoutePlannerStatus =
  | RotatingIpRoutePlanner
  | NanoIpRoutePlanner
  | RotatingIpRoutePlanner;

export interface BaseRoutePlannerStatusDetails {
  failingAddresses: {
    address: string;
    failingTime: string;
    failingTimestamp: number;
  }[];
  ipBlock: {
    size: string;
    type: string;
  };
}

export interface RotatingIpRoutePlanner {
  class: "RotatingIpRoutePlanner";
  details: BaseRoutePlannerStatusDetails & {
    currentAddress: string;
    ipIndex: string;
    rotateIndex: string;
  };
}

export interface NanoIpRoutePlanner {
  class: "NanoIpRoutePlanner";
  details: BaseRoutePlannerStatusDetails & {
    currentAddressIndex: number;
  };
}

export interface RotatingNanoIpRoutePlanner {
  class: "RotatingNanoIpRoutePlanner";
  details: BaseRoutePlannerStatusDetails & {
    blockIndex: string;
    currentAddressIndex: number;
  };
}
