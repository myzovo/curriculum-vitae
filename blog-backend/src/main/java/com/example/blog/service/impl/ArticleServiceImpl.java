package com.example.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blog.entity.Article;
import com.example.blog.mapper.ArticleMapper;
import com.example.blog.service.IArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;

@Service
public class ArticleServiceImpl implements IArticleService {
	@Autowired
	private ArticleMapper articleMapper;

	// 注：原实现引用了 ArticleCacheService（缓存相关），该类在当前工作集未提供。
	// 为保证可编译运行，已移除对缓存服务的依赖。后续如添加缓存实现，可恢复相关调用。

	@Override
	public Article create(Article article) {
		if (article == null) throw new IllegalArgumentException("article is null");
		article.setCreatedAt(LocalDateTime.now());
		article.setUpdatedAt(LocalDateTime.now());
		if (article.getViews() == null) article.setViews(0);
		articleMapper.insert(article);
		return article;
	}

	@Override
	public Article update(Article article) {
		if (article == null || article.getId() == null) throw new IllegalArgumentException("article or id is null");
		article.setUpdatedAt(LocalDateTime.now());
		int rows = articleMapper.updateById(article);
		if (rows > 0) {
			return articleMapper.selectById(article.getId());
		}
		return null;
	}

	@Override
	public void delete(Long id) {
		if (id == null) return;
		articleMapper.deleteById(id);
	}

	@Override
	public Article getById(Long id) {
		return articleMapper.selectById(id);
	}

	@Override
	public Page<Article> page(int pageNum, int pageSize) {
		Page<Article> page = new Page<>(pageNum, pageSize);
		QueryWrapper<Article> qw = new QueryWrapper<>();
		qw.eq("deleted", 0).orderByDesc("is_top", "created_at");
		return articleMapper.selectPage(page, qw);
	}

	@Override
	public Page<Article> pageByCategory(int pageNum, int pageSize, Long categoryId) {
		Page<Article> page = new Page<>(pageNum, pageSize);
		QueryWrapper<Article> qw = new QueryWrapper<>();
		qw.eq("deleted", 0);
		if (categoryId != null) qw.eq("category_id", categoryId);
		qw.orderByDesc("is_top", "created_at");
		return articleMapper.selectPage(page, qw);
	}

	@Override
	@Transactional
	public boolean updateById(Article article) {
		if (article == null || article.getId() == null) return false;
		int rows = articleMapper.updateById(article);
		if (rows > 0) {
			return true;
		}
		return false;
	}

	@Override
	@Transactional
	public boolean removeById(Long id) {
		if (id == null) return false;
		int rows = articleMapper.deleteById(id);
		if (rows > 0) {
			return true;
		}
		return false;
	}
}
