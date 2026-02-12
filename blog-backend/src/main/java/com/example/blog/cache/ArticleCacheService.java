package com.example.blog.cache;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.function.Supplier;

@Component
public class ArticleCacheService {
	@Autowired
	private StringRedisTemplate redis;
	private final ObjectMapper mapper = new ObjectMapper();

	private static final Duration DEFAULT_TTL = Duration.ofMinutes(10);

	// 通用缓存获取（支持泛型 TypeReference）
	public <T> T get(String cacheKey, Supplier<T> dbSupplier, TypeReference<T> typeRef) {
		try {
			String json = redis.opsForValue().get(cacheKey);
			if (json != null) {
				return mapper.readValue(json, typeRef);
			}
		} catch (Exception ignored) {}

		T data = dbSupplier.get();

		try {
			if (data != null) {
				redis.opsForValue().set(cacheKey, mapper.writeValueAsString(data), DEFAULT_TTL);
			}
		} catch (Exception ignored) {}

		return data;
	}

	public <T> T getDetail(Long id, Supplier<T> dbSupplier, TypeReference<T> typeRef) {
		return get("article:detail:" + id, dbSupplier, typeRef);
	}

	public <T> T getList(String listKeySuffix, Supplier<T> dbSupplier, TypeReference<T> typeRef) {
		return get("article:list:" + listKeySuffix, dbSupplier, typeRef);
	}

	// 删除某篇文章详情缓存
	public void evictArticle(Long id) {
		String key = "article:detail:" + id;
		redis.delete(key);
	}

	// 删除所有文章列表相关缓存（按前缀）
	public void evictArticleListCaches() {
		Set<String> keys = redis.keys("article:list*");
		if (keys != null && !keys.isEmpty()) {
			redis.delete(keys);
		}
	}
}
