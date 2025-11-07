import "dotenv/config";
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { useContainer } from "class-validator";
import { json, urlencoded } from "express";
import { AppModule } from "./app.module";
import validationOptions from "./utils/validation-options";
import { AllConfigType } from "./config/config.type";
import { ResolvePromisesInterceptor } from "./utils/serializer.interceptor";
import { WrapResponseDataInterceptor } from "./utils/interceptors/wrap-response-data.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true,
    bodyParser: false, // Disable default body parser to configure custom limits
  });
  
  // Increase body size limit for base64 image uploads (50MB)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow("app.apiPrefix", { infer: true }),
    {
      exclude: ["/"],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
    new WrapResponseDataInterceptor(),
  );

  // Enable CORS for any origin
  app.enableCors({
    origin: "*",
  });

  const options = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API docs")
    .setVersion("1.0")
    .addBearerAuth()
    .addGlobalParameters({
      in: "header",
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || "x-custom-lang",
      schema: {
        example: "en",
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);

  await app.listen(configService.getOrThrow("app.port", { infer: true }));
}
void bootstrap();
