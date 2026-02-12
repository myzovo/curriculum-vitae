package com.example.blog.config;

import org.springframework.context.annotation.Configuration;

// Swagger/Knife4j (springfox) removed from dependencies due to incompatibility.
// Keep an empty configuration class so existing code that references the package still compiles.
@Configuration
public class SwaggerConfig {
    // Intentionally empty. To re-enable API docs, migrate to springdoc-openapi or add compatible springfox/knife4j versions.
}
