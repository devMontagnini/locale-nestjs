import { NestInterceptor, CallHandler, Injectable, ExecutionContext, Inject } from "@nestjs/common";
import { Observable } from "rxjs";
import { LocaleService } from "./locale.service";
import { LOCALE_SERVICE_TOKEN } from "./constants";

@Injectable()
export class LocaleInterceptor implements NestInterceptor {

  constructor(
    @Inject(LOCALE_SERVICE_TOKEN)
    private readonly localeService: LocaleService
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const acceptsLanguagues = context.switchToHttp().getRequest().acceptsLanguages();
    this.localeService.defineLanguage(acceptsLanguagues);
    return next.handle();
  }
}