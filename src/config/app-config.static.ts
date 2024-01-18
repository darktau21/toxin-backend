import { Inject, Injectable } from '@nestjs/common';
import { AppConfigService } from './app-config.service';

@Injectable()
export class AppConfigStatic {
  private static service: AppConfigService;

  constructor(@Inject(AppConfigService) service: AppConfigService) {
    AppConfigStatic.service = service;
  }

  static getAdminAccount() {
    return this.service.getAdminAccount();
  }

  static getDb() {
    return this.service.getDb();
  }

  static getMail() {
    return this.service.getMail();
  }

  static getSecurity() {
    return this.service.getSecurity();
  }

  static getRequests() {
    return this.service.getRequests();
  }
}
