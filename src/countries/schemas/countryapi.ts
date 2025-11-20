// interface for the API response at the top of the file
export interface RestCountriesApiResponse {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  region: string;
  subregion: string;
  capital?: string[];
  population: number;
  flags: {
    png?: string;
    svg?: string;
  };
}
