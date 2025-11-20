import { Test, TestingModule } from '@nestjs/testing';
import { CountriesApiProvider } from '../countries/countries-api-provider';

describe('CountriesApiProvider', () => {
  let provider: CountriesApiProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountriesApiProvider],
    }).compile();

    provider = module.get<CountriesApiProvider>(CountriesApiProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
