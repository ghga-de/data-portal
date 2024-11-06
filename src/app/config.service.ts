import { Injectable } from '@angular/core';

interface Config {
  mass_url: string;
  metldata_url: string;
}

declare global {
  interface Window {
    config: Config;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  #config: Config;

  constructor() {
    this.#config = window.config;
  }

  get massUrl(): string {
    return this.#config.mass_url;
  }

  get metldataUrl(): string {
    return this.#config.metldata_url;
  }
}
