// Copyright 2018 Google Inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  protected host = this.getHost();
  protected options: any = {
    headers: {}
  };

  constructor(protected http: HttpClient) {
    this.initializeApiKey();
  }

  /**
   * Initialize the x-api-key header from cookie if it exists
   */
  private initializeApiKey() {
    const apiKey = this.getApiKeyFromCookie();
    if (apiKey) {
      this.options.headers['x-api-key'] = apiKey;
    }
  }

  /**
   * Read the x-api-key from cookies
   */
  private getApiKeyFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'x-api-key') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // Trick for detection of api domain
  protected getHost() {
    const h = window.location.hostname;
    return h === 'localhost' ? `http://${h}:8080/api` : `https://${h}/api`;
  }

  protected handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject((error.error && error.error.message) || error.message || error);
  }

  protected addContentTypeHeader() {
    this.options.headers['Content-Type'] = 'application/json';
  }

  protected removeContentTypeHeader() {
    delete this.options.headers['Content-Type'];
  }

  /**
   * Reset options effectively removing headers and parameters.
   */
  protected resetOptions() {
    this.options = {
      headers: {}
    };
  }
}
