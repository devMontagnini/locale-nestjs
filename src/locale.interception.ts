import { NestInterceptor, CallHandler, Injectable, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { LocaleService } from "./locale.service";

@Injectable()
export class LocaleInterceptor implements NestInterceptor {

  constructor(private readonly localeService: LocaleService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const acceptsLanguagues = context.switchToHttp().getRequest().acceptsLanguages();
    this.localeService.defineLanguage(acceptsLanguagues);
    return next.handle();
  }
}