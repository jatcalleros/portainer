import { PortainerResponse } from '@/react/docker/types';
import { ContainerId } from '@/react/docker/containers/types';

export type IPConfig = {
  Subnet: string;
  Gateway: string;
  IPRange?: string;
  AuxiliaryAddresses?: Record<string, string>;
};

export type NetworkId = string;

export type NetworkOptions = Record<string, string>;

type IpamOptions = Record<string, string> | null;

export type NetworkResponseContainer = {
  EndpointID: string;
  IPv4Address: string;
  IPv6Address: string;
  MacAddress: string;
  Name: string;
};

export interface NetworkContainer extends NetworkResponseContainer {
  Id: ContainerId;
}

export type NetworkResponseContainers = Record<
  ContainerId,
  NetworkResponseContainer
>;

export interface DockerNetwork extends PortainerResponse<unknown> {
  Name: string;
  Id: NetworkId;
  Driver: string;
  Scope: string;
  Attachable: boolean;
  Internal: boolean;
  IPAM: {
    Config: IPConfig[];
    Driver: string;
    Options: IpamOptions;
  };
  Options: NetworkOptions;
  Containers: NetworkResponseContainers;
}
