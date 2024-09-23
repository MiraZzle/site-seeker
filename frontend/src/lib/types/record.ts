type WebRecord = {
  id: number;
  url: string;
  boundaryRegExp: string;
  label: string;
  periodicity: number;
  latestExecution: {
    id: number;
    startTime: string;
    endTime: string;
    status: string;
  };
  isActive: boolean;
  tags: string[];
};
