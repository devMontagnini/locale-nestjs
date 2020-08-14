# locale-nestjs

## Description
Locale package for NestJs

## Instalation
```npm i --save locale-nestjs```

## Quick Start

<ol>
  <li>Create a folder called 'dictionaries' on your 'src' project folder.</li>
  <li>On folder 'dictionaries' insert json files with translations, each file must have a name according to its locale (ex: en, pt-BR, etc..)</li>
  <li>Import <b>LocaleModule</b> and use <b>forRoot</b> or <b>forRootAsync</b> static methods on your <b>AppModule</b> for initial configuration <i>(see parameters for configuration on <b>LocaleConfig</b> and <b>LocaleConfigAsync</b> files)</i>. </li>
  <li>Import <b>LocaleService</b> on your service or controller and use <b>defineLanguage</b> method to define current language, and <b>translate</b> method to return the translated message.</li>
  <li>Optionally you can use <b>LocaleInterceptor</b> on your project, this interceptor defines the current language according to 'Accept-Language' header on request.</li>
</ol>